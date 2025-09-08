
import React, { memo } from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';


interface MonthlyLeakChartProps {
  data: { name: string; reports: number }[];
  themeMode?: 'dark' | 'light';
}

const MonthlyLeakChart: React.FC<MonthlyLeakChartProps> = ({ data, themeMode }) => {
  const isDark = themeMode === 'dark';
  const axisFontColor = isDark ? '#fff' : '#000';
  const tooltipStyle = isDark ? { fontSize: 12, color: '#fff', background: '#222', border: '1px solid #444' } : { fontSize: 12, color: '#000', background: '#fff', border: '1px solid #eee' };
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
          tick={{ dy: 35, fontSize: 13, fill: axisFontColor }}
        />
        <YAxis axisLine={false} tickLine={false} width={30} tick={{ fill: axisFontColor }} />
        <Tooltip contentStyle={tooltipStyle} labelStyle={{ color: axisFontColor }} />
        <Line
          type="monotone"
          dataKey="reports"
          stroke={isDark ? '#ffffff' : '#0e41a0ff'}
          strokeWidth={1.5}
          dot={false}
          isAnimationActive={false}
        />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default memo(MonthlyLeakChart);
