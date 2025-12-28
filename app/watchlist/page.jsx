"use client"

import { useMemo, useState, useEffect } from "react"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { Bookmark, PlusCircle, Sparkles } from "lucide-react"

import { movies } from "@/data/movie"
import MovieCard from "@/components/MovieCard"
import { useMovies } from "@/app/context/MovieContext"

export default function WatchlistPage() {
  const { watchLater } = useMovies()
  const [isHydrated, setIsHydrated] = useState(false)

  // Prevent "Empty State" flash during hydration
  useEffect(() => {
    setIsHydrated(true)
  }, [])

  const watchlist = useMemo(
    () => movies.filter((movie) => watchLater.includes(movie.id)),
    [watchLater]
  )

  return (
    <main className="bg-background min-h-screen text-foreground pb-20">
      {/* 1. SECTION HEADER */}
      <header className="relative pt-24 pb-12 overflow-hidden">
        {/* Subtle top glow to define the header area */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent opacity-30" />
        
        <div className="container mx-auto px-6">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-end justify-between border-b border-white/5 pb-10"
          >
            <div>
              <div className="flex items-center gap-2 text-primary mb-3">
                <Bookmark size={16} fill="currentColor" className="animate-pulse" />
                <span className="text-[11px] font-black uppercase tracking-[0.3em]">Personal Collection</span>
              </div>
              <h1 className="text-6xl md:text-8xl font-black tracking-tighter uppercase italic leading-[0.8]">
                My <br /><span className="text-primary">Watchlist</span>
              </h1>
            </div>

            <div className="hidden md:flex flex-col items-end group">
               <div className="relative">
                 <span className="text-6xl font-black italic opacity-10 group-hover:opacity-20 transition-opacity duration-500">
                    {watchlist.length}
                 </span>
                 <Sparkles size={20} className="absolute -top-2 -right-4 text-primary opacity-0 group-hover:opacity-100 transition-all duration-500 scale-50 group-hover:scale-100" />
               </div>
               <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mt-[-10px]">Titles Saved</span>
            </div>
          </motion.div>
        </div>
      </header>

      {/* 2. DYNAMIC GRID */}
      <section className="container mx-auto px-6 mt-10">
        {!isHydrated ? (
          /* Initial Load Skeletons */
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 md:gap-10">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="aspect-[2/3] bg-white/5 rounded-2xl animate-pulse" />
            ))}
          </div>
        ) : (
          <AnimatePresence mode="popLayout">
            {watchlist.length > 0 ? (
              <motion.div 
                layout
                className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 md:gap-10"
              >
                {watchlist.map((movie, idx) => (
                  <motion.div
                    key={movie.id}
                    layout
                    initial={{ opacity: 0, scale: 0.9, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    transition={{ 
                      type: "spring", 
                      damping: 25, 
                      stiffness: 400,
                      delay: (idx % 10) * 0.05 
                    }}
                  >
                    <MovieCard item={movie} />
                  </motion.div>
                ))}
              </motion.div>
            ) : (
              /* 3. ENHANCED EMPTY STATE */
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col items-center justify-center py-44 text-center"
              >
                <div className="relative mb-10 group">
                  <div className="absolute inset-0 bg-primary/10 blur-3xl rounded-full scale-150 group-hover:bg-primary/20 transition-colors duration-700" />
                  <div className="relative w-28 h-28 rounded-[2rem] bg-white/5 border border-white/10 flex items-center justify-center rotate-3 group-hover:rotate-0 transition-transform duration-500">
                    <Bookmark size={48} className="text-white/10 group-hover:text-primary/40 transition-colors duration-500" />
                  </div>
                </div>
                
                <h2 className="text-3xl font-black uppercase tracking-tighter italic">Blank Slate</h2>
                <p className="text-muted-foreground text-base mt-4 max-w-sm mx-auto leading-relaxed">
                  Your cinematic journey starts here. Save titles you want to experience later, and we'll keep them ready.
                </p>
                
                <Link 
                  href="/movies" 
                  className="mt-12 group flex items-center gap-3 bg-white text-black px-10 py-5 rounded-full font-black uppercase tracking-widest text-[10px] hover:bg-primary hover:text-white transition-all active:scale-95 shadow-xl shadow-white/5"
                >
                  <PlusCircle size={18} className="group-hover:rotate-90 transition-transform duration-500" /> 
                  Discover Content
                </Link>
              </motion.div>
            )}
          </AnimatePresence>
        )}
      </section>
    </main>
  )
}