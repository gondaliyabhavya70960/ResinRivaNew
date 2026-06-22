"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";
import { requireUser, logActivity } from "@/lib/auth-helpers";

const STATUSES = ["NEW", "CONTACTED", "CONFIRMED", "DELIVERED"] as const;
type InquiryStatus = (typeof STATUSES)[number];

export async function updateInquiryStatus(id: string, status: string) {
  const user = await requireUser();
  if (!STATUSES.includes(status as InquiryStatus)) return;
  await prisma.inquiry.update({ where: { id }, data: { status: status as InquiryStatus } });
  await logActivity(user.id, `status:${status}`, "Inquiry", id);
  revalidatePath("/studio/inquiries");
  revalidatePath(`/studio/inquiries/${id}`);
}

export async function deleteInquiry(id: string) {
  const user = await requireUser();
  await prisma.inquiry.delete({ where: { id } });
  await logActivity(user.id, "delete", "Inquiry", id);
  revalidatePath("/studio/inquiries");
}
