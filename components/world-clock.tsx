'use client'

import React, { useState, useEffect, useMemo, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Clock, Moon, Sun, Search, X, Plus, Globe, ChevronDown, Trash2 } from 'lucide-react'

// ─── Data ─────────────────────────────────────────────────────────────────────

export const ALL_TIMEZONES: { city: string; country: string; timezone: string; flag: string }[] = [
  // Americas
  { city: 'New York',       country: 'United States',   timezone: 'America/New_York',                   flag: '🇺🇸' },
  { city: 'Los Angeles',    country: 'United States',   timezone: 'America/Los_Angeles',                flag: '🇺🇸' },
  { city: 'Chicago',        country: 'United States',   timezone: 'America/Chicago',                    flag: '🇺🇸' },
  { city: 'Denver',         country: 'United States',   timezone: 'America/Denver',                     flag: '🇺🇸' },
  { city: 'Honolulu',       country: 'United States',   timezone: 'Pacific/Honolulu',                   flag: '🇺🇸' },
  { city: 'Toronto',        country: 'Canada',          timezone: 'America/Toronto',                    flag: '🇨🇦' },
  { city: 'Vancouver',      country: 'Canada',          timezone: 'America/Vancouver',                  flag: '🇨🇦' },
  { city: 'Mexico City',    country: 'Mexico',          timezone: 'America/Mexico_City',                flag: '🇲🇽' },
  { city: 'São Paulo',      country: 'Brazil',          timezone: 'America/Sao_Paulo',                  flag: '🇧🇷' },
  { city: 'Buenos Aires',   country: 'Argentina',       timezone: 'America/Argentina/Buenos_Aires',     flag: '🇦🇷' },
  { city: 'Lima',           country: 'Peru',            timezone: 'America/Lima',                       flag: '🇵🇪' },
  { city: 'Bogotá',         country: 'Colombia',        timezone: 'America/Bogota',                     flag: '🇨🇴' },
  { city: 'Santiago',       country: 'Chile',           timezone: 'America/Santiago',                   flag: '🇨🇱' },
  // Europe
  { city: 'London',         country: 'United Kingdom',  timezone: 'Europe/London',                      flag: '🇬🇧' },
  { city: 'Paris',          country: 'France',          timezone: 'Europe/Paris',                       flag: '🇫🇷' },
  { city: 'Berlin',         country: 'Germany',         timezone: 'Europe/Berlin',                      flag: '🇩🇪' },
  { city: 'Madrid',         country: 'Spain',           timezone: 'Europe/Madrid',                      flag: '🇪🇸' },
  { city: 'Rome',           country: 'Italy',           timezone: 'Europe/Rome',                        flag: '🇮🇹' },
  { city: 'Amsterdam',      country: 'Netherlands',     timezone: 'Europe/Amsterdam',                   flag: '🇳🇱' },
  { city: 'Zurich',         country: 'Switzerland',     timezone: 'Europe/Zurich',                      flag: '🇨🇭' },
  { city: 'Geneva',         country: 'Switzerland',     timezone: 'Europe/Zurich',                      flag: '🇨🇭' },
  { city: 'Vienna',         country: 'Austria',         timezone: 'Europe/Vienna',                      flag: '🇦🇹' },
  { city: 'Warsaw',         country: 'Poland',          timezone: 'Europe/Warsaw',                      flag: '🇵🇱' },
  { city: 'Stockholm',      country: 'Sweden',          timezone: 'Europe/Stockholm',                   flag: '🇸🇪' },
  { city: 'Oslo',           country: 'Norway',          timezone: 'Europe/Oslo',                        flag: '🇳🇴' },
  { city: 'Copenhagen',     country: 'Denmark',         timezone: 'Europe/Copenhagen',                  flag: '🇩🇰' },
  { city: 'Helsinki',       country: 'Finland',         timezone: 'Europe/Helsinki',                    flag: '🇫🇮' },
  { city: 'Athens',         country: 'Greece',          timezone: 'Europe/Athens',                      flag: '🇬🇷' },
  { city: 'Moscow',         country: 'Russia',          timezone: 'Europe/Moscow',                      flag: '🇷🇺' },
  { city: 'Lisbon',         country: 'Portugal',        timezone: 'Europe/Lisbon',                      flag: '🇵🇹' },
  { city: 'Dublin',         country: 'Ireland',         timezone: 'Europe/Dublin',                      flag: '🇮🇪' },
  { city: 'Brussels',       country: 'Belgium',         timezone: 'Europe/Brussels',                    flag: '🇧🇪' },
  { city: 'Budapest',       country: 'Hungary',         timezone: 'Europe/Budapest',                    flag: '🇭🇺' },
  { city: 'Prague',         country: 'Czech Republic',  timezone: 'Europe/Prague',                      flag: '🇨🇿' },
  // Africa
  { city: 'Cairo',          country: 'Egypt',           timezone: 'Africa/Cairo',                       flag: '🇪🇬' },
  { city: 'Lagos',          country: 'Nigeria',         timezone: 'Africa/Lagos',                       flag: '🇳🇬' },
  { city: 'Johannesburg',   country: 'South Africa',    timezone: 'Africa/Johannesburg',                flag: '🇿🇦' },
  { city: 'Nairobi',        country: 'Kenya',           timezone: 'Africa/Nairobi',                     flag: '🇰🇪' },
  { city: 'Casablanca',     country: 'Morocco',         timezone: 'Africa/Casablanca',                  flag: '🇲🇦' },
  { city: 'Accra',          country: 'Ghana',           timezone: 'Africa/Accra',                       flag: '🇬🇭' },
  // Middle East
  { city: 'Dubai',          country: 'UAE',             timezone: 'Asia/Dubai',                         flag: '🇦🇪' },
  { city: 'Riyadh',         country: 'Saudi Arabia',    timezone: 'Asia/Riyadh',                        flag: '🇸🇦' },
  { city: 'Doha',           country: 'Qatar',           timezone: 'Asia/Qatar',                         flag: '🇶🇦' },
  { city: 'Kuwait City',    country: 'Kuwait',          timezone: 'Asia/Kuwait',                        flag: '🇰🇼' },
  { city: 'Tel Aviv',       country: 'Israel',          timezone: 'Asia/Jerusalem',                     flag: '🇮🇱' },
  { city: 'Tehran',         country: 'Iran',            timezone: 'Asia/Tehran',                        flag: '🇮🇷' },
  { city: 'Baghdad',        country: 'Iraq',            timezone: 'Asia/Baghdad',                       flag: '🇮🇶' },
  { city: 'Muscat',         country: 'Oman',            timezone: 'Asia/Muscat',                        flag: '🇴🇲' },
  // South Asia
  { city: 'Mumbai',         country: 'India',           timezone: 'Asia/Kolkata',                       flag: '🇮🇳' },
  { city: 'Delhi',          country: 'India',           timezone: 'Asia/Kolkata',                       flag: '🇮🇳' },
  { city: 'Bangalore',      country: 'India',           timezone: 'Asia/Kolkata',                       flag: '🇮🇳' },
  { city: 'Karachi',        country: 'Pakistan',        timezone: 'Asia/Karachi',                       flag: '🇵🇰' },
  { city: 'Dhaka',          country: 'Bangladesh',      timezone: 'Asia/Dhaka',                         flag: '🇧🇩' },
  { city: 'Colombo',        country: 'Sri Lanka',       timezone: 'Asia/Colombo',                       flag: '🇱🇰' },
  { city: 'Kathmandu',      country: 'Nepal',           timezone: 'Asia/Kathmandu',                     flag: '🇳🇵' },
  // East & Southeast Asia
  { city: 'Tokyo',          country: 'Japan',           timezone: 'Asia/Tokyo',                         flag: '🇯🇵' },
  { city: 'Seoul',          country: 'South Korea',     timezone: 'Asia/Seoul',                         flag: '🇰🇷' },
  { city: 'Beijing',        country: 'China',           timezone: 'Asia/Shanghai',                      flag: '🇨🇳' },
  { city: 'Shanghai',       country: 'China',           timezone: 'Asia/Shanghai',                      flag: '🇨🇳' },
  { city: 'Hong Kong',      country: 'Hong Kong SAR',   timezone: 'Asia/Hong_Kong',                     flag: '🇭🇰' },
  { city: 'Singapore',      country: 'Singapore',       timezone: 'Asia/Singapore',                     flag: '🇸🇬' },
  { city: 'Bangkok',        country: 'Thailand',        timezone: 'Asia/Bangkok',                       flag: '🇹🇭' },
  { city: 'Kuala Lumpur',   country: 'Malaysia',        timezone: 'Asia/Kuala_Lumpur',                  flag: '🇲🇾' },
  { city: 'Jakarta',        country: 'Indonesia',       timezone: 'Asia/Jakarta',                       flag: '🇮🇩' },
  { city: 'Manila',         country: 'Philippines',     timezone: 'Asia/Manila',                        flag: '🇵🇭' },
  { city: 'Hanoi',          country: 'Vietnam',         timezone: 'Asia/Ho_Chi_Minh',                   flag: '🇻🇳' },
  { city: 'Taipei',         country: 'Taiwan',          timezone: 'Asia/Taipei',                        flag: '🇹🇼' },
  // Pacific & Oceania
  { city: 'Sydney',         country: 'Australia',       timezone: 'Australia/Sydney',                   flag: '🇦🇺' },
  { city: 'Melbourne',      country: 'Australia',       timezone: 'Australia/Melbourne',                flag: '🇦🇺' },
  { city: 'Brisbane',       country: 'Australia',       timezone: 'Australia/Brisbane',                 flag: '🇦🇺' },
  { city: 'Perth',          country: 'Australia',       timezone: 'Australia/Perth',                    flag: '🇦🇺' },
  { city: 'Auckland',       country: 'New Zealand',     timezone: 'Pacific/Auckland',                   flag: '🇳🇿' },
]

const DEFAULT_CITIES = ['Tokyo', 'Sydney', 'Hong Kong', 'Singapore', 'Bangalore', 'Geneva', 'London', 'New York']

// ─── Helpers ──────────────────────────────────────────────────────────────────

function getTimeInZone(timezone: string): Date {
  try {
    const str = new Date().toLocaleString('en-US', { timeZone: timezone })
    return new Date(str)
  } catch {
    return new Date()
  }
}

function getTzAbbr(timezone: string): string {
  try {
    const parts = new Intl.DateTimeFormat('en-US', {
      timeZone: timezone,
      timeZoneName: 'short',
    }).formatToParts(new Date())
    return parts.find(p => p.type === 'timeZoneName')?.value ?? ''
  } catch {
    return ''
  }
}

function getAnalogAngles(date: Date) {
  const h = date.getHours() % 12
  const m = date.getMinutes()
  const s = date.getSeconds()
  return {
    hour:   (h / 12) * 360 + (m / 60) * 30,
    minute: (m / 60) * 360 + (s / 60) * 6,
    second: (s / 60) * 360,
  }
}

// ─── Analog Clock SVG ────────────────────────────────────────────────────────

function AnalogClock({ date, isDay }: { date: Date | null; isDay: boolean }) {
  const a = date ? getAnalogAngles(date) : { hour: 0, minute: 0, second: 0 }
  const toRad = (deg: number) => (deg - 90) * (Math.PI / 180)
  const pt = (r: number, deg: number) => ({
    x: 60 + r * Math.cos(toRad(deg)),
    y: 60 + r * Math.sin(toRad(deg)),
  })

  // Site accent is oklch(0.75 0.15 85) which is a warm amber/gold
  const accentColor = '#c9a227'  // warm gold matching site accent

  return (
    <svg viewBox="0 0 120 120" className="w-full h-full">
      {/* Outer ring */}
      <circle cx="60" cy="60" r="56"
        fill={isDay ? 'rgba(201,162,39,0.06)' : 'rgba(201,162,39,0.04)'}
        stroke={isDay ? 'rgba(201,162,39,0.25)' : 'rgba(201,162,39,0.15)'}
        strokeWidth="1.5"
      />

      {/* Tick marks */}
      {Array.from({ length: 60 }).map((_, i) => {
        const isMajor = i % 5 === 0
        const p1 = pt(isMajor ? 49 : 52, i * 6)
        const p2 = pt(56, i * 6)
        return (
          <line key={i}
            x1={p1.x} y1={p1.y} x2={p2.x} y2={p2.y}
            stroke={isMajor
              ? 'var(--foreground)'
              : 'oklch(0.50 0 0 / 0.3)'}
            strokeWidth={isMajor ? 1.5 : 0.7}
            strokeLinecap="round"
          />
        )
      })}

      {/* Hour hand */}
      {(() => { const p = pt(30, a.hour); return (
        <line x1="60" y1="60" x2={p.x} y2={p.y}
          stroke="var(--foreground)" strokeWidth="3" strokeLinecap="round" />
      )})()}

      {/* Minute hand */}
      {(() => { const p = pt(42, a.minute); return (
        <line x1="60" y1="60" x2={p.x} y2={p.y}
          stroke="var(--muted-foreground)" strokeWidth="2" strokeLinecap="round" />
      )})()}

      {/* Second hand */}
      {(() => { const p = pt(46, a.second); return (
        <line x1="60" y1="60" x2={p.x} y2={p.y}
          stroke={accentColor} strokeWidth="1.2" strokeLinecap="round" />
      )})()}

      {/* Center */}
      <circle cx="60" cy="60" r="4"
        fill="var(--foreground)"
        stroke="var(--background)" strokeWidth="1.5"
      />
      <circle cx="60" cy="60" r="2" fill={accentColor} />
    </svg>
  )
}

// ─── Clock Card ───────────────────────────────────────────────────────────────

function ClockCard({
  entry,
  date,
  onRemove,
  isDefault,
}: {
  entry: typeof ALL_TIMEZONES[number]
  date: Date | null
  onRemove?: () => void
  isDefault: boolean
}) {
  const hours  = date ? date.getHours() : 12
  const isDay  = hours >= 6 && hours < 18

  const timeStr = date
    ? date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true })
    : '--:--'
  const secStr = date
    ? String(date.getSeconds()).padStart(2, '0')
    : '--'
  const [hm, ampm] = timeStr.split(' ')

  const dateStr = date
    ? date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })
    : '---'

  const tzAbbr = getTzAbbr(entry.timezone)

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.93, y: 12 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9, y: 8 }}
      whileHover={{ y: -5, transition: { type: 'spring', stiffness: 400, damping: 20 } }}
      transition={{ type: 'spring', stiffness: 300, damping: 26 }}
      className="group glass-strong rounded-3xl overflow-hidden border border-border/30 relative"
      style={{ boxShadow: '0 4px 24px 0 rgba(0,0,0,0.06)' }}
    >
      {/* Accent top bar */}
      <div
        className="h-1 w-full"
        style={{ background: 'linear-gradient(90deg, oklch(0.75 0.15 85), oklch(0.82 0.18 90), oklch(0.75 0.15 85))' }}
      />

      {/* Subtle day/night tint */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: isDay
            ? 'linear-gradient(135deg, oklch(0.75 0.15 85 / 0.04) 0%, transparent 60%)'
            : 'linear-gradient(135deg, oklch(0.55 0.12 255 / 0.05) 0%, transparent 60%)',
        }}
      />

      <div className="relative p-5">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-2.5 flex-1 min-w-0">
            <span className="text-2xl leading-none shrink-0">{entry.flag}</span>
            <div className="min-w-0">
              <h3 className="font-display font-bold text-sm md:text-base text-foreground leading-tight truncate">
                {entry.city}
              </h3>
              <p className="text-xs text-muted-foreground truncate">{entry.country}</p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 shrink-0 ml-2">
            {/* Day/Night badge */}
            <div className={`flex items-center gap-1 text-xs px-2 py-0.5 rounded-full border font-medium ${
              isDay
                ? 'bg-amber-500/10 text-amber-600 border-amber-500/20 dark:text-amber-400 dark:border-amber-400/20'
                : 'bg-blue-500/10 text-blue-600 border-blue-500/20 dark:text-blue-400 dark:border-blue-400/20'
            }`}>
              {isDay
                ? <Sun className="w-3 h-3" />
                : <Moon className="w-3 h-3" />
              }
              <span className="hidden sm:inline">{isDay ? 'Day' : 'Night'}</span>
            </div>

            {/* Remove button */}
            {!isDefault && onRemove && (
              <button
                onClick={onRemove}
                className="w-6 h-6 rounded-full border border-border bg-background/60 hover:bg-destructive/10 hover:border-destructive/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-200"
                aria-label={`Remove ${entry.city}`}
              >
                <X className="w-3 h-3 text-muted-foreground hover:text-destructive" />
              </button>
            )}
          </div>
        </div>

        {/* Clock row */}
<div className="flex items-center justify-center gap-4 sm:gap-5">
  {/* Analog — show on mobile but larger */}
  <div className="w-[72px] h-[72px] sm:w-[62px] sm:h-[62px] shrink-0">
    <AnalogClock date={date} isDay={isDay} />
  </div>

  {/* Digital */}
  <div className="flex-1 min-w-0">
    <div className="flex items-end gap-1 flex-wrap">
      {/* Main Time */}
      <span className="font-display text-3xl sm:text-2xl md:text-3xl font-bold tabular-nums text-foreground leading-none tracking-tight">
        {hm}
      </span>

      {/* Seconds */}
      <span className="font-display text-base sm:text-sm font-semibold tabular-nums text-muted-foreground mb-[2px]">
        :{secStr}
      </span>

      {/* AM/PM */}
      <span
        className="text-[10px] sm:text-xs font-bold px-2 py-[2px] rounded-md ml-1"
        style={{
          background: 'oklch(0.75 0.15 85 / 0.15)',
          color: 'oklch(0.50 0.12 80)'
        }}
      >
        {ampm}
      </span>
    </div>

    {/* Meta Info */}
    <div className="mt-3 sm:mt-4 flex flex-wrap items-center gap-2 sm:gap-3">
      {/* Timezone */}
      <span
        className="text-[10px] sm:text-xs font-semibold px-2.5 py-1 rounded-full border backdrop-blur-sm"
        style={{
          background: 'oklch(0.75 0.15 85 / 0.12)',
          color: 'oklch(0.45 0.12 80)',
          borderColor: 'oklch(0.75 0.15 85 / 0.25)',
        }}
      >
        {tzAbbr}
      </span>

      {/* Date */}
      <span className="text-[11px] sm:text-xs text-muted-foreground">
        {dateStr}
      </span>
    </div>
  </div>
</div>
      </div>
    </motion.div>
  )
}

// ─── City Search Dropdown ────────────────────────────────────────────────────

function CitySearchDropdown({
  onAdd,
  existingKeys,
}: {
  onAdd: (entry: typeof ALL_TIMEZONES[number]) => void
  existingKeys: Set<string>
}) {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const ref = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const results = useMemo(() => {
    const q = query.trim().toLowerCase()
    const list = q
      ? ALL_TIMEZONES.filter(
          e =>
            e.city.toLowerCase().includes(q) ||
            e.country.toLowerCase().includes(q) ||
            e.timezone.toLowerCase().includes(q)
        )
      : ALL_TIMEZONES
    return list.slice(0, 40)
  }, [query])

  useEffect(() => {
    function handler(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 50)
  }, [open])

  return (
    <div ref={ref} className="relative">
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.97 }}
        onClick={() => setOpen(o => !o)}
        className="flex items-center gap-2 px-4 py-2.5 rounded-2xl font-medium text-sm transition-all border"
        style={{
          background: 'oklch(0.75 0.15 85 / 0.12)',
          borderColor: 'oklch(0.75 0.15 85 / 0.3)',
          color: 'oklch(0.40 0.12 80)',
        }}
      >
        <Plus className="w-4 h-4" />
        <span>Add City</span>
        <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${open ? 'rotate-180' : ''}`} />
      </motion.button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.96 }}
            transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
            className="absolute right-0 mt-2 w-76 z-50 rounded-2xl overflow-hidden shadow-xl border border-border/40 glass-strong"
            style={{ backdropFilter: 'blur(24px)', minWidth: '17rem' }}
          >
            {/* Search */}
            <div className="p-3 border-b border-border/20">
              <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-muted/50 border border-border/30">
                <Search className="w-4 h-4 text-muted-foreground shrink-0" />
                <input
                  ref={inputRef}
                  value={query}
                  onChange={e => setQuery(e.target.value)}
                  placeholder="Search city or country…"
                  className="flex-1 bg-transparent text-sm outline-none text-foreground placeholder:text-muted-foreground"
                />
                {query && (
                  <button onClick={() => setQuery('')} className="shrink-0">
                    <X className="w-3.5 h-3.5 text-muted-foreground hover:text-foreground" />
                  </button>
                )}
              </div>
            </div>

            {/* List */}
            <div className="max-h-60 overflow-y-auto py-1">
              {results.length === 0 ? (
                <p className="text-center text-muted-foreground text-sm py-8">No results</p>
              ) : (
                results.map(entry => {
                  const key = `${entry.city}::${entry.timezone}`
                  const already = existingKeys.has(key)
                  return (
                    <button
                      key={key}
                      disabled={already}
                      onClick={() => { onAdd(entry); setOpen(false); setQuery('') }}
                      className={`w-full flex items-center gap-3 px-4 py-2.5 text-left transition-colors ${
                        already
                          ? 'opacity-40 cursor-not-allowed'
                          : 'hover:bg-accent/10 cursor-pointer'
                      }`}
                    >
                      <span className="text-xl leading-none shrink-0">{entry.flag}</span>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-foreground truncate">{entry.city}</p>
                        <p className="text-xs text-muted-foreground truncate">{entry.country}</p>
                      </div>
                      {already ? (
                        <span className="text-xs text-muted-foreground shrink-0">Added</span>
                      ) : (
                        <Plus className="w-3.5 h-3.5 text-muted-foreground shrink-0 opacity-0 group-hover:opacity-100" />
                      )}
                    </button>
                  )
                })
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// ─── Main Export ─────────────────────────────────────────────────────────────

export function WorldClock() {
  const [active, setActive] = useState<typeof ALL_TIMEZONES>(() =>
    DEFAULT_CITIES
      .map(c => ALL_TIMEZONES.find(e => e.city === c))
      .filter((e): e is typeof ALL_TIMEZONES[number] => !!e)
  )

  const [now, setNow] = useState<Date | null>(null)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    setNow(new Date())
    const id = setInterval(() => setNow(new Date()), 1000)
    return () => clearInterval(id)
  }, [])

  const existingKeys = useMemo(
    () => new Set(active.map(e => `${e.city}::${e.timezone}`)),
    [active]
  )

  const defaultKeys = useMemo(() => new Set(
    DEFAULT_CITIES.map(c => {
      const e = ALL_TIMEZONES.find(x => x.city === c)
      return e ? `${e.city}::${e.timezone}` : ''
    })
  ), [])

  function handleAdd(entry: typeof ALL_TIMEZONES[number]) {
    setActive(prev => [...prev, entry])
  }

  function handleRemove(key: string) {
    setActive(prev => prev.filter(e => `${e.city}::${e.timezone}` !== key))
  }

  function handleReset() {
    setActive(
      DEFAULT_CITIES
        .map(c => ALL_TIMEZONES.find(e => e.city === c))
        .filter((e): e is typeof ALL_TIMEZONES[number] => !!e)
    )
  }

  if (!mounted) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {DEFAULT_CITIES.map(c => (
          <div key={c} className="h-40 rounded-3xl glass animate-pulse" />
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Toolbar */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-2 text-muted-foreground">
          <Clock className="w-4 h-4" style={{ color: 'oklch(0.60 0.12 80)' }} />
          <span className="text-sm">
            <span className="font-semibold text-foreground">{active.length}</span>{' '}
            {active.length === 1 ? 'timezone' : 'timezones'} tracked
          </span>
        </div>

        <div className="flex items-center gap-2">
          {active.length !== DEFAULT_CITIES.length && (
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              onClick={handleReset}
              className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground border border-border hover:border-border/80 px-3 py-2 rounded-xl transition-all bg-background/60"
            >
              <Trash2 className="w-3.5 h-3.5" />
              Reset
            </motion.button>
          )}
          <CitySearchDropdown onAdd={handleAdd} existingKeys={existingKeys} />
        </div>
      </div>

      {/* Grid */}
      <motion.div
        layout
        className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4"
      >
        <AnimatePresence mode="popLayout">
          {active.map(entry => {
            const key = `${entry.city}::${entry.timezone}`
            return (
              <ClockCard
                key={key}
                entry={entry}
                date={now ? getTimeInZone(entry.timezone) : null}
                onRemove={() => handleRemove(key)}
                isDefault={defaultKeys.has(key)}
              />
            )
          })}
        </AnimatePresence>
      </motion.div>

      {active.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-24 glass-strong rounded-3xl"
        >
          <Globe className="w-10 h-10 mx-auto mb-3" style={{ color: 'oklch(0.75 0.15 85)' }} />
          <p className="text-muted-foreground text-sm">No cities added yet.</p>
          <p className="text-xs text-muted-foreground mt-1">Use "Add City" to track a timezone.</p>
        </motion.div>
      )}
    </div>
  )
}
