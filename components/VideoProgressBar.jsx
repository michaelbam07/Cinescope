"use client"

import { useRef } from "react"
import { useMovies } from "@/app/context/MovieContext"

export default function VideoProgressBar({ id, seasonNumber, episodeNumber, videoDuration = 0 }) {
  const { progress, updateProgress } = useMovies()
  const videoRef = useRef(null)

  // Build unique key for movies or series episodes
  const progressKey = seasonNumber && episodeNumber
    ? `${id}-${seasonNumber}-${episodeNumber}`
    : `${id}`

  const currentProgress = progress[progressKey] || { time: 0, duration: videoDuration }
  const progressPercent = videoDuration > 0
    ? (currentProgress.time / videoDuration) * 100
    : 0

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
    updateProgress(progressKey, newTime, videoDuration)
  }

  if (progressPercent === 0) return null

  return (
    <div className="mt-4 p-4 bg-muted rounded-lg">
      <div className="flex items-center justify-between mb-2">
        <p className="text-sm font-medium text-foreground">Resume Video</p>
        <p className="text-xs text-muted-foreground">
          {formatTime(currentProgress.time)} / {formatTime(videoDuration)}
        </p>
      </div>

      {/* Progress bar */}
      <div
        onClick={handleSeek}
        className="relative h-2 bg-muted-foreground/20 rounded-full cursor-pointer group"
      >
        {/* Filled portion */}
        <div
          className="h-full bg-primary rounded-full transition-all duration-200 group-hover:h-3"
          style={{ width: `${progressPercent}%` }}
        />
        {/* Hover indicator */}
        <div
          className="absolute top-1/2 -translate-y-1/2 w-4 h-4 bg-primary rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
          style={{ left: `calc(${progressPercent}% - 8px)` }}
        />
      </div>

      <p className="text-xs text-muted-foreground mt-2">
        {Math.round(progressPercent)}% watched
      </p>
    </div>
  )
}
