"use client";

import * as React from "react";
import { Plus, Minus } from "lucide-react";

type F = { id: string; question: string; answer: string };

export function FaqAccordion({ items }: { items: F[] }) {
  const [open, setOpen] = React.useState<string | null>(items[0]?.id ?? null);

  if (!items.length)
    return <p className="text-muted-foreground">FAQs are coming soon.</p>;

  return (
    <div className="divide-y border-y">
      {items.map((f) => {
        const isOpen = open === f.id;
        return (
          <div key={f.id}>
            <button
              type="button"
              onClick={() => setOpen(isOpen ? null : f.id)}
              className="flex w-full items-center justify-between gap-4 py-5 text-left"
              aria-expanded={isOpen}
            >
              <span className="font-display text-lg">{f.question}</span>
              {isOpen ? (
                <Minus className="size-5 shrink-0 text-amber" />
              ) : (
                <Plus className="size-5 shrink-0 text-muted-foreground" />
              )}
            </button>
            {isOpen && <p className="pb-5 text-muted-foreground">{f.answer}</p>}
          </div>
        );
      })}
    </div>
  );
}
