"use client";

import { Search } from "lucide-react";
import { useState } from "react";

export default function LiquidGlassSearchBar() {
  const [searchValue, setSearchValue] = useState("");

  return (
    <div
      className="flex items-center justify-center min-h-screen w-screen relative"
      style={{
        backgroundImage: "url('https://images.unsplash.com/photo-1630061937831-5b8bc0a58548?w=800&auto=format&fit=crop&q=90')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <div className="relative w-80 z-10">
        <div className="relative">
          <input
            type="text"
            placeholder="Search anything..."
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            className="pl-12 pr-4 py-3 w-full text-white text-sm bg-black/20 border border-white/50 backdrop-blur-sm rounded-full shadow-[inset_0_1px_0px_rgba(255,255,255,0.75),0_0_9px_rgba(0,0,0,0.2),0_3px_8px_rgba(0,0,0,0.15)] placeholder:text-white/70 focus:bg-white/15 focus:outline-none focus:ring-2 focus:ring-white/30 transition-all duration-300 relative before:absolute before:inset-0 before:rounded-lg before:bg-gradient-to-br before:from-white/60 before:via-transparent before:to-transparent before:opacity-70 before:pointer-events-none after:absolute after:inset-0 before:rounded-lg after:bg-gradient-to-tl after:from-white/30 after:via-transparent after:to-transparent after:opacity-50 after:pointer-events-none"
          />
          <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white/70">
            <Search size={16} />
          </div>
        </div>
      </div>
    </div>
  );
}