
import React from 'react';
import { ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { chartColors } from '@/utils/chartStyles';

interface GaugeChartProps {
  value: number;
  max?: number;
  label?: string;
  size?: number;
}

const GaugeChart: React.FC<GaugeChartProps> = ({
  value,
  max = 100,
  label = "Progress",
  size = 120
}) => {
  const percentage = Math.min((value / max) * 100, 100);
  
  const data = [
    { name: 'completed', value: percentage, color: chartColors.success },
    { name: 'remaining', value: 100 - percentage, color: chartColors.muted }
  ];

  return (
    <div className="relative">
      <ResponsiveContainer width="100%" height={size}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            startAngle={180}
            endAngle={0}
            innerRadius={size * 0.3}
            outerRadius={size * 0.4}
            dataKey="value"
            stroke="none"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
        </PieChart>
      </ResponsiveContainer>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <div className="text-2xl font-bold text-foreground">{value}%</div>
        <div className="text-xs text-muted-foreground">{label}</div>
      </div>
    </div>
  );
};

export default GaugeChart;
