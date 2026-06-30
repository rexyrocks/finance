import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import type { LucideIcon } from 'lucide-react';

interface MetricCardProps {
  label: string;
  value: string;
  delta?: string;
  deltaTone?: 'positive' | 'negative' | 'neutral';
  icon?: LucideIcon;
}

export function MetricCard({ label, value, delta, deltaTone = 'neutral', icon: Icon }: MetricCardProps) {
  return (
    <Card className="p-5">
      <div className="flex items-center justify-between">
        <p className="text-xs font-medium uppercase tracking-wide text-ink-200">{label}</p>
        {Icon && <Icon size={16} className="text-ink-200" />}
      </div>
      <p className="mt-2 font-mono text-2xl text-ink-0">{value}</p>
      {delta && (
        <p
          className={cn(
            'mt-1 text-xs font-medium',
            deltaTone === 'positive' && 'text-emerald-300',
            deltaTone === 'negative' && 'text-coral-300',
            deltaTone === 'neutral' && 'text-ink-200',
          )}
        >
          {delta}
        </p>
      )}
    </Card>
  );
}
