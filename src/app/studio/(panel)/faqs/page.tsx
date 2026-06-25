import Link from "next/link";
import { prisma } from "@/lib/db";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FaqForm } from "@/components/studio/faq-form";
import { DeleteButton } from "@/components/studio/delete-button";
import { deleteFaq } from "@/actions/faqs";
import { bulkDelete } from "@/actions/bulk";
import { BulkProvider, BulkBar, BulkCheckbox, BulkSelectAll } from "@/components/studio/bulk/bulk-select";

export const dynamic = "force-dynamic";

export default async function FaqsPage() {
  const items = await prisma.faq.findMany({ orderBy: { order: "asc" } });

  return (
    <div className="space-y-8">
      <h1 className="font-display text-3xl">FAQs</h1>
      <div className="grid gap-8 lg:grid-cols-3">
        <BulkProvider>
          <Card className="lg:col-span-2">
            <CardContent className="p-0">
              {items.length === 0 ? (
                <p className="p-5 text-sm text-muted-foreground">No FAQs yet.</p>
              ) : (
                <>
                  <div className="flex items-center gap-2 border-b px-5 py-3 text-xs text-muted-foreground">
                    <BulkSelectAll ids={items.map((f) => f.id)} />
                    <span>Select all</span>
                  </div>
                  <ul className="divide-y">
                    {items.map((f) => (
                      <li key={f.id} className="flex items-start gap-3 p-5">
                        <BulkCheckbox id={f.id} className="mt-1" />
                        <div className="min-w-0 flex-1">
                          <p className="font-medium">{f.question}</p>
                          <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">{f.answer}</p>
                        </div>
                        <div className="flex shrink-0 items-center gap-1">
                          <Button asChild variant="ghost" size="sm">
                            <Link href={`/studio/faqs/${f.id}/edit`}>Edit</Link>
                          </Button>
                          <DeleteButton action={deleteFaq.bind(null, f.id)} />
                        </div>
                      </li>
                    ))}
                  </ul>
                </>
              )}
            </CardContent>
          </Card>
          <BulkBar entity="faq" noun="FAQ" action={bulkDelete} />
        </BulkProvider>
        <Card>
          <CardHeader>
            <CardTitle>New FAQ</CardTitle>
          </CardHeader>
          <CardContent>
            <FaqForm />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
