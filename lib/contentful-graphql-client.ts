export default async function graphQlClient<T>(
  query: string,
  tags: string[],
  variables?: Record<string, any>
): Promise<T> {
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
    next: { tags: ['contentful', ...tags] },
  })

  if (!response.ok) {
    console.error(`Failed to fetch from Contentful: ${response.status} ${response.statusText}`)
    return null as T
  }

  const json = await response.json()

  if (json.errors) {
    // Filter out UNRESOLVABLE_LINK errors — these are expected when Contentful
    // has stale references and are handled by filter(Boolean) on the consumer side.
    const realErrors = json.errors.filter(
      (e: { extensions?: { contentful?: { code?: string } } }) =>
        e?.extensions?.contentful?.code !== 'UNRESOLVABLE_LINK'
    )
    if (realErrors.length > 0) {
      console.error(`Contentful GraphQL errors: ${JSON.stringify(realErrors)}`)
    }
    if (!json.data) return null as T
    // Fall through and return the partial data (nulls filtered out by consumer)
  }

  return json
}
