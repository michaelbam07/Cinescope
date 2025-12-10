"use client"

import Image from "next/image"

export default function CastSection({ actors = [] }) {
  if (!actors || actors.length === 0) {
    return null
  }

  // Map of common actor names to placeholder colors/initials
  const getActorInitials = (name) => {
    if (!name) return "?"
    return name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .toUpperCase()
  }

  const getColorForActor = (name) => {
    const colors = [
      "bg-blue-500",
      "bg-purple-500",
      "bg-pink-500",
      "bg-green-500",
      "bg-amber-500",
      "bg-red-500",
      "bg-cyan-500",
      "bg-indigo-500",
    ]
    const index = name.charCodeAt(0) % colors.length
    return colors[index]
  }

  return (
    <section className="mt-12 mb-8">
      <h2 className="text-2xl md:text-3xl font-bold mb-6 text-(--color-primary)">
        Cast
      </h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {actors.map((actor, idx) => (
          <div key={`${actor}-${idx}`} className="flex flex-col items-center text-center">
            <div
              className={`${getColorForActor(
                actor
              )} w-20 h-20 rounded-full flex items-center justify-center text-white font-bold text-2xl shadow-md`}
            >
              {getActorInitials(actor)}
            </div>
            <p className="mt-2 text-sm font-medium text-(--color-foreground) line-clamp-2">
              {actor}
            </p>
          </div>
        ))}
      </div>
    </section>
  )
}
