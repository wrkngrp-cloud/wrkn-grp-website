"use client";

import { motion, useReducedMotion } from "framer-motion";

/*
 * A cream "printed page" laid onto the black stack: soft clip-path
 * reveal rather than a hard color swap between sections.
 */
export default function CreamSection({ children, style }) {
  const reduced = useReducedMotion();
  return (
    <motion.section
      className="theme-cream"
      initial={reduced ? false : { clipPath: "inset(5% 3% 5% 3% round 22px)", scale: 0.985 }}
      whileInView={{ clipPath: "inset(0% 0% 0% 0% round 0px)", scale: 1 }}
      viewport={{ once: true, margin: "-18% 0px" }}
      transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
      style={{ background: "var(--cream)", color: "var(--black)", position: "relative", ...style }}
    >
      {children}
    </motion.section>
  );
}
