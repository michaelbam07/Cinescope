"use client"

import { User } from "lucide-react"
import { motion } from "framer-motion"

export default function CastSection({ actors = [] }) {
  if (!actors || actors.length === 0) return null

  return (
    <section className="mt-16 mb-12">
      {/* Header with Cinematic Label */}
      <motion.div 
        initial={{ opacity: 0, x: -10 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        className="flex items-center gap-3 mb-8 px-1"
      >
        <div className="h-5 w-1 bg-primary rounded-full shadow-[0_0_10px_rgba(var(--primary),0.5)]" />
        <h2 className="text-xl md:text-2xl font-black tracking-tighter uppercase italic leading-none">
          Starring <span className="text-primary">Roles</span>
        </h2>
      </motion.div>

      {/* Horizontal Scroll Container for better UX */}
      <div className="flex overflow-x-auto pb-6 gap-6 no-scrollbar snap-x scroll-smooth">
        {actors.map((actor, idx) => {
          const initials = actor
            .split(" ")
            .map((n) => n[0])
            .join("")
            .slice(0, 2);

          return (
            <motion.div 
              key={`${actor}-${idx}`}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.05 }}
              whileHover={{ y: -5 }}
              className="flex flex-col items-center group min-w-[100px] snap-start"
            >
              {/* Avatar Container */}
              <div className="relative w-20 h-20 mb-4">
                {/* Dynamic Border Ring */}
                <div className="absolute inset-0 rounded-full border-2 border-white/5 group-hover:border-primary transition-all duration-500 group-hover:scale-110" />
                
                {/* Inner Circle */}
                <div className="absolute inset-1.5 rounded-full bg-gradient-to-b from-white/10 to-transparent flex items-center justify-center overflow-hidden backdrop-blur-sm">
                  {/* Show Initials as primary if no image, but keep User icon very subtle in background */}
                  <User 
                    className="absolute text-white/5 group-hover:scale-110 transition-transform duration-700" 
                    size={40} 
                    strokeWidth={1}
                  />
                  
                  <span className="relative z-10 text-sm font-black tracking-widest text-white/40 group-hover:text-white transition-colors">
                    {initials}
                  </span>
                </div>
              </div>

              {/* Actor Name */}
              <div className="px-2">
                <p className="text-[10px] font-black text-muted-foreground group-hover:text-primary text-center uppercase tracking-[0.2em] transition-colors duration-300 leading-tight">
                  {actor.split(" ")[0]}
                </p>
                <p className="text-[12px] font-bold text-white/80 group-hover:text-white text-center uppercase tracking-tighter italic transition-colors duration-300 leading-tight">
                  {actor.split(" ").slice(1).join(" ")}
                </p>
              </div>
            </motion.div>
          );
        })}
      </div>
    </section>
  )
}