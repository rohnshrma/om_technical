# Project Roadmap — OM Technical and Management Education Website

Stack: Next.js 14 (App Router, TypeScript) + Tailwind CSS + MongoDB (native
driver) + custom JWT auth + Vercel. Last updated after the Supabase → MongoDB
(MERN-on-Next.js) migration.

## Done

### Public site
- [x] Home, Courses, Universities, About, Testimonials, Blog (index + post), Contact — all built and rendering
- [x] No pricing/fees displayed anywhere (no `price` field exists on the data model at all)
- [x] Courses and Universities are the two primary content blocks (nav priority, homepage sections)
- [x] Lead capture form wired to `/api/leads`, with WhatsApp click-to-chat as a zero-cost alternate channel
- [x] Responsive Tailwind layout (mobile/tablet/desktop breakpoints on all pages)

### SEO
- [x] Per-page metadata (unique titles/descriptions, canonical URLs)
- [x] JSON-LD: `EducationalOrganization`, `LocalBusiness`, `Course`, `Review`/`AggregateRating`, `BreadcrumbList`, `BlogPosting`
- [x] `sitemap.xml` (static routes + all published blog posts) and `robots.txt`
- [x] SSG/ISR on Home, Courses, Universities, Testimonials, Blog index (static); blog posts prerendered via `generateStaticParams` with 1-hour ISR
- [x] Semantic heading hierarchy, alt text on university logos / testimonial photos (via `next/image`)

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

### Verification performed this session
- [x] `tsc --noEmit` — clean, zero errors
- [x] Dev server smoke test — every public + admin route returns correct HTTP status
- [x] Full auth flow tested live (curl): correct login → cookie issued; wrong password → 401; protected API without cookie → 401; protected API/page with cookie → passes; logout → cookie cleared and access immediately revoked
- [x] Lead capture validation tested live: valid payload reaches the DB layer; invalid phone / missing name correctly rejected with 400
- [x] Fixed a real webpack/build issue (MongoDB driver's optional native deps needed externalizing) and a real `.env.local` bug (bcrypt hash `$` characters were being silently mangled by Next's env-var interpolation)
- [x] Fixed a real correctness bug: all `/api/**` route handlers now explicitly export `dynamic = 'force-dynamic'`. Without it, Next.js's build tried to statically prerender GET routes like `/api/admin/leads` at build time — wrong behavior for live, per-request DB data, and something that would have failed the build (or worse, silently cached stale data) even against a real database.
- [x] **`npm run build` (production build) completed successfully** — all 18 pages generated (static/SSG as intended), all 13 API routes correctly marked dynamic (ƒ), middleware compiled, no export errors. Confirmed clean.
- [x] **Deployed to Vercel production** — live at https://om-technical-education-hdj7t8w9e-rohnshrmas-projects.vercel.app, connected to the GitHub repo. `JWT_SECRET`, `ADMIN_EMAIL`, `ADMIN_PASSWORD_HASH`, `MONGODB_URI`, `MONGODB_DB` are set as encrypted production env vars. Vercel's default SSO deployment-protection wall was disabled so the site is actually public. Admin login tested live and works (auth doesn't depend on Mongo).

## Not done yet

### Blocked on external setup (needs you)
- [ ] **MongoDB Atlas is rejecting the credentials.** The `MONGODB_URI` you provided (`admin` user @ `webigeekscluster`) connects to Atlas fine over the network but Atlas replies `bad auth : authentication failed` (verified independently, not an encoding issue on my end — the `@` in the password was correctly percent-encoded). This means courses/universities/testimonials/blog currently show empty "being updated" states on the live site, and the lead form / admin CRUD can't read or write data yet. In Atlas: **Database Access** → confirm the `admin` user exists and reset its password (or create a fresh user), then tell me the corrected connection string and I'll update the `MONGODB_URI` env var and redeploy.
- [ ] **Change the admin password.** I generated one (`gVx1fhNTZXGZ`) to get login working end-to-end — replace it via `npm run hash-password -- "YourNewPassword"` and update `ADMIN_PASSWORD_HASH` in Vercel once you're ready.
- [ ] **Domain purchase + DNS** — the one unavoidable cost (~₹800–1,200/yr), not yet bought. Once bought, add it in Vercel → Domains, and update `NEXT_PUBLIC_SITE_URL`.
- [ ] **Google Business Profile** — manual, outside the codebase, required for local SEO NAP consistency.
- [ ] **Real content** — once the Atlas auth issue is fixed, run `npm run seed` against it for demo data, then replace with the real OM Technical catalog via `/admin`.
- [ ] **Real images** — university logos and testimonial photos aren't uploaded anywhere yet (Cloudinary free tier recommended in the README); the fields and rendering exist, just no images yet.

### Explicitly requested but not completed — needs a decision from you
- [ ] **"Top-class," fully polished responsive design pass.** You asked for this, but the conversation pivoted into the MongoDB/MERN migration before it was done. Specifically still outstanding:
  - Mobile navigation is a horizontal scrolling list of links, not a proper hamburger/slide-out menu
  - No stats/trust counters section on the homepage (e.g. "500+ students guided")
  - No custom favicon/logo image (text-based "OM" mark only)
  - No loading skeletons / `loading.tsx` states, no custom `not-found.tsx` styling
  - No visual QA pass across breakpoints was done with a real browser (no headless browser tool was available in this sandbox — verification here has been HTTP-status-level, not pixel-level)

### Not requested, but worth knowing about
- [ ] No automated test suite (unit/integration tests)
- [ ] No CI pipeline (e.g. GitHub Actions running typecheck/build on PRs)
- [ ] Single-admin only — by design, per the original brief

## Suggested next steps, in order
1. Create the MongoDB Atlas cluster + generate real admin credentials (README §3).
2. Push this repo to GitHub, import into Vercel, set env vars, deploy.
3. Run `npm run seed` against the real database, then replace demo content with real courses/universities/testimonials/posts via `/admin`.
4. Buy the domain, point it at Vercel, set up Google Business Profile.
5. Decide whether to invest in the visual polish pass (hamburger nav, stats bar, favicon, etc.) before or after going live.
