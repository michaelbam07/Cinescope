"use client"

import { useState, useMemo, useEffect } from "react"
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from "framer-motion"
import { Search, X, SlidersHorizontal, Film } from "lucide-react"

import { useMovies } from "@/app/context/MovieContext"
import { movies } from "@/data/movie"
import MovieCard from "@/components/MovieCard"
import Filters from "@/components/Filters"
import SearchBar from "@/components/SearchBar"

export default function AllMoviesPage() {
  const { activeCategory, activeActor } = useMovies()
  const [searchQuery, setSearchQuery] = useState("")
  const [isScrolled, setIsScrolled] = useState(false)

  // Header scroll logic for "Sticky" UI state
  const { scrollY } = useScroll()
  useMotionValueEvent(scrollY, "change", (latest) => {
    setIsScrolled(latest > 200)
  })

  const filteredMovies = useMemo(() => {
    const lowerQuery = searchQuery.toLowerCase()
    return movies.filter((movie) => {
      const matchesSearch =
        movie.title.toLowerCase().includes(lowerQuery) ||
        movie.category.toLowerCase().includes(lowerQuery) ||
        movie.actors.some((actor) => actor.toLowerCase().includes(lowerQuery))

      const matchesCategory =
        activeCategory === "all" || movie.category === activeCategory

      const matchesActor =
        activeActor === "all" ||
        movie.actors.some((actor) => actor.toLowerCase() === activeActor.toLowerCase())

      return matchesSearch && matchesCategory && matchesActor
    })
  }, [searchQuery, activeCategory, activeActor])

  return (
    <main className="bg-background min-h-screen text-foreground pb-20">
      {/* 1. HERO SECTION */}
      <header className="relative pt-28 pb-12 overflow-hidden">
        {/* Animated Glow Backdrop */}
        <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-red-600/5 rounded-full blur-[140px] -z-10 animate-pulse" />
        
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-10 mb-16">
            <div className="space-y-4">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              >
                <h1 className="text-7xl md:text-9xl font-black tracking-tighter uppercase italic leading-[0.75] mb-2">
                  The <br /> <span className="text-red-600">Library</span>
                </h1>
                <div className="flex items-center gap-4">
                  <div className="h-[2px] w-12 bg-red-600" />
                  <p className="text-muted-foreground font-black uppercase tracking-[0.4em] text-[10px]">
                    {filteredMovies.length} Masterpieces Found
                  </p>
                </div>
              </motion.div>
            </div>
            
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="w-full md:w-[400px]"
            >
              <SearchBar onSearch={(query) => setSearchQuery(query)} />
            </motion.div>
          </div>

          {/* 2. STICKY FILTER BAR */}
          <div className={`z-40 transition-all duration-500 ${
            isScrolled 
              ? "fixed top-6 left-1/2 -translate-x-1/2 w-[90%] md:w-auto" 
              : "relative w-full"
          }`}>
            <motion.div 
              layout
              className={`glass-card p-1.5 rounded-3xl border border-white/10 shadow-2xl overflow-hidden ${
                isScrolled ? "bg-black/40 backdrop-blur-2xl" : "bg-white/5"
              }`}
            >
              <Filters />
            </motion.div>
          </div>
        </div>
      </header>

      {/* 3. MOVIE GRID */}
      <section className="container mx-auto px-6 mt-12">
        <motion.div 
          layout
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 md:gap-10"
        >
          <AnimatePresence mode="popLayout">
            {filteredMovies.map((movie, index) => (
              <motion.div
                key={movie.id}
                layout
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.8, transition: { duration: 0.2 } }}
                transition={{ 
                  duration: 0.5, 
                  ease: [0.16, 1, 0.3, 1],
                  delay: (index % 12) * 0.04 // Smooth staggered entry
                }}
              >
                <MovieCard item={movie} />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {/* 4. REFINED EMPTY STATE */}
        <AnimatePresence>
          {filteredMovies.length === 0 && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center justify-center py-48 text-center"
            >
              <div className="relative mb-10">
                 <div className="absolute inset-0 bg-red-600/10 blur-[80px] rounded-full" />
                 <Film size={80} className="text-white/5 relative" strokeWidth={1} />
                 <Search size={32} className="absolute -bottom-2 -right-2 text-red-600 animate-bounce" />
              </div>
              <h3 className="text-3xl font-black uppercase italic tracking-tighter">No results in the archive</h3>
              <p className="text-muted-foreground text-sm mt-4 max-w-xs mx-auto leading-relaxed font-medium">
                We couldn't find any titles matching your current selection. 
                Try resetting your filters to explore more.
              </p>
              <button 
                onClick={() => setSearchQuery("")}
                className="mt-10 group relative px-10 py-4 bg-white text-black overflow-hidden rounded-full font-black uppercase tracking-widest text-[10px] hover:text-white transition-colors duration-300"
              >
                <span className="relative z-10">Reset Search</span>
                <div className="absolute inset-0 bg-red-600 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </section>
    </main>
  )
}