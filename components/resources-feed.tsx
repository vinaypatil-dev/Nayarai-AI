// [ignoring loop detection]
'use client'

import React, { useState, useRef, useEffect, useCallback, useTransition } from 'react'
import { useRouter, usePathname, useSearchParams } from 'next/navigation'
import { AnimatePresence, motion } from 'framer-motion'
import { Search, X, Folder, FolderOpen, Play, ExternalLink, ChevronLeft, ChevronRight, SlidersHorizontal, ChevronDown, Download } from 'lucide-react'
import { ResourceItem } from '@/lib/types/contentful'
import { VideoModal } from '@/components/video-modal'
import { ResourceModal } from '@/components/resource-modal'
import {
  AGENCIES,
  COUNTRIES,
  PRODUCT_TYPES,
  RESOURCE_TYPES,
  DATE_RANGES,
  getAgencyFromResource,
} from '@/lib/agency-utils'

// ─── Helpers ─────────────────────────────────────────────────────────────────

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
    <label className="flex items-center gap-2 cursor-pointer group py-[3px] select-none">
      <span
        onClick={onChange}
        className={`w-3.5 h-3.5 border flex-shrink-0 flex items-center justify-center transition-colors ${
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
        className="text-[13px] text-muted-foreground group-hover:text-foreground transition-colors leading-none"
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

  const metadataItems: Array<{ label: string; value: string }> = []
  if (formattedDate) metadataItems.push({ label: 'Date', value: formattedDate })
  if (resource.productType) metadataItems.push({ label: 'Product Type', value: resource.productType })
  if (resource.country) metadataItems.push({ label: 'Country', value: resource.country })

  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ delay: index * 0.015, duration: 0.18 }}
      className="border-b border-border/30 group"
    >
      <div
        className={`grid grid-cols-[110px_1fr_140px_140px_70px_36px] items-center gap-4 py-3 cursor-pointer transition-colors px-2 ${
          isExpanded ? 'bg-secondary/40' : 'hover:bg-secondary/30'
        }`}
        onClick={onToggle}
      >
        <span className="font-mono text-[12px] text-muted-foreground select-none">
          {formattedDate}
        </span>
        <div className="space-y-0.5 pr-4 min-w-0">
          <h3 className="text-[14px] font-bold text-foreground leading-snug truncate group-hover:text-accent transition-colors">
            {resource.title}
          </h3>
          <p className="text-[12px] text-muted-foreground/80 line-clamp-1">
            {resource.shortDescription || 'No description available.'}
          </p>
        </div>
        <div className="flex flex-col min-w-0">
          <span className="text-[13px] font-bold text-foreground">{derivedAgency}</span>
          <span className="text-[11px] text-muted-foreground truncate">{resource.country}</span>
        </div>
        <span className="text-[12px] text-muted-foreground truncate">
          {resource.productType}
        </span>
        <div className="flex items-center">
          <TypeBadge type={resource.resourceType} />
        </div>
        <div className="flex items-center justify-end">
          <ChevronDown
            className={`w-4 h-4 text-muted-foreground transition-transform duration-250 ${
              isExpanded ? 'rotate-180 text-accent' : 'group-hover:text-foreground'
            }`}
          />
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
              {/* Left Side: Compact Metadata Line with Field Labels */}
              <div className="flex items-center gap-2 text-muted-foreground font-mono truncate text-[12px] flex-wrap">
                {metadataItems.map((item, idx) => (
                  <React.Fragment key={item.label}>
                    {idx > 0 && <span className="opacity-40 select-none">·</span>}
                    <span>
                      <span className="text-muted-foreground/70">{item.label}: </span>
                      <span className="text-foreground/90 font-medium">{item.value}</span>
                    </span>
                  </React.Fragment>
                ))}
              </div>

              {/* Right Side: Consistent Action Buttons (Download & Source) */}
              <div className="flex items-center gap-2 flex-shrink-0">
                {downloadUrl && (
                  <a
                    href={downloadUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    download
                    onClick={(e) => e.stopPropagation()}
                    className="group/btn flex items-center gap-1.5 px-3 py-1.5 font-mono text-[11px] border border-border/70 bg-background/80 text-foreground/90 hover:border-accent hover:text-accent hover:bg-secondary/50 transition-colors rounded-sm"
                  >
                    <Download className="w-3.5 h-3.5 text-muted-foreground group-hover/btn:text-accent transition-colors" />
                    Download
                  </a>
                )}
                {sourceUrl && (
                  <a
                    href={sourceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="group/btn flex items-center gap-1.5 px-3 py-1.5 font-mono text-[11px] border border-border/70 bg-background/80 text-foreground/90 hover:border-accent hover:text-accent hover:bg-secondary/50 transition-colors rounded-sm"
                  >
                    <ExternalLink className="w-3.5 h-3.5 text-muted-foreground group-hover/btn:text-accent transition-colors" />
                    Source
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

  const metadataItems: Array<{ label: string; value: string }> = []
  if (formattedDate) metadataItems.push({ label: 'Date', value: formattedDate })
  if (resource.productType) metadataItems.push({ label: 'Product Type', value: resource.productType })
  if (resource.country) metadataItems.push({ label: 'Country', value: resource.country })

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
            <span className="font-mono text-[11px] text-muted-foreground">{formattedDate}</span>
            <span className="text-[10px] font-mono font-bold bg-secondary/50 text-foreground px-1.5 py-0.5 rounded">{derivedAgency}</span>
            <TypeBadge type={resource.resourceType} />
          </div>
          <h3 className="text-[15px] font-semibold leading-snug group-hover:text-accent transition-colors line-clamp-2">{resource.title}</h3>
          <p className="text-[12px] text-muted-foreground line-clamp-1">{resource.shortDescription}</p>
        </div>
        <div className="flex-shrink-0 p-1.5 text-muted-foreground group-hover:text-accent transition-colors mt-0.5">
          <ChevronDown
            className={`w-4 h-4 transition-transform duration-250 ${
              isExpanded ? 'rotate-180 text-accent' : ''
            }`}
          />
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
            {/* Compact Metadata Line with Field Labels */}
            <div className="flex items-center gap-1.5 text-muted-foreground font-mono text-[11px] flex-wrap">
              {metadataItems.map((item, idx) => (
                <React.Fragment key={item.label}>
                  {idx > 0 && <span className="opacity-40 select-none">·</span>}
                  <span>
                    <span className="text-muted-foreground/70">{item.label}: </span>
                    <span className="text-foreground/90 font-medium">{item.value}</span>
                  </span>
                </React.Fragment>
              ))}
            </div>

            {/* Consistent Action Buttons */}
            <div className="flex items-center gap-2">
              {downloadUrl && (
                <a
                  href={downloadUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  download
                  onClick={(e) => e.stopPropagation()}
                  className="group/btn flex-1 flex items-center justify-center gap-1.5 px-3 py-2 font-mono text-[11px] border border-border/70 bg-background/80 text-foreground/90 hover:border-accent hover:text-accent hover:bg-secondary/50 transition-colors rounded-sm"
                >
                  <Download className="w-3.5 h-3.5 text-muted-foreground group-hover/btn:text-accent transition-colors" />
                  Download
                </a>
              )}
              {sourceUrl && (
                <a
                  href={sourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="group/btn flex-1 flex items-center justify-center gap-1.5 px-3 py-2 font-mono text-[11px] border border-border/70 bg-background/80 text-foreground/90 hover:border-accent hover:text-accent hover:bg-secondary/50 transition-colors rounded-sm"
                >
                  <ExternalLink className="w-3.5 h-3.5 text-muted-foreground group-hover/btn:text-accent transition-colors" />
                  Source
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
  const [agencyOpen, setAgencyOpen] = useState(true)
  const [countryOpen, setCountryOpen] = useState(true)
  const [typeOpen, setTypeOpen] = useState(true)
  const [resourceTypeOpen, setResourceTypeOpen] = useState(true)
  const [dateOpen, setDateOpen] = useState(true)

  // Mobile filters panel toggle state
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false)

  // Selected filters derived from current query parameters
  const selectedAgencies = searchParams.get('agency')?.split(',').filter(Boolean) || []
  const selectedCountries = searchParams.get('country')?.split(',').filter(Boolean) || []
  const selectedTypes = searchParams.get('productType')?.split(',').filter(Boolean) || []
  const selectedResourceTypes = searchParams.get('resourceType')?.split(',').filter(Boolean) || []
  const selectedDateRanges = searchParams.get('dateRange')?.split(',').filter(Boolean) || []
  const currentSort = searchParams.get('sort') || 'newest'

  const [selectedResource, setSelectedResource] = useState<ResourceItem | null>(null)
  const [expandedId, setExpandedId] = useState<string | null>(null)

  const handleToggleExpand = useCallback((id: string) => {
    setExpandedId((prev) => (prev === id ? null : id))
  }, [])

  const [modalVideo, setModalVideo] = useState<{ url: string; title: string } | null>(null)
  const [sortOpen, setSortOpen] = useState(false)

  const searchRef = useRef<HTMLInputElement>(null)
  const listTopRef = useRef<HTMLDivElement>(null)
  const sortDropdownRef = useRef<HTMLDivElement>(null)

  const hasFilters =
    selectedAgencies.length > 0 ||
    selectedCountries.length > 0 ||
    selectedTypes.length > 0 ||
    selectedResourceTypes.length > 0 ||
    selectedDateRanges.length > 0 ||
    searchQuery.length > 0

  const totalPages = Math.max(1, Math.ceil(totalCount / pageSize))

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

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (sortDropdownRef.current && !sortDropdownRef.current.contains(event.target as Node)) {
        setSortOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const toggleAgency = (a: string) => {
    const updated = selectedAgencies.includes(a) ? selectedAgencies.filter(x => x !== a) : [...selectedAgencies, a]
    updateParams({ agency: updated })
  }

  const toggleCountry = (c: string) => {
    const updated = selectedCountries.includes(c) ? selectedCountries.filter(x => x !== c) : [...selectedCountries, c]
    updateParams({ country: updated })
  }

  const toggleType = (t: string) => {
    const updated = selectedTypes.includes(t) ? selectedTypes.filter(x => x !== t) : [...selectedTypes, t]
    updateParams({ productType: updated })
  }

  const toggleResourceType = (rt: string) => {
    const updated = selectedResourceTypes.includes(rt) ? selectedResourceTypes.filter(x => x !== rt) : [...selectedResourceTypes, rt]
    updateParams({ resourceType: updated })
  }

  const toggleDateRange = (d: string) => {
    const updated = selectedDateRanges.includes(d) ? selectedDateRanges.filter(x => x !== d) : [...selectedDateRanges, d]
    updateParams({ dateRange: updated })
  }

  const clearAll = () => {
    setSearchQuery('')
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
              {/* Left Column: Agencies, Product Type */}
              <div>
                {/* Agencies section */}
                <div className="mb-6">
                  <button
                    onClick={() => setAgencyOpen(o => !o)}
                    className="flex items-center gap-1.5 mb-3 w-full group"
                  >
                    {agencyOpen
                      ? <FolderOpen className="w-3.5 h-3.5 text-accent" />
                      : <Folder className="w-3.5 h-3.5 text-foreground" />}
                    <span className="text-[12px] font-mono font-bold text-foreground tracking-wide group-hover:text-accent transition-colors">
                      Agencies
                    </span>
                    {selectedAgencies.length > 0 && (
                      <span className="ml-auto text-[10px] font-mono text-accent opacity-70">
                        {selectedAgencies.length}
                      </span>
                    )}
                  </button>
                  <AnimatePresence initial={false}>
                    {agencyOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.22, ease: [0.4, 0, 0.2, 1] }}
                        className="overflow-hidden"
                      >
                        <div className="space-y-0.5 pb-2">
                          {AGENCIES.map(a => (
                            <FilterCheckbox
                              key={a.id}
                              label={a.name}
                              checked={selectedAgencies.includes(a.id)}
                              onChange={() => toggleAgency(a.id)}
                            />
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Product Type section */}
                <div>
                  <button
                    onClick={() => setTypeOpen(o => !o)}
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

              {/* Right Column: Countries, Resource Type */}
              <div>
                {/* Countries section */}
                <div className="mb-6">
                  <button
                    onClick={() => setCountryOpen(o => !o)}
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

                {/* Resource Type section */}
                <div className="mb-6">
                  <button
                    onClick={() => setResourceTypeOpen(o => !o)}
                    className="flex items-center gap-1.5 mb-3 w-full group"
                  >
                    {resourceTypeOpen
                      ? <FolderOpen className="w-3.5 h-3.5 text-accent" />
                      : <Folder className="w-3.5 h-3.5 text-foreground" />}
                    <span className="text-[12px] font-mono font-bold text-foreground tracking-wide group-hover:text-accent transition-colors">
                      Resource Type
                    </span>
                    {selectedResourceTypes.length > 0 && (
                      <span className="ml-auto text-[10px] font-mono text-accent opacity-70">
                        {selectedResourceTypes.length}
                      </span>
                    )}
                  </button>
                  <AnimatePresence initial={false}>
                    {resourceTypeOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.22, ease: [0.4, 0, 0.2, 1] }}
                        className="overflow-hidden"
                      >
                        <div className="space-y-0.5 pb-2">
                          {RESOURCE_TYPES.map(rt => (
                            <FilterCheckbox
                              key={rt}
                              label={rt}
                              checked={selectedResourceTypes.includes(rt)}
                              onChange={() => toggleResourceType(rt)}
                            />
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Date / Year section */}
                <div>
                  <button
                    onClick={() => setDateOpen(o => !o)}
                    className="flex items-center gap-1.5 mb-3 w-full group"
                  >
                    {dateOpen
                      ? <FolderOpen className="w-3.5 h-3.5 text-accent" />
                      : <Folder className="w-3.5 h-3.5 text-foreground" />}
                    <span className="text-[12px] font-mono font-bold text-foreground tracking-wide group-hover:text-accent transition-colors">
                      Published Date
                    </span>
                    {selectedDateRanges.length > 0 && (
                      <span className="ml-auto text-[10px] font-mono text-accent opacity-70">
                        {selectedDateRanges.length}
                      </span>
                    )}
                  </button>
                  <AnimatePresence initial={false}>
                    {dateOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.22, ease: [0.4, 0, 0.2, 1] }}
                        className="overflow-hidden"
                      >
                        <div className="space-y-0.5 pb-2">
                          {DATE_RANGES.map(d => (
                            <FilterCheckbox
                              key={d.id}
                              label={d.name}
                              checked={selectedDateRanges.includes(d.id)}
                              onChange={() => toggleDateRange(d.id)}
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
            {/* Control Bar: Search (mobile/tablet) + Filters + Sort */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
              {/* Search Bar — visible on mobile/tablet only */}
              <div className="relative flex-1 w-full lg:hidden">
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

              <div className="flex items-center gap-2 w-full lg:w-auto lg:ml-auto">
                {/* Mobile Filters Toggle Button */}
                <button
                  onClick={() => setMobileFiltersOpen(o => !o)}
                  className="lg:hidden flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-3 py-2 border border-border/50 rounded-md bg-secondary/30 text-xs font-medium hover:border-accent hover:text-accent transition-colors"
                >
                  <SlidersHorizontal className="w-3.5 h-3.5" />
                  Filters
                  {selectedAgencies.length + selectedCountries.length + selectedTypes.length + selectedResourceTypes.length + selectedDateRanges.length > 0 && (
                    <span className="ml-1 text-[10px] font-mono text-accent font-bold">
                      ({selectedAgencies.length + selectedCountries.length + selectedTypes.length + selectedResourceTypes.length + selectedDateRanges.length})
                    </span>
                  )}
                </button>

                {/* Sort Selector */}
                <div ref={sortDropdownRef} className="relative flex-1 sm:flex-none">
                  <button
                    type="button"
                    onClick={() => setSortOpen(o => !o)}
                    className="w-full sm:w-[150px] bg-secondary/40 border border-border/50 rounded-md px-3 py-2 text-sm text-foreground flex items-center justify-between gap-2 hover:border-accent/70 transition-colors focus:outline-none focus:border-accent"
                  >
                    <span className="truncate">
                      {currentSort === 'oldest'
                        ? 'Oldest First'
                        : currentSort === 'alphabetical'
                        ? 'Title (A-Z)'
                        : currentSort === 'alphabetical-desc'
                        ? 'Title (Z-A)'
                        : 'Newest First'}
                    </span>
                    <ChevronDown className={`w-4 h-4 text-muted-foreground transition-transform duration-200 ${sortOpen ? 'rotate-180' : ''}`} />
                  </button>

                  <AnimatePresence>
                    {sortOpen && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: -4 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: -4 }}
                        transition={{ duration: 0.15, ease: 'easeOut' }}
                        className="absolute right-0 mt-2 w-[160px] bg-background border border-border/50 rounded-lg shadow-lg z-50 overflow-hidden py-1"
                      >
                        {[
                          { value: 'newest', label: 'Newest First' },
                          { value: 'oldest', label: 'Oldest First' },
                          { value: 'alphabetical', label: 'Title (A-Z)' },
                          { value: 'alphabetical-desc', label: 'Title (Z-A)' },
                        ].map(opt => {
                          const isSelected = opt.value === currentSort
                          return (
                            <button
                              key={opt.value}
                              type="button"
                              onClick={() => {
                                updateParams({ sort: opt.value })
                                setSortOpen(false)
                              }}
                              className={`w-full px-4 py-2 text-left text-sm transition-colors ${
                                isSelected
                                  ? 'text-accent font-semibold bg-secondary/30'
                                  : 'text-muted-foreground hover:text-foreground hover:bg-secondary/40'
                              }`}
                            >
                              {opt.label}
                            </button>
                          )
                        })}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </div>

            {/* Mobile Filters Panel (Collapsible) */}
            <AnimatePresence>
              {mobileFiltersOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="lg:hidden border border-border/40 bg-secondary/15 rounded-lg p-4 grid grid-cols-2 gap-4 overflow-hidden"
                >
                  <div className="space-y-1">
                    <p className="text-[11px] font-mono font-bold text-foreground/80 tracking-wider uppercase mb-1">Agencies</p>
                    {AGENCIES.map(a => (
                      <FilterCheckbox
                        key={a.id}
                        label={a.name}
                        checked={selectedAgencies.includes(a.id)}
                        onChange={() => toggleAgency(a.id)}
                      />
                    ))}
                  </div>

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

                  <div className="space-y-1 col-span-2 pt-2 border-t border-border/20">
                    <p className="text-[11px] font-mono font-bold text-foreground/80 tracking-wider uppercase mb-1">Product Type</p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-1">
                      {PRODUCT_TYPES.map(t => (
                        <FilterCheckbox
                          key={t}
                          label={t}
                          checked={selectedTypes.includes(t)}
                          onChange={() => toggleType(t)}
                        />
                      ))}
                    </div>
                  </div>

                  <div className="space-y-1 col-span-2 pt-2 border-t border-border/20">
                    <p className="text-[11px] font-mono font-bold text-foreground/80 tracking-wider uppercase mb-1">Resource Type</p>
                    <div className="flex flex-wrap gap-x-4 gap-y-1">
                      {RESOURCE_TYPES.map(rt => (
                        <FilterCheckbox
                          key={rt}
                          label={rt}
                          checked={selectedResourceTypes.includes(rt)}
                          onChange={() => toggleResourceType(rt)}
                        />
                      ))}
                    </div>
                  </div>

                  <div className="space-y-1 col-span-2 pt-2 border-t border-border/20">
                    <p className="text-[11px] font-mono font-bold text-foreground/80 tracking-wider uppercase mb-1">Published Date</p>
                    <div className="flex flex-wrap gap-x-4 gap-y-1">
                      {DATE_RANGES.map(d => (
                        <FilterCheckbox
                          key={d.id}
                          label={d.name}
                          checked={selectedDateRanges.includes(d.id)}
                          onChange={() => toggleDateRange(d.id)}
                        />
                      ))}
                    </div>
                  </div>

                  {hasFilters && (
                    <button
                      onClick={clearAll}
                      className="col-span-2 w-full mt-2 py-2 border border-dashed border-border text-[12px] font-mono hover:text-accent hover:border-accent transition-colors"
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
                <div className="hidden lg:flex items-center justify-between px-2 pb-2 border-b-2 border-foreground/20">
                  <div className="grid grid-cols-[110px_1fr_130px_130px_70px_36px] gap-4 flex-1">
                    <span className="text-[11px] font-mono font-bold text-foreground tracking-widest uppercase">DATE</span>
                    <span className="text-[11px] font-mono font-bold text-foreground tracking-widest uppercase">TITLE & DESCRIPTION</span>
                    <span className="text-[11px] font-mono font-bold text-foreground tracking-widest uppercase">AGENCY & COUNTRY</span>
                    <span className="text-[11px] font-mono font-bold text-foreground tracking-widest uppercase">PRODUCT TYPE</span>
                    <span className="text-[11px] font-mono font-bold text-foreground tracking-widest uppercase">TYPE</span>
                    <span />
                  </div>
                  <span className="text-[11px] font-mono text-muted-foreground/60 ml-4 whitespace-nowrap">
                    {totalCount} {totalCount === 1 ? 'result' : 'results'}
                  </span>
                </div>

                {/* Loading skeleton / transition overlay state */}
                {isPending ? (
                  <div className="space-y-4">
                    {Array.from({ length: 6 }).map((_, idx) => (
                      <div key={idx} className="border-b border-border/30 py-4 animate-pulse px-3">
                        <div className="grid grid-cols-[110px_1fr_130px_130px_70px_36px] items-center gap-4">
                          <div className="h-4 bg-secondary/50 rounded w-20" />
                          <div className="space-y-2">
                            <div className="h-5 bg-secondary/50 rounded w-3/4" />
                            <div className="h-3.5 bg-secondary/50 rounded w-1/2" />
                          </div>
                          <div className="space-y-1">
                            <div className="h-4 bg-secondary/50 rounded w-20" />
                            <div className="h-3.5 bg-secondary/50 rounded w-16" />
                          </div>
                          <div className="h-4 bg-secondary/50 rounded w-24" />
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
