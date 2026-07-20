import * as fs from 'fs/promises';
import * as path from 'path';
import { ProgressStore, HistoricalImportProgress } from './types';

/**
 * JSON file-based progress store.
 * Stores all collector progress in a single JSON file at the project root.
 * 
 * Future alternatives:
 * - ContentfulProgressStore: store progress as a Contentful entry
 * - PostgresProgressStore: store progress in a database table
 * Both would implement the same ProgressStore interface.
 */
export class JsonProgressStore implements ProgressStore {
  private filePath: string;

  constructor(filePath?: string) {
    this.filePath = filePath ?? path.join(process.cwd(), '.ingestion-progress.json');
  }

  async load(collector: string): Promise<HistoricalImportProgress | null> {
    try {
      const raw = await fs.readFile(this.filePath, 'utf-8');
      const data = JSON.parse(raw) as Record<string, HistoricalImportProgress>;
      return data[collector] ?? null;
    } catch {
      // File doesn't exist or is invalid — no prior progress
      return null;
    }
  }

  async save(progress: HistoricalImportProgress): Promise<void> {
    let data: Record<string, HistoricalImportProgress> = {};
    try {
      const raw = await fs.readFile(this.filePath, 'utf-8');
      data = JSON.parse(raw);
    } catch {
      // File doesn't exist yet — start fresh
    }

    data[progress.collector] = progress;
    await fs.writeFile(this.filePath, JSON.stringify(data, null, 2), 'utf-8');
  }

  async clear(collector: string): Promise<void> {
    try {
      const raw = await fs.readFile(this.filePath, 'utf-8');
      const data = JSON.parse(raw) as Record<string, HistoricalImportProgress>;
      delete data[collector];
      await fs.writeFile(this.filePath, JSON.stringify(data, null, 2), 'utf-8');
    } catch {
      // Nothing to clear
    }
  }
}
