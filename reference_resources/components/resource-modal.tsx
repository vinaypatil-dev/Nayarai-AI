'use client'

import React, { useEffect } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { X, ExternalLink, Download, AlertTriangle, Play } from 'lucide-react'
import { ResourceItem } from '@/lib/types/contentful'

function formatDate(raw: string): string {
  if (!raw) return ''
  const date = new Date(raw)
  if (isNaN(date.getTime())) return raw
  return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
}

function TypeBadge({ type }: { type: string }) {
  const colors: Record<string, string> = {
    ARTICLE:    'border-accent text-accent',
    GUIDANCE:   'border-emerald-400 text-emerald-400',
    REGULATION: 'border-blue-400 text-blue-400',
    NOTICE:     'border-amber-400 text-amber-400',
    VIDEO:      'border-purple-400 text-purple-400',
    PDF:        'border-red-400 text-red-400',
  }
  return (
    <span className={`text-[10px] font-mono font-semibold border px-2 py-0.5 tracking-widest uppercase ${colors[type?.toUpperCase()] || 'border-muted-foreground text-muted-foreground'}`}>
      {type}
    </span>
  )
}

interface ResourceModalProps {
  resource: ResourceItem | null
  onClose: () => void
}

export function ResourceModal({ resource, onClose }: ResourceModalProps) {
  const sourceUrl = resource?.sourceUrl || resource?.media?.url || null
  const isVideo   = resource?.resourceType?.toUpperCase() === 'VIDEO' || !!resource?.videoUrl

  // Close on Escape key
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [onClose])

  // Block scroll when open
  useEffect(() => {
    if (resource) document.body.style.overflow = 'hidden'
    else document.body.style.overflow = ''
    return () => { document.body.style.overflow = '' }
  }, [resource])

  return (
    <AnimatePresence>
      {resource && (
        <>
          {/* Backdrop */}
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50"
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            key="modal"
            initial={{ opacity: 0, scale: 0.96, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 20 }}
            transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
            className="fixed inset-4 md:inset-8 lg:inset-12 z-50 flex flex-col bg-background border border-border shadow-2xl overflow-hidden"
            onClick={e => e.stopPropagation()}
          >
            {/* ── Header ── */}
            <div className="flex items-start justify-between gap-4 px-6 py-4 border-b border-border flex-shrink-0">
              <div className="flex-1 min-w-0 space-y-1.5">
                <div className="flex items-center gap-2 flex-wrap">
                  <TypeBadge type={resource.resourceType} />
                  {resource.sys?.publishedAt && (
                    <span className="text-[11px] font-mono text-muted-foreground">
                      {formatDate(resource.sys.publishedAt)}
                    </span>
                  )}
                </div>
                <h2 className="text-[15px] md:text-[17px] font-semibold leading-snug line-clamp-2">
                  {resource.title}
                </h2>
              </div>
              <button
                onClick={onClose}
                className="flex-shrink-0 p-1.5 hover:bg-secondary rounded transition-colors mt-0.5"
                aria-label="Close"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* ── Body ── */}
            <div className="flex flex-col lg:flex-row flex-1 min-h-0 overflow-hidden">

              {/* Left: Details panel */}
              <div className="lg:w-72 xl:w-80 flex-shrink-0 border-b lg:border-b-0 lg:border-r border-border overflow-y-auto">
                <div className="p-5 space-y-5">

                  {/* Description */}
                  <div>
                    <p className="text-[11px] font-mono font-bold text-muted-foreground tracking-widest mb-2">DESCRIPTION</p>
                    <p className="text-[13px] text-foreground/80 leading-relaxed">
                      {resource.shortDescription || 'No description available.'}
                    </p>
                  </div>

                  {/* Meta */}
                  <div className="space-y-2">
                    <p className="text-[11px] font-mono font-bold text-muted-foreground tracking-widest mb-2">DETAILS</p>
                    <div className="space-y-1.5">
                      <div className="flex justify-between text-[12px]">
                        <span className="text-muted-foreground font-mono">Product Type</span>
                        <span className="text-foreground font-medium text-right ml-2">{resource.productType || '—'}</span>
                      </div>
                      <div className="flex justify-between text-[12px]">
                        <span className="text-muted-foreground font-mono">Country</span>
                        <span className="text-foreground font-medium text-right ml-2">{resource.country || '—'}</span>
                      </div>
                      <div className="flex justify-between text-[12px]">
                        <span className="text-muted-foreground font-mono">Type</span>
                        <span className="text-foreground font-medium text-right ml-2">{resource.resourceType || '—'}</span>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="space-y-2 pt-1">
                    <p className="text-[11px] font-mono font-bold text-muted-foreground tracking-widest mb-3">ACTIONS</p>

                    {sourceUrl && (
                      <a
                        href={sourceUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 w-full px-3 py-2.5 text-[12px] font-mono border border-border hover:border-accent hover:text-accent transition-colors"
                      >
                        <ExternalLink className="w-3.5 h-3.5 flex-shrink-0" />
                        Open Source
                      </a>
                    )}

                    {resource.media?.url && (
                      <a
                        href={resource.media.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        download
                        className="flex items-center gap-2 w-full px-3 py-2.5 text-[12px] font-mono border border-border hover:border-accent hover:text-accent transition-colors"
                      >
                        <Download className="w-3.5 h-3.5 flex-shrink-0" />
                        Download File
                      </a>
                    )}

                    {isVideo && resource.videoUrl && (
                      <a
                        href={resource.videoUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 w-full px-3 py-2.5 text-[12px] font-mono border border-border hover:border-accent hover:text-accent transition-colors"
                      >
                        <Play className="w-3.5 h-3.5 flex-shrink-0" />
                        Watch Video
                      </a>
                    )}

                    {!sourceUrl && !resource.media?.url && !resource.videoUrl && (
                      <p className="text-[12px] text-muted-foreground font-mono">No links available.</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Right: Webview / Preview */}
              <div className="flex-1 relative bg-secondary/10 min-h-[240px]">
                {isVideo && resource.videoUrl ? (
                  /* Video embed — YouTube/Vimeo allow iframes */
                  <iframe
                    src={resource.videoUrl}
                    className="w-full h-full border-0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                ) : sourceUrl ? (
                  /* Most regulatory/news sites block iframes — show a clean preview card instead */
                  <div className="absolute inset-0 flex flex-col items-center justify-center gap-5 p-8 text-center">
                    <div className="w-16 h-16 rounded-full bg-secondary/50 flex items-center justify-center">
                      <ExternalLink className="w-7 h-7 text-muted-foreground" />
                    </div>
                    <div className="space-y-2 max-w-sm">
                      <p className="text-[15px] font-semibold leading-snug">{resource.title}</p>
                      <p className="text-[12px] text-muted-foreground leading-relaxed">
                        {resource.shortDescription || 'Click below to open the full resource in a new tab.'}
                      </p>
                    </div>
                    <div className="flex flex-col gap-2 w-full max-w-[220px]">
                      <a
                        href={sourceUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center gap-2 w-full px-4 py-2.5 text-[12px] font-mono bg-accent text-background hover:opacity-90 transition-opacity"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                        Open Full Resource
                      </a>

                      {/* Download: direct file if media exists, otherwise try source URL */}
                      {resource.media?.url ? (
                        <a
                          href={resource.media.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          download
                          className="flex items-center justify-center gap-2 w-full px-4 py-2.5 text-[12px] font-mono border border-border hover:border-accent hover:text-accent transition-colors"
                        >
                          <Download className="w-3.5 h-3.5" />
                          Download File
                        </a>
                      ) : (
                        <a
                          href={sourceUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          download
                          className="flex items-center justify-center gap-2 w-full px-4 py-2.5 text-[12px] font-mono border border-border hover:border-accent hover:text-accent transition-colors"
                        >
                          <Download className="w-3.5 h-3.5" />
                          Download / Save
                        </a>
                      )}
                    </div>
                    <p className="text-[10px] font-mono text-muted-foreground/50 tracking-wide">
                      {new URL(sourceUrl).hostname}
                    </p>
                  </div>
                ) : (
                  /* No URL available */
                  <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 text-center p-8">
                    <AlertTriangle className="w-8 h-8 text-muted-foreground/40" />
                    <p className="text-[13px] text-muted-foreground">No preview available for this resource.</p>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
