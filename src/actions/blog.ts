"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { requireUser, logActivity } from "@/lib/auth-helpers";
import { blogPostSchema, blogCategorySchema, slugify } from "@/lib/validations/studio";
import type { ActionState } from "./state";
import type { Prisma } from "@prisma/client";

function emptyToUndef(v: FormDataEntryValue | null) {
  const s = (v ?? "").toString().trim();
  return s.length ? s : undefined;
}

export async function saveBlogPost(
  id: string | null,
  _prev: ActionState,
  fd: FormData,
): Promise<ActionState> {
  const user = await requireUser();

  let content: unknown;
  try {
    content = JSON.parse((fd.get("content") as string) || '{"type":"doc","content":[]}');
  } catch {
    return { error: "Invalid post content." };
  }

  const parsed = blogPostSchema.safeParse({
    title: fd.get("title"),
    slug: fd.get("slug"),
    excerpt: emptyToUndef(fd.get("excerpt")),
    coverImage: emptyToUndef(fd.get("coverImage")),
    authorName: emptyToUndef(fd.get("authorName")),
    blogCategoryId: emptyToUndef(fd.get("blogCategoryId")),
    status: fd.get("status") || "DRAFT",
    seoTitle: emptyToUndef(fd.get("seoTitle")),
    seoDescription: emptyToUndef(fd.get("seoDescription")),
  });
  if (!parsed.success) return { fieldErrors: z.flattenError(parsed.error).fieldErrors };

  const d = parsed.data;
  const publishedAtRaw = emptyToUndef(fd.get("publishedAt"));
  const publishedAt = publishedAtRaw
    ? new Date(publishedAtRaw)
    : d.status === "PUBLISHED"
      ? new Date()
      : null;

  const tagNames = (emptyToUndef(fd.get("tags")) ?? "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
  const tagIds: string[] = [];
  for (const name of tagNames) {
    const slug = slugify(name);
    const tag = await prisma.tag.upsert({ where: { slug }, update: { name }, create: { name, slug } });
    tagIds.push(tag.id);
  }

  const scalar = {
    title: d.title,
    slug: d.slug,
    excerpt: d.excerpt ?? null,
    content: content as Prisma.InputJsonValue,
    coverImage: d.coverImage ?? null,
    authorName: d.authorName ?? null,
    blogCategoryId: d.blogCategoryId || null,
    status: d.status,
    publishedAt,
    seoTitle: d.seoTitle ?? null,
    seoDescription: d.seoDescription ?? null,
  };

  try {
    let postId = id;
    if (id) {
      await prisma.blogPost.update({ where: { id }, data: scalar });
      await prisma.blogPostTag.deleteMany({ where: { postId: id } });
    } else {
      const created = await prisma.blogPost.create({ data: scalar });
      postId = created.id;
    }
    if (tagIds.length) {
      await prisma.blogPostTag.createMany({
        data: tagIds.map((tagId) => ({ postId: postId!, tagId })),
        skipDuplicates: true,
      });
    }
    await logActivity(user.id, id ? "update" : "create", "BlogPost", postId ?? undefined);
  } catch {
    return { error: "Could not save — is the slug already in use?" };
  }

  revalidatePath("/studio/blog");
  revalidatePath("/blog");
  redirect("/studio/blog");
}

export async function deleteBlogPost(id: string) {
  const user = await requireUser();
  await prisma.blogPost.delete({ where: { id } });
  await logActivity(user.id, "delete", "BlogPost", id);
  revalidatePath("/studio/blog");
  revalidatePath("/blog");
}

export async function saveBlogCategory(
  id: string | null,
  _prev: ActionState,
  fd: FormData,
): Promise<ActionState> {
  await requireUser();
  const parsed = blogCategorySchema.safeParse({ name: fd.get("name"), slug: fd.get("slug") });
  if (!parsed.success) return { fieldErrors: z.flattenError(parsed.error).fieldErrors };
  try {
    if (id) await prisma.blogCategory.update({ where: { id }, data: parsed.data });
    else await prisma.blogCategory.create({ data: parsed.data });
  } catch {
    return { error: "Could not save — is the slug already in use?" };
  }
  revalidatePath("/studio/blog");
  redirect("/studio/blog");
}

export async function deleteBlogCategory(id: string) {
  await requireUser();
  await prisma.blogCategory.delete({ where: { id } });
  revalidatePath("/studio/blog");
}
