"use client";

import * as React from "react";
import { Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";

export function DeleteButton({
  action,
  confirmText = "Delete this item? This cannot be undone.",
  className,
}: {
  action: () => Promise<unknown>;
  confirmText?: string;
  className?: string;
}) {
  const [pending, start] = React.useTransition();
  return (
    <button
      type="button"
      disabled={pending}
      onClick={() => {
        if (window.confirm(confirmText)) start(() => void action());
      }}
      className={cn(
        "inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-sm text-destructive transition-colors hover:bg-destructive/10 disabled:opacity-50",
        className,
      )}
    >
      <Trash2 className="size-4" />
      {pending ? "Deleting…" : "Delete"}
    </button>
  );
}
