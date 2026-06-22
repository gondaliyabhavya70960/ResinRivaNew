# BACKUP_GUIDE.md — Backup & Recovery

> Status: outline (Phase 1 stub). Finalized in Phase 10.

## What to back up
1. **Database (Neon Postgres)** — products, inquiries, blog, settings, etc.
2. **Media (Vercel Blob)** — images, video, 3D files.
3. **Code (Git/GitHub)** — the repository itself.

## Database — Neon Point-in-Time Recovery (PITR)
- Neon keeps a history window enabling restore to any point in time (branch-based).
- To recover: create a branch from a past timestamp in the Neon console (via Vercel Storage), verify data, then promote/repoint `DATABASE_URL`.
- Optional manual dump: `pg_dump "$DATABASE_URL" > backup_$(date +%F).sql`.

## Media — Vercel Blob inventory
- List/export the Blob inventory periodically (`@vercel/blob` `list()` or dashboard) and keep a copy of important originals off-platform.
- The `Media` table stores `pathname` for each Blob asset — use it to reconcile/restore references.

## Code — Git
- All code lives in GitHub. Tag releases; protect the main branch. The repo is the source of truth for application code.

## Recommended cadence
- DB: rely on Neon PITR; take a monthly manual `pg_dump`.
- Blob: quarterly inventory export; keep original product photos in cloud storage.
- Code: every change committed + pushed.

## Recovery drills
- Periodically test restoring a Neon branch into a Preview deployment to confirm the process.

> To be expanded with exact commands and console steps in Phase 10.
