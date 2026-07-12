"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

/* Subtle depth: the child drifts a few dozen pixels against scroll. */
export default function Parallax({ children, amount = 48, ...rest }) {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], [amount, -amount]);

  return (
    <motion.div ref={ref} style={{ y }} {...rest}>
      {children}
    </motion.div>
  );
}
