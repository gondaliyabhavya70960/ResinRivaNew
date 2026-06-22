"use server";

import { z } from "zod";
import { prisma } from "@/lib/db";
import type { Prisma } from "@prisma/client";

const schema = z.object({
  source: z.enum(["PRODUCT", "CUSTOM_ORDER"]),
  productId: z.string().optional(),
  customerName: z.string().min(1),
  phone: z.string().min(5),
  email: z.string().optional(),
  selections: z.array(z.object({ label: z.string(), value: z.string() })).default([]),
  referenceImageUrls: z.array(z.string()).default([]),
  budgetRange: z.string().optional(),
  timeline: z.string().optional(),
  notes: z.string().optional(),
  whatsappMessage: z.string().min(1),
});

export type CreateInquiryInput = z.infer<typeof schema>;

/**
 * Persist an order/enquiry. Called imperatively from the order forms AFTER
 * reference images have been client-uploaded to Blob, BEFORE redirecting to
 * wa.me. The saved `whatsappMessage` matches the live preview the customer saw.
 */
export async function createInquiry(
  input: CreateInquiryInput,
): Promise<{ ok: boolean; error?: string }> {
  const parsed = schema.safeParse(input);
  if (!parsed.success) return { ok: false, error: "Please complete the required fields." };
  const d = parsed.data;

  try {
    await prisma.inquiry.create({
      data: {
        source: d.source,
        productId: d.productId || null,
        customerName: d.customerName,
        phone: d.phone,
        email: d.email || null,
        selections: d.selections as unknown as Prisma.InputJsonValue,
        referenceImageUrls: d.referenceImageUrls as unknown as Prisma.InputJsonValue,
        budgetRange: d.budgetRange || null,
        timeline: d.timeline || null,
        notes: d.notes || null,
        whatsappMessage: d.whatsappMessage,
        status: "NEW",
      },
    });
  } catch {
    return { ok: false, error: "Could not save your order — please send it on WhatsApp directly." };
  }

  return { ok: true };
}
