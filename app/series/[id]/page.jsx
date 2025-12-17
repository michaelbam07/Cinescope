"use client"

import { useParams } from "next/navigation"
import Image from "next/image"
import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Play, RotateCcw, Clapperboard, Calendar } from "lucide-react"

import { series } from "@/data/movie"
import { useMovies } from "@/app/context/MovieContext"
import VideoProgressBar from "@/components/VideoProgressBar"

export default function SeriesDetailPage() {
  const { id } = useParams()
  const { openEpisodePlayer, progress } = useMovies()

  const show = series.find((s) => s.id === Number(id))
  const [selectedSeason, setSelectedSeason] = useState(1)

  useEffect(() => {
    if (show?.seasons?.length > 0) {
      setSelectedSeason(show.seasons[0].seasonNumber)
    }
  }, [show])

  if (!show) return <main className="flex items-center justify-center h-screen uppercase font-black opacity-20 italic">Series not found</main>

  const season = show.seasons?.find((s) => s.seasonNumber === selectedSeason)
  if (!season) return null

  const getProgressKey = (ep) => `${show.id}-${selectedSeason}-${ep.episodeNumber}`

  return (
    <main className="min-h-screen bg-background pb-20">
      {/* 1. CINEMATIC BACKGROUND HEADER */}
      <div className="relative h-[50vh] w-full">
        <Image
          src={show.backdrop || show.poster}
          alt={show.title}
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
        
        <div className="absolute bottom-0 left-0 w-full px-6 md:px-24 pb-12">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
             <h1 className="text-6xl md:text-8xl font-black uppercase tracking-tighter italic text-white leading-none mb-4">
                {show.title}
             </h1>
             <div className="flex items-center gap-6 text-xs font-bold uppercase tracking-widest text-primary">
                <span className="flex items-center gap-2"><Clapperboard size={14}/> {show.category}</span>
                <span className="flex items-center gap-2"><Calendar size={14}/> {show.seasons.length} Seasons</span>
             </div>
          </motion.div>
        </div>
      </div>

      <div className="container mx-auto px-6 md:px-24">
        {/* 2. SEASON SELECTOR */}
        <div className="flex gap-4 mb-12 overflow-x-auto pb-4 scrollbar-hide">
          {show.seasons.map((s) => (
            <button
              key={s.seasonNumber}
              onClick={() => setSelectedSeason(s.seasonNumber)}
              className={`flex-none px-8 py-3 rounded-full text-xs font-black uppercase tracking-widest transition-all ${
                selectedSeason === s.seasonNumber 
                  ? "bg-primary text-primary-foreground scale-105 shadow-[0_0_20px_rgba(var(--primary),0.3)]" 
                  : "bg-white/5 text-white/40 hover:bg-white/10"
              }`}
            >
              Season {s.seasonNumber}
            </button>
          ))}
        </div>

        {/* 3. EPISODES GRID */}
        <h2 className="text-xs font-black uppercase tracking-[0.4em] text-white/30 mb-8 italic">Episode List</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <AnimatePresence mode="wait">
            {season.episodes.map((ep, idx) => {
              const progressKey = getProgressKey(ep)
              const hasProgress = progress[progressKey]?.time > 0

              return (
                <motion.div
                  key={ep.episodeNumber}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  className="group relative"
                >
                  {/* Thumbnail Card */}
                  <div className="relative aspect-video rounded-2xl overflow-hidden glass-card border-white/5">
                    <Image
                      src={ep.thumbnail || show.poster}
                      alt={ep.title}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    
                    {/* Play Overlay */}
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                       <button 
                        onClick={() => openEpisodePlayer(show.id, selectedSeason, ep)}
                        className="w-16 h-16 rounded-full bg-primary text-primary-foreground flex items-center justify-center shadow-2xl transform scale-75 group-hover:scale-100 transition-transform"
                       >
                         {hasProgress ? <RotateCcw size={28} /> : <Play size={28} fill="currentColor" />}
                       </button>
                    </div>

                    {/* Duration Badge */}
                    <div className="absolute bottom-3 right-3 px-2 py-1 rounded bg-black/80 text-[10px] font-bold text-white uppercase tracking-tighter">
                      {ep.duration}m
                    </div>

                    {/* Progress Bar (Integrated) */}
                    <div className="absolute bottom-0 left-0 w-full px-2 pb-1">
                       <VideoProgressBar movieId={progressKey} videoDuration={ep.duration} />
                    </div>
                  </div>

                  {/* Episode Info */}
                  <div className="mt-4">
                    <span className="text-[10px] font-black text-primary uppercase italic tracking-widest">
                      EPISODE {ep.episodeNumber}
                    </span>
                    <h3 className="text-lg font-bold text-white group-hover:text-primary transition-colors line-clamp-1">
                      {ep.title}
                    </h3>
                  </div>
                </motion.div>
              )
            })}
          </AnimatePresence>
        </div>
      </div>
    </main>
  )
}