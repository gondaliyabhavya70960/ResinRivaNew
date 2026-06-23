"use client";

import * as React from "react";
import Image from "next/image";

export function BeforeAfter({ before, after }: { before: string; after: string }) {
  const [pos, setPos] = React.useState(50);
  return (
    <div className="relative aspect-[4/3] w-full select-none overflow-hidden rounded-2xl bg-muted">
      <Image src={after} alt="After" fill sizes="(min-width:1024px) 60vw, 100vw" className="object-cover" />
      <div className="absolute inset-0" style={{ clipPath: `inset(0 ${100 - pos}% 0 0)` }}>
        <Image src={before} alt="Before" fill sizes="(min-width:1024px) 60vw, 100vw" className="object-cover" />
      </div>
      <div
        className="pointer-events-none absolute inset-y-0 w-0.5 bg-ivory shadow"
        style={{ left: `${pos}%` }}
      />
      <span className="pointer-events-none absolute left-3 top-3 rounded-full bg-ink/70 px-2.5 py-1 text-xs text-ivory">
        Before
      </span>
      <span className="pointer-events-none absolute right-3 top-3 rounded-full bg-ink/70 px-2.5 py-1 text-xs text-ivory">
        After
      </span>
      <input
        type="range"
        min={0}
        max={100}
        value={pos}
        onChange={(e) => setPos(Number(e.target.value))}
        aria-label="Reveal before and after"
        className="absolute inset-x-6 bottom-4 cursor-ew-resize accent-gold"
      />
    </div>
  );
}
