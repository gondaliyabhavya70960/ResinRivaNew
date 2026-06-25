import Link from "next/link";
import { prisma } from "@/lib/db";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { TestimonialForm } from "@/components/studio/testimonial-form";
import { DeleteButton } from "@/components/studio/delete-button";
import { deleteTestimonial } from "@/actions/testimonials";
import { bulkDelete } from "@/actions/bulk";
import { BulkProvider, BulkBar, BulkCheckbox, BulkSelectAll } from "@/components/studio/bulk/bulk-select";

export const dynamic = "force-dynamic";

export default async function TestimonialsPage() {
  const items = await prisma.testimonial.findMany({ orderBy: { order: "asc" } });

  return (
    <div className="space-y-8">
      <h1 className="font-display text-3xl">Testimonials</h1>
      <div className="grid gap-8 lg:grid-cols-3">
        <BulkProvider>
          <Card className="lg:col-span-2">
            <CardContent className="p-0">
              {items.length === 0 ? (
                <p className="p-5 text-sm text-muted-foreground">No testimonials yet.</p>
              ) : (
                <>
                  <div className="flex items-center gap-2 border-b px-5 py-3 text-xs text-muted-foreground">
                    <BulkSelectAll ids={items.map((t) => t.id)} />
                    <span>Select all</span>
                  </div>
                  <ul className="divide-y">
                    {items.map((t) => (
                      <li key={t.id} className="flex items-start gap-3 p-5">
                        <BulkCheckbox id={t.id} className="mt-1" />
                        <div className="min-w-0 flex-1">
                          <p className="font-medium">
                            {t.name} <span className="text-amber">{"★".repeat(t.rating)}</span>
                          </p>
                          {t.location && <p className="text-sm text-muted-foreground">{t.location}</p>}
                          <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">{t.quote}</p>
                        </div>
                        <div className="flex shrink-0 items-center gap-1">
                          <Button asChild variant="ghost" size="sm">
                            <Link href={`/studio/testimonials/${t.id}/edit`}>Edit</Link>
                          </Button>
                          <DeleteButton action={deleteTestimonial.bind(null, t.id)} />
                        </div>
                      </li>
                    ))}
                  </ul>
                </>
              )}
            </CardContent>
          </Card>
          <BulkBar entity="testimonial" noun="testimonial" action={bulkDelete} />
        </BulkProvider>
        <Card>
          <CardHeader>
            <CardTitle>New testimonial</CardTitle>
          </CardHeader>
          <CardContent>
            <TestimonialForm />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
