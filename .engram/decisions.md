# Project Architectural Decisions & Memory

## Resources Page & Ingestion Pipeline Updates (2026-07-24)

### 1. Filter Sidebar Header Styling
- **Component**: `components/resources-feed.tsx`
- **Change**: Updated the divider directly below the "FILTER" label to match the divider below the "DATE" desktop list header (`px-2 pb-2 mb-5 border-b-2 border-foreground/20`).

### 2. Publication Date Extraction & Resolution
- **Utility**: `lib/date-utils.ts` (`extractResourceDate`, `formatDate`)
- **Root Cause Resolved**: Contentful entries store their CMS entry publishing timestamp in `sys.publishedAt`, which led to ingestion run dates (e.g. July 22, 2026) displaying on resources whose original document publication dates were different (e.g. March 26, 2026, November 16, 2015, or December 9, 2024).
- **Implementation**:
  - Implemented `extractResourceDate` to parse authoritative publication dates directly from source metadata (URL date patterns, ISO date strings, European date formats, and written month-day-year expressions).
  - Integrated `extractResourceDate` into `ResourcesFeed` (`ResourceRow` & `MobileResourceItem`) and `ResourceModal`.
  - Updated `processItem` in `lib/ingestion/ingestion-pipeline.ts` so future resource discovery and ingestion pipelines automatically resolve and preserve the original publication date from authoritative source metadata without falling back to upload/creation timestamps.

### 3. Date Filter Synchronization & Backend Fix
- **Component / Route**: `app/resources/page.tsx`
- **Root Cause Identified**:
  - Previously, date range filtering passed `where.sys = { publishedAt_gte: ..., publishedAt_lte: ... }` to Contentful GraphQL API.
  - Contentful evaluated `sys.publishedAt` (the CMS ingestion creation timestamp `2026-07-20...`), whereas the UI rendered the actual document publication date extracted via `extractResourceDate`.
  - When filtering for year 2024, Contentful returned 0 records because `sys.publishedAt` for all items was in 2026, causing "No resources match your active search or filters" even though 2024 items existed in the UI.
- **Implementation & Synchronization**:
  - Updated `app/resources/page.tsx` to evaluate date filtering and sorting using `extractResourceDate(item)` as the single source of truth across both backend and frontend.
  - Date range filters (`2024`, `2025`, `2026`, custom `startDate` / `endDate`) now compare `extractResourceDate(item)` timestamps.
  - Sorting (`newest`, `oldest`) orders items chronologically based on `extractResourceDate(item)`.
- **Verification**:
  - Verified 2024 filtering returns all 5 matching 2024 resources.
  - Verified 2026 filtering returns 47 resources.
  - Verified 2015-to-present range returns all 56 resources.
  - Confirmed 0 TypeScript errors (`npx tsc --noEmit`).

### 4. Authoritative Source Validation & Issuing Agency Attribution
- **Root Cause Identified**:
  - `GovInfo` is an official publishing/hosting platform operated by the U.S. Government Publishing Office (GPO), not the issuing regulatory authority for hosted documents.
  - Previously, `getAgencyFromResource` and audit helpers returned `'GovInfo'` when `sourceUrl` contained `govinfo.gov`.
- **Implementation**:
  - Updated `getAgencyFromResource` in `lib/agency-utils.ts` and `classifyResourceDeterministic` in `lib/ingestion/rule-classifier.ts` to identify the actual issuing regulatory authority (e.g., **FDA**, **EMA**, **MHRA**, **CDSCO**, **TGA**, **Health Canada**, **CDC**, **CMS**, **EPA**) while preserving the original source URL.
  - Added `isAuthoritativeSource(item)` validation in `lib/ingestion/ingestion-pipeline.ts` to verify domain authenticity (`.gov`, `.gov.uk`, `.gov.in`, `.europa.eu`, `.gov.au`, `.ca`) and reject draft/placeholder/incomplete resources during ingestion.
  - Updated `FEEDS` config in `app/api/ingest-resources/route.ts` so `GovInfo Federal Register` is attributed to `FDA`.
  - Purged incomplete draft item (`6kDgSALJpJvr9YdLEMcH8j`) from Contentful.
- **Dataset Audit Verification**:
  - Total valid resources: **55**
  - Issuing Agencies: **FDA: 24**, **MHRA: 14**, **CDSCO: 9**, **EMA: 8**, **GovInfo: 0**, **Federal Register: 0**.
  - Historical dates (2015–2026): **2015: 1**, **2021: 1**, **2022: 1**, **2023: 1**, **2024: 5**, **2026: 46**.
  - Duplicates: **0**.

### 5. Worldwide Agency Detection, Extensible Validation & URL Truncation
- **Worldwide Agency Resolution**:
  - Expanded `AGENCIES` registry and `getAgencyFromResource` in `lib/agency-utils.ts` to support global regulatory bodies (FDA, EPA, CMS, CDC, NIH, SEC, EMA, EFSA, CDSCO, MHRA, NICE, TGA, Health Canada, Medsafe, PMDA, MFDS, HSA, Swissmedic, WHO).
  - Explicitly decoupled hosting platforms (GovInfo, Federal Register, GPO, EUR-Lex) from issuing regulatory authorities. Documents on Federal Register / GovInfo are classified based on metadata, agency identifiers, and document text (EPA, CMS, CDC, FDA, etc.).
- **Extensible Worldwide Authority Validation**:
  - Refined `isAuthoritativeSource` in `lib/ingestion/ingestion-pipeline.ts` to combine explicit global domain lists (US, EU, UK, India, Australia, NZ, Canada, Japan, South Korea, Singapore, Switzerland, WHO, ISO, ICH, PIC/S) with generic official government TLD pattern matching (`.gov`, `.govt`, `.go.<cc>`, `.gov.<cc>`, `.europa.eu`, `.admin.ch`, `.who.int`).
- **Source URL Visual Truncation**:
  - Updated `ResourceRow`, `MobileResourceItem` (`components/resources-feed.tsx`), and `ResourceModal` (`components/resource-modal.tsx`) to visually truncate long Source URLs with `truncate inline-block max-w-[...]` and `title={sourceUrl}` tooltips.
  - Prevents layout overflow and line expansion while preserving full hyperlinked URL and hover accessibility.

### 6. Metadata-First Authority Resolution Engine
- **Engine Created**: Implemented `resolveAuthority` in `lib/authority-resolver.ts` enforcing a 6-step priority order:
  1. **Step 1**: Structured Metadata (RSS `<dc:creator>`, `<publisher>`, `<author>`, Federal Register API `agencies`, XML/JSON fields, OpenGraph/Dublin Core).
  2. **Step 2**: Document & Publication Properties (PDF properties, official publication headers).
  3. **Step 3**: HTML Page / Publisher Metadata (`og:site_name`, canonical publisher metadata).
  4. **Step 4**: Text NLP (Natural authority detection in title/description).
  5. **Step 5**: Source Domain Validation (Confirms domain authenticity, NOT issuing agency).
  6. **Step 6**: Registry Fallback (Fallback to `AGENCIES` in `agency-utils.ts`).
- **Automatic Recognition**: Automatically extracts and classifies newly discovered official regulatory authorities (e.g., Singapore HSA, Swissmedic, PMDA, MFDS) without requiring code changes when structured metadata is present.
- **Collector Enhancement**: Updated `RssCollector` (`rss-collector.ts`) and `FederalRegisterCollector` (`federal-register-collector.ts`) to extract and pass structured metadata (`metadata.creator`, `metadata.publisher`, `metadata.agencies`) to `CollectedItem`.
- **Integrations**: Updated `getAgencyFromResource` (`agency-utils.ts`) and `classifyResourceDeterministic` (`rule-classifier.ts`) to use `resolveAuthority`.
