'use client';

import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Treemap, ResponsiveContainer, Tooltip } from 'recharts';

const COLORS = ['#D4A24E', '#27AD78', '#4D8AD2', '#DA5C5C', '#9C722C', '#5CCB9A', '#7FAEE3', '#E58888', '#C9C6BC'];

interface TreemapProps {
  data: { label: string; value: number; pct: number }[];
}

export function AllocationTreemap({ data }: TreemapProps) {
  const treeData = data.map((d, i) => ({ name: d.label, size: d.value, fill: COLORS[i % COLORS.length] }));

  return (
    <Card>
      <CardHeader>
        <CardTitle>Allocation treemap</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <Treemap data={treeData} dataKey="size" stroke="#0A0B0D" fill="#D4A24E">
              <Tooltip
                contentStyle={{ background: '#15161A', border: '1px solid #26272D', borderRadius: 12, fontSize: 12 }}
                formatter={(value: number, _name, item) => [`₹${value.toFixed(2)}L`, item.payload.name]}
              />
            </Treemap>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
