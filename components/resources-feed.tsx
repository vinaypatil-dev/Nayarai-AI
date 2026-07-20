// [ignoring loop detection]
'use client'

import React, { useState, useRef, useEffect, useCallback, useTransition } from 'react'
import { useRouter, usePathname, useSearchParams } from 'next/navigation'
import { AnimatePresence, motion } from 'framer-motion'
import { Search, X, Folder, FolderOpen, Play, ExternalLink, ChevronLeft, ChevronRight, SlidersHorizontal, ChevronDown } from 'lucide-react'
import { ResourceItem } from '@/lib/types/contentful'
import { VideoModal } from '@/components/video-modal'
import { ResourceModal } from '@/components/resource-modal'
import {
  AGENCIES,
  COUNTRIES,
  PRODUCT_TYPES,
  RESOURCE_TYPES,
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
  const colors: Record<string, string> = {
    PDF:   'border-accent text-accent',
    VIDEO: 'border-blue-400 text-blue-400',
    Video: 'border-blue-400 text-blue-400',
  }
  return (
    <span className={`text-[10px] font-mono font-semibold border px-1.5 py-0.5 tracking-widest uppercase ${colors[type] || 'border-muted-foreground text-muted-foreground'}`}>
      {type}
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
    <label className="flex items-center gap-2 cursor-pointer group py-[3.5px]">
      <span
        onClick={onChange}
        className={`w-3.5 h-3.5 border flex-shrink-0 flex items-center justify-center transition-colors ${
          checked ? 'border-accent bg-accent' : 'border-muted-foreground/50 group-hover:border-muted-foreground'
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
        className="text-[13px] text-muted-foreground group-hover:text-foreground transition-colors leading-none select-none"
      >
        {label}
      </span>
    </label>
  )
}

function ResourceRow({
  resource,
  index,
  onOpen,
}: {
  resource: ResourceItem
  index: number
  onOpen: (resource: ResourceItem) => void
}) {
  const isVideo = resource.resourceType?.toUpperCase() === 'VIDEO' || resource.videoUrl
  const hasLink = resource.sourceUrl || resource.media?.url || resource.videoUrl
  const derivedAgency = getAgencyFromResource(resource)

  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ delay: index * 0.015, duration: 0.18 }}
      className="border-b border-border/30 group"
    >
      <div
        className="grid grid-cols-[120px_1fr_130px_120px_80px_36px] items-center gap-4 py-3.5 cursor-pointer hover:bg-secondary/30 transition-colors px-3 rounded-lg"
        onClick={() => onOpen(resource)}
      >
        <span className="font-mono text-[13px] text-muted-foreground select-none">
          {formatDate(resource.sys?.publishedAt || '')}
        </span>
        <div className="space-y-0.5 pr-4 min-w-0">
          <h3 className="text-[16px] font-semibold leading-snug truncate group-hover:text-accent transition-colors">
            {resource.title}
          </h3>
          <p className="text-[13px] text-muted-foreground line-clamp-1">
            {resource.shortDescription || 'No description available.'}
          </p>
        </div>
        <div className="flex flex-col min-w-0">
          <span className="text-[13px] font-medium text-foreground">{derivedAgency}</span>
          <span className="text-[11px] text-muted-foreground truncate">{resource.country}</span>
        </div>
        <span className="text-[13px] text-muted-foreground truncate">
          {resource.productType}
        </span>
        <div className="flex items-center">
          <TypeBadge type={resource.resourceType} />
        </div>
        <div className="flex items-center justify-end">
          {isVideo
            ? <Play className="w-4 h-4 text-muted-foreground group-hover:text-accent transition-colors" />
            : hasLink
            ? <ExternalLink className="w-4 h-4 text-muted-foreground group-hover:text-accent transition-colors" />
            : <ExternalLink className="w-4 h-4 text-muted-foreground/30" />}
        </div>
      </div>
    </motion.div>
  )
}

function MobileResourceItem({
  resource,
  index,
  onOpen,
}: {
  resource: ResourceItem
  index: number
  onOpen: (resource: ResourceItem) => void
}) {
  const isVideo = resource.resourceType?.toUpperCase() === 'VIDEO' || resource.videoUrl
  const derivedAgency = getAgencyFromResource(resource)

  return (
    <motion.div
      initial={{ opacity: 0, y: 4 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ delay: index * 0.01 }}
      className="flex items-start justify-between gap-3 py-4 border-b border-border/30 cursor-pointer group px-1"
      onClick={() => onOpen(resource)}
    >
      <div className="flex-1 min-w-0 space-y-1.5">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="font-mono text-[11px] text-muted-foreground">{formatDate(resource.sys?.publishedAt || '')}</span>
          <span className="text-[10px] font-mono font-bold bg-secondary/50 text-foreground px-1.5 py-0.5 rounded">{derivedAgency}</span>
          <TypeBadge type={resource.resourceType} />
        </div>
        <h3 className="text-[15px] font-semibold leading-snug group-hover:text-accent transition-colors line-clamp-2">{resource.title}</h3>
        <p className="text-[12px] text-muted-foreground line-clamp-1">{resource.shortDescription}</p>
        <p className="text-[11px] text-muted-foreground/80">{resource.country} · {resource.productType}</p>
      </div>
      <div className="flex-shrink-0 p-2 text-muted-foreground group-hover:text-accent transition-colors mt-0.5">
        {isVideo ? <Play className="w-4 h-4" /> : <ExternalLink className="w-4 h-4" />}
      </div>
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

  // Mobile filters panel toggle state
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false)

  // Selected filters derived from current query parameters
  const selectedAgencies = searchParams.get('agency')?.split(',').filter(Boolean) || []
  const selectedCountries = searchParams.get('country')?.split(',').filter(Boolean) || []
  const selectedTypes = searchParams.get('productType')?.split(',').filter(Boolean) || []
  const selectedResourceTypes = searchParams.get('resourceType')?.split(',').filter(Boolean) || []
  const currentSort = searchParams.get('sort') || 'newest'

  const [selectedResource, setSelectedResource] = useState<ResourceItem | null>(null)
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
          <h1 className="font-display text-[clamp(4rem,10vw,8rem)] font-black leading-none tracking-tight text-foreground">
            Resources
          </h1>
        </div>

        {/* ── Grid Layout ────────────────────────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-10">
          {/* ── Filter Sidebar (Desktop) ── */}
          <aside className="hidden lg:block space-y-5 sticky top-28 self-start max-h-[calc(100vh-8rem)] overflow-y-auto pr-2">
            <div className="flex items-center justify-between border-b border-border/30 pb-3">
              <span className="text-[11px] font-mono font-bold text-foreground tracking-widest">FILTER BY</span>
              {hasFilters && (
                <button
                  onClick={clearAll}
                  className="text-[11px] font-mono text-accent tracking-widest hover:underline"
                >
                  CLEAR ALL
                </button>
              )}
            </div>

            {/* Agencies section */}
            <div>
              <button
                onClick={() => setAgencyOpen(o => !o)}
                className="flex items-center gap-1.5 mb-2 w-full group"
              >
                {agencyOpen ? <FolderOpen className="w-3.5 h-3.5 text-accent" /> : <Folder className="w-3.5 h-3.5 text-foreground" />}
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
                    transition={{ duration: 0.2, ease: 'easeInOut' }}
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

            {/* Countries section */}
            <div>
              <button
                onClick={() => setCountryOpen(o => !o)}
                className="flex items-center gap-1.5 mb-2 w-full group"
              >
                {countryOpen ? <FolderOpen className="w-3.5 h-3.5 text-accent" /> : <Folder className="w-3.5 h-3.5 text-foreground" />}
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
                    transition={{ duration: 0.2, ease: 'easeInOut' }}
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

            {/* Product Types section */}
            <div>
              <button
                onClick={() => setTypeOpen(o => !o)}
                className="flex items-center gap-1.5 mb-2 w-full group"
              >
                {typeOpen ? <FolderOpen className="w-3.5 h-3.5 text-accent" /> : <Folder className="w-3.5 h-3.5 text-foreground" />}
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
                    transition={{ duration: 0.2, ease: 'easeInOut' }}
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

            {/* Resource Types section */}
            <div>
              <button
                onClick={() => setResourceTypeOpen(o => !o)}
                className="flex items-center gap-1.5 mb-2 w-full group"
              >
                {resourceTypeOpen ? <FolderOpen className="w-3.5 h-3.5 text-accent" /> : <Folder className="w-3.5 h-3.5 text-foreground" />}
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
                    transition={{ duration: 0.2, ease: 'easeInOut' }}
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
          </aside>

          {/* ── Main Content Column ── */}
          <div ref={listTopRef} className="space-y-6">
            {/* Search, Sort, and Mobile Filter Trigger */}
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  ref={searchRef}
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  placeholder="Search by title..."
                  className="w-full bg-secondary/40 border border-border/50 rounded-lg pl-9 pr-9 py-2.5 text-sm placeholder:text-muted-foreground focus:outline-none focus:border-accent transition-colors"
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

              <div className="flex gap-2">
                {/* Mobile Filters Toggle */}
                <button
                  onClick={() => setMobileFiltersOpen(o => !o)}
                  className="lg:hidden flex items-center gap-2 px-3 py-2 border border-border/50 rounded-lg bg-secondary/30 text-sm hover:border-accent hover:text-accent transition-colors"
                >
                  <SlidersHorizontal className="w-4 h-4" />
                  Filters
                </button>

                {/* Sort Selector */}
                <div ref={sortDropdownRef} className="relative">
                  <button
                    type="button"
                    onClick={() => setSortOpen(o => !o)}
                    className="w-[160px] bg-secondary/40 border border-border/50 rounded-lg px-4 py-2.5 text-sm text-foreground flex items-center justify-between gap-2 hover:border-accent/70 transition-colors focus:outline-none focus:border-accent"
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
                    <div className="flex gap-4">
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
                <div className="hidden lg:flex items-center justify-between px-3 pb-2 border-b-2 border-foreground/20">
                  <div className="grid grid-cols-[120px_1fr_130px_120px_80px_36px] gap-4 flex-1">
                    <span className="text-[11px] font-mono font-bold text-foreground tracking-widest">DATE</span>
                    <span className="text-[11px] font-mono font-bold text-foreground tracking-widest">TITLE & DESCRIPTION</span>
                    <span className="text-[11px] font-mono font-bold text-foreground tracking-widest">AGENCY & COUNTRY</span>
                    <span className="text-[11px] font-mono font-bold text-foreground tracking-widest">PRODUCT TYPE</span>
                    <span className="text-[11px] font-mono font-bold text-foreground tracking-widest">TYPE</span>
                    <span />
                  </div>
                  <span className="text-[11px] font-mono text-muted-foreground ml-4 whitespace-nowrap">
                    {totalCount} result{totalCount !== 1 ? 's' : ''}
                  </span>
                </div>

                {/* Loading skeleton / transition overlay state */}
                {isPending ? (
                  <div className="space-y-4">
                    {Array.from({ length: 6 }).map((_, idx) => (
                      <div key={idx} className="border-b border-border/30 py-4 animate-pulse px-3">
                        <div className="grid grid-cols-[120px_1fr_130px_120px_80px_36px] items-center gap-4">
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
                        {initialResources.map((r, i) => (
                          <ResourceRow
                            key={`${currentPage}-${i}`}
                            resource={r}
                            index={i}
                            onOpen={setSelectedResource}
                          />
                        ))}
                      </AnimatePresence>
                    </div>

                    {/* Mobile Resource List */}
                    <div className="lg:hidden space-y-1">
                      <AnimatePresence mode="popLayout">
                        {initialResources.map((r, i) => (
                          <MobileResourceItem
                            key={`${currentPage}-${i}`}
                            resource={r}
                            index={i}
                            onOpen={setSelectedResource}
                          />
                        ))}
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
                                  ? 'bg-accent text-background'
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
