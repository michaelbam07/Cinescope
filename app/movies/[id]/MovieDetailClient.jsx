"use client"

import { useState } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { useMovies } from "@/app/context/MovieContext"
import Reviews from "@/components/Reviews"
import RelatedMovies from "@/components/RelatedMovies"
import CastSection from "@/components/CastSection"
import VideoProgressBar from "@/components/VideoProgressBar"
import { movies as allMovies } from "@/data/movie"
import VideoPlayer from "@/components/VideoPlayer"

export default function MovieDetailClient({ movie }) {
  const movieId = Number(movie.id)
  const { likedMovies, watchLater, toggleLike, toggleWatchLater } = useMovies()

  const [movieOpen, setMovieOpen] = useState(false)
  const [activeVideo, setActiveVideo] = useState(null)

  //Validate URL
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

  const validPoster = isValidUrl(movie.backdrop) ? movie.backdrop : null
  const validTrailer = isValidUrl(movie.trailer) ? movie.trailer : null
  const validVideo = isValidUrl(movie.video) ? movie.video : null

  const isLiked = likedMovies.includes(movieId)
  const isSaved = watchLater.includes(movieId)

  const relatedMoviesByCategory = allMovies.filter(
    (m) => m.category === movie.category && Number(m.id) !== movieId
  )

  return (
    <main className="max-w-6xl mx-auto py-10 px-4 animate-fadeIn">

      {/* IMAGE / PREVIEW */}
      <div className="w-full h-[450px] overflow-hidden rounded-xl shadow-lg bg-(--color-card)">
        {validPoster ? (
          <Image
            src={validPoster}
            alt={movie.title}
            width={1000}
            height={600}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-(--color-muted) flex items-center justify-center">
            <p className="text-(--color-muted-foreground)">No preview available</p>
          </div>
        )}
      </div>

      {/* VIDEO PROGRESS */}
      <VideoProgressBar movieId={movieId} videoDuration={7200} />

      {/* DETAILS */}
      <section className="mt-6">
        <h1 className="text-4xl font-bold">{movie.title}</h1>
        <p className="mt-2 text-lg text-(--color-muted-foreground)">
          {movie.epilogue}
        </p>
      </section>

      {/* ACTION BUTTONS */}
      <section className="mt-10 flex flex-wrap gap-4">

        {/* PLAY MOVIE */}
        <Button
          onClick={() => { setActiveVideo(validVideo); setMovieOpen(true)}}
          disabled={!validVideo}
          className="px-6 py-3 text-lg bg-(--color-primary) text-(--color-primary-foreground)
  hover:bg-(--color-primary-foreground) hover:text-(--color-primary) transition-all transform hover:scale-105"
        >
          {validVideo ? "▶ Play" : "No Movie Available"}
        </Button>


        {/* PLAY TRAILER */}
        <Button
          disabled={!validTrailer}
          onClick={() => setActiveVideo(validTrailer)}
          className="px-6 py-3 text-lg bg-(--color-secondary) text-white hover:scale-105 transition"
        >
          🎬 Play Trailer
        </Button>

        {/* WATCHLIST */}
        <Button
          onClick={() => toggleWatchLater(movieId)}
          className={isSaved ? "bg-(--color-accent) text-white" : "bg-(--color-muted)"}
        >
          {isSaved ? "Remove from Watchlist" : "Add to Watchlist"}
        </Button>

        {/* LIKE */}
        <Button
          onClick={() => toggleLike(movieId)}
          className={isLiked ? "bg-red-600 text-white" : "bg-(--color-muted)"}
        >
          {isLiked ? "❤️ Liked" : "❤️ Add to Favorites"}
        </Button>
      </section>

      {/* CAST */}
      {movie.actors && <CastSection actors={movie.actors} />}

      {/* RELATED */}
      <RelatedMovies
        movies={relatedMoviesByCategory}
        currentMovieId={movieId}
      />

      {/* REVIEWS */}
      <Reviews movieId={movieId} />

      {/* VIDEO PLAYER MODAL */}
      {activeVideo && (
        <VideoPlayer
          src={activeVideo}
          onClose={() => setActiveVideo(null)}
        />
      )}
    </main>
  )
}
