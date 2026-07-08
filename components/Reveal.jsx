"use client";

import { motion, useReducedMotion } from "framer-motion";

/* 3D scroll reveal: enters with a perspective tilt that resolves flat. */
export default function Reveal({ children, delay = 0, tilt = 12, y = 60, style, className }) {
  const reduced = useReducedMotion();
  if (reduced) {
    return (
      <div className={className} style={style}>
        {children}
      </div>
    );
  }
  return (
    <div style={{ perspective: 1200, ...style }}>
      <motion.div
        className={className}
        initial={{ opacity: 0, y, rotateX: tilt }}
        whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
        viewport={{ once: true, margin: "-10% 0px" }}
        transition={{ duration: 1, delay, ease: [0.16, 1, 0.3, 1] }}
        style={{ transformOrigin: "center 80%", height: "100%" }}
      >
        {children}
      </motion.div>
    </div>
  );
}
