"use client"

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription
} from "@/components/ui/card"
import Link from "next/link"
import Image from "next/image"
import { useState } from "react"
import { useMovies } from "@/app/context/MovieContext"

const MovieCard = ({ movie }) => {
  const { id, title, category, epilogue, rating, poster, trailer } = movie
  const {
    likedMovies,
    watchLater,
    toggleLike,
    toggleWatchLater,
    getReviewCount,
    getAverageRating,
    openTrailerPlayer
  } = useMovies()

  const [hover, setHover] = useState(false)

  const isLiked = likedMovies.includes(id)
  const isSaved = watchLater.includes(id)

  // ✅ URL validator (NO hooks here)
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

  const validPoster = isValidUrl(poster) ? poster : null
  const validTrailer = isValidUrl(trailer)

  const reviewCount = getReviewCount ? getReviewCount(id) : 0
  const avgRating = getAverageRating ? getAverageRating(id) : null

  // ⭐ Star renderer
  const renderStars = (value) => {
    const full = Math.floor(value / 2)
    const hasHalf = value % 2 >= 1

    return (
      <div className="flex items-center gap-1">
        {[...Array(5)].map((_, i) => (
          <span key={i} className="text-yellow-400">
            {i < full ? "★" : i === full && hasHalf ? "⭐" : "☆"}
          </span>
        ))}
      </div>
    )
  }

  return (
    <Card
      className="relative bg-(--color-card) border border-(--color-border) overflow-hidden rounded-lg shadow-md hover:shadow-2xl transition-all duration-300 animate-fadeIn cursor-pointer"
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      {/* Image */}
      <div className="relative w-full h-56 bg-(--color-muted) overflow-hidden rounded-t-lg">
        {validPoster ? (
          <Image
            src={validPoster}
            alt={title}
            width={500}
            height={300}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <p className="text-(--color-muted-foreground)">No image</p>
          </div>
        )}

        {/* Hover Overlay */}
        {hover && (
          <div className="absolute inset-0 bg-black/70 flex flex-col justify-between p-4 transition-opacity duration-200">
            <div className="flex-1 flex flex-col justify-center gap-2">
              <p className="text-white text-sm line-clamp-3 leading-snug">{epilogue}</p>

              <div className="flex items-center gap-2">
                <span className="text-white text-xs font-semibold bg-(--color-primary) px-2 py-1 rounded">
                  {rating}/10
                </span>
                <span className="text-xs text-(--color-muted-foreground)">
                  {category}
                </span>
              </div>
            </div>

            {/* Trailer Button */}
            {validTrailer && (
              <button
                onClick={() => openTrailerPlayer(movie)}
                className="w-full bg-(--color-primary) hover:bg-(--color-primary-foreground) text-(--color-primary-foreground) hover:text-(--color-primary) py-2 px-3 rounded-md font-semibold text-sm transition-all duration-200"
              >
                ▶ Play Trailer
              </button>
            )}
          </div>
        )}

        {/* Rating Badge */}
        <div className="absolute top-2 right-2 bg-black/80 backdrop-blur-sm px-2 py-1 rounded-md">
          <div className="flex items-center gap-2">
            <span className="text-yellow-400 font-bold text-sm">
              {rating}
            </span>
            <span className="text-xs text-(--color-muted-foreground)">
              ({reviewCount})
            </span>
          </div>
        </div>
      </div>

      {/* Content */}
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-semibold text-(--color-foreground) truncate">
          {title}
        </CardTitle>

        <CardDescription className="text-(--color-muted-foreground) text-xs line-clamp-1">
          {category}
        </CardDescription>

        {avgRating !== null && (
          <div className="mt-2 flex items-center gap-2">
            {renderStars(avgRating)}
            <span className="text-xs text-(--color-muted-foreground)">
              {avgRating}/10
            </span>
          </div>
        )}
      </CardHeader>

      {/* Buttons */}
      <div className="pt-0 flex gap-2 justify-between px-4 pb-4">
        <button
          onClick={() => toggleLike(id)}
          className={`flex-1 px-3 py-2 rounded-md text-sm font-medium transition-all ${
            isLiked
              ? "bg-(--color-destructive) text-white hover:opacity-90"
              : "bg-(--color-muted) text-(--color-foreground) hover:bg-(--color-muted-foreground)"
          }`}
        >
          ❤️
        </button>

        <button
          onClick={() => toggleWatchLater(id)}
          className={`flex-1 px-3 py-2 rounded-md text-sm font-medium transition-all ${
            isSaved
              ? "bg-(--color-accent) text-white hover:opacity-90"
              : "bg-(--color-muted) text-(--color-foreground) hover:bg-(--color-muted-foreground)"
          }`}
        >
          ⏰
        </button>

        <Link href={`/movies/${id}`} className="flex-1">
          <button className="w-full px-3 py-2 rounded-md text-sm font-medium bg-(--color-primary) text-(--color-primary-foreground) hover:opacity-90 transition-all">
            View
          </button>
        </Link>
      </div>
    </Card>
  )
}

export default MovieCard
