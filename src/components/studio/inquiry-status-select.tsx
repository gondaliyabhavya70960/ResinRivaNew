"use client";

import { useTransition } from "react";
import { Select } from "@/components/ui/select";
import { updateInquiryStatus } from "@/actions/inquiries";

const STATUSES = ["NEW", "CONTACTED", "CONFIRMED", "DELIVERED"];

export function InquiryStatusSelect({ id, status }: { id: string; status: string }) {
  const [pending, start] = useTransition();
  return (
    <Select
      defaultValue={status}
      disabled={pending}
      onChange={(e) => {
        const v = e.target.value;
        start(() => updateInquiryStatus(id, v));
      }}
      className="h-9 w-40"
    >
      {STATUSES.map((s) => (
        <option key={s} value={s}>
          {s}
        </option>
      ))}
    </Select>
  );
}
