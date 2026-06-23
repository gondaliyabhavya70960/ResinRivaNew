import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/site";

const BASE = siteConfig.url.replace(/\/$/, "");

/** Crawl rules — index the public site, keep the owner-only studio + APIs out. */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/studio", "/studio/", "/api/", "/whatsapp-order"],
      },
    ],
    sitemap: `${BASE}/sitemap.xml`,
    host: BASE,
  };
}
