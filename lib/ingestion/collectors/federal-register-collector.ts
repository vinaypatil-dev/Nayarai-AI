import { HistoricalCollector, CollectedItem } from '../types';

const BROWSER_HEADERS = {
  'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
  'Accept': 'application/json',
};

interface FederalRegisterDocument {
  title: string;
  abstract: string | null;
  html_url: string;
  publication_date: string;
  document_number: string;
  type: string;
}

interface FederalRegisterResponse {
  count: number;
  total_pages: number;
  next_page_url: string | null;
  results: FederalRegisterDocument[];
}

/**
 * Federal Register API Collector.
 * 
 * Uses the public Federal Register REST API (no key required) to fetch
 * FDA regulatory documents with date-range filtering and pagination.
 * 
 * API constraints:
 * - Max 2000 results per query (use monthly batches to stay under)
 * - Pagination via next_page_url in response
 * - Fields are selectable to reduce payload size
 */
export class FederalRegisterCollector implements HistoricalCollector {
  public name = 'Federal Register (FDA Historical)';
  public agency = 'FDA';

  private static readonly BASE_URL = 'https://www.federalregister.gov/api/v1/documents.json';
  private static readonly FIELDS = [
    'title', 'abstract', 'html_url', 'publication_date', 'document_number', 'type', 'agencies'
  ];
  private static readonly PER_PAGE = 20;

  /**
   * Fetch latest documents (no date filter). Used for daily ingestion compatibility.
   */
  async collect(): Promise<CollectedItem[]> {
    const params = new URLSearchParams();
    params.set('conditions[agencies][]', 'food-and-drug-administration');
    params.set('per_page', String(FederalRegisterCollector.PER_PAGE));
    for (const field of FederalRegisterCollector.FIELDS) {
      params.append('fields[]', field);
    }

    const url = `${FederalRegisterCollector.BASE_URL}?${params.toString()}`;
    const data = await this.fetchPage(url);
    return data.results.map(doc => this.toCollectedItem(doc));
  }

  /**
   * Fetch all FDA documents published within a date range.
   * Auto-paginates through next_page_url responses.
   */
  async fetchHistorical(startDate: Date, endDate: Date): Promise<CollectedItem[]> {
    const startStr = this.formatDate(startDate);
    const endStr = this.formatDate(endDate);

    const params = new URLSearchParams();
    params.set('conditions[agencies][]', 'food-and-drug-administration');
    params.set('conditions[publication_date][gte]', startStr);
    params.set('conditions[publication_date][lte]', endStr);
    params.set('per_page', String(FederalRegisterCollector.PER_PAGE));
    for (const field of FederalRegisterCollector.FIELDS) {
      params.append('fields[]', field);
    }

    const items: CollectedItem[] = [];
    let url: string | null = `${FederalRegisterCollector.BASE_URL}?${params.toString()}`;

    while (url) {
      const data = await this.fetchPage(url);
      for (const doc of data.results) {
        items.push(this.toCollectedItem(doc));
      }
      url = data.next_page_url;

      // Small delay between paginated requests to be polite to the API
      if (url) {
        await this.delay(300);
      }
    }

    return items;
  }

  private async fetchPage(url: string): Promise<FederalRegisterResponse> {
    const res = await fetch(url, { headers: BROWSER_HEADERS });

    if (!res.ok) {
      throw new Error(
        `Federal Register API error: ${res.status} ${res.statusText} for ${url}`
      );
    }

    return (await res.json()) as FederalRegisterResponse;
  }

  private toCollectedItem(doc: FederalRegisterDocument): CollectedItem {
    return {
      title: doc.title ?? 'Untitled',
      description: doc.abstract ?? '',
      sourceUrl: doc.html_url ?? null,
      publishDate: doc.publication_date ? new Date(doc.publication_date) : undefined,
      agency: this.agency,
      rawItem: doc,
      metadata: {
        agencies: (doc as any).agencies,
      },
    };
  }

  private formatDate(date: Date): string {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}
