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
    // Camera walks linearly from the first checkpoint to the last, so the
    // active product is the nearest checkpoint — round, not floor.
    setActive(Math.min(PRODUCTS.length - 1, Math.max(0, Math.round(v * (PRODUCTS.length - 1)))));
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
    <section ref={wrapperRef} className="theme-cream" style={{ height: "460vh", position: "relative" }}>
      <div
        style={{
          position: "sticky",
          top: 0,
          height: "100vh",
          overflow: "hidden",
          background: "var(--cream)",
        }}
      >
        {/* Full-bleed corridor you climb through */}
        <div style={{ position: "absolute", inset: 0, zIndex: 0 }}>
          <LadderScene progressRef={progressRef} />
        </div>

        {/* Cream scrims: frame the corridor and keep the copy legible */}
        <div
          aria-hidden
          style={{
            position: "absolute",
            inset: 0,
            zIndex: 1,
            pointerEvents: "none",
            background:
              "linear-gradient(102deg, var(--cream) 0%, rgba(244,239,230,0.9) 22%, rgba(244,239,230,0.28) 44%, rgba(244,239,230,0) 60%)",
          }}
        />
        <div
          aria-hidden
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            top: 0,
            height: "30%",
            zIndex: 1,
            pointerEvents: "none",
            background: "linear-gradient(var(--cream) 8%, rgba(244,239,230,0))",
          }}
        />
        <div
          aria-hidden
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            bottom: 0,
            height: "22%",
            zIndex: 1,
            pointerEvents: "none",
            background: "linear-gradient(rgba(244,239,230,0), var(--cream))",
          }}
        />

        {/* Top wayfinding */}
        <div className="container" style={{ position: "absolute", top: 0, left: 0, right: 0, zIndex: 3, pointerEvents: "none" }}>
          <div className="wayfinding" style={{ marginTop: "4.6rem" }}>
            <span>04 — What We Do</span>
            <span style={{ color: "#8a6d0a" }}>The Ascent — Step {item.n} / 05</span>
          </div>
        </div>

        {/* The copy pops up over the climb, one product at a time */}
        <div
          className="container"
          style={{ position: "absolute", inset: 0, zIndex: 3, display: "flex", alignItems: "center", pointerEvents: "none" }}
        >
          <div style={{ maxWidth: "32rem" }}>
            <p className="small-caps" style={{ opacity: 0.55, marginBottom: "1.2rem" }}>
              Every product leads to the next
            </p>
            <AnimatePresence mode="wait">
              <motion.div
                key={active}
                initial={{ opacity: 0, y: 28, filter: "blur(3px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                exit={{ opacity: 0, y: -18, filter: "blur(3px)" }}
                transition={{ duration: 0.42, ease: [0.16, 1, 0.3, 1] }}
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
                <p style={{ maxWidth: "40ch", opacity: 0.82, fontSize: "1.02rem" }}>{item.sum}</p>
              </motion.div>
            </AnimatePresence>
            <Link
              href="/services"
              className="link-draw small-caps"
              style={{ marginTop: "1.8rem", display: "inline-block", pointerEvents: "auto" }}
            >
              See How the Ladder Works →
            </Link>
          </div>
        </div>

        {/* Progress hairline */}
        <div className="container" style={{ position: "absolute", bottom: 0, left: 0, right: 0, paddingBottom: "1.2rem", zIndex: 3, pointerEvents: "none" }}>
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
