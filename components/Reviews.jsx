"use client"

import { useState } from "react"
import { useMovies } from "@/app/context/MovieContext"
import { useProfile } from "@/app/context/ProfileContext" // Integration
import { Star, MessageSquare, User, Send, Quote } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

export default function Reviews({ movieId }) {
  const { addReview, getReviews, getAverageRating, getReviewCount } = useMovies()
  const { currentProfile } = useProfile() // Use the active profile data
  
  const reviews = getReviews(movieId)
  const avg = getAverageRating(movieId)
  const count = getReviewCount(movieId)

  const [rating, setRating] = useState(8)
  const [text, setText] = useState("")
  const [submitting, setSubmitting] = useState(false)
  const [hoveredStar, setHoveredStar] = useState(0)

  const submit = async (e) => {
    e.preventDefault()
    if (submitting || !text.trim()) return
    setSubmitting(true)
    
    await new Promise(res => setTimeout(res, 800))
    
    // Auto-fill name and color from ProfileContext
    addReview(movieId, { 
      name: currentProfile?.name || "Anonymous", 
      rating, 
      text,
      color: currentProfile?.color || "from-gray-500 to-gray-700",
      initial: currentProfile?.initial || "?"
    })
    
    setText("")
    setRating(8)
    setSubmitting(false)
  }

  return (
    <section className="mt-20 space-y-10">
      {/* 1. Header with Stats */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-white/5 pb-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-primary font-black tracking-[0.2em] text-[10px] uppercase">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
            </span>
            Community Feed
          </div>
          <h3 className="text-4xl font-black tracking-tighter italic uppercase">Critic <span className="text-primary">Notes</span></h3>
        </div>
        
        <div className="flex items-center gap-4 bg-white/5 px-6 py-3 rounded-2xl border border-white/5 backdrop-blur-sm">
          <div className="text-3xl font-black text-primary leading-none">
            {avg ? avg.toFixed(1) : "0.0"}
          </div>
          <div className="h-8 w-[1px] bg-white/10" />
          <div className="text-[9px] text-muted-foreground uppercase font-black tracking-widest leading-tight">
            Average Score<br />{count} Critiques
          </div>
        </div>
      </div>

      {/* 2. Review Submission Form */}
      <form onSubmit={submit} className="relative group">
        <div className="absolute -inset-1 bg-gradient-to-r from-primary/20 to-transparent rounded-3xl blur opacity-25 group-focus-within:opacity-50 transition-opacity" />
        <div className="relative glass-card bg-black/40 border border-white/10 rounded-2xl p-6 md:p-8 space-y-6">
          
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            {/* User ID display */}
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${currentProfile?.color || 'from-gray-600 to-gray-800'} flex items-center justify-center text-white font-black text-xs shadow-lg`}>
                {currentProfile?.initial || <User size={16} />}
              </div>
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-white/40">Posting as</p>
                <h4 className="text-sm font-bold text-white uppercase italic">{currentProfile?.name || "Guest Critic"}</h4>
              </div>
            </div>

            {/* Premium Star Selector */}
            <div className="space-y-2">
              <label className="text-[9px] font-black text-muted-foreground uppercase tracking-widest">Score the Experience</label>
              <div className="flex items-center gap-1.5">
                {[...Array(10)].map((_, i) => {
                  const val = i + 1;
                  return (
                    <button
                      key={i}
                      type="button"
                      onMouseEnter={() => setHoveredStar(val)}
                      onMouseLeave={() => setHoveredStar(0)}
                      onClick={() => setRating(val)}
                      className="transition-all transform hover:scale-125 active:scale-90"
                    >
                      <Star 
                        size={18} 
                        className={`${val <= (hoveredStar || rating) ? "text-primary fill-primary shadow-[0_0_10px_rgba(var(--primary),0.5)]" : "text-white/10"} transition-all`}
                      />
                    </button>
                  );
                })}
                <span className="ml-3 font-black text-2xl italic text-primary w-10">{hoveredStar || rating}</span>
              </div>
            </div>
          </div>

          <div className="relative">
            <Quote className="absolute -top-2 -left-2 text-white/5" size={40} />
            <textarea
              className="w-full p-0 bg-transparent text-white text-lg font-medium placeholder:text-white/10 outline-none min-h-[100px] resize-none border-b border-white/5 focus:border-primary/50 transition-colors py-4"
              placeholder="The visual language was striking..."
              value={text}
              onChange={(e) => setText(e.target.value)}
              required
            />
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={submitting || !text.trim()}
              className="group flex items-center gap-3 px-10 py-4 rounded-full bg-white text-black font-black uppercase italic text-xs hover:bg-primary hover:text-white transition-all disabled:opacity-20 active:scale-95"
            >
              {submitting ? "Transmitting..." : <><Send size={14} /> Submit Critique</>}
            </button>
          </div>
        </div>
      </form>

      {/* 3. The Feed */}
      <div className="space-y-10 pt-4">
        <AnimatePresence mode="popLayout">
          {reviews.length === 0 ? (
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }}
              className="text-center py-20 border-2 border-dashed border-white/5 rounded-3xl"
            >
              <MessageSquare className="mx-auto text-white/5 mb-4" size={48} />
              <p className="text-white/20 font-black uppercase tracking-[0.3em] text-[10px]">Silence in the theater. Be the first to speak.</p>
            </motion.div>
          ) : (
            reviews.map((r, index) => (
              <motion.div 
                key={r.id || index} 
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="flex gap-6 group"
              >
                <div className="flex flex-col items-center gap-2">
                  <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${r.color} flex items-center justify-center text-white text-sm font-black shadow-2xl rotate-3 group-hover:rotate-0 transition-transform`}>
                    {r.initial}
                  </div>
                  <div className="flex-1 w-[1px] bg-gradient-to-b from-white/10 to-transparent" />
                </div>

                <div className="flex-1 space-y-3 pb-10">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-black uppercase tracking-widest italic">{r.name}</h4>
                      <div className="flex items-center gap-2">
                         <span className="text-[8px] bg-primary/10 text-primary px-2 py-0.5 rounded font-black uppercase tracking-tighter">Verified</span>
                         <span className="text-[8px] text-white/20 font-bold uppercase tracking-widest">2m ago</span>
                      </div>
                    </div>
                    <div className="text-2xl font-black italic opacity-20 group-hover:opacity-100 group-hover:text-primary transition-all">
                      {r.rating}<span className="text-xs opacity-50">/10</span>
                    </div>
                  </div>
                  <p className="text-gray-400 text-sm leading-relaxed font-medium">
                    "{r.text}"
                  </p>
                </div>
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>
    </section>
  )
}