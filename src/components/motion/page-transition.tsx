"use client";

import { usePathname } from "next/navigation";
import { motion, useReducedMotion } from "motion/react";

/**
 * Subtle per-route enter transition. Keyed on the pathname so each navigation
 * replays a soft fade + rise; passthrough under `prefers-reduced-motion`.
 * (Enter-only by design — avoids the App Router exit-freeze pitfalls of
 * AnimatePresence while still giving every page a polished entrance.)
 */
export function PageTransition({ children }: { children: React.ReactNode }) {
  const reduce = useReducedMotion();
  const pathname = usePathname();

  if (reduce) return <>{children}</>;

  return (
    <motion.div
      key={pathname}
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}
