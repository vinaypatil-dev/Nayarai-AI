'use client'

import { motion } from 'framer-motion'
import { ReactNode } from 'react'

interface MarqueeProps {
  children: ReactNode
  speed?: number
  direction?: 'left' | 'right'
  className?: string
}

export function Marquee({ children, speed = 50, direction = 'left', className = '' }: MarqueeProps) {
  const directionValue = direction === 'left' ? ['0%', '-50%'] : ['-50%', '0%']
  
  return (
    <div className={`overflow-hidden ${className}`}>
      <motion.div
        className="flex gap-8 w-fit"
        animate={{
          x: directionValue,
        }}
        transition={{
          duration: speed,
          repeat: Number.POSITIVE_INFINITY,
          ease: "linear",
        }}
      >
        {children}
        {children}
      </motion.div>
    </div>
  )
}
