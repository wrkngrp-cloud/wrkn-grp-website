"use client";

import { useEffect, useRef, useState } from "react";
import { useInView, useReducedMotion } from "framer-motion";

/* Count-up stat that runs once when scrolled into view. */
export default function Stat({ value, suffix = "", label }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-15% 0px" });
  const reduced = useReducedMotion();
  const [display, setDisplay] = useState(reduced ? value : 0);

  useEffect(() => {
    if (!inView || reduced) return;
    const start = performance.now();
    const duration = 1400;
    let frame;
    const tick = (now) => {
      const p = Math.min(1, (now - start) / duration);
      setDisplay(Math.round(value * (1 - Math.pow(1 - p, 4))));
      if (p < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [inView, value, reduced]);

  return (
    <div ref={ref} style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}>
      <span
        className="display"
        style={{ fontSize: "clamp(3rem, 7vw, 5.5rem)", fontVariantNumeric: "tabular-nums" }}
      >
        {reduced ? value : display}
        <span style={{ color: "var(--gold)" }}>{suffix}</span>
      </span>
      <span className="small-caps" style={{ opacity: 0.65 }}>
        {label}
      </span>
    </div>
  );
}
