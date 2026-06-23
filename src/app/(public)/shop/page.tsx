import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/ui/container";
import { cn } from "@/lib/utils";
import { ShopControls } from "@/components/shop/shop-controls";
import { ShopGrid } from "@/components/shop/shop-grid";
import { fetchProducts, countProducts, type ShopFilters } from "@/actions/shop";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Shop",
  description: "Browse ResinRiva's collection of handcrafted resin art, décor and keepsakes — made to order.",
  alternates: { canonical: "/shop" },
};

async function getCategories() {
  try {
    return await prisma.category.findMany({ orderBy: { order: "asc" } });
  } catch {
    return [];
  }
}

export default async function ShopPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | undefined>>;
}) {
  const sp = await searchParams;
  const filters: ShopFilters = { category: sp.category, sort: sp.sort, q: sp.q };
  const [products, total, categories] = await Promise.all([
    fetchProducts(filters, 0),
    countProducts(filters),
    getCategories(),
  ]);

  return (
    <>
      <section className="mesh-ink text-ivory">
        <Container className="py-16 sm:py-20">
          <h1 className="font-display text-4xl sm:text-5xl">The Collection</h1>
          <p className="mt-3 max-w-xl text-ivory/75">
            Handcrafted resin art, décor and keepsakes — each made to order.
          </p>
        </Container>
      </section>

      <Container className="py-10">
        <ShopControls />
        <div className="mt-5 flex flex-wrap gap-2">
          <CatChip active={!filters.category} href="/shop" label="All" />
          {categories.map((c) => (
            <CatChip key={c.id} active={filters.category === c.slug} href={`/shop?category=${c.slug}`} label={c.name} />
          ))}
        </div>
        <div className="mt-8">
          <ShopGrid
            key={`${filters.category ?? ""}|${filters.sort ?? ""}|${filters.q ?? ""}`}
            initial={products}
            filters={filters}
            total={total}
          />
        </div>
      </Container>
    </>
  );
}

function CatChip({ active, href, label }: { active: boolean; href: string; label: string }) {
  return (
    <Link
      href={href}
      className={cn(
        "rounded-full px-3.5 py-1.5 text-sm transition-colors",
        active ? "bg-ocean text-ivory" : "bg-muted text-muted-foreground hover:bg-foreground/10",
      )}
    >
      {label}
    </Link>
  );
}
