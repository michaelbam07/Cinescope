"use client"

import { motion } from "framer-motion"

// Helper for the shimmer animation
const Shimmer = () => (
  <motion.div
    initial={{ x: "-100%" }}
    animate={{ x: "100%" }}
    transition={{
      repeat: Infinity,
      duration: 1.5,
      ease: "linear",
    }}
    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/[0.05] to-transparent z-10"
  />
)

export function MovieCardSkeleton() {
  return (
    <div className="flex flex-col gap-4">
      {/* Poster skeleton with the same aspect ratio as MovieCard */}
      <div className="relative overflow-hidden rounded-2xl aspect-[2/3] bg-white/5 border border-white/5">
        <Shimmer />
      </div>
      
      {/* Title skeleton */}
      <div className="relative overflow-hidden h-5 bg-white/5 rounded-md w-4/5">
        <Shimmer />
      </div>
      
      {/* Metadata skeleton */}
      <div className="flex justify-between items-center">
        <div className="relative overflow-hidden h-3 bg-white/5 rounded w-1/4">
          <Shimmer />
        </div>
        <div className="relative overflow-hidden h-3 bg-white/5 rounded w-1/6">
          <Shimmer />
        </div>
      </div>
    </div>
  )
}

export function MovieGridSkeleton({ count = 10 }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 md:gap-10">
      {Array.from({ length: count }).map((_, i) => (
        <MovieCardSkeleton key={i} />
      ))}
    </div>
  )
}

export function MovieDetailSkeleton() {
  return (
    <div className="container mx-auto px-6 pt-32">
      <div className="grid lg:grid-cols-12 gap-12">
        {/* Poster Skeleton */}
        <div className="lg:col-span-4">
          <div className="relative aspect-[2/3] bg-white/5 rounded-3xl overflow-hidden border border-white/10">
            <Shimmer />
          </div>
        </div>

        {/* Info Skeleton */}
        <div className="lg:col-span-8 space-y-8">
          <div className="space-y-4">
            {/* Category Tag */}
            <div className="relative overflow-hidden h-4 bg-primary/20 rounded w-24"><Shimmer /></div>
            {/* Title */}
            <div className="relative overflow-hidden h-20 bg-white/5 rounded-xl w-3/4"><Shimmer /></div>
            {/* Metadata Line */}
            <div className="flex gap-4">
              <div className="relative overflow-hidden h-4 bg-white/5 rounded w-16"><Shimmer /></div>
              <div className="relative overflow-hidden h-4 bg-white/5 rounded w-16"><Shimmer /></div>
            </div>
          </div>

          {/* Description Lines */}
          <div className="space-y-3 pt-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="relative overflow-hidden h-4 bg-white/5 rounded w-full">
                <Shimmer />
              </div>
            ))}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4 pt-6">
            <div className="relative overflow-hidden h-14 bg-white/10 rounded-full w-44"><Shimmer /></div>
            <div className="relative overflow-hidden h-14 bg-white/5 rounded-full w-14"><Shimmer /></div>
          </div>
        </div>
      </div>
    </div>
  )
}