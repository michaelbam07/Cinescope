'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { usePathname } from 'next/navigation'

export function PageTransition({ children }) {
  const pathname = usePathname()

  const variants = {
    initial: {
      opacity: 0,
      scale: 0.98,
      filter: "blur(10px)",
    },
    animate: {
      opacity: 1,
      scale: 1,
      filter: "blur(0px)",
      transition: {
        duration: 0.4,
        ease: [0.22, 1, 0.36, 1], // Custom cinematic cubic-bezier
      },
    },
    exit: {
      opacity: 0,
      scale: 1.02,
      filter: "blur(10px)",
      transition: {
        duration: 0.3,
        ease: [0.22, 1, 0.36, 1],
      },
    },
  }

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={pathname}
        variants={variants}
        initial="initial"
        animate="animate"
        exit="exit"
        className="w-full origin-top"
      >
        {children}
      </motion.div>
    </AnimatePresence>
  )
}