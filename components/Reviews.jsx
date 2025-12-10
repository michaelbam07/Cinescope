"use client"

import { useState } from "react"
import { useMovies } from "@/app/context/MovieContext"

export default function Reviews({ movieId }) {
  const { addReview, getReviews, getAverageRating, getReviewCount } = useMovies()
  const reviews = getReviews(movieId)
  const avg = getAverageRating(movieId)
  const count = getReviewCount(movieId)

  const [name, setName] = useState("")
  const [rating, setRating] = useState(8)
  const [text, setText] = useState("")
  const [submitting, setSubmitting] = useState(false)

  const submit = (e) => {
    e.preventDefault()
    if (submitting) return
    setSubmitting(true)
    addReview(movieId, { name: name || "Anonymous", rating, text })
    setName("")
    setRating(8)
    setText("")
    setSubmitting(false)
  }

  return (
    <section className="mt-8 bg-(--color-card) border-(--color-border) rounded-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold text-(--color-foreground)">Reviews</h3>
          <p className="text-sm text-(--color-muted-foreground)">{count} review{count !== 1 ? "s" : ""}{avg ? ` • ${avg}/10 avg` : ""}</p>
        </div>
      </div>

      <form onSubmit={submit} className="grid gap-2 md:grid-cols-4 md:gap-4 mb-6">
        <input
          className="col-span-2 p-2 rounded-md bg-transparent border border-(--color-border)"
          placeholder="Your name (optional)"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <select
          className="p-2 rounded-md bg-transparent border border-(--color-border) w-24"
          value={rating}
          onChange={(e) => setRating(Number(e.target.value))}
        >
          {[...Array(10)].map((_, i) => (
            <option key={i} value={i + 1}>{i + 1}</option>
          ))}
        </select>

        <div className="col-span-4">
          <textarea
            className="w-full p-2 rounded-md bg-transparent border border-(--color-border) min-h-20"
            placeholder="Write a short review"
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
        </div>

        <div className="col-span-4 flex justify-end">
          <button
            type="submit"
            className="px-4 py-2 rounded-md bg-(--color-primary) text-(--color-primary-foreground)"
            disabled={submitting}
          >
            {submitting ? "Submitting..." : "Submit Review"}
          </button>
        </div>
      </form>

      <div className="space-y-4">
        {reviews.length === 0 && (
          <p className="text-(--color-muted-foreground)">No reviews yet — be the first to review this movie.</p>
        )}

        {reviews.map((r) => (
          <div key={r.id} className="border-t border-(--color-border) pt-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-(--color-foreground)">{r.name}</p>
                <p className="text-xs text-(--color-muted-foreground)">{new Date(r.date).toLocaleString()}</p>
              </div>
              <div className="text-sm font-semibold text-(--color-primary)">{r.rating}/10</div>
            </div>
            {r.text && <p className="mt-2 text-(--color-muted-foreground)">{r.text}</p>}
          </div>
        ))}
      </div>
    </section>
  )
}
