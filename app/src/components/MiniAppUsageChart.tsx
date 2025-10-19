"use client";

import { TrendingUp } from "lucide-react";
import { CartesianGrid, Line, LineChart, XAxis, YAxis, ResponsiveContainer, Tooltip } from "recharts";

interface MiniAppUsageChartProps {
  title: string;
  description: string;
  data: Array<{ date: string; count: number }> | undefined;
}

export default function MiniAppUsageChart({
  title,
  description,
  data
}: MiniAppUsageChartProps) {
  // Purple color for line
  const lineColor = '#8B5CF6'; // Purple-500

  // Custom tooltip
  const CustomTooltip = ({ active, payload }: { active?: boolean; payload?: Array<{ value: number; payload: { date: string } }> }) => {
    if (active && payload && payload.length) {
      return (
        <div className="liquid-glass rounded-lg px-3 py-2 text-white border border-white/30 select-none pointer-events-none">
          <p className="text-xs font-medium">{payload[0].payload.date}</p>
          <p className="text-xs opacity-80">{payload[0].value} uses</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="liquid-glass rounded-2xl p-4 sm:p-6 text-white relative overflow-hidden h-full flex flex-col select-none pointer-events-none">
      <div className="relative z-10 flex-1 flex flex-col">
        {/* Header */}
        <div className="flex items-center gap-3 mb-4 sm:mb-6">
          <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm border border-white/30">
            <TrendingUp className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-semibold">{title}</h3>
            <p className="text-xs opacity-70">{description}</p>
          </div>
        </div>

        {/* Chart */}
        <div className="flex-1 w-full flex items-center justify-center min-h-0">
          {data && data.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%" style={{ pointerEvents: 'none', userSelect: 'none' }}>
              <LineChart
                data={data}
                margin={{
                  top: 5,
                  right: 30,
                  left: 20,
                  bottom: 5,
                }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="rgba(255,255,255,0.1)"
                  vertical={false}
                />
                <XAxis
                  dataKey="date"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                  tick={{ fill: 'rgba(255,255,255,0.5)', fontSize: 10 }}
                />
                <YAxis
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                  tick={{ fill: 'rgba(255,255,255,0.5)', fontSize: 10 }}
                />
                <Tooltip content={<CustomTooltip />} />
                <Line
                  type="natural"
                  dataKey="count"
                  stroke={lineColor}
                  strokeWidth={2}
                  dot={false}
                  activeDot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex flex-col items-center justify-center text-white/60">
              <TrendingUp className="w-12 h-12 mb-4 opacity-50" />
              <p className="text-sm text-center">No usage data available</p>
              <p className="text-xs opacity-70 text-center mt-1">Try selecting a different time range</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="mt-2 pt-2 border-t border-white/20">
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1">
              <div className="h-2 w-2 bg-purple-500 rounded-full"></div>
              <span className="text-xs text-white/60">
                {data?.length || 0} days tracked
              </span>
            </div>
            <div className="h-2 w-2 bg-white/20 rounded-full ml-auto"></div>
            <span className="text-xs text-white/60">
              Daily usage
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}