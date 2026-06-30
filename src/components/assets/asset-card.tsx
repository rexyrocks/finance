import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { categoryLabel } from '@/lib/calculations';
import type { AssetDTO } from '@/types';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface AssetCardProps {
  asset: AssetDTO;
  allocationPct: number;
}

export function AssetCard({ asset, allocationPct }: AssetCardProps) {
  const gain = asset.costBasis ? asset.currentValue - asset.costBasis : null;
  const gainPct = asset.costBasis && asset.costBasis !== 0 ? (gain! / asset.costBasis) * 100 : null;

  return (
    <Card className="p-5 transition-colors hover:border-ink-600">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-ink-0">{asset.name}</p>
          <Badge tone="neutral" className="mt-1.5">
            {categoryLabel(asset.category)}
          </Badge>
        </div>
        {asset.isLiquid && <Badge tone="sapphire">Liquid</Badge>}
      </div>

      <p className="mt-4 font-mono text-2xl text-ink-0">₹{asset.currentValue.toFixed(2)}L</p>

      <div className="mt-3 flex items-center justify-between text-xs">
        <span className="flex items-center gap-1 text-ink-200">
          {gainPct === null ? (
            <Minus size={12} />
          ) : gainPct >= 0 ? (
            <TrendingUp size={12} className="text-emerald-300" />
          ) : (
            <TrendingDown size={12} className="text-coral-300" />
          )}
          {gainPct === null ? 'No cost basis set' : `${gainPct >= 0 ? '+' : ''}${gainPct.toFixed(1)}%`}
        </span>
        <span className="text-ink-200">{allocationPct.toFixed(1)}% of assets</span>
      </div>

      <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-ink-700">
        <div className="h-full rounded-full bg-gold-400" style={{ width: `${Math.min(100, allocationPct)}%` }} />
      </div>
    </Card>
  );
}
