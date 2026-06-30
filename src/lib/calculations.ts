import type { AssetDTO, LiabilityDTO, InsurancePolicyDTO, FinancialHealthBreakdown } from '@/types';

const ASSET_CATEGORY_LABELS: Record<string, string> = {
  STOCKS: 'Stocks',
  MUTUAL_FUNDS: 'Mutual funds',
  GOLD: 'Gold',
  REAL_ESTATE: 'Real estate',
  VEHICLES: 'Vehicles',
  BANK_ACCOUNTS: 'Bank accounts',
  RETIREMENT: 'PF / NPS',
  CASH: 'Cash & reserves',
  OTHER: 'Other investments',
};

export function categoryLabel(key: string): string {
  return ASSET_CATEGORY_LABELS[key] ?? key;
}

export function sumBy<T>(items: T[], pick: (item: T) => number): number {
  return Math.round(items.reduce((acc, item) => acc + pick(item), 0) * 100) / 100;
}

export function totalAssets(assets: AssetDTO[]): number {
  return sumBy(assets, (a) => a.currentValue);
}

export function totalLiabilities(liabilities: LiabilityDTO[]): number {
  return sumBy(liabilities, (l) => l.outstanding);
}

export function totalCover(policies: InsurancePolicyDTO[]): number {
  return sumBy(policies, (p) => p.sumAssured);
}

export function netWorth(assets: AssetDTO[], liabilities: LiabilityDTO[]): number {
  return Math.round((totalAssets(assets) - totalLiabilities(liabilities)) * 100) / 100;
}

export function allocationByCategory(assets: AssetDTO[]) {
  const map = new Map<string, number>();
  for (const a of assets) {
    map.set(a.category, (map.get(a.category) ?? 0) + a.currentValue);
  }
  const total = totalAssets(assets);
  return Array.from(map.entries())
    .map(([category, value]) => ({
      category,
      label: categoryLabel(category),
      value: Math.round(value * 100) / 100,
      pct: total > 0 ? Math.round((value / total) * 1000) / 10 : 0,
    }))
    .sort((a, b) => b.value - a.value);
}

export function liquidAssetsTotal(assets: AssetDTO[]): number {
  return sumBy(
    assets.filter((a) => a.isLiquid),
    (a) => a.currentValue,
  );
}

/**
 * Financial health score, 0-100, built from six weighted components.
 * Weights and thresholds are tunable — these defaults are calibrated
 * for a salaried Indian household with a long investment horizon.
 */
export function financialHealthScore(
  assets: AssetDTO[],
  liabilities: LiabilityDTO[],
  policies: InsurancePolicyDTO[],
  annualIncome?: number,
): FinancialHealthBreakdown {
  const ta = totalAssets(assets);
  const tl = totalLiabilities(liabilities);
  const nw = ta - tl;
  const cover = totalCover(policies);
  const liquid = liquidAssetsTotal(assets);
  const allocation = allocationByCategory(assets);

  // 1. Debt-to-asset ratio — lower is better. 0% debt = 100, 60%+ debt = 0.
  const debtToAsset = ta > 0 ? (tl / ta) * 100 : 0;
  const debtScore = clamp(100 - (debtToAsset / 60) * 100, 0, 100);

  // 2. Liquidity — months of estimated annual spend covered by liquid assets.
  // Without a stated income, approximate spend as 8% of net worth/year.
  const estAnnualSpend = (annualIncome ? annualIncome * 0.5 : nw * 0.08) || 1;
  const monthsCovered = (liquid / estAnnualSpend) * 12;
  const liquidityScore = clamp((monthsCovered / 6) * 100, 0, 100); // 6 months = full score

  // 3. Insurance adequacy — sum assured vs 10x a rough income proxy, else vs net worth.
  const incomeProxy = annualIncome ?? Math.max(nw * 0.15, 12);
  const adequateCover = incomeProxy * 10;
  const insuranceScore = clamp((cover / adequateCover) * 100, 0, 100);

  // 4. Diversification — Herfindahl-based: more spread across categories scores higher.
  const hhi = allocation.reduce((acc, c) => acc + (c.pct / 100) ** 2, 0);
  const diversificationScore = clamp((1 - hhi) * 130, 0, 100);

  // 5. Real-estate concentration risk — penalize if real estate dominates.
  const rePct = allocation.find((a) => a.category === 'REAL_ESTATE')?.pct ?? 0;
  const concentrationScore = clamp(100 - Math.max(0, rePct - 40) * 1.8, 0, 100);

  // 6. High-cost debt — credit cards / short-tenure debt weighted negatively.
  const ccDebt = sumBy(
    liabilities.filter((l) => l.category === 'CREDIT_CARD'),
    (l) => l.outstanding,
  );
  const highCostScore = clamp(100 - (ccDebt / Math.max(tl * 0.05, 0.5)) * 100, 0, 100);

  const components = [
    { label: 'Debt-to-asset ratio', score: round1(debtScore), weight: 0.25, detail: `${debtToAsset.toFixed(1)}% of assets are leveraged` },
    { label: 'Liquidity buffer', score: round1(liquidityScore), weight: 0.2, detail: `~${monthsCovered.toFixed(1)} months of spend in liquid assets` },
    { label: 'Insurance adequacy', score: round1(insuranceScore), weight: 0.2, detail: `₹${cover.toFixed(2)}L cover vs ₹${adequateCover.toFixed(2)}L target` },
    { label: 'Diversification', score: round1(diversificationScore), weight: 0.15, detail: `Top category is ${allocation[0]?.label ?? 'n/a'} at ${allocation[0]?.pct ?? 0}%` },
    { label: 'Concentration risk', score: round1(concentrationScore), weight: 0.1, detail: `Real estate is ${rePct.toFixed(1)}% of assets` },
    { label: 'High-cost debt', score: round1(highCostScore), weight: 0.1, detail: `₹${ccDebt.toFixed(2)}L on credit cards` },
  ];

  const score = Math.round(components.reduce((acc, c) => acc + c.score * c.weight, 0));

  const recommendations: string[] = [];
  if (debtScore < 60) recommendations.push('Prioritize paying down high-balance loans before adding new debt — debt is above a comfortable share of assets.');
  if (liquidityScore < 60) recommendations.push('Build the emergency buffer toward 6 months of expenses in liquid instruments like FDs or liquid funds.');
  if (insuranceScore < 70) recommendations.push('Term cover looks light relative to a 10x-income benchmark — consider a pure term top-up before adding more endowment plans.');
  if (diversificationScore < 55) recommendations.push('Holdings are concentrated in few categories — consider spreading new investments into equity mutual funds or NPS.');
  if (concentrationScore < 70) recommendations.push('Real estate dominates the portfolio — future surplus could go toward more liquid, market-linked assets.');
  if (highCostScore < 70) recommendations.push('Clear revolving credit card balances first — they carry the highest effective interest rate in the portfolio.');
  if (recommendations.length === 0) recommendations.push('The portfolio is well balanced across the tracked dimensions — maintain current contribution habits.');

  return { score: clamp(score, 0, 100), components, recommendations };
}

export function debtToIncome(liabilities: LiabilityDTO[], annualIncome: number): number {
  const annualEmi = sumBy(liabilities, (l) => (l.emi ?? 0) * 12);
  return annualIncome > 0 ? Math.round((annualEmi / annualIncome) * 1000) / 10 : 0;
}

function clamp(n: number, min: number, max: number) {
  return Math.min(max, Math.max(min, n));
}

function round1(n: number) {
  return Math.round(n * 10) / 10;
}
