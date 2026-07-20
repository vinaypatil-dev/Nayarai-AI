import { Collector, CollectedItem } from '../types';

/**
 * MHRA Collector
 * Extension point for UK Medicines and Healthcare products Regulatory Agency.
 * TODO: Integrate GOV.UK MHRA search API for alerts, releases, and guidance.
 */
export class MhraCollector implements Collector {
  public name = 'MHRA Collector';
  public agency = 'MHRA';

  async collect(): Promise<CollectedItem[]> {
    // TODO: Connect to Gov.uk search API filtering for MHRA documents
    // 1. Fetch drug alerts, medical device alerts, and guidance documents
    // 2. Normalize response to CollectedItem format
    return [];
  }
}
