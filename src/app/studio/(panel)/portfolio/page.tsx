import Link from "next/link";
import { prisma } from "@/lib/db";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DeleteButton } from "@/components/studio/delete-button";
import { deletePortfolio } from "@/actions/portfolio";
import { bulkDelete } from "@/actions/bulk";
import { BulkProvider, BulkBar, BulkCheckbox, BulkSelectAll } from "@/components/studio/bulk/bulk-select";

export const dynamic = "force-dynamic";

export default async function PortfolioPage() {
  const items = await prisma.portfolio.findMany({
    orderBy: { createdAt: "desc" },
    include: { category: true },
  });

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-3xl">Portfolio</h1>
        <Button asChild>
          <Link href="/studio/portfolio/new">New case study</Link>
        </Button>
      </div>

      <BulkProvider>
        <Card>
          <CardContent className="p-0">
            {items.length === 0 ? (
              <p className="p-5 text-sm text-muted-foreground">No case studies yet.</p>
            ) : (
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b text-left text-muted-foreground">
                    <th className="w-10 p-4">
                      <BulkSelectAll ids={items.map((p) => p.id)} />
                    </th>
                    <th className="p-4 font-medium">Title</th>
                    <th className="hidden p-4 font-medium sm:table-cell">Category</th>
                    <th className="p-4 font-medium">Status</th>
                    <th className="p-4" />
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {items.map((p) => (
                    <tr key={p.id}>
                      <td className="p-4">
                        <BulkCheckbox id={p.id} />
                      </td>
                      <td className="p-4">
                        <p className="font-medium">{p.title}</p>
                        <p className="text-xs text-muted-foreground">{p.slug}</p>
                      </td>
                      <td className="hidden p-4 text-muted-foreground sm:table-cell">
                        {p.category?.name ?? "—"}
                      </td>
                      <td className="p-4">
                        <Badge variant={p.status === "PUBLISHED" ? "success" : "muted"}>{p.status}</Badge>
                      </td>
                      <td className="whitespace-nowrap p-4 text-right">
                        <Button asChild variant="ghost" size="sm">
                          <Link href={`/studio/portfolio/${p.id}/edit`}>Edit</Link>
                        </Button>
                        <DeleteButton action={deletePortfolio.bind(null, p.id)} confirmText={`Delete "${p.title}"?`} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </CardContent>
        </Card>
        <BulkBar entity="portfolio" noun="case study" action={bulkDelete} />
      </BulkProvider>
    </div>
  );
}
