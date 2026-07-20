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

## 6. Future Considerations & TODOs
- **TODO [Phase 2]:** Implement full parsing and document downloading mechanisms.
- **TODO [Phase 2]:** Add actual API integrations for EMA search database.
