"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { requireUser, logActivity } from "@/lib/auth-helpers";
import { portfolioSchema } from "@/lib/validations/studio";
import type { ActionState } from "./state";
import type { Prisma } from "@prisma/client";

function emptyToUndef(v: FormDataEntryValue | null) {
  const s = (v ?? "").toString().trim();
  return s.length ? s : undefined;
}

export async function savePortfolio(
  id: string | null,
  _prev: ActionState,
  fd: FormData,
): Promise<ActionState> {
  const user = await requireUser();

  let images: unknown = [];
  let resultsMeta: unknown[] = [];
  try {
    images = JSON.parse((fd.get("images") as string) || "[]");
    resultsMeta = JSON.parse((fd.get("resultsMeta") as string) || "[]");
  } catch {
    return { error: "Invalid gallery or results data." };
  }

  const parsed = portfolioSchema.safeParse({
    title: fd.get("title"),
    slug: fd.get("slug"),
    story: emptyToUndef(fd.get("story")),
    beforeImageUrl: emptyToUndef(fd.get("beforeImageUrl")),
    afterImageUrl: emptyToUndef(fd.get("afterImageUrl")),
    videoUrl: emptyToUndef(fd.get("videoUrl")) ?? "",
    categoryId: emptyToUndef(fd.get("categoryId")),
    status: fd.get("status") || "DRAFT",
    images,
  });
  if (!parsed.success) return { fieldErrors: z.flattenError(parsed.error).fieldErrors };

  const d = parsed.data;
  const scalar = {
    title: d.title,
    slug: d.slug,
    story: d.story ?? null,
    beforeImageUrl: d.beforeImageUrl ?? null,
    afterImageUrl: d.afterImageUrl ?? null,
    videoUrl: d.videoUrl || null,
    categoryId: d.categoryId || null,
    status: d.status,
    resultsMeta: resultsMeta.length ? (resultsMeta as Prisma.InputJsonValue) : undefined,
  };

  try {
    let pid = id;
    if (id) {
      await prisma.portfolio.update({ where: { id }, data: scalar });
      await prisma.portfolioImage.deleteMany({ where: { portfolioId: id } });
    } else {
      const created = await prisma.portfolio.create({ data: scalar });
      pid = created.id;
    }
    await prisma.portfolioImage.createMany({
      data: d.images.map((im, i) => ({ url: im.url, alt: im.alt ?? null, order: i, portfolioId: pid! })),
    });
    await logActivity(user.id, id ? "update" : "create", "Portfolio", pid ?? undefined);
  } catch {
    return { error: "Could not save — is the slug already in use?" };
  }

  revalidatePath("/studio/portfolio");
  revalidatePath("/portfolio");
  redirect("/studio/portfolio");
}

export async function deletePortfolio(id: string) {
  const user = await requireUser();
  await prisma.portfolio.delete({ where: { id } });
  await logActivity(user.id, "delete", "Portfolio", id);
  revalidatePath("/studio/portfolio");
  revalidatePath("/portfolio");
}
