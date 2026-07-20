import Parser from 'rss-parser';
import { HistoricalCollector, CollectedItem } from '../types';

export class EmaCollector implements HistoricalCollector {
  public name = 'EMA Collector';
  public agency = 'EMA';

  private static readonly NEWS_FEED_URL = 'https://www.ema.europa.eu/en/news.xml';
  private static readonly HISTORICAL_JSON_URL = 'https://www.ema.europa.eu/en/documents/report/medicines-output-medicines_json-report_en.json';
  
  private parser: Parser;

  constructor() {
    this.parser = new Parser({
      timeout: 15000,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'application/rss+xml, application/xml, text/xml, */*'
      }
    });
  }

  async collect(): Promise<CollectedItem[]> {
    const res = await fetch(EmaCollector.NEWS_FEED_URL, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      }
    });

    if (!res.ok) {
      throw new Error(`Failed to fetch EMA news feed: Status ${res.status} ${res.statusText}`);
    }

    const xml = await res.text();
    const feed = await this.parser.parseString(xml);
    return (feed.items || []).map(item => ({
      title: item.title ?? 'Untitled',
      description: item.contentSnippet ?? item.content ?? item.summary ?? '',
      sourceUrl: item.link ?? null,
      publishDate: item.pubDate ? new Date(item.pubDate) : undefined,
      agency: this.agency,
      rawItem: item,
    }));
  }

  async fetchHistorical(startDate: Date, endDate: Date): Promise<CollectedItem[]> {
    const res = await fetch(EmaCollector.HISTORICAL_JSON_URL, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'application/json',
      }
    });

    if (!res.ok) {
      throw new Error(`Failed to fetch EMA historical medicines JSON: Status ${res.status} ${res.statusText}`);
    }

    const json = await res.json();
    if (!json || !Array.isArray(json.data)) {
      throw new Error('Invalid EMA historical dataset format: missing "data" array');
    }

    const items: CollectedItem[] = [];

    for (const med of json.data) {
      const pubDate = this.parseDate(med.first_published_date) || this.parseDate(med.marketing_authorisation_date);
      if (pubDate && pubDate >= startDate && pubDate <= endDate) {
        items.push({
          title: med.name_of_medicine || 'Untitled',
          description: med.therapeutic_indication || `Status: ${med.medicine_status || 'Unknown'}. Active substance: ${med.active_substance || 'None'}.`,
          sourceUrl: med.medicine_url || null,
          publishDate: pubDate,
          agency: this.agency,
          rawItem: med,
        });
      }
    }

    return items;
  }

  private parseDate(dateStr: string): Date | undefined {
    if (!dateStr) return undefined;
    const parts = dateStr.trim().split('/');
    if (parts.length === 3) {
      const [day, month, year] = parts.map(Number);
      if (!isNaN(day) && !isNaN(month) && !isNaN(year)) {
        return new Date(year, month - 1, day);
      }
    }
    return undefined;
  }
}
