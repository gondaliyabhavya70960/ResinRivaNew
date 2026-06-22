import Link from "next/link";
import Image from "next/image";

export type CardProduct = {
  slug: string;
  title: string;
  shortTagline: string | null;
  priceMin: number | null;
  priceMax: number | null;
  showPrice: boolean;
  category?: { name: string } | null;
  images: { url: string; alt: string | null }[];
};

export function priceLabel(p: Pick<CardProduct, "showPrice" | "priceMin" | "priceMax">) {
  if (!p.showPrice) return "Enquire";
  if (p.priceMin && p.priceMax)
    return `₹${p.priceMin.toLocaleString("en-IN")}–₹${p.priceMax.toLocaleString("en-IN")}`;
  if (p.priceMin) return `From ₹${p.priceMin.toLocaleString("en-IN")}`;
  return "Enquire";
}

export function ProductCard({ product }: { product: CardProduct }) {
  const [main, second] = product.images;
  return (
    <Link href={`/product/${product.slug}`} className="group block">
      <div className="relative aspect-square overflow-hidden rounded-2xl bg-muted">
        {main && (
          <Image
            src={main.url}
            alt={main.alt || product.title}
            fill
            sizes="(min-width:1024px) 25vw, 50vw"
            className="object-cover transition-transform duration-700 group-hover:scale-105"
          />
        )}
        {second && (
          <Image
            src={second.url}
            alt=""
            fill
            sizes="(min-width:1024px) 25vw, 50vw"
            className="object-cover opacity-0 transition-opacity duration-500 group-hover:opacity-100"
          />
        )}
        {product.category && (
          <span className="absolute left-3 top-3 rounded-full bg-ink/70 px-2.5 py-1 text-xs text-ivory backdrop-blur">
            {product.category.name}
          </span>
        )}
      </div>
      <div className="mt-4 flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="font-display text-lg leading-tight">{product.title}</h3>
          {product.shortTagline && (
            <p className="mt-0.5 line-clamp-1 text-sm text-muted-foreground">{product.shortTagline}</p>
          )}
        </div>
        <span className="shrink-0 text-sm font-medium text-amber">{priceLabel(product)}</span>
      </div>
    </Link>
  );
}
