import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { Container } from "@/components/ui/container";
import { cn } from "@/lib/utils";
import { getPortfolios, getPortfolioCategories } from "@/lib/queries";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Portfolio",
  description: "A selection of bespoke ResinRiva commissions — resin art, furniture and keepsakes.",
  alternates: { canonical: "/portfolio" },
};

export default async function PortfolioPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>;
}) {
  const { category } = await searchParams;
  const [items, cats] = await Promise.all([getPortfolios(category), getPortfolioCategories()]);

  return (
    <>
      <section className="mesh-ink text-ivory">
        <Container className="py-16 sm:py-20">
          <h1 className="font-display text-4xl sm:text-5xl">Portfolio</h1>
          <p className="mt-3 max-w-xl text-ivory/75">
            A selection of bespoke commissions, each crafted to order.
          </p>
        </Container>
      </section>

      <Container className="py-10">
        {cats.length > 0 && (
          <div className="mb-8 flex flex-wrap gap-2">
            <Chip active={!category} href="/portfolio" label="All" />
            {cats.map((c) => (
              <Chip key={c.id} active={category === c.slug} href={`/portfolio?category=${c.slug}`} label={c.name} />
            ))}
          </div>
        )}

        {items.length === 0 ? (
          <p className="py-16 text-center text-muted-foreground">No case studies yet.</p>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {items.map((p) => {
              const cover = p.images[0]?.url ?? p.afterImageUrl;
              return (
                <Link key={p.id} href={`/portfolio/${p.slug}`} className="group block">
                  <div className="relative aspect-[4/5] overflow-hidden rounded-2xl bg-muted">
                    {cover && (
                      <Image
                        src={cover}
                        alt={p.title}
                        fill
                        sizes="(min-width:1024px) 33vw, 90vw"
                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                    )}
                  </div>
                  {p.category && (
                    <p className="mt-3 text-xs uppercase tracking-[0.18em] text-amber">{p.category.name}</p>
                  )}
                  <h3 className="mt-1 font-display text-xl">{p.title}</h3>
                </Link>
              );
            })}
          </div>
        )}
      </Container>
    </>
  );
}

function Chip({ active, href, label }: { active: boolean; href: string; label: string }) {
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
