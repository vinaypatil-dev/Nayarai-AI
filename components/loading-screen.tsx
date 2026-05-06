'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const WORDS = [
  'RAi',
  'CARE',
  'MED',
  'DARL',
  'DICE',
  'REALTY',
  'LEARN',
  'CLIMB',
  'RAi',
]

// 🔥 SPEED TUNED (< 2s total)
const INTERVAL = 120
const FINAL_HOLD = 300

export default function LoadingScreen() {
  const [index, setIndex] = useState(0)
  const [isLoading, setIsLoading] = useState(true)

  const isFinal = index === WORDS.length - 1

  useEffect(() => {
    if (index >= WORDS.length - 1) return
    const t = setTimeout(() => setIndex(i => i + 1), INTERVAL)
    return () => clearTimeout(t)
  }, [index])

  useEffect(() => {
    const timeout = setTimeout(
      () => setIsLoading(false),
      WORDS.length * INTERVAL + FINAL_HOLD
    )
    return () => clearTimeout(timeout)
  }, [])

  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }} // faster exit
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-background"
        >
          <div className="flex flex-col items-center">

            <div className="flex items-baseline text-6xl md:text-8xl lg:text-9xl font-bold tracking-tight">

              <span className="text-accent">
                NAYA
              </span>

              <div className="ml-2 inline-flex items-baseline min-w-[140px]">
                <AnimatePresence mode="wait">
                  <motion.span
                    key={WORDS[index]}
                    initial={{ opacity: 0, y: 8, scale: 0.96 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{
                      opacity: 0,
                      y: -8,
                      scale: 1.02,
                      filter: 'blur(3px)'
                    }}
                    transition={{
                      duration: 0.12,
                      ease: 'easeOut'
                    }}
                    className="text-black whitespace-nowrap"
                  >
                    {WORDS[index]}
                  </motion.span>
                </AnimatePresence>
              </div>

            </div>

            <div className="h-8 mt-4">
              <AnimatePresence>
                {isFinal && (
                  <motion.p
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.25 }}
                    className="text-sm tracking-[0.2em] uppercase text-muted-foreground"
                  >
                    Regulatory Excellence
                  </motion.p>
                )}
              </AnimatePresence>
            </div>

          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}