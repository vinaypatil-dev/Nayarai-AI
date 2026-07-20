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

const testQuery = `
  query TestResources($limit: Int!, $skip: Int!, $where: ResourcesFilter, $order: [ResourcesOrder]) {
    resourcesCollection(limit: $limit, skip: $skip, where: $where, order: $order) {
      total
      items {
        title
        country
        productType
        resourceType
        sys {
          publishedAt
        }
      }
    }
  }
`

async function main() {
  loadEnv()
  console.log('--- Verification Step 1: Default Query (Newest First, limit 5) ---')
  const defaultRes = await graphQlRequest(testQuery, {
    limit: 5,
    skip: 0,
    order: ['sys_firstPublishedAt_DESC']
  })
  console.log(`Total Count: ${defaultRes?.data?.resourcesCollection?.total}`)
  console.log('Sample Items:')
  defaultRes?.data?.resourcesCollection?.items?.forEach((item: any, idx: number) => {
    console.log(`  ${idx + 1}. [${item.country}] [${item.productType}] [${item.resourceType}] ${item.title.slice(0, 70)}...`)
  })

  console.log('\n--- Verification Step 2: Pagination (page 2, limit 2) ---')
  const page2Res = await graphQlRequest(testQuery, {
    limit: 2,
    skip: 2,
    order: ['sys_firstPublishedAt_DESC']
  })
  console.log('Page 2 Sample Items:')
  page2Res?.data?.resourcesCollection?.items?.forEach((item: any, idx: number) => {
    console.log(`  ${idx + 3}. ${item.title.slice(0, 70)}...`)
  })

  console.log('\n--- Verification Step 3: Filtering (Product Type: Biologics) ---')
  const biologicsRes = await graphQlRequest(testQuery, {
    limit: 3,
    skip: 0,
    where: { productType_in: ['Biologics'] },
    order: ['sys_firstPublishedAt_DESC']
  })
  console.log(`Biologics Total: ${biologicsRes?.data?.resourcesCollection?.total}`)
  biologicsRes?.data?.resourcesCollection?.items?.forEach((item: any, idx: number) => {
    console.log(`  ${idx + 1}. [${item.productType}] ${item.title.slice(0, 70)}...`)
  })

  console.log('\n--- Verification Step 4: Filtering (Agency Mappings -> Country: India for CDSCO) ---')
  const indiaRes = await graphQlRequest(testQuery, {
    limit: 3,
    skip: 0,
    where: { country_in: ['India'] },
    order: ['sys_firstPublishedAt_DESC']
  })
  console.log(`India (CDSCO) Total: ${indiaRes?.data?.resourcesCollection?.total}`)
  indiaRes?.data?.resourcesCollection?.items?.forEach((item: any, idx: number) => {
    console.log(`  ${idx + 1}. [${item.country}] ${item.title.slice(0, 70)}...`)
  })

  console.log('\n--- Verification Step 5: Sorting (Alphabetical A-Z, limit 3) ---')
  const sortRes = await graphQlRequest(testQuery, {
    limit: 3,
    skip: 0,
    order: ['title_ASC']
  })
  sortRes?.data?.resourcesCollection?.items?.forEach((item: any, idx: number) => {
    console.log(`  ${idx + 1}. ${item.title.slice(0, 70)}...`)
  })

  console.log('\n--- Verification Step 6: Text Search ("Consultancy") ---')
  const searchRes = await graphQlRequest(testQuery, {
    limit: 3,
    skip: 0,
    where: { title_contains: 'Consultancy' }
  })
  console.log(`Search Total: ${searchRes?.data?.resourcesCollection?.total}`)
  searchRes?.data?.resourcesCollection?.items?.forEach((item: any, idx: number) => {
    console.log(`  ${idx + 1}. ${item.title.slice(0, 70)}...`)
  })
}

main().catch(console.error)
