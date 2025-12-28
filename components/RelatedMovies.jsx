"use client"

import Link from "next/link"
import Image from "next/image"
import { useState } from "react"
import { useMovies } from "@/app/context/MovieContext"
import { Play, Star } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

export default function RelatedMovies({ movies, currentMovieId }) {
  const { openTrailerPlayer, progress } = useMovies()
  const [hoveredId, setHoveredId] = useState(null)

  const related = movies
    .filter((i) => i && Number(i.id) !== Number(currentMovieId))
    .slice(0, 6)

  if (related.length === 0) return null

  // Animation variants for the grid entrance
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.08 }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  }

  return (
    <section className="mt-24 mb-20 px-1">
      {/* Header */}
      <motion.div 
        initial={{ opacity: 0, x: -20 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        className="flex items-center gap-4 mb-10"
      >
        <div className="h-8 w-1.5 bg-primary rounded-full shadow-[0_0_15px_rgba(var(--primary),0.5)]" />
        <h2 className="text-2xl md:text-3xl font-black tracking-tighter uppercase italic leading-none">
          More Like <span className="text-primary">This</span>
        </h2>
      </motion.div>

      {/* Grid */}
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-5 md:gap-6"
      >
        {related.map((item) => {
          const isSeries = Array.isArray(item.seasons)
          const poster = item.thumbnail || item.poster
          const watchProgress = isSeries ? 0 : (progress[item.id]?.time / (item.duration || 1)) * 100

          return (
            <motion.div 
              key={item.id}
              variants={itemVariants}
              className="relative"
              onMouseEnter={() => setHoveredId(item.id)}
              onMouseLeave={() => setHoveredId(null)}
            >
              <Link href={isSeries ? `/series/${item.id}` : `/movies/${item.id}`} className="block">
                <motion.div 
                  whileHover={{ y: -8, transition: { duration: 0.2 } }}
                  whileTap={{ scale: 0.96 }}
                  className="relative aspect-[2/3] rounded-2xl overflow-hidden bg-white/5 border border-white/5 group shadow-xl"
                >
                  <Image
                    src={poster}
                    alt={item.title}
                    fill
                    sizes="(max-width: 768px) 50vw, 15vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-110 group-hover:blur-[2px]"
                  />
                  
                  {/* Progress bar logic - refined for visual weight */}
                  {watchProgress > 0 && (
                    <div className="absolute bottom-0 left-0 w-full h-1.5 bg-black/40 backdrop-blur-sm z-20">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${watchProgress}%` }}
                        className="h-full bg-primary" 
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
                        className="absolute inset-0 z-10 bg-gradient-to-t from-black via-black/20 to-transparent p-4 flex flex-col justify-end"
                      >
                        <motion.button 
                          initial={{ scale: 0.5, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            openTrailerPlayer(item);
                          }}
                          className="w-12 h-12 rounded-full bg-white text-black flex items-center justify-center shadow-2xl self-center mb-6 hover:bg-primary hover:text-white transition-colors"
                        >
                          <Play size={24} fill="currentColor" className="ml-1" />
                        </motion.button>
                        
                        <div className="space-y-1.5">
                          <p className="text-[10px] font-black truncate uppercase italic tracking-tighter text-white">
                            {item.title}
                          </p>
                          <div className="flex items-center justify-between">
                            <span className="flex items-center gap-1 text-[10px] text-yellow-500 font-bold">
                              <Star size={10} fill="currentColor" /> {item.rating}
                            </span>
                            <span className="text-[8px] text-white/40 font-black uppercase tracking-[0.2em]">
                              {isSeries ? 'Series' : 'Movie'}
                            </span>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              </Link>
            </motion.div>
          )
        })}
      </motion.div>
    </section>
  )
}