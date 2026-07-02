# Coding Conventions

**Analysis Date:** 2026-07-02

## Code Style

**Naming Rules:**
- **Files & Folders:** Kebab-case for folder names and file names (e.g., `careers-feed.tsx`, `contentful-management.ts`).
- **Next.js Conventions:** Layouts must be `layout.tsx`, pages must be `page.tsx`, API routes must be `route.ts`.
- **React Components:** PascalCase for component functions (e.g. `CareersFeed`).
- **Functions:** camelCase for helper methods and services (e.g., `classifyResource`, `getExistingResourceTitles`).
- **Interfaces & Types:** PascalCase (e.g., `ResourceClassification`, `FeedConfig`).

**Imports:**
- Path alias `@/*` must be used to reference paths from the root directory (e.g., `import { cn } from '@/lib/utils'`).
- Avoid deep relative paths (e.g., `../../components/ui/button`).

## React & Next.js

**Component Separation:**
- Default to **Server Components** for page routes to fetch data directly (GraphQL/REST) during request time.
- Use `'use client'` at the very top of files only for components that use React hooks (such as `useState`, `useEffect`, `useRef`), interactive UI handlers, or browser-specific libraries.

**State & UI Management:**
- Class merging: Dynamic class strings must use the `cn` helper from `@/lib/utils` to merge Tailwind classes cleanly without conflicts.
- Animations: Interactive state changes, page loading, and scroll animations are handled via `framer-motion` using consistent stagger and duration constants.

## Styling

**Tailwind CSS v4 Standard:**
- Do not use `tailwind.config.js`. Tailwind CSS v4 is configured entirely in the stylesheet using `@theme` and custom `@utility` rules.
- Visual variables (such as colors, margins, glassmorphic filters, and radius sizes) are declared in CSS `:root` and `.dark` selectors within `app/globals.css`.

## Data & Error Handling

**Contentful Integrations:**
- Always filter out potential stale pointers returned from Contentful queries (represented by null objects) on the consumer side:
  ```typescript
  const items = (rawItems || []).filter(Boolean);
  ```
- Gracefully handle `UNRESOLVABLE_LINK` messages from GraphQL responses to prevent rendering errors.

**API Operations:**
- Explicitly validate required fields for POST/PUT requests at the entry point of the route handler.
- Wrap external service calls (Anthropic, Nodemailer, Contentful) in try/catch blocks and return standardized HTTP error statuses (400, 401, 500) rather than letting failures crash the handler.

---

*Conventions checklist: 2026-07-02*
*Review code against these standards prior to shipping*
