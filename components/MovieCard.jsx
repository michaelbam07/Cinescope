"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Card } from "@/components/ui/card"
import { useMovies } from "@/app/context/MovieContext"
import VideoProgressBar from "./VideoProgressBar"
import { Play, Heart, Clock, ChevronRight } from "lucide-react" // Using icons instead of emojis

const MovieCard = ({ item }) => {
  if (!item) return null
  const { id, title, category, rating, poster, thumbnail, seasons, duration } = item
  const { likedMovies, watchLater, toggleLike, toggleWatchLater, progress, openTrailerPlayer } = useMovies()

  const [hover, setHover] = useState(false)
  const isLiked = likedMovies.includes(id)
  const isSaved = watchLater.includes(id)

  return (
    <Card
      className="group relative bg-card border-none overflow-hidden rounded-xl transition-all duration-500 hover:scale-[1.02] hover:shadow-2xl hover:shadow-primary/10"
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      {/* IMAGE SECTION */}
      <div className="relative aspect-2/3 w-full overflow-hidden">
        <Image
          src={poster || thumbnail}
          alt={title}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-110 group-hover:blur-[2px]"
        />

        {/* GRADIENT OVERLAY (Our new utility) */}
        <div className="absolute inset-0 poster-gradient opacity-60 group-hover:opacity-90 transition-opacity duration-300" />

        {/* HOVER CONTENT */}
        <div className="absolute inset-0 flex flex-col justify-end p-5 translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <span className="bg-primary text-primary-foreground text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider">
                {seasons ? "Series" : "Movie"}
              </span>
              <span className="text-yellow-400 text-sm font-bold">★ {rating}</span>
            </div>
            
            <h3 className="text-white text-xl font-bold leading-tight line-clamp-2">{title}</h3>
            
            <p className="text-gray-300 text-xs line-clamp-2 opacity-0 group-hover:opacity-100 transition-opacity delay-100">
              {item.epilogue}
            </p>

            <div className="flex items-center gap-2 pt-2 opacity-0 group-hover:opacity-100 transition-opacity delay-150">
               {/* Primary Action */}
               <button 
                onClick={() => !seasons && openTrailerPlayer(item)}
                className="flex-1 bg-white text-black py-2 rounded-lg font-bold text-xs flex items-center justify-center gap-2 hover:bg-primary hover:text-white transition-colors"
               >
                <Play size={14} fill="currentColor" /> {seasons ? "Details" : "Trailer"}
               </button>
               
               {/* Quick Actions */}
               <button onClick={() => toggleLike(id)} className={`p-2 rounded-lg glass-card ${isLiked ? 'text-red-500' : 'text-white'}`}>
                <Heart size={18} fill={isLiked ? "currentColor" : "none"} />
               </button>
            </div>
          </div>
        </div>

        {/* TOP RIGHT RATING TAG (Always visible) */}
        {!hover && (
          <div className="absolute top-3 right-3 glass-card bg-black/40 px-2 py-1 rounded-md text-xs font-bold text-white">
            {rating}
          </div>
        )}
      </div>

      {/* PROGRESS BAR */}
      <div className="absolute bottom-0 left-0 w-full">
         <VideoProgressBar movieId={id} videoDuration={duration || 120} />
      </div>

      {/* CLICKABLE LINK FOR THE WHOLE CARD */}
      <Link href={seasons ? `/series/${id}` : `/movies/${id}`} className="absolute inset-0 z-0">
        <span className="sr-only">View {title}</span>
      </Link>
    </Card>
  )
}

export default MovieCard