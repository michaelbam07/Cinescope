"use client"

import Link from "next/link"
import { Film, Home, ArrowLeft } from "lucide-react"

export default function NotFound() {
  return (
    <div className="min-h-[80vh] flex items-center justify-center p-6 animate-fadeIn">
      <div className="relative max-w-md w-full text-center space-y-8">
        
        {/* Visual Metaphor: A glowing "Empty Reel" or Icon */}
        <div className="relative mx-auto w-24 h-24 flex items-center justify-center">
          <div className="absolute inset-0 bg-primary/20 blur-3xl rounded-full" />
          <Film className="w-16 h-16 text-primary animate-pulse" />
        </div>

        <div className="space-y-3">
          <h1 className="text-5xl font-black tracking-tighter italic">SCENE MISSING</h1>
          <p className="text-muted-foreground text-lg">
            We searched the whole script, but this page didn't make the final cut.
          </p>
        </div>

        {/* Action Buttons with the new Glassmorphism style */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Link 
            href="/" 
            className="w-full sm:w-auto px-8 py-3 rounded-full bg-primary text-primary-foreground font-bold flex items-center justify-center gap-2 hover:scale-105 transition-transform shadow-[0_0_20px_rgba(var(--primary),0.3)]"
          >
            <Home size={18} /> Return Home
          </Link>
          
          <Link 
            href="/movies" 
            className="w-full sm:w-auto px-8 py-3 rounded-full glass-card hover:bg-white/10 transition-colors flex items-center justify-center gap-2 font-semibold"
          >
            <ArrowLeft size={18} /> Back to Movies
          </Link>
        </div>

        {/* Decorative "Film Strip" element */}
        <div className="pt-12 flex justify-center gap-2 opacity-20">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="w-8 h-10 border-2 border-dashed border-muted-foreground rounded" />
          ))}
        </div>
      </div>
    </div>
  )
}