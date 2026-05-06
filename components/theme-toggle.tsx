'use client'

import { useTheme } from 'next-themes'
import { useEffect, useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => setMounted(true), [])

  const toggleTheme = useCallback(() => {
    setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')
  }, [resolvedTheme, setTheme])

  if (!mounted) {
    // Skeleton placeholder to prevent layout shift
    return <div className="w-10 h-10 rounded-full bg-muted/30 animate-pulse" />
  }

  const isDark = resolvedTheme === 'dark'

  return (
    <button
      id="theme-toggle"
      onClick={toggleTheme}
      className="relative w-10 h-10 rounded-full flex items-center justify-center overflow-hidden
                 transition-all duration-500 ease-out
                 hover:scale-110 active:scale-95
                 hover:shadow-lg
                 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent
                 border border-border/40"
      style={{
        background: isDark
          ? 'linear-gradient(135deg, oklch(0.25 0.02 270), oklch(0.18 0.01 250))'
          : 'linear-gradient(135deg, oklch(0.95 0.04 85), oklch(0.92 0.06 70))',
      }}
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
    >
      <AnimatePresence mode="wait" initial={false}>
        {isDark ? (
          <motion.div
            key="moon"
            initial={{ rotate: -90, scale: 0, opacity: 0 }}
            animate={{ rotate: 0, scale: 1, opacity: 1 }}
            exit={{ rotate: 90, scale: 0, opacity: 0 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="flex items-center justify-center"
          >
            {/* Moon SVG */}
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="text-blue-200"
            >
              <motion.path
                d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z"
                fill="currentColor"
                stroke="currentColor"
                strokeWidth="1"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            {/* Little stars */}
            <motion.div
              className="absolute top-1.5 right-1.5 w-1 h-1 rounded-full bg-blue-200"
              animate={{
                opacity: [0.4, 1, 0.4],
                scale: [0.8, 1.2, 0.8],
              }}
              transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            />
            <motion.div
              className="absolute bottom-2 left-2 w-0.5 h-0.5 rounded-full bg-blue-300"
              animate={{
                opacity: [0.3, 0.8, 0.3],
                scale: [1, 1.5, 1],
              }}
              transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
            />
          </motion.div>
        ) : (
          <motion.div
            key="sun"
            initial={{ rotate: 90, scale: 0, opacity: 0 }}
            animate={{ rotate: 0, scale: 1, opacity: 1 }}
            exit={{ rotate: -90, scale: 0, opacity: 0 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="flex items-center justify-center relative"
          >
            {/* Sun SVG */}
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="text-amber-500"
            >
              <circle cx="12" cy="12" r="4" fill="currentColor" />
              {/* Sun rays */}
              {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, i) => {
                const rad = (angle * Math.PI) / 180
                const x1 = 12 + Math.cos(rad) * 6
                const y1 = 12 + Math.sin(rad) * 6
                const x2 = 12 + Math.cos(rad) * 8.5
                const y2 = 12 + Math.sin(rad) * 8.5
                return (
                  <motion.line
                    key={angle}
                    x1={x1}
                    y1={y1}
                    x2={x2}
                    y2={y2}
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    initial={{ opacity: 0, pathLength: 0 }}
                    animate={{ opacity: 1, pathLength: 1 }}
                    transition={{ duration: 0.3, delay: i * 0.03 }}
                  />
                )
              })}
            </svg>
            {/* Rotating glow */}
            <motion.div
              className="absolute inset-0 rounded-full"
              style={{
                background: 'radial-gradient(circle, oklch(0.85 0.12 85 / 0.3) 0%, transparent 70%)',
              }}
              animate={{ rotate: 360 }}
              transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </button>
  )
}
