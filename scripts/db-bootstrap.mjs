// Vercel build hook — best-effort DB init that NEVER fails the build.
// Runs `prisma migrate deploy` + `prisma db seed` when DATABASE_URL is present;
// if anything goes wrong (env not ready, transient connection), it logs and
// lets `next build` proceed so the deployment still succeeds. Once the DB env
// is correct, the next deploy will apply the migration + seed.
import { execSync } from "node:child_process";

function tryRun(label, cmd) {
  try {
    console.log(`▶ ${label}…`);
    execSync(cmd, { stdio: "inherit" });
    console.log(`✓ ${label} ok`);
  } catch (e) {
    console.warn(`⚠ ${label} did not complete (continuing build): ${e?.message || e}`);
  }
}

if (process.env.DATABASE_URL) {
  tryRun("prisma migrate deploy", "npx prisma migrate deploy");
  tryRun("prisma db seed", "npx prisma db seed");
} else {
  console.warn("⚠ DATABASE_URL not set — skipping migrate/seed. Set it in Vercel env.");
}
