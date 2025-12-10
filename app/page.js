"use client"

import Image from "next/image"
import Link from "next/link"
import { movies } from "@/data/movie"
import { useEffect, useState, useRef } from "react"
import { useMovies } from "@/app/context/MovieContext"
import Spinner from "@/components/Spinner"

// Validate if URL is valid
const isValidUrl = (url) => {
  if (!url || typeof url !== 'string') return false
  if (url.includes('${')) return false
  try {
    new URL(url)
    return true
  } catch {
    return false
  }
}

// Return a windowed slice of `data` starting at `start`, length `size`, wrapping around
const windowed = (data, start, size) => {
  if (!Array.isArray(data) || data.length === 0) return []
  const result = []
  const take = Math.min(size, data.length)
  for (let i = 0; i < take; i++) {
    result.push(data[(start + i) % data.length])
  }
  return result
}

// Render star rating (shared simple helper)
const renderStars = (ratingValue) => {
  const fullStars = Math.floor(ratingValue / 2)
  const hasHalfStar = (ratingValue % 2) >= 1
  return (
    <span className="flex items-center gap-1">
      {[...Array(5)].map((_, i) => (
        <span key={i} className="text-yellow-400">
          {i < fullStars ? "★" : i === fullStars && hasHalfStar ? "⭐" : "☆"}
        </span>
      ))}
    </span>
  )
}

export default function HomePage() {
  // Featured carousel settings
  const CAROUSEL_SIZE = Math.min(6, movies.length)
  const featuredList = movies.slice(0, CAROUSEL_SIZE)
  const [featuredIndex, setFeaturedIndex] = useState(0)
  const [featuredLoadedMap, setFeaturedLoadedMap] = useState({})
  const carouselRef = useRef(null)
  const [autoplayPaused, setAutoplayPaused] = useState(false)
  const autoplayRef = useRef(null)
  const pointerStartX = useRef(null)
  const { getAverageRating } = useMovies()

  const avgFeatured = (getAverageRating && typeof getAverageRating === "function") && featuredList[featuredIndex]
    ? getAverageRating(featuredList[featuredIndex].id)
    : null

  // Autoplay carousel with pause support
  useEffect(() => {
    const AUTOPLAY_MS = 6000
    if (autoplayRef.current) {
      clearInterval(autoplayRef.current)
      autoplayRef.current = null
    }
    if (!autoplayPaused && featuredList.length > 1) {
      autoplayRef.current = setInterval(() => {
        setFeaturedIndex((i) => (i + 1) % featuredList.length)
      }, AUTOPLAY_MS)
    }
    return () => {
      if (autoplayRef.current) {
        clearInterval(autoplayRef.current)
        autoplayRef.current = null
      }
    }
  }, [featuredList.length, autoplayPaused])

  // Keyboard navigation (left/right)
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "ArrowLeft") setFeaturedIndex((i) => (i - 1 + featuredList.length) % featuredList.length)
      if (e.key === "ArrowRight") setFeaturedIndex((i) => (i + 1) % featuredList.length)
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [featuredList.length])

  // Paging/window settings
  const PAGE_SIZE = 8
  const [startIndex, setStartIndex] = useState(0)
  const [scrollY, setScrollY] = useState(0)
  const throttleRef = useRef(false)

  useEffect(() => {
    const onScroll = () => {
      const nearBottom = window.innerHeight + window.scrollY >= document.body.offsetHeight - 120
      if (!nearBottom) return
      if (throttleRef.current) return
      throttleRef.current = true
      setStartIndex((s) => (s + PAGE_SIZE) % movies.length)
      setTimeout(() => (throttleRef.current = false), 600)
    }

    const onScrollParallax = () => {
      setScrollY(window.scrollY)
    }

    window.addEventListener("scroll", onScroll, { passive: true })
    window.addEventListener("scroll", onScrollParallax, { passive: true })
    return () => {
      window.removeEventListener("scroll", onScroll)
      window.removeEventListener("scroll", onScrollParallax)
    }
  }, [])

  return (
    <div className="bg-(--color-background) min-h-screen text-(--color-foreground) font-sans animate-fadeIn">

      {/* Hero Section */}
      <div className="relative h-[80vh] w-full overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1524985069026-dd778a71c7b4?auto=format&fit=crop&w=1400&q=80')",
            backgroundAttachment: "fixed",
            transform: `translateY(${scrollY * 0.5}px)`,
            transition: "transform 0.1s ease-out",
          }}
        />
        <div className="absolute inset-0 bg-linear-to-t from-black via-black/50 to-transparent" />
        <div className="relative h-full flex flex-col justify-center px-6 md:px-24 max-w-3xl space-y-6">
          <h1 className="text-5xl md:text-6xl font-extrabold">
            Welcome to <span className="text-(--color-muted)">CineScope</span>
          </h1>
          <p className="text-(--color-muted-foreground) text-lg md:text-xl max-w-xl leading-relaxed">
            Explore movies, discover stories, and build your watchlist — all in one place.
          </p>
          <Link
            href="/movies"
            className="bg-(--color-primary) hover:bg-(--color-primary-foreground) text-(--color-primary-foreground) hover:text-(--color-primary) transition-all px-6 py-3 rounded-lg text-lg font-semibold w-fit"
          >
            Browse Movies →
          </Link>
        </div>
      </div>

      {/* Featured Carousel */}
      <section className="px-6 md:px-24 py-12 relative">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-3xl md:text-4xl font-bold text-(--color-primary)">Featured</h2>
          <div className="flex gap-3">
            <button
              aria-label="Previous featured"
              onClick={() => setFeaturedIndex((i) => (i - 1 + featuredList.length) % featuredList.length)}
              className="px-3 py-2 rounded-md bg-(--color-muted) hover:scale-110 transition-transform"
            >◀</button>
            <button
              aria-label="Next featured"
              onClick={() => setFeaturedIndex((i) => (i + 1) % featuredList.length)}
              className="px-3 py-2 rounded-md bg-(--color-muted) hover:scale-110 transition-transform"
            >▶</button>
          </div>
        </div>

        <div
          ref={carouselRef}
          tabIndex={0}
          onMouseEnter={() => setAutoplayPaused(true)}
          onMouseLeave={() => setAutoplayPaused(false)}
          onFocus={() => setAutoplayPaused(true)}
          onBlur={() => setAutoplayPaused(false)}
          onPointerDown={(e) => { pointerStartX.current = e.clientX }}
          onPointerUp={(e) => {
            const start = pointerStartX.current || 0
            const delta = e.clientX - start
            pointerStartX.current = null
            if (delta > 50) setFeaturedIndex((i) => (i - 1 + featuredList.length) % featuredList.length)
            if (delta < -50) setFeaturedIndex((i) => (i + 1) % featuredList.length)
          }}
          className="bg-(--color-card) rounded-xl overflow-hidden shadow-2xl relative"
          style={{ transform: `translateY(${Math.min(scrollY * 0.2, 40)}px)`, transition: "transform 0.1s ease-out" }}
        >
          <div className="flex transition-transform duration-700 ease-out" style={{ width: `${featuredList.length * 100}%`, transform: `translateX(-${featuredIndex * (100 / featuredList.length)}%)` }}>
            {featuredList.map((fm, idx) => {
              const validPoster = isValidUrl(fm.poster) ? fm.poster : null
              const validTrailer = isValidUrl(fm.trailer) ? fm.trailer : null
              const loaded = !!featuredLoadedMap[idx]
              return (
                <div key={fm.id} className="w-full md:w-1/1 shrink-0 md:flex-1 md:grow" style={{ width: `${100 / featuredList.length}%` }}>
                  <div className="md:flex md:gap-6 h-full">
                    <div className="relative w-full md:flex-1 h-64 md:h-[400px]">
                      {!loaded && (
                        <div className="absolute inset-0 flex items-center justify-center z-40 bg-black/5">
                          <Spinner />
                        </div>
                      )}
                      {validPoster ? (
                        <div className="w-full h-full bg-cover bg-center" style={{ backgroundImage: `url('${validPoster}')` }} />
                      ) : validTrailer ? (
                        <iframe src={validTrailer} className="w-full h-full" allowFullScreen title={`${fm.title} Trailer`} onLoad={() => setFeaturedLoadedMap(m => ({ ...m, [idx]: true }))} />
                      ) : (
                        <div className="w-full h-full bg-(--color-muted) flex items-center justify-center">
                          <p className="text-(--color-muted-foreground)">No preview available</p>
                        </div>
                      )}
                    </div>

                    <div className="p-6 md:p-10 flex flex-col justify-between md:flex-1">
                      <div>
                        <h3 className="text-2xl md:text-3xl font-bold text-(--color-foreground)">{fm.title}</h3>
                        <p className="text-(--color-muted-foreground) mt-2">{fm.epilogue}</p>
                      </div>

                      <div className="text-(--color-muted-foreground) space-y-1 text-sm mt-4">
                        <p><strong>Genre:</strong> {fm.category}</p>
                        <p><strong>Release:</strong> {fm.dateReleased}</p>
                        <p className="flex items-center gap-2">
                          <strong>Rating:</strong>
                          <span>{fm.rating}</span>
                          {avgFeatured !== null && idx === featuredIndex && (
                            <span className="flex items-center gap-2 ml-2">
                              {renderStars(avgFeatured)}
                              <span className="text-sm text-(--color-muted-foreground)">{avgFeatured.toFixed(1)}/10</span>
                            </span>
                          )}
                        </p>
                        <p><strong>Actors:</strong> {fm.actors.join(", ")}</p>
                      </div>

                      <div className="mt-4">
                        <Link href={`/movies/${fm.id}`} className="inline-block bg-(--color-primary) hover:bg-(--color-primary-foreground) text-(--color-primary-foreground) hover:text-(--color-primary) px-5 py-2 rounded-md font-semibold transition-all transform hover:-translate-y-0.5 hover:scale-105 motion-safe:animate-pulse">
                          View Details
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Slide indicators */}
        <div className="flex items-center justify-center gap-2 mt-4">
          {featuredList.map((_, i) => (
            <button
              key={i}
              aria-label={`Go to slide ${i + 1}`}
              onClick={() => setFeaturedIndex(i)}
              className={`w-3 h-3 rounded-full transition-colors ${i === featuredIndex ? "bg-(--color-primary)" : "bg-(--color-muted)"}`}
            />
          ))}
        </div>
      </section>

      {/* Movie Rows (windowed by startIndex) */}
      <MovieRow title="Trending Now" data={windowed(movies.slice(0, 10), startIndex, PAGE_SIZE)} />
      <MovieRow title="Top Rated" data={windowed(movies.slice().sort((a, b) => b.rating - a.rating).slice(0, 10), startIndex, PAGE_SIZE)} />
      <MovieRow title="Action Movies" data={windowed(movies.filter(m => m.category === "Action"), startIndex, PAGE_SIZE)} />
      <MovieRow title="Drama" data={windowed(movies.filter(m => m.category === "Drama"), startIndex, PAGE_SIZE)} />
      <MovieRow title="Comedy" data={windowed(movies.filter(m => m.category === "Comedy"), startIndex, PAGE_SIZE)} />

    </div>
  )
}

function MovieRow({ title, data }) {
  const [autoScroll, setAutoScroll] = useState(true)
  const scrollRef = useRef(null)

  // Auto-scroll with infinite loop (smooth, continuous)
  useEffect(() => {
    const container = scrollRef.current
    if (!container || !autoScroll || data.length === 0) return

    const cardWidth = 180 + 16 // width + gap
    let scrollPos = 0
    const SCROLL_SPEED = 0.5 // pixels per frame

    const interval = setInterval(() => {
      scrollPos += SCROLL_SPEED
      // Reset to start when reaching ~halfway (for seamless loop illusion)
      if (scrollPos > cardWidth * Math.floor(data.length / 2)) {
        scrollPos = 0
      }
      if (container) {
        container.scrollLeft = scrollPos
      }
    }, 1000 / 60) // 60fps

    return () => clearInterval(interval)
  }, [autoScroll, data.length])

  // Pause on hover, resume on leave
  const handleMouseEnter = () => setAutoScroll(false)
  const handleMouseLeave = () => setAutoScroll(true)

  // Snap to card on manual scroll
  const handleScroll = (e) => {
    const container = e.target
    const cardWidth = 180 + 16
    const scrollLeft = container.scrollLeft
    const cardIndex = Math.round(scrollLeft / cardWidth)
    const snapPos = cardIndex * cardWidth

    // Only snap if we're close enough to a card (within 20% of card width)
    if (Math.abs(scrollLeft - snapPos) < cardWidth * 0.2) {
      setAutoScroll(false) // Pause autoplay when user interacts
      container.scrollLeft = snapPos
    }
  }

  return (
    <section className="px-6 md:px-24 py-8">
      <h2 className="text-2xl md:text-3xl font-bold mb-4 text-(--color-primary)">{title}</h2>
      <div
        ref={scrollRef}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onScroll={handleScroll}
        className="flex gap-4 overflow-x-scroll scrollbar-hide pb-4 scroll-smooth"
      >
        {data.map((movie) => {
          const validPoster = isValidUrl(movie.poster) ? movie.poster : null
          return (
            <Link
              key={movie.id}
              href={`/movies/${movie.id}`}
              className="shrink-0 transform hover:scale-105 transition-transform duration-300"
            >
              <div className="bg-(--color-card) rounded-xl overflow-hidden w-[180px] h-[250px] relative shadow-md hover:shadow-xl">
                {validPoster ? (
                  <Image
                    src={validPoster}
                    alt={movie.title}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-(--color-muted) flex items-center justify-center">
                    <p className="text-xs text-(--color-muted-foreground) text-center px-2">No image</p>
                  </div>
                )}
              </div>
              <p className="mt-2 text-sm text-(--color-muted-foreground) truncate">{movie.title}</p>
            </Link>
          )
        })}
      </div>
    </section>
  )
}
