"use client"

import { TrendingUp } from "lucide-react";
import { Area, AreaChart, CartesianGrid, XAxis, YAxis, ResponsiveContainer, Legend } from "recharts";
import type { AreaDataPoint } from "@/types/charts";

const CHART_COLORS = [
  '#8B5CF6', '#A78BFA', '#C4B5FD', '#DDD6FE', '#6D28D9'
] as const;

const CHART_STYLES = {
  grid: { strokeDasharray: "3 3", stroke: "rgba(255,255,255,0.1)" },
  axis: {
    tickLine: false,
    axisLine: false,
    tickMargin: 8,
    tick: { fill: 'rgba(255,255,255,0.5)', fontSize: 12 }
  },
  legend: {
    verticalAlign: "bottom" as const,
    height: 36,
    wrapperStyle: {
      fontSize: '12px',
      color: 'rgba(255,255,255,0.8)'
    }
  },
  containerStyle: { pointerEvents: 'none', userSelect: 'none' } as const
};

interface ShadcnAreaChartProps {
  title: string;
  description: string;
  data: AreaDataPoint[] | undefined;
  sources: string[];
}

export default function ShadcnAreaChart({
  title,
  description,
  data,
  sources
}: ShadcnAreaChartProps) {
  const sortedData = data ? [...data].sort((a, b) =>
    new Date(a.date).getTime() - new Date(b.date).getTime()
  ) : [];

  return (
    <div className="liquid-glass rounded-2xl p-4 sm:p-6 text-white relative overflow-hidden h-full flex flex-col select-none pointer-events-none">
      <div className="relative z-10 flex-1 flex flex-col">
        <div className="flex items-center gap-3 mb-4 sm:mb-6">
          <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm border border-white/30">
            <TrendingUp className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-semibold">{title}</h3>
            <p className="text-xs opacity-70">{description}</p>
          </div>
        </div>

        <div className="flex-1 w-full flex items-center justify-center min-h-0">
          {sortedData?.length ? (
            <ResponsiveContainer width="100%" height="100%" style={CHART_STYLES.containerStyle}>
              <AreaChart data={sortedData}>
                <defs>
                  {sources.map((source, index) => (
                    <linearGradient key={source} id={`color-${source}`} x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={CHART_COLORS[index % CHART_COLORS.length]} stopOpacity={0.8}/>
                      <stop offset="95%" stopColor={CHART_COLORS[index % CHART_COLORS.length]} stopOpacity={0.1}/>
                    </linearGradient>
                  ))}
                </defs>
                <CartesianGrid {...CHART_STYLES.grid} />
                <XAxis dataKey="date" {...CHART_STYLES.axis} />
                <YAxis {...CHART_STYLES.axis} />
                {sources.map((source, index) => (
                  <Area
                    key={source}
                    type="monotone"
                    dataKey={source}
                    stroke={CHART_COLORS[index % CHART_COLORS.length]}
                    fillOpacity={1}
                    fill={`url(#color-${source})`}
                    strokeWidth={2}
                  />
                ))}
                <Legend
                  {...CHART_STYLES.legend}
                  formatter={(value: string) => (
                    <span style={{
                      color: CHART_COLORS[sources.indexOf(value)] ?? '#8B5CF6',
                      pointerEvents: 'none',
                      userSelect: 'none'
                    }}>
                      {value}
                    </span>
                  )}
                  iconType="rect"
                />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex flex-col items-center justify-center text-white/60">
              <p className="text-sm text-center">No trend data available</p>
              <p className="text-xs opacity-70 text-center mt-1">Try selecting a different time range</p>
            </div>
          )}
        </div>

        <div className="mt-2 pt-2 border-t border-white/20">
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1">
              <div className="h-2 w-2 bg-green-500 rounded-full"></div>
              <span className="text-xs text-white/60">
                {sources.length} source types
              </span>
            </div>
            <div className="h-2 w-2 bg-white/20 rounded-full ml-auto"></div>
            <span className="text-xs text-white/60">
              Showing last 7 days
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}