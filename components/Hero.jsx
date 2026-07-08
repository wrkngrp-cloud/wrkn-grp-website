"use client";

import Link from "next/link";
import { useRef } from "react";
import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion";
import GlowBlob from "./GlowBlob";
import Magnetic from "./Magnetic";
import SplitText from "./SplitText";
import CursorField from "./CursorField";

/*
 * Homepage hero: three parallax layers moving at different speeds —
 * dot-matrix (slowest), glow blob (cursor-driven), headline (fastest).
 */
export default function Hero() {
  const ref = useRef(null);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });

  const gridY = useTransform(scrollYProgress, [0, 1], [0, 80]);
  const headY = useTransform(scrollYProgress, [0, 1], [0, -180]);
  const headOpacity = useTransform(scrollYProgress, [0, 0.75], [1, 0]);

  return (
    <section
      ref={ref}
      className="theme-dark"
      style={{
        minHeight: "100svh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "flex-end",
        position: "relative",
        overflow: "hidden",
        paddingTop: "6rem",
      }}
    >
      <motion.div style={{ y: reduced ? 0 : gridY, position: "absolute", inset: 0 }} aria-hidden>
        <CursorField tone="dark" />
      </motion.div>
      <GlowBlob intensity={0.16} size={720} />

      <motion.div
        className="container"
        style={{
          y: reduced ? 0 : headY,
          opacity: reduced ? 1 : headOpacity,
          position: "relative",
          zIndex: 1,
          paddingBottom: "3rem",
        }}
      >
        <p className="eyebrow" style={{ marginBottom: "1.6rem" }}>
          Strategic Creative Partner — Lagos. Nairobi. London. Toronto. Dubai.
        </p>

        <h1 style={{ margin: 0 }}>
          <SplitText as="span" className="display display-xl" style={{ display: "block" }}>
            Led by Strategy.
          </SplitText>
          <SplitText as="span" className="display display-xl" delay={0.25} style={{ display: "block", color: "var(--gold)" }}>
            Built in Culture.
          </SplitText>
        </h1>

        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            alignItems: "flex-end",
            justifyContent: "space-between",
            gap: "2.5rem",
            marginTop: "3rem",
          }}
        >
          <motion.p
            className="lede"
            initial={reduced ? false : { opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
            style={{ maxWidth: "38rem", opacity: 0.85 }}
          >
            The strategic creative partner for challenger brands building in Africa. We help founders
            and CMOs move from having a product to having a point of view, from being seen, to being
            remembered.
          </motion.p>

          <motion.div
            initial={reduced ? false : { opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.85, duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
            style={{ display: "flex", alignItems: "center", gap: "2rem", flexWrap: "wrap" }}
          >
            <Magnetic>
              <Link href="/work" className="btn btn--gold">
                See the Work
              </Link>
            </Magnetic>
            <Link href="/contact" className="link-draw small-caps">
              Start a Conversation
            </Link>
          </motion.div>
        </div>
      </motion.div>

      <div className="container" style={{ position: "relative", zIndex: 1 }}>
        <div className="wayfinding" style={{ opacity: 0.6 }}>
          <span>WRKN GRP — Working Group</span>
          <span>Scroll</span>
        </div>
      </div>
    </section>
  );
}
