'use client';

import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

const COLORS = ['#D4A24E', '#27AD78', '#4D8AD2', '#DA5C5C', '#9C722C', '#5CCB9A', '#7FAEE3', '#E58888', '#C9C6BC'];

interface AllocationChartProps {
  data: { label: string; value: number; pct: number }[];
}

export function AllocationChart({ data }: AllocationChartProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Asset allocation</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="relative h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                dataKey="value"
                nameKey="label"
                innerRadius="58%"
                outerRadius="85%"
                paddingAngle={2}
                strokeWidth={0}
              >
                {data.map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{ background: '#15161A', border: '1px solid #26272D', borderRadius: 12, fontSize: 12 }}
                formatter={(value: number, name: string) => [`₹${value.toFixed(2)}L`, name]}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="mt-3 grid grid-cols-2 gap-x-4 gap-y-2">
          {data.slice(0, 8).map((d, i) => (
            <div key={d.label} className="flex items-center gap-2 text-xs">
              <span className="h-2 w-2 shrink-0 rounded-full" style={{ background: COLORS[i % COLORS.length] }} />
              <span className="truncate text-ink-200">{d.label}</span>
              <span className="ml-auto font-mono text-ink-0">{d.pct}%</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
