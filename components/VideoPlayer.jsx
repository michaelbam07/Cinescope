"use client"

import { useState, useRef, useEffect, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { 
  Play, Pause, RotateCcw, RotateCw, 
  Maximize, X, Volume2, VolumeX, Settings
} from "lucide-react"

export default function VideoPlayer({ src, onClose, startTime = 0, onSaveProgress }) {
  const videoRef = useRef(null)
  const containerRef = useRef(null)
  const [isPlaying, setIsPlaying] = useState(true)
  const [progress, setProgress] = useState(0)
  const [duration, setDuration] = useState(0)
  const [showControls, setShowControls] = useState(true)
  const [isMuted, setIsMuted] = useState(false)
  const controlsTimeoutRef = useRef(null)

  // 1. Throttled Save Progress (saves every 5 seconds instead of every frame)
  const lastSavedTime = useRef(0)
  const handleSave = useCallback((time) => {
    if (Math.abs(time - lastSavedTime.current) > 5) {
      onSaveProgress?.(time)
      lastSavedTime.current = time
    }
  }, [onSaveProgress])

  // 2. Keyboard Shortcuts
  useEffect(() => {
    const handleKeys = (e) => {
      switch(e.code) {
        case "Space": e.preventDefault(); togglePlay(); break;
        case "ArrowRight": videoRef.current.currentTime += 10; break;
        case "ArrowLeft": videoRef.current.currentTime -= 10; break;
        case "KeyM": setIsMuted(prev => !prev); break;
        case "KeyF": containerRef.current?.requestFullscreen(); break;
        case "Escape": onClose(); break;
      }
    };
    window.addEventListener("keydown", handleKeys);
    return () => window.removeEventListener("keydown", handleKeys);
  }, [isPlaying]);

  const handleMouseMove = () => {
    setShowControls(true)
    if (controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current)
    controlsTimeoutRef.current = setTimeout(() => setShowControls(false), 3000)
  }

  const updateProgress = () => {
    if (!videoRef.current) return
    const current = videoRef.current.currentTime
    const total = videoRef.current.duration || 1
    setProgress((current / total) * 100)
    setDuration(total)
    handleSave(current)
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
    const mins = Math.floor(time / 60)
    const secs = Math.floor(time % 60)
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  return (
    <motion.div
      ref={containerRef}
      initial={{ opacity: 0, scale: 1.1 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 1.1 }}
      className="fixed inset-0 bg-black z-[100] flex items-center justify-center overflow-hidden"
      style={{ cursor: showControls ? 'default' : 'none' }}
      onMouseMove={handleMouseMove}
    >
      <video
        ref={videoRef}
        src={src}
        autoPlay
        muted={isMuted}
        onTimeUpdate={updateProgress}
        onLoadedMetadata={(e) => setDuration(e.currentTarget.duration)}
        onClick={togglePlay}
        className="w-full h-full object-contain"
      />

      {/* Control Overlays */}
      <AnimatePresence>
        {showControls && (
          <>
            {/* Top Bar */}
            <motion.div 
              initial={{ y: -50 }} animate={{ y: 0 }} exit={{ y: -50 }}
              className="absolute top-0 inset-x-0 p-10 bg-gradient-to-b from-black/90 to-transparent flex justify-between items-start"
            >
              <div className="flex flex-col">
                <span className="text-primary font-black uppercase tracking-[0.3em] text-[10px] mb-1">Now Playing</span>
                <h2 className="text-white text-2xl font-black italic tracking-tighter uppercase">Cinematic Sequence</h2>
              </div>
              <button onClick={onClose} className="p-3 rounded-full hover:bg-white/10 text-white transition-all">
                <X size={32} strokeWidth={1.5} />
              </button>
            </motion.div>

            {/* Bottom Controls */}
            <motion.div 
              initial={{ y: 50 }} animate={{ y: 0 }} exit={{ y: 50 }}
              className="absolute bottom-0 inset-x-0 p-10 bg-gradient-to-t from-black/90 via-black/40 to-transparent"
            >
              {/* Scrub Bar */}
              <div className="relative w-full h-8 flex items-center group cursor-pointer" onClick={handleSeek}>
                <div className="w-full h-1.5 bg-white/20 rounded-full overflow-hidden">
                  <motion.div 
                    className="h-full bg-primary" 
                    style={{ width: `${progress}%` }} 
                  />
                </div>
                <div 
                  className="absolute h-4 w-4 bg-primary rounded-full shadow-[0_0_15px_rgba(var(--primary),1)] scale-0 group-hover:scale-100 transition-transform"
                  style={{ left: `calc(${progress}% - 8px)` }}
                />
              </div>

              <div className="flex items-center justify-between mt-4">
                <div className="flex items-center gap-8">
                  <button onClick={togglePlay} className="text-white hover:text-primary transition-all">
                    {isPlaying ? <Pause size={32} fill="currentColor" /> : <Play size={32} fill="currentColor" />}
                  </button>

                  <div className="flex items-center gap-4 text-white/60">
                    <button onClick={() => (videoRef.current.currentTime -= 10)} className="hover:text-white"><RotateCcw size={22} /></button>
                    <button onClick={() => (videoRef.current.currentTime += 10)} className="hover:text-white"><RotateCw size={22} /></button>
                  </div>

                  <span className="text-sm font-black tabular-nums tracking-widest text-white/80">
                    {formatTime(videoRef.current?.currentTime || 0)} <span className="text-white/20 mx-2">/</span> {formatTime(duration)}
                  </span>
                </div>

                <div className="flex items-center gap-6 text-white/60">
                  <button onClick={() => setIsMuted(!isMuted)} className="hover:text-white">
                    {isMuted ? <VolumeX size={24} /> : <Volume2 size={24} />}
                  </button>
                  <button className="hover:text-white"><Settings size={22} /></button>
                  <button onClick={() => containerRef.current.requestFullscreen()} className="hover:text-white"><Maximize size={22} /></button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </motion.div>
  )
}