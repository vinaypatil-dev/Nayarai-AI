import { ResourceClassification } from './types';
import { resolveAuthority } from '../authority-resolver';

export function classifyResourceDeterministic(
  title: string,
  description: string,
  agency: string,
  sourceUrl?: string | null,
  metadata?: Record<string, any>
): ResourceClassification {
  const textToScan = `${title} ${description}`.toLowerCase();

  // 1. Determine Product Type
  let productType = 'Medical Devices';
  
  if (
    textToScan.includes('food') || 
    textToScan.includes('dietary') || 
    textToScan.includes('supplement') ||
    textToScan.includes('nutrition')
  ) {
    productType = 'Food & Dietary Supplements';
  } else if (
    textToScan.includes('cosmetic') || 
    textToScan.includes('skincare') ||
    textToScan.includes('beauty')
  ) {
    productType = 'Cosmetics';
  } else if (
    textToScan.includes('software as medical device') || 
    textToScan.includes('samd') || 
    textToScan.includes('medical software')
  ) {
    productType = 'Software as Medical Devices';
  } else if (
    textToScan.includes('tobacco') || 
    textToScan.includes('nicotine') || 
    textToScan.includes('vape') ||
    textToScan.includes('e-cigarette')
  ) {
    productType = 'Tobacco & Restricted Products';
  } else if (
    textToScan.includes('veterinary') || 
    textToScan.includes('animal drug') || 
    textToScan.includes('pet medicine')
  ) {
    productType = 'Veterinary Products';
  } else if (
    textToScan.includes('radiation') || 
    textToScan.includes('x-ray') || 
    textToScan.includes('laser') ||
    textToScan.includes('electronic product')
  ) {
    productType = 'Radiation Emitting / Electronic Products';
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

  // 3. Country Determination via Metadata-First Authority Resolver
  const resolved = resolveAuthority({ title, description, sourceUrl, metadata });
  const country = resolved.country;

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
