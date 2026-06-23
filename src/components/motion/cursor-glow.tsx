"use client";

import * as React from "react";
import { motion, useMotionValue, useSpring, useReducedMotion } from "motion/react";

/**
 * Detects a fine pointer (mouse/trackpad) via matchMedia, SSR-safe through
 * useSyncExternalStore — the server and first client paint agree on "false"
 * (no glow), then the client upgrades after hydration on real mice.
 */
function subscribeFinePointer(cb: () => void) {
  if (typeof window === "undefined" || !window.matchMedia) return () => {};
  const mq = window.matchMedia("(pointer: fine)");
  mq.addEventListener("change", cb);
  return () => mq.removeEventListener("change", cb);
}
function getFinePointer() {
  if (typeof window === "undefined" || !window.matchMedia) return false;
  return window.matchMedia("(pointer: fine)").matches;
}
function useFinePointer() {
  return React.useSyncExternalStore(subscribeFinePointer, getFinePointer, () => false);
}

/**
 * Ambient cursor glow — a soft, spring-trailed light that follows the pointer.
 * Fine-pointer (mouse) devices only; hidden entirely on touch and under
 * `prefers-reduced-motion`. Renders above section backgrounds but below the
 * sticky header (z-50) and modals, with `mix-blend-screen` so it reads as a
 * gentle light over dark panels and stays invisible over ivory.
 */
export function CursorGlow() {
  const reduce = useReducedMotion();
  const fine = useFinePointer();
  const enabled = !reduce && fine;

  const x = useMotionValue(-1000);
  const y = useMotionValue(-1000);
  const sx = useSpring(x, { stiffness: 140, damping: 22, mass: 0.45 });
  const sy = useSpring(y, { stiffness: 140, damping: 22, mass: 0.45 });

  React.useEffect(() => {
    if (!enabled) return;
    const move = (e: PointerEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);
    };
    window.addEventListener("pointermove", move, { passive: true });
    return () => window.removeEventListener("pointermove", move);
  }, [enabled, x, y]);

  if (!enabled) return null;

  return (
    <motion.div
      aria-hidden
      className="pointer-events-none fixed left-0 top-0 z-30 h-[34rem] w-[34rem] rounded-full"
      style={{
        x: sx,
        y: sy,
        marginLeft: "-17rem",
        marginTop: "-17rem",
        mixBlendMode: "screen",
        background:
          "radial-gradient(circle, rgba(212,175,55,0.16), rgba(27,110,122,0.10) 42%, transparent 70%)",
        willChange: "transform",
      }}
    />
  );
}
