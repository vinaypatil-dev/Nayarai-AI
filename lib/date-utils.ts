/**
 * Utility functions for authoritative publication date extraction and formatting.
 */

const monthsMap: Record<string, string> = {
  january: '01', jan: '01',
  february: '02', feb: '02',
  march: '03', mar: '03',
  april: '04', apr: '04',
  may: '05',
  june: '06', jun: '06',
  july: '07', jul: '07',
  august: '08', aug: '08',
  september: '09', sep: '09', sept: '09',
  october: '10', oct: '10',
  november: '11', nov: '11',
  december: '12', dec: '12',
}

/**
 * Extracts the true publication date from resource metadata (source URL, title, description)
 * falling back to Contentful sys.publishedAt if no original date is embedded in the source.
 */
export function extractResourceDate(resource: {
  title?: string
  shortDescription?: string
  sourceUrl?: string | null
  sys?: { publishedAt?: string }
}): string {
  if (!resource) return ''
  const url = resource.sourceUrl || ''
  const title = resource.title || ''
  const desc = resource.shortDescription || ''
  const textToScan = `${title} ${desc}`

  // 1. Check Federal Register URL: /documents/YYYY/MM/DD/
  const frUrlMatch = url.match(/\/documents\/(\d{4})\/(\d{2})\/(\d{2})\//)
  if (frUrlMatch) {
    const [, y, m, d] = frUrlMatch
    return `${y}-${m}-${d}T00:00:00Z`
  }

  // 2. Check GovInfo URL: /FR-YYYY-MM-DD or FR-YYYY-MM-DD
  const giUrlMatch = url.match(/FR-(\d{4})-(\d{2})-(\d{2})/)
  if (giUrlMatch) {
    const [, y, m, d] = giUrlMatch
    return `${y}-${m}-${d}T00:00:00Z`
  }

  // 3. Month Name Day, Year: "March 26, 2026", "November 16, 2015", "June 9, 2023", "April 8, 2021"
  const monthDayYearMatch = textToScan.match(/\b(January|February|March|April|May|June|July|August|September|October|November|December)\s+([0-3]?[0-9]),?\s+(20\d{2}|19\d{2})\b/i)
  if (monthDayYearMatch) {
    const [, monthName, day, year] = monthDayYearMatch
    const m = monthsMap[monthName.toLowerCase()]
    const d = day.padStart(2, '0')
    if (m) return `${year}-${m}-${d}T00:00:00Z`
  }

  // 4. Day Month Name Year / Day Range Month Name Year: "24 February 2026", "14 July 2026", "13 to 17 July 2026", "1 January 2024", "25 July 2022"
  const dayMonthYearMatch = textToScan.match(/\b([0-3]?[0-9])(?:\s*(?:to|-)\s*[0-3]?[0-9])?\s+(January|February|March|April|May|June|July|August|September|October|November|December|Jan|Feb|Mar|Apr|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\s+(20\d{2}|19\d{2})\b/i)
  if (dayMonthYearMatch) {
    const [, day, monthName, year] = dayMonthYearMatch
    const m = monthsMap[monthName.toLowerCase()]
    const d = day.padStart(2, '0')
    if (m) return `${year}-${m}-${d}T00:00:00Z`
  }

  // 5. European Dot/Slash date in text: "09.12.2024" or "09/12/2024"
  const dotDateMatch = textToScan.match(/\b(0[1-9]|[12][0-9]|3[01])[\.\/](0[1-9]|1[0-2])[\.\/](20\d{2}|19\d{2})\b/)
  if (dotDateMatch) {
    const [, d, m, y] = dotDateMatch
    return `${y}-${m.padStart(2, '0')}-${d.padStart(2, '0')}T00:00:00Z`
  }

  // 6. Generic ISO date in text: 2026-03-26
  const isoMatch = textToScan.match(/\b(20\d{2}|19\d{2})-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])\b/)
  if (isoMatch) {
    const [, y, m, d] = isoMatch
    return `${y}-${m}-${d}T00:00:00Z`
  }

  // Fallback to sys.publishedAt if available
  return resource.sys?.publishedAt || ''
}

/** Converts '2025-03-15T00:00:00Z' → '15 03 2025' */
export function formatDate(raw: string): string {
  if (!raw) return ''
  const date = new Date(raw)
  if (isNaN(date.getTime())) return raw
  const dd = String(date.getDate()).padStart(2, '0')
  const mm = String(date.getMonth() + 1).padStart(2, '0')
  const yyyy = date.getFullYear()
  return `${dd} ${mm} ${yyyy}`
}
