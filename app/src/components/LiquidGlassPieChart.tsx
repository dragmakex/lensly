"use client";

import { Pie, PieChart, ResponsiveContainer, Tooltip, Cell, Legend } from "recharts";
import type { LegendPayload } from "recharts";
import type { PieDatum } from "@/types/charts";

interface LiquidGlassPieChartProps {
  title: string;
  description: string;
  data: PieDatum[];
  icon: React.ReactNode;
}

// Purple color palette
const PURPLE_COLORS = [
  '#8B5CF6', // Purple-500
  '#A78BFA', // Purple-400
  '#C4B5FD', // Purple-300
  '#DDD6FE', // Purple-200
  '#6D28D9', // Purple-600
  '#7C3AED', // Purple-500
  '#9333EA', // Purple-600
  '#A855F7', // Purple-500
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
        <p>{payload[0].value} entries ({payload[0].payload.percentage}%)</p>
      </div>
    );
  }
  return null;
};

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
  if (percentage < 5) return null;

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

export default function LiquidGlassPieChart({
  title,
  description,
  data,
  icon
}: LiquidGlassPieChartProps) {
  const totalEntries = data.reduce((sum, item) => sum + item.count, 0);

  return (
    <div className="liquid-glass rounded-2xl p-4 sm:p-6 text-white relative overflow-hidden h-full flex flex-col">
      <div className="relative z-10 flex-1 flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between mb-4 sm:mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm border border-white/30">
              {icon}
            </div>
            <div>
              <h3 className="text-lg font-semibold">{title}</h3>
              <p className="text-xs opacity-70">{description}</p>
            </div>
          </div>
        </div>

        {/* Chart */}
        <div className="flex-1 w-full flex items-center justify-center min-h-0">
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
                nameKey="source"
              >
                {data.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={PURPLE_COLORS[index % PURPLE_COLORS.length]}
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
                iconType="circle"
              />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Footer */}
        <div className="mt-2 pt-2 border-t border-white/20 text-center">
          <p className="text-xs opacity-70">
            {data.length} source types • {totalEntries.toLocaleString()} total entries
          </p>
        </div>
      </div>
    </div>
  );
}