'use client'

import { useEffect, useState } from 'react'
import { IoArrowUp } from 'react-icons/io5'
import { motion, AnimatePresence } from 'framer-motion'

export function BackToTopButton() {
  const [isVisible, setIsVisible] = useState(false)
  const [scrollProgress, setScrollProgress] = useState(0)

  useEffect(() => {
    const handleScroll = () => {
      // Show button after 300px
      setIsVisible(window.scrollY > 300)

      // Calculate scroll percentage
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight
      const progress = (window.scrollY / totalHeight) * 100
      setScrollProgress(progress)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

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
          className="fixed bottom-8 right-8 z-40 group p-3 flex items-center justify-center"
          aria-label="Back to top"
        >
          {/* Glass Background */}
          <div className="absolute inset-0 bg-background/80 backdrop-blur-md border border-white/10 rounded-full shadow-2xl transition-colors group-hover:bg-primary/10" />

          {/* Progress Ring */}
          <svg className="absolute w-full h-full -rotate-90" viewBox="0 0 100 100">
            <circle
              cx="50"
              cy="50"
              r="45"
              fill="none"
              stroke="currentColor"
              strokeWidth="4"
              className="text-white/10"
            />
            <motion.circle
              cx="50"
              cy="50"
              r="45"
              fill="none"
              stroke="currentColor"
              strokeWidth="4"
              strokeDasharray="283"
              animate={{ strokeDashoffset: 283 - (283 * scrollProgress) / 100 }}
              transition={{ type: 'spring', stiffness: 50, damping: 20 }}
              className="text-primary"
            />
          </svg>

          {/* Icon */}
          <IoArrowUp className="w-6 h-6 relative z-10 text-foreground group-hover:text-primary transition-colors" />
        </motion.button>
      )}
    </AnimatePresence>
  )
}