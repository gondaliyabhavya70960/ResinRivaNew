# ResinRiva — Luxury Resin Art & 3D Printing Platform

> An heirloom you'll keep forever.

ResinRiva is a production-ready, luxury e-commerce **showcase** platform for a custom resin art and 3D printing studio. It is built to present bespoke, handcrafted work with an immersive, editorial, premium feel — and to convert browsers into enquiries through a **WhatsApp-first ordering flow** (no online checkout, no payment gateway, no customer accounts).

This repository is built in **strict, gated phases**. See [`CONTEXT.md`](./CONTEXT.md) for the single source of truth on progress, schema, design tokens, and the exact next steps.

---

## Brand & Business

| Field | Value |
| --- | --- |
| Brand Name | **ResinRiva** |
| Website URL | https://shop.bhavyagondaliya.co.in |
| Admin Panel | https://shop.bhavyagondaliya.co.in/studio |
| Location | https://maps.app.goo.gl/L2NHDt9Akgqs2ZoT6 |
| Phone | +91 7096036250 |
| WhatsApp | +91 7096036250 |
| Email | gondaliyabhavya70960@gmail.com |
| Repository | https://github.com/gondaliyabhavya70960/ResinRivaNew.git |

**What we make:** Custom Resin Art · Custom 3D Printing · Personalized Resin Gifts · Custom Nameplates · Wedding Resin Art · Corporate Resin Art · Home Decor · Business Branding Products · 3D Printed Products · Made-To-Order Products.

---

## Business Model — Hard Rules (never violate)

- ❌ **NO** payment gateway, online checkout, or cart payment
- ❌ **NO** Stripe / Razorpay / PayPal
- ❌ **NO** membership, customer login, or customer accounts
- ✅ Admin login at `/studio` is for the **owner only** — not a customer feature
- ✅ **Everything is finalized through WhatsApp**

### Customer Journey

1. Customer visits the website
2. Customer views products
3. Customer customizes a product (form on the product page)
4. Customer submits requirements (name, phone, optional email, selections, reference images, notes)
5. Customer clicks **Place Order**
6. The site generates the order summary **and saves it to the database** (an `Inquiry` record) via a Server Action — this powers the admin "WhatsApp Orders" screen
7. Redirect to WhatsApp
8. WhatsApp opens with the complete order information pre-filled
9. Price, payment, and delivery are handled manually in WhatsApp

---

## Tech Stack (Vercel-native)

Every service connects natively inside the Vercel dashboard, with env vars auto-injected and billing unified. Free tiers first; upgrade to Vercel Pro when commercial.

**Frontend**
- Next.js 15+ (App Router, TypeScript)
- TailwindCSS + shadcn/ui
- Framer Motion (`motion`), GSAP, Lenis smooth scroll
- Lucide Icons
- React Hook Form + Zod
- Swiper / Embla Carousel
- `@google/model-viewer` (GLB + USDZ, iOS AR Quick Look)

**Backend**
- Next.js API Routes + Server Actions
- Prisma ORM + PostgreSQL (**Neon** via Vercel Marketplace)
- Auth.js v5 (NextAuth) — Credentials provider, admin-only, protects all `/studio` routes
- Tiptap rich text editor (blog/admin)
- Fully custom admin CMS (no external CMS)

**Storage / Media**
- **Vercel Blob** — all images, video, 3D files (GLB/USDZ), blog images, and customer reference uploads
- `next/image` with Vercel Image Optimization (WebP/AVIF)

**Optional / Platform**
- Resend (email) via Vercel Marketplace
- Vercel Web Analytics + Speed Insights
- Vercel Cron Jobs (only if needed)

---

## Design System (summary)

**Colors** — `ivory #F4EFE9` · `ink #14151D` · `ocean #0E3A53` · `teal #1B6E7A` · `amber #C8881F` / `amber-light #E0A24A` · `gold #D4AF37` (metallic, sparing). Max ~4 core colors per screen, one metallic only. No bright red, no neon, no baby pastels.

**Typography** — Display/headings: **Fraunces** (serif). Body/UI: **Inter** (sans). Lowercase eyebrow labels + numbered section markers (01, 02, 03…).

**Style** — Luxury · Elegant · Modern · Minimal · Corporate · Editorial · Premium · Immersive · Sophisticated.

**Effects** — Liquid Glass / Glassmorphism (`backdrop-filter: blur() + saturate()`), gradient mesh backgrounds, mouse parallax, scroll reveal, cursor glow, page transitions. All motion gated behind `prefers-reduced-motion`. Chromium-only SVG refraction falls back to plain blur in Safari/Firefox.

> Full tokens, rules, and effect specs live in [`CONTEXT.md`](./CONTEXT.md).

---

## Project Structure (target)

```
/
├─ README.md, CONTEXT.md, INSTALL.md, DEPLOYMENT.md, ADMIN_GUIDE.md,
│  CONTENT_GUIDE.md, SEO_GUIDE.md, BACKUP_GUIDE.md,
│  WHATSAPP_ORDER_GUIDE.md, COMPETITOR.md
├─ prisma/ (schema.prisma, seed.ts, migrations/)
├─ src/app/
│  ├─ (public)/  → home, about, shop, shop/[category], product/[slug],
│  │   custom-order, portfolio, portfolio/[slug], process, blog,
│  │   blog/[slug], faq, contact, privacy, terms, search, whatsapp-order
│  ├─ studio/    → login, dashboard, products, categories, portfolio,
│  │   blog, media, inquiries, testimonials, faqs, seo, settings,
│  │   users, activity
│  ├─ api/       → auth, upload (Blob handleUpload), search
│  ├─ layout.tsx, sitemap.ts, robots.ts
├─ src/components/ (ui, motion, layout, product, sections, studio)
├─ src/lib/ (db.ts, auth.ts, blob.ts, whatsapp.ts, utils.ts, validations/)
├─ src/hooks/  ├─ src/actions/  ├─ src/types/
├─ public/ (logos, fonts, og, video posters)
├─ styles/
```

---

## Getting Started

> Full setup in [`INSTALL.md`](./INSTALL.md); deployment in [`DEPLOYMENT.md`](./DEPLOYMENT.md).

```bash
# 1. Install dependencies (after Phase 2 scaffold)
npm install

# 2. Pull Vercel-injected env vars (Neon + Blob) after `vercel link`
vercel env pull .env.local

# 3. Run database migration + seed (after Phase 3)
npx prisma migrate dev
npx prisma db seed

# 4. Start the dev server
npm run dev
```

---

## Environment Variables

See [`.env.example`](./.env.example) for the full list (names only, no secrets). Key vars:

```
DATABASE_URL                 # auto-injected by Neon native integration
AUTH_SECRET
AUTH_URL=https://shop.bhavyagondaliya.co.in
ADMIN_EMAIL=gondaliyabhavya70960@gmail.com
ADMIN_PASSWORD               # used by seed script only
BLOB_READ_WRITE_TOKEN        # auto-injected when Vercel Blob store is connected
RESEND_API_KEY               # optional
NEXT_PUBLIC_WHATSAPP_NUMBER=917096036250
NEXT_PUBLIC_SITE_URL=https://shop.bhavyagondaliya.co.in
```

---

## Documentation

| File | Purpose |
| --- | --- |
| [`CONTEXT.md`](./CONTEXT.md) | **Source of truth** — progress, schema, tokens, brand rules, next steps |
| [`INSTALL.md`](./INSTALL.md) | Local setup, dependencies, env, migrations |
| [`DEPLOYMENT.md`](./DEPLOYMENT.md) | Vercel deploy, Neon + Blob, custom domain, analytics |
| [`ADMIN_GUIDE.md`](./ADMIN_GUIDE.md) | Plain step-by-step admin guide for a non-developer |
| [`CONTENT_GUIDE.md`](./CONTENT_GUIDE.md) | Writing products, blogs, portfolio; photography direction |
| [`SEO_GUIDE.md`](./SEO_GUIDE.md) | Metadata, schema markup, sitemap, per-page SEO |
| [`BACKUP_GUIDE.md`](./BACKUP_GUIDE.md) | Neon PITR + Blob inventory + git |
| [`WHATSAPP_ORDER_GUIDE.md`](./WHATSAPP_ORDER_GUIDE.md) | How the WhatsApp order system works |
| [`COMPETITOR.md`](./COMPETITOR.md) | Top-20 competitor research (populated in Phase 11) |

---

## Build Phases

This project is built in **11 gated phases**, one per session. Each phase ends by updating `CONTEXT.md`, then stopping for explicit approval before the next.

- [x] **Phase 1** — Repo + Documentation
- [ ] **Phase 2** — Scaffold + Design System
- [ ] **Phase 3** — Database + Auth (Vercel-native)
- [ ] **Phase 4** — Admin Core
- [ ] **Phase 5** — Admin Rest
- [ ] **Phase 6** — Public Core Pages
- [ ] **Phase 7** — Shop + Order Flow
- [ ] **Phase 8** — Portfolio + Blog + Search
- [ ] **Phase 9** — Motion Polish
- [ ] **Phase 10** — SEO + Deploy
- [ ] **Phase 11** — Competitor Research + Content Seeding (100+ products, 50+ blogs)

---

## Known Caveats

- **Vercel Hobby plan is non-commercial** → upgrade to Vercel Pro ($20/mo) when the store goes commercial. The Vercel-native stack (Neon + Blob + Analytics) upgrades with zero re-architecture.
- **Vercel Blob & Image Optimization** include plan allowances; beyond them, usage-based billing applies → keep all media web-optimized (hero video ≤6MB, WebP images, lazy loading).
- **Neon free plan** auto-suspends and auto-wakes (scale-to-zero) — the first request after idle may have a brief cold start. This is normal.
- **SVG liquid-glass refraction** (`backdrop-filter: url()`) is Chromium-only → automatic blur fallback for Safari/Firefox.
- **`wa.me` links cannot attach files** → reference images go to Vercel Blob; public URLs are embedded inside the message text.

---

## License

Proprietary © ResinRiva. All brand assets, copy, and product content are original and owned by ResinRiva.
