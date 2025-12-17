"use client"

import { useMemo } from "react"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { Bookmark, LayoutGrid, PlusCircle } from "lucide-react"

import { movies } from "@/data/movie"
import MovieCard from "@/components/MovieCard"
import { useMovies } from "@/app/context/MovieContext"

export default function WatchlistPage() {
  const { watchLater } = useMovies()

  const watchlist = useMemo(
    () => movies.filter((movie) => watchLater.includes(movie.id)),
    [watchLater]
  )

  return (
    <main className="bg-background min-h-screen text-foreground pb-20">
      {/* 1. SECTION HEADER */}
      <header className="relative pt-24 pb-12 overflow-hidden">
        <div className="container mx-auto px-6">
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-between border-b border-white/5 pb-8"
          >
            <div>
              <div className="flex items-center gap-2 text-primary mb-2">
                <Bookmark size={18} fill="currentColor" />
                <span className="text-[10px] font-black uppercase tracking-[0.4em]">Personal Collection</span>
              </div>
              <h1 className="text-5xl md:text-7xl font-black tracking-tighter uppercase italic leading-none">
                My <span className="text-primary">Watchlist</span>
              </h1>
            </div>

            <div className="hidden md:flex flex-col items-end">
               <span className="text-4xl font-black italic opacity-20">{watchlist.length}</span>
               <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Titles Saved</span>
            </div>
          </motion.div>
        </div>
      </header>

      {/* 2. DYNAMIC GRID */}
      <section className="container mx-auto px-6">
        <AnimatePresence mode="popLayout">
          {watchlist.length > 0 ? (
            <motion.div 
              layout
              className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 md:gap-10"
            >
              {watchlist.map((movie) => (
                <motion.div
                  key={movie.id}
                  layout
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ type: "spring", damping: 20, stiffness: 300 }}
                >
                  <MovieCard item={movie} />
                </motion.div>
              ))}
            </motion.div>
          ) : (
            /* 3. ENHANCED EMPTY STATE */
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col items-center justify-center py-40 text-center"
            >
              <div className="w-24 h-24 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mb-8">
                <Bookmark size={40} className="text-white/20" />
              </div>
              <h2 className="text-2xl font-black uppercase tracking-tighter italic">Your list is a blank slate</h2>
              <p className="text-muted-foreground text-sm mt-3 max-w-sm mx-auto leading-relaxed">
                Start building your cinematic library. Items you save for later will appear here for easy access.
              </p>
              <Link 
                href="/movies" 
                className="mt-10 flex items-center gap-2 bg-primary text-primary-foreground px-8 py-4 rounded-full font-black uppercase tracking-widest text-xs hover:scale-105 transition-all"
              >
                <PlusCircle size={16} /> Explore Movies
              </Link>
            </motion.div>
          )}
        </AnimatePresence>
      </section>
    </main>
  )
}