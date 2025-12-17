"use client"

import Link from "next/link"
import Image from "next/image"
import { useState } from "react"
import { useMovies } from "@/app/context/MovieContext"
import { Play, Info, Star, ChevronRight } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

export default function RelatedMovies({ movies, currentMovieId }) {
  const { openTrailerPlayer, progress } = useMovies()
  const [hoveredId, setHoveredId] = useState(null)

  const related = movies
    .filter((i) => i && Number(i.id) !== Number(currentMovieId))
    .slice(0, 6)

  if (related.length === 0) return null

  return (
    <section className="mt-20 mb-12 animate-fadeIn">
      <div className="flex items-center gap-3 mb-8">
        <div className="h-8 w-1 bg-primary rounded-full" />
        <h2 className="text-3xl font-black tracking-tighter uppercase italic">
          More Like This
        </h2>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {related.map((item) => {
          const isSeries = Array.isArray(item.seasons)
          const poster = item.thumbnail || item.poster
          const watchProgress = isSeries ? 0 : (progress[item.id]?.time / (item.duration || 1)) * 100

          return (
            <div 
              key={item.id}
              className="relative"
              onMouseEnter={() => setHoveredId(item.id)}
              onMouseLeave={() => setHoveredId(null)}
            >
              <Link href={isSeries ? `/series/${item.id}` : `/movies/${item.id}`}>
                <motion.div 
                  whileHover={{ y: -10 }}
                  className="relative aspect-[2/3] rounded-xl overflow-hidden glass-card border-white/10 group"
                >
                  <Image
                    src={poster}
                    alt={item.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  
                  {/* Bottom Progress Bar (Always visible if started) */}
                  {watchProgress > 0 && (
                    <div className="absolute bottom-0 left-0 w-full h-1 bg-white/20">
                      <div 
                        className="h-full bg-primary shadow-[0_0_8px_rgba(var(--primary),0.8)]" 
                        style={{ width: `${watchProgress}%` }}
                      />
                    </div>
                  )}

                  {/* High-End Hover Overlay */}
                  <AnimatePresence>
                    {hoveredId === item.id && (
                      <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent p-4 flex flex-col justify-end gap-2"
                      >
                        <button 
                          onClick={(e) => {
                            e.preventDefault();
                            openTrailerPlayer(item);
                          }}
                          className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white shadow-lg self-center mb-2 hover:scale-110 transition-transform"
                        >
                          <Play size={20} fill="currentColor" />
                        </button>
                        
                        <div className="space-y-1">
                          <p className="text-xs font-black truncate uppercase">{item.title}</p>
                          <div className="flex items-center justify-between">
                            <span className="flex items-center gap-1 text-[10px] text-yellow-500 font-bold">
                              <Star size={10} fill="currentColor" /> {item.rating}
                            </span>
                            <span className="text-[10px] text-white/60 font-bold uppercase tracking-widest">
                              {isSeries ? 'Series' : 'Movie'}
                            </span>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              </Link>
            </div>
          )
        })}
      </div>
    </section>
  )
}