import { HistoricalCollector, CollectedItem } from '../types';

export class MhraCollector implements HistoricalCollector {
  public name = 'MHRA Collector';
  public agency = 'MHRA';

  private static readonly BASE_URL = 'https://www.gov.uk/api/search.json';
  private static readonly ORG_FILTER = 'medicines-and-healthcare-products-regulatory-agency';

  async collect(): Promise<CollectedItem[]> {
    const params = new URLSearchParams();
    params.set('filter_organisations[]', MhraCollector.ORG_FILTER);
    params.set('count', '20');
    params.set('order', '-public_timestamp');

    const url = `${MhraCollector.BASE_URL}?${params.toString()}`;
    const res = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'application/json',
      }
    });

    if (!res.ok) {
      throw new Error(`Failed to fetch MHRA daily updates: Status ${res.status} ${res.statusText}`);
    }

    const data = await res.json();
    if (!data || !Array.isArray(data.results)) {
      return [];
    }

    return data.results.map((doc: any) => this.toCollectedItem(doc));
  }

  async fetchHistorical(startDate: Date, endDate: Date): Promise<CollectedItem[]> {
    const startStr = this.formatDate(startDate);
    const endStr = this.formatDate(endDate);

    const items: CollectedItem[] = [];
    let startOffset = 0;
    const countLimit = 100;
    let hasMore = true;

    while (hasMore) {
      const params = new URLSearchParams();
      params.set('filter_organisations[]', MhraCollector.ORG_FILTER);
      params.set('filter_public_timestamp', `from:${startStr},to:${endStr}`);
      params.set('count', String(countLimit));
      params.set('start', String(startOffset));
      params.set('order', 'public_timestamp'); // Oldest first for batches

      const url = `${MhraCollector.BASE_URL}?${params.toString()}`;
      const res = await fetch(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
          'Accept': 'application/json',
        }
      });

      if (!res.ok) {
        throw new Error(`Failed to fetch MHRA historical data at offset ${startOffset}: Status ${res.status} ${res.statusText}`);
      }

      const data = await res.json();
      if (!data || !Array.isArray(data.results) || data.results.length === 0) {
        hasMore = false;
        break;
      }

      for (const doc of data.results) {
        items.push(this.toCollectedItem(doc));
      }

      startOffset += data.results.length;

      if (data.results.length < countLimit) {
        hasMore = false;
      } else {
        // Small delay to be respectful of GOV.UK API limits
        await new Promise(resolve => setTimeout(resolve, 300));
      }
    }

    return items;
  }

  private toCollectedItem(doc: any): CollectedItem {
    return {
      title: doc.title ?? 'Untitled',
      description: doc.description ?? doc.summary ?? '',
      sourceUrl: doc.link ? (doc.link.startsWith('http') ? doc.link : `https://www.gov.uk${doc.link}`) : null,
      publishDate: doc.public_timestamp ? new Date(doc.public_timestamp) : undefined,
      agency: this.agency,
      rawItem: doc,
    };
  }

  private formatDate(date: Date): string {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
  }
}
