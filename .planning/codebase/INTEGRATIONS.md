# External Integrations

**Analysis Date:** 2026-07-02

## APIs & External Services

**Anthropic Claude API:**
- **Purpose:** Classifies crawled regulatory resources into structured categories (product type, country, short summary, resource type) using AI.
  - SDK/Client: `@anthropic-ai/sdk` npm package.
  - Auth: API key in `ANTHROPIC_API_KEY` environment variable.
  - Model: `claude-haiku-4-5` (used inside `lib/ai-classify.ts`).

**Gmail / SMTP (via Nodemailer):**
- **Purpose:** Sends automated notification emails when users submit contact inquiries or apply for careers.
  - SDK/Client: `nodemailer` npm package.
  - Service: Gmail SMTP (configured via `service: 'gmail'`).
  - Auth: Credentials in `EMAIL` and `EMAIL_PASSWORD` environment variables.
  - Mail Details: Sent from `"${process.env.EMAIL_NAME}" <${process.env.EMAIL}>` to `process.env.RECIPIENT_EMAIL`.

**RSS Feeds (crawling):**
- **Purpose:** Source feeds for regulatory updates.
  - SDK/Client: `rss-parser` npm package.
  - Endpoints used:
    - FDA Press Releases: `https://www.fda.gov/about-fda/contact-fda/stay-informed/rss-feeds/press-releases/rss.xml`
    - Federal Register (FDA): `https://www.federalregister.gov/api/v1/documents.rss?conditions%5Bagencies%5D%5B%5D=food-and-drug-administration`
    - GovInfo Federal Register: `https://www.govinfo.gov/rss/fr.xml`

## Data Storage

**Contentful CMS:**
- **Purpose:** Headless CMS storing all regulatory resources, careers listings, and page structures.
  - Integration method: Direct HTTP POST and PUT requests to GraphQL and Content Management REST APIs.
  - Auth:
    - `CONTENTFUL_ACCESS_TOKEN` for GraphQL queries.
    - `CONTENTFUL_MANAGEMENT_TOKEN` for creating and publishing entries.
    - `CONTENTFUL_SPACE_ID` & `CONTENTFUL_ENVIRONMENT_ID` (defaults to 'master').
  - Content Models:
    - `resourcePage` containing a collection of `resourceItem`s.
    - `careersPage` containing a collection of `job`s.
  - Entry Flow:
    - Create entry → Publish entry via `PUT` request to `/entries/{id}/published` → Link entry to parent page.

## Monitoring & Observability

**Vercel Analytics:**
- **Purpose:** Collects product performance and visitor insights.
  - SDK/Client: `@vercel/analytics/next` integrated in `app/layout.tsx`.

## CI/CD & Deployment

**Hosting:**
- **Platform:** Vercel
  - Deployment: Auto-builds and deploys Next.js application on branch pushes.
  - Secrets: Configured directly in the Vercel dashboard.

**Cron/Scheduled Jobs:**
- **Trigger:** Vercel Cron.
  - Endpoint: `/api/ingest-resources` running on a schedule.
  - Auth: Verifies authorization header `Bearer ${CRON_SECRET}` or URL query parameter `token` matching `INGEST_AUTH_TOKEN`.

## Environment Configuration

**Required Environment Variables:**
- `CONTENTFUL_SPACE_ID` - Contentful space ID.
- `CONTENTFUL_ENVIRONMENT_ID` - Contentful environment (e.g., `master`).
- `CONTENTFUL_ACCESS_TOKEN` - Contentful delivery API access token.
- `CONTENTFUL_MANAGEMENT_TOKEN` - Contentful management API write token.
- `ANTHROPIC_API_KEY` - Anthropic Claude API secret key.
- `EMAIL` - Gmail sender address.
- `EMAIL_PASSWORD` - Gmail app password.
- `EMAIL_NAME` - Human-readable sender name.
- `RECIPIENT_EMAIL` - Target email address for contact and job applications.
- `CRON_SECRET` - Shared secret for Vercel Cron endpoint.
- `INGEST_AUTH_TOKEN` - Secret key for manual ingestion trigger.
- `REVALIDATE_CACHE_AUTH_TOKEN` - Secret key for cache revalidation trigger.

## Webhooks & Callbacks

**Incoming:**
- **Revalidation Webhook:** `/api/revalidate`
  - Purpose: Manually clear Next.js ISR caches.
  - Verification: Matches header `Revalidate-Cache-Auth-Token` against `REVALIDATE_CACHE_AUTH_TOKEN`.
  - Actions: Revalidates routes `/resources` and `/careers` using `revalidatePath()`.

---

*Integration audit: 2026-07-02*
*Update when adding/removing external services*
