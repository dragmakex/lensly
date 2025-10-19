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
  const [userData, setUserData] = useState<Array<{ user_id: string; user_name: string; count: number }> | null>(null);
  const [showCharts, setShowCharts] = useState(false);
  const [searchType, setSearchType] = useState<'miniapp' | 'user' | null>(null);
  const [userFavoriteApps, setUserFavoriteApps] = useState<Array<{ miniapp_id: string; count: number }> | null>(null);
  const [miniAppUsage, setMiniAppUsage] = useState<Array<{ date: string; count: number }> | null>(null);
  const [clientTypeData, setClientTypeData] = useState<Array<{ source: string; count: number; percentage: number }> | null>(null);
  const [platformTypeData, setPlatformTypeData] = useState<Array<{ source: string; count: number; percentage: number }> | null>(null);
  const [isSDKLoaded, setIsSDKLoaded] = useState(false);
  // Farcaster Mini App Integration
  useEffect(() => {
    const load = async () => {
      const frameContext = await sdk.context;
      console.log("Farcaster Mini App Context:", frameContext);
      sdk.actions.ready();
    };
    if (sdk && !isSDKLoaded) {
      setIsSDKLoaded(true);
      load();
    }
  }, [isSDKLoaded]);

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
    setUserData(null);
    setSearchType(null);
    setUserFavoriteApps(null);
    setMiniAppUsage(null);
    setClientTypeData(null);
    setPlatformTypeData(null);
    setSearchValue("");
  };

  const handleSearch = async () => {
    if (!searchValue.trim()) return;

    // For miniapp ID, sanitize: lowercase and remove whitespaces
    // For username, keep as is (no sanitization)
    const sanitizedMiniappId = searchValue.trim().toLowerCase().replace(/\s+/g, '');
    const username = searchValue.trim(); // Keep original for username search

    setIsLoading(true);
    setResult(null);
    setSearchType(null);
    setChartData(null);
    setUserData(null);
    setUserFavoriteApps(null);
    setMiniAppUsage(null);
    setClientTypeData(null);
    setPlatformTypeData(null);

    try {
      // First try miniapp ID endpoint
      console.log(`Trying miniapp ID: ${sanitizedMiniappId}`);
      const miniappResponse = await fetch(`/api/rest/app/${encodeURIComponent(sanitizedMiniappId)}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (miniappResponse.ok) {
        const data: AppResponse = await miniappResponse.json();
        console.log('Miniapp API Response:', data);

        if (data.success && data.data && data.data.sources && data.data.sources.length > 0) {
          setResult("success");
          setSearchType('miniapp');
          processMiniappData(data, sanitizedMiniappId);
          setShowCharts(true);
          return;
        }
      }

      // If miniapp ID search failed, try username endpoint
      console.log(`Trying username: ${username}`);
      const userResponse = await fetch(`/api/rest/user/${encodeURIComponent(username)}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (userResponse.ok) {
        const userData = await userResponse.json();
        console.log('User API Response:', userData);

        if (userData.success && userData.data && userData.data.user) {
          setResult("success");
          setSearchType('user');
          await processUserData(userData);
          setShowCharts(true);
          return;
        }
      }

      // If both searches failed, show error
      console.log('No results found for either miniapp ID or username');
      setResult("error");

    } catch (error) {
      console.error('Search error:', error);
      setResult("error");
    } finally {
      setIsLoading(false);
    }
  };

  const processMiniappData = async (data: AppResponse, miniappId: string) => {
    // Aggregate source data for pie chart
    const sourceCounts: Record<string, number> = {};
    const sourcesList: SourceRecord[] = data.data?.sources || [];

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

    // Generate time series data from recorded_at timestamps
    const timeSeriesData: AreaDataPoint[] = [];
    const sources = Object.keys(sourceCounts);
    const dataByDate: Record<string, Record<string, number>> = {};

    sourcesList.forEach((source) => {
      if (source.source_type && source.recorded_at) {
        const date = new Date(source.recorded_at);
        const dateStr = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

        if (!dataByDate[dateStr]) {
          dataByDate[dateStr] = {};
        }

        dataByDate[dateStr][source.source_type] = (dataByDate[dateStr][source.source_type] || 0) + 1;
      }
    });

    // Convert to area chart format and sort by date
    const sortedDates = Object.keys(dataByDate).sort((a, b) => {
      const dateA = new Date(a);
      const dateB = new Date(b);
      return dateA.getTime() - dateB.getTime();
    });

    const last7Days = sortedDates.slice(-7).reverse();

    last7Days.forEach(dateStr => {
      const dayData = dataByDate[dateStr];
      const dataPoint: AreaDataPoint = { date: dateStr };

      sources.forEach(source => {
        dataPoint[source] = dayData[source] || 0;
      });

      timeSeriesData.push(dataPoint);
    });

    // Calculate client type distribution (Base vs Farcaster)
    const clientTypeCounts: Record<string, number> = {};
    sourcesList.forEach((source) => {
      const clientType = source.source_type === 'launcher' ? 'Base' : 'Farcaster';
      clientTypeCounts[clientType] = (clientTypeCounts[clientType] || 0) + 1;
    });

    const totalClientCount = Object.values(clientTypeCounts).reduce((sum: number, count: number) => sum + count, 0);
    const clientTypeAggregated = Object.entries(clientTypeCounts).map(([clientType, count]) => ({
      source: clientType,
      count,
      percentage: Math.round((count / totalClientCount) * 100)
    }));

    // Calculate platform type distribution (Web vs Mobile)
    const platformTypeCounts: Record<string, number> = {};
    sourcesList.forEach((source) => {
      const platformType = source.client_miniapp_platform_type === 'web' ? 'Web' :
                         source.client_miniapp_platform_type === 'mobile' ? 'Mobile' : 'Unknown';
      platformTypeCounts[platformType] = (platformTypeCounts[platformType] || 0) + 1;
    });

    const totalPlatformCount = Object.values(platformTypeCounts).reduce((sum: number, count: number) => sum + count, 0);
    const platformTypeAggregated = Object.entries(platformTypeCounts).map(([platformType, count]) => ({
      source: platformType,
      count,
      percentage: Math.round((count / totalPlatformCount) * 100)
    }));

    setChartData({
      pieData: aggregatedData,
      areaData: timeSeriesData,
      sources: sources
    });

    setClientTypeData(clientTypeAggregated);
    setPlatformTypeData(platformTypeAggregated);

    // Fetch top users data
    try {
      const usersResponse = await fetch(`/api/rest/app/${encodeURIComponent(miniappId)}/users`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (usersResponse.ok) {
        const usersData = await usersResponse.json();
        if (usersData.success && usersData.data) {
          setUserData(usersData.data);
        } else {
          setUserData([]);
        }
      } else {
        setUserData([]);
      }
    } catch (userError) {
      console.error('Users fetch error:', userError);
      setUserData([]);
    }
  };

  const processUserData = async (userData: {
    data: {
      user: {
        sources: Array<{
          miniapp_id: string;
          recorded_at: string;
        }>;
      };
      topApps: Array<{
        miniapp_id: string;
        count: number;
      }>;
    };
  }) => {
    const user = userData.data.user;
    // const topApps = userData.data.topApps || []; // This is assigned but never used - removing for lint

    // Process user's sources to get favorite miniapps
    if (user.sources && user.sources.length > 0) {
      // Count occurrences of each miniapp_id in sources
      const miniAppCounts: Record<string, number> = {};

      user.sources.forEach((source) => {
        if (source.miniapp_id) {
          miniAppCounts[source.miniapp_id] = (miniAppCounts[source.miniapp_id] || 0) + 1;
        }
      });

      // Convert to array and sort by count (descending) to get favorite apps
      const favoriteApps = Object.entries(miniAppCounts)
        .map(([miniapp_id, count]) => ({
          miniapp_id,
          count
        }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 5); // Top 5 favorite apps

      setUserFavoriteApps(favoriteApps);
      console.log('User favorite miniapps:', favoriteApps);

      // Generate miniapp usage data from user's sources
      const usageByDate: Record<string, number> = {};

      user.sources.forEach((source) => {
        if (source.recorded_at) {
          const date = new Date(source.recorded_at);
          const dateStr = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
          usageByDate[dateStr] = (usageByDate[dateStr] || 0) + 1;
        }
      });

      // Sort dates and get last 7 days
      const sortedDates = Object.keys(usageByDate).sort((a, b) => {
        const dateA = new Date(a);
        const dateB = new Date(b);
        return dateA.getTime() - dateB.getTime();
      });

      const last7Days = sortedDates.slice(-7).reverse();

      const usageData = last7Days.map(date => ({
        date,
        count: usageByDate[date] || 0
      }));

      setMiniAppUsage(usageData);
      console.log('User daily usage:', usageData);
    } else {
      setUserFavoriteApps([]);
      setMiniAppUsage([]);
      console.log('No sources found for user');
    }
  };

  return (
    <div className="relative min-h-screen w-full bg-black overflow-hidden select-none">
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
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="absolute inset-0 z-20 w-full h-full overflow-hidden"
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
                  userData={userData}
                  onBack={handleBack}
                  searchType={searchType}
                  userFavoriteApps={userFavoriteApps}
                  miniAppUsage={miniAppUsage}
                  clientTypeData={clientTypeData}
                  platformTypeData={platformTypeData}
                />
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}