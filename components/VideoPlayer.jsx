"use client"

import { useState, useRef, useEffect } from "react"
import { motion } from "framer-motion"

export default function VideoPlayer({
  src,
  onClose,
  startTime = 0,
  onSaveProgress
}) {
  const videoRef = useRef(null)
  const [isPlaying, setIsPlaying] = useState(true)
  const [progress, setProgress] = useState(0)
  const [duration, setDuration] = useState(0)

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.currentTime = startTime
    }
  }, [startTime])

  const updateProgress = () => {
    if (!videoRef.current) return

    const current = videoRef.current.currentTime
    const total = videoRef.current.duration || 1

    setProgress((current / total) * 100)
    setDuration(total)

    onSaveProgress?.(current)
  }

  const togglePlay = () => {
    if (!videoRef.current) return
    isPlaying ? videoRef.current.pause() : videoRef.current.play()
    setIsPlaying(!isPlaying)
  }

  const handleSeek = (e) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const percent = (e.clientX - rect.left) / rect.width
    videoRef.current.currentTime = percent * duration
  }

  return (
    <motion.div
      className="fixed inset-0 bg-black/90 flex justify-center items-center z-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <button
        onClick={onClose}
        className="absolute top-5 right-5 text-white text-3xl font-bold"
      >
        ✕
      </button>

      <div className="w-full max-w-5xl px-4">
        <video
          ref={videoRef}
          src={src}
          autoPlay
          onTimeUpdate={updateProgress}
          className="w-full rounded-lg shadow-xl bg-black"
        />

        <div className="mt-4 text-white">
          <div
            className="w-full h-2 bg-white/30 rounded cursor-pointer mb-3"
            onClick={handleSeek}
          >
            <div
              className="h-full bg-red-600 rounded"
              style={{ width: `${progress}%` }}
            />
          </div>

          <div className="flex gap-4 items-center">
            <button
              onClick={togglePlay}
              className="px-4 py-2 bg-white text-black rounded-lg font-semibold"
            >
              {isPlaying ? "Pause" : "Play"}
            </button>

            <button
              onClick={() => (videoRef.current.currentTime += 10)}
              className="px-3 py-2 bg-white/20 rounded"
            >
              +10s
            </button>

            <button
              onClick={() => (videoRef.current.currentTime -= 10)}
              className="px-3 py-2 bg-white/20 rounded"
            >
              -10s
            </button>

            <button
              onClick={() =>
                videoRef.current?.requestFullscreen()
              }
              className="ml-auto px-4 py-2 bg-white/20 rounded-lg"
            >
              Fullscreen
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  )
}
