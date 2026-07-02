# Testing and Verification

**Analysis Date:** 2026-07-02

## Automated Tests

> [!WARNING]
> There is currently no automated testing framework (such as Vitest, Jest, Playwright, or Cypress) configured in this project. No unit or integration test files exist.

## Verification Commands

**Type Checking:**
- Verify TypeScript types compile without errors:
  ```bash
  npx tsc --noEmit
  ```

**Linting:**
- Lint codebase configuration:
  ```bash
  npm run lint
  ```

**Build Validation:**
- Validate that the Next.js production build completes successfully (catches route, component, and bundle issues):
  ```bash
  npm run build
  ```

## Manual Verification Flows

**1. Form Submissions (Contact/Careers):**
- Start local development server (`npm run dev`).
- Open `/contact` or `/careers` (apply for a job).
- Submit a valid form.
- Verify that nodemailer SMTP dispatch completes successfully and prints logs in the terminal.
- Verify an error is displayed to the user if required fields are missing.

**2. Content Ingestion & Classification:**
- Trigger resource ingestion manually by requesting `/api/ingest-resources?token={INGEST_AUTH_TOKEN}`.
- Inspect the output JSON payload to confirm items were fetched, processed, and classified by Claude.
- Verify that Contentful entries were created and published correctly.
- Request `/api/revalidate?token={REVALIDATE_CACHE_AUTH_TOKEN}` via headers and verify `/resources` and `/careers` pages are updated.

---

*Testing review: 2026-07-02*
*Update once test frameworks are integrated*
