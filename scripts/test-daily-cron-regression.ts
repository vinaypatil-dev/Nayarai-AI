import { GET } from '../app/api/ingest-resources/route';
import { NextRequest } from 'next/server';

async function main() {
  console.log('Starting daily cron route regression test...');
  
  const token = process.env.INGEST_AUTH_TOKEN || 'vinay-dev-ingest-2026';
  const url = new URL(`http://localhost:3000/api/ingest-resources?token=${token}`);
  const req = new NextRequest(url.toString());

  try {
    console.log('Invoking GET handler...');
    const response = await GET(req);
    const body = await response.json();
    console.log('Response Status:', response.status);
    console.log('Response Body Summary:');
    console.log(`  Created:   ${body.created}`);
    console.log(`  Skipped:   ${body.skipped}`);
    console.log(`  Errors:    ${body.errors.length}`);
    if (body.errors.length > 0) {
      console.log('Errors:', body.errors);
    }
  } catch (err) {
    console.error('Error invoking GET handler:', err);
    process.exit(1);
  }
}

main();
