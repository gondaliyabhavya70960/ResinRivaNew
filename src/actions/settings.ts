"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";
import { requireUser, logActivity } from "@/lib/auth-helpers";
import type { ActionState } from "./state";

export async function saveSettings(_prev: ActionState, fd: FormData): Promise<ActionState> {
  const user = await requireUser();
  const str = (k: string) => fd.get(k)?.toString().trim() || null;

  const data = {
    brandName: str("brandName") ?? "ResinRiva",
    tagline: str("tagline"),
    logoUrl: str("logoUrl"),
    heroVideoUrl: str("heroVideoUrl"),
    announcement: str("announcement"),
    phone: str("phone"),
    whatsappNumber: str("whatsappNumber"),
    email: str("email"),
    mapsUrl: str("mapsUrl"),
    address: str("address"),
    socials: {
      instagram: str("instagram") ?? "",
      facebook: str("facebook") ?? "",
      youtube: str("youtube") ?? "",
    },
    defaultSeo: {
      title: str("seoTitle") ?? "",
      description: str("seoDescription") ?? "",
      ogImage: str("ogImage") ?? "",
    },
  };

  await prisma.siteSettings.upsert({
    where: { id: "singleton" },
    update: data,
    create: { id: "singleton", ...data },
  });
  await logActivity(user.id, "update", "SiteSettings", "singleton");
  revalidatePath("/", "layout");
  return { ok: true };
}
