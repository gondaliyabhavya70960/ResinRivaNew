import Link from "next/link";
import { Package, FolderTree, FileText, Inbox, ArrowRight } from "lucide-react";
import { prisma } from "@/lib/db";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export const dynamic = "force-dynamic";

// Module scope keeps the time read out of the component body (purity rule).
function sevenDaysAgo() {
  return new Date(Date.now() - 7 * 86_400_000);
}

export default async function StudioDashboard() {
  const weekAgo = sevenDaysAgo();
  const [products, published, categories, posts, inquiriesWeek, recent] =
    await Promise.all([
      prisma.product.count(),
      prisma.product.count({ where: { status: "PUBLISHED" } }),
      prisma.category.count(),
      prisma.blogPost.count(),
      prisma.inquiry.count({ where: { createdAt: { gte: weekAgo } } }),
      prisma.inquiry.findMany({
        orderBy: { createdAt: "desc" },
        take: 5,
        include: { product: true },
      }),
    ]);

  const stats = [
    { label: "Products", value: `${published}/${products}`, hint: "published / total", href: "/studio/products", icon: Package },
    { label: "Categories", value: String(categories), href: "/studio/categories", icon: FolderTree },
    { label: "Inquiries (7d)", value: String(inquiriesWeek), href: "/studio", icon: Inbox },
    { label: "Blog posts", value: String(posts), href: "/studio", icon: FileText },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-3xl">Dashboard</h1>
        <p className="mt-1 text-muted-foreground">Welcome back to ResinRiva Studio.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((s) => {
          const Icon = s.icon;
          return (
            <Link key={s.label} href={s.href}>
              <Card className="transition-shadow hover:shadow-[var(--shadow-luxe)]">
                <CardContent className="flex items-center justify-between p-5">
                  <div>
                    <p className="text-sm text-muted-foreground">{s.label}</p>
                    <p className="mt-1 font-display text-3xl">{s.value}</p>
                    {s.hint && <p className="text-xs text-muted-foreground">{s.hint}</p>}
                  </div>
                  <span className="grid size-10 place-items-center rounded-full bg-ocean/10 text-ocean">
                    <Icon className="size-5" />
                  </span>
                </CardContent>
              </Card>
            </Link>
          );
        })}
      </div>

      <Card>
        <CardContent className="p-0">
          <div className="flex items-center justify-between border-b p-5">
            <h2 className="font-display text-xl">Recent inquiries</h2>
            <span className="inline-flex items-center gap-1 text-sm text-muted-foreground">
              WhatsApp orders <ArrowRight className="size-3.5" />
            </span>
          </div>
          {recent.length === 0 ? (
            <p className="p-5 text-sm text-muted-foreground">
              No inquiries yet — WhatsApp orders will appear here.
            </p>
          ) : (
            <ul className="divide-y">
              {recent.map((i) => (
                <li key={i.id} className="flex items-center justify-between gap-4 p-5">
                  <div className="min-w-0">
                    <p className="truncate font-medium">
                      {i.customerName} · {i.phone}
                    </p>
                    <p className="truncate text-sm text-muted-foreground">
                      {i.product?.title ?? i.source} —{" "}
                      {new Date(i.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <Badge variant="muted">{i.status}</Badge>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>

      <div className="flex flex-wrap gap-3">
        <Button asChild>
          <Link href="/studio/products/new">New product</Link>
        </Button>
        <Button asChild variant="outline">
          <Link href="/studio/categories">Manage categories</Link>
        </Button>
        <Button asChild variant="outline">
          <Link href="/studio/media">Media library</Link>
        </Button>
      </div>
    </div>
  );
}
