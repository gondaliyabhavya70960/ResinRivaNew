import "server-only";
import { cache } from "react";
import { prisma } from "@/lib/db";
import { siteConfig } from "@/lib/site";

/** All public reads are wrapped so an empty/unreachable DB renders gracefully. */

export const getSettings = cache(async () => {
  try {
    return await prisma.siteSettings.findUnique({ where: { id: "singleton" } });
  } catch {
    return null;
  }
});

export type SiteData = {
  brandName: string;
  tagline: string;
  announcement: string;
  phone: string;
  phoneTel: string;
  whatsapp: string;
  email: string;
  mapsUrl: string;
  address: string;
  heroVideoUrl: string | null;
  socials: { instagram: string; facebook: string; youtube: string };
};

function asRecord(v: unknown): Record<string, string> {
  return v && typeof v === "object" ? (v as Record<string, string>) : {};
}

/** Resolved site settings, merged with the static siteConfig fallback. */
export const getSiteData = cache(async (): Promise<SiteData> => {
  const s = await getSettings();
  const socials = asRecord(s?.socials);
  const phone = s?.phone ?? siteConfig.phone;
  return {
    brandName: s?.brandName ?? siteConfig.name,
    tagline: s?.tagline ?? siteConfig.tagline,
    announcement: s?.announcement ?? siteConfig.announcement,
    phone,
    phoneTel: phone.replace(/[^0-9+]/g, ""),
    whatsapp: s?.whatsappNumber ?? siteConfig.whatsapp,
    email: s?.email ?? siteConfig.email,
    mapsUrl: s?.mapsUrl ?? siteConfig.mapsUrl,
    address: s?.address ?? siteConfig.address,
    heroVideoUrl: s?.heroVideoUrl ?? null,
    socials: {
      instagram: socials.instagram || siteConfig.socials.instagram,
      facebook: socials.facebook || siteConfig.socials.facebook,
      youtube: socials.youtube || "",
    },
  };
});

export const getFeaturedProducts = cache(async (take = 8) => {
  try {
    return await prisma.product.findMany({
      where: { status: "PUBLISHED", featured: true },
      include: { images: { orderBy: { order: "asc" }, take: 2 }, category: true },
      orderBy: { updatedAt: "desc" },
      take,
    });
  } catch {
    return [];
  }
});

export const getTestimonials = cache(async () => {
  try {
    return await prisma.testimonial.findMany({ orderBy: { order: "asc" } });
  } catch {
    return [];
  }
});

export const getBlogHighlights = cache(async (take = 3) => {
  try {
    return await prisma.blogPost.findMany({
      where: { status: "PUBLISHED" },
      orderBy: [{ publishedAt: "desc" }, { createdAt: "desc" }],
      take,
      include: { blogCategory: true },
    });
  } catch {
    return [];
  }
});

export const getPortfolioHighlights = cache(async (take = 4) => {
  try {
    return await prisma.portfolio.findMany({
      where: { status: "PUBLISHED" },
      orderBy: { createdAt: "desc" },
      take,
      include: { images: { orderBy: { order: "asc" }, take: 1 } },
    });
  } catch {
    return [];
  }
});

export const getFaqs = cache(async () => {
  try {
    return await prisma.faq.findMany({ orderBy: { order: "asc" } });
  } catch {
    return [];
  }
});

export const getHomeStats = cache(async () => {
  try {
    const [products, portfolio, posts] = await Promise.all([
      prisma.product.count({ where: { status: "PUBLISHED" } }),
      prisma.portfolio.count({ where: { status: "PUBLISHED" } }),
      prisma.blogPost.count({ where: { status: "PUBLISHED" } }),
    ]);
    return { products, portfolio, posts };
  } catch {
    return { products: 0, portfolio: 0, posts: 0 };
  }
});
