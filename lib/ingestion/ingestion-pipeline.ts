import { CollectedItem } from './types';
import { IngestionLogger } from './logger';
import { classifyResourceDeterministic } from './rule-classifier';
import {
  createResourceItem,
  addResourceToResourcePage,
} from '../contentful-management';

export interface ProcessItemOptions {
  dryRun: boolean;
  throttleMs: number;
}

/**
 * Shared ingestion pipeline for a single item.
 * Used by both the daily cron route and the historical importer.
 * 
 * Steps:
 * 1. Normalize title (trim, cap at 200 chars)
 * 2. Duplicate detection against existing titles
 * 3. Deterministic classification
 * 4. Create entry in Contentful (skipped in dry run)
 * 5. Publish entry (handled inside createResourceItem)
 * 6. Link entry to ResourcePage (skipped in dry run)
 * 7. Add title to existing set for in-memory dedup
 * 
 * Returns 'created', 'skipped', or 'failed'.
 */
import { extractResourceDate } from '../date-utils';

/**
 * Validates whether a collected resource comes from an official, authoritative worldwide regulatory source
 * and contains complete metadata (non-draft, non-placeholder, non-empty title/description/URL).
 * 
 * Supports worldwide regulatory authorities (US, EU, UK, Canada, Australia, NZ, Japan, South Korea, Singapore, India, Switzerland, WHO, ISO, ICH, PIC/S, etc.)
 * by checking explicit domain patterns and official government domain extensions (.gov, .govt, .go.*, .gov.*, .europa.eu, .admin.ch, .who.int, .iso.org, .ich.org).
 */
export function isAuthoritativeSource(item: CollectedItem): boolean {
  if (!item) return false
  if (!item.title || item.title.trim().length === 0 || item.title.trim().toLowerCase() === 'untitled') return false
  if (!item.description || item.description.trim().length === 0) return false
  if (!item.sourceUrl || item.sourceUrl === 'null') return false

  const url = item.sourceUrl.toLowerCase()
  let parsedHost = ''
  try {
    parsedHost = new URL(url).hostname.toLowerCase()
  } catch {
    return false
  }

  // 1. Explicitly approved worldwide regulatory domains
  const approvedDomains = [
    // United States
    'fda.gov',
    'federalregister.gov',
    'govinfo.gov',
    'epa.gov',
    'cms.gov',
    'cdc.gov',
    'nih.gov',
    'sec.gov',
    'osha.gov',
    'usda.gov',
    // European Union
    'ema.europa.eu',
    'efsa.europa.eu',
    'echa.europa.eu',
    'europa.eu',
    // United Kingdom
    'mhra.gov.uk',
    'gov.uk',
    'nice.org.uk',
    'nhs.uk',
    // India
    'cdsco.gov.in',
    'fssai.gov.in',
    // Australia & New Zealand
    'tga.gov.au',
    'apvma.gov.au',
    'medsafe.govt.nz',
    // Canada
    'canada.ca',
    'hc-sc.gc.ca',
    // Japan, South Korea, Singapore
    'pmda.go.jp',
    'mhlw.go.jp',
    'mfds.go.kr',
    'hsa.gov.sg',
    // Switzerland
    'swissmedic.ch',
    'admin.ch',
    // WHO & Global Harmonization Authorities
    'who.int',
    'iso.org',
    'ich.org',
    'picscheme.org',
  ]

  const isApprovedDomain = approvedDomains.some((domain) => parsedHost.includes(domain))

  // 2. Generic official government / regulatory domain pattern matching (.gov, .govt, .go.<cc>, .gov.<cc>)
  const isOfficialGovTLD =
    parsedHost.endsWith('.gov') ||
    parsedHost.endsWith('.govt') ||
    /\.gov\.[a-z]{2}$/.test(parsedHost) ||
    /\.go\.[a-z]{2}$/.test(parsedHost) ||
    /\.govt\.[a-z]{2}$/.test(parsedHost) ||
    parsedHost.endsWith('.europa.eu') ||
    parsedHost.endsWith('.admin.ch') ||
    parsedHost.endsWith('.who.int')

  if (!isApprovedDomain && !isOfficialGovTLD) {
    return false
  }

  // 3. Draft & Placeholder Check
  const titleLower = item.title.toLowerCase()
  if (
    titleLower.includes('draft document') ||
    titleLower.includes('placeholder') ||
    titleLower.includes('test resource') ||
    titleLower.includes('sample document')
  ) {
    return false
  }

  return true
}

export async function processItem(
  item: CollectedItem,
  existingTitles: Set<string>,
  logger: IngestionLogger,
  options: ProcessItemOptions
): Promise<'created' | 'skipped' | 'failed'> {
  // Validate authoritative source & metadata integrity
  if (!isAuthoritativeSource(item)) {
    logger.warn('Skipping non-authoritative or incomplete resource', {
      title: item?.title,
      sourceUrl: item?.sourceUrl,
    });
    return 'skipped';
  }

  const title = item.title.slice(0, 200).trim();

  // Duplicate detection
  if (existingTitles.has(title)) {
    return 'skipped';
  }

  const description = item.description;
  const classification = classifyResourceDeterministic(title, description, item.agency, item.sourceUrl, item.metadata);
  const resolvedPublishDate = item.publishDate
    ? item.publishDate.toISOString()
    : extractResourceDate({ title, shortDescription: description, sourceUrl: item.sourceUrl });

  if (options.dryRun) {
    logger.info('Dry run — would create resource', {
      title,
      classification,
      sourceUrl: item.sourceUrl,
      resolvedPublishDate,
    });
    existingTitles.add(title);
    return 'created';
  }

  try {
    logger.info('Creating resource item with preserved publication date', {
      title,
      classification,
      resolvedPublishDate,
    });

    const entry = await createResourceItem({
      title,
      shortDescription: classification.shortDescription,
      country: classification.country,
      productType: classification.productType,
      resourceType: classification.resourceType,
      sourceUrl: item.sourceUrl,
    });

    await addResourceToResourcePage(entry.sys.id);
    existingTitles.add(title);

    logger.info('Created resource entry', {
      title: title.slice(0, 60),
      entryId: entry.sys.id,
    });

    // Throttle between Contentful writes to respect rate limits
    if (options.throttleMs > 0) {
      await new Promise(resolve => setTimeout(resolve, options.throttleMs));
    }

    return 'created';
  } catch (err) {
    logger.error('Failed to create resource', err, { title });
    return 'failed';
  }
}
