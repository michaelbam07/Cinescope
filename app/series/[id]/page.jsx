"use client"

import { useParams } from "next/navigation"
import Image from "next/image"
import { useState, useEffect } from "react"
import { series } from "@/data/movie"
import { useMovies } from "@/app/context/MovieContext"
import VideoProgressBar from "@/components/VideoProgressBar"

export default function SeriesDetailPage() {
  const { id } = useParams()
  const { openEpisodePlayer, progress } = useMovies()

  const show = series.find((s) => s.id === Number(id))
  const [selectedSeason, setSelectedSeason] = useState(1)

  // Auto-select first season
  useEffect(() => {
    if (show?.seasons?.length > 0) {
      setSelectedSeason(show.seasons[0].seasonNumber)
    }
  }, [show])

  if (!show) {
    return (
      <main className="text-center mt-20 text-muted-foreground">
        Series not found.
      </main>
    )
  }

  const season = show.seasons?.find(
    (s) => s.seasonNumber === selectedSeason
  )

  if (!season) {
    return (
      <main className="text-center mt-20 text-muted-foreground">
        Season not found.
      </main>
    )
  }

  const getProgressKey = (ep) =>
    `${show.id}-${selectedSeason}-${ep.episodeNumber}`

  const getContinueTime = (ep) => {
    const key = getProgressKey(ep)
    return progress[key]?.time || 0
  }

  return (
    <main className="container mx-auto px-6 py-12 text-foreground animate-fadeIn">
      {/* HEADER */}
      <div className="flex gap-8 flex-col md:flex-row mb-12">
        <Image
          src={show.backdrop || show.poster}
          alt={show.title}
          width={320}
          height={400}
          className="rounded-xl shadow-xl object-cover"
        />

        <div className="flex-1">
          <h1 className="text-5xl font-extrabold text-primary">
            {show.title}
          </h1>

          <p className="mt-4 text-muted-foreground leading-relaxed">
            {show.epilogue}
          </p>

          <div className="mt-4 text-sm font-medium text-muted-foreground">
            Category: {show.category}
          </div>

          {/* SEASONS */}
          <div className="mt-8 flex flex-wrap gap-3">
            {show.seasons.map((s) => (
              <button
                key={s.seasonNumber}
                onClick={() => setSelectedSeason(s.seasonNumber)}
                className={`px-5 py-2 text-sm rounded-lg border font-semibold transition-transform duration-200 ${selectedSeason === s.seasonNumber
                    ? "bg-primary text-primary-foreground shadow-md scale-105"
                    : "bg-muted text-foreground hover:scale-105 hover:shadow-sm"
                  }`}
              >
                Season {s.seasonNumber}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* EPISODES */}
      <h2 className="text-3xl font-bold mb-6">Episodes</h2>

      {season.episodes?.length > 0 ? (
        <div className="grid md:grid-cols-2 gap-8">
          {season.episodes.map((ep) => {
            const continueTime = getContinueTime(ep)
            const progressKey = getProgressKey(ep)

            return (
              <div
                key={ep.episodeNumber}
                className="p-5 bg-card rounded-xl border border-border flex flex-col gap-3 hover:shadow-lg transition-all"
              >
                <Image
                  src={ep.thumbnail || show.poster}
                  alt={ep.title}
                  width={200}
                  height={120}
                  className="rounded-lg object-cover"
                />

                <div className="flex-1 flex flex-col">
                  <h3 className="text-lg font-semibold">
                    {ep.episodeNumber}. {ep.title}
                  </h3>

                  <p className="text-sm text-muted-foreground">
                    {ep.duration} mins
                  </p>

                  {/* Continue Watching Display */}
                  {continueTime > 0 && (
                    <p className="text-xs text-primary mt-1">
                      Continue at {Math.floor(continueTime)}s
                    </p>
                  )}

                  {/* Progress Bar */}
                  {ep.duration > 0 && (
                    <VideoProgressBar
                      movieId={progressKey}
                      videoDuration={ep.duration}
                    />
                  )}

                  <button
                    onClick={() =>
                      openEpisodePlayer(show.id, selectedSeason, ep)
                    }
                    className="mt-auto bg-primary text-primary-foreground px-4 py-2 rounded-md text-sm font-medium hover:opacity-90 transition-all"
                  >
                    ▶ Play Episode
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      ) : (
        <p className="text-center text-muted-foreground mt-6">
          No episodes available for this season.
        </p>
      )}
    </main>
  )
}
