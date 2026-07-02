# Workspace Structure

**Analysis Date:** 2026-07-02

## Directory Tree

```
nayarAi/
├── .agents/                    # GSD workflow scripts and skills
├── .github/                    # GitHub actions workflows
├── .planning/                  # GSD planning and codebase maps
│   └── codebase/               # Codebase documentation files
├── app/                        # Next.js App Router root
│   ├── api/                    # Serverless API routes
│   │   ├── apply/              # POST handler for career applications
│   │   ├── contact/            # POST handler for contact forms
│   │   ├── ingest-resources/   # GET handler for RSS ingestion and AI classification
│   │   └── revalidate/         # GET handler for ISR cache busting
│   ├── about/                  # About page route
│   ├── careers/                # Careers page route
│   ├── contact/                # Contact page route
│   ├── cookie/                 # Cookie policy page route
│   ├── legal/                  # Legal notice page route
│   ├── privacy/                # Privacy policy page route
│   ├── products/               # Products page route
│   ├── resources/              # Resources page route
│   ├── services/               # Services page route
│   ├── terms-of-service/       # Terms of service page route
│   ├── globals.css             # Main Tailwind CSS stylesheet
│   ├── layout.tsx              # Root HTML wrapper and theme injector
│   └── page.tsx                # Homepage client-side component
├── components/                 # React UI components
│   ├── ui/                     # Primitives (Radix wrappers / shadcn UI)
│   │   ├── button.tsx
│   │   ├── dialog.tsx
│   │   ├── select.tsx
│   │   └── ... (50+ standard primitives)
│   ├── careers-feed.tsx        # Career listings rendering and filters
│   ├── resources-feed.tsx      # Resource grid UI with filtering/search
│   ├── regulatory-world-map.tsx# Interactive WebGL/canvas globe
│   ├── floating-nav.tsx        # Header navigation bar
│   ├── footer.tsx              # Footer layout
│   └── ... (additional feature components)
├── hooks/                      # Custom React hooks
│   ├── use-mobile.ts           # Mobile viewport detection helper
│   └── use-toast.ts            # Alert notification management hook
├── lib/                        # Core utilities and API clients
│   ├── queries/                # GraphQL query strings for Contentful
│   │   ├── careers.ts
│   │   └── resources.ts
│   ├── types/                  # TypeScript interface declarations
│   │   └── contentful.ts
│   ├── ai-classify.ts          # AI classification connector (Claude SDK)
│   ├── contentful-graphql-client.ts # GraphQL wrapper for Contentful API
│   ├── contentful-management.ts # Contentful Management REST client
│   └── utils.ts                # Tailwind class merge helper (clsx/tailwind-merge)
├── public/                     # Static assets (images, icons, favicons)
└── styles/                     # Styles directory
    └── globals.css             # Unreferenced global stylesheet (potential legacy)
```

## Core Files

**Configuration & Settings:**
- `package.json` - Defines dependencies, run scripts, and project metadata.
- `tsconfig.json` - TypeScript path mappings (such as `@/*` resolving to root) and build settings.
- `next.config.mjs` - Next.js configurations containing headers, caching, and Contentful media host permissions.
- `postcss.config.mjs` - CSS processor config loading Tailwind CSS v4.
- `components.json` - Schema configuration for the Shadcn UI CLI.
- `.gitignore` - Lists patterns excluded from version control.

---

*Structure review: 2026-07-02*
*Update when directories are rearranged*
