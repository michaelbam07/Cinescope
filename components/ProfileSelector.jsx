"use client"

import { useProfile } from "@/app/context/ProfileContext"

const COLORS = [
  "bg-red-500",
  "bg-blue-500",
  "bg-green-500",
  "bg-yellow-500",
  "bg-purple-500",
  "bg-pink-500",
  "bg-cyan-500",
  "bg-orange-500",
]

export default function ProfileSelector() {
  const {
    profiles,
    currentProfileId,
    switchProfile,
    addProfile,
    deleteProfile,
    showProfileSelector,
    setShowProfileSelector,
  } = useProfile()

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
      <div className="bg-(--color-card) rounded-2xl p-8 max-w-2xl w-full">
        <h1 className="text-4xl font-bold text-(--color-foreground) mb-8 text-center">
          Who's watching?
        </h1>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 mb-8">
          {profiles.map((profile) => (
            <div
              key={profile.id}
              className="text-center cursor-pointer group"
              onClick={() => switchProfile(profile.id)}
            >
              <div className="relative mb-3 inline-block">
                <div
                  className={`${profile.color} w-24 h-24 rounded-lg flex items-center justify-center text-white text-4xl font-bold shadow-lg group-hover:ring-4 ring-white transition-all duration-300 group-hover:scale-110`}
                >
                  {profile.initial}
                </div>
                {currentProfileId === profile.id && (
                  <div className="absolute inset-0 rounded-lg ring-4 ring-white" />
                )}
              </div>
              <p className="text-(--color-foreground) font-medium text-sm">
                {profile.name}
              </p>
              {profiles.length > 1 && (
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    deleteProfile(profile.id)
                  }}
                  className="text-xs text-(--color-muted-foreground) hover:text-(--color-destructive) opacity-0 group-hover:opacity-100 transition-opacity mt-1"
                >
                  Delete
                </button>
              )}
            </div>
          ))}

          {profiles.length < 4 && (
            <div
              className="text-center cursor-pointer group"
              onClick={() => {
                const newName = prompt("Profile name:")
                if (newName && newName.trim()) {
                  const randomColor = COLORS[Math.floor(Math.random() * COLORS.length)]
                  addProfile(newName.trim(), randomColor)
                }
              }}
            >
              <div className="bg-(--color-muted) w-24 h-24 rounded-lg flex items-center justify-center text-white text-4xl font-bold shadow-lg group-hover:ring-4 ring-white transition-all duration-300 group-hover:scale-110 group-hover:bg-(--color-muted-foreground)">
                +
              </div>
              <p className="text-(--color-foreground) font-medium text-sm mt-3">
                Add Profile
              </p>
            </div>
          )}
        </div>

        <button
          onClick={() => setShowProfileSelector(false)}
          className="w-full py-3 rounded-lg bg-(--color-muted) hover:bg-(--color-muted-foreground) text-(--color-foreground) font-medium transition-colors"
        >
          Close
        </button>
      </div>
    </div>
  )
}
