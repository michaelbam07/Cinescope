"use client"

import { useState } from "react"
import { useMovies } from "@/app/context/MovieContext"
import { Star, MessageSquare, User, Send } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

export default function Reviews({ movieId }) {
  const { addReview, getReviews, getAverageRating, getReviewCount } = useMovies()
  const reviews = getReviews(movieId)
  const avg = getAverageRating(movieId)
  const count = getReviewCount(movieId)

  const [name, setName] = useState("")
  const [rating, setRating] = useState(8)
  const [text, setText] = useState("")
  const [submitting, setSubmitting] = useState(false)
  const [hoveredStar, setHoveredStar] = useState(0)

  const submit = async (e) => {
    e.preventDefault()
    if (submitting || !text.trim()) return
    setSubmitting(true)
    
    // Simulate a small delay for a high-end feel
    await new Promise(res => setTimeout(res, 600))
    
    addReview(movieId, { name: name || "Anonymous User", rating, text })
    setName("")
    setRating(8)
    setText("")
    setSubmitting(false)
  }

  return (
    <section className="mt-12 space-y-8 animate-fadeIn">
      {/* Header Info */}
      <div className="flex items-end justify-between border-b border-white/10 pb-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-primary font-bold tracking-widest text-xs uppercase">
            <MessageSquare size={14} /> Community Feed
          </div>
          <h3 className="text-3xl font-black tracking-tighter">REVIEWS</h3>
        </div>
        <div className="text-right">
          <div className="text-2xl font-black text-primary">{avg ? avg.toFixed(1) : "0.0"}</div>
          <div className="text-[10px] text-muted-foreground uppercase font-bold tracking-tighter">
            Average Score / {count} Reviews
          </div>
        </div>
      </div>

      {/* Modern Review Form */}
      <form onSubmit={submit} className="glass-card bg-white/5 rounded-2xl p-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-xs font-bold text-muted-foreground uppercase ml-1">Your Name</label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
              <input
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-background/50 border border-white/10 focus:border-primary/50 outline-none transition-all"
                placeholder="Anonymous"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-muted-foreground uppercase ml-1">Rating</label>
            <div className="flex items-center gap-1 h-10">
              {[...Array(10)].map((_, i) => {
                const starValue = i + 1;
                return (
                  <button
                    key={i}
                    type="button"
                    onMouseEnter={() => setHoveredStar(starValue)}
                    onMouseLeave={() => setHoveredStar(0)}
                    onClick={() => setRating(starValue)}
                    className="transition-transform active:scale-90"
                  >
                    <Star 
                      size={18} 
                      className={`${
                        starValue <= (hoveredStar || rating) 
                          ? "text-yellow-400 fill-yellow-400" 
                          : "text-white/20"
                      } transition-colors`}
                    />
                  </button>
                );
              })}
              <span className="ml-2 font-black text-lg w-8">{hoveredStar || rating}</span>
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-xs font-bold text-muted-foreground uppercase ml-1">Review</label>
          <textarea
            className="w-full p-4 rounded-xl bg-background/50 border border-white/10 focus:border-primary/50 outline-none transition-all min-h-24 resize-none"
            placeholder="What did you think of the cinematography, the acting, the plot?"
            value={text}
            onChange={(e) => setText(e.target.value)}
            required
          />
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={submitting || !text.trim()}
            className="flex items-center gap-2 px-8 py-3 rounded-full bg-primary text-primary-foreground font-bold hover:scale-105 disabled:opacity-50 disabled:scale-100 transition-all shadow-[0_0_20px_rgba(var(--primary),0.2)]"
          >
            {submitting ? "Publishing..." : <><Send size={16} /> Post Review</>}
          </button>
        </div>
      </form>

      {/* Review List */}
      <div className="space-y-6">
        <AnimatePresence>
          {reviews.length === 0 ? (
            <p className="text-center py-10 text-muted-foreground italic">No one has spoken yet. Be the first to critique.</p>
          ) : (
            reviews.map((r, index) => (
              <motion.div 
                key={r.id || index} 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="group relative pl-6 border-l-2 border-white/5 hover:border-primary/50 transition-colors py-2"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary text-xs font-bold">
                      {r.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <h4 className="text-sm font-bold">{r.name}</h4>
                      <p className="text-[10px] uppercase tracking-tighter text-muted-foreground">Verified Critic</p>
                    </div>
                  </div>
                  <div className="bg-white/5 px-3 py-1 rounded-full border border-white/10 font-black text-xs">
                    {r.rating}/10
                  </div>
                </div>
                <p className="mt-3 text-muted-foreground text-sm leading-relaxed max-w-2xl">
                  {r.text}
                </p>
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>
    </section>
  )
}