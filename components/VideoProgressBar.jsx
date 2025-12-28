"use client"

import { useMovies } from "@/app/context/MovieContext"
import { Play } from "lucide-react"
import { motion } from "framer-motion"

export default function VideoProgressBar({ id, seasonNumber, episodeNumber, videoDuration = 0 }) {
  const { progress } = useMovies()

  const progressKey = seasonNumber && episodeNumber
    ? `${id}-${seasonNumber}-${episodeNumber}`
    : `${id}`

  const currentProgress = progress[progressKey] || { time: 0 }
  
  // Calculate remaining time correctly
  const remainingTime = Math.max(videoDuration - currentProgress.time, 0)
  
  const progressPercent = videoDuration > 0
    ? Math.min((currentProgress.time / videoDuration) * 100, 100)
    : 0

  const formatTime = (seconds) => {
    if (!seconds || isNaN(seconds)) return "0m"
    const mins = Math.floor(seconds / 60)
    if (mins < 1) return "Less than 1m"
    return `${mins}m`
  }

  // Hide if watched less than 1% or more than 95% (assume finished)
  if (progressPercent < 1 || progressPercent > 95) return null

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full group cursor-pointer"
    >
      <div className="space-y-2.5">
        {/* Header Metadata */}
        <div className="flex items-center justify-between px-0.5">
          <div className="flex items-center gap-2">
            <div className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
            </div>
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white/90 group-hover:text-primary transition-colors">
              Resume
            </span>
          </div>
          
          <span className="text-[9px] font-black uppercase tracking-widest text-white/40 tabular-nums bg-white/5 px-2 py-0.5 rounded-md">
            {formatTime(remainingTime)} left
          </span>
        </div>

        {/* Progress Track with Glow Effect */}
        <div className="relative h-1.5 w-full bg-white/5 rounded-full overflow-hidden border border-white/[0.03]">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${progressPercent}%` }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="absolute top-0 left-0 h-full bg-primary shadow-[0_0_12px_rgba(var(--primary),0.8)]"
          />
          
          {/* Subtle Glass overlay for depth */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent pointer-events-none" />
        </div>
      </div>
    </motion.div>
  )
}