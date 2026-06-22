import Link from "next/link";
import { prisma } from "@/lib/db";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { TestimonialForm } from "@/components/studio/testimonial-form";
import { DeleteButton } from "@/components/studio/delete-button";
import { deleteTestimonial } from "@/actions/testimonials";

export const dynamic = "force-dynamic";

export default async function TestimonialsPage() {
  const items = await prisma.testimonial.findMany({ orderBy: { order: "asc" } });

  return (
    <div className="space-y-8">
      <h1 className="font-display text-3xl">Testimonials</h1>
      <div className="grid gap-8 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardContent className="p-0">
            {items.length === 0 ? (
              <p className="p-5 text-sm text-muted-foreground">No testimonials yet.</p>
            ) : (
              <ul className="divide-y">
                {items.map((t) => (
                  <li key={t.id} className="flex items-start justify-between gap-4 p-5">
                    <div className="min-w-0">
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
            )}
          </CardContent>
        </Card>
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
