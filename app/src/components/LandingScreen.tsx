"use client";

import { motion } from "framer-motion";
import Logo from "./Logo";

export default function LandingScreen() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen w-full bg-black">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="relative z-10"
      >
        <motion.div
          animate={{
            rotate: [0, 5, -5, 0],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="mb-8"
        >
          <div className="w-24 h-24 relative flex items-center justify-center">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-blue-600 rounded-2xl opacity-30 blur-xl"></div>
            <div className="relative flex items-center justify-center">
              <Logo size={40} />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="text-center"
        >
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400 px-4 text-center">
            Lensly
          </h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.6 }}
            className="text-base sm:text-lg md:text-xl lg:text-2xl text-gray-300 mb-6 sm:mb-8 px-4 text-center max-w-md"
          >
            We connect brands with users
          </motion.p>

          </motion.div>
      </motion.div>
    </div>
  );
}
