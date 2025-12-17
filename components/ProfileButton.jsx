"use client"

import { useProfile } from "@/app/context/ProfileContext"
import { ChevronDown } from "lucide-react"
import { motion } from "framer-motion"

export default function ProfileButton() {
  const { currentProfile, setShowProfileSelector } = useProfile()

  if (!currentProfile) return null

  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={() => setShowProfileSelector(true)}
      className="flex items-center gap-3 pl-1 pr-3 py-1 rounded-full glass-card border-white/10 hover:bg-white/10 transition-all group"
      aria-label="Switch profile"
    >
      {/* Avatar with dynamic gradient and shimmer */}
      <div
        className={`relative w-8 h-8 rounded-full bg-gradient-to-br ${currentProfile.color} flex items-center justify-center text-white text-xs font-black shadow-lg overflow-hidden`}
      >
        {currentProfile.initial}
        
        {/* Subtle glass shimmer effect on hover */}
        <div className="absolute inset-0 bg-gradient-to-tr from-white/20 to-transparent opacity-0 group-hover:opacity-40 transition-opacity" />
      </div>

      <div className="flex items-center gap-2">
        <span className="text-foreground text-xs font-bold uppercase tracking-widest hidden md:inline">
          {currentProfile.name}
        </span>
        <ChevronDown 
          size={14} 
          className="text-muted-foreground group-hover:text-primary transition-colors group-hover:rotate-180 duration-300" 
        />
      </div>
    </motion.button>
  )
}