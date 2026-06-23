// Vercel build hook — best-effort DB init that NEVER fails the build.
// Runs `prisma migrate deploy` + seeds when DATABASE_URL is present; if anything
// goes wrong it logs and lets `next build` proceed so the deployment still
// succeeds. A final verify() prints a clear DB status line so you can confirm
// (in the build logs) whether the admin user exists.
import { execSync } from "node:child_process";

// Neon appends `channel_binding=require` to its connection strings, which the
// Prisma CLI can reject during `migrate deploy`. Strip it from the URLs we hand
// to the child processes (the runtime client strips it separately in db.ts).
function cleanUrl(u) {
  return u ? u.replace(/channel_binding=[^&]*&?/gi, "").replace(/[?&]$/, "") : u;
}

const childEnv = { ...process.env };
if (childEnv.DATABASE_URL) childEnv.DATABASE_URL = cleanUrl(childEnv.DATABASE_URL);
if (childEnv.DATABASE_URL_UNPOOLED) childEnv.DATABASE_URL_UNPOOLED = cleanUrl(childEnv.DATABASE_URL_UNPOOLED);

function tryRun(label, cmd) {
  try {
    console.log(`▶ ${label}…`);
    execSync(cmd, { stdio: "inherit", env: childEnv });
    console.log(`✓ ${label} ok`);
  } catch (e) {
    console.warn(`⚠ ${label} did NOT complete (continuing build): ${e?.message || e}`);
  }
}

// Reachability + admin check — prints an unmistakable status line.
async function verify() {
  try {
    const { PrismaClient } = await import("@prisma/client");
    const prisma = new PrismaClient(
      childEnv.DATABASE_URL ? { datasourceUrl: childEnv.DATABASE_URL } : undefined,
    );
    const [admin, products] = await Promise.all([
      prisma.user.findFirst({ where: { role: "ADMIN" }, select: { email: true } }),
      prisma.product.count(),
    ]);
    if (admin) {
      console.log(`✅ DB READY — admin present: ${admin.email} · products: ${products}`);
    } else {
      console.warn("⚠ DB reachable but NO admin user — set ADMIN_PASSWORD (Production) and redeploy with SEED_FORCE=1.");
    }
    await prisma.$disconnect();
  } catch (e) {
    console.warn(`❌ DB verify FAILED — tables may not exist / connection refused: ${e?.message || e}`);
  }
}

async function main() {
  if (!process.env.DATABASE_URL) {
    console.warn("⚠ DATABASE_URL not set — skipping migrate/seed. Set it in Vercel env (Production).");
    return;
  }
  console.log("──────── ResinRiva DB bootstrap ────────");
  tryRun("prisma migrate deploy", "npx prisma migrate deploy");
  tryRun("prisma db seed", "npx prisma db seed");
  // Phase 11 bulk catalogue + journal — idempotent + first-run-guarded.
  tryRun("bulk content seed", "npx tsx prisma/seed-content.ts");
  // Locked out? Set ADMIN_PASSWORD + RESET_ADMIN=1 (Production) and redeploy to
  // reset just the admin password (content untouched). Remove RESET_ADMIN after.
  if (process.env.RESET_ADMIN === "1") {
    tryRun("reset admin password", "npx tsx prisma/reset-admin.ts");
  }
  await verify();
  console.log("──────── DB bootstrap done ────────");
}

await main();
