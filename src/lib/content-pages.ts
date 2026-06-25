import "server-only";
import { prisma } from "@/lib/db";

export type ContentPageData = { slug: string; title: string; body: string };

/**
 * Built-in defaults for the legal pages. These render until an editor overrides
 * them from Studio (Bulk import → Pages, or a future page editor), and act as a
 * safety net if the database/table is unavailable.
 */
export const FALLBACK_PAGES: Record<string, ContentPageData> = {
  privacy: {
    slug: "privacy",
    title: "Privacy Policy",
    body: `This Privacy Policy explains how ResinRiva ("we", "us") handles the information you share when you enquire about or order a piece. We collect only what we need to craft and deliver your order.

## What we collect

Your name, phone number, optional email, the details and reference images you submit, and the contents of your enquiry. Orders are finalised over WhatsApp.

## How we use it

Solely to discuss, create and deliver your order, and to respond to your messages. We do not sell your data. Reference images are stored securely to fulfil your request.

## Your choices

You can ask us to update or delete your information at any time by contacting us at the email or phone number on our Contact page.

This is a general template and should be reviewed by a professional before launch.`,
  },
  terms: {
    slug: "terms",
    title: "Terms & Conditions",
    body: `These terms apply to commissions and purchases from ResinRiva. By placing an enquiry or order, you agree to them.

## Made to order

Every piece is handmade to order. Minor natural variations in colour, pattern and finish are part of the craft and not defects. Timelines are estimates confirmed per order.

## Orders & payment

There is no online checkout. Details, pricing and payment are agreed directly over WhatsApp before work begins. Custom orders may require an advance.

## Shipping & returns

We pack carefully and ship pan-India. As pieces are personalised and made to order, they are generally non-returnable except in the case of damage in transit — contact us promptly with photos.

This is a general template and should be reviewed by a professional before launch.`,
  },
};

/**
 * Resolve a content page: prefer the database row, fall back to the built-in
 * default. Any DB error (e.g. table not yet migrated) degrades to the fallback
 * so the public pages never break.
 */
export async function getContentPage(slug: string): Promise<ContentPageData | null> {
  try {
    const row = await prisma.contentPage.findUnique({ where: { slug } });
    if (row) return { slug: row.slug, title: row.title, body: row.body };
  } catch {
    // table missing / DB unreachable — use fallback
  }
  return FALLBACK_PAGES[slug] ?? null;
}
