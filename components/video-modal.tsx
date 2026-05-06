'use client'

import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X } from 'lucide-react'

interface VideoModalProps {
  isOpen: boolean
  onClose: () => void
  videoUrl: string
  title: string
}

export function VideoModal({ isOpen, onClose, videoUrl, title }: VideoModalProps) {
  // Try to convert standard YouTube URLs to embed URLs
  const getEmbedUrl = (url: string) => {
    try {
      if (url.includes('youtube.com/watch')) {
        const urlObj = new URL(url)
        const videoId = urlObj.searchParams.get('v')
        if (videoId) {
          return `https://www.youtube.com/embed/${videoId}?autoplay=1`
        }
      }
      if (url.includes('youtu.be/')) {
        const urlObj = new URL(url)
        const videoId = urlObj.pathname.slice(1)
        if (videoId) {
          return `https://www.youtube.com/embed/${videoId}?autoplay=1`
        }
      }
    } catch (e) {
      // Ignore URL parsing errors
    }
    return url
  }

  const embedUrl = getEmbedUrl(videoUrl)

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed inset-0 flex items-center justify-center z-[51] p-4 pointer-events-none"
          >
            <div className="w-full max-w-5xl bg-background rounded-2xl md:rounded-3xl overflow-hidden shadow-2xl pointer-events-auto border border-border/50 flex flex-col">
              <div className="flex items-center justify-between p-4 border-b border-border/50">
                <h3 className="font-display font-semibold text-lg truncate pr-4">{title}</h3>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-secondary rounded-full transition-colors flex-shrink-0"
                >
                  <X className="w-5 h-5 text-muted-foreground" />
                </button>
              </div>
              
              <div className="relative w-full aspect-video bg-black">
                <iframe
                  src={embedUrl}
                  title={title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="absolute inset-0 w-full h-full border-0"
                />
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
