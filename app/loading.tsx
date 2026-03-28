"use client";

import { motion } from "motion/react";
import { Crosshair } from "lucide-react";

export default function Loading() {
  return (
    // Full screen dark background matching your theme
    <div className="fixed inset-0 z-[99999] bg-[#1c1c1d] flex flex-col items-center justify-center min-h-screen">
      
      <div className="flex items-center gap-4">
        {/* 1. Animated Logo Icon */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="relative"
        >
          {/* The Green Rounded Box matching your image */}
          <div className="bg-[#0b6c36] p-3 rounded-2xl relative z-10">
            <motion.div
              // This makes the crosshair slowly pulse/spin like it's scanning
              animate={{ rotate: 360 }}
              transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
            >
              <Crosshair className="text-white w-10 h-10" strokeWidth={2.5} />
            </motion.div>
          </div>
          
          {/* Subtle glow effect behind the logo */}
          <motion.div 
            animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0.8, 0.5] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="absolute inset-0 bg-[#0b6c36] rounded-2xl blur-xl z-0"
          />
        </motion.div>

        {/* 2. Animated YOUHUNT Text */}
        <motion.div
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2, ease: "easeOut" }}
        >
          <span className="font-serif text-5xl font-black tracking-tighter uppercase italic">
            <span className="text-white">you</span>
            <span className="text-[#0b6c36] font-light">hunt</span>
          </span>
        </motion.div>
      </div>

      {/* 3. Loading Progress Bar (Optional, adds a nice touch) */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="mt-12 w-48 h-1 bg-white/10 rounded-full overflow-hidden"
      >
        <motion.div 
          className="h-full bg-[#0b6c36]"
          initial={{ width: "0%" }}
          animate={{ width: "100%" }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
        />
      </motion.div>

    </div>
  );
}