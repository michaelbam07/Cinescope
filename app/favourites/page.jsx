"use client"

import { useMemo } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Heart, Sparkles, ArrowRight } from "lucide-react"
import Link from "next/link"

import { movies } from "@/data/movie"
import MovieCard from "@/components/MovieCard"
import { useMovies } from "@/app/context/MovieContext"

export default function FavouritePage() {
  const { likedMovies } = useMovies()

  const favouriteList = useMemo(
    () => movies.filter((movie) => likedMovies.includes(movie.id)),
    [likedMovies]
  )

  return (
    <main className="bg-background min-h-screen pb-20 overflow-hidden">
      {/* 1. CINEMATIC HEADER */}
      <header className="relative pt-24 pb-12">
        {/* Decorative Background Element */}
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-red-500/10 rounded-full blur-[120px] -z-10" />
        
        <div className="container mx-auto px-6">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex flex-col md:flex-row md:items-end justify-between gap-6"
          >
            <div>
              <div className="flex items-center gap-2 text-red-500 mb-3">
                <Heart size={18} fill="currentColor" className="animate-pulse" />
                <span className="text-[10px] font-black uppercase tracking-[0.4em]">Curated by You</span>
              </div>
              <h1 className="text-6xl md:text-8xl font-black tracking-tighter uppercase italic leading-[0.8]">
                Your <br /><span className="text-red-500">Favorites</span>
              </h1>
            </div>

            <div className="glass-card px-6 py-4 rounded-2xl border-white/5 flex items-center gap-4">
              <div className="text-right">
                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Collection Size</p>
                <p className="text-2xl font-black italic">{favouriteList.length} Titles</p>
              </div>
              <div className="w-[1px] h-10 bg-white/10" />
              <Sparkles className="text-primary" size={24} />
            </div>
          </motion.div>
        </div>
      </header>

      {/* 2. GRID SECTION */}
      <section className="container mx-auto px-6 mt-12">
        <AnimatePresence mode="popLayout">
          {favouriteList.length > 0 ? (
            <motion.div 
              layout
              className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 md:gap-8"
            >
              {favouriteList.map((movie, idx) => (
                <motion.div
                  key={movie.id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ delay: idx * 0.05 }}
                >
                  <MovieCard item={movie} />
                </motion.div>
              ))}
            </motion.div>
          ) : (
            /* 3. PREMIUM EMPTY STATE */
            <motion.div 
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col items-center justify-center py-32 text-center"
            >
              <div className="relative mb-8">
                <Heart size={80} className="text-white/5" strokeWidth={1} />
                <Heart size={32} className="absolute inset-0 m-auto text-red-500/20 animate-ping" fill="currentColor" />
              </div>
              <h2 className="text-3xl font-black uppercase tracking-tighter italic">Show some love</h2>
              <p className="text-muted-foreground text-sm mt-4 max-w-xs mx-auto leading-relaxed">
                Your favorite movies will live here. Tap the heart on any title to add it to your hall of fame.
              </p>
              <Link 
                href="/movies" 
                className="mt-10 group flex items-center gap-3 bg-white text-black px-8 py-4 rounded-full font-black uppercase tracking-widest text-xs hover:bg-red-500 hover:text-white transition-all"
              >
                Find something Great <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </Link>
            </motion.div>
          )}
        </AnimatePresence>
      </section>
    </main>
  )
}