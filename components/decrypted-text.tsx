'use client'

import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'

interface DecryptedTextProps {
  text: string
  speed?: number
  maxIterations?: number
  characters?: string
  className?: string
  parentClassName?: string
  encryptedClassName?: string
  animateOn?: 'hover' | 'view' | 'mount'
  revealDirection?: 'start' | 'end' | 'center'
  sequential?: boolean
  useOriginalCharsOnly?: boolean
  onAnimationComplete?: () => void
}

const DEFAULT_CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+-=[]{}|;:,.<>?'

export default function DecryptedText({
  text,
  speed = 50,
  maxIterations = 8,
  characters = DEFAULT_CHARS,
  className = '',
  parentClassName = '',
  encryptedClassName = '',
  animateOn = 'hover',
  revealDirection = 'start',
  sequential = false,
  useOriginalCharsOnly = false,
  onAnimationComplete,
}: DecryptedTextProps) {
  const [displayText, setDisplayText] = useState(text)
  const [isAnimating, setIsAnimating] = useState(false)
  const [hasAnimated, setHasAnimated] = useState(false)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)
  const elementRef = useRef<HTMLSpanElement>(null)

  const getRandomChar = (originalChar: string) => {
    if (originalChar === ' ') return ' '
    if (useOriginalCharsOnly && /[a-zA-Z]/.test(originalChar)) {
      const isUpperCase = originalChar === originalChar.toUpperCase()
      const chars = isUpperCase ? 'ABCDEFGHIJKLMNOPQRSTUVWXYZ' : 'abcdefghijklmnopqrstuvwxyz'
      return chars[Math.floor(Math.random() * chars.length)]
    }
    return characters[Math.floor(Math.random() * characters.length)]
  }

  const animate = () => {
    if (isAnimating) return
    setIsAnimating(true)

    let iteration = 0
    const textArray = text.split('')

    intervalRef.current = setInterval(() => {
      setDisplayText((prev) => {
        return textArray
          .map((char, index) => {
            if (sequential) {
              const revealIndex = Math.floor((iteration / maxIterations) * textArray.length)
              if (index < revealIndex) return text[index]
              if (index === revealIndex && iteration >= maxIterations) return text[index]
              return getRandomChar(char)
            } else {
              if (iteration >= maxIterations) return text[index]
              return Math.random() < iteration / maxIterations ? text[index] : getRandomChar(char)
            }
          })
          .join('')
      })

      iteration++

      if (iteration > maxIterations + 1) {
        if (intervalRef.current) clearInterval(intervalRef.current)
        setDisplayText(text)
        setIsAnimating(false)
        setHasAnimated(true)
        onAnimationComplete?.()
      }
    }, speed)
  }

  useEffect(() => {
    if (animateOn === 'mount') {
      animate()
    } else if (animateOn === 'view') {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting && !hasAnimated) {
              animate()
            }
          })
        },
        { threshold: 0.5 }
      )

      if (elementRef.current) {
        observer.observe(elementRef.current)
      }

      return () => observer.disconnect()
    }
  }, [animateOn, hasAnimated])

  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [])

  return (
    <span
      ref={elementRef}
      className={parentClassName}
      onMouseEnter={animateOn === 'hover' ? animate : undefined}
    >
      <span className={`${className} ${isAnimating ? encryptedClassName : ''}`}>
        {displayText}
      </span>
    </span>
  )
}
