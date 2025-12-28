'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { usePathname } from 'next/navigation'

export function PageTransition({ children }) {
  const pathname = usePathname()

  const variants = {
    initial: {
      opacity: 0,
      scale: 0.99,
      y: 10,
      filter: "blur(12px)",
      willChange: "transform, opacity, filter" // Tells the browser to use GPU
    },
    animate: {
      opacity: 1,
      scale: 1,
      y: 0,
      filter: "blur(0px)",
      transition: {
        duration: 0.6,
        ease: [0.16, 1, 0.3, 1], // Quintic easing for "heavier" feel
        staggerChildren: 0.1 // Can trigger child animations automatically
      },
    },
    exit: {
      opacity: 0,
      scale: 1.01,
      filter: "blur(12px)",
      transition: {
        duration: 0.4,
        ease: "easeInOut",
      },
    },
  }

  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        key={pathname}
        variants={variants}
        initial="initial"
        animate="animate"
        exit="exit"
        className="w-full min-h-screen origin-center"
      >
        {/* Cinematic Shutter Effect (Optional Overlay) */}
        <motion.div 
          initial={{ opacity: 1 }}
          animate={{ opacity: 0 }}
          transition={{ duration: 0.5, ease: "circOut" }}
          className="fixed inset-0 bg-background z-[9999] pointer-events-none"
        />

        {children}
      </motion.div>
    </AnimatePresence>
  )
}