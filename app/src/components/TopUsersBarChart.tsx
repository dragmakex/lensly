"use client";

import { Users } from "lucide-react";
import { Bar, BarChart, XAxis, YAxis, ResponsiveContainer } from "recharts";
import type { TopUser } from "@/types/charts";

const CHART_COLORS = [
  '#8B5CF6', '#A78BFA', '#C4B5FD', '#DDD6FE', '#6D28D9'
] as const;

const CONTAINER_STYLE = { pointerEvents: 'none', userSelect: 'none' } as const;
const TOP_USERS_COUNT = 5;
const MIN_MARGIN = 25;
const CHARS_PER_PIXEL = 5;

type ChartDataPoint = {
  user: string;
  visitors: number;
  fill: string;
  originalData: TopUser;
};

const formatUserName = (item: TopUser): string => {
  if (item.user_id === 'anonymous') return 'Anonymous';

  const userName = item.user_name;
  if (userName.includes('User') && /^\d+$/.test(userName.replace('User ', ''))) {
    return `FID ${userName.replace('User ', '')}`;
  }

  if (userName.includes('.eth') || userName.includes('.farcaster')) {
    return userName.replace(/.eth|.farcaster/, '');
  }

  return userName;
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
  const chartData: ChartDataPoint[] = data?.slice(0, TOP_USERS_COUNT).map((item, index) => ({
    user: formatUserName(item),
    visitors: item.count,
    fill: CHART_COLORS[index % CHART_COLORS.length],
    originalData: item
  })) || [];

  const maxNameLength = Math.max(0, ...chartData.map(d => d.user.length));
  const leftMargin = Math.max(MIN_MARGIN, maxNameLength * CHARS_PER_PIXEL);

  
  return (
    <div className="liquid-glass rounded-2xl p-4 sm:p-6 text-white relative overflow-hidden h-full flex flex-col select-none pointer-events-none">
      <div className="relative z-10 flex-1 flex flex-col">
        <div className="flex items-center gap-3 mb-4 sm:mb-6">
          <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm border border-white/30">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-semibold">{title}</h3>
            <p className="text-xs opacity-70">{description}</p>
          </div>
        </div>

        <div className="flex-1 w-full flex items-center justify-center min-h-0">
          {chartData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%" style={CONTAINER_STYLE}>
              <BarChart
                data={chartData}
                layout="vertical"
                margin={{
                  left: leftMargin,
                  right: 20,
                  top: 0,
                  bottom: 0
                }}
              >
                <XAxis dataKey="visitors" type="number" hide />
                <YAxis
                  dataKey="user"
                  type="category"
                  tickLine={false}
                  tickMargin={3}
                  axisLine={false}
                  tick={{ fill: 'rgba(255,255,255,0.8)', fontSize: 14, pointerEvents: 'none' }}
                  width={50}
                />
                <Bar
                  dataKey="visitors"
                  radius={5}
                  fill={CHART_COLORS[0]}
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
