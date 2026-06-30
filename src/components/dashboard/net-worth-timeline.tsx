'use client';

import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

interface TimelinePoint {
  quarter: string;
  netWorth: number;
  assets: number;
  liabilities: number;
}

export function NetWorthTimeline({ data }: { data: TimelinePoint[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Net worth over time</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
              <defs>
                <linearGradient id="nwFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#D4A24E" stopOpacity={0.35} />
                  <stop offset="100%" stopColor="#D4A24E" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid stroke="#1C1D22" vertical={false} />
              <XAxis dataKey="quarter" stroke="#3A3C44" fontSize={11} tickLine={false} axisLine={false} />
              <YAxis stroke="#3A3C44" fontSize={11} tickLine={false} axisLine={false} tickFormatter={(v) => `${v}L`} />
              <Tooltip
                contentStyle={{ background: '#15161A', border: '1px solid #26272D', borderRadius: 12, fontSize: 12 }}
                formatter={(value: number) => [`₹${value.toFixed(2)}L`, 'Net worth']}
              />
              <Area type="monotone" dataKey="netWorth" stroke="#D4A24E" strokeWidth={2} fill="url(#nwFill)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
