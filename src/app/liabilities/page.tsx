import { Topbar } from '@/components/layout/topbar';
import { LiabilityCard } from '@/components/liabilities/liability-card';
import { getLiabilities } from '@/lib/fetchers';
import { totalLiabilities } from '@/lib/calculations';

export const dynamic = 'force-dynamic';

const CATEGORY_ORDER = ['HOME_LOAN', 'EDUCATION_LOAN', 'PERSONAL_LOAN', 'VEHICLE_LOAN', 'CREDIT_CARD', 'OTHER_DEBT'];
const CATEGORY_LABELS: Record<string, string> = {
  HOME_LOAN: 'Home loan',
  EDUCATION_LOAN: 'Education loans',
  PERSONAL_LOAN: 'Personal loans',
  VEHICLE_LOAN: 'Vehicle loan',
  CREDIT_CARD: 'Credit cards',
  OTHER_DEBT: 'Other debt',
};

export default async function LiabilitiesPage() {
  const liabilities = await getLiabilities();
  const tl = totalLiabilities(liabilities);

  const grouped = CATEGORY_ORDER.map((cat) => ({
    category: cat,
    label: CATEGORY_LABELS[cat],
    items: liabilities.filter((l) => l.category === cat),
  })).filter((g) => g.items.length > 0);

  return (
    <div className="flex-1">
      <Topbar title="Liabilities" subtitle={`₹${tl.toFixed(2)}L outstanding across ${liabilities.length} obligations`} />

      <div className="space-y-8 p-6">
        {grouped.map((group) => {
          const groupTotal = group.items.reduce((acc, l) => acc + l.outstanding, 0);
          return (
            <section key={group.category}>
              <div className="mb-3 flex items-baseline justify-between">
                <h2 className="font-display text-lg text-ink-0">{group.label}</h2>
                <span className="font-mono text-sm text-ink-200">₹{groupTotal.toFixed(2)}L</span>
              </div>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {group.items.map((liability) => (
                  <LiabilityCard key={liability.id} liability={liability} />
                ))}
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}
