'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState, useEffect, useRef, useCallback } from 'react'
import { Menu, X, ArrowRight } from 'lucide-react'
import { ThemeToggle } from '@/components/theme-toggle'

const navItems = [
  { name: 'Home', path: '/' },
  { name: 'About', path: '/about' },
  { name: 'Services', path: '/services' },
  // { name: 'Products', path: '/products' },
  { name: 'Resources', path: '/resources' },
  { name: 'Careers', path: '/careers' },
  { name: 'Contact', path: '/contact' },
]

export function FloatingNav() {
  const pathname = usePathname()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  
  // Ref to manipulate the nav directly without triggering React re-renders
  const navRef = useRef(null)

  // 1. Zero-Render Scroll Optimization
  useEffect(() => {
    let lastScrollY = window.scrollY
    let ticking = false

    const updateNav = () => {
      if (!navRef.current) return
      
      const currentScrollY = window.scrollY
      const delta = currentScrollY - lastScrollY

      // Rubber-band protection & Scroll logic
      if (currentScrollY <= 0) {
        navRef.current.style.transform = 'translateY(0)'
      } else if (delta > 10 && currentScrollY > 80) {
        navRef.current.style.transform = 'translateY(-150%)' // Hide
      } else if (delta < -10) {
        navRef.current.style.transform = 'translateY(0)' // Show
      }

      lastScrollY = currentScrollY
      ticking = false
    }

    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(updateNav)
        ticking = true
      }
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // 2. Optimized Body Scroll Lock
  useEffect(() => {
    const body = document.body
    if (mobileMenuOpen) {
      body.style.overflow = 'hidden'
      body.style.touchAction = 'none' // Prevents mobile pull-to-refresh
    } else {
      body.style.overflow = ''
      body.style.touchAction = ''
    }

    const handleResize = () => {
      if (window.innerWidth >= 1024) setMobileMenuOpen(false)
    }
    
    window.addEventListener('resize', handleResize, { passive: true })
    return () => {
      body.style.overflow = ''
      body.style.touchAction = ''
      window.removeEventListener('resize', handleResize)
    }
  }, [mobileMenuOpen])

  const closeMenu = useCallback(() => setMobileMenuOpen(false), [])

  return (
    <>
      {/* ── Top Nav Bar ── */}
      {/* Layout optimized: used inset-x-0 mx-auto instead of translate-x-1/2 for cheaper GPU animation */}
      <nav
        ref={navRef}
        className="fixed top-0 inset-x-0 z-50 mx-auto px-4 md:px-8 py-4 w-full max-w-7xl transition-transform duration-300 ease-out will-change-transform"
      >
        <div className="glass-strong rounded-full shadow-2xl shadow-black/5 px-4 md:px-8 py-3 flex items-center justify-between bg-background/80 backdrop-blur-md border border-border/20">
<Link href="/" className="flex items-center gap-2" onClick={closeMenu}>
  {/* Logo (Rotated, fixed height) */}
  <img
    src="/logo-1.png"
    alt="NAYARAi™ Logo"
    className="h-10 w-auto transition-transform duration-200 group-hover:scale-105 dark-invert"
  />

  {/* Text */}
  <span className="font-display text-xl md:text-2xl font-bold tracking-tight hover:scale-105 transition-transform duration-200">
    <span className="text-accent">NAYA</span>RAi<sup>&trade;</sup>
  </span>
</Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-1">
            {navItems.map((item) => (
              <Link
                key={item.path}
                href={item.path}
                className={`relative px-4 py-2 text-sm font-medium transition-colors duration-200 rounded-full ${
                  pathname === item.path
                    ? 'bg-primary text-primary-foreground'
                    : 'text-foreground hover:bg-accent/20'
                }`}
              >
                {item.name}
              </Link>
            ))}
            <div className="ml-2 pl-2 border-l border-border/30">
              <ThemeToggle />
            </div>
          </div>

          {/* Mobile Controls */}
          <div className="lg:hidden flex items-center gap-2">
            <ThemeToggle />
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center relative active:scale-90 transition-transform duration-150"
              aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={mobileMenuOpen}
            >
              <Menu
                className={`w-5 h-5 absolute transition-[opacity,transform] duration-200 ease-out ${
                  mobileMenuOpen ? 'opacity-0 rotate-90 scale-50' : 'opacity-100 rotate-0 scale-100'
                }`}
              />
              <X
                className={`w-5 h-5 absolute transition-[opacity,transform] duration-200 ease-out ${
                  mobileMenuOpen ? 'opacity-100 rotate-0 scale-100' : 'opacity-0 -rotate-90 scale-50'
                }`}
              />
            </button>
          </div>
        </div>
      </nav>

      {/* ── Mobile Menu ── */}
      {/* Optimization: Wrapped in a container with pointer-events handling.
        This prevents the DOM from struggling with mounting/unmounting large animated nodes. 
      */}
      <div 
        className={`fixed inset-0 z-40 lg:hidden ${
          mobileMenuOpen ? 'pointer-events-auto' : 'pointer-events-none'
        }`}
      >
        {/* Backdrop */}
        <div
          onClick={closeMenu}
          aria-hidden="true"
          className={`absolute inset-0 bg-black/50 transition-opacity duration-300 ease-out ${
            mobileMenuOpen ? 'opacity-100' : 'opacity-0'
          }`}
        />

        {/* Panel */}
        <div
          className={`absolute inset-0 bg-background flex flex-col transition-transform duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] will-change-transform ${
            mobileMenuOpen ? 'translate-y-0' : 'translate-y-full'
          }`}
        >
          {/* Panel Header */}
          <div className="flex items-center justify-between px-6 py-4 shrink-0">
            <span className="font-display text-2xl font-bold tracking-tight">
              <span className="text-accent">NAYA</span>RAi<sup>&trade;</sup>
            </span>
            <button
              onClick={closeMenu}
              className="w-11 h-11 rounded-full bg-accent/20 flex items-center justify-center active:scale-90 transition-transform duration-150"
              aria-label="Close menu"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Nav Items */}
          <nav className="flex-1 overflow-y-auto overscroll-contain px-6">
            <ul className="w-full max-w-md mx-auto space-y-2 py-2">
              {navItems.map((item, index) => {
                const isActive = pathname === item.path
                return (
                  <li
                    key={item.path}
                    className={`transition-all duration-300 ease-out ${
                      mobileMenuOpen
                        ? 'opacity-100 translate-y-0'
                        : 'opacity-0 translate-y-6'
                    }`}
                    style={{
                      transitionDelay: mobileMenuOpen ? `${index * 30}ms` : '0ms',
                    }}
                  >
                    <Link
                      href={item.path}
                      onClick={closeMenu}
                      className={`group relative block rounded-2xl px-5 py-3.5 overflow-hidden transition-colors duration-150 ${
                        isActive
                          ? 'bg-accent text-accent-foreground'
                          : 'hover:bg-accent/10'
                      }`}
                    >
                      {/* <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-5xl font-bold opacity-[0.08] select-none">
                        {String(index + 1).padStart(2, '0')}
                      </span> */}
                      <div className="flex items-center justify-between relative z-10">
                        <span className="text-xl font-display font-semibold tracking-tight">
                          {item.name}
                        </span>
                      </div>
                    </Link>
                  </li>
                )
              })}
            </ul>
          </nav>

          {/* Bottom CTA */}
          <div
            className={`p-6 shrink-0 transition-all duration-300 ease-out ${
              mobileMenuOpen ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}
            style={{ transitionDelay: mobileMenuOpen ? '200ms' : '0ms' }}
          >
            <Link href="/contact" onClick={closeMenu} tabIndex={-1}>
              <button className="w-full bg-accent text-accent-foreground font-semibold py-4 rounded-2xl flex items-center justify-center gap-2 active:scale-[0.97] transition-transform duration-150">
                Get Started
              </button>
            </Link>
          </div>
        </div>
      </div>
    </>
  )
}