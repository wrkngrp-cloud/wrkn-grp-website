"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Logo from "./Logo";

export default function Preloader() {
  const [count, setCount] = useState(0);
  const [done, setDone] = useState(false);
  // Hard skip: unmount with no exit animation. Needed for reduced motion
  // and hidden tabs — rAF pauses while a tab is hidden, so an animated
  // exit would never play and the overlay would sit there wedged.
  const [skipped, setSkipped] = useState(false);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches || document.hidden) {
      setSkipped(true);
      return;
    }
    const onHide = () => {
      if (document.hidden) setSkipped(true);
    };
    document.addEventListener("visibilitychange", onHide);

    const start = performance.now();
    const duration = 1500;
    let frame;
    const tick = (now) => {
      const p = Math.min(1, (now - start) / duration);
      // ease so the counter sprints then settles, like a press counter
      setCount(Math.round(100 * (1 - Math.pow(1 - p, 3))));
      if (p < 1) frame = requestAnimationFrame(tick);
      else setTimeout(() => setDone(true), 350);
    };
    frame = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(frame);
      document.removeEventListener("visibilitychange", onHide);
    };
  }, []);

  if (skipped) return null;

  return (
    <AnimatePresence>
      {!done && (
        <motion.div
          key="preloader"
          exit={{ y: "-100%", transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } }}
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 4000,
            background: "#0a0a0a",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: "2.2rem",
          }}
        >
          {/* Wordmark wipes in left to right — "wrkn" leans in, "grp." plants itself */}
          <motion.div
            initial={{ clipPath: "inset(0 100% 0 0)", opacity: 0.4 }}
            animate={{ clipPath: "inset(0 0% 0 0)", opacity: 1 }}
            transition={{ delay: 0.15, duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
            style={{ color: "#f4efe6" }}
          >
            <Logo width="min(56vw, 20rem)" />
          </motion.div>
          <div
            style={{
              display: "flex",
              alignItems: "baseline",
              gap: "0.6rem",
              color: "#efc835",
              fontFamily: "var(--font-body)",
            }}
          >
            <span style={{ fontSize: "0.68rem", letterSpacing: "0.24em", textTransform: "uppercase", opacity: 0.7, color: "#f4efe6" }}>
              Led by Strategy. Built in Culture.
            </span>
            <span style={{ fontVariantNumeric: "tabular-nums", fontWeight: 600 }}>{count}%</span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
