import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { Container } from "@/components/ui/container";
import { ShopControls } from "@/components/shop/shop-controls";
import { ShopGrid } from "@/components/shop/shop-grid";
import { fetchProducts, countProducts, type ShopFilters } from "@/actions/shop";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

async function getCategory(slug: string) {
  try {
    return await prisma.category.findUnique({ where: { slug } });
  } catch {
    return null;
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ category: string }>;
}): Promise<Metadata> {
  const { category } = await params;
  const c = await getCategory(category);
  return { title: c?.name ?? "Shop", description: c?.description ?? undefined };
}

export default async function CategoryPage({
  params,
  searchParams,
}: {
  params: Promise<{ category: string }>;
  searchParams: Promise<Record<string, string | undefined>>;
}) {
  const { category } = await params;
  const sp = await searchParams;
  const cat = await getCategory(category);
  if (!cat) notFound();

  const filters: ShopFilters = { category, sort: sp.sort, q: sp.q };
  const [products, total] = await Promise.all([fetchProducts(filters, 0), countProducts(filters)]);

  return (
    <>
      <section className="mesh-ink text-ivory">
        <Container className="py-16 sm:py-20">
          <p className="text-xs uppercase tracking-[0.2em] text-ivory/60">collection</p>
          <h1 className="mt-2 font-display text-4xl sm:text-5xl">{cat.name}</h1>
          {cat.description && <p className="mt-3 max-w-xl text-ivory/75">{cat.description}</p>}
        </Container>
      </section>

      <Container className="py-10">
        <ShopControls />
        <div className="mt-8">
          <ShopGrid
            key={`${filters.sort ?? ""}|${filters.q ?? ""}`}
            initial={products}
            filters={filters}
            total={total}
          />
        </div>
      </Container>
    </>
  );
}
