'use client'

import { useEffect, useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'

interface ScrollMarqueeProps {
  text: string
  direction?: 'left' | 'right'
  speed?: number
  className?: string
}

export default function ScrollMarquee({
  text,
  direction = 'left',
  speed = 1,
  className = '',
}: ScrollMarqueeProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'end start'],
  })

  const x = useTransform(
    scrollYProgress,
    [0, 1],
    direction === 'left' ? ['0%', '-50%'] : ['-50%', '0%']
  )

  // Duplicate text to create seamless loop
  const repeatedText = `${text} ✦ `.repeat(10)

  return (
    <div ref={containerRef} className={`overflow-hidden ${className}`}>
      <motion.div
        style={{ x }}
        className="flex whitespace-nowrap"
      >
        <span className="text-6xl md:text-8xl lg:text-9xl font-display font-bold text-accent/10 select-none">
          {repeatedText}
        </span>
      </motion.div>
    </div>
  )
}
