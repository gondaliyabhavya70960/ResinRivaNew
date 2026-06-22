"use client";

import * as React from "react";
import { ReactLenis } from "lenis/react";
import { useReducedMotion } from "motion/react";

/** Lenis smooth-scroll. Disabled (native scroll) under reduced-motion. */
export function LenisProvider({ children }: { children: React.ReactNode }) {
  const reduce = useReducedMotion();

  if (reduce) return <>{children}</>;

  return (
    <ReactLenis
      root
      options={{ lerp: 0.1, duration: 1.1, smoothWheel: true }}
    >
      {children}
    </ReactLenis>
  );
}
