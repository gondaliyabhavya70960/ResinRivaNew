import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/db";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { InquiryStatusSelect } from "@/components/studio/inquiry-status-select";
import { deleteInquiry } from "@/actions/inquiries";

export const dynamic = "force-dynamic";

export default async function InquiryDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const inq = await prisma.inquiry.findUnique({ where: { id }, include: { product: true } });
  if (!inq) notFound();

  const selections =
    inq.selections && typeof inq.selections === "object"
      ? (inq.selections as Record<string, unknown>)
      : {};
  const refs = Array.isArray(inq.referenceImageUrls)
    ? (inq.referenceImageUrls as string[])
    : [];

  return (
    <div className="max-w-3xl space-y-6">
      <Link href="/studio/inquiries" className="text-sm text-muted-foreground hover:text-foreground">
        ← Back to inquiries
      </Link>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="font-display text-3xl">{inq.customerName}</h1>
        <InquiryStatusSelect id={inq.id} status={inq.status} />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Customer</CardTitle>
        </CardHeader>
        <CardContent className="space-y-1 text-sm">
          <p>
            Phone:{" "}
            <a href={`tel:${inq.phone}`} className="text-ocean">
              {inq.phone}
            </a>
          </p>
          {inq.email && (
            <p>
              Email:{" "}
              <a href={`mailto:${inq.email}`} className="text-ocean">
                {inq.email}
              </a>
            </p>
          )}
          <p>
            Source: {inq.source}
            {inq.product && ` · ${inq.product.title}`}
          </p>
          <p>Received: {new Date(inq.createdAt).toLocaleString()}</p>
          {inq.budgetRange && <p>Budget: {inq.budgetRange}</p>}
          {inq.timeline && <p>Timeline: {inq.timeline}</p>}
        </CardContent>
      </Card>

      {Object.keys(selections).length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Selections</CardTitle>
          </CardHeader>
          <CardContent>
            <dl className="grid gap-2 text-sm sm:grid-cols-2">
              {Object.entries(selections).map(([k, v]) => (
                <div key={k}>
                  <dt className="text-muted-foreground">{k}</dt>
                  <dd className="font-medium">{String(v)}</dd>
                </div>
              ))}
            </dl>
          </CardContent>
        </Card>
      )}

      {refs.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Reference images</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-4">
            {refs.map((u, i) => (
              <a key={i} href={u} target="_blank" rel="noopener noreferrer" className="text-sm text-ocean underline">
                Image {i + 1}
              </a>
            ))}
          </CardContent>
        </Card>
      )}

      {inq.notes && (
        <Card>
          <CardHeader>
            <CardTitle>Notes</CardTitle>
          </CardHeader>
          <CardContent className="whitespace-pre-wrap text-sm">{inq.notes}</CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>WhatsApp message</CardTitle>
        </CardHeader>
        <CardContent>
          <pre className="whitespace-pre-wrap rounded-lg bg-muted p-4 text-xs">{inq.whatsappMessage}</pre>
        </CardContent>
      </Card>

      <form
        action={async () => {
          "use server";
          await deleteInquiry(id);
          redirect("/studio/inquiries");
        }}
      >
        <Button type="submit" variant="ghost" className="text-destructive">
          Delete inquiry
        </Button>
      </form>
    </div>
  );
}
