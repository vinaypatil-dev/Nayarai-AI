import { Collector, CollectedItem } from '../types';

/**
 * CDSCO Collector
 * Extension point for India's Central Drugs Standard Control Organisation.
 * TODO: Implement web scraping for CDSCO notices page (no standard RSS available).
 */
export class CdscoCollector implements Collector {
  public name = 'CDSCO Collector';
  public agency = 'CDSCO';

  async collect(): Promise<CollectedItem[]> {
    // TODO: Implement web scraping of CDSCO notice board/circulars page
    // 1. Fetch tables containing latest notices and uploaded PDF links
    // 2. Normalize and format as CollectedItem
    return [];
  }
}
