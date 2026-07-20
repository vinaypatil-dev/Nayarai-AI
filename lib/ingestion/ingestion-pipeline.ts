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
export async function processItem(
  item: CollectedItem,
  existingTitles: Set<string>,
  logger: IngestionLogger,
  options: ProcessItemOptions
): Promise<'created' | 'skipped' | 'failed'> {
  const title = item.title.slice(0, 200).trim();

  // Duplicate detection
  if (existingTitles.has(title)) {
    return 'skipped';
  }

  const description = item.description;
  const classification = classifyResourceDeterministic(title, description, item.agency);

  if (options.dryRun) {
    logger.info('Dry run — would create resource', {
      title,
      classification,
      sourceUrl: item.sourceUrl,
    });
    existingTitles.add(title);
    return 'created';
  }

  try {
    logger.info('Creating resource item', { title, classification });

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
