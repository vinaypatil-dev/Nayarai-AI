# Regulatory Ingestion Engine - Implementation Journal (Phase 1)

This journal tracks the development progress, design choices, modifications, issues encountered, and verification results for the Phase 1 backend refactoring.

---

## 1. Architectural Decisions

### AD1.1: Modular Ingestion Directory (`lib/ingestion`)
- **Decision:** Encapsulate all ingestion logic (interfaces, collectors, classifiers, and logging) under a single namespace `lib/ingestion`.
- **Why:** Separates standard data mutation helpers from data collection strategies and rules. Prevents code bloat in Next.js api routes.

### AD1.2: Deterministic Rule-Based Classification
- **Decision:** Replace runtime LLM calls (`classifyResource` using `claude-haiku-4-5`) with a local keyword heuristic classifier.
- **Why:** Complies with the constraint to completely remove AI dependency. Eliminates API costs, network latency, and LLM reliability risks.

### AD1.3: Extensible Collector Interface
- **Decision:** Design a simple TypeScript interface (`Collector`) that forces any future data collector (scraping, database replication, direct APIs) to output a unified `CollectedItem` format.
- **Why:** Allows developers to easily plug in collectors for additional worldwide agencies later.

### AD1.4: Structured Production Logging
- **Decision:** Implement an `IngestionLogger` that prints structured JSON formats to stdout/stderr while accumulating text lists for the HTTP response.
- **Why:** Enables cloud log aggregation (e.g., Datadog, CloudWatch) to easily parse levels and metrics while preserving exact response backward-compatibility.

---

## 2. Files Modified / Created

- `docs/regulatory-engine-journal.md` (Modified): Holds development progress and architecture log.
- `lib/ingestion/types.ts` (Created): Declares data models and interfaces (`Collector`, `CollectedItem`, `ResourceClassification`).
- `lib/ingestion/logger.ts` (Created): Declares `IngestionLogger` for structured production logging.
- `lib/ingestion/rule-classifier.ts` (Modified): Local rule-based classification heuristics. Adjusted `resourceType` values to `PDF` or `VIDEO` to match Contentful space constraints.
- `lib/ingestion/collectors/rss-collector.ts` (Created): Generic RSS feed crawler implementation.
- `lib/ingestion/collectors/fda-collector.ts` (Created): Stub collector for FDA advanced openFDA crawls.
- `lib/ingestion/collectors/ema-collector.ts` (Created): Stub collector for European Medicines Agency.
- `lib/ingestion/collectors/mhra-collector.ts` (Created): Stub collector for UK MHRA search API.
- `lib/ingestion/collectors/cdsco-collector.ts` (Created): Stub collector for India's CDSCO circulars.
- `lib/ingestion/historical-importer.ts` (Created): Orchestration stub for backfilling data (2015-present).
- `lib/contentful-management.ts` (Modified): Replaced references to the non-existent content type ID `resourceItem` with the correct ID `resources`. Enhanced API error messaging on publish failures.
- `scripts/test-contentful.ts` (Created): Live sandbox integration verification script for Contentful.

---

## 3. Implementation Progress

- [x] Initialized journal file.
- [x] Implement core types and interfaces (`lib/ingestion/types.ts`).
- [x] Implement structured logging (`lib/ingestion/logger.ts`).
- [x] Implement deterministic classifier (`lib/ingestion/rule-classifier.ts`).
- [x] Implement generic RSS Collector (`lib/ingestion/collectors/rss-collector.ts`).
- [x] Create stub collectors for future agencies (FDA, EMA, MHRA, CDSCO) and historical imports.
- [x] Refactor API route handler `app/api/ingest-resources/route.ts`.
- [x] Fixed Contentful space content type ID mismatch and model validation errors.
- [x] Fixed FDA Press Releases feed returning false HTTP 404 due to CDN user-agent blocking.

---

## 4. Issues Encountered & Solutions
- **Issue: Content Type ID Mismatch**:
  - **Root Cause**: The ingestion script assumed the Contentful content type ID was `resourceItem`. In the actual Space configuration, the correct identifier is `resources`.
  - **Solution**: Updated all Contentful Management REST calls and fetch queries in `lib/contentful-management.ts` to reference `resources`.
- **Issue: Content Type Validation Error (`resourceType`)**:
  - **Root Cause**: Creating a resource failed on publish with a validation error because `resourceType` in the space is restricted to `["PDF", "VIDEO"]`. Our rule classifier previously outputted `["ARTICLE", "GUIDANCE", "REGULATION", "NOTICE"]`.
  - **Solution**: Refactored `lib/ingestion/rule-classifier.ts` to map `resourceType` deterministically to either `PDF` (default fallback) or `VIDEO` (for webinars, watch links, webinars, etc.). Updated `scripts/test-ingestion.ts` expectations accordingly.
- **Issue: FDA RSS Feed HTTP 404 Block**:
  - **Root Cause**: The official FDA Press Releases RSS feed URL (`https://www.fda.gov/about-fda/contact-fda/stay-informed/rss-feeds/press-releases/rss.xml`) returned an HTTP 404 error when fetched using Node's standard HTTP client (used by `rss-parser`). This occurs because the FDA's Akamai CDN blocks requests from default Node.js library user-agents.
  - **Solution**: Updated `RssCollector` in `lib/ingestion/collectors/rss-collector.ts` to fetch XML feeds using native `fetch` with realistic browser headers (`User-Agent` and `Accept`), and then parse the XML string using `parser.parseString()`. This bypasses CDN blockages cleanly while keeping the official feed URL intact.

---

## 5. Testing Performed
- **Unit Validation Script (`scripts/test-ingestion.ts`)**: Confirmed rules engine maps to correct product types and resolves `resourceType` strictly to `PDF`/`VIDEO`.
- **Integration Validation Script (`scripts/test-contentful.ts`)**: Performed live API operations:
  - Fetched existing titles from `content_type=resources`.
  - Created a test entry in `resources`.
  - Published the test entry.
  - Linked the entry to `resourcePage` successfully.
  - Safely unpublished and deleted the test entry.
- **Test execution log**:
  ```bash
  export $(grep -v '^#' .env.local | xargs) && npx tsx scripts/test-contentful.ts
  Starting Contentful model validation...
  Space ID: svbiz6ckbh56
  Environment: master

  1. Fetching existing resource titles...
  ✓ Fetched 4 existing titles.

  2. Creating and publishing a test resource entry...
  ✓ Entry created and published successfully. ID: 4xcLYDf3D0ccwy5DESJwms

  3. Linking test resource entry to ResourcePage...
  ✓ Entry linked successfully.

  4. Cleaning up...
  Cleaning up test entry 4xcLYDf3D0ccwy5DESJwms...
  ✓ Entry unpublished.
  ✓ Entry deleted.

  Contentful integration model validation passed successfully!
  ```
- **FDA Feed Ingestion Integration Verification**:
  - **Verification Method**: Ran Next.js development server and triggered the API route: `GET http://localhost:3000/api/ingest-resources?token=vinay-dev-ingest-2026`.
  - **Results**:
    - FDA Press Releases feed fetched successfully (20 items).
    - Federal Register (FDA) feed fetched successfully (64 items).
    - GovInfo Federal Register feed fetched successfully (100 items).
    - Resource creation and Contentful model validations executed without any errors (`totalErrors: 0`).
    - Cache successfully revalidated for `/resources`.

---

## 6. Future Considerations & TODOs (Phase 1)
- ~~**TODO [Phase 2]:** Implement full parsing and document downloading mechanisms.~~ → Addressed in Phase 2.
- **TODO [Future]:** Add actual API integrations for EMA search database.

---
---

# Phase 2: Historical Regulatory Import Engine

This section documents the Phase 2 implementation, which adds historical import capability to the existing ingestion architecture.

---

## 7. Architectural Decisions (Phase 2)

### AD2.1: Shared Ingestion Pipeline
- **Decision:** Extract the classify → dedup → create → publish → link logic from the daily cron route into a reusable `processItem()` function in `lib/ingestion/ingestion-pipeline.ts`.
- **Why:** Eliminates code duplication between the daily cron route and the historical importer. Both use the same processing path, ensuring consistent behavior.

### AD2.2: HistoricalCollector Interface Extension
- **Decision:** Extend the Phase 1 `Collector` interface with `HistoricalCollector` adding `fetchHistorical(startDate, endDate)`.
- **Why:** Preserves backward compatibility with existing collectors (RssCollector) while enabling date-range queries for new collectors.

### AD2.3: ProgressStore Abstraction
- **Decision:** Define a `ProgressStore` interface with `load()`, `save()`, and `clear()` methods. Implement `JsonProgressStore` using a local `.ingestion-progress.json` file.
- **Why:** Decouples progress persistence from the importer. Future implementations (ContentfulProgressStore, PostgresProgressStore) can swap in without changing the HistoricalImporter class.

### AD2.4: Monthly Batch Processing
- **Decision:** Break historical date ranges into monthly batches (configurable). Each batch independently fetches, processes, and checkpoints progress.
- **Why:** Prevents memory exhaustion on multi-year imports. The Federal Register API has a 2000-result pagination limit per query, and monthly batches typically yield 30–60 FDA documents per month (well under the limit).

### AD2.5: Federal Register JSON API as Primary Historical Source
- **Decision:** Use the Federal Register REST API (`federalregister.gov/api/v1/documents.json`) as the first and only historical data source in Phase 2.
- **Why:** It is the only publicly available, structured, date-filterable, paginated JSON API providing FDA regulatory documents back to 1994. The FDA RSS feed contains only ~20 recent items. openFDA covers adverse events, not regulatory publications. EMA/MHRA/CDSCO require scraping infrastructure out of scope for Phase 2.

### AD2.6: Throttling and Rate Limit Protection
- **Decision:** Configurable `throttleMs` (default 1000ms) between Contentful writes and `batchDelayMs` (default 5000ms) between batches.
- **Why:** Contentful Management API rate limit is 7 requests/second. Each resource entry requires ~4 API calls (create + publish + wait + link). At 1000ms throttle, throughput is ~1 entry/second, well within limits.

---

## 8. Files Modified / Created (Phase 2)

- `lib/ingestion/types.ts` (Modified): Added `HistoricalCollector`, `HistoricalImportConfig`, `HistoricalImportProgress`, and `ProgressStore` interfaces.
- `lib/ingestion/progress-store.ts` (Created): `JsonProgressStore` implementation with `ProgressStore` interface.
- `lib/ingestion/collectors/federal-register-collector.ts` (Created): Federal Register JSON API collector with date-range pagination.
- `lib/ingestion/ingestion-pipeline.ts` (Created): Shared `processItem()` function for both daily and historical flows.
- `lib/ingestion/historical-importer.ts` (Modified): Complete rewrite from stub to full implementation with batching, resume, and progress checkpointing.
- `scripts/run-historical-import.ts` (Created): CLI runner with --dry-run, --from/--to, --resume, --max-items options.
- `app/api/ingest-resources/route.ts` (Modified): Refactored to use shared `processItem()` pipeline. All existing behavior preserved.
- `.gitignore` (Modified): Added `.ingestion-progress.json`.

---

## 9. Implementation Progress (Phase 2)

- [x] Define HistoricalCollector, config, and progress types
- [x] Implement ProgressStore interface and JsonProgressStore
- [x] Implement Federal Register historical collector with pagination
- [x] Extract shared ingestion pipeline (processItem)
- [x] Rewrite HistoricalImporter with batching, throttling, resume, and progress checkpointing
- [x] Create CLI runner with configurable options and --from/--to support
- [x] Refactor daily cron route to use shared pipeline
- [x] Add .ingestion-progress.json to .gitignore
- [x] Verify: existing Phase 1 tests still pass
- [x] Verify: dry run with 3 items
- [x] Verify: real import of 3 items
- [x] Verify: deduplication on re-run (all 3 skipped)
- [x] Verify: daily cron regression test (0 errors, 0 created, 15 skipped)

---

## 10. Testing Performed (Phase 2)

### Phase 1 Regression
```bash
npx tsx scripts/test-ingestion.ts
# All classifier tests passed
# RSS collector fetched 100 items
# All ingestion engine local tests passed
```

### Dry Run (3 items, Jan 2024)
```bash
npx tsx scripts/run-historical-import.ts --dry-run --from=2024-01 --to=2024-01 --max-items=3
# Fetched 49 items from Federal Register API
# Processed 3, all classified correctly
# No Contentful writes (dry run mode)
# Batch report: imported=3, skipped=0, failed=0, duration=2315ms
```

### Real Import (3 items, Jan 2024)
```bash
export $(grep -v '^#' .env.local | xargs) && \
  npx tsx scripts/run-historical-import.ts --from=2024-01 --to=2024-01 --max-items=3
# Created 3 entries in Contentful
# Entry IDs: XP6JzwcwV20xbtUOZhiWZ, 2Jf1TXNrPPzu1v00qVo6gi, 1WzUHCFugFcTNYPqiruPpl
# Progress file created at .ingestion-progress.json
```

### Deduplication Verification
```bash
# Re-ran the same import command
# Result: imported=0, skipped=3, failed=0
# All 3 previously imported items correctly deduplicated
```

### Daily Cron Regression
```bash
curl -s "http://localhost:3000/api/ingest-resources?token=vinay-dev-ingest-2026"
# Response: {"created":0,"skipped":15,"errors":[],...}
# All 3 RSS feeds fetched successfully, no errors
```

---

## 11. Known Limitations (Phase 2)

- **Single Historical Source:** Only the Federal Register API is implemented. EMA, MHRA, CDSCO collectors remain stubs.
- **ResourcePage Scalability:** Every imported entry is linked to a single `resourcePage` entry. With thousands of historical imports, this array will grow very large. **TODO [Future]:** Redesign ResourcePage to use pagination, multiple pages, or a different linking strategy.
- **No Retry on Individual Item Failure:** If a single Contentful write fails, it is logged and counted as `failed` but not retried within the same batch. The batch continues. Re-running the import will attempt the failed items again.
- **Timezone in Date Batches:** Batch start/end dates use local timezone offsets. This may cause off-by-one-day issues near month boundaries depending on server timezone. For regulatory documents (published by date, not time), this is acceptable.
- **Federal Register API Rate Limiting:** The API does not require keys but may rate-limit aggressive requests. A 300ms delay between paginated requests is applied.
- **Full Import Duration:** A 2015–present import (~6000+ documents at ~20/batch) would take several hours due to throttling. Use `--resume` for interrupted runs.

---

## 12. Future Considerations & TODOs (Phase 2)

- **TODO [Phase 3]:** Implement EMA, MHRA, CDSCO historical collectors.
- **TODO [Future]:** Add ContentfulProgressStore or PostgresProgressStore for cloud-hosted progress tracking.
- **TODO [Future]:** Redesign ResourcePage linking for scalability (pagination or category-based pages).
- **TODO [Future]:** Add retry logic for transient Contentful API failures (429, 5xx).
- **TODO [Future]:** Add a --limit flag for total items across all batches (not just per-batch).

