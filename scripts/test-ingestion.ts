import { classifyResourceDeterministic } from '../lib/ingestion/rule-classifier';
import { RssCollector } from '../lib/ingestion/collectors/rss-collector';

async function testClassifier() {
  console.log('--- Testing Deterministic Classifier ---');
  
  const testCases = [
    {
      title: 'FDA Approves New Covid-19 Vaccine for Immunotherapy',
      description: 'The FDA has approved a new mRNA vaccine targeting cell therapy and biologics.',
      agency: 'FDA',
      expectedProduct: 'Biologics',
      expectedResource: 'PDF',
      expectedCountry: 'United States',
    },
    {
      title: 'Guidance on Medical Device 510(k) Submissions',
      description: 'Draft guideline recommendations for manufacturers submitting PMA and catheter hardware information.',
      agency: 'FDA',
      expectedProduct: 'Medical Devices',
      expectedResource: 'PDF',
      expectedCountry: 'United States',
    },
    {
      title: 'New Proposed Rule for Clinical Trials and Tablet Formulations',
      description: 'Proposed regulation modifying dosage requirements for pharmaceutical drugs.',
      agency: 'OTHER',
      expectedProduct: 'Pharmaceuticals',
      expectedResource: 'PDF',
      expectedCountry: 'International',
    },
    {
      title: 'Notice of Urgent Safety Communication: Cardiac Pacemaker Alert',
      description: 'Enforcement alert and warning letter issued regarding device defect.',
      agency: 'EMA',
      expectedProduct: 'Medical Devices',
      expectedResource: 'PDF',
      expectedCountry: 'European Union',
    },
    {
      title: 'Combination Product Guidance for pre-filled syringes',
      description: 'FDA regulatory framework for drug-delivery combination products.',
      agency: 'FDA',
      expectedProduct: 'Combination Products',
      expectedResource: 'PDF',
      expectedCountry: 'United States',
    },
    {
      title: 'In Vitro Diagnostic Assay Screen for Influenza',
      description: 'Assay reagents and testing kits for screening virus variants.',
      agency: 'CDSCO',
      expectedProduct: 'Diagnostics',
      expectedResource: 'PDF',
      expectedCountry: 'India',
    }
  ];

  let passed = true;
  for (const tc of testCases) {
    const res = classifyResourceDeterministic(tc.title, tc.description, tc.agency);
    const productOk = res.productType === tc.expectedProduct;
    const resourceOk = res.resourceType === tc.expectedResource;
    const countryOk = res.country === tc.expectedCountry;
    
    if (productOk && resourceOk && countryOk) {
      console.log(`✓ Passed: "${tc.title.slice(0, 40)}..." -> [${res.productType}, ${res.resourceType}, ${res.country}]`);
    } else {
      console.error(`✗ Failed: "${tc.title.slice(0, 40)}..."`);
      console.error(`  Expected: Product=${tc.expectedProduct}, Resource=${tc.expectedResource}, Country=${tc.expectedCountry}`);
      console.error(`  Got:      Product=${res.productType}, Resource=${res.resourceType}, Country=${res.country}`);
      passed = false;
    }
  }

  if (passed) {
    console.log('All classifier tests passed successfully!');
  } else {
    throw new Error('Classifier tests failed!');
  }
}

async function testRssCollector() {
  console.log('\n--- Testing RSS Collector ---');
  // Using GovInfo Federal Register RSS as a live test source
  const url = 'https://www.govinfo.gov/rss/fr.xml';
  const collector = new RssCollector('GovInfo Federal Register', 'OTHER', url);

  try {
    const items = await collector.collect();
    console.log(`✓ Successfully collected ${items.length} items from ${collector.name}`);
    if (items.length > 0) {
      const sample = items[0];
      console.log('Sample item structure:');
      console.log(`  Title:       ${sample.title}`);
      console.log(`  Source URL:  ${sample.sourceUrl}`);
      console.log(`  Agency:      ${sample.agency}`);
      console.log(`  Pub Date:    ${sample.publishDate ? sample.publishDate.toISOString() : 'None'}`);
      console.log(`  Description: ${sample.description.slice(0, 100)}...`);
    }
  } catch (err) {
    console.error('✗ Failed to collect from RSS feed:', err);
    throw err;
  }
}

async function run() {
  try {
    await testClassifier();
    await testRssCollector();
    console.log('\nAll ingestion engine local tests passed!');
  } catch (err) {
    console.error('\nTests failed:', err);
    process.exit(1);
  }
}

run();
