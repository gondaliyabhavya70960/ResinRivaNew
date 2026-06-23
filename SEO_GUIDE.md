# SEO_GUIDE.md — Search Engine Optimization

> Status: ✅ implemented in Phase 10.

## As-built (file references)
- **Metadata** — `src/app/layout.tsx` sets `metadataBase`, default + templated titles, OG/Twitter defaults. Every route adds its own `title`/`description`; dynamic routes (product, blog, portfolio, shop category) build metadata in `generateMetadata`.
- **Canonicals** — `alternates.canonical` on every indexable page (home `/`, shop, portfolio, blog, about, process, contact, custom-order, faq, privacy, terms) and on each dynamic detail page. `/search` is `robots: { index:false }`; `/whatsapp-order` + `/studio` + `/api` are disallowed in robots.
- **Open Graph image** — `src/app/opengraph-image.tsx` renders a branded 1200×630 card via `next/og` `ImageResponse` (default for any page without its own). Products/blog supply their own OG image (`ogImage`/`coverImage`).
- **JSON-LD** — builders in `src/lib/structured-data.ts`, emitted by `src/components/seo/json-ld.tsx`:
  - `Organization` + `WebSite` (with `SearchAction`) — sitewide via `(public)/layout.tsx`.
  - `Product` + `AggregateOffer` (`availability: MadeToOrder`, INR) + `BreadcrumbList` — product pages.
  - `FAQPage` — `/faq`. `Article` — blog posts.
- **Sitemap** — `src/app/sitemap.ts` (dynamic, resilient): static pages + all published products, shop categories, portfolio, blog posts (with `lastModified`). Backed by `getSitemapEntries` in `src/lib/queries.ts`.
- **robots** — `src/app/robots.ts`: allow `/`, disallow `/studio`, `/api/`, `/whatsapp-order`; points at `/sitemap.xml`.
- **Images** — `next/image` everywhere with correct `sizes`; product gallery main image is `priority` (LCP); below-the-fold media lazy by default; hero video `preload="metadata"`.

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
- [x] Metadata on every route
- [x] OG image renders (`/opengraph-image`)
- [x] Schema types emitted (Organization, WebSite, Product, AggregateOffer, BreadcrumbList, FAQPage, Article)
- [x] `sitemap.ts` + `robots.ts` resolve (`/sitemap.xml`, `/robots.txt`)
- [x] Canonicals on indexable pages; `/search` noindex
- [x] `/studio`, `/api`, `/whatsapp-order` excluded from indexing

## Validation (post-deploy)
1. Visit `https://shop.bhavyagondaliya.co.in/robots.txt` and `/sitemap.xml` — both should resolve.
2. Run a product URL + `/faq` through Google's **Rich Results Test** — confirm Product/Breadcrumb + FAQ parse with no errors.
3. Paste any page URL into the **Facebook Sharing Debugger** / X Card Validator — confirm the OG card image renders.
4. Submit the sitemap in **Google Search Console**; verify `/studio` is not indexed.

> Note: the `MadeToOrder` availability + price range is intentional — ResinRiva has no online checkout; every order is finalised on WhatsApp. The structured data advertises price *guidance*, not a buyable offer.
