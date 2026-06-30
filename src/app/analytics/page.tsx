import { Topbar } from '@/components/layout/topbar';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { getAssets, getLiabilities, getPolicies } from '@/lib/fetchers';
import {
  totalAssets,
  totalLiabilities,
  totalCover,
  allocationByCategory,
  liquidAssetsTotal,
  financialHealthScore,
} from '@/lib/calculations';
import { AllocationTreemap } from '@/components/analytics/allocation-treemap';
import { RiskMeter } from '@/components/analytics/risk-meter';

export const dynamic = 'force-dynamic';

export default async function AnalyticsPage() {
  const [assets, liabilities, policies] = await Promise.all([getAssets(), getLiabilities(), getPolicies()]);

  const ta = totalAssets(assets);
  const tl = totalLiabilities(liabilities);
  const cover = totalCover(policies);
  const liquid = liquidAssetsTotal(assets);
  const allocation = allocationByCategory(assets);
  const health = financialHealthScore(assets, liabilities, policies);

  const debtToAssetPct = (tl / ta) * 100;
  const liquidityPct = (liquid / ta) * 100;
  const coverToNetWorth = (cover / (ta - tl)) * 100;

  return (
    <div className="flex-1">
      <Topbar title="Analytics" subtitle="Automated insights derived from current holdings" />

      <div className="space-y-5 p-6">
        <div className="grid gap-5 lg:grid-cols-3">
          <Card className="p-5">
            <p className="text-xs font-medium uppercase tracking-wide text-ink-200">Debt-to-asset ratio</p>
            <p className="mt-2 font-mono text-3xl text-ink-0">{debtToAssetPct.toFixed(1)}%</p>
            <p className="mt-1 text-xs text-ink-200">Healthy households generally stay under 35%</p>
          </Card>
          <Card className="p-5">
            <p className="text-xs font-medium uppercase tracking-wide text-ink-200">Liquidity score</p>
            <p className="mt-2 font-mono text-3xl text-ink-0">{liquidityPct.toFixed(1)}%</p>
            <p className="mt-1 text-xs text-ink-200">Share of assets that can be converted to cash quickly</p>
          </Card>
          <Card className="p-5">
            <p className="text-xs font-medium uppercase tracking-wide text-ink-200">Insurance-to-net-worth</p>
            <p className="mt-2 font-mono text-3xl text-ink-0">{coverToNetWorth.toFixed(0)}%</p>
            <p className="mt-1 text-xs text-ink-200">Cover relative to what dependents would need to replace</p>
          </Card>
        </div>

        <div className="grid gap-5 lg:grid-cols-2">
          <AllocationTreemap data={allocation} />
          <RiskMeter score={health.score} components={health.components} />
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Component-level scoring detail</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="divide-y divide-ink-700/60">
              {health.components.map((c) => (
                <div key={c.label} className="flex items-center justify-between gap-4 py-3">
                  <div>
                    <p className="text-sm text-ink-0">{c.label}</p>
                    <p className="text-xs text-ink-200">{c.detail}</p>
                  </div>
                  <span className="font-mono text-sm text-ink-0">{c.score}/100</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
