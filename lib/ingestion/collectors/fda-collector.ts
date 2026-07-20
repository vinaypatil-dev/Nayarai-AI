import { Collector, CollectedItem } from '../types';

/**
 * FDA Collector
 * Extension point for advanced/historical FDA ingestion.
 * Currently, daily FDA ingestion is handled by RssCollector.
 * TODO: Implement openFDA API crawler for comprehensive historical imports (2015-present)
 */
export class FdaCollector implements Collector {
  public name = 'FDA Advanced Collector';
  public agency = 'FDA';

  async collect(): Promise<CollectedItem[]> {
    // TODO: Connect to openFDA API (https://open.fda.gov/)
    // 1. Fetch premarket approvals (510k, PMA), medical device recalls, or guidance documents
    // 2. Map response into CollectedItem arrays
    // 3. Implement date filtering to support historical backfills from 2015
    return [];
  }
}
