'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { usePathname } from 'next/navigation'
import { HiMenu, HiX } from 'react-icons/hi'
import { motion, AnimatePresence } from 'framer-motion'
import { ThemeToggle } from '@/components/ThemeToggle'
import ProfileButton from '@/components/ProfileButton'

const Header = () => {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const pathname = usePathname()

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
      className={`fixed top-0 w-full z-50 transition-all duration-500 ${
        isScrolled 
          ? 'bg-background/60 backdrop-blur-xl border-b border-white/5 py-3' 
          : 'bg-transparent py-6'
      }`}
    >
      <div className="container mx-auto px-6 flex justify-between items-center">
        
        {/* Logo - Bold, Italic, Brutalist */}
        <Link href="/" className="group flex items-center gap-2">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center rotate-3 group-hover:rotate-0 transition-transform">
             <span className="text-white font-black italic text-xs">C</span>
          </div>
          <span className="text-2xl font-black tracking-tighter uppercase italic leading-none">
            CINE<span className="text-primary group-hover:text-foreground transition-colors">SCOPE</span>
          </span>
        </Link>

        {/* Desktop Navbar */}
        <nav className="hidden md:block">
          <ul className="flex items-center space-x-10">
            {navLinks.map((link) => {
              const isActive = pathname === link.href
              return (
                <li key={link.name}>
                  <Link 
                    href={link.href} 
                    className={`text-[11px] font-black uppercase tracking-[0.2em] transition-all duration-300 relative group ${
                      isActive ? 'text-primary' : 'text-foreground/60 hover:text-foreground'
                    }`}
                  >
                    {link.name}
                    {/* Active/Hover Indicator */}
                    <span className={`absolute -bottom-2 left-0 h-[2px] bg-primary transition-all duration-300 ${
                      isActive ? 'w-full' : 'w-0 group-hover:w-full'
                    }`} />
                  </Link>
                </li>
              )
            })}
            
            <li className="flex items-center gap-6 pl-8 border-l border-white/10">
              <ThemeToggle />
              <ProfileButton />
            </li>
          </ul>
        </nav>

        {/* Mobile Toggle */}
        <div className="md:hidden flex items-center gap-4">
          <ThemeToggle />
          <button 
            onClick={() => setMobileOpen(!mobileOpen)} 
            className="text-foreground p-1"
            aria-label="Toggle menu"
          >
            {mobileOpen ? <HiX size={28} /> : <HiMenu size={28} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.nav 
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="md:hidden fixed inset-0 top-0 bg-background/98 backdrop-blur-2xl z-[-1] flex flex-col items-center justify-center"
          >
            <ul className="space-y-10 text-center">
              {navLinks.map((link, idx) => (
                <motion.li 
                  key={link.name}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                >
                  <Link 
                    href={link.href} 
                    onClick={() => setMobileOpen(false)}
                    className={`text-4xl font-black uppercase italic tracking-tighter ${
                      pathname === link.href ? 'text-primary' : 'text-foreground'
                    }`}
                  >
                    {link.name}
                  </Link>
                </motion.li>
              ))}
              <motion.li 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="pt-10"
              >
                <ProfileButton />
              </motion.li>
            </ul>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  )
}

export default Header