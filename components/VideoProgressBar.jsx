"use client"

import { useEffect, useRef } from "react"
import { useMovies } from "@/app/context/MovieContext"

export default function VideoProgressBar({ movieId, videoDuration = 0 }) {
  const { progress, updateProgress } = useMovies()
  const videoRef = useRef(null)

  // Get current progress for this movie
  const currentProgress = progress[movieId] || { time: 0, duration: videoDuration }
  const progressPercent = videoDuration > 0 
    ? (currentProgress.time / videoDuration) * 100 
    : 0

  // Format time as MM:SS
  const formatTime = (seconds) => {
    if (!seconds || isNaN(seconds)) return "0:00"
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  const handleSeek = (e) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const percent = (e.clientX - rect.left) / rect.width
    const newTime = percent * videoDuration
    updateProgress(movieId, newTime, videoDuration)
  }

  // Only show if there's progress data
  if (progressPercent === 0) {
    return null
  }

  return (
    <div className="mt-4 p-4 bg-(--color-muted) rounded-lg">
      <div className="flex items-center justify-between mb-2">
        <p className="text-sm font-medium text-(--color-foreground)">Resume Video</p>
        <p className="text-xs text-(--color-muted-foreground)">
          {formatTime(currentProgress.time)} / {formatTime(videoDuration)}
        </p>
      </div>

      {/* Progress bar (clickable to seek) */}
      <div
        onClick={handleSeek}
        className="relative h-2 bg-muted-foreground/20 rounded-full cursor-pointer group"
      >
        {/* Filled portion */}
        <div
          className="h-full bg-(--color-primary) rounded-full transition-all duration-200 group-hover:h-3"
          style={{ width: `${progressPercent}%` }}
        />
        {/* Hover indicator */}
        <div
          className="absolute top-1/2 -translate-y-1/2 w-4 h-4 bg-(--color-primary) rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
          style={{ left: `calc(${progressPercent}% - 8px)` }}
        />
      </div>

      <p className="text-xs text-(--color-muted-foreground) mt-2">
        {Math.round(progressPercent)}% watched
      </p>
    </div>
  )
}
