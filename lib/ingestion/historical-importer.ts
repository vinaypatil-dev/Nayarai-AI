import { Collector } from './types';

export interface HistoricalImportConfig {
  startDate: Date;
  endDate: Date;
  limit?: number;
}

/**
 * Historical Importer
 * Extension point for triggering backfills.
 * TODO: Implement historical backfill logic to orchestrate collectors and load archives since 2015.
 */
export class HistoricalImporter {
  private collectors: Collector[];

  constructor(collectors: Collector[]) {
    this.collectors = collectors;
  }

  /**
   * Orchestrates the historical import process for a given date range
   */
  async runImport(config: HistoricalImportConfig): Promise<{ imported: number; failed: number }> {
    console.log(`Starting historical import from ${config.startDate.toISOString()} to ${config.endDate.toISOString()}`);
    
    // TODO:
    // 1. Loop through registered collectors that support historical queries.
    // 2. Fetch resources in batches.
    // 3. Process metadata normalization, PDF downloads, and Contentful ingestion.
    // 4. Implement robust rate-limiting throttling (7 requests/sec limit) to avoid API lockout.
    
    return { imported: 0, failed: 0 };
  }
}
