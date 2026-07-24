export interface AgencyConfig {
  id: string
  name: string
  countries: string[]
  urlKeywords?: string[]
}

export interface AgencyConfig {
  id: string
  name: string
  countries: string[]
  urlKeywords?: string[]
}

export const AGENCIES: AgencyConfig[] = [
  { id: 'FDA', name: 'FDA (United States)', countries: ['United States of America', 'United States', 'USA'], urlKeywords: ['fda.gov'] },
  { id: 'EPA', name: 'EPA (United States)', countries: ['United States of America', 'United States', 'USA'], urlKeywords: ['epa.gov'] },
  { id: 'CMS', name: 'CMS (United States)', countries: ['United States of America', 'United States', 'USA'], urlKeywords: ['cms.gov'] },
  { id: 'CDC', name: 'CDC (United States)', countries: ['United States of America', 'United States', 'USA'], urlKeywords: ['cdc.gov'] },
  { id: 'NIH', name: 'NIH (United States)', countries: ['United States of America', 'United States', 'USA'], urlKeywords: ['nih.gov'] },
  { id: 'SEC', name: 'SEC (United States)', countries: ['United States of America', 'United States', 'USA'], urlKeywords: ['sec.gov'] },
  { id: 'EMA', name: 'EMA (European Union)', countries: ['European Union'], urlKeywords: ['ema.europa.eu'] },
  { id: 'EFSA', name: 'EFSA (European Union)', countries: ['European Union'], urlKeywords: ['efsa.europa.eu'] },
  { id: 'CDSCO', name: 'CDSCO (India)', countries: ['India'], urlKeywords: ['cdsco.gov.in'] },
  { id: 'MHRA', name: 'MHRA (United Kingdom)', countries: ['United Kingdom', 'UK', 'International'], urlKeywords: ['gov.uk', 'mhra.gov.uk'] },
  { id: 'NICE', name: 'NICE (United Kingdom)', countries: ['United Kingdom', 'UK'], urlKeywords: ['nice.org.uk'] },
  { id: 'TGA', name: 'TGA (Australia)', countries: ['Australia'], urlKeywords: ['tga.gov.au'] },
  { id: 'Health Canada', name: 'Health Canada (Canada)', countries: ['Canada'], urlKeywords: ['canada.ca', 'hc-sc.gc.ca'] },
  { id: 'Medsafe', name: 'Medsafe (New Zealand)', countries: ['New Zealand'], urlKeywords: ['medsafe.govt.nz'] },
  { id: 'PMDA', name: 'PMDA (Japan)', countries: ['Japan'], urlKeywords: ['pmda.go.jp'] },
  { id: 'MFDS', name: 'MFDS (Republic of Korea)', countries: ['Republic of Korea'], urlKeywords: ['mfds.go.kr'] },
  { id: 'HSA', name: 'HSA (Singapore)', countries: ['Singapore'], urlKeywords: ['hsa.gov.sg'] },
  { id: 'Swissmedic', name: 'Swissmedic (Switzerland)', countries: ['Switzerland'], urlKeywords: ['swissmedic.ch'] },
  { id: 'WHO', name: 'WHO (International)', countries: ['International'], urlKeywords: ['who.int'] },
]

export const COUNTRIES = [
  { id: 'Australia', name: 'Australia' },
  { id: 'Austria', name: 'Austria' },
  { id: 'Belgium', name: 'Belgium' },
  { id: 'Bulgaria', name: 'Bulgaria' },
  { id: 'Canada', name: 'Canada' },
  { id: 'Croatia', name: 'Croatia' },
  { id: 'Cyprus', name: 'Cyprus' },
  { id: 'Czechia', name: 'Czechia' },
  { id: 'Denmark', name: 'Denmark' },
  { id: 'Estonia', name: 'Estonia' },
  { id: 'Finland', name: 'Finland' },
  { id: 'France', name: 'France' },
  { id: 'Germany', name: 'Germany' },
  { id: 'Greece', name: 'Greece' },
  { id: 'Hungary', name: 'Hungary' },
  { id: 'Iceland', name: 'Iceland' },
  { id: 'Indonesia', name: 'Indonesia' },
  { id: 'Ireland', name: 'Ireland' },
  { id: 'Italy', name: 'Italy' },
  { id: 'Japan', name: 'Japan' },
  { id: 'Latvia', name: 'Latvia' },
  { id: 'Liechtenstein', name: 'Liechtenstein' },
  { id: 'Lithuania', name: 'Lithuania' },
  { id: 'Luxembourg', name: 'Luxembourg' },
  { id: 'Malta', name: 'Malta' },
  { id: 'Netherlands', name: 'Netherlands' },
  { id: 'New Zealand', name: 'New Zealand' },
  { id: 'Norway', name: 'Norway' },
  { id: 'Poland', name: 'Poland' },
  { id: 'Portugal', name: 'Portugal' },
  { id: 'Republic of Korea', name: 'Republic of Korea' },
  { id: 'Singapore', name: 'Singapore' },
  { id: 'Slovenia', name: 'Slovenia' },
  { id: 'Spain', name: 'Spain' },
  { id: 'Sweden', name: 'Sweden' },
  { id: 'Switzerland', name: 'Switzerland' },
  { id: 'United Kingdom', name: 'United Kingdom' },
  { id: 'United States of America', name: 'United States of America' },
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


import { resolveAuthority } from './authority-resolver'

/**
 * Resolves the true issuing regulatory authority (e.g. FDA, EPA, CMS, CDC, NIH, SEC, EMA, MHRA, CDSCO, TGA, Health Canada, WHO, PMDA, MFDS, HSA, Swissmedic)
 * using the metadata-first authority resolution engine.
 */
export function getAgencyFromResource(resource: {
  country?: string
  sourceUrl?: string | null
  title?: string
  shortDescription?: string
  rawItem?: any
  metadata?: Record<string, any>
}): string {
  const result = resolveAuthority({
    title: resource.title,
    description: resource.shortDescription,
    sourceUrl: resource.sourceUrl,
    country: resource.country,
    rawItem: resource.rawItem,
    metadata: resource.metadata,
  })
  return result.authority
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

  // Add selected countries with alias handling
  for (const country of selectedCountries) {
    countriesSet.add(country)
    if (country === 'United States of America' || country === 'United States') {
      countriesSet.add('United States of America')
      countriesSet.add('United States')
      countriesSet.add('USA')
    }
    if (country === 'United Kingdom') {
      countriesSet.add('United Kingdom')
      countriesSet.add('UK')
    }
    if (country === 'Republic of Korea') {
      countriesSet.add('Republic of Korea')
      countriesSet.add('South Korea')
      countriesSet.add('Korea')
    }
  }

  return Array.from(countriesSet)
}
