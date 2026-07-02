# Technology Stack

**Analysis Date:** 2026-07-02

## Languages

**Primary:**
- TypeScript 5.x - All application code and pages

**Secondary:**
- JavaScript / ESM - Next.js configuration files (`next.config.mjs`, `postcss.config.mjs`)

## Runtime

**Environment:**
- Node.js 18.x / 20.x / 22.x - Next.js 16 execution environment
- Browser Runtime - React Client Components and Framer Motion animations

**Package Manager:**
- npm 10.x
- Lockfile: `package-lock.json` present

## Frameworks

**Core:**
- Next.js 16.0.10 - Core application framework (App Router)
- React 19.2.0 - UI rendering engine
- Framer Motion 12.29.2 - Animation and transition framework

**Testing:**
- None - No test runner configured in the current codebase

**Build/Dev:**
- Tailwind CSS 4.1.9 - Styling compiler
- PostCSS 8.5 - CSS processing
- TypeScript Compiler - Type checking

## Key Dependencies

**Critical:**
- `@anthropic-ai/sdk` ^0.95.1 - Client SDK for Anthropic Claude API integration
- `rss-parser` ^3.13.0 - RSS XML feed parsing
- `nodemailer` ^8.0.5 - Node SMTP mailer for contact/job inquiries
- `zod` 3.25.76 - Data validation
- `lucide-react` ^0.454.0 - SVG icons library
- `recharts` 2.15.4 - Custom data charts
- `cobe` ^0.6.3 - Lightweight interactive WebGL globe

**Infrastructure:**
- Radix UI Primitives (various packages) - Accessible UI component primitives
- `@vercel/analytics` 1.3.1 - Vercel analytics integration

## Configuration

**Environment:**
- Server-side runtime environment variables accessed via `process.env` in Next.js Server Components and API Routes.
- Configuration variables include Contentful tokens, Anthropic API key, email credentials, and cron secrets.

**Build:**
- `next.config.mjs` - Next.js router, image domains, and headers configuration
- `tsconfig.json` - TypeScript path mappings (`@/*` to `./*`) and compiler parameters
- `postcss.config.mjs` - PostCSS configuration importing Tailwind CSS
- `components.json` - Shadcn UI components configuration

## Platform Requirements

**Development:**
- Any platform with Node.js 18+ and npm installed.

**Production:**
- Vercel - Serves Next.js ISR, Serverless/Edge functions, and client assets.

---

*Stack analysis: 2026-07-02*
*Update after major dependency changes*
