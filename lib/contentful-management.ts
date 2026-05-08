/**
 * Contentful Management API helper
 * Uses the REST API directly (no SDK needed) to create and publish entries.
 */

const SPACE_ID = process.env.CONTENTFUL_SPACE_ID!
const ENV_ID = process.env.CONTENTFUL_ENVIRONMENT_ID ?? 'master'
const MGMT_TOKEN = process.env.CONTENTFUL_MANAGEMENT_TOKEN!

const BASE = `https://api.contentful.com/spaces/${SPACE_ID}/environments/${ENV_ID}`

function mgmtHeaders(extras: Record<string, string> = {}) {
  return {
    Authorization: `Bearer ${MGMT_TOKEN}`,
    'Content-Type': 'application/vnd.contentful.management.v1+json',
    ...extras,
  }
}

// ─── Get existing resource item titles for deduplication ────────────────────

export async function getExistingResourceTitles(): Promise<Set<string>> {
  const res = await fetch(
    `${BASE}/entries?content_type=resourceItem&limit=1000&select=fields.title`,
    { headers: mgmtHeaders() }
  )

  if (!res.ok) return new Set()

  const data = (await res.json()) as {
    items: { fields: { title?: { 'en-US': string } } }[]
  }

  return new Set(
    data.items
      .map((e) => e.fields.title?.['en-US'] ?? '')
      .filter(Boolean)
  )
}

// ─── Create a ResourceItem entry ─────────────────────────────────────────────

export async function createResourceItem(data: {
  title: string
  shortDescription: string
  country: string
  productType: string
  resourceType: string
  videoUrl?: string | null
}): Promise<{ sys: { id: string } }> {
  const fields: Record<string, Record<string, unknown>> = {
    title: { 'en-US': data.title },
    shortDescription: { 'en-US': data.shortDescription },
    country: { 'en-US': data.country },
    productType: { 'en-US': data.productType },
    resourceType: { 'en-US': data.resourceType },
  }

  if (data.videoUrl) {
    fields.videoUrl = { 'en-US': data.videoUrl }
  }

  // Create the entry
  const createRes = await fetch(`${BASE}/entries`, {
    method: 'POST',
    headers: mgmtHeaders({ 'X-Contentful-Content-Type': 'resourceItem' }),
    body: JSON.stringify({ fields }),
  })

  if (!createRes.ok) {
    const err = await createRes.json()
    throw new Error(`Failed to create resourceItem: ${JSON.stringify(err)}`)
  }

  const entry = (await createRes.json()) as { sys: { id: string; version: number } }

  // Publish the entry
  await fetch(`${BASE}/entries/${entry.sys.id}/published`, {
    method: 'PUT',
    headers: mgmtHeaders({ 'X-Contentful-Version': String(entry.sys.version) }),
  })

  return entry
}

// ─── Link entry to the ResourcePage ──────────────────────────────────────────

export async function addResourceToResourcePage(entryId: string): Promise<void> {
  // Get existing resource page
  const listRes = await fetch(
    `${BASE}/entries?content_type=resourcePage&limit=1`,
    { headers: mgmtHeaders() }
  )

  if (!listRes.ok) return

  const listData = (await listRes.json()) as {
    items: {
      sys: { id: string; version: number }
      fields: {
        resources?: {
          'en-US': { sys: { type: string; linkType: string; id: string } }[]
        }
      }
    }[]
  }

  const newLink = { sys: { type: 'Link', linkType: 'Entry', id: entryId } }

  if (listData.items.length === 0) {
    // No resource page yet — create one
    const createRes = await fetch(`${BASE}/entries`, {
      method: 'POST',
      headers: mgmtHeaders({ 'X-Contentful-Content-Type': 'resourcePage' }),
      body: JSON.stringify({
        fields: { resources: { 'en-US': [newLink] } },
      }),
    })
    if (!createRes.ok) return
    const page = (await createRes.json()) as { sys: { id: string; version: number } }
    await fetch(`${BASE}/entries/${page.sys.id}/published`, {
      method: 'PUT',
      headers: mgmtHeaders({ 'X-Contentful-Version': String(page.sys.version) }),
    })
    return
  }

  const page = listData.items[0]
  const current = page.fields.resources?.['en-US'] ?? []

  // Skip if already linked
  if (current.some((r) => r.sys.id === entryId)) return

  const updated = [...current, newLink]

  // Update the page entry
  const updateRes = await fetch(`${BASE}/entries/${page.sys.id}`, {
    method: 'PUT',
    headers: mgmtHeaders({ 'X-Contentful-Version': String(page.sys.version) }),
    body: JSON.stringify({
      fields: {
        ...page.fields,
        resources: { 'en-US': updated },
      },
    }),
  })

  if (!updateRes.ok) return

  const updatedPage = (await updateRes.json()) as { sys: { id: string; version: number } }

  await fetch(`${BASE}/entries/${updatedPage.sys.id}/published`, {
    method: 'PUT',
    headers: mgmtHeaders({ 'X-Contentful-Version': String(updatedPage.sys.version) }),
  })
}
