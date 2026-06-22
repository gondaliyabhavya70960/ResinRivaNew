"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";
import { requireUser, logActivity } from "@/lib/auth-helpers";
import { deleteBlobByUrl, mediaTypeFor } from "@/lib/blob";
import { mediaRecordSchema } from "@/lib/validations/studio";

/** Persist a Media row after a successful client upload to Vercel Blob. */
export async function recordMedia(input: {
  url: string;
  pathname: string;
  contentType?: string;
  bytes?: number;
  folder?: string;
}) {
  await requireUser();
  const type = mediaTypeFor(input.contentType, input.pathname);
  const parsed = mediaRecordSchema.safeParse({
    url: input.url,
    pathname: input.pathname,
    type,
    folder: input.folder,
    bytes: input.bytes,
  });
  if (!parsed.success) return { error: "Invalid media payload" };

  await prisma.media.upsert({
    where: { pathname: parsed.data.pathname },
    update: { url: parsed.data.url, type, bytes: parsed.data.bytes, folder: parsed.data.folder },
    create: parsed.data,
  });
  revalidatePath("/studio/media");
  return { ok: true };
}

export async function deleteMedia(url: string) {
  const user = await requireUser();
  await deleteBlobByUrl(url);
  await logActivity(user.id, "delete", "Media");
  revalidatePath("/studio/media");
}
