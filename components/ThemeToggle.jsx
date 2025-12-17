"use client"

import { useTheme } from "@/app/context/ThemeContext"
import { Sun, Moon } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

export const ThemeToggle = () => {
  const { isDark, toggleTheme } = useTheme()

  return (
    <button
      onClick={toggleTheme}
      className="relative p-2 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all duration-300 group overflow-hidden"
      aria-label="Toggle theme"
    >
      <div className="relative w-6 h-6 flex items-center justify-center">
        <AnimatePresence mode="wait" initial={false}>
          {isDark ? (
            <motion.div
              key="sun"
              initial={{ y: 20, opacity: 0, rotate: 45 }}
              animate={{ y: 0, opacity: 1, rotate: 0 }}
              exit={{ y: -20, opacity: 0, rotate: -45 }}
              transition={{ duration: 0.2, ease: "easeInOut" }}
            >
              <Sun size={20} className="text-yellow-400 fill-yellow-400/20" />
            </motion.div>
          ) : (
            <motion.div
              key="moon"
              initial={{ y: 20, opacity: 0, rotate: 45 }}
              animate={{ y: 0, opacity: 1, rotate: 0 }}
              exit={{ y: -20, opacity: 0, rotate: -45 }}
              transition={{ duration: 0.2, ease: "easeInOut" }}
            >
              <Moon size={20} className="text-indigo-400 fill-indigo-400/20" />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Subtle background glow on hover */}
      <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity" />
    </button>
  )
}