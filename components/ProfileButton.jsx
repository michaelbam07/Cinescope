"use client"

import { useProfile } from "@/app/context/ProfileContext"

export default function ProfileButton() {
  const { currentProfile, setShowProfileSelector } = useProfile()

  return (
    <button
      onClick={() => setShowProfileSelector(true)}
      className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-(--color-muted) transition-colors"
      aria-label="Switch profile"
    >
      <div
        className={`${currentProfile.color} w-8 h-8 rounded flex items-center justify-center text-white text-sm font-bold`}
      >
        {currentProfile.initial}
      </div>
      <span className="text-(--color-foreground) text-sm font-medium hidden sm:inline">
        {currentProfile.name}
      </span>
    </button>
  )
}
