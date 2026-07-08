"use client";

import { useRef, useState } from "react";
import dynamic from "next/dynamic";
import {
  motion,
  useScroll,
  useTransform,
  useMotionValueEvent,
  useReducedMotion,
} from "framer-motion";
import Logo from "./Logo";
import CursorField from "./CursorField";

const AssemblyScene = dynamic(() => import("./AssemblyScene"), { ssr: false });

/*
 * The signature scroll mechanic, WebGL edition.
 *
 * Thirteen lit ceramic blocks — each tagged as a piece of execution —
 * start scattered through 3D space and travel into the modular W as
 * the visitor scrolls the pinned section. The gold block, the one true
 * thing, lands last. Then the mark resolves into the actual wordmark.
 *
 * The argument of the whole firm, made physical: the parts are just
 * noise until cultural intelligence tunes them into one resonant brand.
 */

// col, row, scatter dx/dy/dz, scatter rotations (z, x, y axes), label, gold flag.
// Every brick carries its label on its face — a piece of execution.
// The gold brick is the cultural through-line the rest take their key from.
export const BLOCKS = [
  { c: 0, r: 0, dx: -420, dy: -260, dz: -380, rot: -38, rx: 70, ry: -50, label: "Identity" },
  { c: 6, r: 0, dx: 430, dy: -300, dz: 240, rot: 44, rx: -60, ry: 80, label: "Campaign" },
  { c: 0, r: 1, dx: -520, dy: 60, dz: 180, rot: 25, rx: -45, ry: 60, label: "Illustration" },
  { c: 6, r: 1, dx: 500, dy: 10, dz: -300, rot: -30, rx: 85, ry: -40, label: "Social" },
  { c: 0, r: 2, dx: -350, dy: 320, dz: 320, rot: 60, rx: -75, ry: -65, label: "Motion" },
  { c: 3, r: 2, dx: 40, dy: 390, dz: 520, rot: -90, rx: 120, ry: 90, gold: true, label: "One True Thing" },
  { c: 6, r: 2, dx: 380, dy: 300, dz: -260, rot: -52, rx: 55, ry: 70, label: "Print" },
  { c: 0, r: 3, dx: -240, dy: 430, dz: -180, rot: 18, rx: -90, ry: 45, label: "Editorial" },
  { c: 2, r: 3, dx: -120, dy: -380, dz: 280, rot: 74, rx: 65, ry: -85, label: "Decks" },
  { c: 4, r: 3, dx: 150, dy: -320, dz: -340, rot: -66, rx: -55, ry: 75, label: "Digital" },
  { c: 6, r: 3, dx: 260, dy: 420, dz: 200, rot: 36, rx: 80, ry: -60, label: "Type" },
  { c: 1, r: 4, dx: -460, dy: 200, dz: -420, rot: -20, rx: -70, ry: 55, label: "Events" },
  { c: 5, r: 4, dx: 440, dy: 160, dz: 300, rot: 48, rx: 60, ry: -45, label: "Voice" },
];

const PHASES = ["Scattered Pieces", "Tuned to Culture", "One Thing, Remembered"];

export default function AssemblySequence() {
  const wrapperRef = useRef(null);
  const progressRef = useRef(0);
  const reduced = useReducedMotion();
  const [phase, setPhase] = useState(0);

  const { scrollYProgress } = useScroll({
    target: wrapperRef,
    offset: ["start start", "end end"],
  });

  useMotionValueEvent(scrollYProgress, "change", (v) => {
    progressRef.current = v;
    setPhase(v < 0.34 ? 0 : v < 0.64 ? 1 : 2);
  });

  const progressScale = useTransform(scrollYProgress, [0, 1], [0, 1]);

  // Caption opacities for the three narrative beats
  const capA = useTransform(scrollYProgress, [0, 0.24, 0.32], [1, 1, 0]);
  const capB = useTransform(scrollYProgress, [0.34, 0.42, 0.56, 0.64], [0, 1, 1, 0]);
  const capC = useTransform(scrollYProgress, [0.68, 0.78], [0, 1]);
  const capAY = useTransform(scrollYProgress, [0.24, 0.34], [0, -30]);
  const capCY = useTransform(scrollYProgress, [0.68, 0.8], [30, 0]);

  // Final beat: the 3D mark gives way to the actual wordmark
  const sceneOpacity = useTransform(scrollYProgress, [0.8, 0.9], [1, 0]);
  const logoOpacity = useTransform(scrollYProgress, [0.84, 0.94], [0, 1]);
  const logoScale = useTransform(scrollYProgress, [0.84, 0.96], [1.05, 1]);
  const underline = useTransform(scrollYProgress, [0.8, 0.95], [0, 1]);

  if (reduced) {
    return (
      <section className="theme-dark container" style={{ padding: "8rem var(--gutter)", textAlign: "center" }}>
        <div style={{ display: "flex", justifyContent: "center", color: "var(--cream)" }}>
          <Logo width="min(60vw, 22rem)" />
        </div>
        <p className="lede" style={{ maxWidth: "36ch", margin: "2.5rem auto 0" }}>
          One thing. Everywhere. Remembered. Cultural intelligence tunes every part of a brand into one resonant whole.
        </p>
      </section>
    );
  }

  return (
    <section ref={wrapperRef} aria-label="How cultural intelligence harmonises a brand" style={{ height: "420vh", position: "relative" }}>
      <div
        style={{
          position: "sticky",
          top: 0,
          height: "100vh",
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
          background: "var(--black)",
        }}
      >
        <CursorField tone="dark" opacity={0.8} />

        {/* Top wayfinding: phase indicator */}
        <div className="container" style={{ width: "100%", position: "relative", zIndex: 3 }}>
          <div className="wayfinding" style={{ marginTop: "4.6rem" }}>
            <span>The Mechanic</span>
            <span style={{ color: "var(--gold)" }}>
              {String(phase + 1).padStart(2, "0")} / {PHASES[phase]}
            </span>
          </div>
        </div>

        {/* Stage */}
        <div style={{ flex: 1, position: "relative" }}>
          {/* WebGL scene, full bleed */}
          <motion.div style={{ position: "absolute", inset: 0, opacity: sceneOpacity, zIndex: 1 }}>
            <AssemblyScene progressRef={progressRef} blocks={BLOCKS} />
          </motion.div>

          {/* Caption A — scattered */}
          <motion.div style={{ opacity: capA, y: capAY, ...captionStyle, top: "6%" }}>
            <h2 className="display display-md">A brand isn&rsquo;t the pieces.</h2>
            <p style={{ opacity: 0.7, marginTop: "0.8rem", maxWidth: "44ch" }}>
              Identity here. Motion there. A campaign somewhere else. Each one sharp on its own. Together, noise. And noise doesn&rsquo;t stick.
            </p>
          </motion.div>

          {/* Caption B — cultural intelligence tunes the parts into harmony */}
          <motion.div style={{ opacity: capB, ...captionStyle, top: "6%" }}>
            <h2 className="display display-md">
              Everything in the same <em>key</em>.
            </h2>
            <p style={{ opacity: 0.7, marginTop: "0.8rem", maxWidth: "46ch" }}>
              Cultural intelligence is the edge. We tune every part of a brand to the same cultural key, so the
              pieces resonate instead of compete, relevant to the moment, and felt before they&rsquo;re read.
            </p>
          </motion.div>

          {/* Wordmark resolve */}
          <motion.div
            style={{
              position: "absolute",
              inset: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              opacity: logoOpacity,
              scale: logoScale,
              color: "var(--cream)",
              zIndex: 2,
              pointerEvents: "none",
            }}
          >
            <Logo width="min(58vw, 26rem)" />
          </motion.div>

          {/* Caption C — assembled */}
          <motion.div style={{ opacity: capC, y: capCY, ...captionStyle, bottom: "9%" }}>
            <h2 className="display display-md">
              One thing. Everywhere. <em style={{ color: "var(--gold)" }}>Remembered.</em>
            </h2>
            <motion.div
              style={{
                scaleX: underline,
                transformOrigin: "left",
                height: 2,
                background: "var(--gold)",
                width: "38%",
                margin: "1.1rem auto 0",
              }}
            />
          </motion.div>
        </div>

        {/* Bottom wayfinding + scroll progress hairline */}
        <div className="container" style={{ width: "100%", paddingBottom: "1.2rem", position: "relative", zIndex: 3 }}>
          <div style={{ height: 1, background: "var(--cream-faint)", position: "relative", marginBottom: "0.8rem" }}>
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
            <span style={{ opacity: 0.5 }}>Keep scrolling</span>
            <span style={{ opacity: 0.5 }}>Led by Strategy. Built in Culture.</span>
          </div>
        </div>
      </div>
    </section>
  );
}

const captionStyle = {
  position: "absolute",
  left: "var(--gutter)",
  right: "var(--gutter)",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  textAlign: "center",
  zIndex: 2,
  pointerEvents: "none",
};
