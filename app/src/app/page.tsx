"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import sdk from "@farcaster/miniapp-sdk";
import LandingScreen from "@/components/LandingScreen";
import LiquidGlassSearchBar from "@/components/LiquidGlassSearchBar";
import ChartsDisplay from "@/components/ChartsDisplay";
import type {
  ChartData,
  AppResponse,
  PieDatum,
  AreaDataPoint,
  SourceRecord
} from "@/types/charts";

export default function Home() {
  const [currentScreen, setCurrentScreen] = useState<"landing" | "search">("landing");
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<"success" | "error" | null>(null);
  const [chartData, setChartData] = useState<ChartData | null>(null);
  const [showCharts, setShowCharts] = useState(false);

  // Farcaster Mini App Integration
  useEffect(() => {
    const load = async () => {
      await sdk.context;
      sdk.actions.ready();
    };
    if (sdk) {
      load();
    }
  }, []);

  // Auto transition after 3 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsTransitioning(true);

      setTimeout(() => {
        setCurrentScreen("search");
        setIsTransitioning(false);
      }, 800);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  const handleBack = () => {
    setShowCharts(false);
    setResult(null);
    setChartData(null);
    setSearchValue("");
  };

  const handleSearch = async () => {
    if (!searchValue.trim()) return;

    setIsLoading(true);
    setResult(null);

    try {
  const response = await fetch(`/api/rest/app/${encodeURIComponent(searchValue.trim())}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
  const data: AppResponse = await response.json();
        console.log('API Response:', data);

        // Use our API route's structured response
        if (data.success && data.data && data.data.sources && data.data.sources.length > 0) {
          setResult("success");

          // Aggregate source data for pie chart
          const sourceCounts: Record<string, number> = {};
          const sourcesList: SourceRecord[] = data.data.sources;

          sourcesList.forEach((source) => {
            if (source.source_type) {
              sourceCounts[source.source_type] = (sourceCounts[source.source_type] || 0) + 1;
            }
          });

          const totalCount = Object.values(sourceCounts).reduce((sum: number, count: number) => sum + count, 0);
          const aggregatedData: PieDatum[] = Object.entries(sourceCounts).map(([source, count]) => ({
            source,
            count,
            percentage: Math.round((count / totalCount) * 100)
          }));

          // Generate time series data for area chart (last 7 days)
          const timeSeriesData: AreaDataPoint[] = [];
          const sources = Object.keys(sourceCounts);

          for (let i = 6; i >= 0; i--) {
            const date = new Date();
            date.setDate(date.getDate() - i);
            const dateStr = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

            const dataPoint: AreaDataPoint = { date: dateStr };
            sources.forEach(source => {
              // Generate realistic percentage data that sums to 100%
              const basePercentage = (sourceCounts[source] / totalCount) * 100;
              const variation = (Math.random() - 0.5) * 20; // ±10% variation
              dataPoint[source] = Math.max(5, Math.min(95, basePercentage + variation));
            });

            // Normalize to ensure percentages sum to 100
            const total = sources.reduce((sum, source) => {
              const rawValue = dataPoint[source];
              const numericValue = typeof rawValue === 'number' ? rawValue : Number(rawValue);
              return Number.isFinite(numericValue) ? sum + numericValue : sum;
            }, 0);
            sources.forEach(source => {
              const rawValue = dataPoint[source];
              const numericValue = typeof rawValue === 'number' ? rawValue : Number(rawValue);
              dataPoint[source] = total > 0 ? Math.round((numericValue / total) * 100) : 0;
            });

            timeSeriesData.push(dataPoint);
          }

          setChartData({
            pieData: aggregatedData,
            areaData: timeSeriesData,
            sources: sources
          });
          setShowCharts(true);
          console.log('Miniapp data:', data.data);
        } else {
          // No data found for this miniapp ID or empty response
          setResult("error");
          setChartData(null);
        }
      } else {
        console.error('API Error:', response.status, response.statusText);
        setResult("error");
      }
    } catch (error) {
      console.error('Search error:', error);
      setResult("error");
      setChartData(null);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen w-full bg-black overflow-hidden">
      <AnimatePresence mode="wait">
        {currentScreen === "landing" && (
          <motion.div
            key="landing"
            initial={{ opacity: 1, scale: 1 }}
            animate={isTransitioning ? { opacity: 0, scale: 3 } : { opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 3 }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
            className="absolute inset-0 z-10"
          >
            <LandingScreen />
          </motion.div>
        )}

        {currentScreen === "search" && (
          <motion.div
            key="search"
            initial={{ opacity: 0, scale: 0.3 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="absolute inset-0 z-20"
          >
            <AnimatePresence mode="wait">
              {!showCharts ? (
                <LiquidGlassSearchBar
                  searchValue={searchValue}
                  onSearchChange={setSearchValue}
                  onSearch={handleSearch}
                  isLoading={isLoading}
                  showError={result === "error"}
                />
              ) : (
                <ChartsDisplay
                  chartData={chartData}
                  onBack={handleBack}
                />
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}