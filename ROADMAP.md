# Project Roadmap — OM Technical and Management Education Website

Stack: Next.js 14 (App Router, TypeScript) + Tailwind CSS + MongoDB (native
driver) + custom JWT auth + Vercel. **Live at https://omtechmgt.com.**

## Done

### Public site
- [x] Home, Courses, Universities, About, Testimonials, Blog (index + post), Contact — all built and rendering
- [x] No pricing/fees displayed anywhere (no `price` field exists on the data model at all)
- [x] Courses and Universities are the two primary content blocks (nav priority, homepage sections)
- [x] Lead capture form wired to `/api/leads`, with WhatsApp click-to-chat as a zero-cost alternate channel
- [x] Responsive Tailwind layout (mobile/tablet/desktop breakpoints on all pages)
- [x] **Header rebuilt end-to-end**: real hamburger/slide-down menu on mobile (was a horizontal scroll-list before), active-page indicator on desktop nav, and a top utility bar (Call + Free Guidance CTA + trust line) above the sticky main nav row — hardened against text-wrapping at in-between desktop widths (1024–1280px)

### SEO
- [x] Per-page metadata (unique titles/descriptions, canonical URLs)
- [x] JSON-LD: `EducationalOrganization`, `LocalBusiness`, `Course`, `Review`/`AggregateRating`, `BreadcrumbList`, `BlogPosting`
- [x] `sitemap.xml` (static routes + all published blog posts) and `robots.txt`
- [x] SSG/ISR on Home, Courses, Universities, Testimonials, Blog index (static); blog posts prerendered via `generateStaticParams` with 1-hour ISR
- [x] Semantic heading hierarchy, alt text on university logos / testimonial photos (via `next/image`)
- [x] **Broadened targeting to Gurugram + Delhi NCR + UG/PG intent**: title/description/H1 on Home, Courses, and Universities now explicitly cover "UG & PG," "Gurugram," "Delhi," "NCR"; added Open Graph/Twitter metadata; added `areaServed` (Gurugram, Delhi, New Delhi, Delhi NCR, Noida, Faridabad) to the LocalBusiness/EducationalOrganization schema; seeded a new blog post targeting "UG PG admission Gurugram Delhi NCR" long-tail search intent

### Admin dashboard (`/admin`)
- [x] Custom JWT auth (single admin, bcrypt password hash + `jose`-signed httpOnly cookie) — no third-party auth vendor
- [x] `middleware.ts` protects both `/admin/*` pages and `/api/admin/*` routes
- [x] Leads inbox: view, filter by status, status update, delete, CSV export
- [x] Full CRUD: Courses, Universities, Testimonials, Blog posts
- [x] Blog editor: Markdown content, meta title/description, slug, tags, category, draft/published status

### Backend / data
- [x] MongoDB native-driver models (`lib/models/*`) — courses, universities, testimonials, blogPosts, leads
- [x] Cached connection helper (`lib/mongodb.ts`) with fast `serverSelectionTimeoutMS` so a DB outage fails fast instead of hanging
- [x] Public pages query MongoDB directly (server components); admin dashboard goes through `/api/admin/*` route handlers (the "Express" layer of MERN, hosted inside the same Next.js app)
- [x] `scripts/seed.mjs` — idempotent demo data + index creation
- [x] `scripts/hash-password.mjs` — generates the admin bcrypt hash (with the `.env.local` escaping gotcha documented)
- [x] Optional Resend email notification on new leads (skipped cleanly if unconfigured)

### Deployment & infrastructure
- [x] **Live in production**: https://omtechmgt.com (custom domain on GoDaddy, DNS pointed at Vercel, SSL auto-issued, `www` redirects too)
- [x] Connected to GitHub (`github.com/rohnshrma/om_technical`) — every push to `main` redeploys automatically
- [x] All required secrets (`MONGODB_URI`, `MONGODB_DB`, `JWT_SECRET`, `ADMIN_EMAIL`, `ADMIN_PASSWORD_HASH`, `NEXT_PUBLIC_SITE_URL`) set as encrypted Vercel production env vars
- [x] Vercel's default SSO deployment-protection wall disabled so the site is actually public
- [x] `npm run build` (production build) confirmed clean — all 18 pages generated (static/SSG as intended), all 13 API routes correctly marked dynamic (ƒ), no export errors

### Verification performed
- [x] `tsc --noEmit` — clean, zero errors (re-verified after every change since)
- [x] Full auth flow tested live (curl): correct login → cookie issued; wrong password → 401; protected API without cookie → 401; protected API/page with cookie → passes; logout → cookie cleared and access immediately revoked
- [x] Lead capture validation tested live: valid payload reaches the DB layer; invalid phone / missing name correctly rejected with 400
- [x] Fixed a real webpack/build issue (MongoDB driver's optional native deps needed externalizing), a real `.env.local` bug (bcrypt hash `$` characters silently mangled by Next's env-var interpolation), and a real correctness bug (API routes were being statically prerendered at build time instead of running per-request — fixed with `dynamic = 'force-dynamic'` on every route)

## Not done yet

### Blocked on external setup (needs you)
- [ ] **MongoDB Atlas is still rejecting the credentials.** `bad auth : authentication failed` (verified independently — not an encoding issue on my end). This is the #1 blocker: Courses/Universities/Testimonials/Blog show empty "being updated" states on the live site, which also undermines the SEO work above (thin/empty pages don't rank). In Atlas: **Database Access** → confirm the `admin` user exists and reset its password (or create a fresh user), then send me the corrected connection string and I'll update `MONGODB_URI` and redeploy.
- [ ] **Change the admin password.** I generated one (`gVx1fhNTZXGZ`) to get login working end-to-end — replace it via `npm run hash-password -- "YourNewPassword"` and update `ADMIN_PASSWORD_HASH` in Vercel once you're ready.
- [ ] **Google Business Profile** (business.google.com) — the single highest-impact action for local "near me" search results. Set up at the real Sector 14, Gurugram address; add Delhi/NCR as service areas. Outside the codebase, needs your Google account.
- [ ] **Google Search Console** (search.google.com/search-console) — add `omtechmgt.com`, verify via the HTML-tag method, send me the verification code (I'll wire it into `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION` and redeploy), then submit `https://omtechmgt.com/sitemap.xml`.
- [ ] **Real content** — once the Atlas auth issue is fixed, run `npm run seed` for demo data, then replace with the real OM Technical catalog via `/admin`.
- [ ] **Real images** — university logos and testimonial photos aren't uploaded anywhere yet (Cloudinary free tier recommended in the README); the fields and rendering exist, just no images yet.

### Explicitly requested but not completed — needs a decision from you
- [ ] **Further "top-class" visual polish**, beyond the navbar rebuild already done. Still outstanding if wanted:
  - No stats/trust counters section on the homepage (e.g. "500+ students guided")
  - No custom favicon/logo image (text-based "OM" mark only)
  - No loading skeletons / `loading.tsx` states, no custom `not-found.tsx` styling
  - No visual QA pass across breakpoints was done with a real browser (no headless browser tool is available in this sandbox — verification here has been HTML/CSS-level, not a rendered screenshot; live checks so far have relied on you sharing screenshots)

### Not requested, but worth knowing about
- [ ] No automated test suite (unit/integration tests)
- [ ] No CI pipeline (e.g. GitHub Actions running typecheck/build on PRs)
- [ ] Single-admin only — by design, per the original brief

## Suggested next steps, in order
1. Fix the MongoDB Atlas credential issue (top priority — everything content-related depends on it).
2. Run `npm run seed` against the working database, then replace demo content with the real OM Technical catalog via `/admin`.
3. Set up Google Business Profile and Google Search Console (both external, both needed for the "show up in Google searches" goal).
4. Change the admin password from the temporary generated one.
5. Decide whether to invest in further visual polish (stats bar, favicon, loading states) before or after real content goes live.
