"use client";

import { TrendingUp } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";

interface TimeSeriesData {
  date: string;
  [key: string]: string | number;
}

interface LiquidGlassLineChartProps {
  title: string;
  description: string;
  data: TimeSeriesData[];
  sources: string[];
}

// Purple color palette - same as pie chart
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

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="liquid-glass rounded-lg px-3 py-2 text-white text-xs">
        <p className="font-medium mb-1">{label}</p>
        {payload.map((entry: any, index: number) => (
          <p key={index} style={{ color: entry.color }}>
            {entry.name}: {entry.value}%
          </p>
        ))}
      </div>
    );
  }
  return null;
};

export default function LiquidGlassLineChart({
  title,
  description,
  data,
  sources
}: LiquidGlassLineChartProps) {

  return (
    <div className="liquid-glass rounded-2xl p-4 sm:p-6 text-white relative overflow-hidden h-full flex flex-col">
      <div className="relative z-10 flex-1 flex flex-col">
        {/* Header */}
        <div className="flex items-center gap-3 mb-3">
          <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center backdrop-blur-sm border border-white/30">
            <TrendingUp className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-base font-semibold">{title}</h3>
            <p className="text-xs opacity-70">{description}</p>
          </div>
        </div>

        {/* Chart */}
        <div className="flex-1 w-full flex items-center justify-center min-h-0">
          {data && data.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={data}
                margin={{ top: 5, right: 15, left: 10, bottom: 30 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                <XAxis
                  dataKey="date"
                  tick={{ fill: 'rgba(255,255,255,0.6)', fontSize: 9 }}
                  axisLine={{ stroke: 'rgba(255,255,255,0.2)' }}
                  tickLine={{ stroke: 'rgba(255,255,255,0.2)' }}
                  angle={-45}
                  textAnchor="end"
                  height={45}
                />
                <YAxis
                  tick={{ fill: 'rgba(255,255,255,0.6)', fontSize: 9 }}
                  axisLine={{ stroke: 'rgba(255,255,255,0.2)' }}
                  tickLine={{ stroke: 'rgba(255,255,255,0.2)' }}
                  domain={[0, 100]}
                  ticks={[0, 50, 100]}
                  tickFormatter={(value) => `${value}%`}
                  width={30}
                />
                <Tooltip content={<CustomTooltip />} />
                <Legend
                  verticalAlign="bottom"
                  height={20}
                  wrapperStyle={{ fontSize: '9px' }}
                  formatter={(value) => (
                    <span className="text-white/80 text-xs">{value}</span>
                  )}
                  iconType="line"
                />

                {/* Render a line for each source */}
                {sources.map((source, index) => (
                  <Line
                    key={source}
                    type="monotone"
                    dataKey={source}
                    stroke={PURPLE_COLORS[index % PURPLE_COLORS.length]}
                    strokeWidth={2}
                    dot={{ r: 4, fill: PURPLE_COLORS[index % PURPLE_COLORS.length] }}
                    activeDot={{ r: 6 }}
                    connectNulls={false}
                  />
                ))}
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex flex-col items-center justify-center text-white/60">
              <div className="text-6xl mb-4">😢</div>
              <p className="text-sm text-center">No trend data available</p>
              <p className="text-xs opacity-70 text-center mt-1">Try selecting a different time range</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="mt-2 pt-2 border-t border-white/20 text-center">
          <p className="text-xs opacity-70">
            Showing last 7 days • {sources.length} source types
          </p>
        </div>
      </div>
    </div>
  );
}