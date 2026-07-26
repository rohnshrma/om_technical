# OM Technical and Management Education — Website & Admin Dashboard

A production-ready **MERN-on-Next.js** website for **OM Technical and
Management Education** (Gurugram, est. 2006), built for local SEO, trust, and
lead generation — with a private admin dashboard for managing courses,
university affiliations, testimonials, and blog posts.

**Stack:** Next.js 14 (App Router, TypeScript, React) + Tailwind CSS +
**MongoDB** (native driver) + Next.js Route Handlers acting as the API layer
(the "Express" role in MERN, without a separate server process) + custom JWT
auth + Vercel. Every tool below was chosen because it has a genuinely usable
**free tier** — there is no paid SaaS in this stack.

---

## 1. Tech choices & why (ROI justification)

| Layer | Choice | Why (free/low-cost, high ROI) |
|---|---|---|
| Frontend framework | Next.js 14 (App Router) | SSG/ISR gives Google fast, crawlable HTML; free to build; deploys free on Vercel. |
| Styling | Tailwind CSS | No cost, no build-time penalty, fast to build a professional trust-first UI. |
| Backend | Next.js **Route Handlers** (`app/api/**`) | Plays the Express role of MERN without running/hosting a second Node server — it deploys as part of the same free Vercel project. |
| Database | **MongoDB** (Atlas free M0 cluster) | The "M" in MERN, as requested. Document model fits courses/testimonials/blog naturally; free tier (512MB storage) is more than enough for a single-location consultancy. |
| Auth | Custom JWT (`jose`) + bcrypt password hash, single admin | Free, no vendor, ~80 lines of code. A signed httpOnly cookie gates `/admin` — appropriate for the single-admin use case in the brief (no need for a full user-management system). |
| Hosting | Vercel (free/Hobby tier) | Native Next.js support, automatic HTTPS, free custom domain binding, generous free bandwidth for a small business site. |
| Lead notification | WhatsApp click-to-chat (`wa.me` link) | Zero cost, zero setup, works instantly on the owner's existing phone. |
| Lead notification (optional) | Resend (free tier: 3,000 emails/month) | Only added because email is genuinely useful as a backup channel; skipped entirely if `RESEND_API_KEY` is not set — the lead is still always saved to the database. |
| Blog content | Markdown stored in MongoDB, rendered with `react-markdown` | No CMS subscription needed; admin writes Markdown in a plain textarea. |
| Images (optional) | Cloudinary free tier | MongoDB has no built-in file storage; Cloudinary's free tier (25 credits/mo) is the zero-cost place to host university logos / testimonial photos, referenced by URL. |

**The only unavoidable cost is the domain name** (see §6).

---

## 2. Project structure

```
app/
  (site)/                    → public pages (share Header/Footer/WhatsApp button layout)
    page.tsx                 → Home
    courses/page.tsx          → Courses (grouped by category)
    universities/page.tsx      → University Affiliations
    about/page.tsx              → About Us
    testimonials/page.tsx        → Testimonials
    blog/page.tsx                 → Blog index
    blog/[slug]/page.tsx           → Blog post (SSG + ISR)
    contact/page.tsx                → Contact / Enquiry (lead form)
  admin/
    login/page.tsx             → Admin login (outside the dashboard layout)
    (dashboard)/                → Everything below requires auth (enforced by middleware.ts)
      page.tsx                  → Leads inbox (status, CSV export)
      courses/page.tsx           → Courses CRUD
      universities/page.tsx       → Universities CRUD
      testimonials/page.tsx        → Testimonials CRUD
      blog/page.tsx                 → Blog CRUD
  api/
    auth/login/route.ts        → Verifies email+bcrypt hash, issues JWT cookie
    auth/logout/route.ts        → Clears the JWT cookie
    leads/route.ts               → Public lead-capture endpoint (validates + inserts + optional email)
    admin/courses/route.ts        → GET (list) / POST (create)
    admin/courses/[id]/route.ts    → PATCH (update) / DELETE
    admin/universities/...          → same GET/POST/PATCH/DELETE shape
    admin/testimonials/...           → same shape
    admin/blog/...                    → same shape
    admin/leads/route.ts                → GET (list)
    admin/leads/[id]/route.ts            → PATCH (status) / DELETE
  sitemap.ts / robots.ts        → Auto-generated SEO files
middleware.ts                    → Verifies the JWT cookie; guards /admin/* pages and /api/admin/* routes
lib/
  mongodb.ts                     → Cached MongoDB client (native driver, no ODM)
  auth.ts                         → JWT sign/verify (Edge-runtime compatible via `jose`)
  models/
    course.ts, university.ts, testimonial.ts, blogPost.ts, lead.ts
                                    → Typed collection getters + doc→app-type mappers
  constants.ts                     → Single source of truth for NAP (name/address/phone) data
  schema.ts                         → JSON-LD builders (EducationalOrganization, Course, Review, Breadcrumb)
  types.ts                          → Shared TypeScript types (camelCase, matching MongoDB documents)
components/                          → Header, Footer, WhatsAppButton, LeadForm, CourseCard, etc.
scripts/
  seed.mjs                          → Idempotent demo-data seeder + index creation
  hash-password.mjs                  → Generates the bcrypt hash for ADMIN_PASSWORD_HASH
```

**Why public pages query MongoDB directly instead of going through `/api/*`:**
Server Components can talk to the database directly — there's no client-side
JavaScript involved in rendering them, so there's nothing to protect by
routing through an API layer. Route Handlers exist specifically for the two
cases that need them: the admin dashboard (a client component, which cannot
hold a database credential) and the public lead-capture form (needs
server-side validation before writing).

---

## 3. Database & auth setup (MongoDB Atlas — free tier)

1. Create a free account at mongodb.com/cloud/atlas and create an **M0 (free)
   cluster**.
2. Under **Database Access**, create a database user with a strong password.
3. Under **Network Access**, allow access from anywhere (`0.0.0.0/0`) — fine
   for this use case since the database is only ever reached from your
   server-side code, never the browser.
4. Under **Connect → Drivers**, copy the connection string — this is your
   `MONGODB_URI`.
5. Generate the admin password hash:
   ```bash
   npm run hash-password -- "YourStrongPassword123"
   ```
   The script prints two versions — use the **escaped** one
   (`\$2b\$10\$...`) in `.env.local`, and the plain one in Vercel's env var
   dashboard. This matters: bcrypt hashes are full of `$` characters, and
   Next.js's local env loader (`@next/env`) treats an unescaped `$` as
   variable interpolation — it will silently truncate the hash to an empty
   string if you paste it in unescaped locally. Vercel's dashboard doesn't do
   this interpolation, so no escaping is needed there.
6. Generate a `JWT_SECRET` (any long random string works, e.g. `openssl rand
   -base64 32`).
7. Fill all of the above into `.env.local` (copy from `.env.example`).
8. Seed demo content and create indexes:
   ```bash
   npm run seed
   ```

There is no separate "admin user" document in the database — the single admin
account is just the `ADMIN_EMAIL` / `ADMIN_PASSWORD_HASH` pair in your
environment variables. This matches the brief's "single admin, no need for
complex roles" requirement with the least moving parts possible.

---

## 4. Local development

```bash
npm install
cp .env.example .env.local   # then fill in MongoDB URI, JWT secret, admin credentials
npm run seed                 # populate demo courses/universities/testimonials/blog
npm run dev
```

Visit `http://localhost:3000` for the public site and
`http://localhost:3000/admin/login` for the dashboard (log in with
`ADMIN_EMAIL` + the plaintext password you hashed in step 5 above).

---

## 5. Deployment guide (for a non-technical owner — free tier throughout)

1. **Push this project to GitHub** (create a free GitHub account if needed,
   create a new repository, upload this folder).
2. **Create a free Vercel account** at vercel.com and choose "Import Project"
   → select the GitHub repo.
3. In Vercel's **Environment Variables** screen, add every variable from
   `.env.example`: `MONGODB_URI`, `MONGODB_DB`, `JWT_SECRET`, `ADMIN_EMAIL`,
   `ADMIN_PASSWORD_HASH`, `NEXT_PUBLIC_SITE_URL` (your final domain), and
   optionally `RESEND_API_KEY` / `RESEND_FROM_EMAIL` / `LEAD_NOTIFICATION_EMAIL`.
4. Click **Deploy**. Vercel builds and hosts the site free of charge, with a
   free `*.vercel.app` URL immediately available for testing.
5. Run `npm run seed` once locally pointed at the same `MONGODB_URI` (or via
   `vercel env pull` + running it locally) so the live database has starter
   content.
6. **Buy a domain** (e.g. from Namecheap, GoDaddy, or Hostinger — this is the
   one unavoidable cost, see §6) and add it in **Vercel → Project → Settings →
   Domains**. Vercel provides free SSL automatically.
7. **Set up a free Google Business Profile** (business.google.com) using the
   *exact same* Name, Address, and Phone number as on the website (NAP
   consistency is critical for local Google ranking — see SEO checklist below).
   This is a required parallel step outside the codebase.
8. Log in at `yourdomain.in/admin/login` and start adding real courses,
   university tie-ups, testimonials, and blog posts.

**To update content going forward:** the owner never needs to touch code or
MongoDB Atlas directly — courses, universities, testimonials, and blog posts
are all managed from `/admin`.

---

## 6. Costs — everything is ₹0 except the domain

| Item | Cost | Notes |
|---|---|---|
| Domain name (.in or .com) | **~₹800–1,200/year** | The only unavoidable cost. |
| Vercel hosting | ₹0 | Free Hobby tier is sufficient for this traffic level. |
| MongoDB Atlas (M0 cluster) | ₹0 | Free tier: 512MB storage — more than enough for this dataset. |
| Resend email notifications | ₹0 | Free tier: 3,000 emails/month (optional — WhatsApp works with no setup at all). |
| WhatsApp click-to-chat | ₹0 | Uses the existing business phone number, no API contract needed. |
| Cloudinary (optional, for images) | ₹0 | Free tier: 25 monthly credits, plenty for logos/photos. |
| Google Business Profile | ₹0 | Free local SEO listing. |
| SSL certificate | ₹0 | Auto-provisioned by Vercel. |
| **Total recurring cost** | **~₹800–1,200/year** | Domain renewal only. |

---

## 7. SEO checklist — what was implemented

| Requirement | Status | Where |
|---|---|---|
| Unique meta title + description per page, <160 char descriptions | ✅ | `metadata` export in every `page.tsx` |
| Single H1 per page, logical H2/H3 hierarchy | ✅ | All public pages |
| `EducationalOrganization` / `LocalBusiness` schema with NAP | ✅ | `lib/schema.ts` → injected site-wide via `(site)/layout.tsx` and Home |
| `Course` schema per course listing | ✅ | Injected on `/courses` |
| `Review` / `AggregateRating` schema for testimonials | ✅ | Injected on Home + `/testimonials` |
| `BreadcrumbList` schema | ✅ | Courses, Universities, About, Testimonials, Blog, Blog post, Contact |
| `BlogPosting` schema | ✅ | Every blog post page |
| XML sitemap | ✅ | `app/sitemap.ts` → `/sitemap.xml` (includes all static pages + every published blog post) |
| `robots.txt` | ✅ | `app/robots.ts`, disallows `/admin` and `/api` |
| Fast page loads via SSG/ISR | ✅ | Home, Courses, Universities, Testimonials, Blog index are static; Blog posts are SSG with 1-hour ISR |
| Internal linking (Courses ↔ Universities ↔ Blog) | ✅ | Course cards link to Contact pre-filled by course; University page cross-links courses; blog posts link to Contact |
| Alt text on images | ✅ | `UniversityCard` / `TestimonialCard` render `logoUrl` / `photoUrl` via `next/image` with descriptive, auto-generated alt text |
| Local + intent keyword targeting | ✅ | Titles/descriptions target "distance education admission Gurugram," "UGC approved distance university admission Gurugram," etc. |
| Blog funnel for informational intent | ✅ | 3 seeded posts: distance vs regular degree, distance MBA govt job validity, verifying UGC-DEB approval |
| Google Business Profile (NAP consistency) | ⚠️ Action required outside codebase | See deployment step 7 — must be set up manually with matching NAP |

---

## 8. What's intentionally NOT included

- **No pricing/fees anywhere** — enforced by omission; no `price` field exists
  on the `courses` collection at all, so it can't accidentally leak.
- **No multi-admin roles** — a single email/password pair in environment
  variables is the admin; there is no user-management UI by design.
- **No payment processing** — this is a lead-generation and information site,
  not a transactional one, per the brief.

---

## 9. Security notes

- Admin routes (`/admin/*` pages and `/api/admin/*` routes) are gated in
  `middleware.ts` by verifying a signed JWT stored in an `httpOnly`,
  `secure` (in production), `sameSite=lax` cookie — it can't be read or
  forged from client-side JavaScript.
- The admin password is never stored in plaintext — only its bcrypt hash
  lives in `ADMIN_PASSWORD_HASH`.
- The public lead-capture endpoint (`/api/leads`) validates input server-side
  (name/phone/email format) before writing to MongoDB.
- MongoDB Atlas network access is opened to `0.0.0.0/0` per §3 — this is safe
  here because the database is only ever reached from server-side code using
  the `MONGODB_URI` credential, which is never exposed to the browser (it has
  no `NEXT_PUBLIC_` prefix).
