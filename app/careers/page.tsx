import React from 'react'
import { CareersFeed } from '@/components/careers-feed'
import graphQlClient from '@/lib/contentful-graphql-client'
import { CareersPageResponse } from '@/lib/types/contentful'

export const dynamic = 'force-dynamic'

const careersQuery = `{
  careersPageCollection {
    items {
      jobsCollection {
        items {
          title
          shortDescription
          jobDescription
          skills
          jobId
          jobLocation
          jobType
        }
      }
    }
  }
}`

export default async function CareersPage() {
  const data = await graphQlClient<CareersPageResponse>(careersQuery, ['careers'])
  const jobs = data?.data?.careersPageCollection?.items?.[0]?.jobsCollection?.items || []

  return (
    <main className="min-h-screen bg-background">
      <CareersFeed jobs={jobs} />
    </main>
  )
}
