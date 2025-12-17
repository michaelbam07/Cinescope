"use client"

import { useState, useMemo } from "react"
import { movies } from "@/data/movie"
import { useMovies } from "@/app/context/MovieContext"
import MovieCard from "@/components/MovieCard"
import Filters from "@/components/Filters"
import SearchBar from "@/components/SearchBar"
import { motion, AnimatePresence } from "framer-motion"
import { Tv, SearchX } from "lucide-react"

export default function SeriesPage() {
    const { activeCategory, activeActor } = useMovies()
    const [searchQuery, setSearchQuery] = useState("")

    // Optimized Filter Logic
    const filteredSeries = useMemo(() => {
        const lowerQuery = searchQuery.toLowerCase()
        return movies
            .filter((movie) => movie.type === "Series")
            .filter((movie) => {
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
            {/* 1. CINEMATIC HEADER */}
            <header className="relative pt-24 pb-12 overflow-hidden">
                {/* Ambient Glow */}
                <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[120px] -z-10" />

                <div className="container mx-auto px-6">
                    <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-10">
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                        >
                            <div className="flex items-center gap-3 text-primary mb-2">
                                <Tv size={20} strokeWidth={3} />
                                <span className="text-[10px] font-black uppercase tracking-[0.4em]">TV Shows</span>
                            </div>
                            <h1 className="text-6xl md:text-8xl font-black tracking-tighter uppercase italic leading-[0.8]">
                                Binge <br /> <span className="text-primary">Worth-it</span>
                            </h1>
                        </motion.div>

                        <div className="w-full lg:max-w-md">
                            <SearchBar onSearch={(query) => setSearchQuery(query)} />
                        </div>
                    </div>

                    <div className="glass-card p-2 rounded-2xl border border-white/5 backdrop-blur-md">
                        <Filters />
                    </div>
                </div>
            </header>

            {/* 2. DYNAMIC SERIES GRID */}
            <section className="container mx-auto px-6 mt-12">
                <motion.div
                    layout
                    className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6"
                >
                    <AnimatePresence mode="popLayout">
                        {filteredSeries.map((series, idx) => (
                            <motion.div
                                key={series.id}
                                layout
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                transition={{ delay: idx * 0.03 }}
                            >
                                {/* Enhanced MovieCard logic: 
                  Since these are series, the Card could display 
                  "X Seasons" instead of just a rating.
                */}
                                <MovieCard item={series} />
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </motion.div>

                {/* 3. ENHANCED EMPTY STATE */}
                <AnimatePresence>
                    {filteredSeries.length === 0 && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="flex flex-col items-center justify-center py-40 text-center"
                        >
                            <div className="relative mb-6">
                                <Tv size={64} className="text-white/5" />
                                <SearchX size={24} className="absolute -bottom-2 -right-2 text-primary" />
                            </div>
                            <h3 className="text-2xl font-black uppercase tracking-tighter italic">No Series Found</h3>
                            <p className="text-muted-foreground text-sm mt-2 max-w-xs mx-auto">
                                We couldn't find any shows matching your search. Try a broader category.
                            </p>
                            <button
                                onClick={() => window.location.reload()}
                                className="mt-8 px-6 py-2 border border-primary/20 rounded-full text-[10px] font-black uppercase tracking-widest text-primary hover:bg-primary hover:text-white transition-all"
                            >
                                Reset Catalog
                            </button>
                        </motion.div>
                    )}
                </AnimatePresence>
            </section>
        </main>
    )
}