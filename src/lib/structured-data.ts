/**
 * JSON-LD (schema.org) builders for rich results. Pure functions → plain
 * objects, serialized by the <JsonLd/> component. Kept honest to the business
 * model: ResinRiva is made-to-order, finalised on WhatsApp (no online checkout),
 * so Product offers are advertised as price guidance only.
 */
import { siteConfig } from "@/lib/site";
import type { SiteData } from "@/lib/queries";

const BASE = siteConfig.url.replace(/\/$/, "");
export const abs = (path = "") => `${BASE}${path.startsWith("/") ? path : `/${path}`}`;

export function organizationLd(site: Pick<SiteData, "brandName" | "phoneTel" | "email" | "socials">) {
  const sameAs = [site.socials.instagram, site.socials.facebook, site.socials.youtube].filter(
    (u) => u && u !== "#",
  );
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: site.brandName,
    url: BASE,
    logo: abs("/icon.png"),
    email: site.email,
    telephone: site.phoneTel,
    description: siteConfig.description,
    areaServed: "IN",
    ...(sameAs.length ? { sameAs } : {}),
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "sales",
      telephone: site.phoneTel,
      email: site.email,
      areaServed: "IN",
      availableLanguage: ["en", "hi", "gu"],
    },
  };
}

export function websiteLd(site: Pick<SiteData, "brandName">) {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: site.brandName,
    url: BASE,
    potentialAction: {
      "@type": "SearchAction",
      target: { "@type": "EntryPoint", urlTemplate: abs("/search?q={query}") },
      "query-input": "required name=query",
    },
  };
}

export function breadcrumbLd(items: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((it, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: it.name,
      item: abs(it.path),
    })),
  };
}

type ProductLdInput = {
  title: string;
  slug: string;
  description?: string | null;
  shortTagline?: string | null;
  images?: { url: string }[];
  materials?: string | null;
  priceMin?: number | null;
  priceMax?: number | null;
  showPrice: boolean;
  category?: { name: string } | null;
};

export function productLd(p: ProductLdInput, brandName: string) {
  const images = (p.images ?? []).map((i) => i.url).filter(Boolean);
  const offers =
    p.showPrice && p.priceMin
      ? {
          offers: {
            "@type": "AggregateOffer",
            priceCurrency: "INR",
            lowPrice: p.priceMin,
            highPrice: p.priceMax ?? p.priceMin,
            availability: "https://schema.org/MadeToOrder",
            url: abs(`/product/${p.slug}`),
            seller: { "@type": "Organization", name: brandName },
          },
        }
      : {};
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: p.title,
    description: p.description || p.shortTagline || undefined,
    ...(images.length ? { image: images } : {}),
    ...(p.materials ? { material: p.materials } : {}),
    ...(p.category ? { category: p.category.name } : {}),
    brand: { "@type": "Brand", name: brandName },
    url: abs(`/product/${p.slug}`),
    ...offers,
  };
}

export function faqLd(items: { question: string; answer: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((f) => ({
      "@type": "Question",
      name: f.question,
      acceptedAnswer: { "@type": "Answer", text: f.answer },
    })),
  };
}
