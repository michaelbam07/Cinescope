"use client"

import { useMovies } from "@/app/context/MovieContext"
import { movies, series } from "@/data/movie"
import { useState, useEffect } from "react"

export default function Filters() {
  const { setActiveCategory, setActiveActor } = useMovies()
  const allItems = [...movies, ...series]

  const uniqueCategories = ["all", ...new Set(allItems.map((m) => m.category))]

  const [selectedCategory, setSelectedCategory] = useState("all")
  const [actors, setActors] = useState(["all"])

  // Update actors based on selected category
  useEffect(() => {
    const filteredItems =
      selectedCategory === "all"
        ? allItems
        : allItems.filter((item) => item.category === selectedCategory)

    const uniqueActors = ["all", ...new Set(filteredItems.flatMap((item) => item.actors || []))]
    setActors(uniqueActors)
    setActiveActor("all") // reset actor filter whenever category changes
  }, [selectedCategory])

  const handleCategoryChange = (e) => {
    const category = e.target.value
    setSelectedCategory(category)
    setActiveCategory(category)
  }

  const handleActorChange = (e) => {
    setActiveActor(e.target.value)
  }

  return (
    <div className="flex gap-6 mb-6">
      {/* Category Filter */}
      <select
        onChange={handleCategoryChange}
        value={selectedCategory}
        className="p-2 bg-gray-800 text-white rounded"
      >
        {uniqueCategories.map((cat) => (
          <option key={cat} value={cat}>
            {cat}
          </option>
        ))}
      </select>

      {/* Actor Filter */}
      <select
        onChange={handleActorChange}
        className="p-2 bg-gray-800 text-white rounded"
      >
        {actors.map((actor) => (
          <option key={actor} value={actor}>
            {actor}
          </option>
        ))}
      </select>
    </div>
  )
}
