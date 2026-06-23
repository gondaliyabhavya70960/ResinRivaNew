"use client";

import * as React from "react";
import Image from "next/image";
import { useReducedMotion } from "motion/react";
import { cn } from "@/lib/utils";

type ParallaxImageProps = {
  src: string;
  alt: string;
  /** container classes — give it an aspect ratio + rounding */
  className?: string;
  sizes?: string;
  priority?: boolean;
  /** parallax travel as a % of the inner layer height (kept subtle) */
  strength?: number;
};

/**
 * Scroll-driven parallax for a single key image, powered by GSAP ScrollTrigger.
 * The image layer is over-sized (124% tall) so it can drift within an
 * `overflow-hidden` frame without exposing gaps. GSAP is loaded on demand
 * (dynamic import) so pages without parallax never pay for it. Static —
 * perfectly covering — under `prefers-reduced-motion`.
 */
export function ParallaxImage({
  src,
  alt,
  className,
  sizes,
  priority,
  strength = 12,
}: ParallaxImageProps) {
  const reduce = useReducedMotion();
  const frameRef = React.useRef<HTMLDivElement>(null);
  const layerRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (reduce) return;
    const frame = frameRef.current;
    const layer = layerRef.current;
    if (!frame || !layer) return;

    let killed = false;
    let ctx: { revert: () => void } | undefined;

    (async () => {
      const gsap = (await import("gsap")).default;
      const { ScrollTrigger } = await import("gsap/ScrollTrigger");
      if (killed) return;
      gsap.registerPlugin(ScrollTrigger);
      ctx = gsap.context(() => {
        gsap.fromTo(
          layer,
          { yPercent: -strength },
          {
            yPercent: strength,
            ease: "none",
            scrollTrigger: {
              trigger: frame,
              start: "top bottom",
              end: "bottom top",
              scrub: true,
            },
          },
        );
      }, frame);
    })();

    return () => {
      killed = true;
      ctx?.revert();
    };
  }, [reduce, strength]);

  return (
    <div ref={frameRef} className={cn("relative overflow-hidden", className)}>
      <div ref={layerRef} className="absolute inset-x-0 -top-[12%] h-[124%] will-change-transform">
        <Image src={src} alt={alt} fill sizes={sizes} priority={priority} className="object-cover" />
      </div>
    </div>
  );
}
