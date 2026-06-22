"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { requireUser, logActivity } from "@/lib/auth-helpers";
import { productSchema } from "@/lib/validations/studio";
import type { ActionState } from "./state";
import type { Prisma } from "@prisma/client";

function parseOptions(raw?: string): Prisma.InputJsonValue | undefined {
  if (!raw) return undefined;
  const arr = raw
    .split(/[\n,]/)
    .map((s) => s.trim())
    .filter(Boolean);
  return arr.length ? arr : undefined;
}

function emptyToUndef(v: FormDataEntryValue | null) {
  const s = (v ?? "").toString().trim();
  return s.length ? s : undefined;
}

export async function saveProduct(
  id: string | null,
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const user = await requireUser();

  let images: unknown = [];
  let customFields: unknown = [];
  try {
    images = JSON.parse((formData.get("images") as string) || "[]");
    customFields = JSON.parse((formData.get("customFields") as string) || "[]");
  } catch {
    return { error: "Invalid gallery or customization data." };
  }

  const parsed = productSchema.safeParse({
    title: formData.get("title"),
    slug: formData.get("slug"),
    shortTagline: emptyToUndef(formData.get("shortTagline")),
    description: formData.get("description"),
    priceMin: emptyToUndef(formData.get("priceMin")),
    priceMax: emptyToUndef(formData.get("priceMax")),
    showPrice: formData.get("showPrice") === "on",
    timeline: emptyToUndef(formData.get("timeline")),
    materials: emptyToUndef(formData.get("materials")),
    dimensions: emptyToUndef(formData.get("dimensions")),
    status: formData.get("status") || "DRAFT",
    featured: formData.get("featured") === "on",
    videoUrl: emptyToUndef(formData.get("videoUrl")) ?? "",
    model3dUrl: emptyToUndef(formData.get("model3dUrl")) ?? "",
    categoryId: emptyToUndef(formData.get("categoryId")),
    seoTitle: emptyToUndef(formData.get("seoTitle")),
    seoDescription: emptyToUndef(formData.get("seoDescription")),
    ogImage: emptyToUndef(formData.get("ogImage")),
    images,
    customFields,
  });
  if (!parsed.success) return { fieldErrors: z.flattenError(parsed.error).fieldErrors };

  const d = parsed.data;
  const scalar = {
    title: d.title,
    slug: d.slug,
    shortTagline: d.shortTagline ?? null,
    description: d.description,
    priceMin: d.priceMin ?? null,
    priceMax: d.priceMax ?? null,
    showPrice: d.showPrice,
    timeline: d.timeline ?? null,
    materials: d.materials ?? null,
    dimensions: d.dimensions ?? null,
    status: d.status,
    featured: d.featured,
    videoUrl: d.videoUrl || null,
    model3dUrl: d.model3dUrl || null,
    categoryId: d.categoryId || null,
    seoTitle: d.seoTitle ?? null,
    seoDescription: d.seoDescription ?? null,
    ogImage: d.ogImage ?? null,
  };

  try {
    let productId = id;
    if (id) {
      await prisma.product.update({ where: { id }, data: scalar });
      await prisma.productImage.deleteMany({ where: { productId: id } });
      await prisma.customizationField.deleteMany({ where: { productId: id } });
    } else {
      const created = await prisma.product.create({ data: scalar });
      productId = created.id;
    }

    await prisma.productImage.createMany({
      data: d.images.map((im, i) => ({
        url: im.url,
        alt: im.alt ?? null,
        order: i,
        productId: productId!,
      })),
    });
    await prisma.customizationField.createMany({
      data: d.customFields.map((f, i) => ({
        productId: productId!,
        order: i,
        label: f.label,
        type: f.type,
        required: f.required,
        helpText: f.helpText ?? null,
        options: parseOptions(f.options),
      })),
    });
    await logActivity(user.id, id ? "update" : "create", "Product", productId ?? undefined);
  } catch {
    return { error: "Could not save — is the slug already in use?" };
  }

  revalidatePath("/studio/products");
  revalidatePath("/shop");
  redirect("/studio/products");
}

export async function deleteProduct(id: string) {
  const user = await requireUser();
  await prisma.product.delete({ where: { id } });
  await logActivity(user.id, "delete", "Product", id);
  revalidatePath("/studio/products");
  revalidatePath("/shop");
}

export async function toggleProductStatus(id: string, status: "DRAFT" | "PUBLISHED") {
  await requireUser();
  await prisma.product.update({ where: { id }, data: { status } });
  revalidatePath("/studio/products");
  revalidatePath("/shop");
}
