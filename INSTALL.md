# INSTALL.md — Local Setup

> Status: outline (Phase 1 stub). Filled in across Phases 2–3 as the app is scaffolded.

## Prerequisites
- Node.js 20+ and npm
- A Vercel account (for `vercel` CLI, Neon, and Blob)
- Git
- `vercel` CLI: `npm i -g vercel`

## 1. Clone
```bash
git clone https://github.com/gondaliyabhavya70960/ResinRivaNew.git
cd ResinRivaNew
```

## 2. Install dependencies
```bash
npm install
```
_(Available after the Phase 2 scaffold.)_

## 3. Environment variables
- Copy `.env.example` → `.env.local`.
- Link the project, then pull Vercel-injected vars:
```bash
vercel link
vercel env pull .env.local
```
- `DATABASE_URL` (Neon) and `BLOB_READ_WRITE_TOKEN` (Blob) are auto-injected once those stores are connected in the Vercel dashboard.
- Set `AUTH_SECRET` (`openssl rand -base64 32`) and `ADMIN_PASSWORD` (seed only).

## 4. Database (after Phase 3)
```bash
npx prisma generate
npx prisma migrate dev
npx prisma db seed
```

## 5. Run the dev server
```bash
npm run dev
# http://localhost:3000  ·  admin: http://localhost:3000/studio
```

## Troubleshooting
- _Neon cold start_: first request after idle may be slow (scale-to-zero) — normal.
- _Missing env_: re-run `vercel env pull .env.local`.
- _Prisma client errors_: re-run `npx prisma generate`.

> To be expanded with exact dependency versions and scripts in Phase 2.
