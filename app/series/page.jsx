"use client"

import { useState, useMemo, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Tv, SearchX, RotateCcw } from "lucide-react"

import { movies } from "@/data/movie"
import { useMovies } from "@/app/context/MovieContext"
import MovieCard from "@/components/MovieCard"
import Filters from "@/components/Filters"
import SearchBar from "@/components/SearchBar"

export default function SeriesPage() {
    const { activeCategory, activeActor } = useMovies()
    const [searchQuery, setSearchQuery] = useState("")
    const [isHydrated, setIsHydrated] = useState(false)

    // Ensure client-side mounting
    useEffect(() => {
        setIsHydrated(true)
    }, [])

    // Optimized Single-Pass Filter
    const filteredSeries = useMemo(() => {
        const lowerQuery = searchQuery.toLowerCase()
        return movies.filter((movie) => {
            if (movie.type !== "Series") return false

            const matchesSearch =
                movie.title.toLowerCase().includes(lowerQuery) ||
                movie.category.toLowerCase().includes(lowerQuery) ||
                movie.actors.some(a => a.toLowerCase().includes(lowerQuery))

            const matchesCategory =
                activeCategory === "all" || movie.category === activeCategory

            const matchesActor =
                activeActor === "all" ||
                movie.actors.some(a => a.toLowerCase() === activeActor.toLowerCase())

            return matchesSearch && matchesCategory && matchesActor
        })
    }, [searchQuery, activeCategory, activeActor])

    return (
        <main className="bg-background min-h-screen text-foreground pb-20">
            {/* 1. CINEMATIC HEADER */}
            <header className="relative pt-24 pb-12 overflow-hidden">
                {/* Ambient Glow - Adjusted for depth */}
                <div className="absolute top-0 right-1/4 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[140px] -z-10 animate-pulse" />

                <div className="container mx-auto px-6">
                    <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-10 mb-12">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6 }}
                        >
                            <div className="flex items-center gap-3 text-primary mb-4">
                                <div className="p-2 bg-primary/10 rounded-lg">
                                    <Tv size={22} strokeWidth={2.5} className="animate-pulse" />
                                </div>
                                <span className="text-xs font-black uppercase tracking-[0.4em]">Original Series</span>
                            </div>
                            <h1 className="text-7xl md:text-8xl font-black tracking-tighter uppercase italic leading-[0.8]">
                                Binge <br /> <span className="text-primary">Worth-it</span>
                            </h1>
                        </motion.div>

                        <motion.div 
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="w-full lg:max-w-md group"
                        >
                            <SearchBar onSearch={(query) => setSearchQuery(query)} />
                        </motion.div>
                    </div>

                    <div className="glass-card p-1.5 rounded-3xl border border-white/10 bg-white/[0.02] backdrop-blur-xl shadow-2xl inline-block w-full">
                        <Filters />
                    </div>
                </div>
            </header>

            {/* 2. DYNAMIC SERIES GRID */}
            <section className="container mx-auto px-6 mt-12">
                {!isHydrated ? (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
                        {[...Array(5)].map((_, i) => (
                            <div key={i} className="aspect-[2/3] bg-white/5 rounded-2xl animate-pulse" />
                        ))}
                    </div>
                ) : (
                    <motion.div
                        layout
                        className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 md:gap-10"
                    >
                        <AnimatePresence mode="popLayout">
                            {filteredSeries.map((series, idx) => (
                                <motion.div
                                    key={series.id}
                                    layout
                                    initial={{ opacity: 0, scale: 0.9, y: 30 }}
                                    animate={{ opacity: 1, scale: 1, y: 0 }}
                                    exit={{ opacity: 0, scale: 0.8, transition: { duration: 0.2 } }}
                                    transition={{ 
                                        type: "spring",
                                        stiffness: 200,
                                        damping: 25,
                                        delay: (idx % 10) * 0.05 
                                    }}
                                >
                                    <MovieCard item={series} />
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </motion.div>
                )}

                {/* 3. ENHANCED EMPTY STATE */}
                <AnimatePresence>
                    {isHydrated && filteredSeries.length === 0 && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="flex flex-col items-center justify-center py-44 text-center"
                        >
                            <div className="relative mb-8">
                                <div className="absolute inset-0 bg-primary/20 blur-3xl rounded-full animate-ping" />
                                <div className="relative w-24 h-24 bg-white/5 rounded-3xl border border-white/10 flex items-center justify-center">
                                    <SearchX size={48} className="text-primary/40" strokeWidth={1.5} />
                                </div>
                            </div>
                            <h3 className="text-3xl font-black uppercase tracking-tighter italic">Signal Lost</h3>
                            <p className="text-muted-foreground text-base mt-4 max-w-sm mx-auto leading-relaxed">
                                We couldn't find any shows matching "<span className="text-white">{searchQuery}</span>".
                                Try exploring another genre or a different actor.
                            </p>
                            <button
                                onClick={() => setSearchQuery("")}
                                className="mt-10 group flex items-center gap-3 px-8 py-4 bg-primary text-white rounded-full text-xs font-black uppercase tracking-widest hover:bg-white hover:text-black transition-all active:scale-95 shadow-xl shadow-primary/20"
                            >
                                <RotateCcw size={16} className="group-hover:-rotate-180 transition-transform duration-500" />
                                Reset Archive
                            </button>
                        </motion.div>
                    )}
                </AnimatePresence>
            </section>
        </main>
    )
}