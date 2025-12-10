'use client'

import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'

export function PageTransition({ children }) {
  const pathname = usePathname()
  const [displayPathname, setDisplayPathname] = useState(pathname)
  const [transitionType, setTransitionType] = useState('fade')
  const [isTransitioning, setIsTransitioning] = useState(false)

  useEffect(() => {
    if (pathname !== displayPathname) {
      setIsTransitioning(true)
      
      // Randomize transition type: fade or slide
      const types = ['fade', 'slide']
      setTransitionType(types[Math.floor(Math.random() * types.length)])

      const timer = setTimeout(() => {
        setDisplayPathname(pathname)
        setIsTransitioning(false)
      }, 300)

      return () => clearTimeout(timer)
    }
  }, [pathname])

  return (
    <div
      key={displayPathname}
      className={`${
        isTransitioning
          ? transitionType === 'fade'
            ? 'animate-page-fade-out'
            : 'animate-slide-out-right'
          : transitionType === 'fade'
          ? 'animate-page-fade-in'
          : 'animate-slide-in-left'
      }`}
    >
      {children}
    </div>
  )
}
