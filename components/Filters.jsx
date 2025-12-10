"use client"

import { useMovies } from "@/app/context/MovieContext"
import { movies } from "@/data/movie"

export default function Filters() {
  const { setActiveCategory, setActiveActor } = useMovies()

  const uniqueCategories = ["all", ...new Set(movies.map(m => m.category))]
  const uniqueActors = ["all", ...new Set(movies.flatMap(m => m.actors))]

  return (
    <div className="flex gap-6 mb-6">
      {/* Category Filter */}
      <select
        onChange={(e) => setActiveCategory(e.target.value)}
        className="p-2 bg-gray-800 text-white rounded">
        {uniqueCategories.map((cat) => (
          <option key={cat} value={cat}>{cat}</option>
        ))}
      </select>

      {/* Actor Filter */}
      <select
        onChange={(e) => setActiveActor(e.target.value)}
        className="p-2 bg-gray-800 text-white rounded">
        {uniqueActors.map((actor) => (
          <option key={actor} value={actor}>{actor}</option>
        ))}
      </select>
    </div>
  )
}
