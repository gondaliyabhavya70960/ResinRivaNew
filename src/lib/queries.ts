import "server-only";
import { cache } from "react";
import { prisma } from "@/lib/db";
import { siteConfig } from "@/lib/site";
import type { Prisma } from "@prisma/client";

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

/* ── Portfolio ─────────────────────────────────────────── */

export const getPortfolios = cache(async (categorySlug?: string) => {
  try {
    return await prisma.portfolio.findMany({
      where: { status: "PUBLISHED", ...(categorySlug ? { category: { slug: categorySlug } } : {}) },
      orderBy: { createdAt: "desc" },
      include: { images: { orderBy: { order: "asc" }, take: 1 }, category: true },
    });
  } catch {
    return [];
  }
});

export const getPortfolio = cache(async (slug: string) => {
  try {
    return await prisma.portfolio.findFirst({
      where: { slug, status: "PUBLISHED" },
      include: { images: { orderBy: { order: "asc" } }, category: true },
    });
  } catch {
    return null;
  }
});

export const getPortfolioCategories = cache(async () => {
  try {
    return await prisma.category.findMany({
      where: { portfolios: { some: { status: "PUBLISHED" } } },
      orderBy: { order: "asc" },
    });
  } catch {
    return [];
  }
});

/* ── Blog ──────────────────────────────────────────────── */

export const getPosts = cache(
  async (opts: { categorySlug?: string; tagSlug?: string; skip?: number; take?: number }) => {
    const { categorySlug, tagSlug, skip = 0, take = 12 } = opts;
    try {
      const where: Prisma.BlogPostWhereInput = { status: "PUBLISHED" };
      if (categorySlug) where.blogCategory = { slug: categorySlug };
      if (tagSlug) where.tags = { some: { tag: { slug: tagSlug } } };
      const [posts, total] = await Promise.all([
        prisma.blogPost.findMany({
          where,
          orderBy: [{ publishedAt: "desc" }, { createdAt: "desc" }],
          skip,
          take,
          include: { blogCategory: true },
        }),
        prisma.blogPost.count({ where }),
      ]);
      return { posts, total };
    } catch {
      return { posts: [], total: 0 };
    }
  },
);

export const getPost = cache(async (slug: string) => {
  try {
    return await prisma.blogPost.findFirst({
      where: { slug, status: "PUBLISHED" },
      include: { blogCategory: true, tags: { include: { tag: true } } },
    });
  } catch {
    return null;
  }
});

export const getRelatedPosts = cache(
  async (postId: string, categoryId: string | null, take = 3) => {
    try {
      return await prisma.blogPost.findMany({
        where: {
          status: "PUBLISHED",
          NOT: { id: postId },
          ...(categoryId ? { blogCategoryId: categoryId } : {}),
        },
        orderBy: [{ publishedAt: "desc" }, { createdAt: "desc" }],
        take,
        include: { blogCategory: true },
      });
    } catch {
      return [];
    }
  },
);

export const getBlogTaxonomies = cache(async () => {
  try {
    const [categories, tags] = await Promise.all([
      prisma.blogCategory.findMany({
        where: { posts: { some: { status: "PUBLISHED" } } },
        orderBy: { name: "asc" },
      }),
      prisma.tag.findMany({
        where: { posts: { some: { post: { status: "PUBLISHED" } } } },
        orderBy: { name: "asc" },
        take: 30,
      }),
    ]);
    return { categories, tags };
  } catch {
    return { categories: [], tags: [] };
  }
});

/* ── Sitemap ───────────────────────────────────────────── */

export const getSitemapEntries = cache(async () => {
  try {
    const [products, portfolios, posts, categories] = await Promise.all([
      prisma.product.findMany({
        where: { status: "PUBLISHED" },
        select: { slug: true, updatedAt: true },
      }),
      prisma.portfolio.findMany({
        where: { status: "PUBLISHED" },
        select: { slug: true, createdAt: true },
      }),
      prisma.blogPost.findMany({
        where: { status: "PUBLISHED" },
        select: { slug: true, updatedAt: true },
      }),
      prisma.category.findMany({ select: { slug: true, createdAt: true } }),
    ]);
    return { products, portfolios, posts, categories };
  } catch {
    return { products: [], portfolios: [], posts: [], categories: [] };
  }
});

/* ── Search ────────────────────────────────────────────── */

export const searchAll = cache(async (q: string) => {
  const term = q.trim();
  if (!term) return { products: [], posts: [], portfolios: [] };
  try {
    const [products, posts, portfolios] = await Promise.all([
      prisma.product.findMany({
        where: {
          status: "PUBLISHED",
          OR: [
            { title: { contains: term, mode: "insensitive" } },
            { shortTagline: { contains: term, mode: "insensitive" } },
            { description: { contains: term, mode: "insensitive" } },
          ],
        },
        take: 12,
        include: { images: { orderBy: { order: "asc" }, take: 2 }, category: true },
      }),
      prisma.blogPost.findMany({
        where: {
          status: "PUBLISHED",
          OR: [
            { title: { contains: term, mode: "insensitive" } },
            { excerpt: { contains: term, mode: "insensitive" } },
          ],
        },
        take: 12,
        include: { blogCategory: true },
      }),
      prisma.portfolio.findMany({
        where: {
          status: "PUBLISHED",
          OR: [
            { title: { contains: term, mode: "insensitive" } },
            { story: { contains: term, mode: "insensitive" } },
          ],
        },
        take: 12,
        include: { images: { orderBy: { order: "asc" }, take: 1 } },
      }),
    ]);
    return { products, posts, portfolios };
  } catch {
    return { products: [], posts: [], portfolios: [] };
  }
});
