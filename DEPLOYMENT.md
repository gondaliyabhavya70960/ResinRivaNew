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
**Auto-injected by the Neon + Blob integrations:** `DATABASE_URL` (pooled), `DATABASE_URL_UNPOOLED` (direct — used by `directUrl` for migrations), `BLOB_READ_WRITE_TOKEN`, (`RESEND_API_KEY`).

**Set manually** in Project → Settings → Environment Variables (Production + Preview):

| Var | Value |
| --- | --- |
| `AUTH_SECRET` | a 32-byte secret (`openssl rand -base64 32`) |
| `AUTH_URL` | `https://shop.bhavyagondaliya.co.in` |
| `ADMIN_EMAIL` | `gondaliyabhavya70960@gmail.com` |
| `ADMIN_PASSWORD` | the admin login password (used by the seed) |
| `NEXT_PUBLIC_WHATSAPP_NUMBER` | `917096036250` |
| `NEXT_PUBLIC_SITE_URL` | `https://shop.bhavyagondaliya.co.in` |

> Confirm both `DATABASE_URL` **and** `DATABASE_URL_UNPOOLED` exist (the schema's `directUrl` needs the unpooled one for migrations).

## 4. Database init on deploy (automatic)
The `vercel-build` script runs **`prisma migrate deploy && prisma db seed`** before `next build`, so on Vercel the schema is created and the admin user + sample content are seeded automatically on first deploy. The seed is first-run-guarded, so later deploys don't overwrite admin edits (use `SEED_FORCE=1` to re-run; Phase 11's bulk seed uses this).

> **Why not from the local sandbox?** Claude Code's web sandbox uses a network egress **allowlist** that blocks the Neon (`*.neon.tech`) and Blob (`*.blob.vercel-storage.com`) hosts — so migrate/seed can't run there. Vercel's build network reaches them fine. To run migrate/seed from elsewhere, use a machine with open egress (or add those hosts to the environment's egress settings).

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
