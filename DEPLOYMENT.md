# DEPLOYMENT.md — Vercel Deployment

> Status: outline (Phase 1 stub). Completed in Phase 10.

## Overview
Everything runs on **Vercel**: hosting, serverless/API, database (Neon via Marketplace), media (Blob), analytics, and email (Resend via Marketplace) — one dashboard, one bill. Start on the Hobby free tier; upgrade to **Vercel Pro** when commercial.

## 1. Connect the project
```bash
vercel link
```

## 2. Provision Vercel-native services
- **Neon Postgres** — Vercel Dashboard → Storage → Create Database → Neon (Create New Neon Account = native integration). `DATABASE_URL` auto-injected.
- **Vercel Blob** — Storage → Create → Blob. `BLOB_READ_WRITE_TOKEN` auto-injected.
- **Resend** (optional) — Marketplace → Resend. `RESEND_API_KEY` auto-injected.

## 3. Environment variables
- Auto-injected: `DATABASE_URL`, `BLOB_READ_WRITE_TOKEN`, (`RESEND_API_KEY`).
- Set manually in Project → Settings → Environment Variables: `AUTH_SECRET`, `AUTH_URL`, `ADMIN_EMAIL`, `ADMIN_PASSWORD` (for seeding), `NEXT_PUBLIC_WHATSAPP_NUMBER`, `NEXT_PUBLIC_SITE_URL`.

## 4. Database migration in production
- Run migrations against the production branch (`prisma migrate deploy`) and seed the admin user + sample content.

## 5. Deploy
```bash
vercel --prod
```

## 6. Custom domain
- Add `shop.bhavyagondaliya.co.in` in Project → Settings → Domains; configure DNS as instructed.
- Verify `/studio` is reachable and protected in production.

## 7. Analytics
- Enable **Vercel Web Analytics** and **Speed Insights** in the dashboard (one component each in the app).

## Checklist
- [ ] Neon connected, migrated, seeded
- [ ] Blob connected
- [ ] All env vars set for Production + Preview
- [ ] Custom domain live + SSL
- [ ] `/studio` login works in production
- [ ] Analytics + Speed Insights enabled
- [ ] `robots.ts` / `sitemap.ts` resolve

> To be expanded with exact steps and screenshots in Phase 10.
