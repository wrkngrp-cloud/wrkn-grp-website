"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion";
import SplitText from "./SplitText";

/*
 * Print-magazine chapter divider: massive italic numeral drifting on
 * parallax behind a split-text title, framed by wayfinding rules.
 */
export default function SectionDivider({ numeral, title, label, right }) {
  const ref = useRef(null);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [90, -90]);

  return (
    <div ref={ref} className="container" style={{ position: "relative", paddingTop: "2rem" }}>
      <div className="wayfinding">
        <span>{label}</span>
        <span>{right}</span>
      </div>
      <div style={{ position: "relative", padding: "4.5rem 0 3rem" }}>
        <motion.span
          aria-hidden
          className="chapter-numeral"
          style={{
            position: "absolute",
            right: 0,
            top: "-18%",
            y: reduced ? 0 : y,
          }}
        >
          {numeral}
        </motion.span>
        <SplitText as="h2" className="display display-lg" style={{ position: "relative", zIndex: 1 }}>
          {title}
        </SplitText>
      </div>
    </div>
  );
}
