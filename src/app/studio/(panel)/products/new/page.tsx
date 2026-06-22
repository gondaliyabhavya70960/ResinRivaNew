import { prisma } from "@/lib/db";
import { ProductForm } from "@/components/studio/product-form";

export const dynamic = "force-dynamic";

export default async function NewProductPage() {
  const categories = await prisma.category.findMany({
    orderBy: { name: "asc" },
    select: { id: true, name: true },
  });

  return (
    <div className="max-w-4xl space-y-6">
      <h1 className="font-display text-3xl">New product</h1>
      <ProductForm categories={categories} />
    </div>
  );
}
