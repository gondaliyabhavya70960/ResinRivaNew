import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { Card, CardContent } from "@/components/ui/card";
import { CategoryForm } from "@/components/studio/category-form";

export const dynamic = "force-dynamic";

export default async function EditCategoryPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const category = await prisma.category.findUnique({ where: { id } });
  if (!category) notFound();

  return (
    <div className="max-w-2xl space-y-6">
      <h1 className="font-display text-3xl">Edit category</h1>
      <Card>
        <CardContent className="pt-6">
          <CategoryForm category={category} />
        </CardContent>
      </Card>
    </div>
  );
}
