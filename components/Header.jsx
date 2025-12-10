'use client'

import Link from 'next/link'
import { useState } from 'react'
import { HiMenu, HiX } from 'react-icons/hi'
import { ThemeToggle } from '@/components/ThemeToggle'
import ProfileButton from '@/components/ProfileButton'

const Header = () => {
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <header className="bg-(--color-primary) text-(--color-primary-foreground) shadow-lg sticky top-0 z-40">
      <div className="container mx-auto py-4 px-6 flex justify-between items-center">
        
        {/* Logo */}
        <Link href="/" className="text-2xl md:text-3xl font-bold tracking-wide">
          CineScope
        </Link>

        {/* Desktop Navbar */}
        <nav className="hidden md:block">
          <ul className="flex items-center space-x-4">
            <li>
              <Link 
                href="/" 
                className="hover:text-(--color-muted-foreground) transition-colors duration-200 font-medium"
              >
                Home
              </Link>
            </li>
            <li>
              <Link 
                href="/movies" 
                className="hover:text-(--color-muted-foreground) transition-colors duration-200 font-medium"
              >
                Movies
              </Link>
            </li>
            <li>
              <Link 
                href="/series" 
                className="hover:text-(--color-muted-foreground) transition-colors duration-200 font-medium"
              >
                Series
              </Link>
            </li>
            <li>
              <Link 
                href="/watchlist" 
                className="hover:text-(--color-muted-foreground) transition-colors duration-200 font-medium"
              >
                Watchlist
              </Link>
            </li>
            <li>
              <Link 
                href="/favourites" 
                className="hover:text-(--color-muted-foreground) transition-colors duration-200 font-medium"
              >
                Favourites
              </Link>
            </li>
            <li>
              <ThemeToggle />
            </li>
            <li>
              <ProfileButton />
            </li>
          </ul>
        </nav>

        {/* Mobile Menu Button */}
        <div className="md:hidden flex items-center gap-4">
          <ProfileButton />
          <button 
            onClick={() => setMobileOpen(!mobileOpen)} 
            className="focus:outline-none focus:ring-2 focus:ring-(--color-accent) p-1 rounded"
            aria-label="Toggle menu"
          >
            {mobileOpen ? <HiX className="w-6 h-6" /> : <HiMenu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <nav className="md:hidden bg-(--color-primary) px-6 py-4 shadow-lg animate-fadeIn">
          <ul className="flex flex-col space-y-4">
            <li>
              <Link 
                href="/" 
                className="hover:text-(--color-muted-foreground) transition-colors duration-200 font-medium"
              >
                Home
              </Link>
            </li>
            <li>
              <Link 
                href="/movies" 
                className="hover:text-(--color-muted-foreground) transition-colors duration-200 font-medium"
              >
                Movies
              </Link>
            </li>
            <li>
              <Link 
                href="/series" 
                className="hover:text-(--color-muted-foreground) transition-colors duration-200 font-medium"
              >
                Series
              </Link>
            </li>
            <li>
              <Link 
                href="/watchlist" 
                className="hover:text-(--color-muted-foreground) transition-colors duration-200 font-medium"
              >
                Watchlist
              </Link>
            </li>
            <li>
              <Link 
                href="/favourites" 
                className="hover:text-(--color-muted-foreground) transition-colors duration-200 font-medium"
              >
                Favourites
              </Link>
            </li>
            <li>
              <ThemeToggle />
            </li>
          </ul>
        </nav>
      )}
    </header>
  )
}

export default Header
