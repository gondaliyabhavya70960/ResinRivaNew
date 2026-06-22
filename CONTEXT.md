# CONTEXT.md — ResinRiva Build Memory (Source of Truth)

> **Read this file at the START of every session before writing any code.** Do NOT re-read the whole codebase — this file is the single source of truth.
> When a phase finishes: write ALL of that phase's data here, then STOP and wait for explicit permission before the next phase. Never auto-continue.

---

## 0. Quick Status

| Item | Value |
| --- | --- |
| Current Phase | **Phase 2 — Scaffold + Design System** ✅ COMPLETE |
| Next Phase | **Phase 3 — Database + Auth (Vercel-native)** (awaiting permission) |
| Branch | `claude/epic-bell-dof5as` (all phases develop here) |
| Base branch | `main` (PR base) |
| PRs | #1 (Phase 1) merged ✅ · #2 (auto-sync main→branch) merged ✅ · #3 (Phase 2) open |
| Repo | https://github.com/gondaliyabhavya70960/ResinRivaNew.git |
| Last updated | Phase 2 |

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

---

## 2. Pending Features (by phase)

- **Phase 3** — Neon Postgres + Blob store (Vercel-native), full Prisma schema + migrate + seed, Auth.js v5 credentials + `/studio` middleware.
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

## 7. API Endpoints & Server Actions (planned — none built yet)

- `app/api/auth/[...nextauth]` — Auth.js v5 handler (Phase 3).
- `app/api/upload/route.ts` — Vercel Blob `handleUpload` for client uploads (Phase 7; reference images, admin media).
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

---

## 9. Current Progress

- Phases 1–2 complete. App scaffolds and builds; design system, primitives, Header/Footer/providers in place; placeholder home renders.
- No database, auth, admin, or real content pages yet (Phase 3+). `vercel link` + Neon/Blob creation pending (owner, Phase 3).

---

## 10. Known Issues

- `vercel link` not run (CLI absent / needs the owner's Vercel auth) — do during Phase 3 service setup.
- `public/` is currently empty (default Next/Vercel SVGs removed); real logo/og/poster assets added later. Favicon is `src/app/favicon.ico` (App Router convention).
- `LiquidGlass` renders its SVG displacement filter per refracting instance (duplicate `#rr-glass` id) — harmless; dedupe to a single global def in Phase 9.
- Socials (Instagram/Facebook) are placeholder `#` links until set in Site Settings (Phase 5).

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

---

## 12. EXACT Next Phase + Next Tasks

### ▶ Phase 3 — Database + Auth (Vercel-native) — DO NOT START WITHOUT PERMISSION

1. **Owner action:** in Vercel Dashboard → Storage, create **Neon Postgres** (native integration) + a **Blob** store; run `vercel link`, then `vercel env pull .env.local` (`DATABASE_URL` + `BLOB_READ_WRITE_TOKEN` auto-injected). Set `AUTH_SECRET` (`openssl rand -base64 32`) and `ADMIN_PASSWORD`.
2. Install Prisma + auth: `prisma` (dev), `@prisma/client`, `@auth/prisma-adapter`, `next-auth@beta` (Auth.js v5), `bcryptjs` + `@types/bcryptjs`.
3. `prisma/schema.prisma` — ALL models from §3 (User, Category, Product, ProductImage, CustomizationField, Inquiry, Portfolio, PortfolioImage, BlogPost, BlogCategory, Tag, BlogPostTag, Testimonial, Faq, Media, SiteSettings, ActivityLog) with the listed enums. `src/lib/db.ts` Prisma singleton.
4. `prisma migrate dev` + `prisma generate`.
5. `prisma/seed.ts` — admin user (from `ADMIN_EMAIL`/`ADMIN_PASSWORD`, bcrypt-hashed) + sample categories, products (with CustomizationFields), posts, testimonials, FAQs, and the `SiteSettings` singleton (exact business info). Wire `prisma.seed` in package.json.
6. Auth.js v5: `src/lib/auth.ts` (Credentials provider, session strategy `jwt`, admin role), `src/app/api/auth/[...nextauth]/route.ts`, `middleware.ts` protecting `/studio/*` except `/studio/login`.
7. `npm run build` check, update CONTEXT.md, commit, push, STOP.

**Note:** Phase 3 needs the owner to provision Neon + Blob first (or supply `DATABASE_URL`). If env is unavailable in-session, write all schema/seed/auth code + docs and note that `migrate`/`seed` must be run once the connection string is present. Keep all secrets out of git.
