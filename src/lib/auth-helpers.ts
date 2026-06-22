import "server-only";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";

/** Returns the current session user or null. */
export async function getSessionUser() {
  const session = await auth();
  return session?.user ?? null;
}

/** Require any signed-in studio user; redirect to login otherwise. */
export async function requireUser() {
  const user = await getSessionUser();
  if (!user) redirect("/studio/login");
  return user;
}

/** Require an ADMIN role (EDITOR is rejected). */
export async function requireAdmin() {
  const user = await requireUser();
  if (user.role !== "ADMIN") redirect("/studio");
  return user;
}

/** Best-effort activity log (never throws into the caller). */
export async function logActivity(
  userId: string | undefined,
  action: string,
  entity: string,
  entityId?: string,
) {
  try {
    await prisma.activityLog.create({ data: { userId, action, entity, entityId } });
  } catch {
    // non-critical
  }
}
