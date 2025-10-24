"use client";

import { Pie, PieChart, ResponsiveContainer, Cell, Legend } from "recharts";
import type { LegendPayload } from "recharts";
import type { PieDatum } from "@/types/charts";

const CHART_COLORS = [
  '#8B5CF6', '#A78BFA', '#C4B5FD', '#DDD6FE', '#6D28D9'
] as const;

const CONTAINER_STYLE = { pointerEvents: 'none', userSelect: 'none' } as const;
const RADIAN = Math.PI / 180;
const LABEL_RADIUS_OFFSET = 30;
const TEXT_OFFSET = 4;
const MIN_PERCENTAGE_DISPLAY = 5;

type LabelProps = {
  cx?: number | string;
  cy?: number | string;
  midAngle?: number;
  innerRadius?: number | string;
  outerRadius?: number | string;
  percent?: number;
};

const renderCustomizedLabel = ({
  cx,
  cy,
  midAngle,
  outerRadius,
  percent
}: LabelProps) => {
  if (!cx || !cy || midAngle === undefined || !outerRadius) return null;

  const numericCx = typeof cx === 'number' ? cx : parseFloat(cx);
  const numericCy = typeof cy === 'number' ? cy : parseFloat(cy);
  const numericOuterRadius = typeof outerRadius === 'number' ? outerRadius : parseFloat(outerRadius);

  if (Number.isNaN(numericCx) || Number.isNaN(numericCy) || Number.isNaN(numericOuterRadius)) {
    return null;
  }

  const displayPercent = Math.round((percent ?? 0) * 100);
  if (displayPercent < MIN_PERCENTAGE_DISPLAY) return null;

  const labelRadius = numericOuterRadius + LABEL_RADIUS_OFFSET;
  const startX = numericCx + numericOuterRadius * Math.cos(-midAngle * RADIAN);
  const startY = numericCy + numericOuterRadius * Math.sin(-midAngle * RADIAN);
  const endX = numericCx + labelRadius * Math.cos(-midAngle * RADIAN);
  const endY = numericCy + labelRadius * Math.sin(-midAngle * RADIAN);

  const isRight = endX > numericCx;
  const textX = endX + (isRight ? TEXT_OFFSET : -TEXT_OFFSET);
  const textAnchor = isRight ? 'start' : 'end';

  return (
    <g>
      <line
        x1={startX}
        y1={startY}
        x2={endX}
        y2={endY}
        stroke="rgba(255,255,255,0.6)"
        strokeWidth={1}
      />
      <text
        x={textX}
        y={endY}
        fill="white"
        textAnchor={textAnchor}
        dominantBaseline="middle"
        className="text-xs font-medium"
      >
        {`${displayPercent}%`}
      </text>
    </g>
  );
};

interface ShadcnPieChartProps {
  title: string;
  description: string;
  data: PieDatum[] | undefined;
}

export default function ShadcnPieChart({
  title,
  description,
  data
}: ShadcnPieChartProps) {
  const chartData = data ?? [];
  const totalEntries = chartData.reduce((sum, item) => sum + item.count, 0);

  return (
    <div className="liquid-glass rounded-2xl p-4 sm:p-6 text-white relative overflow-hidden h-full flex flex-col select-none pointer-events-none">
      <div className="relative z-10 flex-1 flex flex-col">
        <div className="flex items-center gap-3 mb-4 sm:mb-6">
          <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm border border-white/30">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
              <path d="M11.7 2.805a.75.75 0 0 1 .6 0A60.65 60.65 0 0 1 22.83 8.72a.75.75 0 0 1-.231 1.337 49.948 49.948 0 0 0-9.902 3.912l-.003.002c-.114.06-.227.119-.34.18a.75.75 0 0 1-.707 0A50.88 50.88 0 0 0 7.5 12.173v-.224c0-.131.067-.248.172-.311a54.615 54.615 0 0 1 4.653-2.52.75.75 0 0 0-.65-1.352 56.123 56.123 0 0 0-4.78 2.589 1.858 1.858 0 0 0-.859 1.228 49.803 49.803 0 0 0-4.634-1.527.75.75 0 0 1-.231-1.337A60.653 60.653 0 0 1 11.7 2.805Z" />
              <path d="M13.06 15.473a48.45 48.45 0 0 1 7.666-3.282c.134 1.414.22 2.843.255 4.284a.75.75 0 0 1-.46.711 47.87 47.87 0 0 0-8.105 4.342.75.75 0 0 1-.832 0 47.87 47.87 0 0 0-8.104-4.342.75.75 0 0 1-.461-.71c.035-1.442.121-2.87.255-4.286.921.304 1.83.634 2.726.99v1.27a1.5 1.5 0 0 0-.14 2.508c-.09.38-.222.753-.397 1.11.452.213.901.434 1.346.66a6.727 6.727 0 0 0 .551-1.607 1.5 1.5 0 0 0 .14-2.67v-.645a48.549 48.549 0 0 1 3.44 1.667 2.25 2.25 0 0 0 2.12 0Z" />
            </svg>
          </div>
          <div>
            <h3 className="text-lg font-semibold">{title}</h3>
            <p className="text-xs opacity-70">{description}</p>
          </div>
        </div>

        <div className="flex-1 w-full flex items-center justify-center">
          {chartData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%" style={CONTAINER_STYLE}>
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={renderCustomizedLabel}
                  isAnimationActive={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="count"
                  nameKey="source"
                >
                  {chartData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={CHART_COLORS[index % CHART_COLORS.length]}
                    />
                  ))}
                </Pie>
                <Legend
                  verticalAlign="bottom"
                  height={36}
                  wrapperStyle={{
                    fontSize: '12px',
                    color: 'rgba(255,255,255,0.8)'
                  }}
                  formatter={(value: string, entry?: LegendPayload) => (
                    <span style={{ pointerEvents: 'none', userSelect: 'none' }}>
                      {value} ({(entry?.payload as PieDatum | undefined)?.percentage ?? 0}%)
                    </span>
                  )}
                />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex flex-col items-center justify-center text-white/60">
              <div className="text-6xl mb-4">😢</div>
              <p className="text-sm text-center">No data available</p>
            </div>
          )}
        </div>

        <div className="mt-2 pt-2 border-t border-white/20 text-center">
          <p className="text-xs opacity-70">
            {chartData.length} source types • {totalEntries.toLocaleString()} total entries
          </p>
        </div>
      </div>
    </div>
  );
}