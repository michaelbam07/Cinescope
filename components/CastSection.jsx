"use client"

import { User } from "lucide-react"
import { motion } from "framer-motion"

export default function CastSection({ actors = [] }) {
  if (!actors || actors.length === 0) return null

  return (
    <section className="mt-16 mb-12 animate-fadeIn">
      {/* Header with Cinematic Label */}
      <div className="flex items-center gap-3 mb-8">
        <div className="h-6 w-1 bg-primary rounded-full" />
        <h2 className="text-2xl font-black tracking-tighter uppercase italic">
          Starring Role
        </h2>
      </div>

      <div className="flex flex-wrap gap-6 justify-start">
        {actors.map((actor, idx) => (
          <motion.div 
            key={`${actor}-${idx}`}
            whileHover={{ y: -5 }}
            className="flex flex-col items-center group w-24"
          >
            {/* Avatar Container */}
            <div className="relative w-20 h-20 mb-3">
              {/* Decorative Outer Ring */}
              <div className="absolute inset-0 rounded-full border border-white/5 group-hover:border-primary/50 transition-colors duration-500" />
              
              {/* Inner Circle Placeholder */}
              <div className="absolute inset-1 rounded-full bg-gradient-to-br from-white/10 to-white/5 flex items-center justify-center overflow-hidden shadow-inner">
                <User 
                  className="text-white/20 group-hover:text-primary/40 transition-colors duration-500" 
                  size={32} 
                />
                
                {/* Subtle initials overlay */}
                <span className="absolute inset-0 flex items-center justify-center text-[10px] font-black tracking-widest text-white/10 uppercase group-hover:text-white/40 transition-colors">
                   {actor.split(" ").map(n => n[0]).join("")}
                </span>
              </div>
            </div>

            {/* Actor Name */}
            <p className="text-[11px] font-bold text-muted-foreground group-hover:text-foreground text-center uppercase tracking-wider transition-colors duration-300 leading-tight">
              {actor}
            </p>
          </motion.div>
        ))}
      </div>
    </section>
  )
}