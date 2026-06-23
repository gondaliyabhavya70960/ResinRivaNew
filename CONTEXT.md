# CONTEXT.md — ResinRiva Build Memory (Source of Truth)

> **Read this file at the START of every session before writing any code.** Do NOT re-read the whole codebase — this file is the single source of truth.
> When a phase finishes: write ALL of that phase's data here, then STOP and wait for explicit permission before the next phase. Never auto-continue.

---

## 0. Quick Status

| Item | Value |
| --- | --- |
| Current Phase | **Phase 11 — Competitor research + content seeding** ✅ COMPLETE |
| Next Phase | **None — all 11 build phases done.** Remaining items are owner-only (domain, default branch). |
| Branch | `claude/epic-bell-dof5as` (all phases develop here → PR to `main`) |
| Env | Owner set all Vercel env vars ✅ · DB auto-inits on deploy (non-fatal bootstrap) |
| PRs | #1–10 merged (P1–P8) · #11 open (P9–P11 this session) |
| Repo | https://github.com/gondaliyabhavya70960/ResinRivaNew.git |
| Last updated | Phase 11 |

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

### ✅ Phase 4 — Admin Core
- **Restructured** app into a `(public)` route group (Header/Footer/Lenis/Preloader chrome) + slim root layout; home moved to `(public)/page.tsx`. Studio has its own chrome (no public header/footer).
- **Auth UI + guard:** `/studio/login` (Credentials `signIn`); `studio/(panel)/layout.tsx` server-guarded via `requireUser()` with sidebar + topbar + sign-out. `proxy.ts` already gates `/studio/*`.
- **Dashboard** (`studio/(panel)/page.tsx`): product / category / inquiry-7d / post counts + recent inquiries + quick links.
- **Products CRUD:** list (table, status/featured badges, price), new/edit pages, `ProductForm` (basics, pricing, gallery, customization, SEO) with **Blob `ImageUploader`** (client upload → `/api/upload`) + **`CustomizationFieldBuilder`** (dynamic fields → JSON hidden inputs → Server Action). Actions `saveProduct`/`deleteProduct`/`toggleProductStatus`.
- **Categories CRUD:** list + inline new form + edit page; `saveCategory`/`deleteCategory`.
- **Media Library:** Blob-backed grid + `MediaUploader`; delete removes Blob + `Media` row. Actions `recordMedia`/`deleteMedia`.
- **Infra:** `/api/upload` Blob `handleUpload` (admin session required; `refs/` prefix anonymous for Phase 7); `src/lib/{auth-helpers,blob}.ts`; `src/lib/validations/studio.ts` (zod, `slugify`); `src/actions/{state,categories,products,media}.ts`; UI primitives `input/textarea/label/select/card/badge`.
- All studio pages `force-dynamic` (no DB hit at build). Verified: `tsc` clean · `next build` green · `eslint` clean.
- **Note:** live admin needs the deployed DB + Blob (sandbox egress blocks them). Remaining admin (Blog/Portfolio/Inquiries/Testimonials/FAQ/SEO/Settings/Users/Activity) = Phase 5.

### ✅ Phase 5 — Admin Rest (full admin CMS complete)
- Sidebar expanded to all sections. New Server Actions (`src/actions/`): `blog`, `portfolio`, `inquiries`, `testimonials`, `faqs`, `settings`, `users` — zod-validated, auth-guarded, `revalidatePath` + `ActivityLog`.
- **Blog:** posts CRUD with **Tiptap** editor (`TiptapEditor`, content stored as JSON), blog categories (inline), tags (comma → upserted `Tag` + `BlogPostTag` join), cover image, publish date, SEO. Pages list/new/[id]/edit.
- **Portfolio:** CRUD — story, before/after (`SingleImagePicker`), video, gallery (`ImageUploader`), results metadata (`ResultsMetaBuilder` → Json), category, status. Pages list/new/[id]/edit.
- **Inquiries / WhatsApp Orders:** list + status filter chips + `InquiryStatusSelect` (NEW→CONTACTED→CONFIRMED→DELIVERED) + detail (customer, selections, reference links, whatsappMessage, delete via inline server action).
- **Testimonials** + **FAQs:** list + inline new form + edit page.
- **Site Settings:** singleton form (brand, contact, socials, SEO defaults) → `saveSettings` upsert; `revalidatePath("/","layout")`.
- **Users & roles** (admin-only): create user (bcrypt), `UserRoleSelect`, delete (not self). **Activity log** viewer (read-only).
- Installed `@tiptap/react @tiptap/starter-kit @tiptap/pm` (v3.27). Verified: `tsc` clean · `next build` green (all studio routes) · `eslint` clean.
- **Admin CMS now complete (Phases 4–5).** Live use needs deployed DB/Blob.

### ✅ Phase 6 — Public Core Pages
- **Data layer** `src/lib/queries.ts`: cached (`react.cache`), resilient (try/catch → empty) reads — `getSiteData` (SiteSettings merged w/ `siteConfig` fallback), `getFeaturedProducts`, `getTestimonials`, `getBlogHighlights`, `getPortfolioHighlights`, `getFaqs`, `getHomeStats`.
- **Home** (`(public)/page.tsx`, replaces Phase-2 placeholder): Hero (video bg + mouse parallax), brand story, marquee, featured products, how-it-works 01–04, why-pillars, portfolio highlights, stat counters (count-up), testimonials carousel, blog highlights, Instagram grid, WhatsApp CTA.
- **Pages:** About, Process, FAQ (DB accordion), **Contact** (Google Maps embed + `ContactForm` → `submitContact` saving `Inquiry` source=CONTACT + contact details + FAQs), Privacy, Terms — each with metadata.
- **Sections** (`src/components/sections/`): `Hero`, `StatCounters`, `Marquee`, `TestimonialsCarousel`, `FaqAccordion`, `ContactForm`; `ProductCard` (`components/product`, hover 2nd image, `priceLabel`).
- **Header/Footer/AnnouncementBar are now DB-driven** from `SiteSettings` via `getSiteData()` in the `(public)` layout (`force-dynamic`). `Footer`/`AnnouncementBar` take props; `Header` unchanged.
- `@keyframes marquee` added to globals.css; all motion reduced-motion-gated. Verified: `tsc`/`next build`/`eslint` clean. All `(public)` pages are dynamic (layout fetches settings).
- **Note:** links to `/shop`, `/product/[slug]`, `/portfolio/[slug]`, `/blog/[slug]`, `/custom-order` resolve in Phases 7–8.

### ✅ Phase 7 — Shop + Order Flow (the WhatsApp ordering system)
- **WhatsApp builder** `src/lib/whatsapp.ts` → `buildOrderMessage()`: exact structured message (product, selections, ref URLs, budget/timeline, customer block) per WHATSAPP_ORDER_GUIDE — used for the live preview AND saved verbatim to the Inquiry.
- **Actions:** `createInquiry` (`src/actions/order.ts`, zod, saves PRODUCT|CUSTOM_ORDER Inquiry); `fetchProducts`/`countProducts` (`src/actions/shop.ts`, filter/sort/search/paginate; `ShopFilters`/`ShopProduct` types exported there too).
- **Shop** `/shop` + `/shop/[category]`: `ShopControls` (search + sort → URL), category chips, `ShopGrid` (client; IntersectionObserver infinite scroll + Load-more; `key`-remount on filter change). Reuses `ProductCard`.
- **Product detail** `/product/[slug]`: `ProductGallery` (thumbnails + zoom lightbox), `ModelViewer` (GLB/USDZ web component, dynamic import), video, dynamic **`OrderForm`** rendering `CustomizationField`s by type (SELECT/SIZE → select, SWATCH → chips w/ hex, TEXT/NUMBER, FILE → refs note), `ReferenceUploader` (public Blob `refs/`), customer details, **live WhatsApp preview**, Place Order → open wa tab (gesture-preserving) → `createInquiry` → `sessionStorage` → push `/whatsapp-order`. Related products + `generateMetadata`.
- **Custom Order** `/custom-order` (`CustomOrderForm`) → `createInquiry` (CUSTOM_ORDER). **WhatsApp Order** `/whatsapp-order` fallback (reads sessionStorage via `useSyncExternalStore`; summary + "Open WhatsApp").
- Verified: `tsc` / `next build` / `eslint` clean. **Note:** portfolio/blog public detail + search = Phase 8.

### ✅ Phase 8 — Portfolio + Blog + Search
- **Query helpers** (`src/lib/queries.ts`): `getPortfolios`/`getPortfolio`/`getPortfolioCategories`; `getPosts` (paginated)/`getPost`/`getRelatedPosts`/`getBlogTaxonomies`; `searchAll` (products+posts+portfolios, ILIKE `contains` insensitive).
- **Portfolio:** `/portfolio` (grid + category filter) and `/portfolio/[slug]` (before/after slider, gallery lightbox, video, results-meta sidebar, enquire CTA). `BeforeAfter` client slider (clip-path + range).
- **Blog:** `/blog` (grid + category filter + page pagination) and `/blog/[slug]` (cover, author/date, **`TiptapContent`** recursive JSON→HTML renderer w/ prose styling, tags → tag filter, related posts, Article JSON-LD).
- **Search:** `/search` (`SearchBox` client input + grouped product/portfolio/journal results) + header search icon (desktop + mobile menu).
- Components: `src/components/blog/tiptap-content.tsx`, `src/components/portfolio/before-after.tsx`, `src/components/shop/search-box.tsx`. Verified: `tsc`/`build`/`eslint` clean.

### ✅ Phase 9 — Motion Polish
- **New motion primitives** (`src/components/motion/`):
  - `GlassDefs` — the `#rr-glass` SVG displacement filter, now rendered **once** at the public-layout root. `LiquidGlass` no longer emits a per-instance `<filter>` (duplicate-id issue resolved); refracting instances just reference `url(#rr-glass)` + `will-change: backdrop-filter`. Refraction stays Chromium-only via the existing `useSyncExternalStore` feature-detect → blur fallback (Safari/Firefox).
  - `CursorGlow` — spring-trailed ambient pointer light (`useMotionValue`/`useSpring`), **fine-pointer only** (`useSyncExternalStore` on `matchMedia("(pointer:fine)")`), `mix-blend-screen`, `z-30` (below header/modals). Returns `null` on touch + reduced-motion.
  - `PageTransition` — per-route enter fade+rise keyed on `usePathname()` (enter-only → no App-Router AnimatePresence exit-freeze). Passthrough under reduced-motion. Wraps `{children}` in `(public)/layout.tsx`.
  - `ParallaxImage` — **GSAP ScrollTrigger** parallax for key images; GSAP is **dynamically imported** (code-split, only loads where used), over-sized 124% layer inside an `overflow-hidden` frame, `will-change-transform`, `ctx.revert()` cleanup. Static/covering under reduced-motion. Applied to: home studio image, about story image, blog cover (`strength={9}`).
- **Tuning:** Hero `<video>` → `preload="metadata"` + `disablePictureInPicture` + `aria-hidden`. `Marquee` → edge-fade `.marquee-mask`, `will-change-transform` + GPU promote, duplicated items `aria-hidden`. `StatCounters` → `tabular-nums` (no width jitter) + `toLocaleString("en-IN")`.
- **Reduced-motion audit:** every motion component gated (CursorGlow/PageTransition/ParallaxImage return static; MouseParallax/ScrollReveal/Preloader/StatCounters/Lenis already gated; CSS marquee/glass covered by the global `@media (prefers-reduced-motion)` guard).
- **Perf/INP:** `next/image` `sizes` audited (correct); below-fold media lazy by default; product-gallery main image keeps `priority` (LCP); `will-change`/GPU only on actively-animated nodes. `tsc`/`next build`/`eslint` all clean.

### ✅ Phase 10 — SEO + Deploy/Domain
- **Structured data:** `src/lib/structured-data.ts` builders + `src/components/seo/json-ld.tsx` (`<JsonLd>` serializes one/many blobs, `<`-escaped). Emitted: `Organization` + `WebSite`(+`SearchAction`) sitewide in `(public)/layout.tsx`; `Product`(+`AggregateOffer` INR / `availability: MadeToOrder`) + `BreadcrumbList` on product pages; `FAQPage` on `/faq`; `Article` on blog posts (pre-existing). Offers are price *guidance* only — no checkout (brand rule intact).
- **Sitemap:** `src/app/sitemap.ts` (dynamic, resilient) — static pages + published products / shop categories / portfolio / blog posts w/ `lastModified`. New query `getSitemapEntries` in `queries.ts`.
- **robots:** `src/app/robots.ts` — allow `/`, disallow `/studio` `/api/` `/whatsapp-order`, links `/sitemap.xml`.
- **OG image:** `src/app/opengraph-image.tsx` — branded 1200×630 card via `next/og` `ImageResponse` (default for pages without their own; products/blog still use `ogImage`/`coverImage`).
- **Canonicals:** `alternates.canonical` on home + all indexable static pages + dynamic detail pages (product/blog/portfolio/shop-category via `generateMetadata`). `/search` → `robots:{index:false}`.
- **Docs:** `SEO_GUIDE.md` rewritten to as-built + validation steps. `DEPLOYMENT.md` already covers Vercel + Neon/Blob + domain.
- Build registers `○ /opengraph-image`, `○ /robots.txt`, `ƒ /sitemap.xml`. `tsc`/`next build`/`eslint` clean.
- **Owner step (deploy/domain):** connect `shop.bhavyagondaliya.co.in` in Vercel → Project → Domains (DNS to Vercel); confirm `NEXT_PUBLIC_SITE_URL`/`AUTH_URL` match. Submit sitemap in Search Console.

### ✅ Phase 11 — Competitor Research + Content Seeding
- **`COMPETITOR.md`** populated: 20 entries (India WhatsApp-model players + global marketplaces/reference brands) analysed for product TYPES, price bands, ordering model, content topics — **no copied text/names/images** (originality rule). Summary → market gaps, India pricing insights, and the product/blog opportunity lists that drove the seed.
- **`prisma/seed-content.ts`** — bulk, original, idempotent (upsert-by-slug), **first-run-guarded** (`existing > 30` → skip; `SEED_FORCE=1` to re-run):
  - **122 products across 10 categories** (adds a new `3d-printed-decor` category — the brand is resin art AND 3D printing). Concept-driven, palette-varied; each has 2 images (picsum placeholders), category-appropriate customisation fields, realistic INR price bands; furniture is bespoke (`showPrice:false` → "Enquire").
  - **51 blog posts across 6 blog categories** (adds `inspiration`, `weddings`, `printing`). Rich Tiptap JSON (intro, H2 sections, bullet lists, a pull-quote) via local node builders — validated against `TiptapContent`'s node types; tags upserted + linked.
  - Builders (`buildProducts`/`buildDoc`/`posts`) exported + a direct-run guard so importing for tests doesn't hit the DB. Verified at runtime: 122 products (no dup slugs, all have images+fields), 51 posts (valid nodes, `listItem>paragraph` ok).
- **Script + deploy wiring:** `npm run db:seed:content` (`tsx prisma/seed-content.ts`); added to `scripts/db-bootstrap.mjs` (runs after base seed, non-fatal). On the next deploy the catalogue + journal auto-populate, then the guard skips on later deploys (admin edits safe). With the base seed: **~128 products + ~53 posts** live. `tsc`/`eslint` clean.

### ➕ Post-build additions (same branch, after Phase 11 merge)
- **Live Instagram feed (Behold):** `src/components/sections/instagram-feed.tsx` (`"use client"`) renders the `<behold-widget>` custom element (ElementType cast, same pattern as model-viewer) and injects `https://w.behold.so/widget.js` once. Replaces the home page's placeholder Instagram grid. Feed id in `siteConfig.instagramFeedId` (`oq8gkyez0lDCZYoAWtiL`). A "Follow on Instagram" button shows when the IG social URL is set.
- **Portfolio case studies seeded:** `seed-content.ts` now also seeds **10 original portfolio commissions** (before/after + 2–3 gallery images + resultsMeta + category) so `/portfolio` is populated (neither seed had portfolio data before). Bulk seed totals: **122 products, 51 posts, 10 portfolios**.

---

## 2. Pending Features (by phase)

- **Phase 9** ✅ — Motion polish (done: GlassDefs dedupe, CursorGlow, PageTransition, GSAP ParallaxImage, counter/marquee/video tuning, reduced-motion audit, perf/INP pass).
- **Phase 10** ✅ — SEO done (Metadata, canonicals, OG image, JSON-LD, sitemap.ts, robots.ts, SEO_GUIDE). Owner still to connect the custom domain in Vercel + submit sitemap to Search Console.
- **Phase 11** ✅ — COMPETITOR.md (20 entries), `seed-content.ts` (122 products / 51 posts, original), wired into deploy bootstrap, CONTEXT.md finalised.
- **All 11 build phases are complete.** Remaining work is owner-only: (a) flip the GitHub default branch to `main`; (b) connect `shop.bhavyagondaliya.co.in` in Vercel + verify env; (c) submit the sitemap to Google Search Console; (d) replace picsum placeholder images with real ResinRiva photography via `/studio`.

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
- ✅ `app/api/upload/route.ts` — Vercel Blob `handleUpload`. **Built (Phase 4)** — admin uploads require a session; `refs/` prefix anonymous (Phase 7).
- Server Actions **built:** categories/products/media (P4); blog/portfolio/inquiries/testimonials/faqs/settings/users (P5); `submitContact` (P6); `createInquiry` (order) + `fetchProducts`/`countProducts` (shop) (P7). All in `src/actions/`. Public reads in `src/lib/queries.ts`. `buildOrderMessage` in `src/lib/whatsapp.ts`.
- ✅ `app/sitemap.ts` (dynamic) · `app/robots.ts` · `app/opengraph-image.tsx` (`next/og`). **Built (Phase 10).**
- Search is implemented as a server page (`/search` + `searchAll` in `queries.ts`), not an API route.
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

**Studio admin — Phase 4** (`src/components/studio`, `src/actions`, `src/app/studio`)
- Helpers: `getSessionUser/requireUser/requireAdmin/logActivity` (`lib/auth-helpers`), `listBlobs/deleteBlobByUrl/mediaTypeFor` (`lib/blob`), zod + `slugify` (`lib/validations/studio`).
- Client components: `StudioSidebar`, `SignOutButton`, `CategoryForm`, `ProductForm`, `ImageUploader` (type `GalleryImage`), `CustomizationFieldBuilder` (type `CustomField`), `MediaUploader`, `DeleteButton`, `FieldError`.
- UI primitives: `Input`, `Textarea`, `Label`, `Select`, `Card`(+`Header`/`Title`/`Content`), `Badge`.
- Pages: `/studio/login`, `/studio` (dashboard), `/studio/products` (+ `/new`, `/[id]/edit`), `/studio/categories` (+ `/[id]/edit`), `/studio/media`. App split into `(public)` group + `studio`.

**Studio admin — Phase 5**
- Actions: `blog` (saveBlogPost/deleteBlogPost/saveBlogCategory/deleteBlogCategory), `portfolio`, `inquiries` (updateInquiryStatus/deleteInquiry), `testimonials`, `faqs`, `settings` (saveSettings), `users` (createUser/updateUserRole/deleteUser, admin-only).
- Client components: `TiptapEditor`, `BlogPostForm`, `BlogCategoryForm`, `PortfolioForm`, `ResultsMetaBuilder`, `SingleImagePicker`, `TestimonialForm`, `FaqForm`, `SettingsForm`, `InquiryStatusSelect`, `UserForm`, `UserRoleSelect`.
- Pages: `/studio/blog` (+new,[id]/edit), `/studio/portfolio` (+new,[id]/edit), `/studio/inquiries` (+[id]), `/studio/testimonials` (+[id]/edit), `/studio/faqs` (+[id]/edit), `/studio/settings`, `/studio/users`, `/studio/activity`.
- Deps: `@tiptap/react`, `@tiptap/starter-kit`, `@tiptap/pm` (v3.27).

**Public site — Phase 6–7**
- Sections (`src/components/sections`): `Hero`, `StatCounters`, `Marquee`, `TestimonialsCarousel`, `FaqAccordion`, `ContactForm`.
- Product/shop (`src/components/product`, `src/components/shop`): `ProductCard` (+`priceLabel`), `ProductGallery`, `ModelViewer`, `OrderForm`, `CustomOrderForm`, `ReferenceUploader`, `ShopGrid`, `ShopControls`.
- Public pages: `/`, `/about`, `/process`, `/faq`, `/contact`, `/privacy`, `/terms`, `/shop` (+`/[category]`), `/product/[slug]`, `/custom-order`, `/whatsapp-order`. All under `(public)` (force-dynamic).

---

## 9. Current Progress

- **Phases 1–11 ALL complete.** Full public site + admin CMS + WhatsApp order flow + motion polish + SEO + bulk original content. `tsc`/`next build`/`eslint` green throughout.
- Owner set all Vercel env vars; production deploy auto-migrates + seeds (base seed) + bulk content seed (first-run-guarded). Public pages `force-dynamic`.
- **Remaining = owner-only:** flip default branch to `main`; connect domain + verify env; submit sitemap to Search Console; swap picsum placeholders for real photos in `/studio`.

---

## 10. Known Issues

- `vercel link` not run (CLI absent / needs the owner's Vercel auth) — do during Phase 3 service setup.
- `public/` is currently empty (default Next/Vercel SVGs removed); real logo/og/poster assets added later. Favicon is `src/app/favicon.ico` (App Router convention).
- ~~`LiquidGlass` duplicate `#rr-glass` id~~ — **fixed in Phase 9**: filter def now rendered once via `<GlassDefs/>` at the public-layout root.
- Socials (Instagram/Facebook) are placeholder `#` links until set in Site Settings (Phase 5).
- **DB migrate/seed run automatically on Vercel deploy** via `vercel-build` → `node scripts/db-bootstrap.mjs && next build` (bootstrap is **non-fatal** — best-effort migrate+seed, never breaks the build; the first Vercel deploy with the strict `migrate && seed && build` chain FAILED, hence the resilient wrapper). Neon `channel_binding` stripped in `db.ts`/`seed.ts`. Sandbox egress **allowlist blocks Neon + Blob** (403), so they can't run here. Seed first-run-guarded (`SEED_FORCE=1`). Manual: `npm run db:deploy && npm run db:seed` from open-egress machine.
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

## 12. Build Complete — Owner Handoff

**All 11 build phases are done.** There is no "next phase". What remains is owner-only operational setup:

1. **Default branch** → flip to `main` in GitHub → Settings → Branches (no API tool for this repo setting).
2. **Domain** → Vercel → Project → Domains → add `shop.bhavyagondaliya.co.in` (point DNS to Vercel). Confirm `NEXT_PUBLIC_SITE_URL` + `AUTH_URL` match the live domain.
3. **First production deploy after merge** runs `db-bootstrap.mjs`: `migrate deploy` → base `seed` → `seed-content` (bulk). The bulk seed is first-run-guarded, so it populates once (~128 products / ~53 posts) then auto-skips. To re-assert bulk content later: set `SEED_FORCE=1` for one deploy (or run `npm run db:seed:content` from an open-egress machine).
4. **Search Console** → submit `https://shop.bhavyagondaliya.co.in/sitemap.xml`.
5. **Real photography** → replace picsum placeholders (alt text tagged "placeholder") with real ResinRiva photos via `/studio` (Products, Portfolio, Blog covers, Site Settings hero video).
6. **Security** → rotate the Neon/Blob credentials that were pasted in chat earlier; set a strong `ADMIN_PASSWORD` (the seed warns if unset).

**Seed scripts:** `npm run db:seed` (base — admin, settings, 9 categories, starter content; first-run-guarded) · `npm run db:seed:content` (bulk — adds `3d-printed-decor` + 3 blog categories, 122 products, 51 posts; first-run-guarded; `SEED_FORCE=1` to force).

**Catalogue note:** categories are now **10** (base 9 + `3d-printed-decor`); blog categories now **6** (base `guides`/`gifting`/`behind-the-scenes` + `inspiration`/`weddings`/`printing`).
