"use client";

import { motion } from "framer-motion";
import ShadcnPieChart from "./ShadcnPieChart";
import ShadcnAreaChart from "./ShadcnAreaChart";
import TopUsersBarChart from "./TopUsersBarChart";
import UserFavoriteAppsChart from "./UserFavoriteAppsChart";
import MiniAppUsageChart from "./MiniAppUsageChart";
import LiquidGlassButton from "./LiquidGlassButton";
import { ArrowLeft } from "lucide-react";
import type { ChartData, TopUser } from "@/types/charts";

interface ChartsDisplayProps {
  chartData: ChartData | null;
  userData: TopUser[] | null;
  onBack: () => void;
  searchType: 'miniapp' | 'user' | null;
  userFavoriteApps: Array<{ miniapp_id: string; count: number }> | null;
  miniAppUsage: Array<{ date: string; count: number }> | null;
  clientTypeData: Array<{ source: string; count: number; percentage: number }> | null;
  platformTypeData: Array<{ source: string; count: number; percentage: number }> | null;
}

export default function ChartsDisplay({ chartData, userData, onBack, searchType, userFavoriteApps, miniAppUsage, clientTypeData, platformTypeData }: ChartsDisplayProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -50 }}
      transition={{
        duration: 1.2,
        ease: [0.25, 0.46, 0.45, 0.94]
      }}
      className="relative z-10 w-full h-full flex items-center justify-center px-4 select-none"
    >
      {/* Back Button */}
      <div className="absolute top-4 left-4 z-20 pointer-events-auto">
        <LiquidGlassButton
          onClick={onBack}
          icon={<ArrowLeft className="w-4 h-4" />}
        />
      </div>

      {/* Charts Container */}
      <div className="w-full h-full overflow-y-auto pt-20 pb-8 select-none">
        {searchType === 'miniapp' ? (
          // Miniapp charts layout - 5 charts
          <div className="flex flex-col xl:flex-row flex-wrap gap-6 items-center justify-center min-h-full">
            {/* Top Users Bar Chart */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="w-[320px] h-[450px] flex-shrink-0 select-none pointer-events-none"
            >
              <TopUsersBarChart
                title="Top Farcaster IDs"
                description="Most frequent FIDs by source data"
                data={userData ?? undefined}
              />
            </motion.div>

            {/* Source Distribution Pie Chart */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="w-[320px] h-[480px] flex-shrink-0 select-none pointer-events-none"
            >
              <ShadcnPieChart
                title="Source Distribution"
                description="Percentage by source type"
                data={chartData?.pieData}
              />
            </motion.div>

            {/* Client Type Pie Chart */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.7 }}
              className="w-[320px] h-[480px] flex-shrink-0 select-none pointer-events-none"
            >
              <ShadcnPieChart
                title="Client Type"
                description="Base vs Farcaster access"
                data={clientTypeData ?? undefined}
              />
            </motion.div>

            {/* Platform Type Pie Chart */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.9 }}
              className="w-[320px] h-[480px] flex-shrink-0 select-none pointer-events-none"
            >
              <ShadcnPieChart
                title="Platform Type"
                description="Web vs Mobile usage"
                data={platformTypeData ?? undefined}
              />
            </motion.div>

            {/* Area Chart */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1.1 }}
              className="w-[320px] h-[550px] flex-shrink-0 select-none pointer-events-none"
            >
              <ShadcnAreaChart
                title="Source Trends"
                description="Percentage changes over time"
                data={chartData?.areaData}
                sources={chartData?.sources || []}
              />
            </motion.div>
          </div>
        ) : searchType === 'user' ? (
          // User charts layout
          <div className="flex flex-col xl:flex-row gap-6 items-center justify-center min-h-full">
            {/* User Favorite Apps (Radar Chart) */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="w-[320px] h-[450px] flex-shrink-0 select-none pointer-events-none"
            >
              <UserFavoriteAppsChart
                title="Favorite Apps"
                description="Top 5 most used apps"
                data={userFavoriteApps ?? undefined}
              />
            </motion.div>

            {/* MiniApp Usage (Line Chart) */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="w-[320px] h-[450px] flex-shrink-0 select-none pointer-events-none"
            >
              <MiniAppUsageChart
                title="Usage Trends"
                description="Daily app usage over 7 days"
                data={miniAppUsage ?? undefined}
              />
            </motion.div>
          </div>
        ) : (
          // Default state or loading
          <div className="flex items-center justify-center min-h-full">
            <p className="text-white/60">No data available</p>
          </div>
        )}
      </div>
    </motion.div>
  );
}