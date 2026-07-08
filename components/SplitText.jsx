"use client";

import { useRef } from "react";
import { motion, useInView, useReducedMotion } from "framer-motion";

/*
 * Split-text reveal: words (or characters) rise out of a masked line,
 * staggered, as the headline scrolls into view.
 *
 * Visibility is observed on the container, not the masked words — a
 * word translated 115% inside overflow:hidden never intersects the
 * viewport, so per-word whileInView would never fire.
 */
export default function SplitText({
  children,
  as: Tag = "h2",
  per = "word",
  className = "",
  delay = 0,
  once = true,
  style,
}) {
  const ref = useRef(null);
  const reduced = useReducedMotion();
  const inView = useInView(ref, { once, margin: "-8% 0px" });
  const text = String(children);
  const units = per === "char" ? text.split("") : text.split(/(\s+)/);

  if (reduced) {
    return (
      <Tag className={className} style={style}>
        {text}
      </Tag>
    );
  }

  let unitIndex = 0;
  return (
    <Tag ref={ref} className={className} style={style} aria-label={text}>
      {units.map((unit, i) => {
        if (/^\s+$/.test(unit)) return <span key={i}> </span>;
        const d = delay + unitIndex++ * (per === "char" ? 0.025 : 0.055);
        return (
          <span
            key={i}
            aria-hidden
            style={{ display: "inline-block", overflow: "hidden", verticalAlign: "bottom", padding: "0 0 0.08em" }}
          >
            <motion.span
              initial={{ y: "115%", rotate: 4 }}
              animate={inView ? { y: 0, rotate: 0 } : { y: "115%", rotate: 4 }}
              transition={{ duration: 0.85, delay: d, ease: [0.16, 1, 0.3, 1] }}
              style={{ display: "inline-block", whiteSpace: "pre" }}
            >
              {unit}
            </motion.span>
          </span>
        );
      })}
    </Tag>
  );
}
