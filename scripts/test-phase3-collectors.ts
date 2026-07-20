import { EmaCollector } from '../lib/ingestion/collectors/ema-collector';
import { MhraCollector } from '../lib/ingestion/collectors/mhra-collector';
import { CdscoCollector } from '../lib/ingestion/collectors/cdsco-collector';
import { RssCollector } from '../lib/ingestion/collectors/rss-collector';

async function main() {
  console.log('==================================================');
  console.log('      Phase 3 Collectors Diagnostic Test');
  console.log('==================================================');

  // 1. Verify EMA News Feed & EPAR Historical
  console.log('\n--- 1. Testing EMA Collector ---');
  const ema = new EmaCollector();
  try {
    console.log('Testing EMA daily RSS feed collection...');
    const emaDaily = await ema.collect();
    console.log(`✓ Fetched ${emaDaily.length} items from daily news.`);
    if (emaDaily.length > 0) {
      console.log('Sample Daily Item:');
      console.log(`  Title:       ${emaDaily[0].title}`);
      console.log(`  Source URL:  ${emaDaily[0].sourceUrl}`);
      console.log(`  Publish Date: ${emaDaily[0].publishDate?.toISOString()}`);
    }

    console.log('\nTesting EMA historical EPAR medicines collection (Jan 2024)...');
    const emaHist = await ema.fetchHistorical(new Date('2024-01-01'), new Date('2024-01-31'));
    console.log(`✓ Fetched ${emaHist.length} historical items for Jan 2024.`);
    if (emaHist.length > 0) {
      console.log('Sample Historical Item:');
      console.log(`  Title:       ${emaHist[0].title}`);
      console.log(`  Source URL:  ${emaHist[0].sourceUrl}`);
      console.log(`  Publish Date: ${emaHist[0].publishDate?.toISOString()}`);
      console.log(`  Description: ${emaHist[0].description}`);
    }
  } catch (err) {
    console.error('✗ EMA Collector failed:', err);
  }

  // 2. Verify MHRA Search API
  console.log('\n--- 2. Testing MHRA Collector ---');
  const mhra = new MhraCollector();
  try {
    console.log('Testing MHRA daily collection...');
    const mhraDaily = await mhra.collect();
    console.log(`✓ Fetched ${mhraDaily.length} items from MHRA Search API.`);
    if (mhraDaily.length > 0) {
      console.log('Sample Daily Item:');
      console.log(`  Title:       ${mhraDaily[0].title}`);
      console.log(`  Source URL:  ${mhraDaily[0].sourceUrl}`);
      console.log(`  Publish Date: ${mhraDaily[0].publishDate?.toISOString()}`);
    }

    console.log('\nTesting MHRA historical API query (Jan 1, 2024 to Jan 15, 2024)...');
    const mhraHist = await mhra.fetchHistorical(new Date('2024-01-01'), new Date('2024-01-15'));
    console.log(`✓ Fetched ${mhraHist.length} historical items for Jan 1-15, 2024.`);
    if (mhraHist.length > 0) {
      console.log('Sample Historical Item:');
      console.log(`  Title:       ${mhraHist[0].title}`);
      console.log(`  Source URL:  ${mhraHist[0].sourceUrl}`);
      console.log(`  Publish Date: ${mhraHist[0].publishDate?.toISOString()}`);
    }
  } catch (err) {
    console.error('✗ MHRA Collector failed:', err);
  }

  // 3. Verify CDSCO HTML parsing
  console.log('\n--- 3. Testing CDSCO Collector ---');
  const cdsco = new CdscoCollector();
  try {
    console.log('Testing CDSCO collect (fetching Circulars, Public Notices, Gazette)...');
    const cdscoDaily = await cdsco.collect();
    console.log(`✓ Fetched ${cdscoDaily.length} items total across all sections.`);
    if (cdscoDaily.length > 0) {
      console.log('Sample Item:');
      console.log(`  Title:       ${cdscoDaily[0].title}`);
      console.log(`  Source URL:  ${cdscoDaily[0].sourceUrl}`);
      console.log(`  Publish Date: ${cdscoDaily[0].publishDate?.toISOString()}`);
      console.log(`  Description: ${cdscoDaily[0].description}`);
    }

    console.log('\nTesting CDSCO historical filtering (Jan 1, 2024 to Dec 31, 2024)...');
    const cdscoHist = await cdsco.fetchHistorical(new Date('2024-01-01'), new Date('2024-12-31'));
    console.log(`✓ Filtered ${cdscoHist.length} items in year 2024.`);
    if (cdscoHist.length > 0) {
      console.log('Sample 2024 Item:');
      console.log(`  Title:       ${cdscoHist[0].title}`);
      console.log(`  Source URL:  ${cdscoHist[0].sourceUrl}`);
      console.log(`  Publish Date: ${cdscoHist[0].publishDate?.toISOString()}`);
    }
  } catch (err) {
    console.error('✗ CDSCO Collector failed:', err);
  }

  // 4. Verify FDA feed is still working (regression check)
  console.log('\n--- 4. FDA Regression Check ---');
  try {
    const fdaUrl = 'https://www.fda.gov/about-fda/contact-fda/stay-informed/rss-feeds/press-releases/rss.xml';
    const fdaCollector = new RssCollector('FDA Press Releases', 'FDA', fdaUrl);
    console.log('Fetching FDA feed...');
    const fdaItems = await fdaCollector.collect();
    console.log(`✓ FDA collector active. Fetched ${fdaItems.length} items successfully.`);
  } catch (err) {
    console.error('✗ FDA Regression check failed:', err);
  }

  console.log('\n==================================================');
  console.log('              Diagnostic Finished');
  console.log('==================================================');
}

main().catch(console.error);
