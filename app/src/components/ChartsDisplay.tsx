"use client";

import { motion } from "framer-motion";
import ShadcnPieChart from "./ShadcnPieChart";
import ShadcnAreaChart from "./ShadcnAreaChart";
import LiquidGlassButton from "./LiquidGlassButton";
import { ArrowLeft } from "lucide-react";

interface ChartsDisplayProps {
  chartData: {
    pieData: any[];
    areaData: any[];
    sources: string[];
  } | null;
  onBack: () => void;
}

export default function ChartsDisplay({ chartData, onBack }: ChartsDisplayProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.3, y: 50 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.3, y: -50 }}
      transition={{
        duration: 1.2,
        ease: [0.25, 0.46, 0.45, 0.94]
      }}
      className="relative z-10 w-full max-w-4xl"
    >
      {/* Back Button */}
      <div className="absolute top-0 left-4 z-20">
        <LiquidGlassButton
          onClick={onBack}
          icon={<ArrowLeft className="w-4 h-4" />}
        />
      </div>

      {/* Charts Container */}
      <div className="pt-16 pb-4 h-[calc(100vh-6rem)] overflow-y-auto">
        <div className="min-w-max px-4">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Pie Chart */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="w-[320px] h-[500px] flex-shrink-0"
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
              transition={{ duration: 0.8, delay: 0.5 }}
              className="w-[320px] h-[400px] flex-shrink-0"
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
      </div>
    </motion.div>
  );
}