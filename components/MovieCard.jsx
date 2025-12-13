"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription
} from "@/components/ui/card"
import { useMovies } from "@/app/context/MovieContext"
import VideoProgressBar from "./VideoProgressBar"

const MovieCard = ({ item }) => {
  if (!item) return null

  const {
    id,
    title,
    category,
    epilogue,
    rating,
    poster,
    thumbnail,
    trailer,
    seasons,
    duration
  } = item

  const {
    likedMovies,
    watchLater,
    toggleLike,
    toggleWatchLater,
    getReviewCount,
    getAverageRating,
    openTrailerPlayer,
    openEpisodePlayer,
    progress
  } = useMovies()

  const [hover, setHover] = useState(false)
  const [selectedSeason, setSelectedSeason] = useState(
    Array.isArray(seasons) && seasons.length > 0 ? seasons[0].seasonNumber : 1
  )

  const isLiked = likedMovies.includes(id)
  const isSaved = watchLater.includes(id)
  const reviewCount = getReviewCount?.(id) || 0
  const avgRating = getAverageRating?.(id) || null

  // Episodes safely
  const selectedSeasonObj = Array.isArray(seasons)
    ? seasons.find((s) => s.seasonNumber === selectedSeason)
    : null
  const episodes = Array.isArray(selectedSeasonObj?.episodes)
    ? selectedSeasonObj.episodes
    : []

  // Maximum watched progress
  const getMaxProgress = () => {
    if (Array.isArray(seasons)) {
      if (!selectedSeasonObj || !Array.isArray(selectedSeasonObj.episodes)) return 0
      return Math.max(
        ...selectedSeasonObj.episodes.map(
          (ep) => progress[`series-${id}-${selectedSeason}-${ep.episodeNumber}`]?.time || 0
        ),
        0
      )
    }
    return progress[`movie-${id}`]?.time || 0
  }

  const maxProgress = getMaxProgress()

  // Duration for progress bar (safe)
  const firstEpisodeDuration = episodes.length > 0 ? episodes[0].duration || 0 : 0
  const videoDuration = Array.isArray(seasons) ? firstEpisodeDuration : duration || 0

  // Render stars
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
      className="relative bg-card border border-border overflow-hidden rounded-lg shadow-md hover:shadow-2xl transition-all duration-300 cursor-pointer"
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      {/* IMAGE */}
      <div className="relative w-full h-56 bg-muted overflow-hidden rounded-t-lg">
        {poster ? (
          <Image src={thumbnail || poster} alt={title} width={500} height={300} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <p className="text-muted-foreground">No image</p>
          </div>
        )}

        {hover && (
          <div className="absolute inset-0 bg-black/70 flex flex-col justify-between p-4 transition-opacity duration-200">
            <div className="flex-1 flex flex-col justify-center gap-2">
              <p className="text-white text-sm line-clamp-3 leading-snug">{epilogue}</p>
              <div className="flex items-center gap-2">
                <span className="text-white text-xs font-semibold bg-primary px-2 py-1 rounded">{rating}/10</span>
                <span className="text-xs text-muted-foreground">{category}</span>
              </div>

              {/* SERIES SEASONS */}
              {Array.isArray(seasons) && seasons.length > 0 && (
                <div className="mt-2">
                  <div className="flex gap-2 overflow-x-auto mb-1">
                    {seasons.map((s) => (
                      <button
                        key={s.seasonNumber}
                        className={`px-2 py-1 text-xs rounded ${
                          s.seasonNumber === selectedSeason
                            ? "bg-primary text-primary-foreground shadow-md scale-105"
                            : "bg-muted text-foreground hover:scale-105 hover:shadow-sm"
                        } transition-all duration-200`}
                        onClick={() => setSelectedSeason(s.seasonNumber)}
                      >
                        Season {s.seasonNumber}
                      </button>
                    ))}
                  </div>

                  <div className="flex flex-col gap-1 max-h-32 overflow-y-auto">
                    {episodes.length > 0 ? (
                      episodes.map((ep) => {
                        const key = `series-${id}-${selectedSeason}-${ep.episodeNumber}`
                        const watched = progress[key]?.time || 0
                        return (
                          <div key={ep.episodeNumber} className="flex justify-between items-center">
                            <button
                              className="text-xs text-white underline text-left flex-1"
                              onClick={() => openEpisodePlayer(id, selectedSeason, ep)}
                            >
                              {ep.episodeNumber}. {ep.title}
                            </button>
                            {watched > 0 && <span className="text-xs text-primary ml-2">{Math.floor(watched)}s</span>}
                          </div>
                        )
                      })
                    ) : (
                      <p className="text-xs text-muted-foreground">No episodes available</p>
                    )}
                  </div>
                </div>
              )}

              {/* MOVIE TRAILER */}
              {!seasons && trailer && (
                <button
                  onClick={() => openTrailerPlayer(item)}
                  className="w-full bg-primary hover:bg-primary-foreground text-primary-foreground hover:text-primary py-2 px-3 rounded-md font-semibold text-sm transition-all duration-200 mt-2"
                >
                  ▶ Play Trailer
                </button>
              )}
            </div>
          </div>
        )}

        {/* RATING */}
        <div className="absolute top-2 right-2 bg-black/80 backdrop-blur-sm px-2 py-1 rounded-md">
          <div className="flex items-center gap-2">
            <span className="text-yellow-400 font-bold text-sm">{rating}</span>
            <span className="text-xs text-muted-foreground">({reviewCount})</span>
          </div>
        </div>
      </div>

      {/* PROGRESS */}
      {maxProgress > 0 && <VideoProgressBar movieId={id} videoDuration={videoDuration} />}

      {/* CONTENT */}
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-semibold text-foreground truncate">{title}</CardTitle>
        <CardDescription className="text-xs text-muted-foreground line-clamp-1">{category}</CardDescription>

        {avgRating !== null && (
          <div className="mt-2 flex items-center gap-2">
            {renderStars(avgRating)}
            <span className="text-xs text-muted-foreground">{avgRating}/10</span>
          </div>
        )}
      </CardHeader>

      {/* BUTTONS */}
      <div className="pt-0 flex gap-2 justify-between px-4 pb-4">
        <button
          onClick={() => toggleLike(id)}
          className={`flex-1 px-3 py-2 rounded-md text-sm font-medium transition-all ${
            isLiked ? "bg-destructive text-white hover:opacity-90" : "bg-muted text-foreground hover:bg-muted-foreground"
          }`}
        >
          ❤️
        </button>

        <button
          onClick={() => toggleWatchLater(id)}
          className={`flex-1 px-3 py-2 rounded-md text-sm font-medium transition-all ${
            isSaved ? "bg-accent text-white hover:opacity-90" : "bg-muted text-foreground hover:bg-muted-foreground"
          }`}
        >
          ⏰
        </button>

        <Link href={seasons ? `/series/${id}` : `/movies/${id}`} className="flex-1">
          <button className="w-full px-3 py-2 rounded-md text-sm font-medium bg-primary text-primary-foreground hover:opacity-90 transition-all">
            View
          </button>
        </Link>
      </div>
    </Card>
  )
}

export default MovieCard
