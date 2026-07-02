# Architecture

**Analysis Date:** 2026-07-02

## Pattern Overview

**Overall:** Next.js Full-Stack App Router Architecture

**Key Characteristics:**
- **Hybrid Rendering Model:** Page-level Server Components fetch data server-side via GraphQL, feeding it directly to interactive Client Components (filters, forms, modals).
- **Serverless API Routes:** Decoupled routes handling form processing (Nodemailer), RSS scraping, and Contentful write mutations.
- **Stateless Operation:** No local database or session state; auth tokens and data are managed externally via Contentful, Anthropic, and SMTP.
- **Static & Incremental Revalidation:** Uses Next.js ISR (Incremental Static Regeneration) with path-based revalidation triggers to keep page loads fast.

## Layers

**Routing & Page Layer (`app/`):**
- **Purpose:** Declares URL paths, layouts, sitemaps, and server-side entry points.
- **Contains:** Page templates (e.g., `app/resources/page.tsx`, `app/careers/page.tsx`) that perform initial data fetching.
- **Depends on:** Component layer, Lib layer.

**Component Layer (`components/`):**
- **Purpose:** Encapsulates UI presentation, styling, and interactive features.
- **Contains:** Complex page feeds (e.g., `components/resources-feed.tsx`), animations, modals, and base elements (`components/ui/*`).
- **Depends on:** Lib layer, Hooks layer.

**API / Controller Layer (`app/api/`):**
- **Purpose:** Exposes public or secured endpoints for mutations and background actions.
- **Contains:** Next.js route handlers (`app/api/contact/route.ts`, `app/api/ingest-resources/route.ts`).
- **Depends on:** Lib layer.

**Data & Service Layer (`lib/`):**
- **Purpose:** Connects to third-party APIs (Contentful, Anthropic) and contains core utilities.
- **Contains:** GraphQL query helpers, REST CMS wrappers, AI prompts, and TypeScript types.
- **Depends on:** Node.js standard built-ins and npm packages only.

## Data Flow

**Regulatory Resource Ingestion & Classification:**
1. Vercel Cron or a manual HTTP call triggers `app/api/ingest-resources/route.ts`.
2. The route handler fetches XML feeds using `rss-parser`.
3. Titles are compared with a Set of existing items from Contentful (`getExistingResourceTitles`) to filter out duplicates.
4. Unmapped items are passed to `classifyResource` (`lib/ai-classify.ts`), which sends the title/description to Claude (`claude-haiku-4-5`) to extract structured metadata.
5. The parsed JSON is used to create and publish a `resourceItem` entry in Contentful.
6. The new entry ID is linked to the parent `resourcePage` record.
7. Next.js cache is purged for `/resources` using `revalidatePath`.

**Job Application/Contact Inquiry:**
1. A user submits a form or modal (e.g., `components/job-application-modal.tsx`).
2. The form data is compiled (with file attachments if applying for a job) and sent via HTTP `POST` to `/api/apply` or `/api/contact`.
3. The API route receives the payload, validates required fields, and instantiates a Nodemailer transporter.
4. Nodemailer connects to SMTP (Gmail) and sends a structured HTML notification to the administrator (`process.env.RECIPIENT_EMAIL`).
5. Upon successful delivery, the client-side component displays a success notification.

## Key Abstractions

**GraphQL Query Client (`lib/contentful-graphql-client.ts`):**
- **Purpose:** Custom wrapper around native fetch that calls Contentful's GraphQL API.
- **Pattern:** Stateless async function. Handles and filters out GraphQL `UNRESOLVABLE_LINK` warnings.

**CMS Management Helper (`lib/contentful-management.ts`):**
- **Purpose:** Abstract REST endpoints for Contentful content mutations.
- **Pattern:** CRUD operations utility library. Executes consecutive POST/PUT calls to create, publish, and link content models.

**AI Classify Engine (`lib/ai-classify.ts`):**
- **Purpose:** Interfacing with Anthropic Claude to classify text payloads.
- **Pattern:** Wrapper utility around `@anthropic-ai/sdk` client. Includes prompt construction, API call, and JSON parser validation.

## Entry Points

**Web Browsing Pages:**
- `app/page.tsx` - Homepage with interactive elements.
- `app/resources/page.tsx` - Regulatory feed server page.
- `app/careers/page.tsx` - Job board server page.

**API Operations:**
- `app/api/apply/route.ts` - Career applications route.
- `app/api/contact/route.ts` - User contact submissions route.
- `app/api/ingest-resources/route.ts` - Cron-triggered resource crawler route.
- `app/api/revalidate/route.ts` - Purge cache revalidation route.

## Error Handling

**Strategy:** Exception bubbling with API-level catching.
- GraphQL data loaders filter out null records that may have failed to resolve.
- API handlers capture errors using try/catch, log failures via `console.error`, and return friendly JSON error responses with standard HTTP status codes (400, 401, 500).
- Mail client handles errors gracefully, ensuring bad uploads do not crash the API.

## Cross-Cutting Concerns

**Authentication:**
- API routes utilize token validation. Cron route checks `Bearer ${CRON_SECRET}` or `?token=...`, while revalidation checks header `Revalidate-Cache-Auth-Token`.

**Styling & Theming:**
- Uses Tailwind CSS v4 variables mapped inside `app/globals.css`.
- Theme context is supplied via `ThemeProviders` (utilizing `next-themes`) to control light/dark mode.

**Client-Side Animations:**
- Managed consistently using custom Framer Motion wrappers located in `components/scroll-animations.tsx`.

---

*Architecture analysis: 2026-07-02*
*Update when major patterns change*
