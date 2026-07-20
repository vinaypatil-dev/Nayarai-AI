import { Collector, CollectedItem } from '../types';

/**
 * EMA Collector
 * Extension point for European Medicines Agency updates.
 * TODO: Implement web scraping or API collector for EMA guidance and regulations.
 */
export class EmaCollector implements Collector {
  public name = 'EMA Collector';
  public agency = 'EMA';

  async collect(): Promise<CollectedItem[]> {
    // TODO: Connect to EMA search indexes or scrape EMA guidance webpages
    // 1. Fetch regulatory reviews, news releases, and human medicine updates
    // 2. Map response to CollectedItem format
    // 3. Support date range queries for historical retrieval
    return [];
  }
}
