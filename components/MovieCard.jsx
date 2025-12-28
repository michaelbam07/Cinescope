"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { motion, AnimatePresence } from "framer-motion"
import { Card } from "@/components/ui/card"
import { useMovies } from "@/app/context/MovieContext"
import VideoProgressBar from "./VideoProgressBar"
import { Play, Heart, Bookmark, Star } from "lucide-react"

const MovieCard = ({ item }) => {
  if (!item) return null
  const { id, title, rating, poster, thumbnail, seasons, duration, epilogue } = item
  const { likedMovies, watchLater, toggleLike, toggleWatchLater, openTrailerPlayer } = useMovies()

  const [isHovered, setIsHovered] = useState(false)
  const isLiked = likedMovies.includes(id)
  const isSaved = watchLater.includes(id)

  return (
    <Card
      className="group relative bg-black border-none overflow-hidden rounded-2xl transition-all duration-500 shadow-lg"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* 1. MEDIA SECTION */}
      <div className="relative aspect-[2/3] w-full overflow-hidden">
        <Image
          src={poster || thumbnail}
          alt={title}
          fill
          sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 20vw"
          className="object-cover transition-transform duration-1000 group-hover:scale-110 group-hover:blur-[3px] group-hover:opacity-40"
        />

        {/* Cinematic Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-80 group-hover:opacity-100 transition-opacity duration-500" />

        {/* Top Badges (Rating & Type) */}
        <div className="absolute top-3 left-3 right-3 flex justify-between items-start z-20">
          <div className="flex flex-col gap-1">
            <span className="bg-primary/90 backdrop-blur-md text-white text-[9px] font-black px-2 py-0.5 rounded-sm uppercase tracking-[0.2em] w-fit">
              {seasons ? "Series" : "Movie"}
            </span>
          </div>
          <div className="glass-card bg-black/40 backdrop-blur-md px-2 py-1 rounded-lg flex items-center gap-1 border border-white/5">
            <Star size={10} className="text-yellow-500 fill-yellow-500" />
            <span className="text-[10px] font-black text-white">{rating}</span>
          </div>
        </div>

        {/* 2. HOVER CONTENT LAYERS */}
        <div className="absolute inset-0 flex flex-col justify-end p-5 z-20">
          <motion.div 
            animate={{ y: isHovered ? 0 : 20, opacity: isHovered ? 1 : 0.8 }}
            className="space-y-3"
          >
            <h3 className="text-white text-xl font-black leading-tight uppercase italic tracking-tighter line-clamp-2">
              {title}
            </h3>
            
            <AnimatePresence>
              {isHovered && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="space-y-4"
                >
                  <p className="text-gray-300 text-[11px] line-clamp-2 font-medium leading-relaxed">
                    {epilogue || "An immersive cinematic experience that pushes the boundaries of storytelling."}
                  </p>

                  <div className="flex items-center gap-2">
                    {/* Main Action */}
                    <button 
                      onClick={(e) => {
                        e.preventDefault()
                        seasons ? null : openTrailerPlayer(item)
                      }}
                      className="flex-1 bg-white text-black py-2.5 rounded-full font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-primary hover:text-white transition-all active:scale-95"
                    >
                      <Play size={12} fill="currentColor" /> {seasons ? "Explore" : "Trailer"}
                    </button>
                    
                    {/* Interaction Buttons */}
                    <button 
                      onClick={(e) => { e.preventDefault(); toggleLike(id); }}
                      className={`p-2.5 rounded-full glass-card border border-white/10 transition-colors ${isLiked ? 'bg-red-500 border-red-500 text-white' : 'text-white hover:bg-white/10'}`}
                    >
                      <Heart size={14} fill={isLiked ? "currentColor" : "none"} />
                    </button>

                    <button 
                      onClick={(e) => { e.preventDefault(); toggleWatchLater(id); }}
                      className={`p-2.5 rounded-full glass-card border border-white/10 transition-colors ${isSaved ? 'bg-primary border-primary text-white' : 'text-white hover:bg-white/10'}`}
                    >
                      <Bookmark size={14} fill={isSaved ? "currentColor" : "none"} />
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </div>

      {/* 3. PROGRESS BAR (Z-30 to ensure visibility) */}
      <div className="absolute bottom-0 left-0 w-full z-30">
        <VideoProgressBar movieId={id} videoDuration={duration || 120} />
      </div>

      {/* 4. PRIMARY NAVIGATION LINK */}
      <Link 
        href={seasons ? `/series/${id}` : `/movies/${id}`} 
        className="absolute inset-0 z-10"
      >
        <span className="sr-only">Details for {title}</span>
      </Link>
    </Card>
  )
}

export default MovieCard