import { NextRequest, NextResponse } from 'next/server'
import { revalidatePath } from 'next/cache'
import { IngestionLogger } from '@/lib/ingestion/logger'
import { classifyResourceDeterministic } from '@/lib/ingestion/rule-classifier'
import { RssCollector } from '@/lib/ingestion/collectors/rss-collector'
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
  const logger = new IngestionLogger()

  // Auth: accepts Vercel cron header OR a manual token for testing
  const authHeader = request.headers.get('authorization')
  const manualToken = request.nextUrl.searchParams.get('token')

  const isVercelCron = authHeader === `Bearer ${process.env.CRON_SECRET}`
  const isManualTrigger = manualToken === process.env.INGEST_AUTH_TOKEN

  if (!isVercelCron && !isManualTrigger) {
    logger.warn('Unauthorized trigger attempt', { authHeader, manualToken })
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  if (!process.env.CONTENTFUL_MANAGEMENT_TOKEN) {
    logger.error('CONTENTFUL_MANAGEMENT_TOKEN is not configured')
    return NextResponse.json(
      { error: 'CONTENTFUL_MANAGEMENT_TOKEN is not configured' },
      { status: 500 }
    )
  }

  logger.info('Starting daily resources ingestion')
  const collectors = FEEDS.map(
    feed => new RssCollector(feed.name, feed.agency, feed.url)
  )

  let created = 0
  let skipped = 0
  const existingTitles = await getExistingResourceTitles()

  for (const collector of collectors) {
    try {
      logger.info(`Fetching feed resources`, { feed: collector.name, agency: collector.agency })
      const items = await collector.collect()
      logger.info(`Fetched items count`, { feed: collector.name, count: items.length })

      for (const item of items.slice(0, MAX_PER_FEED)) {
        const title = item.title.slice(0, 200).trim()

        // Skip if already in Contentful
        if (existingTitles.has(title)) {
          skipped++
          continue
        }

        const description = item.description

        // Rule-based deterministic classification
        const classification = classifyResourceDeterministic(title, description, item.agency)

        logger.info(`Creating resource item`, { title, classification })

        // Create the ResourceItem entry in Contentful
        const entry = await createResourceItem({
          title,
          shortDescription: classification.shortDescription,
          country: classification.country,
          productType: classification.productType,
          resourceType: classification.resourceType,
          sourceUrl: item.sourceUrl,
        })

        // Link it to the ResourcePage
        await addResourceToResourcePage(entry.sys.id)

        existingTitles.add(title)
        created++
        logger.info(`Created resource entry`, { title: title.slice(0, 60), entryId: entry.sys.id })
      }
    } catch (err) {
      logger.error(`Error processing feed`, err, { feed: collector.name })
    }
  }

  // Bust the Next.js ISR cache so the resources page shows new content
  try {
    revalidatePath('/resources')
    logger.info('Cache revalidated for /resources')
  } catch (err) {
    logger.error('Failed to revalidate cache', err)
  }

  logger.info('Ingestion run finished', { created, skipped, totalErrors: logger.errors.length })

  return NextResponse.json({
    created,
    skipped,
    errors: logger.errors,
    log: logger.log,
    timestamp: new Date().toISOString(),
  })
}
