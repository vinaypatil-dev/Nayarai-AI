import React from 'react'
import { ResourcesFeed } from '@/components/resources-feed'
import graphQlClient from '@/lib/contentful-graphql-client'
import { ResourcePageResponse } from '@/lib/types/contentful'

export const dynamic = 'force-dynamic'

const query = `{
  resourcePageCollection(limit: 1) {
    items {
      resourcesCollection(limit: 1000) {
        items {
          sys {
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
  }
}`

export default async function ResourcesPage() {
  const data = await graphQlClient<ResourcePageResponse>(query, ['resources'])
  // Filter out null items that result from UNRESOLVABLE_LINK errors (deleted Contentful entries)
  const resources = (data?.data?.resourcePageCollection?.items?.[0]?.resourcesCollection?.items || []).filter(Boolean)

  return (
    <main className="min-h-screen bg-background pt-24 pb-20">
      <ResourcesFeed initialResources={resources} />
    </main>
  )
}
