'use client'

import { useEffect, useState } from 'react'
import { IoArrowUp } from 'react-icons/io5'

export function BackToTopButton() {
  const [isVisible, setIsVisible] = useState(false)

  // Show button when page is scrolled down
  useEffect(() => {
    const toggleVisibility = () => {
      // Show button when page is scrolled down 300px
      if (window.scrollY > 300) {
        setIsVisible(true)
      } else {
        setIsVisible(false)
      }
    }

    window.addEventListener('scroll', toggleVisibility)
    return () => window.removeEventListener('scroll', toggleVisibility)
  }, [])

  // Smooth scroll to top
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    })
  }

  return (
    <>
      {isVisible && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-8 right-8 z-40 bg-(--color-primary) text-(--color-primary-foreground) 
          p-3 rounded-full shadow-lg hover:shadow-xl hover:scale-110 transition-all duration-300 
          hover:bg-(--color-primary-foreground) hover:text-(--color-primary) animate-fadeIn"
          aria-label="Back to top"
          title="Back to top"
        >
          <IoArrowUp className="w-6 h-6" />
        </button>
      )}
    </>
  )
}
