"use client";

import { motion } from "framer-motion";
import ShadcnPieChart from "@/components/ShadcnPieChart";
import ShadcnAreaChart from "@/components/ShadcnAreaChart";
import TopUsersBarChart from "@/components/TopUsersBarChart";
import UserFavoriteAppsChart from "@/components/UserFavoriteAppsChart";
import MiniAppUsageChart from "@/components/MiniAppUsageChart";
import LiquidGlassButton from "@/components/LiquidGlassButton";
import DonationComponent from "@/components/DonationComponent";
import { ArrowLeft } from "lucide-react";
import type { ChartData, TopUser, PieDatum } from "@/types/charts";

const ANIMATION_CONFIG = {
  initial: { opacity: 0, y: 50 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -50 },
  transition: {
    duration: 1.2,
    ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number]
  }
};

const CHART_ANIMATION_CONFIG = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.8 }
} as const;

const CHART_DIMENSIONS = {
  bar: { width: 'w-[320px]', height: 'h-[450px]' },
  pie: { width: 'w-[320px]', height: 'h-[480px]' },
  area: { width: 'w-[320px]', height: 'h-[550px]' }
} as const;

interface ChartsDisplayProps {
  chartData: ChartData | null;
  userData: TopUser[] | null;
  onBack: () => void;
  searchType: 'miniapp' | 'user' | null;
  userFavoriteApps: Array<{ miniapp_id: string; count: number }> | null;
  miniAppUsage: Array<{ date: string; count: number }> | null;
  clientTypeData: PieDatum[] | undefined;
  platformTypeData: PieDatum[] | undefined;
}

export default function ChartsDisplay({ chartData, userData, onBack, searchType, userFavoriteApps, miniAppUsage, clientTypeData, platformTypeData }: ChartsDisplayProps) {
  const renderMiniappCharts = () => (
    <div className="flex flex-col items-center justify-center min-h-full">
      <div className="flex flex-col xl:flex-row flex-wrap gap-6 items-center justify-center mb-6">
        <motion.div
          {...CHART_ANIMATION_CONFIG}
          transition={{ ...CHART_ANIMATION_CONFIG.transition, delay: 0.3 }}
          className={`${CHART_DIMENSIONS.bar.width} ${CHART_DIMENSIONS.bar.height} flex-shrink-0 select-none pointer-events-none`}
        >
          <TopUsersBarChart
            title="Top Farcaster IDs"
            description="Most frequent FIDs by source data"
            data={userData ?? undefined}
          />
        </motion.div>

        <motion.div
          {...CHART_ANIMATION_CONFIG}
          transition={{ ...CHART_ANIMATION_CONFIG.transition, delay: 0.5 }}
          className={`${CHART_DIMENSIONS.pie.width} ${CHART_DIMENSIONS.pie.height} flex-shrink-0 select-none pointer-events-none`}
        >
          <ShadcnPieChart
            title="Source Distribution"
            description="Percentage by source type"
            data={chartData?.pieData}
          />
        </motion.div>

        <motion.div
          {...CHART_ANIMATION_CONFIG}
          transition={{ ...CHART_ANIMATION_CONFIG.transition, delay: 0.7 }}
          className={`${CHART_DIMENSIONS.pie.width} ${CHART_DIMENSIONS.pie.height} flex-shrink-0 select-none pointer-events-none`}
        >
          <ShadcnPieChart
            title="Client Type"
            description="Base vs Farcaster access"
            data={clientTypeData}
          />
        </motion.div>

        <motion.div
          {...CHART_ANIMATION_CONFIG}
          transition={{ ...CHART_ANIMATION_CONFIG.transition, delay: 0.9 }}
          className={`${CHART_DIMENSIONS.pie.width} ${CHART_DIMENSIONS.pie.height} flex-shrink-0 select-none pointer-events-none`}
        >
          <ShadcnPieChart
            title="Platform Type"
            description="Web vs Mobile usage"
            data={platformTypeData}
          />
        </motion.div>

        <motion.div
          {...CHART_ANIMATION_CONFIG}
          transition={{ ...CHART_ANIMATION_CONFIG.transition, delay: 1.1 }}
          className={`${CHART_DIMENSIONS.area.width} ${CHART_DIMENSIONS.area.height} flex-shrink-0 select-none pointer-events-none`}
        >
          <ShadcnAreaChart
            title="Source Trends"
            description="Percentage changes over time"
            data={chartData?.areaData}
            sources={chartData?.sources || []}
          />
        </motion.div>
      </div>

      <motion.div
        {...CHART_ANIMATION_CONFIG}
        transition={{ ...CHART_ANIMATION_CONFIG.transition, delay: 1.3 }}
        className="w-full max-w-md"
      >
        <DonationComponent topUsers={userData} />
      </motion.div>
    </div>
  );

  const renderUserCharts = () => (
    <div className="flex flex-col xl:flex-row gap-6 items-center justify-center min-h-full">
      <motion.div
        {...CHART_ANIMATION_CONFIG}
        transition={{ ...CHART_ANIMATION_CONFIG.transition, delay: 0.3 }}
        className={`${CHART_DIMENSIONS.bar.width} ${CHART_DIMENSIONS.bar.height} flex-shrink-0 select-none pointer-events-none`}
      >
        <UserFavoriteAppsChart
          title="Favorite Apps"
          description="Top 5 most used apps"
          data={userFavoriteApps ?? undefined}
        />
      </motion.div>

      <motion.div
        {...CHART_ANIMATION_CONFIG}
        transition={{ ...CHART_ANIMATION_CONFIG.transition, delay: 0.5 }}
        className={`${CHART_DIMENSIONS.bar.width} ${CHART_DIMENSIONS.bar.height} flex-shrink-0 select-none pointer-events-none`}
      >
        <MiniAppUsageChart
          title="Usage Trends"
          description="Daily app usage over 7 days"
          data={miniAppUsage ?? undefined}
        />
      </motion.div>
    </div>
  );

  return (
    <motion.div {...ANIMATION_CONFIG} className="relative z-10 w-full h-full flex items-center justify-center px-4 select-none">
      <div className="absolute top-4 left-4 z-20 pointer-events-auto">
        <LiquidGlassButton onClick={onBack} icon={<ArrowLeft className="w-4 h-4" />} />
      </div>

      <div className="w-full h-full overflow-y-auto pt-20 pb-8 select-none">
        {searchType === 'miniapp' && renderMiniappCharts()}
        {searchType === 'user' && renderUserCharts()}
        {!searchType && (
          <div className="flex items-center justify-center min-h-full">
            <p className="text-white/60">No data available</p>
          </div>
        )}
      </div>
    </motion.div>
  );
}