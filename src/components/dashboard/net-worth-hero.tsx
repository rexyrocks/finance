'use client';

import { AnimatedNumber } from './animated-number';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface NetWorthHeroProps {
  netWorth: number; // lakhs
  totalAssets: number;
  totalLiabilities: number;
  quarterChangePct?: number;
}

export function NetWorthHero({ netWorth, totalAssets, totalLiabilities, quarterChangePct = 0 }: NetWorthHeroProps) {
  const positive = quarterChangePct >= 0;

  return (
    <div className="relative overflow-hidden rounded-2xl border border-ink-700/60 bg-gradient-to-br from-ink-800 via-ink-800 to-ink-850 p-8 shadow-glow">
      <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-gold-400/10 blur-3xl" />
      <p className="text-sm font-medium text-ink-200">Net worth</p>
      <div className="mt-2 flex items-baseline gap-3 font-display">
        <span className="text-5xl tabular-nums text-ink-0 sm:text-6xl">
          ₹<AnimatedNumber value={netWorth} decimals={2} />
          <span className="ml-1 text-2xl text-ink-200">L</span>
        </span>
        {quarterChangePct !== 0 && (
          <Badge tone={positive ? 'emerald' : 'coral'} className="mb-1">
            {positive ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
            {Math.abs(quarterChangePct).toFixed(1)}% this quarter
          </Badge>
        )}
      </div>
      <p className="mt-1 text-sm text-ink-200">≈ ₹{(netWorth / 100).toFixed(2)} crore</p>

      <div className="mt-7 grid grid-cols-2 gap-6 border-t border-ink-700/60 pt-5 sm:grid-cols-2">
        <div>
          <p className="text-xs uppercase tracking-wide text-ink-200">Total assets</p>
          <p className="mt-1 font-mono text-xl text-emerald-300">
            ₹<AnimatedNumber value={totalAssets} decimals={2} />L
          </p>
        </div>
        <div>
          <p className="text-xs uppercase tracking-wide text-ink-200">Total liabilities</p>
          <p className="mt-1 font-mono text-xl text-coral-300">
            ₹<AnimatedNumber value={totalLiabilities} decimals={2} />L
          </p>
        </div>
      </div>
    </div>
  );
}
