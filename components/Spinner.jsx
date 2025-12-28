"use client"

import { motion } from "framer-motion"

export default function Spinner({ size = "md", color = "primary" }) {
  const sizes = {
    sm: "w-6 h-6 border-2",
    md: "w-10 h-10 border-3",
    lg: "w-16 h-16 border-4"
  }

  return (
    <div className="flex flex-col items-center justify-center gap-4">
      <div className="relative">
        {/* 1. Outer Rotating Ring (Brutalist style) */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
          className={`${sizes[size]} rounded-full border-white/10 border-t-primary shadow-[0_0_15px_rgba(var(--primary),0.3)]`}
        />

        {/* 2. Inner Pulsing Core (The "Lens" effect) */}
        <motion.div
          animate={{ scale: [0.8, 1.1, 0.8], opacity: [0.3, 0.6, 0.3] }}
          transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
          className="absolute inset-0 m-auto w-2 h-2 bg-primary rounded-full blur-[2px]"
        />
      </div>

      {/* 3. "Loading" Text in your site's font style */}
      <motion.span 
        initial={{ opacity: 0 }}
        animate={{ opacity: [0, 1, 0] }}
        transition={{ repeat: Infinity, duration: 2 }}
        className="text-[10px] font-black uppercase tracking-[0.5em] text-white/40 italic ml-2"
      >
        Processing...
      </motion.span>
    </div>
  )
}