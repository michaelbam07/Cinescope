"use client"

import { createContext, useContext, useState, useMemo, useEffect } from "react"

const MovieContext = createContext(null)

export const MovieProvider = ({ children }) => {

  // -----------------------------------------
  // 🎬 MOVIES — Likes & Watch Later
  // -----------------------------------------
  const [likedMovies, setLikedMovies] = useState([])
  const [watchLater, setWatchLater] = useState([])

  // -----------------------------------------
  // 📺 SERIES — Likes & Watch Later
  // -----------------------------------------
  const [likedSeries, setLikedSeries] = useState([])
  const [watchLaterSeries, setWatchLaterSeries] = useState([])

  // -----------------------------------------
  // 🎛 Filters
  // -----------------------------------------
  const [activeCategory, setActiveCategory] = useState("all")
  const [activeActor, setActiveActor] = useState("all")

  // -----------------------------------------
  // ▶ PLAYER STATE
  // -----------------------------------------
  const [currentMovie, setCurrentMovie] = useState(null)
  const [currentTrailer, setCurrentTrailer] = useState(null)
  const [isPlayerOpen, setIsPlayerOpen] = useState(false)

  const openMoviePlayer = (movie) => {
    setCurrentMovie(movie)
    setCurrentTrailer(null)
    setIsPlayerOpen(true)
  }

  const openTrailerPlayer = (movie) => {
    setCurrentTrailer(movie)
    setCurrentMovie(null)
    setIsPlayerOpen(true)
  }

  const closePlayer = () => {
    setIsPlayerOpen(false)
    setCurrentMovie(null)
    setCurrentTrailer(null)
  }

  // -----------------------------------------
  // 🔁 CONTINUE WATCHING (Movies)
  // -----------------------------------------
  const [progress, setProgress] = useState({})

  const updateProgress = (id, time, duration) => {
    setProgress((prev) => ({
      ...prev,
      [id]: { time, duration },
    }))
  }

  const resetProgress = (id) => {
    setProgress((prev) => {
      const copy = { ...prev }
      delete copy[id]
      return copy
    })
  }

  const continueWatchingList = Object.entries(progress)
    .filter(([_, p]) => p.time > 5)
    .map(([id, p]) => ({ id: Number(id), ...p }))

  // -----------------------------------------
  // ❤️ MOVIE ACTIONS
  // -----------------------------------------
  const toggleLike = (id) => {
    setLikedMovies((prev) =>
      prev.includes(id) ? prev.filter((m) => m !== id) : [...prev, id]
    )
  }

  const toggleWatchLater = (id) => {
    setWatchLater((prev) =>
      prev.includes(id) ? prev.filter((m) => m !== id) : [...prev, id]
    )
  }

  // -----------------------------------------
  // ❤️ SERIES ACTIONS
  // -----------------------------------------
  const toggleLikeSeries = (id) => {
    setLikedSeries((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
    )
  }

  const toggleWatchLaterSeries = (id) => {
    setWatchLaterSeries((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
    )
  }

  // -----------------------------------------
  // Helpers
  // -----------------------------------------
  const getMovieById = (id, list) =>
    list.find((m) => m.id === Number(id))

  const favouriteMovies = likedMovies

  // -----------------------------------------
  // 📝 REVIEWS
  // -----------------------------------------
  const [reviews, setReviews] = useState({})

  useEffect(() => {
    const raw = localStorage.getItem("cinescope_reviews")
    if (raw) setReviews(JSON.parse(raw))
  }, [])

  useEffect(() => {
    localStorage.setItem("cinescope_reviews", JSON.stringify(reviews))
  }, [reviews])

  const addReview = (movieId, { name, rating, text }) => {
    const id = Date.now()
    const review = {
      id,
      name: name || "Anonymous",
      rating: Number(rating),
      text,
      date: new Date().toISOString(),
    }

    setReviews((prev) => {
      const copy = { ...prev }
      const existing = copy[movieId] || []
      copy[movieId] = [review, ...existing]
      return copy
    })
  }

  const getReviews = (movieId) => reviews[movieId] || []
  const getReviewCount = (movieId) => getReviews(movieId).length

  const getAverageRating = (movieId) => {
    const list = getReviews(movieId)
    if (!list.length) return null
    const avg =
      list.reduce((sum, r) => sum + r.rating, 0) / list.length
    return avg.toFixed(1)
  }

  // -----------------------------------------
  // Context Value
  // -----------------------------------------
  const value = useMemo(
    () => ({
      // movies
      likedMovies,
      favouriteMovies,
      watchLater,
      toggleLike,
      toggleWatchLater,

      // series
      likedSeries,
      watchLaterSeries,
      toggleLikeSeries,
      toggleWatchLaterSeries,

      // filters
      activeCategory,
      activeActor,
      setActiveCategory,
      setActiveActor,

      // player
      currentMovie,
      currentTrailer,
      isPlayerOpen,
      openMoviePlayer,
      openTrailerPlayer,
      closePlayer,

      // progress
      progress,
      updateProgress,
      resetProgress,
      continueWatchingList,

      // reviews
      reviews,
      addReview,
      getReviews,
      getReviewCount,
      getAverageRating,

      // helpers
      getMovieById,
    }),
    [
      likedMovies,
      watchLater,
      likedSeries,
      watchLaterSeries,
      activeCategory,
      activeActor,
      currentMovie,
      currentTrailer,
      isPlayerOpen,
      progress,
      reviews,
    ]
  )

  return (
    <MovieContext.Provider value={value}>
      {children}
    </MovieContext.Provider>
  )
}

// ✅ MOVIE HOOK
export const useMovies = () => {
  const ctx = useContext(MovieContext)
  if (!ctx) throw new Error("useMovies must be used inside MovieProvider")
  return ctx
}

// ✅ SERIES HOOK
export const useSeries = () => {
  const ctx = useContext(MovieContext)
  if (!ctx) throw new Error("useSeries must be used inside MovieProvider")

  return {
    likedSeries: ctx.likedSeries,
    watchLaterSeries: ctx.watchLaterSeries,
    toggleLike: ctx.toggleLikeSeries,
    toggleWatchLater: ctx.toggleWatchLaterSeries,
  }
}
