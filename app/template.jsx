"use client";

import { motion } from "framer-motion";

/*
 * Liquid page transition: on every route change the incoming page is
 * revealed through a drippy clip-path that pours down the viewport,
 * chased by a thin melt-graded sheen. Content rises in underneath.
 */
const POUR_START =
  "polygon(0% 0%, 8% 0%, 16% 0%, 28% 0%, 40% 0%, 52% 0%, 66% 0%, 80% 0%, 100% 0%, 100% 0%, 0% 0%)";
const POUR_END =
  "polygon(0% 100%, 8% 108%, 16% 102%, 28% 112%, 40% 104%, 52% 114%, 66% 105%, 80% 110%, 100% 102%, 100% 0%, 0% 0%)";

export default function Template({ children }) {
  return (
    <motion.div
      initial={{ clipPath: POUR_START, opacity: 0.6 }}
      animate={{ clipPath: POUR_END, opacity: 1 }}
      transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
      style={{ willChange: "clip-path" }}
    >
      <motion.div
        aria-hidden
        initial={{ scaleY: 1 }}
        animate={{ scaleY: 0 }}
        transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 150,
          pointerEvents: "none",
          transformOrigin: "top",
          background:
            "linear-gradient(180deg, rgba(252,168,24,0.14), rgba(140,56,14,0.1) 40%, rgba(0,0,0,0) 80%)",
        }}
      />
      {children}
    </motion.div>
  );
}
