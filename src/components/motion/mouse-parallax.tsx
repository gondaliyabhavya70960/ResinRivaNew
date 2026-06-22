"use client";

import * as React from "react";
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  useReducedMotion,
} from "motion/react";

type MouseParallaxProps = {
  children: React.ReactNode;
  className?: string;
  /** max offset in px applied to the layer */
  strength?: number;
};

/**
 * Pointer-reactive parallax. Tracks the cursor relative to this element
 * (getBoundingClientRect) and springs a translate on the inner layer.
 * Nest multiple with different `strength` for layered depth. Static under
 * reduced-motion.
 */
export function MouseParallax({
  children,
  className,
  strength = 20,
}: MouseParallaxProps) {
  const reduce = useReducedMotion();
  const ref = React.useRef<HTMLDivElement>(null);

  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const spring = { stiffness: 120, damping: 18, mass: 0.4 };
  const sx = useSpring(x, spring);
  const sy = useSpring(y, spring);
  const tx = useTransform(sx, [-0.5, 0.5], [-strength, strength]);
  const ty = useTransform(sy, [-0.5, 0.5], [-strength, strength]);

  function handleMove(e: React.MouseEvent<HTMLDivElement>) {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    x.set((e.clientX - rect.left) / rect.width - 0.5);
    y.set((e.clientY - rect.top) / rect.height - 0.5);
  }

  function handleLeave() {
    x.set(0);
    y.set(0);
  }

  if (reduce) return <div className={className}>{children}</div>;

  return (
    <div
      ref={ref}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      className={className}
      style={{ perspective: 1000 }}
    >
      <motion.div style={{ x: tx, y: ty, willChange: "transform" }}>
        {children}
      </motion.div>
    </div>
  );
}
