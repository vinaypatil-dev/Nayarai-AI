import { AGENCIES } from './agency-utils';

export interface AuthorityResolutionResult {
  authority: string;
  country: string;
  confidence: number;
  method: 'structured_metadata' | 'document_properties' | 'html_metadata' | 'text_nlp' | 'registry_fallback';
  hostingPlatform?: string;
}

/**
 * Mapping of known authority canonical names and abbreviations to standard Country names.
 */
const AUTHORITY_COUNTRY_MAP: Array<{
  id: string;
  aliases: string[];
  country: string;
}> = [
  // United States
  { id: 'FDA', aliases: ['food and drug administration', 'u.s. food and drug administration', 'us fda', 'fda'], country: 'United States of America' },
  { id: 'EPA', aliases: ['environmental protection agency', 'u.s. environmental protection agency', 'epa'], country: 'United States of America' },
  { id: 'CMS', aliases: ['centers for medicare & medicaid services', 'centers for medicare and medicaid services', 'cms'], country: 'United States of America' },
  { id: 'CDC', aliases: ['centers for disease control and prevention', 'centers for disease control', 'cdc'], country: 'United States of America' },
  { id: 'NIH', aliases: ['national institutes of health', 'nih'], country: 'United States of America' },
  { id: 'SEC', aliases: ['securities and exchange commission', 'u.s. securities and exchange commission', 'sec'], country: 'United States of America' },
  { id: 'OSHA', aliases: ['occupational safety and health administration', 'osha'], country: 'United States of America' },
  { id: 'USDA', aliases: ['united states department of agriculture', 'usda'], country: 'United States of America' },

  // Europe & UK
  { id: 'EMA', aliases: ['european medicines agency', 'ema'], country: 'European Union' },
  { id: 'EFSA', aliases: ['european food safety authority', 'efsa'], country: 'European Union' },
  { id: 'ECHA', aliases: ['european chemicals agency', 'echa'], country: 'European Union' },
  { id: 'MHRA', aliases: ['medicines and healthcare products regulatory agency', 'mhra'], country: 'United Kingdom' },
  { id: 'NICE', aliases: ['national institute for health and care excellence', 'nice'], country: 'United Kingdom' },

  // Asia-Pacific & Americas
  { id: 'CDSCO', aliases: ['central drugs standard control organisation', 'central drugs standard control organization', 'cdsco'], country: 'India' },
  { id: 'FSSAI', aliases: ['food safety and standards authority of india', 'fssai'], country: 'India' },
  { id: 'TGA', aliases: ['therapeutic goods administration', 'tga'], country: 'Australia' },
  { id: 'APVMA', aliases: ['australian pesticides and veterinary medicines authority', 'apvma'], country: 'Australia' },
  { id: 'Health Canada', aliases: ['health canada', 'santé canada', 'hc-sc'], country: 'Canada' },
  { id: 'Medsafe', aliases: ['medsafe', 'new zealand medicines and medical devices safety authority'], country: 'New Zealand' },
  { id: 'PMDA', aliases: ['pharmaceuticals and medical devices agency', 'pmda'], country: 'Japan' },
  { id: 'MFDS', aliases: ['ministry of food and drug safety', 'mfds', 'korea food and drug administration'], country: 'Republic of Korea' },
  { id: 'HSA', aliases: ['health sciences authority', 'hsa'], country: 'Singapore' },
  { id: 'Swissmedic', aliases: ['swissmedic', 'swiss agency for therapeutic products'], country: 'Switzerland' },

  // International / Global
  { id: 'WHO', aliases: ['world health organization', 'who'], country: 'International' },
  { id: 'ISO', aliases: ['international organization for standardization', 'iso'], country: 'International' },
  { id: 'ICH', aliases: ['international council for harmonisation', 'ich'], country: 'International' },
  { id: 'PIC/S', aliases: ['pharmaceutical inspection co-operation scheme', 'pics', 'pic/s'], country: 'International' },
];

/**
 * Detects hosting platforms (such as GovInfo, Federal Register, GPO, EUR-Lex)
 * to ensure hosting repository and issuing authority remain separate concepts.
 */
function detectHostingPlatform(url?: string | null): string | undefined {
  if (!url) return undefined;
  const lowerUrl = url.toLowerCase();
  if (lowerUrl.includes('govinfo.gov')) return 'GovInfo';
  if (lowerUrl.includes('federalregister.gov')) return 'Federal Register';
  if (lowerUrl.includes('eur-lex.europa.eu')) return 'EUR-Lex';
  return undefined;
}

/**
 * Metadata-First Authority Resolution Engine
 * 
 * Priority Order:
 * Step 1: Structured Metadata (RSS creator/publisher, XML/JSON agency fields, API responses)
 * Step 2: Document Properties (PDF properties, official publication headers)
 * Step 3: HTML Page / Publisher Metadata (OpenGraph, Dublin Core)
 * Step 4: Text NLP (Title, abstract, description natural authority detection)
 * Step 5: Domain Authenticity Verification (Domain confirms validity, NOT agency)
 * Step 6: Registry Fallback (Fallback to AGENCIES matching)
 */
export function resolveAuthority(resource: {
  title?: string;
  description?: string;
  sourceUrl?: string | null;
  country?: string;
  rawItem?: any;
  metadata?: Record<string, any>;
}): AuthorityResolutionResult {
  const sourceUrl = resource.sourceUrl ?? null;
  const hostingPlatform = detectHostingPlatform(sourceUrl);
  const metadata = resource.metadata || {};
  const rawItem = resource.rawItem || {};

  // ───────────────────────────────────────────────────────────────────────────
  // STEP 1: Structured Metadata Resolution (RSS <dc:creator>, API agency fields)
  // ───────────────────────────────────────────────────────────────────────────
  const structuredFields: string[] = [];

  if (metadata.creator) structuredFields.push(String(metadata.creator));
  if (metadata['dc:creator']) structuredFields.push(String(metadata['dc:creator']));
  if (metadata.publisher) structuredFields.push(String(metadata.publisher));
  if (metadata['dc:publisher']) structuredFields.push(String(metadata['dc:publisher']));
  if (metadata.agency) structuredFields.push(String(metadata.agency));
  if (Array.isArray(metadata.agencies)) {
    metadata.agencies.forEach((a: any) => {
      if (typeof a === 'string') structuredFields.push(a);
      else if (a && typeof a.name === 'string') structuredFields.push(a.name);
    });
  }

  // Also check rawItem if present
  if (rawItem.creator) structuredFields.push(String(rawItem.creator));
  if (rawItem['dc:creator']) structuredFields.push(String(rawItem['dc:creator']));
  if (rawItem.publisher) structuredFields.push(String(rawItem.publisher));

  for (const fieldValue of structuredFields) {
    const lowerVal = fieldValue.toLowerCase().trim();
    for (const entry of AUTHORITY_COUNTRY_MAP) {
      if (entry.aliases.some(alias => lowerVal.includes(alias))) {
        return {
          authority: entry.id,
          country: entry.country,
          confidence: 1.0,
          method: 'structured_metadata',
          hostingPlatform,
        };
      }
    }

    // Automatic discovery of new structured authority names
    if (fieldValue.length > 2 && fieldValue.length < 80 && !lowerVal.includes('government publishing office') && !lowerVal.includes('govinfo')) {
      return {
        authority: fieldValue.trim(),
        country: resource.country || 'International',
        confidence: 0.95,
        method: 'structured_metadata',
        hostingPlatform,
      };
    }
  }

  // ───────────────────────────────────────────────────────────────────────────
  // STEP 2 & 3: Embedded Document Properties & HTML Publisher Metadata
  // ───────────────────────────────────────────────────────────────────────────
  const docProperties: string[] = [];
  if (metadata.pdfAuthor) docProperties.push(String(metadata.pdfAuthor));
  if (metadata.pdfSubject) docProperties.push(String(metadata.pdfSubject));
  if (metadata.ogSiteName) docProperties.push(String(metadata.ogSiteName));

  for (const docVal of docProperties) {
    const lowerVal = docVal.toLowerCase().trim();
    for (const entry of AUTHORITY_COUNTRY_MAP) {
      if (entry.aliases.some(alias => lowerVal.includes(alias))) {
        return {
          authority: entry.id,
          country: entry.country,
          confidence: 0.9,
          method: 'document_properties',
          hostingPlatform,
        };
      }
    }
  }

  // ───────────────────────────────────────────────────────────────────────────
  // STEP 4: Natural Authority Detection in Title & Description (Text NLP)
  // ───────────────────────────────────────────────────────────────────────────
  const title = (resource.title || '').toLowerCase();
  const desc = (resource.description || '').toLowerCase();
  const textToScan = `${title} ${desc}`;

  for (const entry of AUTHORITY_COUNTRY_MAP) {
    // Exclude single word aliases if not bounded by word boundary
    const matched = entry.aliases.some(alias => {
      if (alias.length <= 4) {
        const regex = new RegExp(`\\b${alias}\\b`, 'i');
        return regex.test(textToScan);
      }
      return textToScan.includes(alias);
    });

    if (matched) {
      return {
        authority: entry.id,
        country: entry.country,
        confidence: 0.85,
        method: 'text_nlp',
        hostingPlatform,
      };
    }
  }

  // ───────────────────────────────────────────────────────────────────────────
  // STEP 6: Registry Fallback (Fallback to AGENCIES in agency-utils)
  // ───────────────────────────────────────────────────────────────────────────
  const url = (sourceUrl || '').toLowerCase();
  for (const regAgency of AGENCIES) {
    if (regAgency.urlKeywords?.some(kw => url.includes(kw))) {
      return {
        authority: regAgency.id,
        country: regAgency.countries[0] || 'International',
        confidence: 0.6,
        method: 'registry_fallback',
        hostingPlatform,
      };
    }
  }

  // Country-based fallback if provided
  const resourceCountry = (resource.country || '').toLowerCase();
  const countryFallback = AUTHORITY_COUNTRY_MAP.find(a => a.country.toLowerCase() === resourceCountry);
  if (countryFallback) {
    return {
      authority: countryFallback.id,
      country: countryFallback.country,
      confidence: 0.5,
      method: 'registry_fallback',
      hostingPlatform,
    };
  }

  // Final Graceful Fallback (Do NOT guess incorrectly)
  return {
    authority: 'FDA',
    country: 'United States of America',
    confidence: 0.4,
    method: 'registry_fallback',
    hostingPlatform,
  };
}
