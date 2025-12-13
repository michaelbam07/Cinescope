"use client"

import Link from "next/link"
import Image from "next/image"
import { useState } from "react"
import { useMovies } from "@/app/context/MovieContext"
import VideoProgressBar from "./VideoProgressBar"
import MovieCard from "./MovieCard"
import {movies} from "@/data/movie"

export default function RelatedMovies({ movies, currentMovieId }) {
  const { openTrailerPlayer, openEpisodePlayer, progress } = useMovies()
  const [hovered, setHovered] = useState(null)
  const [selectedSeasons, setSelectedSeasons] = useState({}) // { [seriesId]: seasonNumber }

  // Filter out undefined items and current movie/series
  const related = movies.filter((i) => i && Number(i.id) !== Number(currentMovieId)).slice(0, 6)
  if (related.length === 0) return null

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

  // Get max watched time for series or movie
  const getMaxProgress = (item, seasonNumber) => {
    if (Array.isArray(item.seasons)) {
      const season = item.seasons.find((s) => s.seasonNumber === seasonNumber)
      if (!season?.episodes) return 0
      return Math.max(
        0,
        ...season.episodes.map(
          (ep) => progress[`${item.id}-${seasonNumber}-${ep.episodeNumber}`]?.time || 0
        )
      )
    } else {
      return progress[item.id]?.time || 0
    }
  }

  return (
    <section className="mt-12 mb-8">
      <h2 className="text-2xl md:text-3xl font-bold mb-6 text-primary">
        Related Content
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {related.map((item) => {
          const validPoster = isValidUrl(item.thumbnail || item.poster) ? (item.thumbnail || item.poster) : null
          const isSeries = Array.isArray(item.seasons)

          const selectedSeasonNumber =
            selectedSeasons[item.id] ?? (isSeries ? item.seasons[0].seasonNumber : null)
          const selectedSeason = isSeries
            ? item.seasons.find((s) => s.seasonNumber === selectedSeasonNumber)
            : null
          const episodes = selectedSeason?.episodes || []

          const maxProgress = getMaxProgress(item, selectedSeasonNumber)

          return (
            <div
              key={item.id}
              className="group relative cursor-pointer"
              onMouseEnter={() => setHovered(item.id)}
              onMouseLeave={() => setHovered(null)}
            >
              <Link href={isSeries ? `/series/${item.id}` : `/movies/${item.id}`}>
                <div className="relative w-full h-[280px] rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300">
                  {validPoster ? (
                    <Image
                      src={validPoster}
                      alt={item.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-full bg-muted flex items-center justify-center">
                      <p className="text-muted-foreground">No image</p>
                    </div>
                  )}

                  {/* Max progress overlay bar */}
                  {maxProgress > 0 && (
                    <div className="absolute bottom-0 left-0 w-full h-1 bg-muted-foreground">
                      <div
                        className="h-full bg-primary transition-all duration-300"
                        style={{
                          width: `${(maxProgress / (isSeries ? episodes[0]?.duration : item.duration || 1)) * 100}%`
                        }}
                      />
                    </div>
                  )}

                  {/* Hover overlay */}
                  {hovered === item.id && (
                    <div className="absolute inset-0 bg-black/70 flex flex-col justify-between p-4 transition-opacity duration-200">
                      <p className="text-white text-sm line-clamp-3">{item.epilogue}</p>

                      {isSeries ? (
                        <div className="mt-2">
                          {/* Season selector */}
                          <div className="flex gap-2 overflow-x-auto mb-1">
                            {item.seasons.map((s) => (
                              <button
                                key={s.seasonNumber}
                                className={`px-2 py-1 text-xs rounded ${
                                  s.seasonNumber === selectedSeasonNumber
                                    ? "bg-primary text-primary-foreground shadow-md"
                                    : "bg-muted text-foreground hover:shadow-sm"
                                }`}
                                onClick={(e) => {
                                  e.preventDefault()
                                  setSelectedSeasons((prev) => ({
                                    ...prev,
                                    [item.id]: s.seasonNumber
                                  }))
                                }}
                              >
                                Season {s.seasonNumber}
                              </button>
                            ))}
                          </div>

                          {/* Episodes list */}
                          <div className="flex flex-col gap-1 max-h-36 overflow-y-auto">
                            {episodes.length > 0 ? (
                              episodes.map((ep) => {
                                const key = `${item.id}-${selectedSeasonNumber}-${ep.episodeNumber}`
                                const watchedTime = progress[key]?.time || 0
                                return (
                                  <div key={ep.episodeNumber} className="flex flex-col">
                                    <button
                                      className="text-xs text-white underline text-left"
                                      onClick={(e) => {
                                        e.preventDefault()
                                        openEpisodePlayer(item.id, selectedSeasonNumber, ep)
                                      }}
                                    >
                                      {ep.episodeNumber}. {ep.title}
                                    </button>
                                    {watchedTime > 0 && (
                                      <VideoProgressBar movieId={key} videoDuration={ep.duration} />
                                    )}
                                  </div>
                                )
                              })
                            ) : (
                              <p className="text-xs text-muted-foreground">No episodes</p>
                            )}
                          </div>
                        </div>
                      ) : (
                        <>
                          {/* Movie trailer button */}
                          {validPoster && (
                            <button
                              onClick={(e) => {
                                e.preventDefault()
                                openTrailerPlayer(item)
                              }}
                              className="w-full bg-primary hover:bg-primary-foreground text-primary-foreground hover:text-primary py-2 px-3 rounded-md font-semibold text-sm mt-2"
                            >
                              ▶ Play Trailer
                            </button>
                          )}

                          {/* Movie progress */}
                          {progress[item.id]?.time > 0 && (
                            <VideoProgressBar movieId={item.id} videoDuration={item.duration || 0} />
                          )}
                        </>
                      )}
                    </div>
                  )}
                </div>

                <p className="mt-3 font-medium text-foreground text-sm line-clamp-2">{item.title}</p>
                <p className="text-xs text-muted-foreground">{item.rating}/10</p>
              </Link>
            </div>
          )
        })}
      </div>
    </section>
  )
}
