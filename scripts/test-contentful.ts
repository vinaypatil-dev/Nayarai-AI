import {
  getExistingResourceTitles,
  createResourceItem,
  addResourceToResourcePage,
} from '../lib/contentful-management';

const SPACE_ID = process.env.CONTENTFUL_SPACE_ID!;
const ENV_ID = process.env.CONTENTFUL_ENVIRONMENT_ID ?? 'master';
const MGMT_TOKEN = process.env.CONTENTFUL_MANAGEMENT_TOKEN!;
const BASE = `https://api.contentful.com/spaces/${SPACE_ID}/environments/${ENV_ID}`;

function mgmtHeaders(extras: Record<string, string> = {}) {
  return {
    Authorization: `Bearer ${MGMT_TOKEN}`,
    'Content-Type': 'application/vnd.contentful.management.v1+json',
    ...extras,
  };
}

async function cleanUpEntry(entryId: string) {
  console.log(`Cleaning up test entry ${entryId}...`);
  // Unpublish
  const unpublishRes = await fetch(`${BASE}/entries/${entryId}/published`, {
    method: 'DELETE',
    headers: mgmtHeaders(),
  });
  if (unpublishRes.ok) {
    console.log('✓ Entry unpublished.');
  } else {
    console.warn('⚠ Failed to unpublish entry (might not have been published).');
  }

  // Delete
  const deleteRes = await fetch(`${BASE}/entries/${entryId}`, {
    method: 'DELETE',
    headers: mgmtHeaders(),
  });
  if (deleteRes.ok) {
    console.log('✓ Entry deleted.');
  } else {
    console.warn('⚠ Failed to delete entry.');
  }
}

async function run() {
  console.log('Starting Contentful model validation...');
  console.log(`Space ID: ${SPACE_ID}`);
  console.log(`Environment: ${ENV_ID}`);

  try {
    // 1. Test getExistingResourceTitles
    console.log('\n1. Fetching existing resource titles...');
    const titles = await getExistingResourceTitles();
    console.log(`✓ Fetched ${titles.size} existing titles.`);

    // 2. Test createResourceItem (using the correct "resources" content type)
    console.log('\n2. Creating and publishing a test resource entry...');
    const testTitle = `TEMP_TEST_INGESTION_${Date.now()}`;
    const entry = await createResourceItem({
      title: testTitle,
      shortDescription: 'Temporary test description for validation purposes.',
      country: 'United States',
      productType: 'Medical Devices',
      resourceType: 'PDF',
      sourceUrl: 'https://example.com/test-ingestion',
    });
    console.log(`✓ Entry created and published successfully. ID: ${entry.sys.id}`);

    // 3. Test addResourceToResourcePage
    console.log('\n3. Linking test resource entry to ResourcePage...');
    await addResourceToResourcePage(entry.sys.id);
    console.log('✓ Entry linked successfully.');

    // 4. Clean up
    console.log('\n4. Cleaning up...');
    await cleanUpEntry(entry.sys.id);

    console.log('\nContentful integration model validation passed successfully!');
  } catch (err) {
    console.error('\nContentful model validation failed:', err);
    process.exit(1);
  }
}

run();
