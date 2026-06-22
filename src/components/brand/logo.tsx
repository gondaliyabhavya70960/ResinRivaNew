import * as React from "react";
import { cn } from "@/lib/utils";

/** "RR" resin-droplet monogram. Carries its own gradient so it reads on any surface. */
export function Monogram({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 40 40"
      className={cn("h-8 w-8", className)}
      role="img"
      aria-label="ResinRiva monogram"
    >
      <defs>
        <linearGradient id="rr-mark" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#0E3A53" />
          <stop offset="55%" stopColor="#1B6E7A" />
          <stop offset="100%" stopColor="#D4AF37" />
        </linearGradient>
      </defs>
      <path
        d="M20 3C20 3 32 17 32 25A12 12 0 1 1 8 25C8 17 20 3 20 3Z"
        fill="url(#rr-mark)"
      />
      <text
        x="20"
        y="29.5"
        textAnchor="middle"
        fontFamily="var(--font-display), serif"
        fontSize="12.5"
        fontWeight="500"
        letterSpacing="0.5"
        fill="#F4EFE9"
      >
        RR
      </text>
    </svg>
  );
}

/** Full lockup: monogram + wordmark. Wordmark inherits currentColor. */
export function Logo({
  className,
  withMonogram = true,
}: {
  className?: string;
  withMonogram?: boolean;
}) {
  return (
    <span className={cn("inline-flex items-center gap-2.5", className)}>
      {withMonogram && <Monogram className="h-7 w-7" />}
      <span className="font-display text-lg tracking-tight">ResinRiva</span>
    </span>
  );
}
