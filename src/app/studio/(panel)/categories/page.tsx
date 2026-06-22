import Link from "next/link";
import { prisma } from "@/lib/db";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CategoryForm } from "@/components/studio/category-form";
import { DeleteButton } from "@/components/studio/delete-button";
import { deleteCategory } from "@/actions/categories";

export const dynamic = "force-dynamic";

export default async function CategoriesPage() {
  const categories = await prisma.category.findMany({
    orderBy: { order: "asc" },
    include: { _count: { select: { products: true } } },
  });

  return (
    <div className="space-y-8">
      <h1 className="font-display text-3xl">Categories</h1>

      <div className="grid gap-8 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardContent className="p-0">
            {categories.length === 0 ? (
              <p className="p-5 text-sm text-muted-foreground">No categories yet.</p>
            ) : (
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b text-left text-muted-foreground">
                    <th className="p-4 font-medium">Name</th>
                    <th className="p-4 font-medium">Slug</th>
                    <th className="p-4 font-medium">Products</th>
                    <th className="p-4" />
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {categories.map((c) => (
                    <tr key={c.id}>
                      <td className="p-4 font-medium">{c.name}</td>
                      <td className="p-4 text-muted-foreground">{c.slug}</td>
                      <td className="p-4">{c._count.products}</td>
                      <td className="whitespace-nowrap p-4 text-right">
                        <Button asChild variant="ghost" size="sm">
                          <Link href={`/studio/categories/${c.id}/edit`}>Edit</Link>
                        </Button>
                        <DeleteButton
                          action={deleteCategory.bind(null, c.id)}
                          confirmText={`Delete "${c.name}"? Products keep existing but lose this category.`}
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>New category</CardTitle>
          </CardHeader>
          <CardContent>
            <CategoryForm />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
