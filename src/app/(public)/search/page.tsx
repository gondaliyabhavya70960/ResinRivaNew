import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { Container } from "@/components/ui/container";
import { ProductCard } from "@/components/product/product-card";
import { SearchBox } from "@/components/shop/search-box";
import { searchAll } from "@/lib/queries";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Search",
  description: "Search ResinRiva products, journal articles and portfolio.",
};

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const sp = await searchParams;
  const q = (sp.q ?? "").trim();
  const { products, posts, portfolios } = await searchAll(q);
  const empty = q !== "" && !products.length && !posts.length && !portfolios.length;

  return (
    <Container className="py-12">
      <h1 className="font-display text-4xl">Search</h1>
      <div className="mt-6 max-w-xl">
        <SearchBox initial={q} />
      </div>

      {!q && (
        <p className="mt-10 text-muted-foreground">
          Type above to search products, journal articles and case studies.
        </p>
      )}
      {empty && <p className="mt-10 text-muted-foreground">No results for &ldquo;{q}&rdquo;.</p>}

      {products.length > 0 && (
        <section className="mt-12">
          <h2 className="font-display text-2xl">Products</h2>
          <div className="mt-5 grid grid-cols-2 gap-6 lg:grid-cols-4">
            {products.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}

      {portfolios.length > 0 && (
        <section className="mt-12">
          <h2 className="font-display text-2xl">Portfolio</h2>
          <div className="mt-5 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {portfolios.map((p) => (
              <Link key={p.id} href={`/portfolio/${p.slug}`} className="group block">
                <div className="relative aspect-[4/5] overflow-hidden rounded-2xl bg-muted">
                  {p.images[0]?.url && (
                    <Image
                      src={p.images[0].url}
                      alt={p.title}
                      fill
                      sizes="(min-width:1024px) 33vw, 90vw"
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  )}
                </div>
                <h3 className="mt-3 font-display text-lg">{p.title}</h3>
              </Link>
            ))}
          </div>
        </section>
      )}

      {posts.length > 0 && (
        <section className="mt-12">
          <h2 className="font-display text-2xl">Journal</h2>
          <ul className="mt-5 space-y-4">
            {posts.map((p) => (
              <li key={p.id}>
                <Link href={`/blog/${p.slug}`} className="font-display text-lg hover:underline">
                  {p.title}
                </Link>
                {p.excerpt && (
                  <p className="line-clamp-1 text-sm text-muted-foreground">{p.excerpt}</p>
                )}
              </li>
            ))}
          </ul>
        </section>
      )}
    </Container>
  );
}
