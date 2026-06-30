import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { InsurancePolicyDTO } from '@/types';
import { ShieldCheck } from 'lucide-react';

const TYPE_LABELS: Record<string, string> = {
  TERM_LIFE: 'Term life',
  ENDOWMENT: 'Endowment',
  ACCIDENTAL: 'Accidental',
  HEALTH: 'Health',
  ULIP: 'ULIP',
  GROUP: 'Group / employer',
};

export function InsuranceCard({ policy, totalCover }: { policy: InsurancePolicyDTO; totalCover: number }) {
  const sharePct = totalCover > 0 ? (policy.sumAssured / totalCover) * 100 : 0;
  const expiry = policy.expiryDate ? new Date(policy.expiryDate) : null;

  return (
    <Card className="p-5">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-2.5">
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-gold-400/15 text-gold-300">
            <ShieldCheck size={16} />
          </span>
          <div>
            <p className="text-sm font-medium text-ink-0">{policy.provider}</p>
            <Badge tone="gold" className="mt-1">
              {TYPE_LABELS[policy.policyType] ?? policy.policyType}
            </Badge>
          </div>
        </div>
      </div>

      <p className="mt-4 font-mono text-2xl text-ink-0">₹{policy.sumAssured.toFixed(2)}L</p>
      <p className="text-xs text-ink-200">Sum assured · {sharePct.toFixed(1)}% of total cover</p>

      <div className="mt-4 grid grid-cols-2 gap-3 text-xs">
        <div>
          <p className="text-ink-200">Premium</p>
          <p className="mt-0.5 font-mono text-ink-0">
            ₹{policy.premium.toFixed(2)}L / {policy.premiumCycle}
          </p>
        </div>
        <div>
          <p className="text-ink-200">Nominee</p>
          <p className="mt-0.5 text-ink-0">{policy.nominee ?? '—'}</p>
        </div>
        <div className="col-span-2">
          <p className="text-ink-200">Expiry</p>
          <p className="mt-0.5 text-ink-0">{expiry ? expiry.toLocaleDateString('en-IN') : 'Ongoing / not set'}</p>
        </div>
      </div>

      <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-ink-700">
        <div className="h-full rounded-full bg-gold-400" style={{ width: `${Math.min(100, sharePct)}%` }} />
      </div>
    </Card>
  );
}
