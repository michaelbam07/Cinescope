"use client"

import { useState, useMemo } from "react"
import { useMovies } from "@/app/context/MovieContext"
import { movies } from "@/data/movie"
import MovieCard from "@/components/MovieCard"
import Filters from "@/components/Filters"
import SearchBar from "@/components/SearchBar"
import { motion, AnimatePresence } from "framer-motion"

export default function AllMoviesPage() {
  const { activeCategory, activeActor } = useMovies()
  const [searchQuery, setSearchQuery] = useState("")

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
      {/* Cinematic Header Section */}
      <header className="relative pt-24 pb-12 overflow-hidden">
        {/* Subtle Background Accent */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-[120px] -z-10" />
        
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
            <div>
              <motion.h1 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="text-6xl font-black tracking-tighter uppercase italic leading-none"
              >
                Catalog
              </motion.h1>
              <p className="text-muted-foreground mt-2 font-medium uppercase tracking-[0.2em] text-xs">
                {filteredMovies.length} Titles Available
              </p>
            </div>
            
            <div className="w-full md:w-96">
              <SearchBar onSearch={(query) => setSearchQuery(query)} />
            </div>
          </div>

          <div className="glass-card p-2 rounded-2xl border border-white/5 inline-block w-full lg:w-auto">
            <Filters />
          </div>
        </div>
      </header>

      {/* Grid with Motion Layout */}
      <section className="container mx-auto px-6 mt-8">
        <motion.div 
          layout
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 md:gap-8"
        >
          <AnimatePresence mode="popLayout">
            {filteredMovies.map((movie) => (
              <motion.div
                key={movie.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3, ease: "circOut" }}
                className="relative"
              >
                <MovieCard item={movie} />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {/* Dynamic Empty State */}
        <AnimatePresence>
          {filteredMovies.length === 0 && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col items-center justify-center py-32 text-center"
            >
              <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-4">
                <span className="text-2xl">🎬</span>
              </div>
              <h3 className="text-xl font-bold uppercase tracking-tight">No Results Found</h3>
              <p className="text-muted-foreground text-sm mt-2 max-w-xs">
                Try adjusting your filters or search terms to find what you're looking for.
              </p>
              <button 
                onClick={() => setSearchQuery("")}
                className="mt-6 text-primary text-xs font-black uppercase tracking-widest hover:underline"
              >
                Clear Search
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </section>
    </main>
  )
}