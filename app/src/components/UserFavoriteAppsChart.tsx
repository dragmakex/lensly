"use client";

import { Heart } from "lucide-react";
import { PolarAngleAxis, PolarGrid, Radar, RadarChart, ResponsiveContainer } from "recharts";

const CHART_COLORS = [
  '#8B5CF6', '#A78BFA', '#C4B5FD', '#DDD6FE', '#6D28D9'
] as const;

interface UserFavoriteAppsChartProps {
  title: string;
  description: string;
  data: Array<{ miniapp_id: string; count: number }> | undefined;
}

export default function UserFavoriteAppsChart({
  title,
  description,
  data
}: UserFavoriteAppsChartProps) {
  const chartData = data?.slice(0, 5).map((item, index) => {
    const shortName = item.miniapp_id.length > 12
      ? item.miniapp_id.substring(0, 12) + '...'
      : item.miniapp_id;

    return {
      app: shortName,
      usage: item.count,
      fill: CHART_COLORS[index % CHART_COLORS.length]
    };
  }) || [];

  const maxValue = Math.max(...chartData.map(d => d.usage), 1);

  const normalizedData = chartData.map(item => ({
    ...item,
    normalizedUsage: Math.round((item.usage / maxValue) * 100)
  }));

  return (
    <div className="liquid-glass rounded-2xl p-4 sm:p-6 text-white relative overflow-hidden h-full flex flex-col select-none pointer-events-none">
      <div className="relative z-10 flex-1 flex flex-col">
        <div className="flex items-center gap-3 mb-4 sm:mb-6">
          <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm border border-white/30">
            <Heart className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-semibold">{title}</h3>
            <p className="text-xs opacity-70">{description}</p>
          </div>
        </div>

        <div className="flex-1 w-full flex items-center justify-center min-h-0">
          {normalizedData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%" style={{ pointerEvents: 'none', userSelect: 'none' }}>
              <RadarChart data={normalizedData}>
                <PolarGrid
                  radialLines={false}
                  polarRadius={[30, 60, 90]}
                  strokeWidth={1}
                  stroke="rgba(255,255,255,0.1)"
                />
                <PolarAngleAxis
                  dataKey="app"
                  tick={{ fill: 'rgba(255,255,255,0.8)', fontSize: 10 }}
                  tickLine={false}
                />
                <Radar
                  name="Usage"
                  dataKey="normalizedUsage"
                  stroke="#8B5CF6"
                  fill="#8B5CF6"
                  fillOpacity={0.6}
                  strokeWidth={2}
                />
              </RadarChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex flex-col items-center justify-center text-white/60">
              <Heart className="w-12 h-12 mb-4 opacity-50" />
              <p className="text-sm text-center">No app usage data available</p>
              <p className="text-xs opacity-70 text-center mt-1">Try searching for a different user</p>
            </div>
          )}
        </div>

        <div className="mt-2 pt-2 border-t border-white/20">
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1">
              <div className="h-2 w-2 bg-purple-500 rounded-full"></div>
              <span className="text-xs text-white/60">
                Top {normalizedData.length} apps
              </span>
            </div>
            <div className="h-2 w-2 bg-white/20 rounded-full ml-auto"></div>
            <span className="text-xs text-white/60">
              Usage frequency
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}