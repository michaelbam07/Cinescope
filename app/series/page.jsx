// File: /app/series/page.js
"use client"

import { useState, useMemo } from "react"
import { movies } from "@/data/movie"
import { useMovies } from "@/app/context/MovieContext"
import MovieCard from "@/components/MovieCard"
import Filters from "@/components/Filters"
import SearchBar from "@/components/SearchBar"

export default function SeriesPage() {
    const { activeCategory, activeActor } = useMovies()
    const [searchQuery, setSearchQuery] = useState("")

    // Memoized filtered series for performance
    const filteredSeries = useMemo(() => {
        const lowerQuery = searchQuery.toLowerCase()
        return movies
            .filter((movie) => movie.type === "Series") // Only series
            .filter((movie) => {
                const matchesSearch =
                    movie.title.toLowerCase().includes(lowerQuery) ||
                    movie.category.toLowerCase().includes(lowerQuery) ||
                    movie.actors.some((actor) => actor.toLowerCase().includes(lowerQuery))

                const matchesCategory =
                    activeCategory === "all" || movie.category === activeCategory

                const matchesActor =
                    activeActor === "all" ||
                    movie.actors.some(
                        (actor) => actor.toLowerCase() === activeActor.toLowerCase()
                    )

                return matchesSearch && matchesCategory && matchesActor
            })
    }, [searchQuery, activeCategory, activeActor])

    return (
        <main className="bg-(--color-background) min-h-screen text-(--color-foreground) pb-20 animate-fadeIn">
            {/* PAGE HEADER */}
            <header className="container mx-auto px-6 pt-12 pb-8">
                <h1 className="text-5xl font-extrabold tracking-tight mb-6 text-(--color-primary)">
                    Series
                </h1>

                <div className="max-w-2xl mb-6">
                    <SearchBar onSearch={(query) => setSearchQuery(query)} />
                </div>

                <Filters />
            </header>

            {/* SERIES GRID */}
            <section className="container mx-auto px-6">
                {filteredSeries.length === 0 && (
                    <p className="text-(--color-muted-foreground) text-lg mt-20 text-center">
                        No series found.
                    </p>
                )}

                <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-8">
                    {filteredSeries.map((series) => (
                        <div
                            key={series.id}
                            className="transform transition-transform duration-300 hover:scale-105"
                        >
                            <MovieCard movie={series} />
                        </div>
                    ))}
                </div>
            </section>
        </main>
    )
}
