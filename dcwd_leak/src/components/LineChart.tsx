
import React from 'react';

interface LineChartProps {
  data: { [date: string]: number };
  width?: number;
  height?: number;
}

const LineChart: React.FC<LineChartProps> = ({ data, width = 400, height = 200 }) => {
  const dates = Object.keys(data).sort();
  const values = dates.map(date => data[date]);

  const max = Math.max(...values, 1);
  const stepX = width / (dates.length + 1);
  const scaleY = height / max;

  const points = dates.map((date, i) => {
    const x = stepX * (i + 1);
    const y = height - data[date] * scaleY;
    return { x, y, date, value: data[date] };
  });

  return (
    <svg width={width} height={height + 40}>
      {/* Axes */}
      <line x1={stepX} y1={0} x2={stepX} y2={height} stroke="#ccc" />
      <line x1={stepX} y1={height} x2={width} y2={height} stroke="#ccc" />

      {/* Lines */}
      {points.slice(1).map((p, i) => (
        <line
          key={i}
          x1={points[i].x}
          y1={points[i].y}
          x2={p.x}
          y2={p.y}
          stroke="#6ba5f7"
          strokeWidth={2}
        />
      ))}

      {/* Dots & Labels */}
      {points.map((point, i) => (
        <g key={i}>
          <circle cx={point.x} cy={point.y} r={4} fill="#49862a" />
          <text x={point.x - 10} y={point.y - 10} fontSize="10" fill="#000">
            {point.value}
          </text>
          <text x={point.x - 20} y={height + 15} fontSize="10" fill="#333">
            {point.date}
          </text>
        </g>
      ))}
    </svg>
  );
};

export default LineChart;
