"use client"

import { useProfile } from "@/app/context/ProfileContext"
import { ChevronDown, Sparkles } from "lucide-react"
import { motion } from "framer-motion"

export default function ProfileButton() {
  const { currentProfile, setShowProfileSelector } = useProfile()

  if (!currentProfile) return null

  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={() => setShowProfileSelector(true)}
      className="flex items-center gap-3 pl-1.5 pr-4 py-1.5 rounded-full bg-white/[0.03] backdrop-blur-md border border-white/10 hover:border-primary/50 hover:bg-white/[0.08] transition-all group relative"
      aria-label="Switch profile"
    >
      {/* 1. AVATAR WITH CINEMATIC DEPTH */}
      <div className="relative group-hover:rotate-6 transition-transform duration-500">
        <div
          className={`relative w-8 h-8 rounded-full bg-gradient-to-br ${currentProfile.color || 'from-primary to-primary-foreground'} flex items-center justify-center text-white text-[10px] font-black shadow-[0_0_15px_rgba(0,0,0,0.4)] overflow-hidden z-10`}
        >
          {currentProfile.initial}
          
          {/* Animated Lens Flare on Hover */}
          <motion.div 
            initial={{ x: '-100%', skewX: -20 }}
            whileHover={{ x: '200%' }}
            transition={{ duration: 0.6 }}
            className="absolute inset-0 bg-white/30 w-1/2 blur-sm"
          />
        </div>

        {/* Online/Active Status Dot */}
        <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 border-2 border-background rounded-full z-20 shadow-sm" />
      </div>

      {/* 2. PROFILE NAME & ICON */}
      <div className="flex items-center gap-2">
        <div className="flex flex-col items-start leading-none">
          <span className="text-white text-[10px] font-black uppercase tracking-[0.2em] hidden md:inline">
            {currentProfile.name}
          </span>
          <span className="text-[8px] text-primary font-bold uppercase tracking-widest hidden md:inline opacity-0 group-hover:opacity-100 transition-opacity">
            Active
          </span>
        </div>
        
        <ChevronDown 
          size={12} 
          className="text-muted-foreground group-hover:text-primary transition-all group-hover:rotate-180 duration-500" 
        />
      </div>

      {/* 3. SUBTLE HOVER GLOW */}
      <div className="absolute inset-0 rounded-full bg-primary/0 group-hover:bg-primary/5 blur-md transition-colors -z-10" />
    </motion.button>
  )
}