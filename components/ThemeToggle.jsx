"use client"

import { useTheme } from "@/app/context/ThemeContext"

export const ThemeToggle = () => {
  const { isDark, toggleTheme } = useTheme()

  return (
    <button
      onClick={toggleTheme}
      className="p-2 rounded-md bg-(--color-muted) hover:bg-(--color-muted-foreground) text-(--color-foreground) transition-colors"
      aria-label="Toggle theme"
      title={isDark ? "Switch to light mode" : "Switch to dark mode"}
    >
      {isDark ? "☀️" : "🌙"}
    </button>
  )
}
