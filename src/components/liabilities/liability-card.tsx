import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ProgressRing } from '@/components/ui/progress-ring';
import type { LiabilityDTO } from '@/types';

const CATEGORY_LABELS: Record<string, string> = {
  HOME_LOAN: 'Home loan',
  EDUCATION_LOAN: 'Education loan',
  CREDIT_CARD: 'Credit card',
  PERSONAL_LOAN: 'Personal loan',
  VEHICLE_LOAN: 'Vehicle loan',
  OTHER_DEBT: 'Other debt',
};

export function LiabilityCard({ liability }: { liability: LiabilityDTO }) {
  const paidPct =
    liability.originalAmount && liability.originalAmount > 0
      ? ((liability.originalAmount - liability.outstanding) / liability.originalAmount) * 100
      : 0;

  return (
    <Card className="p-5">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <p className="text-sm font-medium text-ink-0">{liability.name}</p>
          <Badge tone="coral" className="mt-1.5">
            {CATEGORY_LABELS[liability.category] ?? liability.category}
          </Badge>

          <p className="mt-4 font-mono text-2xl text-ink-0">₹{liability.outstanding.toFixed(2)}L</p>
          <p className="text-xs text-ink-200">Outstanding</p>

          <div className="mt-4 grid grid-cols-2 gap-3 text-xs">
            <div>
              <p className="text-ink-200">EMI</p>
              <p className="mt-0.5 font-mono text-ink-0">{liability.emi ? `₹${liability.emi.toFixed(2)}L/mo` : '—'}</p>
            </div>
            <div>
              <p className="text-ink-200">Interest rate</p>
              <p className="mt-0.5 font-mono text-ink-0">{liability.interestRate ? `${liability.interestRate}%` : '—'}</p>
            </div>
            <div>
              <p className="text-ink-200">Remaining tenure</p>
              <p className="mt-0.5 font-mono text-ink-0">
                {liability.remainingMonths ? `${liability.remainingMonths} mo` : '—'}
              </p>
            </div>
            <div>
              <p className="text-ink-200">Original amount</p>
              <p className="mt-0.5 font-mono text-ink-0">
                {liability.originalAmount ? `₹${liability.originalAmount.toFixed(2)}L` : '—'}
              </p>
            </div>
          </div>
        </div>

        {liability.originalAmount ? (
          <ProgressRing
            percent={paidPct}
            size={72}
            strokeWidth={6}
            color="#27AD78"
            label={`${Math.round(paidPct)}%`}
            sublabel="paid"
          />
        ) : null}
      </div>
    </Card>
  );
}
