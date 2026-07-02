# Codebase Concerns

**Analysis Date:** 2026-07-02

## Technical Debt

**1. Complete Lack of Automated Testing:**
- **Description:** No testing framework is installed or configured. Regression testing is fully manual.
- **Risk:** High chance of introducing undetected UI or logic breakages when refactoring components or updating shared utility libraries.

**2. Dead Code / Legacy Global CSS:**
- **Description:** `styles/globals.css` exists but is completely unreferenced. It contains conflicting Tailwind configs and Geist font definitions.
- **Risk:** Developer confusion when styling or refactoring styles, as changes in this file will have no effect.

## Security & Reliability Risks

**1. Sequential API Execution & Timeout Risk:**
- **Description:** In the `/api/ingest-resources` route, processing RSS items is completely serial. For each item: it makes a call to Anthropic, then a POST call to create the Contentful entry, then a PUT call to publish, and then another PUT call to update the list.
- **Risk:** Serverless execution timeouts (10 seconds on Vercel Hobby, 60 seconds on Pro) will be easily exceeded if more than 3-5 items are processed at a time. The route currently limits feed slicing to 5 items to mitigate this, but it is a fragile solution.

**2. Missing Rate Limit Protections:**
- **Description:** Contentful Management API imposes a rate limit of 7 requests per second on standard plans. Sequential creation, publishing, and linking for multiple feed entries could trigger HTTP 429 Rate Limit responses.
- **Risk:** Content ingestion pipeline failures if multiple feeds have new items simultaneously.

**3. Direct SMTP Auth via environment variables:**
- **Description:** Credentials for Gmail SMTP are stored directly in `EMAIL` and `EMAIL_PASSWORD`.
- **Risk:** Google accounts occasionally lock app-passwords if logins are made from fresh server IPs (like Vercel serverless containers), causing form submissions to fail silently or crash the API handler.

---

*Concerns log: 2026-07-02*
*Review when preparing milestones and refactoring*
