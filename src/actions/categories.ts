"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { requireUser, logActivity } from "@/lib/auth-helpers";
import { categorySchema } from "@/lib/validations/studio";
import type { ActionState } from "./state";

export async function saveCategory(
  id: string | null,
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const user = await requireUser();

  const parsed = categorySchema.safeParse({
    name: formData.get("name"),
    slug: formData.get("slug"),
    description: formData.get("description") || undefined,
    image: formData.get("image") || undefined,
    order: formData.get("order") || 0,
  });
  if (!parsed.success) return { fieldErrors: z.flattenError(parsed.error).fieldErrors };

  try {
    if (id) {
      await prisma.category.update({ where: { id }, data: parsed.data });
      await logActivity(user.id, "update", "Category", id);
    } else {
      const created = await prisma.category.create({ data: parsed.data });
      await logActivity(user.id, "create", "Category", created.id);
    }
  } catch {
    return { error: "Could not save — is the slug already in use?" };
  }

  revalidatePath("/studio/categories");
  revalidatePath("/shop");
  redirect("/studio/categories");
}

export async function deleteCategory(id: string) {
  const user = await requireUser();
  await prisma.category.delete({ where: { id } });
  await logActivity(user.id, "delete", "Category", id);
  revalidatePath("/studio/categories");
}
