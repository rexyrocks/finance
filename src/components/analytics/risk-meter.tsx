import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

interface RiskMeterProps {
  score: number;
  components: { label: string; score: number }[];
}

function riskLabel(score: number) {
  if (score >= 75) return { text: 'Low risk', color: '#27AD78' };
  if (score >= 50) return { text: 'Moderate risk', color: '#D4A24E' };
  return { text: 'Elevated risk', color: '#DA5C5C' };
}

export function RiskMeter({ score, components }: RiskMeterProps) {
  const risk = riskLabel(score);
  const weakest = [...components].sort((a, b) => a.score - b.score)[0];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Financial risk meter</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="relative h-3 w-full overflow-hidden rounded-full bg-gradient-to-r from-coral-500 via-gold-400 to-emerald-400">
          <div
            className="absolute top-1/2 h-5 w-5 -translate-y-1/2 rounded-full border-2 border-ink-900 bg-white shadow-md"
            style={{ left: `calc(${score}% - 10px)` }}
          />
        </div>
        <div className="mt-3 flex items-center justify-between text-xs text-ink-200">
          <span>Elevated</span>
          <span>Moderate</span>
          <span>Low</span>
        </div>
        <p className="mt-5 text-sm" style={{ color: risk.color }}>
          {risk.text} · score {score}/100
        </p>
        {weakest && (
          <p className="mt-1 text-xs text-ink-200">
            Weakest signal: <span className="text-ink-0">{weakest.label}</span> at {weakest.score}/100
          </p>
        )}
      </CardContent>
    </Card>
  );
}
