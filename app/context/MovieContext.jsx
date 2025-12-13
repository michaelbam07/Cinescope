"use client"

import { createContext, useContext, useState, useEffect, useMemo } from "react"

const MovieContext = createContext(null)

export const MovieProvider = ({ children }) => {
  // ===========================
  // ❤️ Movies & Series
  // ===========================
  const [likedMovies, setLikedMovies] = useState([])
  const [watchLater, setWatchLater] = useState([])
  const [likedSeries, setLikedSeries] = useState([])
  const [watchLaterSeries, setWatchLaterSeries] = useState([])

  // ===========================
  // Filters
  // ===========================
  const [activeCategory, setActiveCategory] = useState("all")
  const [activeActor, setActiveActor] = useState("all")

  // ===========================
  // Player State
  // ===========================
  const [currentMovie, setCurrentMovie] = useState(null)
  const [currentTrailer, setCurrentTrailer] = useState(null)
  const [currentEpisode, setCurrentEpisode] = useState(null)
  const [isPlayerOpen, setIsPlayerOpen] = useState(false)

  const openMoviePlayer = (movie) => {
    setCurrentMovie(movie)
    setCurrentTrailer(null)
    setCurrentEpisode(null)
    setIsPlayerOpen(true)
  }

  const openTrailerPlayer = (movie) => {
    setCurrentTrailer(movie)
    setCurrentMovie(null)
    setCurrentEpisode(null)
    setIsPlayerOpen(true)
  }

  const openEpisodePlayer = (seriesId, seasonNumber, episodeObj) => {
    setCurrentEpisode({
      seriesId,
      seasonNumber,
      ...episodeObj,
    })
    setCurrentMovie(null)
    setCurrentTrailer(null)
    setIsPlayerOpen(true)
  }

  const closePlayer = () => {
    setIsPlayerOpen(false)
    setCurrentMovie(null)
    setCurrentTrailer(null)
    setCurrentEpisode(null)
  }

  // ===========================
  // Watch Progress (Movies + Episodes)
  // ===========================
  const [progress, setProgress] = useState({})

  const updateProgress = (key, time, duration) => {
    setProgress((prev) => ({
      ...prev,
      [key]: { time, duration },
    }))
  }

  const resetProgress = (key) => {
    setProgress((prev) => {
      const copy = { ...prev }
      delete copy[key]
      return copy
    })
  }

  const getMovieProgress = (movieId) => {
    const key = `movie-${movieId}`
    return progress[key] || { time: 0, duration: 0 }
  }

  const getEpisodeProgress = (seriesId, season, episode) => {
    const key = `series-${seriesId}-${season}-${episode}`
    return progress[key] || { time: 0, duration: 0 }
  }

  const continueWatchingList = Object.entries(progress)
    .filter(([_, p]) => p.time > 5)
    .map(([key, p]) => ({ key, ...p }))

  // ===========================
  // Like & Watch Later Actions
  // ===========================
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

  // ===========================
  // Reviews System
  // ===========================
  const [reviews, setReviews] = useState({})

  useEffect(() => {
    const saved = localStorage.getItem("cinescope_reviews")
    if (saved) setReviews(JSON.parse(saved))
  }, [])

  useEffect(() => {
    localStorage.setItem("cinescope_reviews", JSON.stringify(reviews))
  }, [reviews])

  const addReview = (movieId, { name, rating, text }) => {
    const id = Date.now()
    const entry = {
      id,
      name: name || "Anonymous",
      rating: Number(rating) || 0,
      text,
      date: new Date().toISOString(),
    }

    setReviews((prev) => {
      const copy = { ...prev }
      const list = copy[movieId] || []
      copy[movieId] = [entry, ...list]
      return copy
    })
  }

  const getReviews = (movieId) => reviews[movieId] || []
  const getReviewCount = (movieId) => getReviews(movieId).length

  const getAverageRating = (movieId) => {
    const list = getReviews(movieId)
    if (!list.length) return null
    const avg = list.reduce((s, r) => s + Number(r.rating || 0), 0) / list.length
    return avg.toFixed(1)
  }

  // ===========================
  // LocalStorage Persistence
  // ===========================
  const storageSync = (key, setter) => {
    useEffect(() => {
      const saved = localStorage.getItem(key)
      if (saved) setter(JSON.parse(saved))
    }, [])

    useEffect(() => {
      setter && localStorage.setItem(key, JSON.stringify(eval(key)))
    }, [eval(key)])
  }

  // Movies
  useEffect(() => {
    const saved = localStorage.getItem("likedMovies")
    if (saved) setLikedMovies(JSON.parse(saved))
  }, [])

  useEffect(() => localStorage.setItem("likedMovies", JSON.stringify(likedMovies)), [likedMovies])

  useEffect(() => {
    const saved = localStorage.getItem("watchLater")
    if (saved) setWatchLater(JSON.parse(saved))
  }, [])

  useEffect(() => localStorage.setItem("watchLater", JSON.stringify(watchLater)), [watchLater])

  // Series
  useEffect(() => {
    const saved = localStorage.getItem("likedSeries")
    if (saved) setLikedSeries(JSON.parse(saved))
  }, [])

  useEffect(() =>
    localStorage.setItem("likedSeries", JSON.stringify(likedSeries)),
    [likedSeries]
  )

  useEffect(() => {
    const saved = localStorage.getItem("watchLaterSeries")
    if (saved) setWatchLaterSeries(JSON.parse(saved))
  }, [])

  useEffect(() =>
    localStorage.setItem("watchLaterSeries", JSON.stringify(watchLaterSeries)),
    [watchLaterSeries]
  )

  // ===========================
  // Context Value
  // ===========================
  const value = useMemo(
    () => ({
      // Movies
      likedMovies,
      watchLater,
      toggleLike,
      toggleWatchLater,
      getMovieProgress,

      // Series
      likedSeries,
      watchLaterSeries,
      toggleLikeSeries,
      toggleWatchLaterSeries,

      // Episode player
      currentEpisode,
      openEpisodePlayer,
      getEpisodeProgress,
      updateProgress,
      resetProgress,
      progress,

      // Filters
      activeCategory,
      activeActor,
      setActiveCategory,
      setActiveActor,

      // Player
      currentMovie,
      currentTrailer,
      isPlayerOpen,
      openMoviePlayer,
      openTrailerPlayer,
      closePlayer,

      // Reviews
      reviews,
      addReview,
      getReviews,
      getReviewCount,
      getAverageRating,
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
      currentEpisode,
      isPlayerOpen,
      progress,
      reviews,
    ]
  )

  return <MovieContext.Provider value={value}>{children}</MovieContext.Provider>
}

// ===========================
// Hooks
// ===========================
export const useMovies = () => {
  const ctx = useContext(MovieContext)
  if (!ctx) throw new Error("useMovies must be used inside MovieProvider")
  return ctx
}

export const useSeries = () => {
  const ctx = useContext(MovieContext)
  if (!ctx) throw new Error("useSeries must be used inside MovieProvider")
  return {
    likedSeries: ctx.likedSeries,
    watchLaterSeries: ctx.watchLaterSeries,
    toggleLikeSeries: ctx.toggleLikeSeries,
    toggleWatchLaterSeries: ctx.toggleWatchLaterSeries,
    currentEpisode: ctx.currentEpisode,
    openEpisodePlayer: ctx.openEpisodePlayer,
    getEpisodeProgress: ctx.getEpisodeProgress,
    updateProgress: ctx.updateProgress,
    resetProgress: ctx.resetProgress,
  }
}
