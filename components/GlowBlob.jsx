"use client";

import { useEffect, useRef } from "react";
import { motion, useMotionValue, useSpring, useTransform, useReducedMotion } from "framer-motion";

/*
 * Ambient gold glow that drifts toward the cursor. Lives inside a
 * position:relative section; intensity is tunable per section.
 */
export default function GlowBlob({ intensity = 0.14, size = 620 }) {
  const ref = useRef(null);
  const reduced = useReducedMotion();
  const x = useMotionValue(0.5);
  const y = useMotionValue(0.35);
  const sx = useSpring(x, { stiffness: 40, damping: 20 });
  const sy = useSpring(y, { stiffness: 40, damping: 20 });
  const left = useTransform(sx, (v) => `${v * 100}%`);
  const top = useTransform(sy, (v) => `${v * 100}%`);

  useEffect(() => {
    if (reduced) return;
    const onMove = (e) => {
      const parent = ref.current?.parentElement;
      if (!parent) return;
      const r = parent.getBoundingClientRect();
      if (e.clientY < r.top - 300 || e.clientY > r.bottom + 300) return;
      x.set(Math.min(1, Math.max(0, (e.clientX - r.left) / r.width)));
      y.set(Math.min(1, Math.max(0, (e.clientY - r.top) / r.height)));
    };
    window.addEventListener("mousemove", onMove, { passive: true });
    return () => window.removeEventListener("mousemove", onMove);
  }, [reduced, x, y]);

  return (
    <motion.div
      ref={ref}
      aria-hidden
      style={{
        position: "absolute",
        left,
        top,
        width: size,
        height: size,
        marginLeft: -size / 2,
        marginTop: -size / 2,
        borderRadius: "50%",
        pointerEvents: "none",
        background: `radial-gradient(circle, rgba(239,200,53,${intensity}) 0%, rgba(239,200,53,0.04) 45%, transparent 70%)`,
        filter: "blur(60px)",
        zIndex: 0,
      }}
    />
  );
}
