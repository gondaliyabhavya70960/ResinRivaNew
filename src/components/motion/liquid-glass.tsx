"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

/**
 * Detects support for SVG-displacement refraction via `backdrop-filter: url()`,
 * which is Chromium-only. Everywhere else we fall back to plain blur+saturate.
 * Result is cached and read via useSyncExternalStore so it's SSR-safe (server
 * renders the blur fallback, client upgrades after hydration).
 */
let cachedRefraction: boolean | null = null;
function detectRefraction(): boolean {
  if (cachedRefraction !== null) return cachedRefraction;
  if (typeof window === "undefined" || typeof CSS === "undefined" || !CSS.supports) {
    return false;
  }
  cachedRefraction =
    CSS.supports("backdrop-filter", "url(#x)") ||
    CSS.supports("-webkit-backdrop-filter", "url(#x)");
  return cachedRefraction;
}

const noopSubscribe = () => () => {};

function useRefractionSupport() {
  return React.useSyncExternalStore(noopSubscribe, detectRefraction, () => false);
}

type LiquidGlassProps = {
  as?: React.ElementType;
  className?: string;
  children?: React.ReactNode;
  /** opt into Chromium refraction; falls back to blur automatically */
  refraction?: boolean;
} & React.HTMLAttributes<HTMLElement>;

/** Frosted "liquid glass" surface. Primary technique = blur + saturate. */
export function LiquidGlass({
  as: Comp = "div",
  className,
  children,
  refraction = false,
  ...props
}: LiquidGlassProps) {
  const canRefract = useRefractionSupport();
  const useRefract = refraction && canRefract;

  return (
    <>
      {useRefract && <GlassFilter />}
      <Comp
        data-refraction={useRefract ? "" : undefined}
        className={cn(
          "relative rounded-2xl border border-white/15 bg-white/8 backdrop-blur-xl backdrop-saturate-150",
          "shadow-[var(--shadow-glass)]",
          className,
        )}
        style={
          useRefract
            ? {
                backdropFilter: "url(#rr-glass) blur(8px) saturate(160%)",
                WebkitBackdropFilter: "url(#rr-glass) blur(8px) saturate(160%)",
              }
            : undefined
        }
        {...props}
      >
        {children}
      </Comp>
    </>
  );
}

/** Shared SVG displacement filter (rendered only when refraction is active). */
function GlassFilter() {
  return (
    <svg aria-hidden className="pointer-events-none absolute h-0 w-0">
      <filter id="rr-glass">
        <feTurbulence
          type="fractalNoise"
          baseFrequency="0.012 0.012"
          numOctaves="2"
          seed="7"
          result="noise"
        />
        <feDisplacementMap
          in="SourceGraphic"
          in2="noise"
          scale="18"
          xChannelSelector="R"
          yChannelSelector="G"
        />
      </filter>
    </svg>
  );
}
