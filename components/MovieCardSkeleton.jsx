'use client'

/**
 * MovieCardSkeleton - A skeleton loader for movie cards
 * Shows a shimmer animation while content is loading
 */
export function MovieCardSkeleton() {
  return (
    <div className="flex flex-col gap-3">
      {/* Poster skeleton */}
      <div className="relative overflow-hidden rounded-lg aspect-2/3 bg-(--color-muted) animate-shimmer" />
      
      {/* Title skeleton */}
      <div className="h-4 bg-(--color-muted) rounded animate-shimmer" />
      
      {/* Rating/metadata skeleton */}
      <div className="flex justify-between items-center gap-2">
        <div className="h-3 bg-(--color-muted) rounded w-16 animate-shimmer" />
        <div className="h-3 bg-(--color-muted) rounded w-12 animate-shimmer" />
      </div>
    </div>
  )
}

/**
 * MovieGridSkeleton - Skeleton loader for movie grid
 * Shows multiple skeleton cards in a grid layout
 */
export function MovieGridSkeleton({ count = 12 }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <MovieCardSkeleton key={i} />
      ))}
    </div>
  )
}

/**
 * MovieDetailSkeleton - Skeleton loader for movie detail page
 * Shows skeleton for poster, title, and metadata
 */
export function MovieDetailSkeleton() {
  return (
    <div className="grid md:grid-cols-3 gap-8 mb-12">
      {/* Poster skeleton */}
      <div className="md:col-span-1">
        <div className="aspect-2/3 bg-(--color-muted) rounded-lg animate-shimmer" />
      </div>

      {/* Details skeleton */}
      <div className="md:col-span-2 space-y-6">
        {/* Title */}
        <div className="space-y-2">
          <div className="h-8 bg-(--color-muted) rounded w-3/4 animate-shimmer" />
          <div className="h-4 bg-(--color-muted) rounded w-1/2 animate-shimmer" />
        </div>

        {/* Rating section */}
        <div className="space-y-3">
          <div className="h-4 bg-(--color-muted) rounded w-20 animate-shimmer" />
          <div className="flex gap-2">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="h-5 bg-(--color-muted) rounded-full w-5 animate-shimmer" />
            ))}
          </div>
        </div>

        {/* Description */}
        <div className="space-y-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-4 bg-(--color-muted) rounded w-full animate-shimmer" />
          ))}
          <div className="h-4 bg-(--color-muted) rounded w-3/4 animate-shimmer" />
        </div>

        {/* Buttons */}
        <div className="flex gap-4">
          <div className="h-10 bg-(--color-muted) rounded w-32 animate-shimmer" />
          <div className="h-10 bg-(--color-muted) rounded w-32 animate-shimmer" />
        </div>
      </div>
    </div>
  )
}
