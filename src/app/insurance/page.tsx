import { Topbar } from '@/components/layout/topbar';
import { InsuranceCard } from '@/components/insurance/insurance-card';
import { getPolicies } from '@/lib/fetchers';
import { totalCover } from '@/lib/calculations';

export const dynamic = 'force-dynamic';

export default async function InsurancePage() {
  const policies = await getPolicies();
  const cover = totalCover(policies);

  return (
    <div className="flex-1">
      <Topbar title="Insurance" subtitle={`₹${cover.toFixed(2)}L total sum assured across ${policies.length} policies`} />

      <div className="grid grid-cols-1 gap-4 p-6 sm:grid-cols-2 lg:grid-cols-3">
        {policies.map((policy) => (
          <InsuranceCard key={policy.id} policy={policy} totalCover={cover} />
        ))}
      </div>
    </div>
  );
}
