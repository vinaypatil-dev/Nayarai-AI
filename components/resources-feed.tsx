'use client'

import React, { useState, useMemo, useRef, useEffect } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Search, X, Folder, FolderOpen, Play, ExternalLink, ChevronLeft, ChevronRight } from 'lucide-react'
import { ResourceItem } from '@/lib/types/contentful'
import { VideoModal } from '@/components/video-modal'
import { ResourceModal } from '@/components/resource-modal'

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
  count,
  checked,
  onChange,
}: {
  label: string
  count: number
  checked: boolean
  onChange: () => void
}) {
  return (
    <label className="flex items-center gap-2 cursor-pointer group py-[3px]">
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
        className="text-[13px] text-muted-foreground group-hover:text-foreground transition-colors leading-none"
      >
        {label}{' '}
        <span className="opacity-50">({count})</span>
      </span>
    </label>
  )
}

function ResourceRow({
  resource,
  index,
  onOpen,
}: {
  resource: ResourceItem;
  index: number;
  onOpen: (resource: ResourceItem) => void
}) {
  const isVideo = resource.resourceType?.toUpperCase() === 'VIDEO' || resource.videoUrl
  const hasLink = resource.sourceUrl || resource.media?.url || resource.videoUrl

  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ delay: index * 0.025, duration: 0.2 }}
      className="border-b border-border/30 group"
    >
      <div
        className="grid grid-cols-[130px_1fr_110px_36px] items-center gap-4 py-3 cursor-pointer hover:bg-secondary/30 transition-colors px-2"
        onClick={() => onOpen(resource)}
      >
        <span className="font-mono text-[13px] text-foreground select-none">
          {formatDate(resource.sys?.publishedAt || '')}
        </span>
        <span className="text-[17px] font-semibold leading-snug truncate pr-4">
          {resource.title}
        </span>
        <div className="flex items-center">
          <TypeBadge type={resource.resourceType} />
        </div>
        <div className="flex items-center justify-end">
          {isVideo
            ? <Play className="w-3.5 h-3.5 text-muted-foreground group-hover:text-accent transition-colors" />
            : hasLink
            ? <ExternalLink className="w-3.5 h-3.5 text-muted-foreground group-hover:text-accent transition-colors" />
            : <ExternalLink className="w-3.5 h-3.5 text-muted-foreground/30" />}
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
  resource: ResourceItem;
  index: number;
  onOpen: (resource: ResourceItem) => void
}) {
  const isVideo = resource.resourceType?.toUpperCase() === 'VIDEO' || resource.videoUrl

  return (
    <motion.div
      initial={{ opacity: 0, y: 4 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ delay: index * 0.02 }}
      className="flex items-start justify-between gap-3 py-3.5 border-b border-border/30 cursor-pointer group"
      onClick={() => onOpen(resource)}
    >
      <div className="flex-1 min-w-0 space-y-1">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="font-mono text-[11px] text-foreground">{formatDate(resource.sys?.publishedAt || '')}</span>
          <TypeBadge type={resource.resourceType} />
        </div>
        <p className="text-[15px] font-semibold leading-snug group-hover:text-accent transition-colors">{resource.title}</p>
        <p className="text-[11px] text-muted-foreground">{resource.country} · {resource.productType}</p>
      </div>
      <div className="flex-shrink-0 p-2 text-muted-foreground group-hover:text-accent transition-colors mt-0.5">
        {isVideo ? <Play className="w-4 h-4" /> : <ExternalLink className="w-4 h-4" />}
      </div>
    </motion.div>
  )
}

const PAGE_SIZE = 20

export function ResourcesFeed({ initialResources }: { initialResources: ResourceItem[] }) {
  const [selectedTypes,     setSelectedTypes]     = useState<string[]>([])
  const [selectedCountries, setSelectedCountries] = useState<string[]>([])
  const [search,            setSearch]            = useState('')
  const [typeOpen,          setTypeOpen]          = useState(true)
  const [topicOpen,         setTopicOpen]         = useState(true)
  const [currentPage,       setCurrentPage]       = useState(1)

  const [selectedResource, setSelectedResource]  = useState<ResourceItem | null>(null)
  const [modalVideo,       setModalVideo]        = useState<{ url: string; title: string } | null>(null)

  const searchRef = useRef<HTMLInputElement>(null)
  const listTopRef = useRef<HTMLDivElement>(null)

  const productTypes = useMemo(() => [...new Set(initialResources.map(r => r.productType).filter(Boolean))].sort(), [initialResources])
  const countries    = useMemo(() => [...new Set(initialResources.map(r => r.country).filter(Boolean))].sort(), [initialResources])

  const toggleType    = (t: string) => setSelectedTypes(p    => p.includes(t) ? p.filter(x => x !== t) : [...p, t])
  const toggleCountry = (c: string) => setSelectedCountries(p => p.includes(c) ? p.filter(x => x !== c) : [...p, c])
  const clearAll      = () => { setSelectedTypes([]); setSelectedCountries([]); setSearch(''); setCurrentPage(1) }
  const hasFilters    = selectedTypes.length > 0 || selectedCountries.length > 0 || search.length > 0

  const filtered = useMemo(() => {
    return initialResources.filter(r => {
      if (selectedTypes.length > 0 && !selectedTypes.includes(r.productType)) return false
      if (selectedCountries.length > 0 && !selectedCountries.includes(r.country)) return false
      if (search && !r.title?.toLowerCase().includes(search.toLowerCase()) &&
          !r.productType?.toLowerCase().includes(search.toLowerCase()) &&
          !r.country?.toLowerCase().includes(search.toLowerCase())) return false
      return true
    })
  }, [initialResources, selectedTypes, selectedCountries, search])

  // Reset to page 1 whenever filters/search change
  useEffect(() => { setCurrentPage(1) }, [selectedTypes, selectedCountries, search])

  const totalPages  = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const paginated   = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE)

  const goToPage = (page: number) => {
    setCurrentPage(page)
    listTopRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  const typeCount    = (t: string) => initialResources.filter(r => r.productType === t && (selectedCountries.length === 0 || selectedCountries.includes(r.country))).length
  const countryCount = (c: string) => initialResources.filter(r => r.country === c     && (selectedTypes.length === 0    || selectedTypes.includes(r.productType))).length

  return (
    <>
      <div className="max-w-[1400px] mx-auto px-6 md:px-10">

        {/* ── Title ───────────────────────────────────────────────── */}
        <div className="mb-12 text-center">
          <h1 className="font-display text-[clamp(4rem,10vw,8rem)] font-black leading-none tracking-tight text-foreground">
            Resources
          </h1>
        </div>

        {/* ── DESKTOP LAYOUT ─────────────────────────────────────── */}
        <div className="hidden lg:grid md:grid-cols-[280px_1fr] gap-10">

          <aside className="space-y-1 sticky top-28 self-start max-h-[calc(100vh-8rem)] overflow-y-auto pr-2">
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
              <div>
                <button
                  onClick={() => setTypeOpen(o => !o)}
                  className="flex items-center gap-1.5 mb-3 w-full group"
                >
                  {typeOpen
                    ? <FolderOpen className="w-3.5 h-3.5 text-accent" />
                    : <Folder     className="w-3.5 h-3.5 text-foreground" />}
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
                        {productTypes.map(t => (
                          <FilterCheckbox
                            key={t}
                            label={t}
                            count={typeCount(t)}
                            checked={selectedTypes.includes(t)}
                            onChange={() => toggleType(t)}
                          />
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <div>
                <button
                  onClick={() => setTopicOpen(o => !o)}
                  className="flex items-center gap-1.5 mb-3 w-full group"
                >
                  {topicOpen
                    ? <FolderOpen className="w-3.5 h-3.5 text-accent" />
                    : <Folder     className="w-3.5 h-3.5 text-foreground" />}
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
                  {topicOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.22, ease: [0.4, 0, 0.2, 1] }}
                      className="overflow-hidden"
                    >
                      <div className="space-y-0.5 pb-2">
                        {countries.map(c => (
                          <FilterCheckbox
                            key={c}
                            label={c}
                            count={countryCount(c)}
                            checked={selectedCountries.includes(c)}
                            onChange={() => toggleCountry(c)}
                          />
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </aside>

          <div ref={listTopRef}>
            {/* Table header + result count */}
            <div className="flex items-center justify-between mb-1 px-2 pb-2 border-b-2 border-foreground/20">
              <div className="grid grid-cols-[130px_1fr_110px_36px] gap-4 flex-1">
                <span className="text-[11px] font-mono font-bold text-foreground tracking-widest">DATE</span>
                <span className="text-[11px] font-mono font-bold text-foreground tracking-widest">NAME</span>
                <span className="text-[11px] font-mono font-bold text-foreground tracking-widest">TYPE</span>
                <span />
              </div>
              <span className="text-[11px] font-mono text-muted-foreground ml-4 whitespace-nowrap">
                {filtered.length} result{filtered.length !== 1 ? 's' : ''}
              </span>
            </div>

            <AnimatePresence mode="popLayout">
              {paginated.length > 0 ? (
                paginated.map((r, i) => (
                  <ResourceRow
                    key={`${currentPage}-${i}`}
                    resource={r}
                    index={i}
                    onOpen={setSelectedResource}
                  />
                ))
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="py-16 text-center text-muted-foreground font-mono text-sm"
                >
                  No results found.{' '}
                  <button onClick={clearAll} className="underline hover:text-foreground">Clear filters</button>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Pagination controls */}
            {totalPages > 1 && (
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
          </div>
        </div>

        {/* ── MOBILE LAYOUT ──────────────────────────────────────── */}
        <div className="lg:hidden">
          <div className="relative mb-6">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              ref={searchRef}
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search resources…"
              className="w-full bg-secondary/50 border border-border/50 rounded-lg pl-9 pr-9 py-2.5 text-sm placeholder:text-muted-foreground focus:outline-none focus:border-accent transition-colors"
            />
            {search && (
              <button
                onClick={() => setSearch('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          <p className="text-[12px] font-mono text-muted-foreground mb-4">
            {filtered.length} result{filtered.length !== 1 ? 's' : ''}
            {totalPages > 1 && <span className="opacity-60"> · Page {currentPage} of {totalPages}</span>}
          </p>

          <AnimatePresence mode="popLayout">
            {paginated.length > 0 ? (
              paginated.map((r, i) => (
                <MobileResourceItem
                  key={`${currentPage}-${i}`}
                  resource={r}
                  index={i}
                  onOpen={setSelectedResource}
                />
              ))
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="py-12 text-center text-muted-foreground font-mono text-sm"
              >
                No results found.
              </motion.div>
            )}
          </AnimatePresence>

          {/* Mobile pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between mt-6 pt-4 border-t border-border/30">
              <button
                onClick={() => goToPage(currentPage - 1)}
                disabled={currentPage === 1}
                className="flex items-center gap-1.5 px-3 py-2 text-[12px] font-mono border border-border hover:border-accent hover:text-accent disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronLeft className="w-3.5 h-3.5" /> Prev
              </button>
              <span className="text-[12px] font-mono text-muted-foreground">
                {currentPage} / {totalPages}
              </span>
              <button
                onClick={() => goToPage(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="flex items-center gap-1.5 px-3 py-2 text-[12px] font-mono border border-border hover:border-accent hover:text-accent disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              >
                Next <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
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
