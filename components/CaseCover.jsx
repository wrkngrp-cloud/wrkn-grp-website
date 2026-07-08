"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion";

/*
 * Full-bleed case-study cover with 3D scroll parallax: the slot scales
 * and drifts as it moves through the viewport, entering with a slight tilt.
 */
export default function CaseCover({ label }) {
  const ref = useRef(null);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [60, -60]);
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [1.06, 1, 1.04]);
  const rotateX = useTransform(scrollYProgress, [0, 0.35], [8, 0]);

  return (
    <div ref={ref} style={{ perspective: 1200, padding: "0 var(--gutter)", position: "relative" }}>
      <motion.div
        style={{
          rotateX: reduced ? 0 : rotateX,
          transformOrigin: "center 90%",
          overflow: "hidden",
          borderRadius: 8,
        }}
      >
        <motion.div
          className="img-slot"
          style={{
            y: reduced ? 0 : y,
            scale: reduced ? 1 : scale,
            aspectRatio: "16 / 9",
            minHeight: "min(72vh, 42rem)",
            width: "100%",
          }}
          role="img"
          aria-label={label}
        >
          <span className="img-slot__label">{label} — 1920×1080 min</span>
        </motion.div>
      </motion.div>
    </div>
  );
}
