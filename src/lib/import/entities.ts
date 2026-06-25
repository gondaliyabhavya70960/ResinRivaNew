import "server-only";
import { z } from "zod";
import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/db";
import {
  productSchema,
  categorySchema,
  portfolioSchema,
  testimonialSchema,
  faqSchema,
  blogCategorySchema,
  blogPostSchema,
  slugify,
} from "@/lib/validations/studio";
import { normKey } from "./csv";
import { mdToTiptap } from "./markdown";
import type { EntityMeta, ImportAction } from "./types";

type Row = Record<string, string>;

const val = (row: Row, name: string) => (row[normKey(name)] ?? "").trim();
const has = (row: Row, name: string) => val(row, name) !== "";

function bool(v: string, dflt: boolean): boolean {
  const s = v.trim().toLowerCase();
  if (s === "") return dflt;
  if (["true", "yes", "y", "1"].includes(s)) return true;
  if (["false", "no", "n", "0"].includes(s)) return false;
  return dflt;
}

function statusVal(v: string): "DRAFT" | "PUBLISHED" {
  const s = v.trim().toUpperCase();
  if (s === "PUBLISHED" || s === "LIVE" || s === "YES") return "PUBLISHED";
  return "DRAFT";
}

/** Split a cell holding several values — by newline or pipe (URLs may contain
 *  commas, so commas are not separators here). */
function splitList(v: string): string[] {
  return v
    .split(/[\n|]+/)
    .map((s) => s.trim())
    .filter(Boolean);
}

function firstError(err: z.ZodError): string {
  const issue = err.issues[0];
  if (!issue) return "Invalid row";
  const path = issue.path.join(".");
  return path ? `${path}: ${issue.message}` : issue.message;
}

export type ImportContext = {
  categories?: Map<string, string>;
  blogCats?: Map<string, string>;
};

export type ImportEntity = EntityMeta & {
  revalidate: string[];
  prepare?: (ctx: ImportContext) => Promise<void>;
  process: (
    row: Row,
    ctx: ImportContext,
    dryRun: boolean,
  ) => Promise<{ action: ImportAction; title: string }>;
};

async function categoryMap(ctx: ImportContext): Promise<Map<string, string>> {
  if (!ctx.categories) {
    const cats = await prisma.category.findMany({ select: { id: true, slug: true, name: true } });
    const map = new Map<string, string>();
    for (const c of cats) {
      map.set(normKey(c.slug), c.id);
      map.set(normKey(c.name), c.id);
    }
    ctx.categories = map;
  }
  return ctx.categories;
}

async function blogCatMap(ctx: ImportContext): Promise<Map<string, string>> {
  if (!ctx.blogCats) {
    const cats = await prisma.blogCategory.findMany({ select: { id: true, slug: true, name: true } });
    const map = new Map<string, string>();
    for (const c of cats) {
      map.set(normKey(c.slug), c.id);
      map.set(normKey(c.name), c.id);
    }
    ctx.blogCats = map;
  }
  return ctx.blogCats;
}

const lookup = (map: Map<string, string>, value: string): string | null =>
  value ? (map.get(normKey(value)) ?? null) : null;

// ── Product ───────────────────────────────────────────────────────────────
const productEntity: ImportEntity = {
  key: "product",
  label: "Products",
  description: "Catalogue items shown in the shop.",
  matchBy: "slug",
  revalidate: ["/shop", "/", "/studio/products"],
  columns: [
    { name: "title", required: true },
    { name: "slug", note: "auto-generated from title if blank" },
    { name: "description", required: true },
    { name: "shortTagline" },
    { name: "category", note: "category name or slug (must already exist)" },
    { name: "priceMin", note: "whole number, ₹" },
    { name: "priceMax", note: "whole number, ₹" },
    { name: "showPrice", note: "true / false (default true)" },
    { name: "status", note: "DRAFT or PUBLISHED (default DRAFT)" },
    { name: "featured", note: "true / false" },
    { name: "timeline" },
    { name: "materials" },
    { name: "dimensions" },
    { name: "images", note: "image URLs, separated by a new line or |" },
    { name: "videoUrl" },
    { name: "seoTitle" },
    { name: "seoDescription" },
  ],
  sample: [
    {
      title: "Ocean Wave Wall Art",
      slug: "ocean-wave-wall-art",
      description: "A hand-poured resin ocean scene with real gold-leaf foam.",
      shortTagline: "Bring the sea home",
      category: "Wall Art",
      priceMin: "8000",
      priceMax: "15000",
      showPrice: "true",
      status: "PUBLISHED",
      featured: "true",
      timeline: "2–3 weeks",
      materials: "Epoxy resin, gold leaf",
      dimensions: "24 x 36 in",
      images: "https://example.com/ocean-1.jpg|https://example.com/ocean-2.jpg",
      videoUrl: "",
      seoTitle: "Ocean Wave Resin Wall Art",
      seoDescription: "Bespoke ocean resin wall art, handmade to order.",
    },
  ],
  prepare: async (ctx) => {
    await categoryMap(ctx);
  },
  process: async (row, ctx, dryRun) => {
    const title = val(row, "title");
    if (!title) throw new Error("Missing title");
    const slug = val(row, "slug") || slugify(title);

    const input: Record<string, unknown> = { title, slug, description: val(row, "description") };
    const opt = (col: string) => {
      if (has(row, col)) input[col] = val(row, col);
    };
    ["shortTagline", "timeline", "materials", "dimensions", "seoTitle", "seoDescription", "ogImage"].forEach(opt);
    if (has(row, "priceMin")) input.priceMin = val(row, "priceMin");
    if (has(row, "priceMax")) input.priceMax = val(row, "priceMax");
    if (has(row, "videoUrl")) input.videoUrl = val(row, "videoUrl");
    if (has(row, "model3dUrl")) input.model3dUrl = val(row, "model3dUrl");
    input.showPrice = bool(val(row, "showPrice"), true);
    input.featured = bool(val(row, "featured"), false);
    input.status = statusVal(val(row, "status"));

    const scalar = productSchema.omit({ images: true, customFields: true, categoryId: true });
    const parsed = scalar.safeParse(input);
    if (!parsed.success) throw new Error(firstError(parsed.error));

    const categoryId = lookup(await categoryMap(ctx), val(row, "category"));
    const imgs = splitList(val(row, "images"));
    const existing = await prisma.product.findUnique({ where: { slug }, select: { id: true } });

    if (!dryRun) {
      const data = {
        ...parsed.data,
        categoryId,
        videoUrl: parsed.data.videoUrl || null,
        model3dUrl: parsed.data.model3dUrl || null,
      };
      if (existing) {
        await prisma.product.update({
          where: { slug },
          data: {
            ...data,
            ...(imgs.length
              ? { images: { deleteMany: {}, create: imgs.map((url, i) => ({ url, order: i })) } }
              : {}),
          },
        });
      } else {
        await prisma.product.create({
          data: {
            ...data,
            ...(imgs.length ? { images: { create: imgs.map((url, i) => ({ url, order: i })) } } : {}),
          },
        });
      }
    }
    return { action: existing ? "update" : "create", title };
  },
};

// ── Category ──────────────────────────────────────────────────────────────
const categoryEntity: ImportEntity = {
  key: "category",
  label: "Categories",
  description: "Shop / portfolio categories.",
  matchBy: "slug",
  revalidate: ["/shop", "/", "/studio/categories"],
  columns: [
    { name: "name", required: true },
    { name: "slug", note: "auto-generated from name if blank" },
    { name: "description" },
    { name: "image", note: "image URL" },
    { name: "order", note: "sort order (number)" },
  ],
  sample: [
    { name: "Wall Art", slug: "wall-art", description: "Resin wall pieces", image: "", order: "1" },
  ],
  process: async (row, _ctx, dryRun) => {
    const name = val(row, "name");
    if (!name) throw new Error("Missing name");
    const slug = val(row, "slug") || slugify(name);
    const input: Record<string, unknown> = { name, slug, order: has(row, "order") ? val(row, "order") : 0 };
    if (has(row, "description")) input.description = val(row, "description");
    if (has(row, "image")) input.image = val(row, "image");
    const parsed = categorySchema.safeParse(input);
    if (!parsed.success) throw new Error(firstError(parsed.error));
    const existing = await prisma.category.findUnique({ where: { slug }, select: { id: true } });
    if (!dryRun) {
      if (existing) await prisma.category.update({ where: { slug }, data: parsed.data });
      else await prisma.category.create({ data: parsed.data });
    }
    return { action: existing ? "update" : "create", title: name };
  },
};

// ── Portfolio ─────────────────────────────────────────────────────────────
const portfolioEntity: ImportEntity = {
  key: "portfolio",
  label: "Portfolio",
  description: "Past commissions / case studies.",
  matchBy: "slug",
  revalidate: ["/portfolio", "/studio/portfolio"],
  columns: [
    { name: "title", required: true },
    { name: "slug", note: "auto-generated from title if blank" },
    { name: "story" },
    { name: "category", note: "category name or slug" },
    { name: "status", note: "DRAFT or PUBLISHED" },
    { name: "beforeImageUrl" },
    { name: "afterImageUrl" },
    { name: "images", note: "image URLs, separated by a new line or |" },
    { name: "videoUrl" },
  ],
  sample: [
    {
      title: "Varmala Preservation — Anita & Raj",
      slug: "varmala-anita-raj",
      story: "We preserved the wedding garlands in a clear resin block.",
      category: "Varmala Preservation",
      status: "PUBLISHED",
      beforeImageUrl: "",
      afterImageUrl: "https://example.com/varmala-after.jpg",
      images: "https://example.com/varmala-1.jpg",
      videoUrl: "",
    },
  ],
  prepare: async (ctx) => {
    await categoryMap(ctx);
  },
  process: async (row, ctx, dryRun) => {
    const title = val(row, "title");
    if (!title) throw new Error("Missing title");
    const slug = val(row, "slug") || slugify(title);
    const input: Record<string, unknown> = { title, slug, status: statusVal(val(row, "status")) };
    ["story", "beforeImageUrl", "afterImageUrl"].forEach((c) => {
      if (has(row, c)) input[c] = val(row, c);
    });
    if (has(row, "videoUrl")) input.videoUrl = val(row, "videoUrl");
    const scalar = portfolioSchema.omit({ images: true, categoryId: true });
    const parsed = scalar.safeParse(input);
    if (!parsed.success) throw new Error(firstError(parsed.error));

    const categoryId = lookup(await categoryMap(ctx), val(row, "category"));
    const imgs = splitList(val(row, "images"));
    const existing = await prisma.portfolio.findUnique({ where: { slug }, select: { id: true } });

    if (!dryRun) {
      const data = { ...parsed.data, categoryId, videoUrl: parsed.data.videoUrl || null };
      if (existing) {
        await prisma.portfolio.update({
          where: { slug },
          data: {
            ...data,
            ...(imgs.length
              ? { images: { deleteMany: {}, create: imgs.map((url, i) => ({ url, order: i })) } }
              : {}),
          },
        });
      } else {
        await prisma.portfolio.create({
          data: {
            ...data,
            ...(imgs.length ? { images: { create: imgs.map((url, i) => ({ url, order: i })) } } : {}),
          },
        });
      }
    }
    return { action: existing ? "update" : "create", title };
  },
};

// ── Blog category ─────────────────────────────────────────────────────────
const blogCategoryEntity: ImportEntity = {
  key: "blogCategory",
  label: "Blog categories",
  description: "Categories used to group journal posts.",
  matchBy: "slug",
  revalidate: ["/blog", "/studio/blog"],
  columns: [
    { name: "name", required: true },
    { name: "slug", note: "auto-generated from name if blank" },
  ],
  sample: [{ name: "Behind the craft", slug: "behind-the-craft" }],
  process: async (row, _ctx, dryRun) => {
    const name = val(row, "name");
    if (!name) throw new Error("Missing name");
    const slug = val(row, "slug") || slugify(name);
    const parsed = blogCategorySchema.safeParse({ name, slug });
    if (!parsed.success) throw new Error(firstError(parsed.error));
    const existing = await prisma.blogCategory.findUnique({ where: { slug }, select: { id: true } });
    if (!dryRun) {
      if (existing) await prisma.blogCategory.update({ where: { slug }, data: parsed.data });
      else await prisma.blogCategory.create({ data: parsed.data });
    }
    return { action: existing ? "update" : "create", title: name };
  },
};

// ── Blog post ─────────────────────────────────────────────────────────────
const blogPostEntity: ImportEntity = {
  key: "blogPost",
  label: "Blog posts",
  description: "Journal articles.",
  matchBy: "slug",
  revalidate: ["/blog", "/studio/blog"],
  columns: [
    { name: "title", required: true },
    { name: "slug", note: "auto-generated from title if blank" },
    { name: "body", required: true, note: "article text — supports ## headings, - bullets, **bold**, [links](url)" },
    { name: "excerpt" },
    { name: "coverImage", note: "image URL" },
    { name: "category", note: "blog category name or slug" },
    { name: "tags", note: "comma-separated" },
    { name: "authorName" },
    { name: "status", note: "DRAFT or PUBLISHED" },
    { name: "publishedAt", note: "date e.g. 2026-06-01 (defaults to now when published)" },
    { name: "seoTitle" },
    { name: "seoDescription" },
  ],
  sample: [
    {
      title: "Why resin keepsakes last a lifetime",
      slug: "why-resin-keepsakes-last",
      body: "## The craft\n\nEvery piece is hand-poured and cured slowly.\n\n## Care\n\n- Keep out of direct sun\n- Dust with a soft cloth",
      excerpt: "A look at what makes resin keepsakes endure.",
      coverImage: "https://example.com/cover.jpg",
      category: "Behind the craft",
      tags: "resin, care, keepsakes",
      authorName: "ResinRiva",
      status: "PUBLISHED",
      publishedAt: "2026-06-01",
      seoTitle: "",
      seoDescription: "",
    },
  ],
  prepare: async (ctx) => {
    await blogCatMap(ctx);
  },
  process: async (row, ctx, dryRun) => {
    const title = val(row, "title");
    if (!title) throw new Error("Missing title");
    const slug = val(row, "slug") || slugify(title);
    const input: Record<string, unknown> = { title, slug, status: statusVal(val(row, "status")) };
    ["excerpt", "coverImage", "authorName", "seoTitle", "seoDescription"].forEach((c) => {
      if (has(row, c)) input[c] = val(row, c);
    });
    const parsed = blogPostSchema.safeParse(input);
    if (!parsed.success) throw new Error(firstError(parsed.error));

    const bodyText = val(row, "body") || val(row, "content");
    if (!bodyText) throw new Error("Missing body");
    const content = mdToTiptap(bodyText);
    const blogCategoryId = lookup(await blogCatMap(ctx), val(row, "category") || val(row, "blogCategory"));

    let publishedAt: Date | null = null;
    if (has(row, "publishedAt")) {
      const d = new Date(val(row, "publishedAt"));
      if (!Number.isNaN(d.getTime())) publishedAt = d;
    } else if (parsed.data.status === "PUBLISHED") {
      publishedAt = new Date();
    }

    const tagNames = val(row, "tags")
      .split(/[,\n|]+/)
      .map((t) => t.trim())
      .filter(Boolean);

    const existing = await prisma.blogPost.findUnique({ where: { slug }, select: { id: true } });

    if (!dryRun) {
      const data = {
        ...parsed.data,
        content: content as Prisma.InputJsonValue,
        blogCategoryId,
        publishedAt,
      };
      const post = existing
        ? await prisma.blogPost.update({ where: { slug }, data })
        : await prisma.blogPost.create({ data });

      if (tagNames.length) {
        const tagIds: string[] = [];
        for (const name of tagNames) {
          const tslug = slugify(name);
          if (!tslug) continue;
          const tag = await prisma.tag.upsert({
            where: { slug: tslug },
            update: {},
            create: { name, slug: tslug },
          });
          tagIds.push(tag.id);
        }
        await prisma.blogPostTag.deleteMany({ where: { postId: post.id } });
        if (tagIds.length) {
          await prisma.blogPostTag.createMany({
            data: tagIds.map((tagId) => ({ postId: post.id, tagId })),
            skipDuplicates: true,
          });
        }
      }
    }
    return { action: existing ? "update" : "create", title };
  },
};

// ── Testimonial ───────────────────────────────────────────────────────────
const testimonialEntity: ImportEntity = {
  key: "testimonial",
  label: "Testimonials",
  description: "Client reviews.",
  matchBy: "name",
  revalidate: ["/", "/studio/testimonials"],
  columns: [
    { name: "name", required: true },
    { name: "quote", required: true },
    { name: "location" },
    { name: "rating", note: "1–5 (default 5)" },
    { name: "avatarUrl", note: "image URL" },
    { name: "order", note: "sort order (number)" },
  ],
  sample: [
    {
      name: "Anita Sharma",
      quote: "The varmala frame is breathtaking — exactly what we dreamed of.",
      location: "Mumbai",
      rating: "5",
      avatarUrl: "",
      order: "1",
    },
  ],
  process: async (row, _ctx, dryRun) => {
    const name = val(row, "name");
    if (!name) throw new Error("Missing name");
    const quote = val(row, "quote");
    if (!quote) throw new Error("Missing quote");
    const input: Record<string, unknown> = {
      name,
      quote,
      rating: has(row, "rating") ? val(row, "rating") : 5,
      order: has(row, "order") ? val(row, "order") : 0,
    };
    if (has(row, "location")) input.location = val(row, "location");
    if (has(row, "avatarUrl")) input.avatarUrl = val(row, "avatarUrl");
    const parsed = testimonialSchema.safeParse(input);
    if (!parsed.success) throw new Error(firstError(parsed.error));
    const existing = await prisma.testimonial.findFirst({ where: { name }, select: { id: true } });
    if (!dryRun) {
      if (existing) await prisma.testimonial.update({ where: { id: existing.id }, data: parsed.data });
      else await prisma.testimonial.create({ data: parsed.data });
    }
    return { action: existing ? "update" : "create", title: name };
  },
};

// ── FAQ ───────────────────────────────────────────────────────────────────
const faqEntity: ImportEntity = {
  key: "faq",
  label: "FAQs",
  description: "Frequently asked questions.",
  matchBy: "question",
  revalidate: ["/faq", "/contact", "/studio/faqs"],
  columns: [
    { name: "question", required: true },
    { name: "answer", required: true },
    { name: "order", note: "sort order (number)" },
  ],
  sample: [
    {
      question: "How do I place an order?",
      answer: "Browse the collection and message us on WhatsApp — we finalise every order there.",
      order: "1",
    },
  ],
  process: async (row, _ctx, dryRun) => {
    const question = val(row, "question");
    if (!question) throw new Error("Missing question");
    const answer = val(row, "answer");
    if (!answer) throw new Error("Missing answer");
    const input = { question, answer, order: has(row, "order") ? val(row, "order") : 0 };
    const parsed = faqSchema.safeParse(input);
    if (!parsed.success) throw new Error(firstError(parsed.error));
    const existing = await prisma.faq.findFirst({ where: { question }, select: { id: true } });
    if (!dryRun) {
      if (existing) await prisma.faq.update({ where: { id: existing.id }, data: parsed.data });
      else await prisma.faq.create({ data: parsed.data });
    }
    return { action: existing ? "update" : "create", title: question };
  },
};

// ── Content page (Privacy, Terms, etc.) ─────────────────────────────────────
const pageEntity: ImportEntity = {
  key: "page",
  label: "Pages (Privacy, Terms…)",
  description: "Editable legal / content pages.",
  matchBy: "slug",
  revalidate: ["/privacy", "/terms", "/studio/import"],
  columns: [
    { name: "slug", required: true, note: "e.g. privacy, terms, shipping" },
    { name: "title", required: true },
    { name: "body", required: true, note: "supports ## headings, - bullets, **bold**, [links](url)" },
  ],
  sample: [
    {
      slug: "shipping",
      title: "Shipping & Returns",
      body: "## Shipping\n\nWe pack carefully and ship pan-India.\n\n## Returns\n\nMade-to-order pieces are non-returnable except for transit damage.",
    },
  ],
  process: async (row, _ctx, dryRun) => {
    const slug = (val(row, "slug") || slugify(val(row, "title"))).toLowerCase();
    if (!slug) throw new Error("Missing slug");
    const title = val(row, "title");
    if (!title) throw new Error("Missing title");
    const body = val(row, "body") || val(row, "content");
    if (!body) throw new Error("Missing body");
    const existing = await prisma.contentPage.findUnique({ where: { slug }, select: { slug: true } });
    if (!dryRun) {
      await prisma.contentPage.upsert({
        where: { slug },
        update: { title, body },
        create: { slug, title, body },
      });
    }
    return { action: existing ? "update" : "create", title };
  },
};

export const ENTITIES: ImportEntity[] = [
  productEntity,
  categoryEntity,
  portfolioEntity,
  blogPostEntity,
  blogCategoryEntity,
  testimonialEntity,
  faqEntity,
  pageEntity,
];

export const ENTITY_BY_KEY: Record<string, ImportEntity> = Object.fromEntries(
  ENTITIES.map((e) => [e.key, e]),
);

/** Serializable subset handed to the client UI. */
export const ENTITY_META: EntityMeta[] = ENTITIES.map((e) => ({
  key: e.key,
  label: e.label,
  description: e.description,
  matchBy: e.matchBy,
  columns: e.columns,
  sample: e.sample,
}));
