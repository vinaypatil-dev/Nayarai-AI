import { ResourceClassification } from './types';

function agencyToCountry(agency: string): string {
  const map: Record<string, string> = {
    FDA: 'United States',
    EMA: 'European Union',
    ISO: 'International',
    TGA: 'Australia',
    CDSCO: 'India',
    OTHER: 'International',
  };
  return map[agency.toUpperCase()] ?? 'International';
}

export function classifyResourceDeterministic(
  title: string,
  description: string,
  agency: string
): ResourceClassification {
  const textToScan = `${title} ${description}`.toLowerCase();

  // 1. Determine Product Type
  // Allowed types in Contentful: Medical Devices, Pharmaceuticals, Biologics, Diagnostics, Combination Products, General Regulatory
  let productType = 'General Regulatory';
  
  if (
    textToScan.includes('combination product') || 
    textToScan.includes('drug-delivery') || 
    textToScan.includes('pre-filled') || 
    textToScan.includes('autoinjector')
  ) {
    productType = 'Combination Products';
  } else if (
    textToScan.includes('diagnostic') || 
    textToScan.includes('in vitro') || 
    textToScan.includes('ivd') || 
    textToScan.includes('assay') || 
    textToScan.includes('reagent') ||
    textToScan.includes('testing kit')
  ) {
    productType = 'Diagnostics';
  } else if (
    textToScan.includes('medical device') || 
    textToScan.includes('510(k)') || 
    textToScan.includes('510k') || 
    textToScan.includes('pma') || 
    textToScan.includes('catheter') || 
    textToScan.includes('implant') || 
    textToScan.includes('instrument') || 
    textToScan.includes('hardware') ||
    textToScan.includes('pacemaker') ||
    textToScan.includes('stent')
  ) {
    productType = 'Medical Devices';
  } else if (
    textToScan.includes('vaccine') || 
    textToScan.includes('biologic') || 
    textToScan.includes('gene therapy') || 
    textToScan.includes('cell therapy') || 
    textToScan.includes('antibody') || 
    textToScan.includes('immunotherapy') || 
    textToScan.includes('blood product') ||
    textToScan.includes('serum')
  ) {
    productType = 'Biologics';
  } else if (
    textToScan.includes('drug') || 
    textToScan.includes('pharmaceutical') || 
    textToScan.includes('medicine') || 
    textToScan.includes('tablet') || 
    textToScan.includes('capsule') || 
    textToScan.includes('clinical trial') || 
    textToScan.includes('efficacy') ||
    textToScan.includes('dose') ||
    textToScan.includes('prescription')
  ) {
    productType = 'Pharmaceuticals';
  }

  // 2. Determine Resource Type
  // Allowed types in Contentful: PDF, VIDEO
  let resourceType = 'PDF';
  
  if (
    textToScan.includes('video') || 
    textToScan.includes('webinar') || 
    textToScan.includes('watch') || 
    textToScan.includes('youtube') || 
    textToScan.includes('vimeo') ||
    textToScan.includes('broadcast')
  ) {
    resourceType = 'VIDEO';
  }

  // 3. Country
  const country = agencyToCountry(agency);

  // 4. Short Description (one sentence, under 150 characters)
  let shortDescription = description.trim();
  if (!shortDescription) {
    shortDescription = title;
  }
  
  // Extract first sentence if reasonably sized
  const firstSentenceEnd = shortDescription.indexOf('.');
  if (firstSentenceEnd !== -1 && firstSentenceEnd > 20) {
    shortDescription = shortDescription.slice(0, firstSentenceEnd + 1);
  }
  
  // Clean formatting and restrict length
  shortDescription = shortDescription.replace(/\s+/g, ' ').trim();
  if (shortDescription.length > 147) {
    shortDescription = shortDescription.slice(0, 147) + '...';
  }

  return {
    productType,
    country,
    shortDescription,
    resourceType,
  };
}
