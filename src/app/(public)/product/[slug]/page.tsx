import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { Badge } from "@/components/ui/badge";
import { ProductGallery } from "@/components/product/product-gallery";
import { ModelViewer } from "@/components/product/model-viewer";
import { OrderForm, type Opt } from "@/components/product/order-form";
import { ProductCard, priceLabel } from "@/components/product/product-card";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

function normalizeOptions(raw: unknown): Opt[] {
  if (!Array.isArray(raw)) return [];
  return raw.map((o) => {
    if (typeof o === "string") return { label: o };
    if (o && typeof o === "object") {
      const rec = o as Record<string, unknown>;
      return {
        label: String(rec.label ?? ""),
        hex: typeof rec.hex === "string" ? rec.hex : undefined,
      };
    }
    return { label: String(o) };
  });
}

async function getProduct(slug: string) {
  try {
    return await prisma.product.findFirst({
      where: { slug, status: "PUBLISHED" },
      include: {
        images: { orderBy: { order: "asc" } },
        customFields: { orderBy: { order: "asc" } },
        category: true,
      },
    });
  } catch {
    return null;
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const p = await getProduct(slug);
  if (!p) return { title: "Product" };
  const ogImage = p.ogImage || p.images[0]?.url;
  return {
    title: p.seoTitle || p.title,
    description: p.seoDescription || p.shortTagline || undefined,
    openGraph: ogImage ? { images: [ogImage] } : undefined,
  };
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = await getProduct(slug);
  if (!product) notFound();

  const related = product.categoryId
    ? await prisma.product
        .findMany({
          where: { status: "PUBLISHED", categoryId: product.categoryId, NOT: { id: product.id } },
          include: { images: { orderBy: { order: "asc" }, take: 2 }, category: true },
          take: 4,
        })
        .catch(() => [])
    : [];

  const fields = product.customFields.map((f) => ({
    id: f.id,
    label: f.label,
    type: f.type,
    options: normalizeOptions(f.options),
    required: f.required,
    helpText: f.helpText,
  }));

  return (
    <>
      <Container className="py-10 lg:py-16">
        <div className="grid gap-10 lg:grid-cols-2">
          <div className="space-y-4">
            <ProductGallery images={product.images} title={product.title} />
            {product.model3dUrl && (
              <div className="aspect-square overflow-hidden rounded-2xl border bg-muted">
                <ModelViewer src={product.model3dUrl} poster={product.images[0]?.url} />
              </div>
            )}
            {product.videoUrl && (
              <video className="w-full rounded-2xl" controls poster={product.images[0]?.url}>
                <source src={product.videoUrl} />
              </video>
            )}
          </div>

          <div>
            {product.category && (
              <Link
                href={`/shop/${product.category.slug}`}
                className="text-xs uppercase tracking-[0.18em] text-amber"
              >
                {product.category.name}
              </Link>
            )}
            <h1 className="mt-2 font-display text-3xl sm:text-4xl">{product.title}</h1>
            {product.shortTagline && (
              <p className="mt-2 text-lg text-muted-foreground">{product.shortTagline}</p>
            )}
            <div className="mt-4 flex flex-wrap items-center gap-3">
              <span className="font-display text-2xl text-ocean">{priceLabel(product)}</span>
              {product.timeline && <Badge variant="muted">⏱ {product.timeline}</Badge>}
            </div>
            {product.description && (
              <p className="mt-5 whitespace-pre-wrap text-muted-foreground">{product.description}</p>
            )}
            <dl className="mt-5 grid grid-cols-2 gap-3 text-sm">
              {product.materials && (
                <div>
                  <dt className="text-muted-foreground">Materials</dt>
                  <dd>{product.materials}</dd>
                </div>
              )}
              {product.dimensions && (
                <div>
                  <dt className="text-muted-foreground">Dimensions</dt>
                  <dd>{product.dimensions}</dd>
                </div>
              )}
            </dl>

            <div className="mt-8 rounded-2xl border bg-card p-6">
              <h2 className="font-display text-xl">Customize &amp; order</h2>
              <p className="mb-5 mt-1 text-sm text-muted-foreground">
                Tell us your preferences — every order is finalised on WhatsApp.
              </p>
              <OrderForm product={{ id: product.id, title: product.title, fields }} />
            </div>
          </div>
        </div>
      </Container>

      {related.length > 0 && (
        <Section eyebrow="you may also like" title="Related pieces">
          <div className="grid grid-cols-2 gap-6 lg:grid-cols-4">
            {related.map((r) => (
              <ProductCard key={r.id} product={r} />
            ))}
          </div>
        </Section>
      )}
    </>
  );
}
