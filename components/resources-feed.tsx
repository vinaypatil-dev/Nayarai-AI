// [ignoring loop detection]
'use client'

import React, { useState, useRef, useEffect, useCallback, useTransition } from 'react'
import { useRouter, usePathname, useSearchParams } from 'next/navigation'
import { AnimatePresence, motion } from 'framer-motion'
import { Search, X, Folder, FolderOpen, ExternalLink, ChevronLeft, ChevronRight, SlidersHorizontal, Download } from 'lucide-react'
import { ResourceItem } from '@/lib/types/contentful'
import { VideoModal } from '@/components/video-modal'
import { ResourceModal } from '@/components/resource-modal'
import {
  COUNTRIES,
  PRODUCT_TYPES,
  getAgencyFromResource,
} from '@/lib/agency-utils'

// ─── Helpers ─────────────────────────────────────────────────────────────────

/** Audio Click Sound Generator for filter interactions (AudioBufferSourceNode pattern) */
let audioCtx: AudioContext | null = null
let clickBuffer: AudioBuffer | null = null

function getAudioContext(): AudioContext | null {
  if (typeof window === 'undefined') return null
  try {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext
    if (!AudioContextClass) return null

    if (!audioCtx || audioCtx.state === 'closed') {
      audioCtx = new AudioContextClass()
    }
    if (audioCtx.state === 'suspended') {
      audioCtx.resume().catch(() => {})
    }
    return audioCtx
  } catch {
    return null
  }
}

function getClickBuffer(ctx: AudioContext): AudioBuffer {
  if (clickBuffer && clickBuffer.sampleRate === ctx.sampleRate) {
    return clickBuffer
  }
  const sampleRate = ctx.sampleRate
  const duration = 0.015 // 15ms crisp UI click sound
  const numSamples = Math.floor(sampleRate * duration)
  const buffer = ctx.createBuffer(1, numSamples, sampleRate)
  const data = buffer.getChannelData(0)

  for (let i = 0; i < numSamples; i++) {
    const t = i / numSamples
    // Crisp click wave: 900Hz -> 200Hz frequency drop with exponential envelope decay
    const freq = 900 * Math.exp(-t * 3.5)
    const phase = 2 * Math.PI * freq * (i / sampleRate)
    const envelope = Math.pow(1 - t, 2.5) // smooth exponential decay
    data[i] = Math.sin(phase) * envelope * 0.5
  }

  clickBuffer = buffer
  return buffer
}

function playClickSound() {
  if (typeof window === 'undefined') return
  try {
    const ctx = getAudioContext()
    if (!ctx) return

    const buffer = getClickBuffer(ctx)
    const source = ctx.createBufferSource()
    source.buffer = buffer

    const gain = ctx.createGain()
    gain.gain.value = 0.7 // crisp, audible sound

    source.connect(gain)
    gain.connect(ctx.destination)

    source.start(0)

    source.onended = () => {
      try {
        source.disconnect()
        gain.disconnect()
      } catch {}
    }
  } catch {
    // Fail silently without breaking UI
  }
}

/** Strawberry Menu Icon: three horizontal rounded bars with decreasing widths (evenly centered) */
function StrawberryMenuIcon({ className = "w-3.5 h-3.5" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round">
      <line x1="2" y1="3.5" x2="14" y2="3.5" />
      <line x1="3.5" y1="8" x2="12.5" y2="8" />
      <line x1="5.5" y1="12.5" x2="10.5" y2="12.5" />
    </svg>
  )
}

/** Converts '2025-03-15T00:00:00Z' → '15 03 2025' */
function formatDate(raw: string): string {
  if (!raw) return ''
  const date = new Date(raw)
  if (isNaN(date.getTime())) return raw
  const dd = String(date.getDate()).padStart(2, '0')
  const mm = String(date.getMonth() + 1).padStart(2, '0')
  const yyyy = date.getFullYear()
  return `${dd} ${mm} ${yyyy}`
}

function TypeBadge({ type }: { type: string }) {
  const t = type?.toUpperCase() || ''
  const colors: Record<string, string> = {
    PDF:        'border-accent text-accent',
    VIDEO:      'border-blue-400 text-blue-400',
    MP4:        'border-blue-400 text-blue-400',
    DOC:        'border-emerald-400 text-emerald-400',
    DOCX:       'border-emerald-400 text-emerald-400',
    'DOC/DOCX': 'border-emerald-400 text-emerald-400',
    XLS:        'border-green-400 text-green-400',
    XLSX:       'border-green-400 text-green-400',
    'XLS/XLSX': 'border-green-400 text-green-400',
    PPT:        'border-amber-400 text-amber-400',
    PPTX:       'border-amber-400 text-amber-400',
    'PPT/PPTX': 'border-amber-400 text-amber-400',
    JPEG:       'border-purple-400 text-purple-400',
    JPG:        'border-purple-400 text-purple-400',
    PNG:        'border-purple-400 text-purple-400',
    CSV:        'border-teal-400 text-teal-400',
    TXT:        'border-slate-400 text-slate-400',
    XPS:        'border-rose-400 text-rose-400',
    RAW:        'border-orange-400 text-orange-400',
  }
  return (
    <span className={`text-[10px] font-mono font-semibold border px-1.5 py-0.5 tracking-widest uppercase ${
      colors[t] || 'border-accent text-accent'
    }`}>
      {type || 'DOC'}
    </span>
  )
}

function FilterCheckbox({
  label,
  checked,
  onChange,
}: {
  label: string
  checked: boolean
  onChange: () => void
}) {
  return (
    <label className="flex items-start gap-2 cursor-pointer group py-1 select-none">
      <span
        onClick={onChange}
        className={`w-3.5 h-3.5 border flex-shrink-0 flex items-center justify-center transition-colors mt-0.5 ${
          checked
            ? 'border-accent bg-accent'
            : 'border-muted-foreground/50 group-hover:border-muted-foreground'
        }`}
      >
        {checked && (
          <svg width="8" height="6" viewBox="0 0 8 6" fill="none">
            <path d="M1 3L3 5L7 1" stroke="var(--background)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        )}
      </span>
      <span
        onClick={onChange}
        className="text-[13px] text-muted-foreground group-hover:text-foreground transition-colors leading-tight break-words"
      >
        {label}
      </span>
    </label>
  )
}

function ResourceRow({
  resource,
  index,
  isExpanded,
  onToggle,
}: {
  resource: ResourceItem
  index: number
  isExpanded: boolean
  onToggle: () => void
}) {
  const sourceUrl = resource.sourceUrl || resource.media?.url || resource.videoUrl
  const downloadUrl = resource.media?.url || sourceUrl
  const derivedAgency = getAgencyFromResource(resource)
  const formattedDate = formatDate(resource.sys?.publishedAt || '')

  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ delay: index * 0.015, duration: 0.18 }}
      className="border-b border-border/30 group"
    >
      <div
        className={`grid grid-cols-[110px_1fr_140px_70px_36px] items-center gap-4 py-3 cursor-pointer transition-colors px-2 ${
          isExpanded ? 'bg-secondary/40' : 'hover:bg-secondary/30'
        }`}
        onClick={onToggle}
      >
        <span className="font-mono text-[12px] font-semibold text-foreground select-none">
          {formattedDate}
        </span>
        <div className="space-y-0.5 pr-4 min-w-0">
          <h3 className="text-[14px] font-bold text-foreground leading-snug truncate group-hover:text-accent transition-colors">
            {resource.title}
          </h3>
        </div>
        <div className="flex flex-col min-w-0">
          <span className="text-[13px] font-bold text-foreground">{derivedAgency}</span>
        </div>
        <div className="flex items-center">
          <TypeBadge type={resource.resourceType} />
        </div>
        <div className="flex items-center justify-end">
          <span className={`font-mono text-base font-bold select-none transition-colors ${
            isExpanded ? 'text-accent' : 'text-muted-foreground group-hover:text-foreground'
          }`}>
            {isExpanded ? '−' : '+'}
          </span>
        </div>
      </div>

      <AnimatePresence initial={false}>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{
              height: { duration: 0.28, ease: [0.16, 1, 0.3, 1] },
              opacity: { duration: 0.2, ease: 'easeInOut' },
            }}
            className="overflow-hidden bg-secondary/20 border-t border-border/20 px-3 py-3"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
              {/* Left Side: Plain Text Source Info */}
              <div className="flex items-center gap-1.5 text-muted-foreground font-mono text-[12px] truncate min-w-0">
                {sourceUrl && (
                  <span className="truncate">
                    <span className="text-muted-foreground/70">Source: </span>
                    <a
                      href={sourceUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="text-foreground/90 hover:text-accent underline font-medium truncate"
                    >
                      {sourceUrl}
                    </a>
                  </span>
                )}
              </div>

              {/* Right Side: Download Button */}
              <div className="flex items-center gap-2 flex-shrink-0">
                {downloadUrl && (
                  <a
                    href={downloadUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    download
                    onClick={(e) => e.stopPropagation()}
                    className="group/btn flex items-center gap-1.5 px-3 py-1.5 font-mono text-[11px] border border-border/70 bg-background/80 text-foreground/90 hover:border-accent hover:text-accent hover:bg-secondary/50 transition-colors rounded-none"
                  >
                    <Download className="w-3.5 h-3.5 text-muted-foreground group-hover/btn:text-accent transition-colors" />
                    Download
                  </a>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

function MobileResourceItem({
  resource,
  index,
  isExpanded,
  onToggle,
}: {
  resource: ResourceItem
  index: number
  isExpanded: boolean
  onToggle: () => void
}) {
  const sourceUrl = resource.sourceUrl || resource.media?.url || resource.videoUrl
  const downloadUrl = resource.media?.url || sourceUrl
  const derivedAgency = getAgencyFromResource(resource)
  const formattedDate = formatDate(resource.sys?.publishedAt || '')

  return (
    <motion.div
      initial={{ opacity: 0, y: 4 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ delay: index * 0.01 }}
      className="border-b border-border/30 group"
    >
      <div
        className={`flex items-start justify-between gap-3 py-3.5 cursor-pointer px-2 transition-colors ${
          isExpanded ? 'bg-secondary/40' : 'hover:bg-secondary/20'
        }`}
        onClick={onToggle}
      >
        <div className="flex-1 min-w-0 space-y-1.5">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-mono text-[11px] font-semibold text-foreground">{formattedDate}</span>
            <span className="text-[10px] font-mono font-bold bg-secondary/50 text-foreground px-1.5 py-0.5 rounded">{derivedAgency}</span>
            <TypeBadge type={resource.resourceType} />
          </div>
          <h3 className="text-[15px] font-semibold leading-snug group-hover:text-accent transition-colors line-clamp-2">{resource.title}</h3>
        </div>
        <div className="flex-shrink-0 p-1.5 text-muted-foreground group-hover:text-accent transition-colors mt-0.5">
          <span className={`font-mono text-base font-bold select-none transition-colors ${
            isExpanded ? 'text-accent' : ''
          }`}>
            {isExpanded ? '−' : '+'}
          </span>
        </div>
      </div>

      <AnimatePresence initial={false}>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{
              height: { duration: 0.28, ease: [0.16, 1, 0.3, 1] },
              opacity: { duration: 0.2, ease: 'easeInOut' },
            }}
            className="overflow-hidden bg-secondary/20 border-t border-border/20 px-3 py-3 space-y-3"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
              {/* Left Side: Plain Text Source Info */}
              <div className="flex items-center gap-1.5 text-muted-foreground font-mono text-[11px] truncate min-w-0">
                {sourceUrl && (
                  <span className="truncate">
                    <span className="text-muted-foreground/70">Source: </span>
                    <a
                      href={sourceUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="text-foreground/90 hover:text-accent underline font-medium truncate"
                    >
                      {sourceUrl}
                    </a>
                  </span>
                )}
              </div>

              {/* Right Side: Download Button */}
              {downloadUrl && (
                <a
                  href={downloadUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  download
                  onClick={(e) => e.stopPropagation()}
                  className="group/btn flex-shrink-0 flex items-center justify-center gap-1.5 px-3 py-2 font-mono text-[11px] border border-border/70 bg-background/80 text-foreground/90 hover:border-accent hover:text-accent hover:bg-secondary/50 transition-colors rounded-none"
                >
                  <Download className="w-3.5 h-3.5 text-muted-foreground group-hover/btn:text-accent transition-colors" />
                  Download
                </a>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

interface ResourcesFeedProps {
  initialResources: ResourceItem[]
  totalCount: number
  currentPage: number
  pageSize: number
  errorMessage?: string
}

export function ResourcesFeed({
  initialResources,
  totalCount,
  currentPage,
  pageSize,
  errorMessage,
}: ResourcesFeedProps) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [isPending, startTransition] = useTransition()

  // Local state for search query to provide immediate UI feedback when typing
  const [searchQuery, setSearchQuery] = useState(() => searchParams.get('search') || '')

  // Filter sections toggle state
  const [countryOpen, setCountryOpen] = useState(true)
  const [typeOpen, setTypeOpen] = useState(true)

  // Date Popover Filter states
  const [dateFilterOpen, setDateFilterOpen] = useState(false)
  const [dateMode, setDateMode] = useState<'quick' | 'custom'>('quick')
  const [selectedYear, setSelectedYear] = useState('')
  const [selectedMonth, setSelectedMonth] = useState('')
  const [specificDate, setSpecificDate] = useState('')
  const [customStartDate, setCustomStartDate] = useState('')
  const [customEndDate, setCustomEndDate] = useState('')

  // Mobile filters panel toggle state
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false)

  // Selected filters derived from current query parameters
  const selectedCountries = searchParams.get('country')?.split(',').filter(Boolean) || []
  const selectedTypes = searchParams.get('productType')?.split(',').filter(Boolean) || []
  const startDateParam = searchParams.get('startDate') || ''
  const endDateParam = searchParams.get('endDate') || ''
  const legacyDateRangeParam = searchParams.get('dateRange') || ''

  const isDateFilterActive = Boolean(startDateParam || endDateParam || legacyDateRangeParam)

  const [selectedResource, setSelectedResource] = useState<ResourceItem | null>(null)
  const [expandedId, setExpandedId] = useState<string | null>(null)

  const handleToggleExpand = useCallback((id: string) => {
    setExpandedId((prev) => (prev === id ? null : id))
  }, [])

  const [modalVideo, setModalVideo] = useState<{ url: string; title: string } | null>(null)

  const searchRef = useRef<HTMLInputElement>(null)
  const listTopRef = useRef<HTMLDivElement>(null)
  const dateFilterRef = useRef<HTMLDivElement>(null)

  const hasFilters =
    selectedCountries.length > 0 ||
    selectedTypes.length > 0 ||
    isDateFilterActive ||
    searchQuery.length > 0

  const totalPages = Math.max(1, Math.ceil(totalCount / pageSize))

  // Sync date inputs from URL parameters
  useEffect(() => {
    if (startDateParam) {
      const datePart = startDateParam.split('T')[0]
      setCustomStartDate(datePart)
    } else {
      setCustomStartDate('')
    }
    if (endDateParam) {
      const datePart = endDateParam.split('T')[0]
      setCustomEndDate(datePart)
    } else {
      setCustomEndDate('')
    }
  }, [startDateParam, endDateParam])

  // Handle click outside to close date popover
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dateFilterRef.current && !dateFilterRef.current.contains(event.target as Node)) {
        setDateFilterOpen(prev => {
          if (prev) playClickSound()
          return false
        })
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Handle escape key to close popover
  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setDateFilterOpen(prev => {
          if (prev) playClickSound()
          return false
        })
      }
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [])

  // Utility to push URL parameter updates inside transition
  const updateParams = useCallback(
    (newParams: Record<string, string | string[] | number | null>) => {
      startTransition(() => {
        const params = new URLSearchParams(searchParams.toString())
        for (const [key, val] of Object.entries(newParams)) {
          if (val === null || val === undefined || val === '' || (Array.isArray(val) && val.length === 0)) {
            params.delete(key)
          } else if (Array.isArray(val)) {
            params.set(key, val.join(','))
          } else {
            params.set(key, String(val))
          }
        }
        // Always reset to page 1 on filter/search change unless page is explicitly updated
        if (!newParams.hasOwnProperty('page')) {
          params.delete('page')
        }
        router.push(`${pathname}?${params.toString()}`, { scroll: false })
      })
    },
    [router, pathname, searchParams]
  )

  // Debounced search sync
  useEffect(() => {
    const timer = setTimeout(() => {
      const currentSearch = searchParams.get('search') || ''
      if (searchQuery !== currentSearch) {
        updateParams({ search: searchQuery })
      }
    }, 350)
    return () => clearTimeout(timer)
  }, [searchQuery, searchParams, updateParams])

  const toggleCountry = (c: string) => {
    playClickSound()
    const updated = selectedCountries.includes(c) ? selectedCountries.filter(x => x !== c) : [...selectedCountries, c]
    updateParams({ country: updated })
  }

  const toggleType = (t: string) => {
    playClickSound()
    const updated = selectedTypes.includes(t) ? selectedTypes.filter(x => x !== t) : [...selectedTypes, t]
    updateParams({ productType: updated })
  }

  const handleApplyDateFilter = () => {
    playClickSound()
    let start = ''
    let end = ''

    if (dateMode === 'quick') {
      if (specificDate) {
        start = `${specificDate}T00:00:00Z`
        end = `${specificDate}T23:59:59Z`
      } else if (selectedYear && selectedMonth) {
        const y = Number(selectedYear)
        const m = Number(selectedMonth)
        const lastDay = new Date(y, m, 0).getDate()
        const mStr = String(m).padStart(2, '0')
        start = `${y}-${mStr}-01T00:00:00Z`
        end = `${y}-${mStr}-${String(lastDay).padStart(2, '0')}T23:59:59Z`
      } else if (selectedYear) {
        start = `${selectedYear}-01-01T00:00:00Z`
        end = `${selectedYear}-12-31T23:59:59Z`
      } else if (selectedMonth) {
        const currentYear = new Date().getFullYear()
        const m = Number(selectedMonth)
        const lastDay = new Date(currentYear, m, 0).getDate()
        const mStr = String(m).padStart(2, '0')
        start = `${currentYear}-${mStr}-01T00:00:00Z`
        end = `${currentYear}-${mStr}-${String(lastDay).padStart(2, '0')}T23:59:59Z`
      }
    } else {
      if (customStartDate) {
        start = `${customStartDate}T00:00:00Z`
      }
      if (customEndDate) {
        end = `${customEndDate}T23:59:59Z`
      }
    }

    updateParams({
      startDate: start || null,
      endDate: end || null,
      dateRange: null,
    })
    setDateFilterOpen(false)
  }

  const handleClearDateFilter = () => {
    playClickSound()
    setSelectedYear('')
    setSelectedMonth('')
    setSpecificDate('')
    setCustomStartDate('')
    setCustomEndDate('')
    updateParams({
      startDate: null,
      endDate: null,
      dateRange: null,
    })
    setDateFilterOpen(false)
  }

  const clearAll = () => {
    playClickSound()
    setSearchQuery('')
    setSelectedYear('')
    setSelectedMonth('')
    setSpecificDate('')
    setCustomStartDate('')
    setCustomEndDate('')
    startTransition(() => {
      router.push(pathname, { scroll: false })
    })
  }

  const goToPage = (page: number) => {
    updateParams({ page })
    listTopRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <>
      <div className="max-w-[1400px] mx-auto px-6 md:px-10">
        {/* ── Title ───────────────────────────────────────────────── */}
        <div className="mb-12 text-center">
          <h1 className="font-display text-[clamp(4rem,10vw,8rem)] font-black leading-none tracking-tighter text-foreground">
            Resources
          </h1>
        </div>

        {/* ── Grid Layout ────────────────────────────────────────── */}
        <div className="grid grid-cols-1 md:grid-cols-[280px_1fr] gap-10">
          {/* ── Filter Sidebar (Desktop) ── */}
          <aside className="hidden lg:block space-y-1 sticky top-28 self-start max-h-[calc(100vh-8rem)] overflow-y-auto pr-2">
            <div className="flex items-center justify-between mb-5">
              <span className="text-[11px] font-mono font-bold text-foreground tracking-widest">FILTER</span>
              {hasFilters && (
                <button
                  onClick={clearAll}
                  className="text-[11px] font-mono text-accent tracking-widest hover:underline"
                >
                  CLEAR FILTERS
                </button>
              )}
            </div>

            <div className="grid grid-cols-2 gap-x-6">
              {/* Left Column: Product Type */}
              <div>
                {/* Product Type section */}
                <div>
                  <button
                    onClick={() => {
                      playClickSound()
                      setTypeOpen(o => !o)
                    }}
                    className="flex items-center gap-1.5 mb-3 w-full group"
                  >
                    {typeOpen
                      ? <FolderOpen className="w-3.5 h-3.5 text-accent" />
                      : <Folder className="w-3.5 h-3.5 text-foreground" />}
                    <span className="text-[12px] font-mono font-bold text-foreground tracking-wide group-hover:text-accent transition-colors">
                      Product Type
                    </span>
                    {selectedTypes.length > 0 && (
                      <span className="ml-auto text-[10px] font-mono text-accent opacity-70">
                        {selectedTypes.length}
                      </span>
                    )}
                  </button>
                  <AnimatePresence initial={false}>
                    {typeOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.22, ease: [0.4, 0, 0.2, 1] }}
                        className="overflow-hidden"
                      >
                        <div className="space-y-0.5 pb-2">
                          {PRODUCT_TYPES.map(t => (
                            <FilterCheckbox
                              key={t}
                              label={t}
                              checked={selectedTypes.includes(t)}
                              onChange={() => toggleType(t)}
                            />
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>

              {/* Right Column: Countries */}
              <div>
                {/* Countries section */}
                <div>
                  <button
                    onClick={() => {
                      playClickSound()
                      setCountryOpen(o => !o)
                    }}
                    className="flex items-center gap-1.5 mb-3 w-full group"
                  >
                    {countryOpen
                      ? <FolderOpen className="w-3.5 h-3.5 text-accent" />
                      : <Folder className="w-3.5 h-3.5 text-foreground" />}
                    <span className="text-[12px] font-mono font-bold text-foreground tracking-wide group-hover:text-accent transition-colors">
                      Countries
                    </span>
                    {selectedCountries.length > 0 && (
                      <span className="ml-auto text-[10px] font-mono text-accent opacity-70">
                        {selectedCountries.length}
                      </span>
                    )}
                  </button>
                  <AnimatePresence initial={false}>
                    {countryOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.22, ease: [0.4, 0, 0.2, 1] }}
                        className="overflow-hidden"
                      >
                        <div className="space-y-0.5 pb-2">
                          {COUNTRIES.map(c => (
                            <FilterCheckbox
                              key={c.id}
                              label={c.name}
                              checked={selectedCountries.includes(c.id)}
                              onChange={() => toggleCountry(c.id)}
                            />
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </div>
          </aside>

          {/* ── Main Content Column ── */}
          <div ref={listTopRef} className="space-y-3">
            {/* Control Bar: Search & Mobile Filters (visible on mobile/tablet) */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 lg:hidden">
              {/* Search Bar — visible on mobile/tablet only */}
              <div className="relative flex-1 w-full">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  ref={searchRef}
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  placeholder="Search by title..."
                  className="w-full bg-secondary/30 border border-border/50 rounded-lg pl-9 pr-9 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:border-accent transition-colors"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    aria-label="Clear search"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              {/* Mobile Filters Toggle Button */}
              <button
                onClick={() => {
                  playClickSound()
                  setMobileFiltersOpen(o => !o)
                }}
                className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-3 py-2 border border-border/50 rounded-md bg-secondary/30 text-xs font-medium hover:border-accent hover:text-accent transition-colors"
              >
                <SlidersHorizontal className="w-3.5 h-3.5" />
                Filters
                {selectedCountries.length + selectedTypes.length + (isDateFilterActive ? 1 : 0) > 0 && (
                  <span className="ml-1 text-[10px] font-mono text-accent font-bold">
                    ({selectedCountries.length + selectedTypes.length + (isDateFilterActive ? 1 : 0)})
                  </span>
                )}
              </button>
            </div>

            {/* Mobile Filters Panel (Collapsible) */}
            <AnimatePresence>
              {mobileFiltersOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="lg:hidden border border-border/40 bg-secondary/15 rounded-lg p-4 grid grid-cols-1 sm:grid-cols-2 gap-4 overflow-hidden"
                >
                  <div className="space-y-1">
                    <p className="text-[11px] font-mono font-bold text-foreground/80 tracking-wider uppercase mb-1">Countries</p>
                    {COUNTRIES.map(c => (
                      <FilterCheckbox
                        key={c.id}
                        label={c.name}
                        checked={selectedCountries.includes(c.id)}
                        onChange={() => toggleCountry(c.id)}
                      />
                    ))}
                  </div>

                  <div className="space-y-1">
                    <p className="text-[11px] font-mono font-bold text-foreground/80 tracking-wider uppercase mb-1">Product Type</p>
                    {PRODUCT_TYPES.map(t => (
                      <FilterCheckbox
                        key={t}
                        label={t}
                        checked={selectedTypes.includes(t)}
                        onChange={() => toggleType(t)}
                      />
                    ))}
                  </div>

                  {hasFilters && (
                    <button
                      onClick={clearAll}
                      className="sm:col-span-2 w-full mt-2 py-2 border border-dashed border-border text-[12px] font-mono hover:text-accent hover:border-accent transition-colors"
                    >
                      CLEAR ALL FILTERS
                    </button>
                  )}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Error Message Display */}
            {errorMessage ? (
              <div className="border border-red-500/20 bg-red-500/10 rounded-lg p-6 text-center text-sm space-y-2">
                <p className="font-semibold text-red-400">Unable to load resources</p>
                <p className="text-muted-foreground">{errorMessage}</p>
                <button
                  onClick={clearAll}
                  className="mt-2 text-accent hover:underline text-xs font-mono"
                >
                  RESET VIEW
                </button>
              </div>
            ) : (
              <>
                {/* Desktop List View Header */}
                <div className="hidden lg:block px-2 pb-2 border-b-2 border-foreground/20">
                  <div className="grid grid-cols-[110px_1fr_140px_70px_36px] gap-4 items-center">
                    {/* DATE Column with Filter Popover */}
                    <div ref={dateFilterRef} className="relative flex items-center gap-1.5">
                      <span className="text-[11px] font-mono font-bold text-foreground tracking-widest uppercase select-none">
                        DATE
                      </span>
                      <button
                        type="button"
                        onClick={() => {
                          playClickSound()
                          setDateFilterOpen(o => !o)
                        }}
                        className={`p-1 rounded flex items-center justify-center hover:bg-secondary/60 transition-colors focus:outline-none ${
                          isDateFilterActive ? 'text-accent bg-accent/15' : 'text-muted-foreground hover:text-foreground'
                        }`}
                        title="Filter by Date"
                        aria-label="Filter by Date"
                      >
                        <StrawberryMenuIcon className="w-3.5 h-3.5" />
                      </button>

                      {/* Date Filter Popover */}
                      <AnimatePresence>
                        {dateFilterOpen && (
                          <motion.div
                            initial={{ opacity: 0, y: 4, scale: 0.98 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 4, scale: 0.98 }}
                            transition={{ duration: 0.15 }}
                            className="absolute left-0 top-full mt-2 w-[280px] bg-background border border-border/80 rounded-lg shadow-xl z-50 p-4 space-y-3.5 font-sans text-xs text-foreground"
                          >
                            <div className="flex items-center justify-between pb-2 border-b border-border/40">
                              <span className="font-mono text-[12px] font-bold text-foreground uppercase tracking-wider">Date Filter</span>
                              {isDateFilterActive && (
                                <button
                                  type="button"
                                  onClick={handleClearDateFilter}
                                  className="text-[11px] font-mono text-accent hover:underline"
                                >
                                  Clear
                                </button>
                              )}
                            </div>

                            {/* Filter Mode Tabs */}
                            <div className="flex bg-secondary/40 p-0.5 rounded border border-border/40 font-mono text-[11px]">
                              <button
                                type="button"
                                onClick={() => {
                                  playClickSound()
                                  setDateMode('quick')
                                }}
                                className={`flex-1 py-1 text-center rounded transition-colors ${
                                  dateMode === 'quick' ? 'bg-background font-bold text-accent shadow-xs' : 'text-muted-foreground hover:text-foreground'
                                }`}
                              >
                                Quick Filters
                              </button>
                              <button
                                type="button"
                                onClick={() => {
                                  playClickSound()
                                  setDateMode('custom')
                                }}
                                className={`flex-1 py-1 text-center rounded transition-colors ${
                                  dateMode === 'custom' ? 'bg-background font-bold text-accent shadow-xs' : 'text-muted-foreground hover:text-foreground'
                                }`}
                              >
                                Custom Range
                              </button>
                            </div>

                            {dateMode === 'quick' ? (
                              <div className="space-y-2.5">
                                {/* Quick Filter: Year */}
                                <div className="space-y-1">
                                  <label className="text-[11px] font-mono font-semibold text-muted-foreground">Year</label>
                                  <select
                                    value={selectedYear}
                                    onChange={(e) => {
                                      playClickSound()
                                      setSelectedYear(e.target.value)
                                      setSelectedMonth('')
                                      setSpecificDate('')
                                    }}
                                    className="w-full bg-secondary/30 border border-border/60 rounded px-2 py-1.5 text-xs text-foreground focus:outline-none focus:border-accent font-mono"
                                  >
                                    <option value="">All Years</option>
                                    <option value="2026">2026</option>
                                    <option value="2025">2025</option>
                                    <option value="2024">2024</option>
                                    <option value="2023">2023</option>
                                  </select>
                                </div>

                                {/* Quick Filter: Month */}
                                <div className="space-y-1">
                                  <label className="text-[11px] font-mono font-semibold text-muted-foreground">Month</label>
                                  <select
                                    value={selectedMonth}
                                    onChange={(e) => {
                                      playClickSound()
                                      setSelectedMonth(e.target.value)
                                      setSpecificDate('')
                                    }}
                                    className="w-full bg-secondary/30 border border-border/60 rounded px-2 py-1.5 text-xs text-foreground focus:outline-none focus:border-accent font-mono"
                                  >
                                    <option value="">All Months</option>
                                    <option value="01">January</option>
                                    <option value="02">February</option>
                                    <option value="03">March</option>
                                    <option value="04">April</option>
                                    <option value="05">May</option>
                                    <option value="06">June</option>
                                    <option value="07">July</option>
                                    <option value="08">August</option>
                                    <option value="09">September</option>
                                    <option value="10">October</option>
                                    <option value="11">November</option>
                                    <option value="12">December</option>
                                  </select>
                                </div>

                                {/* Quick Filter: Specific Day */}
                                <div className="space-y-1">
                                  <label className="text-[11px] font-mono font-semibold text-muted-foreground">Specific Date</label>
                                  <input
                                    type="date"
                                    value={specificDate}
                                    onChange={(e) => {
                                      playClickSound()
                                      setSpecificDate(e.target.value)
                                      if (e.target.value) {
                                        const [y, m] = e.target.value.split('-')
                                        setSelectedYear(y)
                                        setSelectedMonth(m)
                                      }
                                    }}
                                    className="w-full bg-secondary/30 border border-border/60 rounded px-2 py-1 text-xs text-foreground focus:outline-none focus:border-accent font-mono"
                                  />
                                </div>
                              </div>
                            ) : (
                              <div className="space-y-2.5">
                                {/* Custom Date Range: Start Date */}
                                <div className="space-y-1">
                                  <label className="text-[11px] font-mono font-semibold text-muted-foreground">Start Date</label>
                                  <input
                                    type="date"
                                    value={customStartDate}
                                    onChange={(e) => {
                                      playClickSound()
                                      setCustomStartDate(e.target.value)
                                    }}
                                    className="w-full bg-secondary/30 border border-border/60 rounded px-2 py-1 text-xs text-foreground focus:outline-none focus:border-accent font-mono"
                                  />
                                </div>

                                {/* Custom Date Range: End Date */}
                                <div className="space-y-1">
                                  <label className="text-[11px] font-mono font-semibold text-muted-foreground">End Date</label>
                                  <input
                                    type="date"
                                    value={customEndDate}
                                    onChange={(e) => {
                                      playClickSound()
                                      setCustomEndDate(e.target.value)
                                    }}
                                    className="w-full bg-secondary/30 border border-border/60 rounded px-2 py-1 text-xs text-foreground focus:outline-none focus:border-accent font-mono"
                                  />
                                </div>
                              </div>
                            )}

                            {/* Action Buttons */}
                            <div className="flex items-center gap-2 pt-2 border-t border-border/40">
                              <button
                                type="button"
                                onClick={handleApplyDateFilter}
                                className="flex-1 bg-accent text-background font-mono font-bold py-1.5 px-3 rounded text-xs hover:opacity-90 transition-opacity"
                              >
                                Apply Filter
                              </button>
                              <button
                                type="button"
                                onClick={handleClearDateFilter}
                                className="border border-border hover:border-accent font-mono text-xs py-1.5 px-3 rounded text-muted-foreground hover:text-foreground transition-colors"
                              >
                                Reset
                              </button>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>

                    <span className="text-[11px] font-mono font-bold text-foreground tracking-widest uppercase">Name</span>
                    <span className="text-[11px] font-mono font-bold text-foreground tracking-widest uppercase">AGENCY</span>
                    <span className="text-[11px] font-mono font-bold text-foreground tracking-widest uppercase">TYPE</span>
                    <span className="text-[11px] font-mono text-muted-foreground/60 text-right whitespace-nowrap">
                      {totalCount}
                    </span>
                  </div>
                </div>

                {/* Loading skeleton / transition overlay state */}
                {isPending ? (
                  <div className="space-y-4">
                    {Array.from({ length: 6 }).map((_, idx) => (
                      <div key={idx} className="border-b border-border/30 py-4 animate-pulse px-3">
                        <div className="grid grid-cols-[110px_1fr_140px_70px_36px] items-center gap-4">
                          <div className="h-4 bg-secondary/50 rounded w-20" />
                          <div className="space-y-2">
                            <div className="h-5 bg-secondary/50 rounded w-3/4" />
                          </div>
                          <div className="h-4 bg-secondary/50 rounded w-20" />
                          <div className="h-5 bg-secondary/50 rounded w-12" />
                          <div className="h-4 bg-secondary/50 rounded w-4 justify-self-end" />
                        </div>
                      </div>
                    ))}
                  </div>
                ) : initialResources.length > 0 ? (
                  <>
                    {/* Desktop Resource List */}
                    <div className="hidden lg:block">
                      <AnimatePresence mode="popLayout">
                        {initialResources.map((r, i) => {
                          const resourceId = (r.sys as any)?.id || r.sourceUrl || `${currentPage}-${i}`
                          return (
                            <ResourceRow
                              key={resourceId}
                              resource={r}
                              index={i}
                              isExpanded={expandedId === resourceId}
                              onToggle={() => handleToggleExpand(resourceId)}
                            />
                          )
                        })}
                      </AnimatePresence>
                    </div>

                    {/* Mobile Resource List */}
                    <div className="lg:hidden space-y-1">
                      <AnimatePresence mode="popLayout">
                        {initialResources.map((r, i) => {
                          const resourceId = (r.sys as any)?.id || r.sourceUrl || `${currentPage}-${i}`
                          return (
                            <MobileResourceItem
                              key={resourceId}
                              resource={r}
                              index={i}
                              isExpanded={expandedId === resourceId}
                              onToggle={() => handleToggleExpand(resourceId)}
                            />
                          )
                        })}
                      </AnimatePresence>
                    </div>
                  </>
                ) : (
                  /* Empty state overlay */
                  <div className="py-16 text-center border border-dashed border-border/50 rounded-lg bg-secondary/10">
                    <p className="text-muted-foreground font-mono text-sm">No resources match your active search or filters.</p>
                    <button
                      onClick={clearAll}
                      className="mt-4 px-4 py-2 border border-border hover:border-accent hover:text-accent font-mono text-xs transition-colors"
                    >
                      Clear All Filters
                    </button>
                  </div>
                )}

                {/* Pagination controls */}
                {totalPages > 1 && !isPending && (
                  <div className="flex items-center justify-between mt-6 pt-4 border-t border-border/30">
                    <button
                      onClick={() => goToPage(currentPage - 1)}
                      disabled={currentPage === 1}
                      className="flex items-center gap-1.5 px-3 py-1.5 text-[12px] font-mono border border-border hover:border-accent hover:text-accent disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                    >
                      <ChevronLeft className="w-3.5 h-3.5" />
                      Prev
                    </button>

                    <div className="flex items-center gap-1">
                      {Array.from({ length: totalPages }, (_, i) => i + 1)
                        .filter(p => p === 1 || p === totalPages || Math.abs(p - currentPage) <= 1)
                        .reduce<(number | '...')[]>((acc, p, idx, arr) => {
                          if (idx > 0 && p - (arr[idx - 1] as number) > 1) acc.push('...')
                          acc.push(p)
                          return acc
                        }, [])
                        .map((p, i) =>
                          p === '...' ? (
                            <span key={`ellipsis-${i}`} className="px-1 text-[12px] font-mono text-muted-foreground">…</span>
                          ) : (
                            <button
                              key={p}
                              onClick={() => goToPage(p as number)}
                              className={`w-7 h-7 text-[12px] font-mono transition-colors ${
                                currentPage === p
                                  ? 'bg-accent text-background font-bold'
                                  : 'border border-border hover:border-accent hover:text-accent'
                              }`}
                            >
                              {p}
                            </button>
                          )
                        )}
                    </div>

                    <button
                      onClick={() => goToPage(currentPage + 1)}
                      disabled={currentPage === totalPages}
                      className="flex items-center gap-1.5 px-3 py-1.5 text-[12px] font-mono border border-border hover:border-accent hover:text-accent disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                    >
                      Next
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      <VideoModal
        isOpen={!!modalVideo}
        onClose={() => setModalVideo(null)}
        videoUrl={modalVideo?.url || ''}
        title={modalVideo?.title || ''}
      />

      <ResourceModal
        resource={selectedResource}
        onClose={() => setSelectedResource(null)}
      />
    </>
  )
}
