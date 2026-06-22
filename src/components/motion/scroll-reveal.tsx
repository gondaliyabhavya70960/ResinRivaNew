"use client";

import * as React from "react";
import { motion, useReducedMotion } from "motion/react";
import { cn } from "@/lib/utils";

type ScrollRevealProps = {
  children: React.ReactNode;
  className?: string;
  /** stagger delay in seconds */
  delay?: number;
  /** initial vertical offset in px */
  y?: number;
  once?: boolean;
};

/** Fade + rise on scroll into view. Falls back to static when reduced-motion. */
export function ScrollReveal({
  children,
  className,
  delay = 0,
  y = 24,
  once = true,
}: ScrollRevealProps) {
  const reduce = useReducedMotion();

  if (reduce) return <div className={className}>{children}</div>;

  return (
    <motion.div
      className={cn(className)}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once, margin: "-80px" }}
      transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}
