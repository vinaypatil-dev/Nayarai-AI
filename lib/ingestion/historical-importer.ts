import {
  HistoricalCollector,
  HistoricalImportConfig,
  HistoricalImportProgress,
  ProgressStore,
} from './types';
import { IngestionLogger } from './logger';
import { processItem } from './ingestion-pipeline';
import { getExistingResourceTitles } from '../contentful-management';

interface BatchRange {
  start: Date;
  end: Date;
  label: string; // e.g. "2024-01"
}

interface ImportSummary {
  collector: string;
  totalImported: number;
  totalSkipped: number;
  totalFailed: number;
  batchesCompleted: number;
  totalBatches: number;
  durationMs: number;
}

/**
 * Historical Importer
 * 
 * Orchestrates historical regulatory document imports by:
 * 1. Generating monthly date-range batches from config
 * 2. Checking ProgressStore for resume point
 * 3. Calling HistoricalCollector.fetchHistorical() per batch
 * 4. Piping items through the shared ingestion pipeline
 * 5. Saving progress after each completed batch
 * 6. Reporting detailed batch-level and aggregate statistics
 */
export class HistoricalImporter {
  private collectors: Map<string, HistoricalCollector>;
  private progressStore: ProgressStore;
  private logger: IngestionLogger;

  constructor(
    collectors: HistoricalCollector[],
    progressStore: ProgressStore,
    logger: IngestionLogger
  ) {
    this.collectors = new Map(
      collectors.map(c => [c.name, c])
    );
    this.progressStore = progressStore;
    this.logger = logger;
  }

  /**
   * Run the historical import with the given configuration.
   */
  async runImport(config: HistoricalImportConfig): Promise<ImportSummary[]> {
    const summaries: ImportSummary[] = [];

    // Load existing Contentful titles once for dedup across all collectors
    this.logger.info('Loading existing resource titles for deduplication');
    const existingTitles = config.dryRun
      ? new Set<string>()
      : await getExistingResourceTitles();
    this.logger.info('Loaded existing titles', { count: existingTitles.size });

    for (const [name, collector] of this.collectors) {
      // Filter by agency selection if specified
      if (config.agencies.length > 0 && !config.agencies.includes(name)) {
        this.logger.info('Skipping collector (not in agency selection)', { collector: name });
        continue;
      }

      const summary = await this.runCollectorImport(collector, config, existingTitles);
      summaries.push(summary);
    }

    return summaries;
  }

  private async runCollectorImport(
    collector: HistoricalCollector,
    config: HistoricalImportConfig,
    existingTitles: Set<string>
  ): Promise<ImportSummary> {
    const importStart = Date.now();
    const batches = this.generateBatches(config);

    this.logger.info(`Starting historical import for ${collector.name}`, {
      totalBatches: batches.length,
      dateRange: `${batches[0]?.label ?? 'none'} to ${batches[batches.length - 1]?.label ?? 'none'}`,
      dryRun: config.dryRun,
    });

    // Load prior progress for resume
    let totalImported = 0;
    let totalSkipped = 0;
    let totalFailed = 0;
    let batchesCompleted = 0;

    if (config.resume) {
      const prior = await this.progressStore.load(collector.name);
      if (prior) {
        totalImported = prior.totalImported;
        totalSkipped = prior.totalSkipped;
        totalFailed = prior.totalFailed;
        this.logger.info('Resuming from checkpoint', {
          collector: collector.name,
          lastCompletedBatch: prior.lastCompletedBatch,
          totalImported: prior.totalImported,
        });
      }
    }

    for (const batch of batches) {
      // Skip already-completed batches on resume
      if (config.resume) {
        const prior = await this.progressStore.load(collector.name);
        if (prior && batch.end.toISOString() <= prior.lastCompletedBatch) {
          batchesCompleted++;
          continue;
        }
      }

      const batchStart = Date.now();

      try {
        this.logger.info(`Fetching batch ${batch.label}`, {
          collector: collector.name,
          batchStart: batch.start.toISOString(),
          batchEnd: batch.end.toISOString(),
        });

        const items = await collector.fetchHistorical(batch.start, batch.end);
        const itemsToProcess = items.slice(0, config.maxItemsPerBatch);

        let batchImported = 0;
        let batchSkipped = 0;
        let batchFailed = 0;

        for (const item of itemsToProcess) {
          const result = await processItem(item, existingTitles, this.logger, {
            dryRun: config.dryRun,
            throttleMs: config.throttleMs,
          });

          switch (result) {
            case 'created':
              batchImported++;
              totalImported++;
              break;
            case 'skipped':
              batchSkipped++;
              totalSkipped++;
              break;
            case 'failed':
              batchFailed++;
              totalFailed++;
              break;
          }
        }

        batchesCompleted++;
        const batchDuration = Date.now() - batchStart;

        // Batch completion report
        this.logger.info('Batch completed', {
          collector: collector.name,
          batchStart: batch.start.toISOString().slice(0, 10),
          batchEnd: batch.end.toISOString().slice(0, 10),
          fetched: items.length,
          processed: itemsToProcess.length,
          imported: batchImported,
          skipped: batchSkipped,
          failed: batchFailed,
          durationMs: batchDuration,
          progress: `${batchesCompleted}/${batches.length}`,
          totalImported,
          totalSkipped,
          totalFailed,
        });

        // Save progress checkpoint
        await this.progressStore.save({
          collector: collector.name,
          lastCompletedBatch: batch.end.toISOString(),
          totalImported,
          totalSkipped,
          totalFailed,
          updatedAt: new Date().toISOString(),
        });

        // Delay between batches to avoid hammering APIs
        if (config.batchDelayMs > 0) {
          await new Promise(resolve => setTimeout(resolve, config.batchDelayMs));
        }
      } catch (err) {
        this.logger.error(`Batch ${batch.label} failed`, err, {
          collector: collector.name,
        });
        totalFailed++;

        // Save progress even on failure so we can resume past this batch
        await this.progressStore.save({
          collector: collector.name,
          lastCompletedBatch: batch.end.toISOString(),
          totalImported,
          totalSkipped,
          totalFailed,
          updatedAt: new Date().toISOString(),
        });
      }
    }

    const totalDuration = Date.now() - importStart;

    this.logger.info('Historical import complete', {
      collector: collector.name,
      totalImported,
      totalSkipped,
      totalFailed,
      batchesCompleted,
      totalBatches: batches.length,
      durationMs: totalDuration,
    });

    return {
      collector: collector.name,
      totalImported,
      totalSkipped,
      totalFailed,
      batchesCompleted,
      totalBatches: batches.length,
      durationMs: totalDuration,
    };
  }

  /**
   * Generate monthly batch ranges from config.
   * Supports --from/--to month overrides for debugging.
   */
  private generateBatches(config: HistoricalImportConfig): BatchRange[] {
    const batches: BatchRange[] = [];

    let startDate: Date;
    let endDate: Date;

    if (config.fromMonth) {
      // Parse YYYY-MM format
      const [year, month] = config.fromMonth.split('-').map(Number);
      startDate = new Date(year, month - 1, 1);
    } else {
      startDate = new Date(config.startYear, 0, 1); // Jan 1 of start year
    }

    if (config.toMonth) {
      const [year, month] = config.toMonth.split('-').map(Number);
      // End of the specified month
      endDate = new Date(year, month, 0);
    } else {
      endDate = new Date(config.endYear, 11, 31); // Dec 31 of end year
    }

    let current = new Date(startDate);

    while (current <= endDate) {
      const batchStart = new Date(current);
      // Advance by batchSizeMonths
      const batchEnd = new Date(
        current.getFullYear(),
        current.getMonth() + config.batchSizeMonths,
        0 // Last day of the final month in this batch
      );

      // Cap batch end to the overall end date
      const effectiveEnd = batchEnd > endDate ? endDate : batchEnd;

      const label = `${batchStart.getFullYear()}-${String(batchStart.getMonth() + 1).padStart(2, '0')}`;

      batches.push({
        start: batchStart,
        end: effectiveEnd,
        label,
      });

      // Move to first day of next batch
      current = new Date(
        current.getFullYear(),
        current.getMonth() + config.batchSizeMonths,
        1
      );
    }

    return batches;
  }
}
