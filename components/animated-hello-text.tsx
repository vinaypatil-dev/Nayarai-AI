'use client'

import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const hellos = [
  { text: 'Hello', language: 'English' },
  { text: 'Bonjour', language: 'French' },
  { text: 'Hola', language: 'Spanish' },
  { text: 'Ciao', language: 'Italian' },
  { text: 'Hallo', language: 'German' },
  { text: 'Olá', language: 'Portuguese' },
  { text: 'こんにちは', language: 'Japanese' },
  { text: '你好', language: 'Chinese' },
  { text: 'नमस्ते', language: 'Hindi' },
  { text: 'مرحبا', language: 'Arabic' },
  { text: 'Привет', language: 'Russian' },
  { text: '안녕하세요', language: 'Korean' },
]

export default function AnimatedHelloText() {
  const [currentIndex, setCurrentIndex] = React.useState(0)

  React.useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % hellos.length)
    }, 2500)
    return () => clearInterval(interval)
  }, [])

  return (
    <span className="relative inline-block">
      <AnimatePresence mode="wait">
        <motion.span
          key={currentIndex}
          initial={{ 
            opacity: 0, 
            y: 40,
            rotateX: -90,
            scale: 0.8,
          }}
          animate={{ 
            opacity: 1, 
            y: 0,
            rotateX: 0,
            scale: 1,
          }}
          exit={{ 
            opacity: 0, 
            y: -40,
            rotateX: 90,
            scale: 0.8,
          }}
          transition={{
            duration: 0.6,
            ease: [0.22, 1, 0.36, 1],
          }}
          className="inline-block"
          style={{
            transformStyle: 'preserve-3d',
            transformOrigin: 'center',
          }}
        >
          {hellos[currentIndex].text}
        </motion.span>
      </AnimatePresence>
      
      {/* Language label */}
      <motion.span
        key={`lang-${currentIndex}`}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="absolute -bottom-12 md:-bottom-16 left-1/2 -translate-x-1/2 text-sm md:text-base text-muted-foreground font-medium whitespace-nowrap"
      >
        ({hellos[currentIndex].language})
      </motion.span>
    </span>
  )
}
