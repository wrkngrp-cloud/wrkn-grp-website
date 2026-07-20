"use client";

import { useId } from "react";
import { motion, useReducedMotion } from "framer-motion";

/*
 * Section divider: a single signal passing through the black. A smooth
 * audio waveform, stroked (never filled), amplitude peaking at centre and
 * tapering to a flat baseline at both edges, graded in the lollipop embers.
 * It draws itself in on scroll, then breathes almost imperceptibly. This
 * replaces the old drip: quieter, on-theme for a sound studio, and it reads
 * as craft rather than decoration.
 */

const W = 1000;
const MID = 60;
const STEPS = 260;

// Build the waveform once, deterministically, so server and client match.
// A few detuned harmonics under a raised-cosine window: organic, but it
// always resolves to zero at both ends so the line lands clean on the rule.
function buildWave(amp) {
  let d = "";
  for (let i = 0; i <= STEPS; i++) {
    const t = i / STEPS; // 0..1
    const x = t * W;
    const envelope = 0.5 * (1 - Math.cos(2 * Math.PI * t)); // 0 → 1 → 0
    const wave =
      Math.sin(t * Math.PI * 2 * 3 + 0.2) * 0.6 +
      Math.sin(t * Math.PI * 2 * 7 + 1.1) * 0.28 +
      Math.sin(t * Math.PI * 2 * 13 + 2.3) * 0.12;
    const y = MID - envelope * wave * amp;
    d += `${i === 0 ? "M" : "L"} ${x.toFixed(2)} ${y.toFixed(2)} `;
  }
  return d.trim();
}

const PATH = buildWave(40);

export default function WaveDivider({ flip = false }) {
  const id = useId().replace(/:/g, "");
  const reduce = useReducedMotion();

  const draw = reduce
    ? { pathLength: 1, opacity: 1 }
    : {
        pathLength: 1,
        opacity: 1,
        transition: { pathLength: { duration: 1.7, ease: [0.22, 1, 0.36, 1] }, opacity: { duration: 0.4 } },
      };

  return (
    <div
      aria-hidden
      style={{
        lineHeight: 0,
        overflow: "hidden",
        transform: flip ? "scaleX(-1)" : undefined,
      }}
    >
      <motion.svg
        viewBox="0 0 1000 120"
        preserveAspectRatio="none"
        initial={reduce ? undefined : { scaleY: 1 }}
        animate={
          reduce
            ? undefined
            : { scaleY: [1, 1.05, 1], transition: { duration: 7, repeat: Infinity, ease: "easeInOut" } }
        }
        style={{ width: "100%", height: "clamp(64px, 9vw, 128px)", display: "block", transformOrigin: "50% 50%" }}
      >
        <defs>
          <linearGradient id={`wave-${id}`} x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#5A2208" stopOpacity="0.25" />
            <stop offset="18%" stopColor="#C8560E" />
            <stop offset="42%" stopColor="#FC8A18" />
            <stop offset="50%" stopColor="#FCB828" />
            <stop offset="58%" stopColor="#FC8A18" />
            <stop offset="82%" stopColor="#C8560E" />
            <stop offset="100%" stopColor="#5A2208" stopOpacity="0.25" />
          </linearGradient>
        </defs>

        {/* faint baseline the signal rides on */}
        <line
          x1="0"
          y1={MID}
          x2={W}
          y2={MID}
          stroke={`url(#wave-${id})`}
          strokeWidth="1"
          strokeOpacity="0.18"
          vectorEffect="non-scaling-stroke"
        />

        {/* soft under-stroke for glow */}
        <motion.path
          d={PATH}
          fill="none"
          stroke={`url(#wave-${id})`}
          strokeWidth="5"
          strokeOpacity="0.22"
          strokeLinecap="round"
          vectorEffect="non-scaling-stroke"
          initial={reduce ? undefined : { pathLength: 0, opacity: 0 }}
          whileInView={draw}
          viewport={{ once: true, margin: "-60px" }}
        />

        {/* crisp signal */}
        <motion.path
          d={PATH}
          fill="none"
          stroke={`url(#wave-${id})`}
          strokeWidth="1.75"
          strokeLinecap="round"
          strokeLinejoin="round"
          vectorEffect="non-scaling-stroke"
          initial={reduce ? undefined : { pathLength: 0, opacity: 0 }}
          whileInView={draw}
          viewport={{ once: true, margin: "-60px" }}
        />
      </motion.svg>
    </div>
  );
}
