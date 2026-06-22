import { z } from "zod";

export const slugSchema = z
  .string()
  .min(1, "Required")
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Lowercase letters, numbers and hyphens only");

export const categorySchema = z.object({
  name: z.string().min(1, "Name is required"),
  slug: slugSchema,
  description: z.string().optional(),
  image: z.string().optional(),
  order: z.coerce.number().int().min(0).default(0),
});
export type CategoryInput = z.infer<typeof categorySchema>;

export const fieldTypeEnum = z.enum(["SELECT", "TEXT", "SWATCH", "SIZE", "NUMBER", "FILE"]);

export const customizationFieldSchema = z.object({
  label: z.string().min(1, "Label required"),
  type: fieldTypeEnum,
  options: z.string().optional(), // newline / comma separated in the form
  required: z.boolean().default(false),
  helpText: z.string().optional(),
});

export const productImageSchema = z.object({
  url: z.string().url(),
  alt: z.string().optional(),
});

export const productSchema = z.object({
  title: z.string().min(1, "Title is required"),
  slug: slugSchema,
  shortTagline: z.string().optional(),
  description: z.string().min(1, "Description is required"),
  priceMin: z.coerce.number().int().min(0).optional(),
  priceMax: z.coerce.number().int().min(0).optional(),
  showPrice: z.boolean().default(true),
  timeline: z.string().optional(),
  materials: z.string().optional(),
  dimensions: z.string().optional(),
  status: z.enum(["DRAFT", "PUBLISHED"]).default("DRAFT"),
  featured: z.boolean().default(false),
  videoUrl: z.string().url().optional().or(z.literal("")),
  model3dUrl: z.string().url().optional().or(z.literal("")),
  categoryId: z.string().optional(),
  seoTitle: z.string().optional(),
  seoDescription: z.string().optional(),
  ogImage: z.string().optional(),
  images: z.array(productImageSchema).default([]),
  customFields: z.array(customizationFieldSchema).default([]),
});
export type ProductInput = z.infer<typeof productSchema>;

export const mediaRecordSchema = z.object({
  url: z.string().url(),
  pathname: z.string().min(1),
  type: z.enum(["IMAGE", "VIDEO", "DOCUMENT", "MODEL3D"]),
  folder: z.string().optional(),
  bytes: z.coerce.number().int().optional(),
});

/** Turn a slug-friendly string from any text. */
export function slugify(input: string) {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}
