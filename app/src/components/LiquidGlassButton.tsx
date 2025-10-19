"use client";

import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";

interface LiquidGlassButtonProps {
  onClick: () => void;
  children?: React.ReactNode;
  icon?: React.ReactNode;
  className?: string;
}

export default function LiquidGlassButton({
  onClick,
  children,
  icon,
  className = ""
}: LiquidGlassButtonProps) {
  return (
    <motion.button
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{
        duration: 0.6,
        ease: "easeOut"
      }}
      onClick={onClick}
      className={`liquid-glass inline-flex items-center justify-center px-4 py-2 text-white text-sm font-medium rounded-lg hover:bg-white/30 transition-all duration-300 select-none ${className}`}
    >
      {icon || <ArrowLeft className="w-4 h-4" />}
      {children}
    </motion.button>
  );
}