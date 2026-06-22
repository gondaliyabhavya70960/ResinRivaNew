"use server";

import { z } from "zod";
import { prisma } from "@/lib/db";
import type { ActionState } from "./state";

const schema = z.object({
  name: z.string().min(1, "Name is required"),
  phone: z.string().min(5, "A valid phone is required"),
  email: z.email().optional().or(z.literal("")),
  message: z.string().min(1, "Please add a message"),
});

/** Public contact form — saves an Inquiry (source CONTACT). No auth. */
export async function submitContact(_prev: ActionState, fd: FormData): Promise<ActionState> {
  const parsed = schema.safeParse({
    name: fd.get("name"),
    phone: fd.get("phone"),
    email: fd.get("email") || "",
    message: fd.get("message"),
  });
  if (!parsed.success) return { fieldErrors: z.flattenError(parsed.error).fieldErrors };

  const d = parsed.data;
  const whatsappMessage = [
    "Hello ResinRiva,",
    "",
    "New contact enquiry:",
    `*Name:* ${d.name}`,
    `*Phone:* ${d.phone}`,
    d.email ? `*Email:* ${d.email}` : "",
    `*Message:* ${d.message}`,
  ]
    .filter(Boolean)
    .join("\n");

  try {
    await prisma.inquiry.create({
      data: {
        source: "CONTACT",
        customerName: d.name,
        phone: d.phone,
        email: d.email || null,
        notes: d.message,
        whatsappMessage,
      },
    });
    // Optional Resend email notification can be added in Phase 10.
  } catch {
    return { error: "Could not send right now — please reach us on WhatsApp." };
  }

  return { ok: true };
}
