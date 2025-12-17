"use client"

import { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { 
  Play, Pause, RotateCcw, RotateCw, 
  Maximize, X, Volume2, VolumeX 
} from "lucide-react"

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
  const [showControls, setShowControls] = useState(true)
  const controlsTimeoutRef = useRef(null)

  // Auto-hide controls after 3 seconds of inactivity
  const handleMouseMove = () => {
    setShowControls(true)
    if (controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current)
    controlsTimeoutRef.current = setTimeout(() => setShowControls(false), 3000)
  }

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

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60)
    const seconds = Math.floor(time % 60)
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`
  }

  return (
    <motion.div
      className="fixed inset-0 bg-black flex justify-center items-center z-50 cursor-none"
      style={{ cursor: showControls ? 'default' : 'none' }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      onMouseMove={handleMouseMove}
    >
      {/* Background Video */}
      <video
        ref={videoRef}
        src={src}
        autoPlay
        onTimeUpdate={updateProgress}
        onClick={togglePlay}
        className="w-full h-full object-contain bg-black"
      />

      {/* Top Bar: Close Button */}
      <AnimatePresence>
        {showControls && (
          <motion.div 
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -20, opacity: 0 }}
            className="absolute top-0 left-0 w-full p-8 bg-gradient-to-b from-black/80 to-transparent flex justify-end"
          >
            <button onClick={onClose} className="text-white hover:text-primary transition-colors">
              <X size={32} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Bottom Controls Overlay */}
      <AnimatePresence>
        {showControls && (
          <motion.div 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 20, opacity: 0 }}
            className="absolute bottom-0 left-0 w-full p-8 bg-gradient-to-t from-black/90 via-black/40 to-transparent"
          >
            {/* Progress Bar */}
            <div className="group relative w-full h-1.5 bg-white/20 rounded-full cursor-pointer mb-6" onClick={handleSeek}>
              <div 
                className="absolute top-1/2 -translate-y-1/2 h-3 w-3 bg-primary rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                style={{ left: `${progress}%` }}
              />
              <div
                className="h-full bg-primary rounded-full shadow-[0_0_10px_rgba(var(--primary),0.8)]"
                style={{ width: `${progress}%` }}
              />
            </div>

            <div className="flex items-center justify-between text-white">
              <div className="flex items-center gap-6">
                <button onClick={togglePlay} className="hover:scale-110 transition-transform">
                  {isPlaying ? <Pause size={28} fill="currentColor" /> : <Play size={28} fill="currentColor" />}
                </button>
                
                <div className="flex items-center gap-4">
                   <button onClick={() => (videoRef.current.currentTime -= 10)} className="hover:text-primary transition-colors">
                    <RotateCcw size={24} />
                  </button>
                  <button onClick={() => (videoRef.current.currentTime += 10)} className="hover:text-primary transition-colors">
                    <RotateCw size={24} />
                  </button>
                </div>

                <span className="text-sm font-medium tabular-nums">
                  {formatTime(videoRef.current?.currentTime || 0)} / {formatTime(duration)}
                </span>
              </div>

              <div className="flex items-center gap-6">
                <button 
                   onClick={() => videoRef.current?.requestFullscreen()}
                   className="hover:text-primary transition-colors"
                >
                  <Maximize size={24} />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}