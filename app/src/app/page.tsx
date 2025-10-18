"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import sdk from "@farcaster/miniapp-sdk";
import LandingScreen from "@/components/LandingScreen";
import LiquidGlassSearchBar from "@/components/LiquidGlassSearchBar";

export default function Home() {
  const [currentScreen, setCurrentScreen] = useState<"landing" | "search">("landing");
  const [isTransitioning, setIsTransitioning] = useState(false);

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
                  <LiquidGlassSearchBar />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}