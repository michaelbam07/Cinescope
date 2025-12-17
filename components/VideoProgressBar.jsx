"use client"

import { useMovies } from "@/app/context/MovieContext"
import { Play } from "lucide-react"

export default function VideoProgressBar({ id, seasonNumber, episodeNumber, videoDuration = 0 }) {
  const { progress, updateProgress } = useMovies()

  const progressKey = seasonNumber && episodeNumber
    ? `${id}-${seasonNumber}-${episodeNumber}`
    : `${id}`

  const currentProgress = progress[progressKey] || { time: 0, duration: videoDuration }
  
  // Guard against division by zero
  const progressPercent = videoDuration > 0
    ? Math.min((currentProgress.time / videoDuration) * 100, 100)
    : 0

  const formatTime = (seconds) => {
    if (!seconds || isNaN(seconds)) return "0:00"
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  // Only show if the user has actually started (e.g., more than 1%)
  if (progressPercent < 1) return null

  return (
    <div className="w-full space-y-2 animate-fadeIn">
      {/* Label and Time */}
      <div className="flex items-center justify-between px-1">
        <div className="flex items-center gap-1.5">
          <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
          <span className="text-[10px] font-bold uppercase tracking-widest text-foreground/80">
            Continue
          </span>
        </div>
        <span className="text-[10px] font-medium text-muted-foreground tabular-nums">
          {formatTime(currentProgress.time)} left
        </span>
      </div>

      {/* Progress Track */}
      <div className="relative h-1 w-full bg-white/10 rounded-full overflow-hidden">
        <div
          className="h-full bg-primary transition-all duration-500 ease-out shadow-[0_0_8px_rgba(var(--primary),0.6)]"
          style={{ width: `${progressPercent}%` }}
        />
      </div>
    </div>
  )
}