import { NextRequest, NextResponse } from 'next/server'
import Parser from 'rss-parser'
import { revalidatePath } from 'next/cache'
import { classifyResource } from '@/lib/ai-classify'
import {
  createResourceItem,
  addResourceToResourcePage,
  getExistingResourceTitles,
} from '@/lib/contentful-management'

interface FeedConfig {
  name: string
  agency: string
  url: string
}

const FEEDS: FeedConfig[] = [
  {
    name: 'FDA Press Releases',
    agency: 'FDA',
    url: 'https://www.fda.gov/about-fda/contact-fda/stay-informed/rss-feeds/press-releases/rss.xml',
  },
  {
    name: 'Federal Register (FDA)',
    agency: 'FDA',
    url: 'https://www.federalregister.gov/api/v1/documents.rss?conditions%5Bagencies%5D%5B%5D=food-and-drug-administration',
  },
  {
    name: 'GovInfo Federal Register',
    agency: 'OTHER',
    url: 'https://www.govinfo.gov/rss/fr.xml',
  },
]

// Max items to process per feed per run (to stay within Vercel timeout)
const MAX_PER_FEED = 5

export async function GET(request: NextRequest) {
  // Auth: accepts Vercel cron header OR a manual token for testing
  const authHeader = request.headers.get('authorization')
  const manualToken = request.nextUrl.searchParams.get('token')

  const isVercelCron = authHeader === `Bearer ${process.env.CRON_SECRET}`
  const isManualTrigger = manualToken === process.env.INGEST_AUTH_TOKEN

  if (!isVercelCron && !isManualTrigger) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  if (!process.env.CONTENTFUL_MANAGEMENT_TOKEN) {
    return NextResponse.json(
      { error: 'CONTENTFUL_MANAGEMENT_TOKEN is not configured' },
      { status: 500 }
    )
  }

  const parser = new Parser({ timeout: 10000 })
  const existingTitles = await getExistingResourceTitles()

  let created = 0
  let skipped = 0
  const errors: string[] = []
  const log: string[] = []

  for (const feed of FEEDS) {
    try {
      const parsed = await parser.parseURL(feed.url)
      log.push(`[${feed.name}] fetched ${parsed.items.length} items`)

      for (const item of parsed.items.slice(0, MAX_PER_FEED)) {
        const title = (item.title ?? 'Untitled').slice(0, 200).trim()

        // Skip if already in Contentful
        if (existingTitles.has(title)) {
          skipped++
          continue
        }

        const description =
          item.contentSnippet ?? item.content ?? item.summary ?? ''

        // AI classify the item
        const classification = await classifyResource(title, description, feed.agency)

        // Create the ResourceItem entry in Contentful
        const entry = await createResourceItem({
          title,
          shortDescription: classification.shortDescription,
          country: classification.country,
          productType: classification.productType,
          resourceType: classification.resourceType,
          sourceUrl: item.link ?? null,
        })

        // Link it to the ResourcePage
        await addResourceToResourcePage(entry.sys.id)

        existingTitles.add(title)
        created++
        log.push(`  ✓ Created: "${title.slice(0, 60)}"`)
      }
    } catch (err) {
      const msg = `[${feed.name}] ${String(err)}`
      errors.push(msg)
      log.push(`  ✗ Error: ${msg}`)
    }
  }

  // Bust the Next.js ISR cache so the resources page shows new content
  revalidatePath('/resources')

  return NextResponse.json({
    created,
    skipped,
    errors,
    log,
    timestamp: new Date().toISOString(),
  })
}
