export interface ResourceClassification {
  productType: string;
  country: string;
  shortDescription: string;
  resourceType: string;
}

export interface CollectedItem {
  title: string;
  description: string;
  sourceUrl: string | null;
  publishDate?: Date;
  agency: string;
  rawItem?: any;
}

export interface Collector {
  name: string;
  agency: string;
  collect(): Promise<CollectedItem[]>;
}

// ─── Phase 2: Historical Import Types ────────────────────────────────────────

/**
 * Collector that supports both daily (latest) and historical (date-range) fetches.
 * Extends the base Collector interface so it remains compatible with existing code.
 */
export interface HistoricalCollector extends Collector {
  fetchHistorical(startDate: Date, endDate: Date): Promise<CollectedItem[]>;
}

/**
 * Configuration for a historical import run.
 */
export interface HistoricalImportConfig {
  startYear: number;
  endYear: number;
  /** How many months per batch (default: 1) */
  batchSizeMonths: number;
  /** Max items to process per batch (default: 20) */
  maxItemsPerBatch: number;
  /** Skip Contentful writes when true */
  dryRun: boolean;
  /** Which collector names to run (e.g. ["federal-register"]) */
  agencies: string[];
  /** Delay in ms between Contentful writes (default: 1000) */
  throttleMs: number;
  /** Delay in ms between batches (default: 5000) */
  batchDelayMs: number;
  /** Optional: override start to a specific month (YYYY-MM format) */
  fromMonth?: string;
  /** Optional: override end to a specific month (YYYY-MM format) */
  toMonth?: string;
  /** Resume from last checkpoint when true */
  resume: boolean;
}

/**
 * Progress checkpoint for a single collector, saved after each completed batch.
 */
export interface HistoricalImportProgress {
  collector: string;
  lastCompletedBatch: string; // ISO date string of batch end date
  totalImported: number;
  totalSkipped: number;
  totalFailed: number;
  updatedAt: string;
}

/**
 * Abstraction for persisting import progress.
 * JsonProgressStore is the default implementation.
 * Future implementations (Contentful, PostgreSQL) can swap in without
 * changing the HistoricalImporter.
 */
export interface ProgressStore {
  load(collector: string): Promise<HistoricalImportProgress | null>;
  save(progress: HistoricalImportProgress): Promise<void>;
  clear(collector: string): Promise<void>;
}
