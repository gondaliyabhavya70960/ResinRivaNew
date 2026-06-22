import { siteConfig } from "./site";

/**
 * Build a wa.me deep link. Phone is international, digits only (no +, spaces or
 * dashes). Exactly one `?text=` parameter; encodeURIComponent turns newlines
 * into %0A.
 *
 * NOTE: The full structured order-message builder (with product, selections and
 * reference-image URLs) is implemented in Phase 7 (`src/lib/whatsapp.ts` is
 * expanded there). This helper powers the header/footer enquiry CTAs.
 */
export function waLink(message?: string): string {
  const base = `https://wa.me/${siteConfig.whatsapp}`;
  return message ? `${base}?text=${encodeURIComponent(message)}` : base;
}

/** A simple default greeting used by sitewide WhatsApp CTAs. */
export const defaultEnquiry = [
  "Hello ResinRiva,",
  "",
  "I'd like to enquire about a custom piece.",
  "",
  `(Sent from ${siteConfig.url.replace(/^https?:\/\//, "")})`,
].join("\n");
