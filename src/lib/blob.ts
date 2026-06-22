import "server-only";
import { list, del } from "@vercel/blob";
import { prisma } from "@/lib/db";
import type { MediaType } from "@prisma/client";

const token = process.env.BLOB_READ_WRITE_TOKEN;

/** List blobs under an optional folder prefix (served from Vercel's CDN). */
export async function listBlobs(prefix?: string) {
  return list({ prefix, token });
}

/** Delete a blob by URL and remove its Media row. */
export async function deleteBlobByUrl(url: string) {
  await del(url, { token });
  await prisma.media.deleteMany({ where: { url } });
}

/** Infer a MediaType from a file's content-type / extension. */
export function mediaTypeFor(contentType?: string, pathname?: string): MediaType {
  const ct = contentType ?? "";
  const ext = (pathname ?? "").split(".").pop()?.toLowerCase() ?? "";
  if (ct.startsWith("video") || ["mp4", "webm", "mov"].includes(ext)) return "VIDEO";
  if (["glb", "gltf", "usdz"].includes(ext) || ct.includes("model")) return "MODEL3D";
  if (ct.startsWith("image") || ["jpg", "jpeg", "png", "webp", "avif", "gif", "svg"].includes(ext))
    return "IMAGE";
  return "DOCUMENT";
}
