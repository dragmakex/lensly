"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import ShadcnPieChart from "./ShadcnPieChart";
import ShadcnAreaChart from "./ShadcnAreaChart";
import TopUsersBarChart from "./TopUsersBarChart";
import LiquidGlassButton from "./LiquidGlassButton";
import { ArrowLeft } from "lucide-react";
import type { ChartData, TopUser } from "@/types/charts";

interface ChartsDisplayProps {
  chartData: ChartData | null;
  userData: TopUser[] | null;
  onBack: () => void;
}

export default function ChartsDisplay({ chartData, userData, onBack }: ChartsDisplayProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -50 }}
      transition={{
        duration: 1.2,
        ease: [0.25, 0.46, 0.45, 0.94]
      }}
      className="relative z-10 w-full h-full flex items-center justify-center px-4"
    >
      {/* Back Button */}
      <div className="absolute top-4 left-4 z-20">
        <LiquidGlassButton
          onClick={onBack}
          icon={<ArrowLeft className="w-4 h-4" />}
        />
      </div>

      {/* Charts Container */}
      <div className="w-full h-full overflow-y-auto pt-20 pb-8">
        <div className="flex flex-col xl:flex-row gap-6 items-center justify-center min-h-full">
          {/* Top Users Bar Chart - New */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="w-[320px] h-[450px] flex-shrink-0"
          >
            <TopUsersBarChart
              title="Top Farcaster IDs"
              description="Most frequent FIDs by source data"
              data={userData ?? undefined}
            />
          </motion.div>

          {/* Pie Chart */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="w-[320px] h-[480px] flex-shrink-0"
          >
            <ShadcnPieChart
              title="Source Distribution"
              description="Percentage by source type"
              data={chartData?.pieData}
            />
          </motion.div>

          {/* Area Chart */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.7 }}
            className="w-[320px] h-[550px] flex-shrink-0"
          >
            <ShadcnAreaChart
              title="Source Trends"
              description="Percentage changes over time"
              data={chartData?.areaData}
              sources={chartData?.sources || []}
            />
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}