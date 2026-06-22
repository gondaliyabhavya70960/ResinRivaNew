"use server";

import { z } from "zod";
import bcrypt from "bcryptjs";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";
import { requireAdmin, logActivity } from "@/lib/auth-helpers";
import { userSchema } from "@/lib/validations/studio";
import type { ActionState } from "./state";

export async function createUser(_prev: ActionState, fd: FormData): Promise<ActionState> {
  const admin = await requireAdmin();
  const parsed = userSchema.safeParse({
    name: fd.get("name") || undefined,
    email: fd.get("email"),
    role: fd.get("role") || "EDITOR",
  });
  if (!parsed.success) return { fieldErrors: z.flattenError(parsed.error).fieldErrors };

  const password = (fd.get("password") || "").toString();
  if (password.length < 6) return { fieldErrors: { password: ["At least 6 characters"] } };

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    await prisma.user.create({
      data: {
        name: parsed.data.name ?? null,
        email: parsed.data.email,
        role: parsed.data.role,
        hashedPassword,
      },
    });
    await logActivity(admin.id, "create", "User");
  } catch {
    return { error: "That email is already in use." };
  }

  revalidatePath("/studio/users");
  return { ok: true };
}

export async function updateUserRole(id: string, role: "ADMIN" | "EDITOR") {
  await requireAdmin();
  await prisma.user.update({ where: { id }, data: { role } });
  revalidatePath("/studio/users");
}

export async function deleteUser(id: string) {
  const admin = await requireAdmin();
  if (admin.id === id) return; // never delete yourself
  await prisma.user.delete({ where: { id } });
  await logActivity(admin.id, "delete", "User", id);
  revalidatePath("/studio/users");
}
