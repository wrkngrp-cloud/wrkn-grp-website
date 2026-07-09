"use client";

import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import Logo from "./Logo";

const PreloaderScene = dynamic(() => import("./PreloaderScene"), { ssr: false });

/*
 * The loader opens on a cluster of ceramic blocks that compact into a
 * modular mark as the counter climbs. At handoff the blocks explode
 * outward and the dark plate dissolves straight into the hero beneath.
 *
 * Load + explode progress live on a ref (`{ p, explode }`) so the WebGL
 * scene reads them per frame without re-rendering React. The explosion
 * fades a dark backing plate — not the whole overlay — so the bursting
 * blocks stay crisp over the revealed hero until they dissolve.
 */
export default function Preloader() {
  const [count, setCount] = useState(0);
  const [done, setDone] = useState(false);
  // Hard skip: unmount with no animation. Needed for reduced motion and
  // hidden tabs — rAF pauses while a tab is hidden, so the counter would
  // never reach 100 and the overlay would sit there wedged.
  const [skipped, setSkipped] = useState(false);

  const progressRef = useRef({ p: 0, explode: 0 });
  const plateRef = useRef(null);
  const contentRef = useRef(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches || document.hidden) {
      setSkipped(true);
      return;
    }
    const onHide = () => {
      if (document.hidden) setSkipped(true);
    };
    document.addEventListener("visibilitychange", onHide);

    let frame;
    let alive = true;

    // The handoff: fling the blocks outward while the dark plate dissolves
    // into the hero, then unmount.
    const startExplode = () => {
      const start = performance.now();
      const dur = 900;
      const step = (now) => {
        if (!alive) return;
        const e = Math.min(1, (now - start) / dur);
        progressRef.current.explode = e;
        const eased = 1 - Math.pow(1 - e, 3);
        if (plateRef.current) plateRef.current.style.opacity = String(1 - eased);
        if (contentRef.current) contentRef.current.style.opacity = String(Math.max(0, 1 - e * 1.7));
        if (e < 1) frame = requestAnimationFrame(step);
        else setDone(true);
      };
      frame = requestAnimationFrame(step);
    };

    const start = performance.now();
    const duration = 1500;
    const tick = (now) => {
      if (!alive) return;
      const raw = Math.min(1, (now - start) / duration);
      // ease so the counter sprints then settles, like a press counter
      const eased = 1 - Math.pow(1 - raw, 3);
      progressRef.current.p = eased;
      setCount(Math.round(100 * eased));
      if (raw < 1) frame = requestAnimationFrame(tick);
      else setTimeout(() => alive && startExplode(), 320);
    };
    frame = requestAnimationFrame(tick);

    return () => {
      alive = false;
      cancelAnimationFrame(frame);
      document.removeEventListener("visibilitychange", onHide);
    };
  }, []);

  if (skipped || done) return null;

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 4000,
        pointerEvents: "none",
      }}
    >
      {/* Dark backing plate — dissolves at handoff to reveal the hero */}
      <div ref={plateRef} style={{ position: "absolute", inset: 0, background: "#0a0a0a" }} />

      {/* The blocks: compact into a mark, then explode outward */}
      <div style={{ position: "absolute", inset: 0 }}>
        <PreloaderScene progressRef={progressRef} />
      </div>

      {/* Wordmark + counter, anchored below the mark */}
      <div
        ref={contentRef}
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "flex-end",
          paddingBottom: "15vh",
          gap: "1.6rem",
        }}
      >
        <div style={{ color: "#f4efe6" }}>
          <Logo width="min(48vw, 17rem)" />
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "baseline",
            gap: "0.6rem",
            fontFamily: "var(--font-body)",
          }}
        >
          <span style={{ fontSize: "0.68rem", letterSpacing: "0.24em", textTransform: "uppercase", opacity: 0.7, color: "#f4efe6" }}>
            Led by Strategy. Built in Culture.
          </span>
          <span style={{ fontVariantNumeric: "tabular-nums", fontWeight: 600, color: "#efc835" }}>{count}%</span>
        </div>
      </div>
    </div>
  );
}
