"use client"

import { useState } from "react"
import Image from "next/image"
import { motion, AnimatePresence } from "framer-motion"
import { Play, Film, Plus, Heart, Check, Info } from "lucide-react"

import { Button } from "@/components/ui/button"
import { useMovies } from "@/app/context/MovieContext"
import Reviews from "@/components/Reviews"
import RelatedMovies from "@/components/RelatedMovies"
import CastSection from "@/components/CastSection"
import VideoProgressBar from "@/components/VideoProgressBar"
import VideoPlayer from "@/components/VideoPlayer"
import { movies as allMovies } from "@/data/movie"

export default function MovieDetailClient({ movie }) {
  const movieId = Number(movie.id)
  const { likedMovies, watchLater, toggleLike, toggleWatchLater } = useMovies()
  const [activeVideo, setActiveVideo] = useState(null)

  const isLiked = likedMovies.includes(movieId)
  const isSaved = watchLater.includes(movieId)

  const relatedMovies = allMovies?.filter(
    (m) => m.category === movie.category && Number(m.id) !== movieId
  ) || []

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* 1. IMMERSIVE HERO HEADER */}
      <section className="relative h-[70vh] w-full overflow-hidden">
        <motion.div 
          initial={{ scale: 1.1, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1.5 }}
          className="absolute inset-0"
        >
          <Image
            src={movie.backdrop || movie.poster}
            alt={movie.title}
            fill
            priority
            className="object-cover"
          />
          {/* Cinematic Vignette */}
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-background via-transparent to-transparent" />
        </motion.div>

        <div className="absolute inset-0 flex flex-col justify-end px-6 md:px-24 pb-12">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="max-w-3xl space-y-6"
          >
            <div className="flex items-center gap-4 text-primary font-black tracking-widest text-xs uppercase">
              <span className="px-2 py-1 border border-primary rounded-sm">{movie.category}</span>
              <span>{movie.dateReleased}</span>
              <span className="flex items-center gap-1"><Heart size={12} fill="currentColor" /> {movie.rating}</span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-black tracking-tighter uppercase italic leading-none text-white">
              {movie.title}
            </h1>
            
            <p className="text-lg text-muted-foreground leading-relaxed max-w-2xl font-medium">
              {movie.epilogue}
            </p>

            <div className="flex flex-wrap gap-4 pt-4">
              <Button
                onClick={() => setActiveVideo(movie.video)}
                className="h-14 px-8 rounded-full bg-primary text-primary-foreground font-black uppercase tracking-widest text-xs hover:scale-105 transition-all gap-2"
              >
                <Play size={18} fill="currentColor" /> Play Movie
              </Button>
              
              <Button
                variant="outline"
                onClick={() => setActiveVideo(movie.trailer)}
                className="h-14 px-8 rounded-full border-white/10 glass-card text-white uppercase tracking-widest text-xs gap-2"
              >
                <Film size={18} /> Trailer
              </Button>

              <button 
                onClick={() => toggleWatchLater(movieId)}
                className={`w-14 h-14 rounded-full flex items-center justify-center transition-all border ${isSaved ? 'bg-primary border-primary text-primary-foreground' : 'bg-white/5 border-white/10 text-white'}`}
              >
                {isSaved ? <Check size={24} /> : <Plus size={24} />}
              </button>

              <button 
                onClick={() => toggleLike(movieId)}
                className={`w-14 h-14 rounded-full flex items-center justify-center transition-all border ${isLiked ? 'bg-red-500 border-red-500 text-white' : 'bg-white/5 border-white/10 text-white'}`}
              >
                <Heart size={24} fill={isLiked ? "currentColor" : "none"} />
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* 2. PROGRESS & CONTENT BODY */}
      <div className="container mx-auto px-6 md:px-24 -mt-1 relative z-10">
        <div className="glass-card border-white/5 rounded-2xl p-1 mb-12">
           <VideoProgressBar movieId={movieId} videoDuration={7200} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
          {/* Main Content Column */}
          <div className="lg:col-span-2 space-y-16">
            <CastSection actors={movie.actors} />
            <Reviews movieId={movieId} />
          </div>

          {/* Sidebar Column */}
          <aside className="space-y-12">
            <div className="space-y-4">
               <h3 className="text-xs font-black uppercase tracking-[0.3em] text-primary italic">Recommended</h3>
               <RelatedMovies movies={relatedMovies} currentMovieId={movieId} />
            </div>
          </aside>
        </div>
      </div>

      {/* 3. VIDEO MODAL */}
      <AnimatePresence>
        {activeVideo && (
          <VideoPlayer
            src={activeVideo}
            onClose={() => setActiveVideo(null)}
          />
        )}
      </AnimatePresence>
    </div>
  )
}