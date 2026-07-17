"use client";

import { motion } from "framer-motion";

/*
 * Page transition: a single gold hairline sweeps across the top while
 * the incoming page rises into place. One clean gesture, no theatrics.
 */
export default function Template({ children }) {
  return (
    <>
      <motion.div
        aria-hidden
        initial={{ scaleX: 0, opacity: 1 }}
        animate={{ scaleX: 1, opacity: 0 }}
        transition={{
          scaleX: { duration: 0.55, ease: [0.22, 1, 0.36, 1] },
          opacity: { duration: 0.35, delay: 0.55, ease: "easeOut" },
        }}
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          height: 2,
          zIndex: 400,
          transformOrigin: "left",
          pointerEvents: "none",
          background:
            "linear-gradient(90deg, #FCA818, #FC7818 45%, #A8460E 80%, #380E00)",
        }}
      />
      <motion.div
        initial={{ opacity: 0, y: 22 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
      >
        {children}
      </motion.div>
    </>
  );
}
