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
