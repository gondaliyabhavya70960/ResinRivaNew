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

export type OrderSelection = { label: string; value: string };

/**
 * Build the structured WhatsApp order message (see WHATSAPP_ORDER_GUIDE.md).
 * Used for the live preview AND saved verbatim to the Inquiry record.
 */
export function buildOrderMessage(input: {
  productTitle?: string;
  selections: OrderSelection[];
  referenceImageUrls: string[];
  notes?: string;
  budgetRange?: string;
  timeline?: string;
  customer: { name: string; phone: string; email?: string };
}): string {
  const lines: string[] = [
    "Hello ResinRiva,",
    "",
    input.productTitle ? "I would like to order:" : "I'd like a custom order:",
    "",
  ];
  if (input.productTitle) lines.push(`*Product:* ${input.productTitle}`);
  for (const s of input.selections) {
    if (s.value.trim()) lines.push(`*${s.label}:* ${s.value.trim()}`);
  }
  if (input.budgetRange) lines.push(`*Budget:* ${input.budgetRange}`);
  if (input.timeline) lines.push(`*Timeline:* ${input.timeline}`);
  if (input.referenceImageUrls.length) {
    lines.push("*Reference Images:*");
    for (const u of input.referenceImageUrls) lines.push(u);
  }
  if (input.notes?.trim()) lines.push(`*Additional Notes:* ${input.notes.trim()}`);
  lines.push("", "*Customer Details:*", `Name: ${input.customer.name}`, `Phone: ${input.customer.phone}`);
  if (input.customer.email) lines.push(`Email: ${input.customer.email}`);
  lines.push("", `(Sent from ${siteConfig.url.replace(/^https?:\/\//, "")})`);
  return lines.join("\n");
}
