# CONTEXT.md — ResinRiva Build Memory (Source of Truth)

> **Read this file at the START of every session before writing any code.** Do NOT re-read the whole codebase — this file is the single source of truth.
> When a phase finishes: write ALL of that phase's data here, then STOP and wait for explicit permission before the next phase. Never auto-continue.

---

## 0. Quick Status

| Item | Value |
| --- | --- |
| Current Phase | **Phase 1 — Repo + Documentation** ✅ COMPLETE |
| Next Phase | **Phase 2 — Scaffold + Design System** (awaiting permission) |
| Branch | `claude/epic-bell-dof5as` (all phases develop here) |
| Base branch | `main` (empty initial commit; PR base) |
| Tracking PR | #1 — https://github.com/gondaliyabhavya70960/ResinRivaNew/pull/1 (draft) |
| Repo | https://github.com/gondaliyabhavya70960/ResinRivaNew.git |
| Last updated | Phase 1 |

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
- Committed + pushed to `claude/epic-bell-dof5as`; opened draft PR #1 (base `main`). No CI configured on the repo yet.

---

## 2. Pending Features (by phase)

- **Phase 2** — Next.js scaffold, Tailwind theme w/ design tokens, fonts (Fraunces + Inter), core primitives (LiquidGlass, MouseParallax, ScrollReveal, Preloader, Container, Section, Button), Header + Footer, Lenis provider, `vercel link`.
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

> Populated starting Phase 2. Format: `ComponentName(props) — purpose`.

- _(none yet)_

---

## 9. Current Progress

- Phase 1 complete: all root docs + `.gitignore` + `.env.example` created and committed.
- No application code, dependencies, database, or Vercel link yet (Phases 2–3).

---

## 10. Known Issues

- _(none yet)_

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

### ▶ Phase 2 — Scaffold + Design System (DO NOT START WITHOUT PERMISSION)

1. `npx create-next-app@latest` — App Router, TypeScript, Tailwind, `src/` dir, ESLint.
2. Install: `shadcn/ui`, `motion` (Framer Motion), `gsap`, `lenis`, `lucide-react`, `react-hook-form` + `zod` + `@hookform/resolvers`, `swiper` + `embla-carousel-react`, `@vercel/blob`, `@vercel/analytics`, `@vercel/speed-insights`, `@google/model-viewer`.
3. Tailwind theme — add design tokens (colors above) + font CSS variables.
4. `next/font` — Fraunces (display) + Inter (body), exposed as CSS variables.
5. Build primitives in `src/components/`: `LiquidGlass`, `MouseParallax`, `ScrollReveal`, `Preloader`, `Container`, `Section`, `Button`.
6. Global `Header` (glass sticky nav) + `Footer` (brand, contact, WhatsApp, map link, socials) using EXACT business info.
7. Lenis smooth-scroll provider wrapping the app.
8. `vercel link` to connect local repo to the Vercel project.
9. Update CONTEXT.md (component inventory, decisions, files), commit, push, STOP.

**Note:** keep all motion behind `prefers-reduced-motion`; keep glass surfaces small; follow the design tokens exactly.
