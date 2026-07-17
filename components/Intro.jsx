"use client";

import { motion } from "framer-motion";

/*
 * Load-sequence rise: runs once on mount (unlike Reveal, which waits
 * for the viewport). Used to orchestrate the hero: kicker, headline,
 * standfirst, actions, each on its own beat.
 */
export default function Intro({ children, delay = 0, y = 26, blur = 0, ...rest }) {
  return (
    <motion.div
      initial={{ opacity: 0, y, filter: blur ? `blur(${blur}px)` : "none" }}
      animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      transition={{ duration: 1.0, delay, ease: [0.22, 1, 0.36, 1] }}
      {...rest}
    >
      {children}
    </motion.div>
  );
}
