import Parser from 'rss-parser';
import { Collector, CollectedItem } from '../types';

export class RssCollector implements Collector {
  public name: string;
  public agency: string;
  private url: string;
  private parser: Parser;

  constructor(name: string, agency: string, url: string) {
    this.name = name;
    this.agency = agency;
    this.url = url;
    this.parser = new Parser({ 
      timeout: 10000,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'application/rss+xml, application/xml, text/xml, */*'
      }
    });
  }

  async collect(): Promise<CollectedItem[]> {
    const res = await fetch(this.url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'application/rss+xml, application/xml, text/xml, */*'
      }
    });

    if (!res.ok) {
      throw new Error(`Failed to fetch RSS feed from ${this.url}: Status ${res.status} ${res.statusText}`);
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
      metadata: {
        creator: item.creator || (item as any)['dc:creator'] || item.author,
        publisher: (item as any).publisher || (item as any)['dc:publisher'],
        category: item.categories,
      },
    }));
  }
}
