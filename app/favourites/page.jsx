"use client"

import { useMemo, useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Heart, Sparkles, ArrowRight } from "lucide-react"
import Link from "next/link"

import { movies } from "@/data/movie"
import MovieCard from "@/components/MovieCard"
import { useMovies } from "@/app/context/MovieContext"

export default function FavouritePage() {
  const { likedMovies } = useMovies()
  const [isHydrated, setIsHydrated] = useState(false)

  // Prevents layout shift/flash during client-side hydration
  useEffect(() => {
    setIsHydrated(true)
  }, [])

  const favouriteList = useMemo(
    () => movies.filter((movie) => likedMovies.includes(movie.id)),
    [likedMovies]
  )

  return (
    <main className="bg-background min-h-screen pb-20 overflow-hidden">
      {/* 1. CINEMATIC HEADER */}
      <header className="relative pt-24 pb-12">
        {/* Decorative Background Element - Slightly more vivid for depth */}
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-red-600/20 rounded-full blur-[120px] -z-10" />
        
        <div className="container mx-auto px-6">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex flex-col md:flex-row md:items-end justify-between gap-8"
          >
            <div>
              <div className="flex items-center gap-2 text-red-500 mb-4">
                <Heart size={20} fill="currentColor" className="animate-pulse" />
                <span className="text-xs font-black uppercase tracking-[0.3em]">Your Curated Selection</span>
              </div>
              <h1 className="text-6xl md:text-8xl font-black tracking-tighter uppercase italic leading-[0.85]">
                Your <br /><span className="text-red-500">Favorites</span>
              </h1>
            </div>

            {/* Stats Badge */}
            <div className="glass-card px-6 py-4 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl flex items-center gap-4 w-fit shadow-2xl">
              <div className="text-right">
                <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest">Collection Size</p>
                <p className="text-2xl font-black italic">{favouriteList.length} Titles</p>
              </div>
              <div className="w-[1px] h-10 bg-white/20" />
              <Sparkles className="text-yellow-500" size={24} />
            </div>
          </motion.div>
        </div>
      </header>

      {/* 2. GRID SECTION */}
      <section className="container mx-auto px-6 mt-12">
        {!isHydrated ? (
          /* Loading Skeleton to prevent Layout Shift */
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-8">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="aspect-[2/3] w-full bg-white/5 rounded-2xl animate-pulse" />
            ))}
          </div>
        ) : (
          <AnimatePresence mode="popLayout">
            {favouriteList.length > 0 ? (
              <motion.div 
                layout
                className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-8"
              >
                {favouriteList.map((movie, idx) => (
                  <motion.div
                    key={movie.id}
                    layout
                    initial={{ opacity: 0, scale: 0.9, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.8, transition: { duration: 0.2 } }}
                    transition={{ 
                      type: "spring", 
                      stiffness: 260, 
                      damping: 20,
                      delay: idx * 0.05 
                    }}
                  >
                    <MovieCard item={movie} />
                  </motion.div>
                ))}
              </motion.div>
            ) : (
              /* 3. PREMIUM EMPTY STATE */
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col items-center justify-center py-32 text-center"
              >
                <div className="relative mb-8">
                  <Heart size={120} className="text-white/5" strokeWidth={1} />
                  <Heart size={48} className="absolute inset-0 m-auto text-red-500/20 animate-ping" fill="currentColor" />
                </div>
                <h2 className="text-4xl font-black uppercase tracking-tighter italic">Library Empty</h2>
                <p className="text-muted-foreground text-base mt-4 max-w-sm mx-auto leading-relaxed">
                  Your favorite movies will live here. Tap the heart on any title to add it to your hall of fame.
                </p>
                <Link 
                  href="/movies" 
                  className="mt-10 group flex items-center gap-3 bg-white text-black px-10 py-5 rounded-full font-black uppercase tracking-widest text-xs hover:bg-red-600 hover:text-white transition-all active:scale-95 shadow-xl shadow-red-500/10"
                >
                  Explore Catalog <ArrowRight size={18} className="group-hover:translate-x-2 transition-transform" />
                </Link>
              </motion.div>
            )}
          </AnimatePresence>
        )}
      </section>
    </main>
  )
}