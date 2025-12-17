'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { HiMenu, HiX } from 'react-icons/hi'
import { ThemeToggle } from '@/components/ThemeToggle'
import ProfileButton from '@/components/ProfileButton'

const Header = () => {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)

  // Dynamic background on scroll
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'Movies', href: '/movies' },
    { name: 'Series', href: '/series' },
    { name: 'Watchlist', href: '/watchlist' },
    { name: 'Favourites', href: '/favourites' },
  ]

  return (
    <header 
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        isScrolled 
          ? 'bg-background/70 backdrop-blur-md border-b border-white/10 py-3' 
          : 'bg-transparent py-5'
      }`}
    >
      <div className="container mx-auto px-6 flex justify-between items-center">
        
        {/* Logo with a tighter, more modern font weight */}
        <Link href="/" className="text-2xl font-black tracking-tighter hover:opacity-80 transition-opacity">
          CINE<span className="text-primary">SCOPE</span>
        </Link>

        {/* Desktop Navbar */}
        <nav className="hidden md:block">
          <ul className="flex items-center space-x-8">
            {navLinks.map((link) => (
              <li key={link.name}>
                <Link 
                  href={link.href} 
                  className="text-sm font-medium text-foreground/80 hover:text-primary transition-colors duration-200 relative group"
                >
                  {link.name}
                  {/* Underline animated effect */}
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full" />
                </Link>
              </li>
            ))}
            <li className="flex items-center gap-4 pl-4 border-l border-white/10">
              <ThemeToggle />
              <ProfileButton />
            </li>
          </ul>
        </nav>

        {/* Mobile Controls */}
        <div className="md:hidden flex items-center gap-4">
          <ThemeToggle />
          <button 
            onClick={() => setMobileOpen(!mobileOpen)} 
            className="p-2 rounded-lg bg-white/5 border border-white/10"
            aria-label="Toggle menu"
          >
            {mobileOpen ? <HiX className="w-6 h-6" /> : <HiMenu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu - Full Screen Overlay Style */}
      {mobileOpen && (
        <nav className="md:hidden fixed inset-0 top-[60px] bg-background/95 backdrop-blur-xl z-40 animate-fadeIn">
          <ul className="flex flex-col items-center justify-center space-y-8 h-full pb-20">
            {navLinks.map((link) => (
              <li key={link.name}>
                <Link 
                  href={link.href} 
                  onClick={() => setMobileOpen(false)}
                  className="text-2xl font-bold hover:text-primary transition-colors"
                >
                  {link.name}
                </Link>
              </li>
            ))}
            <li className="pt-4">
              <ProfileButton />
            </li>
          </ul>
        </nav>
      )}
    </header>
  )
}

export default Header