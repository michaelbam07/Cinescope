'use client'

import { useState } from 'react'
import { IoArrowUp } from 'react-icons/io5'
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from 'framer-motion'

export function BackToTopButton() {
  const [isVisible, setIsVisible] = useState(false)
  const { scrollYProgress } = useScroll()
  
  // Use Framer Motion's optimized event listener instead of window.addEventListener
  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    // Show button after scrolling 10% of the page
    setIsVisible(latest > 0.1)
  })

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.button
          initial={{ opacity: 0, scale: 0.5, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.5, y: 20 }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={scrollToTop}
          className="fixed bottom-8 right-8 z-50 group w-14 h-14 flex items-center justify-center focus:outline-none"
          aria-label="Back to top"
        >
          {/* Glass Background - Refined to match your "Catalog" glass-card style */}
          <div className="absolute inset-0 bg-background/40 backdrop-blur-xl border border-white/10 rounded-full shadow-[0_0_30px_rgba(0,0,0,0.5)] transition-all duration-300 group-hover:border-primary/50 group-hover:bg-primary/5" />

          {/* Progress Ring SVG */}
          <svg className="absolute w-full h-full -rotate-90 p-1" viewBox="0 0 100 100">
            {/* Background Track */}
            <circle
              cx="50"
              cy="50"
              r="46"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className="text-white/5"
            />
            {/* Progress Path */}
            <motion.circle
              cx="50"
              cy="50"
              r="46"
              fill="none"
              stroke="currentColor"
              strokeWidth="3"
              strokeDasharray="1" // Using pathLength for simpler math
              style={{ pathLength: scrollYProgress }}
              transition={{ type: 'spring', stiffness: 60, damping: 15 }}
              className="text-primary"
              strokeLinecap="round"
            />
          </svg>

          {/* Icon - Floating effect */}
          <motion.div
            animate={{ y: [0, -2, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="relative z-10"
          >
            <IoArrowUp className="w-6 h-6 text-foreground group-hover:text-primary transition-colors" />
          </motion.div>
        </motion.button>
      )}
    </AnimatePresence>
  )
}