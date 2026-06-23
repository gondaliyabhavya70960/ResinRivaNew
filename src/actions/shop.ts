"use server";

import { prisma } from "@/lib/db";
import type { Prisma } from "@prisma/client";

export type ShopFilters = { category?: string; sort?: string; q?: string };

export type ShopProduct = {
  id: string;
  slug: string;
  title: string;
  shortTagline: string | null;
  priceMin: number | null;
  priceMax: number | null;
  showPrice: boolean;
  category: { name: string } | null;
  images: { url: string; alt: string | null }[];
};

const PAGE_SIZE = 12;

function buildWhere(f: ShopFilters): Prisma.ProductWhereInput {
  const where: Prisma.ProductWhereInput = { status: "PUBLISHED" };
  if (f.category) where.category = { slug: f.category };
  if (f.q) {
    where.OR = [
      { title: { contains: f.q, mode: "insensitive" } },
      { shortTagline: { contains: f.q, mode: "insensitive" } },
      { description: { contains: f.q, mode: "insensitive" } },
    ];
  }
  return where;
}

function buildOrderBy(sort?: string): Prisma.ProductOrderByWithRelationInput {
  switch (sort) {
    case "price-asc":
      return { priceMin: "asc" };
    case "price-desc":
      return { priceMax: "desc" };
    case "featured":
      return { featured: "desc" };
    default:
      return { createdAt: "desc" };
  }
}

function toShopProduct(p: {
  id: string;
  slug: string;
  title: string;
  shortTagline: string | null;
  priceMin: number | null;
  priceMax: number | null;
  showPrice: boolean;
  category: { name: string } | null;
  images: { url: string; alt: string | null }[];
}): ShopProduct {
  return {
    id: p.id,
    slug: p.slug,
    title: p.title,
    shortTagline: p.shortTagline,
    priceMin: p.priceMin,
    priceMax: p.priceMax,
    showPrice: p.showPrice,
    category: p.category ? { name: p.category.name } : null,
    images: p.images.map((i) => ({ url: i.url, alt: i.alt })),
  };
}

export async function fetchProducts(f: ShopFilters, skip: number): Promise<ShopProduct[]> {
  try {
    const rows = await prisma.product.findMany({
      where: buildWhere(f),
      orderBy: buildOrderBy(f.sort),
      skip,
      take: PAGE_SIZE,
      include: { images: { orderBy: { order: "asc" }, take: 2 }, category: true },
    });
    return rows.map(toShopProduct);
  } catch {
    return [];
  }
}

export async function countProducts(f: ShopFilters): Promise<number> {
  try {
    return await prisma.product.count({ where: buildWhere(f) });
  } catch {
    return 0;
  }
}
