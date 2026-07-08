"use client";

import { motion, useReducedMotion } from "framer-motion";

/*
 * Page-level transition: every route change re-mounts this template,
 * giving a fade + slight vertical shift so navigation never feels
 * like a hard reload.
 */
export default function Template({ children }) {
  const reduced = useReducedMotion();
  return (
    <motion.div
      initial={reduced ? false : { opacity: 0, y: 26 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  );
}
