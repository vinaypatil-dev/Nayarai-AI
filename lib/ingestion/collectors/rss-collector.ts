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
    this.parser = new Parser({ timeout: 10000 });
  }

  async collect(): Promise<CollectedItem[]> {
    const feed = await this.parser.parseURL(this.url);
    return (feed.items || []).map(item => ({
      title: item.title ?? 'Untitled',
      description: item.contentSnippet ?? item.content ?? item.summary ?? '',
      sourceUrl: item.link ?? null,
      publishDate: item.pubDate ? new Date(item.pubDate) : undefined,
      agency: this.agency,
      rawItem: item,
    }));
  }
}
