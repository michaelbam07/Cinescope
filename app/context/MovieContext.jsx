"use client"

import { createContext, useContext, useState, useMemo, useEffect } from "react"

const MovieContext = createContext(null)

export const MovieProvider = ({ children }) => {
  // -----------------------------------------
  // ❤️ Liked & Watch Later
  // -----------------------------------------
  const [likedMovies, setLikedMovies] = useState([])
  const [watchLater, setWatchLater] = useState([])

  // -----------------------------------------
  // 🎬 Filters
  // -----------------------------------------
  const [activeCategory, setActiveCategory] = useState("all")
  const [activeActor, setActiveActor] = useState("all")

  // -----------------------------------------
  // ▶ VIDEO PLAYER STATE
  // -----------------------------------------
  const [currentMovie, setCurrentMovie] = useState(null)         // full movie video
  const [currentTrailer, setCurrentTrailer] = useState(null)     // trailer video
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
  // 🔁 CONTINUE WATCHING SYSTEM
  // -----------------------------------------
  const [progress, setProgress] = useState({}) 
  // Format: { movieId: { time: 120, duration: 7200 } }

  const updateProgress = (movieId, time, duration) => {
    setProgress(prev => ({
      ...prev,
      [movieId]: { time, duration }
    }))
  }

  const resetProgress = (movieId) => {
    setProgress(prev => {
      const newState = { ...prev }
      delete newState[movieId]
      return newState
    })
  }

  const continueWatchingList = Object.entries(progress)
    .filter(([_, p]) => p.time > 5) // only show if watched for > 5 seconds
    .map(([id, p]) => ({ id: Number(id), ...p }))

  // -----------------------------------------
  // ❤️ Watch Later / Like Toggles
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
  // -----------------------------------------
  // Helpers
  // -----------------------------------------
  const favouriteMovies = likedMovies

  const getMovieById = (id, list) => list.find((m) => m.id === Number(id))

  // -----------------------------------------
  // 📝 Ratings & Reviews
  // -----------------------------------------
  // Stored shape: { [movieId]: [ { id, name, rating, text, date } ] }
  const [reviews, setReviews] = useState({})

  // Load reviews from localStorage on mount
  useEffect(() => {
    try {
      const raw = localStorage.getItem("cinescope_reviews")
      if (raw) setReviews(JSON.parse(raw))
    } catch (e) {
      console.error("Failed to load reviews", e)
    }
  }, [])

  // Persist reviews whenever they change
  useEffect(() => {
    try {
      localStorage.setItem("cinescope_reviews", JSON.stringify(reviews))
    } catch (e) {
      console.error("Failed to save reviews", e)
    }
  }, [reviews])

  const addReview = (movieId, { name = "Anonymous", rating = 0, text = "" }) => {
    const id = Date.now()
    const entry = { id, name, rating: Number(rating), text, date: new Date().toISOString() }
    setReviews((prev) => {
      const copy = { ...prev }
      const list = Array.isArray(copy[movieId]) ? [...copy[movieId]] : []
      list.unshift(entry)
      copy[movieId] = list
      return copy
    })
  }

  const getReviews = (movieId) => {
    return Array.isArray(reviews[movieId]) ? reviews[movieId] : []
  }

  const getReviewCount = (movieId) => getReviews(movieId).length

  const getAverageRating = (movieId) => {
    const list = getReviews(movieId)
    if (list.length === 0) return null
    const sum = list.reduce((s, r) => s + (Number(r.rating) || 0), 0)
    return Number((sum / list.length).toFixed(1))
  }

  // -----------------------------------------
  // Memoized Context
  // -----------------------------------------
  const value = useMemo(
    () => ({
      likedMovies,
      favouriteMovies,
      watchLater,
      activeCategory,
      activeActor,

      toggleLike,
      toggleWatchLater,
      setActiveCategory,
      setActiveActor,
      getMovieById,

      // --- VIDEO PLAYER ---
      isPlayerOpen,
      currentMovie,
      currentTrailer,
      openMoviePlayer,
      openTrailerPlayer,
      closePlayer,

      // --- CONTINUE WATCHING ---
      progress,
      updateProgress,
      resetProgress,
      continueWatchingList,

      // --- REVIEWS ---
      reviews,
      addReview,
      getReviews,
      getReviewCount,
      getAverageRating,
    }),
    [
      likedMovies,
      watchLater,
      activeCategory,
      activeActor,
      isPlayerOpen,
      currentMovie,
      currentTrailer,
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

export const useMovies = () => {
  const ctx = useContext(MovieContext)
  if (!ctx) throw new Error("useMovies must be used inside MovieProvider")
  return ctx
}
