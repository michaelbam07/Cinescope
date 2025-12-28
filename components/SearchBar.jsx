"use client"

import { useState, useEffect, useRef } from "react"
import { Search, X, Command } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

export default function SearchBar({ onSearch }) {
  const [query, setQuery] = useState("")
  const inputRef = useRef(null)

  // Keyboard shortcut listener (CMD/CTRL + K to focus)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault()
        inputRef.current?.focus()
      }
    }
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [])

  const handleChange = (e) => {
    const val = e.target.value
    setQuery(val)
    onSearch(val)
  }

  const clearSearch = () => {
    setQuery("")
    onSearch("")
    inputRef.current?.focus()
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative w-full max-w-2xl mx-auto mb-12 group"
    >
      {/* Search Icon with Animated Pulse */}
      <div className="absolute left-5 top-1/2 -translate-y-1/2 z-10">
        <Search 
          size={18} 
          className="text-muted-foreground group-focus-within:text-primary group-focus-within:scale-110 transition-all duration-300" 
        />
      </div>

      <input
        ref={inputRef}
        type="text"
        placeholder="Search titles, cast, or genres..."
        value={query}
        onChange={handleChange}
        className="w-full pl-14 pr-24 py-5 bg-white/[0.03] backdrop-blur-xl border border-white/10 rounded-2xl 
                   text-white placeholder:text-white/20 outline-none transition-all duration-500
                   focus:bg-white/[0.07] focus:border-primary/40 focus:ring-4 focus:ring-primary/5
                   group-hover:bg-white/[0.05] group-hover:border-white/20 shadow-2xl"
      />

      {/* Right-side Utilities */}
      <div className="absolute right-5 top-1/2 -translate-y-1/2 flex items-center gap-3">
        <AnimatePresence>
          {query ? (
            <motion.button
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              onClick={clearSearch}
              className="p-1.5 rounded-lg bg-white/10 text-white/60 hover:text-white hover:bg-red-500/20 transition-all"
            >
              <X size={16} />
            </motion.button>
          ) : (
            <div className="hidden md:flex items-center gap-1 px-2 py-1 rounded border border-white/10 bg-white/5 text-[10px] font-black text-white/30 uppercase tracking-tighter">
              <Command size={10} /> K
            </div>
          )}
        </AnimatePresence>
      </div>

      {/* Brutalist Focus Border (Bottom Only) */}
      <div className="absolute -bottom-0 left-6 right-6 h-[2px] bg-gradient-to-r from-transparent via-primary to-transparent opacity-0 group-focus-within:opacity-100 blur-[2px] transition-all duration-700" />
    </motion.div>
  )
}