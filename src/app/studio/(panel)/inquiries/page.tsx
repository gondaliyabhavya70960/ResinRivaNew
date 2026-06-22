import Link from "next/link";
import { prisma } from "@/lib/db";
import { cn } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { InquiryStatusSelect } from "@/components/studio/inquiry-status-select";

export const dynamic = "force-dynamic";

const STATUSES = ["NEW", "CONTACTED", "CONFIRMED", "DELIVERED"] as const;
type InquiryStatus = (typeof STATUSES)[number];

export default async function InquiriesPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const { status } = await searchParams;
  const valid = status && (STATUSES as readonly string[]).includes(status);
  const where = valid ? { status: status as InquiryStatus } : {};

  const inquiries = await prisma.inquiry.findMany({
    where,
    orderBy: { createdAt: "desc" },
    take: 100,
    include: { product: true },
  });

  return (
    <div className="space-y-6">
      <h1 className="font-display text-3xl">Inquiries / WhatsApp Orders</h1>

      <div className="flex flex-wrap gap-2">
        <FilterChip active={!valid} href="/studio/inquiries" label="All" />
        {STATUSES.map((s) => (
          <FilterChip key={s} active={status === s} href={`/studio/inquiries?status=${s}`} label={s} />
        ))}
      </div>

      <Card>
        <CardContent className="p-0">
          {inquiries.length === 0 ? (
            <p className="p-5 text-sm text-muted-foreground">No inquiries here yet.</p>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b text-left text-muted-foreground">
                  <th className="p-4 font-medium">Customer</th>
                  <th className="hidden p-4 font-medium sm:table-cell">Product</th>
                  <th className="hidden p-4 font-medium sm:table-cell">Source</th>
                  <th className="hidden p-4 font-medium md:table-cell">Received</th>
                  <th className="p-4 font-medium">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {inquiries.map((i) => (
                  <tr key={i.id}>
                    <td className="p-4">
                      <Link href={`/studio/inquiries/${i.id}`} className="font-medium hover:underline">
                        {i.customerName}
                      </Link>
                      <p className="text-xs text-muted-foreground">{i.phone}</p>
                    </td>
                    <td className="hidden p-4 text-muted-foreground sm:table-cell">
                      {i.product?.title ?? "—"}
                    </td>
                    <td className="hidden p-4 sm:table-cell">
                      <Badge variant="muted">{i.source}</Badge>
                    </td>
                    <td className="hidden p-4 text-muted-foreground md:table-cell">
                      {new Date(i.createdAt).toLocaleDateString()}
                    </td>
                    <td className="p-4">
                      <InquiryStatusSelect id={i.id} status={i.status} />
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

function FilterChip({ active, href, label }: { active: boolean; href: string; label: string }) {
  return (
    <Link
      href={href}
      className={cn(
        "rounded-full px-3 py-1.5 text-sm transition-colors",
        active ? "bg-ocean text-ivory" : "bg-muted text-muted-foreground hover:bg-foreground/10",
      )}
    >
      {label}
    </Link>
  );
}
