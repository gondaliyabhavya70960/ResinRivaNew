"use client";

import * as React from "react";
import { ChevronLeft, ChevronRight, Star } from "lucide-react";

type T = {
  id: string;
  name: string;
  location: string | null;
  quote: string;
  rating: number;
};

export function TestimonialsCarousel({ items }: { items: T[] }) {
  const ref = React.useRef<HTMLDivElement>(null);
  const scroll = (dir: number) =>
    ref.current?.scrollBy({ left: dir * ref.current.clientWidth * 0.8, behavior: "smooth" });

  if (!items.length) return null;

  return (
    <div className="relative">
      <div
        ref={ref}
        className="flex snap-x snap-mandatory gap-5 overflow-x-auto pb-4 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {items.map((t) => (
          <figure
            key={t.id}
            className="w-[85%] shrink-0 snap-start rounded-2xl border bg-card p-7 sm:w-[420px]"
          >
            <div className="flex gap-0.5 text-gold">
              {Array.from({ length: t.rating }).map((_, i) => (
                <Star key={i} className="size-4 fill-current" />
              ))}
            </div>
            <blockquote className="mt-4 text-lg leading-relaxed text-balance">
              “{t.quote}”
            </blockquote>
            <figcaption className="mt-5 text-sm">
              <span className="font-medium">{t.name}</span>
              {t.location && <span className="text-muted-foreground"> · {t.location}</span>}
            </figcaption>
          </figure>
        ))}
      </div>
      <div className="mt-4 flex justify-end gap-2">
        <button
          type="button"
          onClick={() => scroll(-1)}
          aria-label="Previous"
          className="grid size-10 place-items-center rounded-full border transition-colors hover:bg-foreground/5"
        >
          <ChevronLeft className="size-4" />
        </button>
        <button
          type="button"
          onClick={() => scroll(1)}
          aria-label="Next"
          className="grid size-10 place-items-center rounded-full border transition-colors hover:bg-foreground/5"
        >
          <ChevronRight className="size-4" />
        </button>
      </div>
    </div>
  );
}
