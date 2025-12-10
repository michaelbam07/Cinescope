"use client"

import { useState, useMemo } from "react"
import { useMovies } from "@/app/context/MovieContext"
import { series } from "@/data/movie"
import SeriesCard from "@/components/MovieCard"
import Filters from "@/components/Filters"
import SearchBar from "@/components/SearchBar"

export default function AllSeriesPage() {
  const { activeCategory, activeActor } = useMovies()
  const [searchQuery, setSearchQuery] = useState("")

  const filteredSeries = useMemo(() => {
    const lowerQuery = searchQuery.toLowerCase()

    return series.filter((s) => {
      const matchesSearch =
        s.title.toLowerCase().includes(lowerQuery) ||
        s.category.toLowerCase().includes(lowerQuery) ||
        s.actors.some((actor) => actor.toLowerCase().includes(lowerQuery))

      const matchesCategory =
        activeCategory === "all" || s.category === activeCategory

      const matchesActor =
        activeActor === "all" ||
        s.actors.some(
          (actor) => actor.toLowerCase() === activeActor.toLowerCase()
        )

      return matchesSearch && matchesCategory && matchesActor
    })
  }, [searchQuery, activeCategory, activeActor])

  return (
    <main className="bg-(--color-background) min-h-screen text-(--color-foreground) pb-20 animate-fadeIn">
      <header className="container mx-auto px-6 pt-12 pb-8">
        <h1 className="text-5xl font-extrabold tracking-tight mb-6 text-(--color-primary)">
          Series
        </h1>

        <div className="max-w-2xl mb-6">
          <SearchBar onSearch={(query) => setSearchQuery(query)} />
        </div>

        <Filters />
      </header>

      <section className="container mx-auto px-6">
        {filteredSeries.length === 0 && (
          <p className="text-(--color-muted-foreground) text-lg mt-20 text-center">
            No series found.
          </p>
        )}

        <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-8">
          {filteredSeries.map((s) => (
            <div
              key={s.id}
              className="transform transition-transform duration-300 hover:scale-105"
            >
              <SeriesCard movie={s} />
            </div>
          ))}
        </div>
      </section>
    </main>
  )
}
