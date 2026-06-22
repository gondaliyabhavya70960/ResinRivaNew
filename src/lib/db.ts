import { PrismaClient } from "@prisma/client";

// Neon's connection string can include `channel_binding=require`, which some
// Prisma/driver combinations reject. Strip it — TLS stays enforced via sslmode.
export function databaseUrl(): string | undefined {
  const raw = process.env.DATABASE_URL;
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
