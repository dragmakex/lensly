"use client";

import { motion } from "framer-motion";
import Logo from "./Logo";

export default function LandingScreen() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen w-screen bg-black">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="relative z-10"
      >
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="relative text-center"
        >
          {/* Logo positioned over title */}
          <motion.div
            animate={{
              rotate: [0, 5, -5, 0],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="absolute -top-22 -left-16 w-40 h-40 flex items-center justify-center"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-blue-600 rounded-2xl opacity-25 blur-lg"></div>
            <Logo size={72} />
          </motion.div>

          <h1 className="text-5xl font-bold text-white mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">
            Lensly
          </h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.6 }}
            className="text-xl text-gray-300 mb-8"
          >
            We connect brands with users
          </motion.p>
        </motion.div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.3 }}
        transition={{ delay: 1, duration: 2 }}
        className="absolute inset-0 pointer-events-none"
      >
        <div className="absolute top-20 left-20 w-64 h-64 bg-blue-500 rounded-full opacity-10 blur-3xl"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-purple-500 rounded-full opacity-10 blur-3xl"></div>
      </motion.div>
    </div>
  );
}
