# CONTEXT.md — ResinRiva Build Memory (Source of Truth)

> **Read this file at the START of every session before writing any code.** Do NOT re-read the whole codebase — this file is the single source of truth.
> When a phase finishes: write ALL of that phase's data here, then STOP and wait for explicit permission before the next phase. Never auto-continue.

---

## 0. Quick Status

| Item | Value |
| --- | --- |
| Current Phase | **Phase 3 — Database + Auth** ✅ CODE COMPLETE (migrate/seed pending DB credentials) |
| Next Phase | **Phase 4 — Admin Core** (awaiting permission) |
| Branch | `claude/epic-bell-dof5as` (all phases develop here → PR to `main`) |
| Default branch | ⚠ still `claude/epic-bell-dof5as` — change to `main` in GitHub UI (Settings → General); no MCP/API tool exposes this setting |
| PRs | #1 (P1) merged · #2 (auto-sync) merged · #3 (P2) merged · #4 (P3) open |
| Repo | https://github.com/gondaliyabhavya70960/ResinRivaNew.git |
| Last updated | Phase 3 |

---

## 1. Completed Phases & Features

### ✅ Phase 1 — Repo + Documentation
- Initialized documentation against the repo on branch `claude/epic-bell-dof5as`.
- **Files created:**
  - `README.md` — project overview, brand/business info, tech stack, design summary, structure, phases, caveats.
  - `CONTEXT.md` — this file (build memory / source of truth).
  - `INSTALL.md` — local setup outline (stub).
  - `DEPLOYMENT.md` — Vercel deploy outline (stub).
  - `ADMIN_GUIDE.md` — non-developer admin guide outline (stub).
  - `CONTENT_GUIDE.md` — content authoring + photography outline (stub).
  - `SEO_GUIDE.md` — SEO implementation outline (stub).
  - `BACKUP_GUIDE.md` — backup/recovery outline (stub).
  - `WHATSAPP_ORDER_GUIDE.md` — WhatsApp order system outline (stub).
  - `COMPETITOR.md` — competitor research scaffold (populated in Phase 11).
  - `.gitignore` — Next.js + Prisma + env + Vercel ignores.
  - `.env.example` — env var names only (no secrets).
- Created an empty-commit `main` branch to serve as the PR base, rebased Phase 1 onto it.
- Committed + pushed to `claude/epic-bell-dof5as`; opened draft PR #1 (base `main`). Merged ✅.

### ✅ Phase 2 — Scaffold + Design System
- **Stack installed:** Next.js **16.2.9** (App Router, TS, Turbopack), React 19.2, Tailwind **v4** (CSS-first `@theme`, NO `tailwind.config`), shadcn/ui (configured via `components.json`, new-york), motion 12.40, gsap 3.15, lenis 1.3, lucide-react 1.21, react-hook-form 7.80 + zod 4 + @hookform/resolvers, swiper 12 + embla-carousel-react 8, @vercel/blob 2.4, @vercel/analytics 2 + @vercel/speed-insights 2, @google/model-viewer 4.3, cva + clsx + tailwind-merge + @radix-ui/react-slot, tw-animate-css (dev).
- **Design tokens** in `src/app/globals.css`: `@theme` brand colours (ivory/ink/ocean/teal/amber/amber-light/gold) + luxe/glass/gold shadow vars; semantic shadcn tokens (light default = ivory, `.dark` = ink) mapped in `@theme inline`; `.glass`/`.glass-dark`/`.mesh-ivory`/`.mesh-ink` utilities; global reduced-motion guard.
- **Fonts:** Fraunces (display → `--font-fraunces`) + Inter (body → `--font-inter`) via `next/font/google`.
- **Primitives + chrome** (see §8): Container, Section, Button, Logo/Monogram, social icons, LiquidGlass, MouseParallax, ScrollReveal, Preloader, LenisProvider, Header (glass sticky, adaptive tone, mobile menu), Footer, AnnouncementBar. Wired in `layout.tsx` with Vercel Analytics + Speed Insights.
- **Home** (`page.tsx`) = Phase-2 placeholder demonstrating the system (real DB-driven home = Phase 6).
- **Verified:** `tsc --noEmit` clean · `next build` green (Google Fonts fetch OK) · `eslint` clean.
- **Deferred:** `vercel link` — `vercel` CLI not installed and linking needs the owner's Vercel auth → manual owner step (do alongside Neon + Blob creation in Phase 3). lucide-react v1 removed brand icons → custom `social-icons.tsx`.

### ✅ Phase 3 — Database + Auth (code complete; migrate/seed pending DB credentials)
- **Decision:** pinned **Prisma 6.19.3** (npm latest was Prisma 7, whose new `prisma-client` generator changes import paths, `.env` loading, and needs `prisma.config.ts`). v6 keeps standard `prisma-client-js` → `@prisma/client` imports.
- **Schema** (`prisma/schema.prisma`): ALL §3 models + enums (Role, ProductStatus, ContentStatus, FieldType, InquirySource, InquiryStatus, MediaType); relations, indexes, `@db.Text`, `SiteSettings` singleton (`id="singleton"`). `prisma validate` + `generate` pass.
- **Migration:** `prisma/migrations/0_init/migration.sql` (376 lines) via `migrate diff` (no DB needed) + `migration_lock.toml` → ready for `prisma migrate deploy`.
- **Seed** (`prisma/seed.ts`, idempotent, runs via `tsx`): admin user (bcrypt; `ADMIN_EMAIL`/`ADMIN_PASSWORD`, dev default warns), `SiteSettings` (exact business info), 9 categories, 6 sample products (+images +customization fields), 3 testimonials, 5 FAQs, 3 blog categories + 2 Tiptap posts. Placeholder images via `picsum.photos`.
- **Auth.js v5** (`next-auth@5 beta`): edge-safe `src/auth.config.ts` (no Prisma) shared by `src/proxy.ts` (Next 16 "proxy" = former middleware; gates `/studio/*` except `/studio/login`) and `src/lib/auth.ts` (Credentials + bcrypt, JWT session, role on token/session). `src/app/api/auth/[...nextauth]/route.ts` handler. `src/lib/db.ts` Prisma singleton. `src/types/next-auth.d.ts` augments Session/User.
- **Config:** `serverExternalPackages: ["@prisma/client"]`; `picsum.photos` image host; package.json `db:*` scripts + `postinstall: prisma generate` + `prisma.seed`.
- **Verified:** `tsc` clean · `next build` green (auth route + proxy registered, no deprecation) · `eslint` clean.
- **PENDING (owner):** provision Neon + Blob in Vercel → `vercel link` → env pull → `npm run db:deploy` (or `db:migrate`) + `npm run db:seed`. `/studio/login` UI is Phase 4.

---

## 2. Pending Features (by phase)

- **Phase 4** — `/studio` layout + login + dashboard; Products CRUD w/ Blob gallery upload + Custom Form Builder; Categories CRUD; Media Library.
- **Phase 5** — Blog (Tiptap), Portfolio, Inquiries/WhatsApp Orders + status workflow, Testimonials, FAQs, SEO mgmt, Site Settings, User Roles, Activity Logs.
- **Phase 6** — Public: Home (all sections), About, Process, FAQ, Contact (map + form→Inquiry + optional Resend), Privacy, Terms.
- **Phase 7** — Shop (filters/sort/search/infinite scroll/quick view), Category pages, Product Detail (gallery/video/model-viewer/dynamic form/reference upload/live preview/save-then-redirect), Custom Order, WhatsApp Order fallback page.
- **Phase 8** — Public Portfolio (case studies, before/after, lightbox), Blog listing + detail, Instagram gallery, Search.
- **Phase 9** — Motion polish (mouse tracking, GSAP scroll, counters, marquee, cursor glow, page transitions, refraction + Safari fallback, reduced-motion audit, perf/INP pass).
- **Phase 10** — SEO (Metadata API, OG images, schema markup, sitemap.ts, robots.ts, canonicals), Vercel prod deploy + custom domain, analytics, finish docs.
- **Phase 11** — COMPETITOR.md (top-20), seed 100+ products + 50+ blogs (original), finalize CONTEXT.md.

---

## 3. Database Schema (verbatim target — implemented in Phase 3)

> Prisma models. Enums in CAPS. `Json` fields noted. This is the canonical schema; adjust here if it evolves.

- **User** (id, name, email, hashedPassword, role: `ADMIN|EDITOR`, createdAt)
- **Category** (id, name, slug, image, description, order)
- **Product** (id, title, slug, shortTagline, description, priceMin?, priceMax?, showPrice bool, timeline, materials, dimensions, status: `DRAFT|PUBLISHED`, featured, videoUrl?, model3dUrl?, categoryId, seoTitle, seoDescription, ogImage, createdAt, updatedAt)
- **ProductImage** (id, url, alt, order, productId)
- **CustomizationField** (id, productId, label, type: `SELECT|TEXT|SWATCH|SIZE|NUMBER|FILE`, options Json, required, helpText, order)
- **Inquiry** (id, source: `PRODUCT|CUSTOM_ORDER|CONTACT`, productId?, customerName, phone, email?, selections Json, referenceImageUrls Json, budgetRange?, timeline?, notes, whatsappMessage Text, status: `NEW|CONTACTED|CONFIRMED|DELIVERED`, createdAt)
- **Portfolio** (id, title, slug, story, beforeImageUrl?, afterImageUrl?, videoUrl?, resultsMeta Json, categoryId?, status, createdAt)
- **PortfolioImage** (id, url, alt, order, portfolioId)
- **BlogPost** (id, title, slug, excerpt, content Json (Tiptap), coverImage, authorName, blogCategoryId, status, publishedAt, seoTitle, seoDescription)
- **BlogCategory** (id, name, slug)
- **Tag** (id, name, slug) + **BlogPostTag** join table
- **Testimonial** (id, name, location, quote, rating 1–5, avatarUrl?, order)
- **Faq** (id, question, answer, order)
- **Media** (id, url, pathname, type: `IMAGE|VIDEO|DOCUMENT|MODEL3D`, folder, bytes, width?, height?, createdAt) — `pathname` is the Vercel Blob pathname for delete/list.
- **SiteSettings** (singleton: brandName, tagline, logoUrl, heroVideoUrl, announcement, phone, whatsappNumber, email, mapsUrl, address, socials Json, defaultSeo Json)
- **ActivityLog** (id, userId, action, entity, entityId, createdAt)

---

## 4. Design System Tokens

**Colors**
| Token | Hex | Use |
| --- | --- | --- |
| `ivory` | `#F4EFE9` | champagne base / light sections |
| `ink` | `#14151D` | near-black text / dark sections |
| `ocean` | `#0E3A53` | deep ocean blue (resin signature) |
| `teal` | `#1B6E7A` | secondary accent |
| `amber` | `#C8881F` | warm resin accent |
| `amber-light` | `#E0A24A` | warm resin accent (light) |
| `gold` | `#D4AF37` | gold-flake metallic, used sparingly (never neon `#FFD700`) |

- Glass tints: low-alpha amber/ocean overlays on `backdrop-filter` panels.
- **Rule:** max ~4 core colors per screen, one metallic only (gold). No bright red, no neon, no baby pastels.

**Typography** (via `next/font`, free Google Fonts)
- Display/headings: **Fraunces** (or Cormorant Garamond) — elegant serif, large & airy.
- Body/UI: **Inter** (or Manrope) — clean sans.
- Lowercase eyebrow labels + numbered section markers (01, 02, 03…).

**Photography direction:** desaturated, cohesive, light-led; resin color pops against ivory/ink; macro gloss + depth shots; styled-in-luxe-interior lifestyle shots; generous whitespace, big imagery.

**Visual effects:** Liquid Glass / Glassmorphism / Frosted Glass · Gradient Mesh · Ambient Lighting · Premium Shadows · Luxury Hover · Smooth Motion · Micro Interactions · Parallax · Mouse Tracking (ALL heroes + key images) · Cursor Glow · Image Depth · 3D Hover Cards · Floating Layers · Framer Motion · GSAP · Scroll Reveal · Section Transitions · Lenis Smooth Scroll · Page Transitions · Interactive Product Showcase.

**Effect technical rules:**
- Liquid glass primary: CSS `backdrop-filter: blur() + saturate()`, bg `rgba(255,255,255,0.08)`, border `rgba(255,255,255,0.15)` (works in all modern browsers).
- Enhanced refraction (SVG `feDisplacementMap` via `backdrop-filter: url()`) is **Chromium-only** → feature-detect, fall back to plain blur in Safari/Firefox.
- Mouse parallax: Framer Motion `useMotionValue` + `useTransform` + `useSpring`; pointer via `getBoundingClientRect()`; layered depth (bg less, fg more); subtle offsets (8–24px), spring-eased.
- ALWAYS gate motion behind `useReducedMotion()` / `prefers-reduced-motion` with static fallbacks.
- Perf: `contain: strict` + `will-change: transform` on filtered/animated nodes; keep glass surfaces small; protect INP; lazy-load below-the-fold media.

---

## 5. Brand Rules (HARD — never violate)

- NO payment gateway / NO online checkout / NO cart payment.
- NO Stripe / Razorpay / PayPal.
- NO membership / NO customer login / NO customer accounts.
- `/studio` admin login is owner-only (NOT a customer feature).
- Everything finalized through WhatsApp.
- **Order flow:** validate (Zod) → client-upload reference images to Vercel Blob → Server Action saves `Inquiry` (incl. final `whatsappMessage`) → `window.open`/redirect to `wa.me` URL.
- Show a **live preview** of the exact WhatsApp message before Place Order.
- WhatsApp link: `https://wa.me/917096036250?text=${encodeURIComponent(message)}` — phone international, NO `+`/spaces/dashes; ONE `?text=` param; newlines encode to `%0A`.
- `wa.me` cannot attach files → reference images are Blob URLs inside the message text.
- **Originality rule:** competitors researched for product TYPES, categories, pricing signals, blog TOPICS only. NEVER copy text/names/descriptions/images. All content 100% original ResinRiva.

**Business identity (use EXACT values everywhere):**
- Brand: ResinRiva · Site: https://shop.bhavyagondaliya.co.in · Admin: /studio
- Phone/WhatsApp: +91 7096036250 → `917096036250`
- Email: gondaliyabhavya70960@gmail.com
- Maps: https://maps.app.goo.gl/L2NHDt9Akgqs2ZoT6

---

## 6. Folder Structure (target)

```
/  README.md CONTEXT.md INSTALL.md DEPLOYMENT.md ADMIN_GUIDE.md CONTENT_GUIDE.md
   SEO_GUIDE.md BACKUP_GUIDE.md WHATSAPP_ORDER_GUIDE.md COMPETITOR.md
prisma/  schema.prisma  seed.ts  migrations/
src/app/
  (public)/  page.tsx(home) about/ shop/ shop/[category]/ product/[slug]/
             custom-order/ portfolio/ portfolio/[slug]/ process/ blog/
             blog/[slug]/ faq/ contact/ privacy/ terms/ search/ whatsapp-order/
  studio/    login/ dashboard/ products/ categories/ portfolio/ blog/ media/
             inquiries/ testimonials/ faqs/ seo/ settings/ users/ activity/
  api/       auth/ upload/ search/
  layout.tsx sitemap.ts robots.ts
src/components/  ui/ motion/ layout/ product/ sections/ studio/
src/lib/  db.ts auth.ts blob.ts whatsapp.ts utils.ts validations/
src/hooks/  src/actions/  src/types/
public/  (logos, fonts, og, video posters)
styles/
```

---

## 7. API Endpoints & Server Actions

- ✅ `app/api/auth/[...nextauth]` — Auth.js v5 handler (GET/POST). **Built (Phase 3).**
- `app/api/upload/route.ts` — Vercel Blob `handleUpload` for client uploads (Phase 4 admin media / Phase 7 reference images).
- `app/api/search/route.ts` — Postgres search across products/posts/portfolio (Phase 8).
- Server Actions (planned): product CRUD, category CRUD, portfolio CRUD, blog CRUD, inquiry create + status update, testimonials/FAQs/settings CRUD, contact submit, `createInquiry` (order flow).

---

## 8. Component Inventory (with props — none built yet)

> Format: `ComponentName(props) — purpose` · `"use client"` noted.

**UI primitives — `src/components/ui`**
- `Container({ as?, className, ...html })` — centered `max-w-7xl` responsive wrapper.
- `Section({ id?, eyebrow?, index?, title?, description?, bare?, containerClassName?, className })` — vertical-rhythm section + editorial header (eyebrow + numbered marker).
- `Button({ variant: default|gold|ocean|outline|ghost|glass|link, size: sm|default|lg|icon, asChild? })` — CVA + Radix Slot.

**Brand — `src/components/brand`**
- `Logo({ className?, withMonogram? })`, `Monogram({ className? })` — RR resin-droplet mark + wordmark.
- `InstagramIcon(svgProps)`, `FacebookIcon(svgProps)` — inline brand glyphs (lucide v1 dropped brand icons).

**Motion — `src/components/motion`**
- `LiquidGlass({ as?, refraction?, className, ...html })` — frosted glass; Chromium refraction via `useSyncExternalStore` feature-detect, blur fallback. `"use client"`
- `MouseParallax({ children, className?, strength? })` — pointer parallax (useMotionValue/Spring/Transform); reduced-motion safe. `"use client"`
- `ScrollReveal({ children, className?, delay?, y?, once? })` — whileInView fade + rise; reduced-motion safe. `"use client"`
- `Preloader()` — first-load cinematic overlay. `"use client"`

**Providers / layout**
- `LenisProvider({ children })` — Lenis smooth scroll (off under reduced-motion). `"use client"`
- `Header()` — glass sticky nav, adaptive tone, mobile menu, WhatsApp CTA. `"use client"`
- `Footer()` — luxury multi-column footer (contact tel/mailto/maps, socials).
- `AnnouncementBar()` — slim top bar + WhatsApp link.

**Lib — `src/lib`**
- `cn(...inputs)` — Tailwind class merge. *(utils.ts)*
- `siteConfig`, `mainNav`, `footerNav` — static site config (DB `SiteSettings`-driven from Phase 5). *(site.ts)*
- `waLink(message?)`, `defaultEnquiry` — wa.me helper (full structured builder in Phase 7). *(whatsapp.ts)*

**Data & Auth — Phase 3**
- `prisma` — Prisma client singleton. *(lib/db.ts)*
- `authConfig` — edge-safe Auth.js config (authorized/jwt/session callbacks, no Prisma). *(auth.config.ts)*
- `{ handlers, auth, signIn, signOut }` — Auth.js v5 Credentials (bcrypt verify, JWT). *(lib/auth.ts)*
- `proxy` (default export) — Next 16 proxy gating `/studio/*` (matcher). *(proxy.ts)*
- Route: `GET/POST /api/auth/[...nextauth]`. Session augmented with `id` + `role`.

---

## 9. Current Progress

- Phases 1–3 complete (Phase 3 = code; DB migrate/seed awaits Neon credentials).
- App builds with full DB schema, generated Prisma client, and Auth.js wired. `/studio/*` is protected by `proxy.ts` (no `/studio` pages exist yet → Phase 4).
- Pending owner actions: provision Neon + Blob, `vercel link`, env pull, run migrate + seed; flip default branch to `main` in GitHub UI.

---

## 10. Known Issues

- `vercel link` not run (CLI absent / needs the owner's Vercel auth) — do during Phase 3 service setup.
- `public/` is currently empty (default Next/Vercel SVGs removed); real logo/og/poster assets added later. Favicon is `src/app/favicon.ico` (App Router convention).
- `LiquidGlass` renders its SVG displacement filter per refracting instance (duplicate `#rr-glass` id) — harmless; dedupe to a single global def in Phase 9.
- Socials (Instagram/Facebook) are placeholder `#` links until set in Site Settings (Phase 5).
- **DB migrate/seed run automatically on Vercel deploy** via the `vercel-build` script (`prisma migrate deploy && prisma db seed && next build`). The sandbox egress **allowlist blocks Neon (`*.neon.tech`) + Blob (`*.blob.vercel-storage.com`)**, so they can't run here (confirmed: 403 "host not in allowlist"). Seed is first-run-guarded (`SEED_FORCE=1` to re-run). Manual run from open-egress machine: `npm run db:deploy && npm run db:seed`.
- **Default branch** is still `claude/epic-bell-dof5as`; switch to `main` via GitHub UI (no MCP/API tool for this repo setting).
- Prisma CLI reads `.env` (not `.env.local`). After `vercel env pull .env.local`, also expose `DATABASE_URL` to the CLI (e.g. `cp .env.local .env`).

---

## 11. Environment Variables

```
DATABASE_URL                 # AUTO-INJECTED by Neon native integration; `vercel env pull` locally
AUTH_SECRET
AUTH_URL=https://shop.bhavyagondaliya.co.in
ADMIN_EMAIL=gondaliyabhavya70960@gmail.com
ADMIN_PASSWORD               # used by seed script only
BLOB_READ_WRITE_TOKEN        # AUTO-INJECTED when Vercel Blob store is connected
RESEND_API_KEY               # optional — Resend via Vercel Marketplace
NEXT_PUBLIC_WHATSAPP_NUMBER=917096036250
NEXT_PUBLIC_SITE_URL=https://shop.bhavyagondaliya.co.in
```

**Connection status (Phase 3.x):** Live **Neon** + **Blob** creds are in `.env.local`/`.env` (git-ignored, never committed). Schema `datasource` now has `url=DATABASE_URL` (pooled) + `directUrl=DATABASE_URL_UNPOOLED` (direct, for migrations). A fresh `AUTH_SECRET` was generated into `.env.local`. **Owner must add to Vercel env:** `AUTH_SECRET`, `AUTH_URL`, `ADMIN_EMAIL`, `ADMIN_PASSWORD`, `NEXT_PUBLIC_*` (Neon + Blob vars auto-inject). DB initialises on first Vercel deploy.

---

## 12. EXACT Next Phase + Next Tasks

### ▶ Phase 4 — Admin Core — DO NOT START WITHOUT PERMISSION

1. `/studio` layout (sidebar nav + signed-in guard via `auth()`), `/studio/login` page (Credentials form → `signIn`), `/studio` dashboard (counts: products, inquiries this week, posts; recent inquiries; quick links).
2. Add shadcn/ui pieces as needed (`npx shadcn@latest add input label form table dialog dropdown-menu select textarea badge card sonner tabs`) — Button is already custom.
3. Server Actions in `src/actions`: product CRUD (slug + draft/publish), category CRUD; Zod validation + `revalidatePath` + `ActivityLog` writes; role-guarded via `auth()`.
4. Products admin: list/table, create/edit form, gallery upload to **Vercel Blob** (client upload via `app/api/upload/route.ts` `handleUpload`), **Custom Form Builder** for `CustomizationField` (label/type/options/required/help/order).
5. Categories admin: CRUD + ordering. Media Library: Blob `list`/upload/delete by `pathname`, persisted to `Media`.
6. `npm run build` check, update CONTEXT.md, commit, push, STOP.

**Note:** live admin testing needs the connected Blob store + DB (migrate/seed run). If env is still absent, build the UI + Server Actions and document that runtime testing requires the connected stores. Keep secrets out of git.

**Reminder for next session:** the DB migrate + seed and the default-branch flip to `main` are still pending owner actions (see §10).
