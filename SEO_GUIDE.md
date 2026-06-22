# SEO_GUIDE.md — Search Engine Optimization

> Status: outline (Phase 1 stub). Implemented in Phase 10.

## What gets implemented
- **Metadata API** (Next.js) on every route — title, description, canonical.
- **Open Graph** + **Twitter Cards** with per-page OG images.
- **Schema markup (JSON-LD)**: Organization, LocalBusiness, Product, Article, Breadcrumb.
- **Dynamic sitemap** (`src/app/sitemap.ts`) covering products, categories, portfolio, blog, static pages.
- **`src/app/robots.ts`** — allow public, disallow `/studio` and `/api`.
- **Canonical URLs** on all pages.
- **Image optimization** via `next/image` (WebP/AVIF, responsive).

## LocalBusiness data (use exact values)
- Name: ResinRiva · Phone: +91 7096036250 · Email: gondaliyabhavya70960@gmail.com
- URL: https://shop.bhavyagondaliya.co.in · Map: https://maps.app.goo.gl/L2NHDt9Akgqs2ZoT6

## Per-page SEO (admin-editable)
- Products, posts, portfolio, and site defaults expose `seoTitle`, `seoDescription`, `ogImage` editable in `/studio`.
- Fallback chain: page SEO → `SiteSettings.defaultSeo` → sensible derived defaults.

## Best practices
- Unique title/description per page; one `<h1>`; descriptive alt text.
- Fast INP/LCP (lazy-load below-the-fold media, optimized hero video).
- Internal linking from blog posts to relevant products.

## Checklist
- [ ] Metadata on every route
- [ ] OG images render
- [ ] All 5 schema types validate (Rich Results Test)
- [ ] sitemap.ts + robots.ts resolve
- [ ] Canonicals correct
- [ ] `/studio` excluded from indexing

> To be expanded with code references and validation steps in Phase 10.
