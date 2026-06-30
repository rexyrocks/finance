import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { ProgressRing } from '@/components/ui/progress-ring';
import type { FinancialHealthBreakdown } from '@/types';
import { cn } from '@/lib/utils';

function scoreColor(score: number) {
  if (score >= 75) return '#27AD78';
  if (score >= 50) return '#D4A24E';
  return '#DA5C5C';
}

export function HealthScoreCard({ breakdown }: { breakdown: FinancialHealthBreakdown }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Financial health score</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-5">
          <ProgressRing
            percent={breakdown.score}
            size={104}
            strokeWidth={9}
            color={scoreColor(breakdown.score)}
            label={`${breakdown.score}`}
            sublabel="/ 100"
          />
          <div className="flex-1 space-y-2.5">
            {breakdown.components.map((c) => (
              <div key={c.label}>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-ink-200">{c.label}</span>
                  <span className="font-mono text-ink-0">{c.score}</span>
                </div>
                <div className="mt-1 h-1.5 w-full overflow-hidden rounded-full bg-ink-700">
                  <div
                    className={cn('h-full rounded-full')}
                    style={{ width: `${c.score}%`, background: scoreColor(c.score) }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
