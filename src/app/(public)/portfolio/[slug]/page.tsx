import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import { MessageCircle } from "lucide-react";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { BeforeAfter } from "@/components/portfolio/before-after";
import { ProductGallery } from "@/components/product/product-gallery";
import { getPortfolio } from "@/lib/queries";
import { waLink, defaultEnquiry } from "@/lib/whatsapp";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const p = await getPortfolio(slug);
  return p
    ? { title: p.title, description: p.story?.slice(0, 155) ?? undefined }
    : { title: "Portfolio" };
}

export default async function PortfolioDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const p = await getPortfolio(slug);
  if (!p) notFound();

  const meta = Array.isArray(p.resultsMeta)
    ? (p.resultsMeta as { label: string; value: string }[])
    : [];

  return (
    <Container className="py-10 lg:py-16">
      {p.category && (
        <Link
          href={`/portfolio?category=${p.category.slug}`}
          className="text-xs uppercase tracking-[0.18em] text-amber"
        >
          {p.category.name}
        </Link>
      )}
      <h1 className="mt-2 font-display text-4xl sm:text-5xl">{p.title}</h1>

      <div className="mt-8 grid gap-10 lg:grid-cols-3">
        <div className="space-y-8 lg:col-span-2">
          {p.beforeImageUrl && p.afterImageUrl && (
            <BeforeAfter before={p.beforeImageUrl} after={p.afterImageUrl} />
          )}
          {p.images.length > 0 && <ProductGallery images={p.images} title={p.title} />}
          {p.videoUrl && (
            <video controls className="w-full rounded-2xl">
              <source src={p.videoUrl} />
            </video>
          )}
          {p.story && (
            <div className="whitespace-pre-wrap text-lg leading-relaxed text-muted-foreground">
              {p.story}
            </div>
          )}
        </div>

        <aside className="space-y-6">
          {meta.length > 0 && (
            <div className="rounded-2xl border bg-card p-6">
              <h2 className="font-display text-lg">Details</h2>
              <dl className="mt-4 space-y-3 text-sm">
                {meta.map((m, i) => (
                  <div key={i} className="flex justify-between gap-3">
                    <dt className="text-muted-foreground">{m.label}</dt>
                    <dd className="text-right font-medium">{m.value}</dd>
                  </div>
                ))}
              </dl>
            </div>
          )}
          <div className="mesh-ink rounded-2xl p-6 text-ivory">
            <h2 className="font-display text-lg">Love this?</h2>
            <p className="mt-2 text-sm text-ivory/75">Commission something similar, made for you.</p>
            <div className="mt-4 flex flex-col gap-2">
              <Button asChild variant="gold" size="sm">
                <a href={waLink(defaultEnquiry)} target="_blank" rel="noopener noreferrer">
                  <MessageCircle />
                  Enquire on WhatsApp
                </a>
              </Button>
              <Button asChild variant="glass" size="sm" className="text-ivory">
                <Link href="/custom-order">Start a custom order</Link>
              </Button>
            </div>
          </div>
        </aside>
      </div>
    </Container>
  );
}
