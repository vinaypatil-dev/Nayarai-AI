import React from 'react'
import { ResourcesFeed } from '@/components/resources-feed'
import graphQlClient from '@/lib/contentful-graphql-client'
import { getCountriesForQuery } from '@/lib/agency-utils'

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
  const sort = params.sort || 'newest'

  // Map filters to Contentful's where input
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

  // Determine sort order
  let order = ['sys_firstPublishedAt_DESC']
  if (sort === 'oldest') {
    order = ['sys_firstPublishedAt_ASC']
  } else if (sort === 'alphabetical') {
    order = ['title_ASC']
  } else if (sort === 'alphabetical-desc') {
    order = ['title_DESC']
  }

  let resources: any[] = []
  let total = 0
  let errorMsg = ''

  try {
    const data = await graphQlClient<any>(resourcesQuery, ['resources'], {
      limit,
      skip,
      where,
      order,
    })

    if (data?.data?.resourcesCollection) {
      resources = (data.data.resourcesCollection.items || []).filter(Boolean)
      total = data.data.resourcesCollection.total || 0
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
