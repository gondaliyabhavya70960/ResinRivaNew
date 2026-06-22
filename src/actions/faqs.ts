"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { requireUser, logActivity } from "@/lib/auth-helpers";
import { faqSchema } from "@/lib/validations/studio";
import type { ActionState } from "./state";

export async function saveFaq(
  id: string | null,
  _prev: ActionState,
  fd: FormData,
): Promise<ActionState> {
  const user = await requireUser();
  const parsed = faqSchema.safeParse({
    question: fd.get("question"),
    answer: fd.get("answer"),
    order: fd.get("order") || 0,
  });
  if (!parsed.success) return { fieldErrors: z.flattenError(parsed.error).fieldErrors };

  if (id) await prisma.faq.update({ where: { id }, data: parsed.data });
  else await prisma.faq.create({ data: parsed.data });
  await logActivity(user.id, id ? "update" : "create", "Faq", id ?? undefined);

  revalidatePath("/studio/faqs");
  revalidatePath("/faq");
  redirect("/studio/faqs");
}

export async function deleteFaq(id: string) {
  const user = await requireUser();
  await prisma.faq.delete({ where: { id } });
  await logActivity(user.id, "delete", "Faq", id);
  revalidatePath("/studio/faqs");
}
