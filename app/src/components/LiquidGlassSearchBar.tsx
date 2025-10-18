"use client";

import { motion } from "framer-motion";

interface LiquidGlassSearchBarProps {
  searchValue: string;
  onSearchChange: (value: string) => void;
  onSearch: () => void;
  isLoading: boolean;
  showError: boolean;
}

export default function LiquidGlassSearchBar({
  searchValue,
  onSearchChange,
  onSearch,
  isLoading,
  showError
}: LiquidGlassSearchBarProps) {
  return (
    <div className="flex items-center justify-center min-h-screen w-full relative bg-black p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.3, y: 50 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{
          duration: 1.2,
          ease: [0.25, 0.46, 0.45, 0.94]
        }}
        className="relative z-10 px-4 w-64 sm:w-72 md:w-80 lg:w-96"
      >
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: "100%" }}
          transition={{
            duration: 0.8,
            delay: 0.3,
            ease: "easeOut"
          }}
          className="relative overflow-hidden"
        >
          <input
            type="text"
            placeholder="Enter miniapp domain..."
            value={searchValue}
            onChange={(e) => onSearchChange(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                onSearch();
              }
            }}
            disabled={isLoading}
            className="pl-8 pr-12 py-2 w-full text-white text-sm bg-black/20 border border-white/50 backdrop-blur-sm rounded-full shadow-[inset_0_1px_0px_rgba(255,255,255,0.75),0_0_9px_rgba(0,0,0,0.2),0_3px_8px_rgba(0,0,0,0.15)] placeholder:text-white/70 focus:bg-white/15 focus:outline-none focus:ring-2 focus:ring-white/30 transition-all duration-300 relative before:absolute before:inset-0 before:rounded-lg before:bg-gradient-to-br before:from-white/60 before:via-transparent before:to-transparent before:opacity-70 before:pointer-events-none after:absolute after:inset-0 before:rounded-lg after:bg-gradient-to-tl after:from-white/30 after:via-transparent after:to-transparent after:opacity-50 after:pointer-events-none disabled:opacity-50"
          />
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{
              duration: 0.6,
              delay: 0.6,
              ease: "easeOut"
            }}
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/70"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-3 h-3 sm:w-4 sm:h-4">
              <path fillRule="evenodd" d="M10.5 3.75a6.75 6.75 0 1 0 0 13.5 6.75 6.75 0 0 0 0-13.5ZM2.25 10.5a8.25 8.25 0 1 1 14.59 5.28l4.69 4.69a.75.75 0 1 1-1.06 1.06l-4.69-4.69A8.25 8.25 0 0 1 2.25 10.5Z" clipRule="evenodd" />
            </svg>
          </motion.div>
          <motion.button
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{
              duration: 0.6,
              delay: 0.8,
              ease: "easeOut"
            }}
            onClick={onSearch}
            disabled={isLoading}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/70 hover:text-white transition-colors duration-200 bg-transparent border-none cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <div className="w-3 h-3 sm:w-4 sm:h-4 animate-spin rounded-full border border-white/20 border-t-transparent"></div>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-3 h-3 sm:w-4 sm:h-4">
                <path fillRule="evenodd" d="M3.75 12a.75.75 0 0 1 .75-.75h13.19l-5.47-5.47a.75.75 0 0 1 1.06-1.06l6.75 6.75a.75.75 0 0 1 0 1.06l-6.75 6.75a.75.75 0 1 1-1.06-1.06l5.47-5.47H4.5a.75.75 0 1-.75-.75Z" clipRule="evenodd" />
              </svg>
            )}
          </motion.button>
        </motion.div>

        {/* Result Display for errors */}
        {showError && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 translate-y-full mt-2"
          >
            <div className="liquid-glass rounded-md px-4 py-2 text-center max-w-xs">
              <p className="text-white/80 text-xs font-medium">No ID found!</p>
              <p className="text-white/60 text-xs opacity-80 mt-1">Try searching for a different app ID</p>
            </div>
          </motion.div>
        )}
      </motion.div>

      {/* Animated background particles */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.3 }}
        transition={{ duration: 2, delay: 0.8 }}
        className="absolute inset-0 pointer-events-none"
      >
        <div className="absolute top-20 left-20 w-64 h-64 bg-purple-500 rounded-full opacity-10 blur-3xl"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-blue-500 rounded-full opacity-10 blur-3xl"></div>
      </motion.div>
    </div>
  );
}
