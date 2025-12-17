"use client"

import { useState } from "react"
import { Search, X } from "lucide-react" // Modern icons

export default function SearchBar({ onSearch }) {
  const [query, setQuery] = useState("")

  const handleChange = (e) => {
    const val = e.target.value
    setQuery(val)
    onSearch(val)
  }

  const clearSearch = () => {
    setQuery("")
    onSearch("")
  }

  return (
    <div className="relative w-full max-w-2xl mx-auto mb-10 group">
      {/* Search Icon */}
      <div className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors">
        <Search size={20} />
      </div>

      <input
        type="text"
        placeholder="Search movies, actors, or genres..."
        value={query}
        onChange={handleChange}
        className="w-full pl-12 pr-12 py-4 bg-card/40 backdrop-blur-md border border-white/10 rounded-2xl 
                   text-foreground placeholder:text-muted-foreground outline-none transition-all
                   focus:ring-2 focus:ring-primary/40 focus:border-primary/50 focus:bg-card/60
                   hover:bg-card/50 shadow-lg"
      />

      {/* Clear Button (Visible only when there is a query) */}
      {query && (
        <button
          onClick={clearSearch}
          className="absolute right-4 top-1/2 -translate-y-1/2 p-1 rounded-full hover:bg-white/10 text-muted-foreground hover:text-foreground transition-all"
        >
          <X size={18} />
        </button>
      )}

      {/* Subtle bottom glow effect */}
      <div className="absolute -bottom-px left-1/2 -translate-x-1/2 w-1/2 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent opacity-0 group-focus-within:opacity-100 transition-opacity" />
    </div>
  )
}