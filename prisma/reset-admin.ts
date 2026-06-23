/**
 * Safe admin password reset — updates ONLY the admin user's password (and
 * ensures the ADMIN role), without touching any catalogue, blog or settings
 * content. Use this when you're locked out of /studio.
 *
 * How to run on Vercel (no local setup needed):
 *   1. Project → Settings → Environment Variables:
 *        ADMIN_PASSWORD = <the password you want>
 *        RESET_ADMIN    = 1
 *   2. Redeploy. On build, `db-bootstrap.mjs` runs this and updates the admin.
 *   3. Sign in at /studio/login, then DELETE the RESET_ADMIN var and redeploy.
 *
 * Locally (open-egress machine):  ADMIN_PASSWORD=... npm run db:reset-admin
 */
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const dbUrl = process.env.DATABASE_URL?.replace(/channel_binding=[^&]*&?/gi, "").replace(/[?&]$/, "");
const prisma = new PrismaClient(dbUrl ? { datasourceUrl: dbUrl } : undefined);

async function main() {
  const email = (process.env.ADMIN_EMAIL ?? "gondaliyabhavya70960@gmail.com").trim();
  const password = process.env.ADMIN_PASSWORD;
  if (!password) {
    console.error("✖ ADMIN_PASSWORD is not set — cannot reset admin. Set it in env and retry.");
    process.exit(1);
  }
  const hashedPassword = await bcrypt.hash(password, 10);
  const user = await prisma.user.upsert({
    where: { email },
    update: { hashedPassword, role: "ADMIN" },
    create: { email, name: "ResinRiva Admin", hashedPassword, role: "ADMIN" },
  });
  console.log(`✅ Admin password reset for ${user.email} (role ${user.role}). You can now sign in at /studio/login.`);
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
