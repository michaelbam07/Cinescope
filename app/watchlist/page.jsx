"use client"

import { useMemo } from "react"
import { movies } from "@/data/movie"
import MovieCard from "@/components/MovieCard"
import { useMovies } from "@/app/context/MovieContext"

export default function WatchlistPage() {
  const { watchLater } = useMovies() // assuming this is an array of movie IDs

  const watchlist = useMemo(
    () => movies.filter((movie) => watchLater.includes(movie.id)),
    [watchLater]
  )

  return (
    <main className="bg-(--color-background) min-h-screen text-(--color-foreground) pb-20 animate-fadeIn">
      <header className="container mx-auto px-6 pt-12 pb-8">
        <h1 className="text-5xl font-extrabold tracking-tight mb-6 text-(--color-primary)">
          Watchlist
        </h1>
      </header>

      <section className="container mx-auto px-6">
        {watchlist.length === 0 && (
          <p className="text-(--color-muted-foreground) text-lg mt-20 text-center">
            Your watchlist is empty.
          </p>
        )}

        <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-8">
          {watchlist.map((movie) => (
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
