"use client";

import { Users } from "lucide-react";
import { Bar, BarChart, XAxis, YAxis, ResponsiveContainer, Tooltip } from "recharts";
import type { TopUser } from "@/types/charts";

type ChartDataPoint = {
  user: string;
  visitors: number;
  fill: string;
  originalData: TopUser;
};

type CustomTooltipPayload = {
  value?: number;
  payload?: ChartDataPoint;
};

interface TopUsersBarChartProps {
  title: string;
  description: string;
  data: TopUser[] | undefined;
}

export default function TopUsersBarChart({
  title,
  description,
  data
}: TopUsersBarChartProps) {
  // Purple color palette
  const purpleColors = [
    '#8B5CF6', // Purple-500
    '#A78BFA', // Purple-400
    '#C4B5FD', // Purple-300
    '#DDD6FE', // Purple-200
    '#6D28D9', // Purple-600
  ];

  // Prepare chart data with fill colors
  const chartData: ChartDataPoint[] = data?.slice(0, 5).map((item, index) => ({
    user: item.user_id === 'anonymous' ? 'Anonymous' :
          item.user_name.includes('User') && /^\d+$/.test(item.user_name.replace('User ', ''))
            ? `FID ${item.user_name.replace('User ', '')}` // Format as "FID 12345"
            : item.user_name.includes('.eth') || item.user_name.includes('.farcaster')
              ? item.user_name.replace(/.eth|.farcaster/, '')
              : item.user_name,
    visitors: item.count,
    fill: purpleColors[index % purpleColors.length],
    originalData: item // Keep original data for tooltip
  })) || [];

  // Custom tooltip
  const CustomTooltip = ({ active, payload }: { active?: boolean; payload?: CustomTooltipPayload[] }) => {
    if (active && payload && payload.length) {
      const tooltipEntry = payload[0];
      const originalData = tooltipEntry?.payload?.originalData;
      return (
        <div className="liquid-glass rounded-lg px-3 py-2 text-white border border-white/30">
          <p className="text-xs font-medium">{tooltipEntry?.payload?.user}</p>
          <p className="text-xs opacity-80">{tooltipEntry?.value} interactions</p>
          {originalData?.user_id && originalData.user_id !== 'anonymous' && (
            <p className="text-xs opacity-60">FID: {originalData.user_id}</p>
          )}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="liquid-glass rounded-2xl p-4 sm:p-6 text-white relative overflow-hidden h-full flex flex-col">
      <div className="relative z-10 flex-1 flex flex-col">
        {/* Header */}
        <div className="flex items-center gap-3 mb-4 sm:mb-6">
          <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm border border-white/30">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-semibold">{title}</h3>
            <p className="text-xs opacity-70">{description}</p>
          </div>
        </div>

        {/* Chart */}
        <div className="flex-1 w-full flex items-center justify-center min-h-0">
          {chartData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%" style={{ pointerEvents: 'none' }}>
              <BarChart
                data={chartData}
                layout="vertical"
                margin={{
                  left: 0,
                  right: 0,
                  top: 0,
                  bottom: 0
                }}
              >
                <XAxis
                  dataKey="visitors"
                  type="number"
                  hide
                />
                <YAxis
                  dataKey="user"
                  type="category"
                  tickLine={false}
                  tickMargin={8}
                  axisLine={false}
                  tick={{ fill: 'rgba(255,255,255,0.8)', fontSize: 12 }}
                />
                <Bar
                  dataKey="visitors"
                  radius={5}
                  fill="#8B5CF6"
                />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex flex-col items-center justify-center text-white/60">
              <Users className="w-12 h-12 mb-4 opacity-50" />
              <p className="text-sm text-center">No user data available</p>
              <p className="text-xs opacity-70 text-center mt-1">Try searching for a different app</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="mt-2 pt-2 border-t border-white/20">
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1">
              <div className="h-2 w-2 bg-purple-500 rounded-full"></div>
              <span className="text-xs text-white/60">
                Top {chartData.length} FIDs
              </span>
            </div>
            <div className="h-2 w-2 bg-white/20 rounded-full ml-auto"></div>
            <span className="text-xs text-white/60">
              Source occurrences
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}