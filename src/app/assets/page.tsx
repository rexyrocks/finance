import { Topbar } from '@/components/layout/topbar';
import { AssetCard } from '@/components/assets/asset-card';
import { getAssets } from '@/lib/fetchers';
import { totalAssets, categoryLabel } from '@/lib/calculations';

export const dynamic = 'force-dynamic';

const CATEGORY_ORDER = [
  'STOCKS',
  'MUTUAL_FUNDS',
  'GOLD',
  'REAL_ESTATE',
  'VEHICLES',
  'BANK_ACCOUNTS',
  'RETIREMENT',
  'CASH',
  'OTHER',
];

export default async function AssetsPage() {
  const assets = await getAssets();
  const ta = totalAssets(assets);

  const grouped = CATEGORY_ORDER.map((cat) => ({
    category: cat,
    label: categoryLabel(cat),
    items: assets.filter((a) => a.category === cat),
  })).filter((g) => g.items.length > 0);

  return (
    <div className="flex-1">
      <Topbar title="Assets" subtitle={`₹${ta.toFixed(2)}L across ${assets.length} holdings`} />

      <div className="space-y-8 p-6">
        {grouped.map((group) => {
          const groupTotal = group.items.reduce((acc, a) => acc + a.currentValue, 0);
          return (
            <section key={group.category}>
              <div className="mb-3 flex items-baseline justify-between">
                <h2 className="font-display text-lg text-ink-0">{group.label}</h2>
                <span className="font-mono text-sm text-ink-200">₹{groupTotal.toFixed(2)}L</span>
              </div>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {group.items.map((asset) => (
                  <AssetCard key={asset.id} asset={asset} allocationPct={(asset.currentValue / ta) * 100} />
                ))}
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}
