export interface AgencyConfig {
  id: string
  name: string
  countries: string[]
  urlKeywords?: string[]
}

export const AGENCIES: AgencyConfig[] = [
  { id: 'FDA', name: 'FDA (United States)', countries: ['United States', 'USA'], urlKeywords: ['fda.gov', 'federalregister.gov'] },
  { id: 'EMA', name: 'EMA (European Union)', countries: ['European Union'], urlKeywords: ['ema.europa.eu'] },
  { id: 'CDSCO', name: 'CDSCO (India)', countries: ['India'], urlKeywords: ['cdsco.gov.in'] },
  { id: 'MHRA', name: 'MHRA (United Kingdom)', countries: ['International'], urlKeywords: ['gov.uk'] },
]

export const COUNTRIES = [
  { id: 'United States', name: 'United States' },
  { id: 'European Union', name: 'European Union' },
  { id: 'India', name: 'India' },
  { id: 'International', name: 'International' },
]

export const PRODUCT_TYPES = [
  'Food & Dietary Supplements',
  'Cosmetics',
  'Pharmaceuticals',
  'Biologics',
  'Medical Devices',
  'Software as Medical Devices',
  'Tobacco & Restricted Products',
  'Veterinary Products',
  'Radiation Emitting / Electronic Products',
]

export const RESOURCE_TYPES = [
  'PDF',
  'DOC/DOCX',
  'XLS/XLSX',
  'PPT/PPTX',
  'MP4',
  'JPEG',
  'CSV',
  'TXT',
  'XPS',
  'RAW',
  'VIDEO',
]

export const DATE_RANGES = [
  { id: '2026', name: '2026' },
  { id: '2025', name: '2025' },
  { id: '2024', name: '2024' },
  { id: '2023-earlier', name: '2023 & earlier' },
]


/**
 * Derives the agency name based on the source URL and country of a resource.
 */
export function getAgencyFromResource(resource: { country?: string; sourceUrl?: string | null }): string {
  const url = resource.sourceUrl?.toLowerCase() || ''

  // 1. Check URL keywords
  for (const agency of AGENCIES) {
    if (agency.urlKeywords?.some(keyword => url.includes(keyword))) {
      return agency.id
    }
  }

  // 2. Fallbacks based on country match
  const country = resource.country?.toLowerCase() || ''
  if (country === 'united states' || country === 'usa') {
    return 'FDA'
  }
  if (country === 'european union') {
    return 'EMA'
  }
  if (country === 'india') {
    return 'CDSCO'
  }
  if (country === 'australia') {
    return 'TGA'
  }

  // 3. Fallback based on specific source URL features
  if (url.includes('gov.uk')) {
    return 'MHRA'
  }
  if (url.includes('govinfo.gov')) {
    return 'GovInfo'
  }

  return 'International'
}

/**
 * Translates selected agency IDs and country IDs into a list of countries for Contentful querying.
 */
export function getCountriesForQuery(selectedAgencies: string[], selectedCountries: string[]): string[] | null {
  if (selectedAgencies.length === 0 && selectedCountries.length === 0) {
    return null
  }

  const countriesSet = new Set<string>()

  // Map selected agencies to their countries
  for (const agencyId of selectedAgencies) {
    const config = AGENCIES.find(a => a.id === agencyId)
    if (config) {
      config.countries.forEach(c => countriesSet.add(c))
    }
  }

  // Add selected countries
  for (const country of selectedCountries) {
    countriesSet.add(country)
    if (country === 'United States') {
      countriesSet.add('USA') // Include variant
    }
  }

  return Array.from(countriesSet)
}
