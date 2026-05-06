export default async function graphQlClient<T>(query: string, tags: string[]): Promise<T> {
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
    body: JSON.stringify({ query }),
    next: { tags: ['contentful', ...tags] },
  })

  if (!response.ok) {
    const cause = await response.json()
    throw new Error(`Failed to fetch from Contentful \n- cause: ${JSON.stringify(cause)}`, { cause })
  }

  return response.json()
}
