"use client"

import Link from "next/link"
import Image from "next/image"

export default function RelatedMovies({ movies, currentMovieId }) {
  // Filter out the current movie and show up to 6 related movies
  const related = movies
    .filter((m) => Number(m.id) !== Number(currentMovieId))
    .slice(0, 6)

  if (related.length === 0) {
    return null
  }

  const isValidUrl = (url) => {
    if (!url || typeof url !== "string") return false
    if (url.includes("${")) return false
    try {
      new URL(url)
      return true
    } catch {
      return false
    }
  }

  return (
    <section className="mt-12 mb-8">
      <h2 className="text-2xl md:text-3xl font-bold mb-6 text-(--color-primary)">
        Related Movies
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {related.map((movie) => {
          const validPoster = isValidUrl(movie.poster) ? movie.poster : null
          return (
            <Link
              key={movie.id}
              href={`/movies/${movie.id}`}
              className="group"
            >
              <div className="relative w-full h-[280px] rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300">
                {validPoster ? (
                  <Image
                    src={validPoster}
                    alt={movie.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                ) : (
                  <div className="w-full h-full bg-(--color-muted) flex items-center justify-center">
                    <p className="text-(--color-muted-foreground)">No image</p>
                  </div>
                )}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors duration-300 flex items-end p-4">
                  <div className="text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <h3 className="font-semibold text-sm line-clamp-2">{movie.title}</h3>
                    <p className="text-xs text-(--color-muted-foreground) mt-1">
                      {movie.category}
                    </p>
                  </div>
                </div>
              </div>
              <p className="mt-3 font-medium text-(--color-foreground) text-sm line-clamp-2">
                {movie.title}
              </p>
              <p className="text-xs text-(--color-muted-foreground)">{movie.rating}/10</p>
            </Link>
          )
        })}
      </div>
    </section>
  )
}
