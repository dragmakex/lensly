"use client";

import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
  Tooltip
} from 'recharts';
import type { LegendPayload } from 'recharts';
import type { PieDatum } from '@/types/charts';

interface LiquidGlassChartCardProps {
  title: string;
  data: PieDatum[];
  icon: React.ReactNode;
}

// Apple-inspired colors
const APPLE_COLORS = [
  '#007AFF', // Blue
  '#34C759', // Green
  '#FF9500', // Orange
  '#FF3B30', // Red
  '#AF52DE', // Purple
  '#FF2D92', // Pink
  '#5AC8FA', // Light Blue
  '#FFCC00', // Yellow
];

type TooltipContentProps = {
  active?: boolean;
  payload?: Array<{ value: number; name: string; payload: PieDatum }>;
};

const CustomTooltip = ({ active, payload }: TooltipContentProps) => {
  if (active && payload && payload[0]) {
    return (
      <div className="liquid-glass rounded-lg px-3 py-2 text-white text-xs">
        <p className="font-medium">{payload[0].name}</p>
        <p>{payload[0].value} ({payload[0].payload.percentage}%)</p>
      </div>
    );
  }
  return null;
};

export default function LiquidGlassChartCard({
  title,
  data,
  icon
}: LiquidGlassChartCardProps) {

  type LabelProps = {
    cx?: number | string;
    cy?: number | string;
    midAngle?: number;
    innerRadius?: number;
    outerRadius?: number;
    percent?: number;
  };

  const renderCustomizedLabel = ({
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    percent
  }: LabelProps) => {
    const RADIAN = Math.PI / 180;
    if (
      cx === undefined ||
      cy === undefined ||
      midAngle === undefined ||
      innerRadius === undefined ||
      outerRadius === undefined
    ) {
      return null;
    }

    const numericCx = typeof cx === 'number' ? cx : Number(cx);
    const numericCy = typeof cy === 'number' ? cy : Number(cy);
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = numericCx + radius * Math.cos(-midAngle * RADIAN);
    const y = numericCy + radius * Math.sin(-midAngle * RADIAN);
    const percentage = Math.round((percent ?? 0) * 100);

    if (percentage < 5) return null; // Don't show label for small slices

    return (
      <text
        x={x}
        y={y}
        fill="white"
  textAnchor={x > numericCx ? 'start' : 'end'}
        dominantBaseline="central"
        className="text-xs font-medium"
      >
        {`${percentage}%`}
      </text>
    );
  };

  return (
    <div className="liquid-glass rounded-2xl p-6 text-white relative overflow-hidden">
      <div className="relative z-10">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm border border-white/30">
            {icon}
          </div>
          <div>
            <h3 className="text-lg font-semibold">{title}</h3>
            <p className="text-xs opacity-70">Source distribution</p>
          </div>
        </div>

        {/* Chart */}
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={renderCustomizedLabel}
                outerRadius={80}
                fill="#8884d8"
                dataKey="count"
              >
                {data.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={APPLE_COLORS[index % APPLE_COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
              <Legend
                verticalAlign="bottom"
                height={36}
                formatter={(value: string, entry?: LegendPayload) => (
                  <span className="text-white/80 text-xs">
                    {value} ({(entry?.payload as PieDatum | undefined)?.percentage ?? 0}%)
                  </span>
                )}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Stats */}
        <div className="mt-6 pt-4 border-t border-white/20">
          <div className="flex justify-between items-center">
            <p className="text-xs opacity-70">Total sources</p>
            <p className="text-sm font-semibold">{data.length}</p>
          </div>
          <div className="flex justify-between items-center mt-2">
            <p className="text-xs opacity-70">Total entries</p>
            <p className="text-sm font-semibold">
              {data.reduce((sum, item) => sum + item.count, 0).toLocaleString()}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}