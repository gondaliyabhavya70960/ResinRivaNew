import Link from "next/link";
import Image from "next/image";
import { prisma } from "@/lib/db";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DeleteButton } from "@/components/studio/delete-button";
import { deleteProduct } from "@/actions/products";

export const dynamic = "force-dynamic";

function priceLabel(p: { showPrice: boolean; priceMin: number | null; priceMax: number | null }) {
  if (!p.showPrice) return "Enquire";
  if (p.priceMin && p.priceMax) return `₹${p.priceMin.toLocaleString("en-IN")}–₹${p.priceMax.toLocaleString("en-IN")}`;
  if (p.priceMin) return `₹${p.priceMin.toLocaleString("en-IN")}+`;
  return "—";
}

export default async function ProductsPage() {
  const products = await prisma.product.findMany({
    orderBy: { updatedAt: "desc" },
    include: { category: true, images: { orderBy: { order: "asc" }, take: 1 } },
  });

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-3xl">Products</h1>
        <Button asChild>
          <Link href="/studio/products/new">New product</Link>
        </Button>
      </div>

      <Card>
        <CardContent className="p-0">
          {products.length === 0 ? (
            <p className="p-5 text-sm text-muted-foreground">No products yet — create your first.</p>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b text-left text-muted-foreground">
                  <th className="p-4 font-medium">Product</th>
                  <th className="hidden p-4 font-medium sm:table-cell">Category</th>
                  <th className="hidden p-4 font-medium sm:table-cell">Price</th>
                  <th className="p-4 font-medium">Status</th>
                  <th className="p-4" />
                </tr>
              </thead>
              <tbody className="divide-y">
                {products.map((p) => (
                  <tr key={p.id}>
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="relative size-10 shrink-0 overflow-hidden rounded-md bg-muted">
                          {p.images[0] && (
                            <Image src={p.images[0].url} alt="" fill className="object-cover" sizes="40px" />
                          )}
                        </div>
                        <div className="min-w-0">
                          <p className="truncate font-medium">{p.title}</p>
                          <p className="truncate text-xs text-muted-foreground">{p.slug}</p>
                        </div>
                      </div>
                    </td>
                    <td className="hidden p-4 text-muted-foreground sm:table-cell">{p.category?.name ?? "—"}</td>
                    <td className="hidden p-4 sm:table-cell">{priceLabel(p)}</td>
                    <td className="p-4">
                      <Badge variant={p.status === "PUBLISHED" ? "success" : "muted"}>{p.status}</Badge>
                      {p.featured && <Badge variant="gold" className="ml-1">Featured</Badge>}
                    </td>
                    <td className="whitespace-nowrap p-4 text-right">
                      <Button asChild variant="ghost" size="sm">
                        <Link href={`/studio/products/${p.id}/edit`}>Edit</Link>
                      </Button>
                      <DeleteButton action={deleteProduct.bind(null, p.id)} confirmText={`Delete "${p.title}"?`} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
