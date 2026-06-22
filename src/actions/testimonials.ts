"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { requireUser, logActivity } from "@/lib/auth-helpers";
import { testimonialSchema } from "@/lib/validations/studio";
import type { ActionState } from "./state";

export async function saveTestimonial(
  id: string | null,
  _prev: ActionState,
  fd: FormData,
): Promise<ActionState> {
  const user = await requireUser();
  const parsed = testimonialSchema.safeParse({
    name: fd.get("name"),
    location: fd.get("location") || undefined,
    quote: fd.get("quote"),
    rating: fd.get("rating") || 5,
    avatarUrl: fd.get("avatarUrl") || undefined,
    order: fd.get("order") || 0,
  });
  if (!parsed.success) return { fieldErrors: z.flattenError(parsed.error).fieldErrors };

  if (id) await prisma.testimonial.update({ where: { id }, data: parsed.data });
  else await prisma.testimonial.create({ data: parsed.data });
  await logActivity(user.id, id ? "update" : "create", "Testimonial", id ?? undefined);

  revalidatePath("/studio/testimonials");
  revalidatePath("/");
  redirect("/studio/testimonials");
}

export async function deleteTestimonial(id: string) {
  const user = await requireUser();
  await prisma.testimonial.delete({ where: { id } });
  await logActivity(user.id, "delete", "Testimonial", id);
  revalidatePath("/studio/testimonials");
}
