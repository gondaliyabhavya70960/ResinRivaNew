"use client";

import * as React from "react";
import Image from "next/image";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

type Img = { url: string; alt: string | null };

export function ProductGallery({ images, title }: { images: Img[]; title: string }) {
  const [active, setActive] = React.useState(0);
  const [zoom, setZoom] = React.useState(false);

  if (!images.length) {
    return <div className="aspect-square rounded-2xl bg-muted" />;
  }
  const img = images[Math.min(active, images.length - 1)];

  return (
    <div>
      <button
        type="button"
        onClick={() => setZoom(true)}
        className="relative block aspect-square w-full cursor-zoom-in overflow-hidden rounded-2xl bg-muted"
      >
        <Image
          src={img.url}
          alt={img.alt || title}
          fill
          sizes="(min-width:1024px) 50vw, 100vw"
          className="object-cover"
          priority
        />
      </button>

      {images.length > 1 && (
        <div className="mt-3 flex gap-3 overflow-x-auto">
          {images.map((im, i) => (
            <button
              key={im.url}
              type="button"
              onClick={() => setActive(i)}
              className={cn(
                "relative size-16 shrink-0 overflow-hidden rounded-lg border-2",
                i === active ? "border-ocean" : "border-transparent",
              )}
            >
              <Image src={im.url} alt="" fill sizes="64px" className="object-cover" />
            </button>
          ))}
        </div>
      )}

      {zoom && (
        <div
          className="fixed inset-0 z-[90] grid place-items-center bg-ink/90 p-6"
          onClick={() => setZoom(false)}
        >
          <button aria-label="Close" className="absolute right-5 top-5 text-ivory">
            <X className="size-7" />
          </button>
          <div className="relative aspect-square max-h-[88vh] w-full max-w-3xl">
            <Image src={img.url} alt={img.alt || title} fill className="object-contain" />
          </div>
        </div>
      )}
    </div>
  );
}
