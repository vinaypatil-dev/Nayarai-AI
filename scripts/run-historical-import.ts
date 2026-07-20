import { HistoricalImporter } from '../lib/ingestion/historical-importer';
import { FederalRegisterCollector } from '../lib/ingestion/collectors/federal-register-collector';
import { JsonProgressStore } from '../lib/ingestion/progress-store';
import { IngestionLogger } from '../lib/ingestion/logger';
import { HistoricalImportConfig } from '../lib/ingestion/types';

function parseArgs(argv: string[]): Record<string, string> {
  const args: Record<string, string> = {};
  for (const arg of argv.slice(2)) {
    if (arg.startsWith('--')) {
      const [key, ...valueParts] = arg.slice(2).split('=');
      args[key] = valueParts.length > 0 ? valueParts.join('=') : 'true';
    }
  }
  return args;
}

function printUsage() {
  console.log(`
╔══════════════════════════════════════════════════════════════╗
║        Historical Regulatory Import Engine (Phase 2)        ║
╚══════════════════════════════════════════════════════════════╝

Usage:
  npx tsx scripts/run-historical-import.ts [options]

Options:
  --dry-run          Perform all steps except Contentful writes (default: false)
  --start-year=YYYY  Start year for import (default: 2015)
  --end-year=YYYY    End year for import (default: current year)
  --from=YYYY-MM     Override start to a specific month (e.g. 2024-01)
  --to=YYYY-MM       Override end to a specific month (e.g. 2024-03)
  --max-items=N      Max items per batch (default: 20)
  --batch-size=N     Months per batch (default: 1)
  --throttle=N       Delay in ms between Contentful writes (default: 1000)
  --batch-delay=N    Delay in ms between batches (default: 5000)
  --agency=NAME      Collector name to run (default: all registered)
  --resume           Resume from last progress checkpoint
  --help             Show this help message

Verification order (recommended):
  1. Dry run:       --dry-run --from=2024-01 --to=2024-01 --max-items=3
  2. 3 records:     --from=2024-01 --to=2024-01 --max-items=3
  3. 20 records:    --from=2024-01 --to=2024-01
  4. 1 month:       --from=2024-06 --to=2024-06
  5. Multi-month:   --from=2024-01 --to=2024-06
  6. Long-running:  --start-year=2023

Examples:
  # Dry run — test 3 items from January 2024
  export $(grep -v '^#' .env.local | xargs) && \\
    npx tsx scripts/run-historical-import.ts --dry-run --from=2024-01 --to=2024-01 --max-items=3

  # Limited real import — 3 items
  export $(grep -v '^#' .env.local | xargs) && \\
    npx tsx scripts/run-historical-import.ts --from=2024-01 --to=2024-01 --max-items=3

  # Resume after interruption
  export $(grep -v '^#' .env.local | xargs) && \\
    npx tsx scripts/run-historical-import.ts --resume
`);
}

async function run() {
  const args = parseArgs(process.argv);

  if (args['help']) {
    printUsage();
    process.exit(0);
  }

  // Validate environment
  if (!args['dry-run'] && !process.env.CONTENTFUL_MANAGEMENT_TOKEN) {
    console.error('Error: CONTENTFUL_MANAGEMENT_TOKEN is required for non-dry-run imports.');
    console.error('Set it in .env.local and run with:');
    console.error('  export $(grep -v \'#\' .env.local | xargs) && npx tsx scripts/run-historical-import.ts');
    process.exit(1);
  }

  const currentYear = new Date().getFullYear();

  const config: HistoricalImportConfig = {
    startYear: parseInt(args['start-year'] ?? '2015', 10),
    endYear: parseInt(args['end-year'] ?? String(currentYear), 10),
    batchSizeMonths: parseInt(args['batch-size'] ?? '1', 10),
    maxItemsPerBatch: parseInt(args['max-items'] ?? '20', 10),
    dryRun: args['dry-run'] === 'true',
    agencies: args['agency'] ? [args['agency']] : [],
    throttleMs: parseInt(args['throttle'] ?? '1000', 10),
    batchDelayMs: parseInt(args['batch-delay'] ?? '5000', 10),
    fromMonth: args['from'],
    toMonth: args['to'],
    resume: args['resume'] === 'true',
  };

  const logger = new IngestionLogger();
  const progressStore = new JsonProgressStore();

  // Register available historical collectors
  const collectors = [
    new FederalRegisterCollector(),
  ];

  const importer = new HistoricalImporter(collectors, progressStore, logger);

  console.log('');
  console.log('═══════════════════════════════════════════');
  console.log('  Historical Import Configuration');
  console.log('═══════════════════════════════════════════');
  if (config.fromMonth || config.toMonth) {
    console.log(`  Date range:     ${config.fromMonth ?? `${config.startYear}-01`} to ${config.toMonth ?? `${config.endYear}-12`}`);
  } else {
    console.log(`  Date range:     ${config.startYear} to ${config.endYear}`);
  }
  console.log(`  Batch size:     ${config.batchSizeMonths} month(s)`);
  console.log(`  Max per batch:  ${config.maxItemsPerBatch}`);
  console.log(`  Throttle:       ${config.throttleMs}ms`);
  console.log(`  Batch delay:    ${config.batchDelayMs}ms`);
  console.log(`  Dry run:        ${config.dryRun}`);
  console.log(`  Resume:         ${config.resume}`);
  console.log(`  Collectors:     ${config.agencies.length > 0 ? config.agencies.join(', ') : 'all'}`);
  console.log('═══════════════════════════════════════════');
  console.log('');

  try {
    const summaries = await importer.runImport(config);

    console.log('');
    console.log('═══════════════════════════════════════════');
    console.log('  Import Summary');
    console.log('═══════════════════════════════════════════');

    for (const s of summaries) {
      const durationSec = (s.durationMs / 1000).toFixed(1);
      console.log(`  Collector:      ${s.collector}`);
      console.log(`  Imported:       ${s.totalImported}`);
      console.log(`  Skipped:        ${s.totalSkipped}`);
      console.log(`  Failed:         ${s.totalFailed}`);
      console.log(`  Batches:        ${s.batchesCompleted}/${s.totalBatches}`);
      console.log(`  Duration:       ${durationSec}s`);
      console.log('───────────────────────────────────────────');
    }

    if (config.dryRun) {
      console.log('  Mode:           DRY RUN (no Contentful writes)');
    }
    console.log('═══════════════════════════════════════════');
    console.log('');

    // Exit with non-zero if there were failures
    const totalFailed = summaries.reduce((sum, s) => sum + s.totalFailed, 0);
    process.exit(totalFailed > 0 ? 1 : 0);
  } catch (err) {
    logger.error('Historical import failed', err);
    process.exit(1);
  }
}

run();
