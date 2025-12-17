"use client"

import Image from "next/image"
import Link from "next/link"
import { movies } from "@/data/movie"
import { useEffect, useState, useRef } from "react"
import { useMovies } from "@/app/context/MovieContext"
import { ChevronRight, ChevronLeft, Play, Info, Star } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

export default function HomePage() {
  const [featuredIndex, setFeaturedIndex] = useState(0)
  const [scrollY, setScrollY] = useState(0)
  const [autoplayPaused, setAutoplayPaused] = useState(false)
  const { getAverageRating } = useMovies()

  const featuredList = movies.slice(0, 6)
  const activeMovie = featuredList[featuredIndex]
  const avgFeatured = getAverageRating?.(activeMovie.id)

  // Handle Parallax & Infinite Scroll Trigger
  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY)
    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  // Autoplay Logic
  useEffect(() => {
    if (autoplayPaused) return
    const timer = setInterval(() => {
      setFeaturedIndex((prev) => (prev + 1) % featuredList.length)
    }, 8000)
    return () => clearInterval(timer)
  }, [autoplayPaused, featuredList.length])

  return (
    <div className="bg-background min-h-screen text-foreground selection:bg-primary/30">
      
      {/* Hero Section: Dynamic Focal Point */}
      <section className="relative h-[90vh] w-full overflow-hidden flex items-center">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeMovie.id}
            initial={{ opacity: 0, scale: 1.1 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.2, ease: "easeOut" }}
            className="absolute inset-0"
          >
            <Image
              src={activeMovie.poster}
              alt={activeMovie.title}
              fill
              priority
              className="object-cover"
              style={{ transform: `translateY(${scrollY * 0.3}px)` }}
            />
            {/* Cinematic Overlays */}
            <div className="absolute inset-0 bg-gradient-to-r from-background via-background/40 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
          </motion.div>
        </AnimatePresence>

        <div className="relative z-10 px-6 md:px-24 max-w-4xl space-y-8">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            key={`content-${activeMovie.id}`}
            className="space-y-4"
          >
            <div className="flex items-center gap-3 text-primary font-black tracking-[0.3em] text-xs uppercase italic">
              <Star size={14} fill="currentColor" /> Featured Spotlight
            </div>
            <h1 className="text-6xl md:text-8xl font-black tracking-tighter uppercase leading-[0.9]">
              {activeMovie.title.split(' ').map((word, i) => (
                <span key={i} className={i % 2 === 0 ? "text-white" : "text-primary block"}>{word} </span>
              ))}
            </h1>
            <p className="text-muted-foreground text-lg max-w-xl line-clamp-3 font-medium">
              {activeMovie.epilogue}
            </p>
            
            <div className="flex items-center gap-4 pt-4">
              <Link
                href={`/movies/${activeMovie.id}`}
                className="flex items-center gap-2 bg-primary text-primary-foreground px-8 py-4 rounded-full font-black uppercase tracking-widest text-xs hover:scale-105 transition-transform shadow-[0_0_30px_rgba(var(--primary),0.4)]"
              >
                <Play size={16} fill="currentColor" /> Watch Now
              </Link>
              <button className="p-4 rounded-full border border-white/10 glass-card text-white hover:bg-white/10 transition-colors">
                <Info size={20} />
              </button>
            </div>
          </motion.div>
        </div>

        {/* Carousel Indicators: Vertical Mini-Map */}
        <div className="absolute right-12 top-1/2 -translate-y-1/2 z-20 hidden lg:flex flex-col gap-4">
          {featuredList.map((m, i) => (
            <button
              key={m.id}
              onClick={() => setFeaturedIndex(i)}
              className="group flex items-center gap-4 text-right"
            >
              <span className={`text-[10px] font-black transition-all ${i === featuredIndex ? "text-primary translate-x-0" : "text-white/20 opacity-0 translate-x-4 group-hover:opacity-100"}`}>
                {m.title.toUpperCase()}
              </span>
              <div className={`h-1 transition-all rounded-full ${i === featuredIndex ? "w-12 bg-primary" : "w-4 bg-white/20 hover:bg-white/40"}`} />
            </button>
          ))}
        </div>
      </section>

      {/* Dynamic Content Rows */}
      <div className="relative z-20 -mt-20 space-y-12 pb-24">
        <MovieRow 
          title="Trending Now" 
          movies={movies.slice(0, 10)} 
          accent="text-red-500"
        />
        <MovieRow 
          title="Top Rated Critiques" 
          movies={[...movies].sort((a,b) => b.rating - a.rating)} 
          accent="text-yellow-500"
        />
        <MovieRow 
          title="Action & Adrenaline" 
          movies={movies.filter(m => m.category === "Action")} 
          accent="text-blue-500"
        />
      </div>
    </div>
  )
}

function MovieRow({ title, movies, accent }) {
  const rowRef = useRef(null)

  const scroll = (direction) => {
    if (rowRef.current) {
      const { scrollLeft, clientWidth } = rowRef.current
      const scrollTo = direction === 'left' ? scrollLeft - clientWidth : scrollLeft + clientWidth
      rowRef.current.scrollTo({ left: scrollTo, behavior: 'smooth' })
    }
  }

  return (
    <section className="space-y-4">
      <div className="px-6 md:px-24 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className={`w-1 h-6 rounded-full bg-current ${accent}`} />
          <h2 className="text-2xl font-black uppercase tracking-tighter italic">{title}</h2>
        </div>
        <div className="flex gap-2">
          <button onClick={() => scroll('left')} className="p-2 rounded-full glass-card border-white/5 hover:bg-white/10 text-white/50 hover:text-white transition-all">
            <ChevronLeft size={20} />
          </button>
          <button onClick={() => scroll('right')} className="p-2 rounded-full glass-card border-white/5 hover:bg-white/10 text-white/50 hover:text-white transition-all">
            <ChevronRight size={20} />
          </button>
        </div>
      </div>

      <div 
        ref={rowRef}
        className="flex gap-4 overflow-x-auto scrollbar-hide px-6 md:px-24 snap-x snap-mandatory"
      >
        {movies.map((movie) => (
          <Link
            key={movie.id}
            href={`/movies/${movie.id}`}
            className="flex-none w-[200px] md:w-[280px] aspect-[2/3] relative rounded-2xl overflow-hidden glass-card border-white/5 group snap-start"
          >
            <Image
              src={movie.poster}
              alt={movie.title}
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-6">
              <p className="text-white font-black text-sm uppercase tracking-tighter leading-none mb-2">{movie.title}</p>
              <div className="flex items-center justify-between">
                <span className="text-[10px] text-primary font-bold tracking-widest uppercase">{movie.category}</span>
                <span className="text-[10px] text-white/60 font-mono italic">{movie.rating}/10</span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  )
}