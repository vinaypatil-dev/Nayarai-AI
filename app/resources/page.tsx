import React from 'react'
import { ResourcesFeed } from '@/components/resources-feed'
import graphQlClient from '@/lib/contentful-graphql-client'
import { getCountriesForQuery } from '@/lib/agency-utils'
import { extractResourceDate } from '@/lib/date-utils'

export const dynamic = 'force-dynamic'

const resourcesQuery = `
  query GetResources($limit: Int!, $skip: Int!, $where: ResourcesFilter, $order: [ResourcesOrder]) {
    resourcesCollection(limit: $limit, skip: $skip, where: $where, order: $order) {
      total
      items {
        sys {
          id
          publishedAt
        }
        title
        country
        shortDescription
        productType
        resourceType
        sourceUrl
        media {
          url
        }
        videoUrl
      }
    }
  }
`

interface ResourcesPageProps {
  searchParams: Promise<{
    page?: string
    search?: string
    agency?: string
    country?: string
    productType?: string
    resourceType?: string
    dateRange?: string
    startDate?: string
    endDate?: string
    sort?: string
  }>
}

export default async function ResourcesPage({ searchParams }: ResourcesPageProps) {
  const params = await searchParams

  const page = parseInt(params.page || '1', 10)
  const limit = 20
  const skip = (page - 1) * limit

  const search = params.search || ''
  const selectedAgencies = params.agency ? params.agency.split(',').filter(Boolean) : []
  const selectedCountries = params.country ? params.country.split(',').filter(Boolean) : []
  const selectedTypes = params.productType ? params.productType.split(',').filter(Boolean) : []
  const selectedResourceTypes = params.resourceType ? params.resourceType.split(',').filter(Boolean) : []
  const selectedDateRanges = params.dateRange ? params.dateRange.split(',').filter(Boolean) : []
  const startDateParam = params.startDate || ''
  const endDateParam = params.endDate || ''
  const sort = params.sort || 'newest'

  // Map filters to Contentful's where input (excluding date filter which is evaluated against authoritative publication dates)
  const where: Record<string, any> = {}

  if (search) {
    where.title_contains = search
  }

  if (selectedTypes.length > 0) {
    where.productType_in = selectedTypes
  }

  if (selectedResourceTypes.length > 0) {
    where.resourceType_in = selectedResourceTypes
  }

  const queryCountries = getCountriesForQuery(selectedAgencies, selectedCountries)
  if (queryCountries && queryCountries.length > 0) {
    where.country_in = queryCountries
  }

  const hasDateFilter = Boolean(startDateParam || endDateParam || selectedDateRanges.length > 0)

  // Fetch items from Contentful (fetch larger batch when date filtering/sorting to filter accurately on authoritative dates)
  const fetchLimit = hasDateFilter ? 1000 : 1000
  const fetchSkip = 0

  let resources: any[] = []
  let total = 0
  let errorMsg = ''

  try {
    const data = await graphQlClient<any>(resourcesQuery, ['resources'], {
      limit: fetchLimit,
      skip: fetchSkip,
      where,
    })

    if (data?.data?.resourcesCollection) {
      let allItems = (data.data.resourcesCollection.items || []).filter(Boolean)

      // 1. Filter items by authoritative publication date (extractResourceDate)
      if (hasDateFilter) {
        allItems = allItems.filter((item: any) => {
          const pubDateStr = extractResourceDate(item)
          if (!pubDateStr) return false
          const itemTime = new Date(pubDateStr).getTime()
          if (isNaN(itemTime)) return false

          if (startDateParam && itemTime < new Date(startDateParam).getTime()) return false
          if (endDateParam && itemTime > new Date(endDateParam).getTime()) return false

          if (selectedDateRanges.length > 0 && !startDateParam && !endDateParam) {
            const matchRange = selectedDateRanges.some((range) => {
              if (range === '2026') return itemTime >= new Date('2026-01-01T00:00:00Z').getTime() && itemTime <= new Date('2026-12-31T23:59:59Z').getTime()
              if (range === '2025') return itemTime >= new Date('2025-01-01T00:00:00Z').getTime() && itemTime <= new Date('2025-12-31T23:59:59Z').getTime()
              if (range === '2024') return itemTime >= new Date('2024-01-01T00:00:00Z').getTime() && itemTime <= new Date('2024-12-31T23:59:59Z').getTime()
              if (range === '2023-earlier') return itemTime <= new Date('2023-12-31T23:59:59Z').getTime()
              return true
            })
            if (!matchRange) return false
          }
          return true
        })
      }

      // 2. Sort items by authoritative publication date or title
      allItems.sort((a: any, b: any) => {
        if (sort === 'oldest') {
          const tA = new Date(extractResourceDate(a) || 0).getTime()
          const tB = new Date(extractResourceDate(b) || 0).getTime()
          return tA - tB
        } else if (sort === 'alphabetical') {
          return (a.title || '').localeCompare(b.title || '')
        } else if (sort === 'alphabetical-desc') {
          return (b.title || '').localeCompare(a.title || '')
        } else {
          // 'newest' (default)
          const tA = new Date(extractResourceDate(a) || 0).getTime()
          const tB = new Date(extractResourceDate(b) || 0).getTime()
          return tB - tA
        }
      })

      total = allItems.length
      resources = allItems.slice(skip, skip + limit)
    } else {
      errorMsg = 'Unable to fetch resources. Please check your connection.'
    }
  } catch (err) {
    console.error('Error fetching resources:', err)
    errorMsg = 'An unexpected error occurred. Please try again later.'
  }

  return (
    <main className="min-h-screen bg-background pt-24 pb-20">
      <ResourcesFeed
        initialResources={resources}
        totalCount={total}
        currentPage={page}
        pageSize={limit}
        errorMessage={errorMsg}
      />
    </main>
  )
}
