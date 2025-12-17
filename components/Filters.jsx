"use client"

import { useMovies } from "@/app/context/MovieContext"
import { movies, series } from "@/data/movie"
import { useState, useEffect, useRef } from "react"
import { Filter, User } from "lucide-react" // Icons for visual cues

export default function Filters() {
  const { setActiveCategory, setActiveActor } = useMovies()
  const allItems = [...movies, ...series]

  const uniqueCategories = ["all", ...new Set(allItems.map((m) => m.category))]
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [actors, setActors] = useState(["all"])
  const [selectedActor, setSelectedActor] = useState("all")

  useEffect(() => {
    const filteredItems =
      selectedCategory === "all"
        ? allItems
        : allItems.filter((item) => item.category === selectedCategory)

    const uniqueActors = ["all", ...new Set(filteredItems.flatMap((item) => item.actors || []))]
    setActors(uniqueActors)
    setActiveActor("all")
    setSelectedActor("all")
  }, [selectedCategory])

  const handleCategoryClick = (category) => {
    setSelectedCategory(category)
    setActiveCategory(category)
  }

  const handleActorClick = (actor) => {
    setSelectedActor(actor)
    setActiveActor(actor)
  }

  return (
    <div className="space-y-6 mb-10 animate-fadeIn">
      {/* Category Pills */}
      <div className="space-y-3">
        <div className="flex items-center gap-2 text-muted-foreground text-xs uppercase tracking-widest font-bold ml-1">
          <Filter size={14} /> <span>Genres</span>
        </div>
        <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
          {uniqueCategories.map((cat) => (
            <button
              key={cat}
              onClick={() => handleCategoryClick(cat)}
              className={`px-5 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all duration-300 border ${
                selectedCategory === cat
                  ? "bg-primary text-primary-foreground border-primary shadow-[0_0_15px_rgba(var(--primary),0.3)] scale-105"
                  : "bg-card/40 text-foreground/70 border-white/5 hover:border-white/20 hover:bg-card/60"
              }`}
            >
              {cat.charAt(0).toUpperCase() + cat.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Actor Pills - Only show if there are actors besides 'all' */}
      {actors.length > 1 && (
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-muted-foreground text-xs uppercase tracking-widest font-bold ml-1">
            <User size={14} /> <span>Featured Talent</span>
          </div>
          <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
            {actors.map((actor) => (
              <button
                key={actor}
                onClick={() => handleActorClick(actor)}
                className={`px-4 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all duration-200 border ${
                  selectedActor === actor
                    ? "bg-white text-black border-white"
                    : "bg-transparent text-muted-foreground border-white/10 hover:border-white/30"
                }`}
              >
                {actor}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}