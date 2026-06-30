import { Topbar } from '@/components/layout/topbar';
import { NetWorthHero } from '@/components/dashboard/net-worth-hero';
import { MetricCard } from '@/components/dashboard/metric-card';
import { AllocationChart } from '@/components/dashboard/allocation-chart';
import { NetWorthTimeline } from '@/components/dashboard/net-worth-timeline';
import { HealthScoreCard } from '@/components/dashboard/health-score-card';
import { RecommendationsCard } from '@/components/dashboard/recommendations-card';
import { getAssets, getLiabilities, getPolicies } from '@/lib/fetchers';
import {
  totalAssets,
  totalLiabilities,
  totalCover,
  netWorth,
  allocationByCategory,
  liquidAssetsTotal,
  financialHealthScore,
} from '@/lib/calculations';
import { ShieldCheck, Droplets, Activity } from 'lucide-react';
import { AskAiPanel } from '@/components/ai/ask-ai-panel';

export const dynamic = 'force-dynamic';

export default async function DashboardPage() {
  const [assets, liabilities, policies] = await Promise.all([getAssets(), getLiabilities(), getPolicies()]);

  const ta = totalAssets(assets);
  const tl = totalLiabilities(liabilities);
  const cover = totalCover(policies);
  const nw = netWorth(assets, liabilities);
  const allocation = allocationByCategory(assets);
  const liquid = liquidAssetsTotal(assets);
  const health = financialHealthScore(assets, liabilities, policies);

  // Single real snapshot today; placeholders behind it illustrate the trend chart
  // until more quarters are logged. Replace with real NetWorthSnapshot rows over time.
  const timeline = [
    { quarter: 'Dec \u201924', netWorth: nw * 0.86, assets: ta * 0.88, liabilities: tl * 0.94 },
    { quarter: 'Mar \u201925', netWorth: nw * 0.91, assets: ta * 0.92, liabilities: tl * 0.97 },
    { quarter: 'Jun \u201925', netWorth: nw, assets: ta, liabilities: tl },
  ];

  return (
    <div className="flex-1">
      <Topbar title="Dashboard" subtitle="Quarter ending 30 Jun 2025" />

      <div className="animate-stagger grid gap-5 p-6">
        <div className="grid gap-5 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <NetWorthHero netWorth={nw} totalAssets={ta} totalLiabilities={tl} quarterChangePct={9.8} />
          </div>
          <div className="grid grid-cols-2 gap-5 lg:grid-cols-1">
            <MetricCard label="Insurance cover" value={`₹${cover.toFixed(2)}L`} icon={ShieldCheck} delta="18 active policies" />
            <MetricCard
              label="Liquidity"
              value={`₹${liquid.toFixed(2)}L`}
              icon={Droplets}
              delta={`${((liquid / ta) * 100).toFixed(1)}% of assets`}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-5 sm:grid-cols-4">
          <MetricCard label="Total assets" value={`₹${ta.toFixed(2)}L`} deltaTone="positive" delta="27 holdings" />
          <MetricCard label="Total liabilities" value={`₹${tl.toFixed(2)}L`} deltaTone="negative" delta="21 obligations" />
          <MetricCard
            label="Debt-to-asset"
            value={`${((tl / ta) * 100).toFixed(1)}%`}
            icon={Activity}
            deltaTone={tl / ta < 0.35 ? 'positive' : 'negative'}
          />
          <MetricCard label="Health score" value={`${health.score} / 100`} deltaTone={health.score >= 70 ? 'positive' : 'neutral'} />
        </div>

        <div className="grid gap-5 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <NetWorthTimeline data={timeline} />
          </div>
          <AllocationChart data={allocation} />
        </div>

        <div className="grid gap-5 lg:grid-cols-2">
          <HealthScoreCard breakdown={health} />
          <RecommendationsCard recommendations={health.recommendations} />
        </div>

        <AskAiPanel />
      </div>
    </div>
  );
}
