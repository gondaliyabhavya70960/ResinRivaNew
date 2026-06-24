import { PrismaClient } from "@prisma/client";

// Resolve the database URL from whichever env var the host provides — Vercel's
// Postgres/Neon/Prisma Postgres integrations use different names. Also strip
// Neon's `channel_binding=require`, which some Prisma/driver combos reject
// (TLS stays enforced via sslmode).
export function databaseUrl(): string | undefined {
  const raw =
    process.env.DATABASE_URL ||
    process.env.POSTGRES_URL ||
    process.env.PRISMA_DATABASE_URL ||
    process.env.POSTGRES_PRISMA_URL;
  if (!raw) return undefined;
  return raw.replace(/channel_binding=[^&]*&?/gi, "").replace(/[?&]$/, "");
}

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };
const url = databaseUrl();

/** Prisma singleton — avoids exhausting connections in dev hot-reload. */
export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    ...(url ? { datasourceUrl: url } : {}),
    log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
