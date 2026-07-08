"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import {
  AnimatePresence,
  motion,
  useScroll,
  useTransform,
  useMotionValueEvent,
  useReducedMotion,
} from "framer-motion";
import CursorField from "./CursorField";
import Reveal from "./Reveal";

const LadderScene = dynamic(() => import("./LadderScene"), { ssr: false });

/*
 * Section 04 — the service ladder as a pinned 3D climb.
 *
 * The section pins for ~340vh while scroll climbs a WebGL ladder rung
 * by rung. The rung underfoot turns gold and pulls forward; the panel
 * alongside swaps to that product's name and one-line summary.
 */

const PRODUCTS = [
  {
    n: "01",
    name: "Brand Positioning Workshop",
    sum: "A structured two-hour session that pins down what you stand for, who it's for, and what makes you irreplaceable.",
  },
  {
    n: "02",
    name: "Brand Strategy Sprint",
    sum: "A focused multi-week intensive producing the complete strategy: positioning, narrative architecture, messaging.",
  },
  {
    n: "03",
    name: "Creative Advisory Retainer",
    sum: "Ongoing monthly advisory. Where the deepest work happens, over time, not in a sprint.",
  },
  {
    n: "04",
    name: "Campaign Strategy & Brand Initiatives",
    sum: "360° campaign architecture for brands that know their positioning and are ready to act from it.",
  },
  {
    n: "05",
    name: "Fractional CMO",
    sum: "WRKN GRP as your marketing leadership. Executive responsibility, not advisory.",
  },
];

export default function HomeLadder() {
  const wrapperRef = useRef(null);
  const progressRef = useRef(0);
  const reduced = useReducedMotion();
  const [active, setActive] = useState(0);

  const { scrollYProgress } = useScroll({
    target: wrapperRef,
    offset: ["start start", "end end"],
  });

  useMotionValueEvent(scrollYProgress, "change", (v) => {
    progressRef.current = v;
    setActive(Math.min(PRODUCTS.length - 1, Math.max(0, Math.floor(v * PRODUCTS.length))));
  });

  const progressScale = useTransform(scrollYProgress, [0, 1], [0, 1]);
  const item = PRODUCTS[active];

  // Reduced motion: the flat editorial grid, no pin, no WebGL
  if (reduced) {
    return (
      <section className="theme-cream" style={{ padding: "6rem 0" }}>
        <div className="container">
          <div className="wayfinding wayfinding--bottom" style={{ marginBottom: "3rem" }}>
            <span>04 — What We Do</span>
            <span>The Ladder</span>
          </div>
          <h2 className="display display-md" style={{ maxWidth: "18ch", marginBottom: "3rem" }}>
            Every product leads to the next.
          </h2>
          <div className="products-grid">
            {PRODUCTS.map((p) => (
              <Link href="/services" key={p.n} className="product-card">
                <span className="display product-card__n">{p.n}</span>
                <span className="display product-card__name">{p.name}</span>
                <span className="product-card__sum">{p.sum}</span>
              </Link>
            ))}
          </div>
          <Link href="/services" className="link-draw small-caps" style={{ marginTop: "2.5rem", display: "inline-block" }}>
            See How the Ladder Works →
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section ref={wrapperRef} className="theme-cream" style={{ height: "340vh", position: "relative" }}>
      <div
        style={{
          position: "sticky",
          top: 0,
          height: "100vh",
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
          background: "var(--cream)",
        }}
      >
        <CursorField tone="cream" opacity={0.55} />

        <div className="container" style={{ width: "100%", position: "relative", zIndex: 3 }}>
          <div className="wayfinding" style={{ marginTop: "4.6rem" }}>
            <span>04 — What We Do</span>
            <span style={{ color: "#b8960f" }}>The Ladder — Rung {item.n} / 05</span>
          </div>
        </div>

        {/* Stage: text panel + ladder */}
        <div className="home-ladder__stage container">
          <div className="home-ladder__panel">
            <p className="small-caps" style={{ opacity: 0.55, marginBottom: "1.2rem" }}>
              Every product leads to the next
            </p>
            <AnimatePresence mode="wait">
              <motion.div
                key={active}
                initial={{ opacity: 0, y: 28 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              >
                <span
                  className="display"
                  aria-hidden
                  style={{
                    fontStyle: "italic",
                    fontSize: "clamp(3.4rem, 9vw, 6.5rem)",
                    lineHeight: 0.9,
                    color: "#b8960f",
                    display: "block",
                  }}
                >
                  {item.n}
                </span>
                <h3 className="display display-sm" style={{ margin: "1.2rem 0 0.9rem", maxWidth: "16ch" }}>
                  {item.name}
                </h3>
                <p style={{ maxWidth: "44ch", opacity: 0.8, fontSize: "1.02rem" }}>{item.sum}</p>
              </motion.div>
            </AnimatePresence>
            <Link
              href="/services"
              className="link-draw small-caps"
              style={{ marginTop: "1.8rem", display: "inline-block" }}
            >
              See How the Ladder Works →
            </Link>
          </div>

          <div className="home-ladder__scene">
            <LadderScene progressRef={progressRef} />
          </div>
        </div>

        {/* Progress hairline */}
        <div className="container" style={{ width: "100%", paddingBottom: "1.2rem", position: "relative", zIndex: 3 }}>
          <div style={{ height: 1, background: "var(--black-faint)", position: "relative", marginBottom: "0.8rem" }}>
            <motion.div
              style={{
                position: "absolute",
                inset: 0,
                background: "var(--gold)",
                scaleX: progressScale,
                transformOrigin: "left",
              }}
            />
          </div>
          <div style={{ display: "flex", justifyContent: "space-between" }} className="small-caps">
            <span style={{ opacity: 0.5 }}>Keep climbing</span>
            <span style={{ opacity: 0.5 }}>Strategy First, Always</span>
          </div>
        </div>
      </div>
    </section>
  );
}
