import * as fs from 'fs'
import * as path from 'path'

function loadEnv() {
  const envPath = path.resolve(process.cwd(), '.env.local')
  if (fs.existsSync(envPath)) {
    const envFile = fs.readFileSync(envPath, 'utf-8')
    for (const line of envFile.split('\n')) {
      const trimmed = line.trim()
      if (!trimmed || trimmed.startsWith('#')) continue
      const index = trimmed.indexOf('=')
      if (index === -1) continue
      const key = trimmed.slice(0, index).trim()
      const val = trimmed.slice(index + 1).trim()
      if (!process.env[key]) {
        process.env[key] = val
      }
    }
  }
}

async function graphQlRequest(query: string, variables: Record<string, any>) {
  const ACCESS_TOKEN = process.env.CONTENTFUL_ACCESS_TOKEN
  const SPACE_ID = process.env.CONTENTFUL_SPACE_ID
  const ENVIRONMENT_ID = process.env.CONTENTFUL_ENVIRONMENT_ID ?? 'master'
  const REQUEST_URL = `https://graphql.contentful.com/content/v1/spaces/${SPACE_ID}/environments/${ENVIRONMENT_ID}`

  const response = await fetch(REQUEST_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${ACCESS_TOKEN}`
    },
    body: JSON.stringify({ query, variables }),
  })
  return response.json()
}

const fetchAllQuery = `
  query AuditAllResources($limit: Int!, $skip: Int!) {
    resourcesCollection(limit: $limit, skip: $skip) {
      total
      items {
        title
        country
        productType
        resourceType
        sourceUrl
        videoUrl
        shortDescription
        sys {
          id
          publishedAt
          firstPublishedAt
        }
      }
    }
  }
`

// Helper to determine agency from sourceUrl / metadata
function resolveAgency(item: any): string {
  const url = (item.sourceUrl || '').toLowerCase()
  const title = (item.title || '').toLowerCase()
  const desc = (item.shortDescription || '').toLowerCase()

  if (url.includes('federalregister.gov') || url.includes('govinfo.gov')) {
    if (url.includes('federalregister.gov')) return 'Federal Register'
    return 'GovInfo'
  }
  if (url.includes('fda.gov') || title.includes('fda') || desc.includes('fda')) {
    return 'FDA'
  }
  if (url.includes('ema.europa.eu') || title.includes('ema') || desc.includes('ema')) {
    return 'EMA'
  }
  if (url.includes('gov.uk/mhra') || url.includes('mhra.gov.uk') || title.includes('mhra') || desc.includes('mhra')) {
    return 'MHRA'
  }
  if (url.includes('cdsco.gov.in') || title.includes('cdsco') || desc.includes('cdsco')) {
    return 'CDSCO'
  }
  return 'Unknown/Other'
}

async function main() {
  loadEnv()
  console.log('Fetching all records from Contentful for complete audit...')

  let items: any[] = []
  let skip = 0
  const limit = 1000
  let total = 0

  while (true) {
    const res = await graphQlRequest(fetchAllQuery, { limit, skip })
    if (res.errors) {
      console.error('GraphQL errors:', JSON.stringify(res.errors, null, 2))
      process.exit(1)
    }

    const collection = res.data?.resourcesCollection
    if (!collection) {
      console.error('No collection returned')
      break
    }

    total = collection.total
    const batch = collection.items || []
    items = items.concat(batch)
    console.log(`Fetched ${items.length} of ${total} records...`)

    if (batch.length < limit || items.length >= total) {
      break
    }
    skip += limit
  }

  console.log('\n==================================================')
  console.log('RESOURCE AUDIT REPORT')
  console.log('==================================================')
  console.log(`1. Total number of resources: ${items.length}\n`)

  // Year analysis
  const yearCounts: Record<string, number> = {}
  items.forEach(item => {
    const dateStr = item.sys?.publishedAt || item.sys?.firstPublishedAt
    if (dateStr) {
      const year = new Date(dateStr).getFullYear()
      yearCounts[year] = (yearCounts[year] || 0) + 1
    } else {
      yearCounts['Unknown'] = (yearCounts['Unknown'] || 0) + 1
    }
  })
  console.log('2. Count of resources grouped by year:')
  Object.keys(yearCounts).sort((a,b) => b.localeCompare(a)).forEach(y => {
    console.log(`   ${y} -> ${yearCounts[y]}`)
  })

  // Agency analysis
  const agencyCounts: Record<string, number> = {
    'FDA': 0,
    'EMA': 0,
    'MHRA': 0,
    'CDSCO': 0,
    'GovInfo': 0,
    'Federal Register': 0,
    'Unknown/Other': 0
  }
  items.forEach(item => {
    const agency = resolveAgency(item)
    agencyCounts[agency] = (agencyCounts[agency] || 0) + 1
  })
  console.log('\n3. Count of resources grouped by agency:')
  Object.keys(agencyCounts).forEach(agency => {
    console.log(`   ${agency} -> ${agencyCounts[agency]}`)
  })

  // Resource Type analysis
  const resourceTypeCounts: Record<string, number> = {}
  items.forEach(item => {
    const type = item.resourceType || 'Unknown'
    resourceTypeCounts[type] = (resourceTypeCounts[type] || 0) + 1
  })
  console.log('\n4. Count grouped by Resource Type:')
  Object.keys(resourceTypeCounts).forEach(t => {
    console.log(`   ${t} -> ${resourceTypeCounts[t]}`)
  })

  // Product Type analysis
  const productTypeCounts: Record<string, number> = {}
  items.forEach(item => {
    const type = item.productType || 'Unknown'
    productTypeCounts[type] = (productTypeCounts[type] || 0) + 1
  })
  console.log('\n5. Count grouped by Product Type:')
  Object.keys(productTypeCounts).forEach(t => {
    console.log(`   ${t} -> ${productTypeCounts[t]}`)
  })

  console.log('\n==================================================')
  console.log('DATE ANALYSIS')
  console.log('==================================================')
  const sortedByDate = [...items].filter(x => x.sys?.publishedAt).sort((a, b) => {
    return new Date(a.sys.publishedAt).getTime() - new Date(b.sys.publishedAt).getTime()
  })

  if (sortedByDate.length > 0) {
    const oldest = sortedByDate[0]
    const newest = sortedByDate[sortedByDate.length - 1]
    console.log('Oldest Resource:')
    console.log(`  Title:      ${oldest.title}`)
    console.log(`  Pub Date:   ${oldest.sys?.publishedAt}`)
    console.log(`  Source URL: ${oldest.sourceUrl || 'None'}`)
    
    console.log('\nNewest Resource:')
    console.log(`  Title:      ${newest.title}`)
    console.log(`  Pub Date:   ${newest.sys?.publishedAt}`)
    console.log(`  Source URL: ${newest.sourceUrl || 'None'}`)
  } else {
    console.log('No resources with publication dates found.')
  }

  console.log('\n==================================================')
  console.log('DUPLICATE ANALYSIS')
  console.log('==================================================')
  
  // 1. Exact duplicate titles
  const titlesMap: Record<string, any[]> = {}
  items.forEach(x => {
    const title = x.title.trim()
    if (!titlesMap[title]) titlesMap[title] = []
    titlesMap[title].push(x)
  })
  const exactDuplicates = Object.entries(titlesMap).filter(([_, list]) => list.length > 1)
  console.log(`1. Exact Duplicate Titles Category: Found ${exactDuplicates.length} titles with duplicates.`)
  if (exactDuplicates.length > 0) {
    console.log('   Examples:')
    exactDuplicates.slice(0, 5).forEach(([title, list]) => {
      console.log(`     - "${title}" (x${list.length} entries)`)
    })
  }

  // 2. Similar titles (case-insensitive and trimmed)
  const normTitlesMap: Record<string, any[]> = {}
  items.forEach(x => {
    const title = x.title.trim().toLowerCase().replace(/[^a-z0-9]/g, '')
    if (!normTitlesMap[title]) normTitlesMap[title] = []
    normTitlesMap[title].push(x)
  })
  const similarTitles = Object.entries(normTitlesMap).filter(([_, list]) => list.length > 1)
  console.log(`2. Similar Titles Category: Found ${similarTitles.length} matching normalized title entries.`)

  // 3. Duplicate source URLs
  const urlsMap: Record<string, any[]> = {}
  items.forEach(x => {
    const url = x.sourceUrl || x.videoUrl
    if (url) {
      if (!urlsMap[url]) urlsMap[url] = []
      urlsMap[url].push(x)
    }
  })
  const duplicateUrls = Object.entries(urlsMap).filter(([_, list]) => list.length > 1)
  console.log(`3. Duplicate Source URLs Category: Found ${duplicateUrls.length} duplicate URLs.`)
  if (duplicateUrls.length > 0) {
    console.log('   Examples:')
    duplicateUrls.slice(0, 5).forEach(([url, list]) => {
      console.log(`     - ${url} (x${list.length} entries)`)
    })
  }

  // 4. Duplicate Contentful Entries (ID match)
  const idsMap: Record<string, number> = {}
  items.forEach(x => {
    if (x.sys?.id) {
      idsMap[x.sys.id] = (idsMap[x.sys.id] || 0) + 1
    }
  })
  const duplicateIds = Object.entries(idsMap).filter(([_, count]) => count > 1)
  console.log(`4. Duplicate Contentful Entries Category: Found ${duplicateIds.length} duplicate Entry IDs (GraphQL returns unique entry nodes by default).`)

  // 5. Same publication dates
  const datesMap: Record<string, any[]> = {}
  items.forEach(x => {
    const d = x.sys?.publishedAt ? x.sys.publishedAt.slice(0, 10) : 'None'
    if (!datesMap[d]) datesMap[d] = []
    datesMap[d].push(x)
  })
  const duplicateDates = Object.entries(datesMap).filter(([d, list]) => d !== 'None' && list.length > 1)
  console.log(`5. Same Publication Dates Category: Found ${duplicateDates.length} dates with multiple publications.`)

  console.log('\n==================================================')
  console.log('DESCRIPTION ANALYSIS')
  console.log('==================================================')
  const descMap: Record<string, any[]> = {}
  items.forEach(x => {
    const desc = (x.shortDescription || '').trim()
    if (desc && desc.length > 10) {
      if (!descMap[desc]) descMap[desc] = []
      descMap[desc].push(x)
    }
  })
  const duplicateDescs = Object.entries(descMap).filter(([_, list]) => list.length > 1)
  console.log(`Found ${duplicateDescs.length} repeated descriptions.`)
  if (duplicateDescs.length > 0) {
    console.log('   Examples of repeated descriptions:')
    duplicateDescs.slice(0, 5).forEach(([desc, list]) => {
      console.log(`     - "${desc.slice(0, 80)}..." (x${list.length} entries)`)
      list.slice(0, 2).forEach(item => {
        console.log(`       -> Title: "${item.title}" (${item.sourceUrl})`)
      })
    })
  }

  console.log('\n==================================================')
  console.log('HISTORICAL IMPORT VERIFICATION')
  console.log('==================================================')
  const sample2024 = items.find(x => x.sys?.publishedAt?.startsWith('2024'))
  const sample2025 = items.find(x => x.sys?.publishedAt?.startsWith('2025'))
  const sample2026 = items.find(x => x.sys?.publishedAt?.startsWith('2026'))

  if (sample2024) {
    console.log(`2024 Sample: [${sample2024.sys.publishedAt}] "${sample2024.title}" (${sample2024.sourceUrl})`)
  } else {
    console.log('No 2024 sample found!')
  }
  if (sample2025) {
    console.log(`2025 Sample: [${sample2025.sys.publishedAt}] "${sample2025.title}" (${sample2025.sourceUrl})`)
  } else {
    console.log('No 2025 sample found!')
  }
  if (sample2026) {
    console.log(`2026 Sample: [${sample2026.sys.publishedAt}] "${sample2026.title}" (${sample2026.sourceUrl})`)
  } else {
    console.log('No 2026 sample found!')
  }
}

main().catch(console.error)
