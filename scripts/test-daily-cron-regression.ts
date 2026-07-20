import { NextRequest } from 'next/server';
import * as fs from 'fs';
import * as path from 'path';

// Automatically load environment variables from .env.local if not already set
function loadEnv() {
  const envPath = path.resolve(process.cwd(), '.env.local');
  if (fs.existsSync(envPath)) {
    console.log('Loading environment from .env.local...');
    const envFile = fs.readFileSync(envPath, 'utf-8');
    for (const line of envFile.split('\n')) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith('#')) continue;
      const index = trimmed.indexOf('=');
      if (index === -1) continue;
      const key = trimmed.slice(0, index).trim();
      const val = trimmed.slice(index + 1).trim();
      if (!process.env[key]) {
        process.env[key] = val;
      }
    }
  }
}

async function main() {
  loadEnv();
  console.log('Starting daily cron route regression test...');

  // Dynamically import GET to ensure environment is fully loaded first
  const { GET } = await import('../app/api/ingest-resources/route');

  // Fallbacks if not set in environment or file
  const token = process.env.INGEST_AUTH_TOKEN || 'vinay-dev-ingest-2026';
  const cronSecret = process.env.CRON_SECRET || 'cron-secret-2026';

  // Inject both query parameter token and Authorization header to guarantee authentication
  const url = new URL(`http://localhost:3000/api/ingest-resources?token=${token}`);
  const req = new NextRequest(url.toString(), {
    headers: {
      'authorization': `Bearer ${cronSecret}`
    }
  });

  try {
    console.log('Invoking GET handler...');
    const response = await GET(req);
    console.log('Response Status:', response.status);

    let body: any;
    try {
      body = await response.json();
    } catch (e) {
      console.error('Failed to parse response body as JSON');
    }

    if (response.status !== 200) {
      console.error('Inbound Ingestion Route Request Failed!');
      if (body) {
        console.error('Response Error Body:', JSON.stringify(body, null, 2));
      }
      process.exit(1);
    }

    if (body) {
      console.log('Response Body Summary:');
      console.log(`  Created:   ${body.created}`);
      console.log(`  Skipped:   ${body.skipped}`);
      console.log(`  Errors:    ${body.errors ? body.errors.length : 0}`);
      if (body.errors && body.errors.length > 0) {
        console.log('Errors:', body.errors);
      }
    }
  } catch (err) {
    console.error('Error invoking GET handler:', err);
    process.exit(1);
  }
}

main();
