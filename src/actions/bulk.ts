"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";
import { requireUser, requireAdmin, logActivity } from "@/lib/auth-helpers";
import { deleteBlobByUrl } from "@/lib/blob";

export type BulkDeleteResult = { ok: boolean; deleted: number; error?: string };

/** Pages to revalidate after deleting each entity type. */
const REVALIDATE: Record<string, string[]> = {
  product: ["/studio/products", "/shop", "/"],
  category: ["/studio/categories", "/shop", "/"],
  portfolio: ["/studio/portfolio", "/portfolio"],
  blogPost: ["/studio/blog", "/blog"],
  testimonial: ["/studio/testimonials", "/"],
  faq: ["/studio/faqs", "/faq", "/contact"],
  inquiry: ["/studio/inquiries"],
  media: ["/studio/media"],
  user: ["/studio/users"],
};

/**
 * Delete many records of one entity at once. `keys` are record ids — except for
 * `media`, where they are blob URLs (so the Blob file is removed too). Users are
 * admin-only and you can never delete yourself.
 */
export async function bulkDelete(entity: string, keys: string[]): Promise<BulkDeleteResult> {
  const ids = Array.from(new Set((keys ?? []).filter(Boolean)));
  if (!ids.length) return { ok: false, deleted: 0, error: "Nothing selected." };

  try {
    if (entity === "user") {
      const admin = await requireAdmin();
      const targets = ids.filter((id) => id !== admin.id);
      const res = await prisma.user.deleteMany({ where: { id: { in: targets } } });
      await logActivity(admin.id, "bulk-delete", "User");
      revalidatePath("/studio/users");
      return { ok: true, deleted: res.count };
    }

    const user = await requireUser();
    let deleted = 0;

    switch (entity) {
      case "product":
        deleted = (await prisma.product.deleteMany({ where: { id: { in: ids } } })).count;
        break;
      case "category":
        deleted = (await prisma.category.deleteMany({ where: { id: { in: ids } } })).count;
        break;
      case "portfolio":
        deleted = (await prisma.portfolio.deleteMany({ where: { id: { in: ids } } })).count;
        break;
      case "blogPost":
        deleted = (await prisma.blogPost.deleteMany({ where: { id: { in: ids } } })).count;
        break;
      case "testimonial":
        deleted = (await prisma.testimonial.deleteMany({ where: { id: { in: ids } } })).count;
        break;
      case "faq":
        deleted = (await prisma.faq.deleteMany({ where: { id: { in: ids } } })).count;
        break;
      case "inquiry":
        deleted = (await prisma.inquiry.deleteMany({ where: { id: { in: ids } } })).count;
        break;
      case "media":
        for (const url of ids) {
          try {
            await deleteBlobByUrl(url);
            deleted++;
          } catch {
            // skip files that fail to delete; keep going
          }
        }
        break;
      default:
        return { ok: false, deleted: 0, error: "Unknown type." };
    }

    await logActivity(user.id, "bulk-delete", entity);
    for (const path of REVALIDATE[entity] ?? []) {
      try {
        revalidatePath(path);
      } catch {
        // ignore dynamic-route revalidation quirks
      }
    }
    return { ok: true, deleted };
  } catch (e) {
    return { ok: false, deleted: 0, error: e instanceof Error ? e.message : "Delete failed." };
  }
}
