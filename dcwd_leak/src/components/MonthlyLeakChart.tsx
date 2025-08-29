
import React, { memo } from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

interface MonthlyLeakChartProps {
  data: { name: string; reports: number }[];
}

const MonthlyLeakChart: React.FC<MonthlyLeakChartProps> = ({ data }) => {
  return (
    <ResponsiveContainer width="100%" height={250}>
      <LineChart
        data={data}
        margin={{ top: 10, right: 30, bottom: 30, left: 40 }}
      >
        <XAxis
          dataKey="name"
          axisLine={false}
          tickLine={false}
          interval={0}
          tick={{ dy: 35, fontSize: 13 }}
        />
        <YAxis axisLine={false} tickLine={false} width={30} />
        <Tooltip contentStyle={{ fontSize: 12 }} />
        <Line
          type="monotone"
          dataKey="reports"
          stroke="#0e41a0ff"
          strokeWidth={1.5}
          dot={false}
          isAnimationActive={false} 
        />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default memo(MonthlyLeakChart);
