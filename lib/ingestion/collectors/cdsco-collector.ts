import { HistoricalCollector, CollectedItem } from '../types';

export class CdscoCollector implements HistoricalCollector {
  public name = 'CDSCO Collector';
  public agency = 'CDSCO';

  // CDSCO official URLs for notifications
  private static readonly SECTIONS = [
    {
      name: 'CDSCO Circulars',
      url: 'https://cdsco.gov.in/opencms/opencms/en/Notifications/Circulars/'
    },
    {
      name: 'CDSCO Public Notices',
      url: 'https://cdsco.gov.in/opencms/opencms/en/Notifications/Public-Notices/'
    },
    {
      name: 'CDSCO Gazette Notifications',
      url: 'https://cdsco.gov.in/opencms/opencms/en/Notifications/Gazette-Notifications/'
    }
  ];

  async collect(): Promise<CollectedItem[]> {
    // Return all latest notices. Pipeline deduplication handles checking if they already exist.
    return this.fetchFromSource();
  }

  async fetchHistorical(startDate: Date, endDate: Date): Promise<CollectedItem[]> {
    const allItems = await this.fetchFromSource();
    return allItems.filter(item => {
      if (!item.publishDate) return false;
      return item.publishDate >= startDate && item.publishDate <= endDate;
    });
  }

  /**
   * Abstracted method to fetch notices from official CDSCO sources.
   * Currently, this parses HTML tables because no official API/RSS exists.
   * If CDSCO publishes an API, RSS, XML, or JSON feed in the future,
   * this method can be updated to fetch from that source with minimal changes.
   */
  private async fetchFromSource(): Promise<CollectedItem[]> {
    const items: CollectedItem[] = [];

    for (const section of CdscoCollector.SECTIONS) {
      try {
        const res = await fetch(section.url, {
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
          }
        });

        if (!res.ok) {
          throw new Error(`HTTP Error ${res.status} ${res.statusText} for ${section.url}`);
        }

        const html = await res.text();
        const parsedRows = this.parseHtmlTable(html);

        for (const row of parsedRows) {
          const publishDate = this.parseDate(row.dateStr);
          const fullPdfUrl = row.pdfUrl.startsWith('http') 
            ? row.pdfUrl 
            : `https://cdsco.gov.in${row.pdfUrl}`;

          items.push({
            title: row.title,
            description: `CDSCO Regulatory publication: ${section.name}. PDF Size: ${row.sizeStr || 'Unknown'}.`,
            sourceUrl: fullPdfUrl,
            publishDate,
            agency: this.agency,
            rawItem: {
              ...row,
              section: section.name,
              sourcePage: section.url
            }
          });
        }
      } catch (err) {
        console.error(`[CDSCO Collector] Failed to fetch section "${section.name}":`, err);
        // Do not crash the entire ingestion, continue with other sections
      }
    }

    return items;
  }

  /**
   * Helper to parse table rows from CDSCO notifications tables.
   */
  private parseHtmlTable(html: string): Array<{ title: string; dateStr: string; pdfUrl: string; sizeStr: string }> {
    const rows: Array<{ title: string; dateStr: string; pdfUrl: string; sizeStr: string }> = [];

    const tbodyMatch = html.match(/<tbody>([\s\S]*?)<\/tbody>/i);
    if (!tbodyMatch) return rows;
    const tbody = tbodyMatch[1];

    const trRegex = /<tr>([\s\S]*?)<\/tr>/gi;
    let trMatch;

    while ((trMatch = trRegex.exec(tbody)) !== null) {
      const trContent = trMatch[1];

      const tdRegex = /<td>([\s\S]*?)<\/td>/gi;
      const tds: string[] = [];
      let tdMatch;

      while ((tdMatch = tdRegex.exec(trContent)) !== null) {
        tds.push(tdMatch[1].trim());
      }

      if (tds.length >= 4) {
        const title = this.cleanHtmlText(tds[1]);
        const dateStr = this.cleanHtmlText(tds[2]);

        const hrefMatch = tds[3].match(/href=['"]([^'"]+)['"]/i);
        const pdfUrl = hrefMatch ? hrefMatch[1].trim() : '';
        const sizeStr = tds.length >= 5 ? this.cleanHtmlText(tds[4]) : '';

        if (title && dateStr && pdfUrl) {
          rows.push({ title, dateStr, pdfUrl, sizeStr });
        }
      }
    }

    return rows;
  }

  private cleanHtmlText(text: string): string {
    if (!text) return '';
    return text
      .replace(/<[^>]*>/g, '') // remove HTML tags
      .replace(/&nbsp;/gi, ' ')
      .replace(/&amp;/gi, '&')
      .replace(/&quot;/gi, '"')
      .replace(/&#39;/gi, "'")
      .replace(/&lt;/gi, '<')
      .replace(/&gt;/gi, '>')
      .replace(/\s+/g, ' ') // normalize whitespace
      .trim();
  }

  private parseDate(dateStr: string): Date | undefined {
    if (!dateStr) return undefined;
    const parts = dateStr.trim().split('-');
    if (parts.length === 3) {
      const [year, monthStr, day] = parts;
      const months: Record<string, number> = {
        jan: 0, feb: 1, mar: 2, apr: 3, may: 4, jun: 5,
        jul: 6, aug: 7, sep: 8, oct: 9, nov: 10, dec: 11
      };
      const monthIndex = months[monthStr.toLowerCase().slice(0, 3)];
      if (monthIndex !== undefined) {
        const y = parseInt(year, 10);
        const d = parseInt(day, 10);
        if (!isNaN(y) && !isNaN(d)) {
          return new Date(y, monthIndex, d);
        }
      }
    }
    return undefined;
  }
}
