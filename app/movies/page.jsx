"use client"

import { useState, useMemo } from "react"
import { useMovies } from "@/app/context/MovieContext"
import { movies } from "@/data/movie"
import MovieCard from "@/components/MovieCard"
import Filters from "@/components/Filters"
import SearchBar from "@/components/SearchBar"

export default function AllMoviesPage() {
  const { activeCategory, activeActor } = useMovies()
  const [searchQuery, setSearchQuery] = useState("")

  // Memoized filtered movies for better performance
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
    <main className="bg-(--color-background) min-h-screen text-(--color-foreground) pb-20 animate-fadeIn">
      {/* PAGE HEADER */}
      <header className="container mx-auto px-6 pt-12 pb-8">
        <h1 className="text-5xl font-extrabold tracking-tight mb-6 text-(--color-primary)">
          Movies
        </h1>

        <div className="max-w-2xl mb-6">
          <SearchBar onSearch={(query) => setSearchQuery(query)} />
        </div>

        <Filters />
      </header>

      {/* MOVIE GRID */}
      <section className="container mx-auto px-6">
        {filteredMovies.length === 0 && (
          <p className="text-(--color-muted-foreground) text-lg mt-20 text-center">
            No movies found.
          </p>
        )}

        <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-8">
          {filteredMovies.map((movie) => (
            <div
              key={movie.id}
              className="transform transition-transform duration-300 hover:scale-105"
            >
              <MovieCard movie={movie} />
            </div>
          ))}
        </div>
      </section>
    </main>
  )
}
