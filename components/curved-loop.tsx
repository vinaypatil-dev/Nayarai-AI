'use client'

import React from "react"

import { useEffect, useRef } from 'react'
import { motion, useAnimation, useMotionValue } from 'framer-motion'

interface CurvedLoopProps {
  marqueeText: string
  speed?: number
  curveAmount?: number
  direction?: 'left' | 'right'
  interactive?: boolean
  className?: string
}

export default function CurvedLoop({
  marqueeText,
  speed = 1,
  curveAmount = 400,
  direction = 'left',
  interactive = false,
  className = '',
}: CurvedLoopProps) {
  const pathRef = useRef<SVGPathElement>(null)
  const controls = useAnimation()
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)

  useEffect(() => {
    controls.start({
      offsetDistance: direction === 'left' ? ['0%', '100%'] : ['100%', '0%'],
      transition: {
        duration: 20 / speed,
        repeat: Infinity,
        ease: 'linear',
      },
    })
  }, [controls, speed, direction])

  const handleMouseMove = (e: React.MouseEvent<SVGSVGElement>) => {
    if (!interactive) return
    const rect = e.currentTarget.getBoundingClientRect()
    mouseX.set(e.clientX - rect.left)
    mouseY.set(e.clientY - rect.top)
  }

  return (
    <svg
      viewBox="0 0 1000 200"
      className={`w-full h-auto ${className}`}
      onMouseMove={handleMouseMove}
      style={{ overflow: 'visible' }}
    >
      <defs>
        <path
          id="curve"
          ref={pathRef}
          d={`M 0 ${100 + curveAmount} Q 250 ${100 - curveAmount} 500 ${100 + curveAmount} T 1000 ${100 + curveAmount}`}
          fill="none"
        />
      </defs>

      {[...Array(3)].map((_, index) => (
        <motion.text
          key={index}
          fontSize="24"
          fontWeight="600"
          fill="currentColor"
          className="text-accent/40"
          animate={controls}
          style={{
            offsetPath: 'path("M 0 ' + (100 + curveAmount) + ' Q 250 ' + (100 - curveAmount) + ' 500 ' + (100 + curveAmount) + ' T 1000 ' + (100 + curveAmount) + '")',
            offsetRotate: '0deg',
          }}
        >
          <textPath href="#curve" startOffset={`${(index * 33.33)}%`}>
            {marqueeText}
          </textPath>
        </motion.text>
      ))}
    </svg>
  )
}
