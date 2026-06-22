import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { ProductForm } from "@/components/studio/product-form";

export const dynamic = "force-dynamic";

export default async function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [product, categories] = await Promise.all([
    prisma.product.findUnique({
      where: { id },
      include: {
        images: { orderBy: { order: "asc" } },
        customFields: { orderBy: { order: "asc" } },
      },
    }),
    prisma.category.findMany({ orderBy: { name: "asc" }, select: { id: true, name: true } }),
  ]);
  if (!product) notFound();

  const formProduct = {
    ...product,
    images: product.images.map((im) => ({ url: im.url, alt: im.alt ?? "" })),
    customFields: product.customFields.map((f) => ({
      label: f.label,
      type: f.type,
      options: Array.isArray(f.options) ? (f.options as string[]).join("\n") : "",
      required: f.required,
      helpText: f.helpText ?? "",
    })),
  };

  return (
    <div className="max-w-4xl space-y-6">
      <h1 className="font-display text-3xl">Edit product</h1>
      <ProductForm product={formProduct} categories={categories} />
    </div>
  );
}
