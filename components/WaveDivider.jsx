"use client";

import { useState, useRef, useLayoutEffect, useMemo, useId } from "react";
import { motion, useReducedMotion } from "framer-motion";

/*
 * Section divider: a single signal passing through the black. A smooth
 * audio waveform, stroked (never filled), graded in the lollipop embers.
 *
 * Rendered in real pixels sized to the container, NOT a fixed viewBox
 * stretched with preserveAspectRatio="none". Stretching distorted the
 * wave on wide/landscape screens (bunched to the sides, flat through the
 * middle). Here the wavelength is fixed in px, so the signal reads at the
 * same density and proportion at any width, portrait or ultrawide. The
 * amplitude tapers to the baseline at both ends so the line lands clean.
 */

const HEIGHT = 120;
const MID = HEIGHT / 2;
const AMP = 26; // peak amplitude in px
const LAMBDA = 210; // px per primary cycle — fixed, so density is width-independent
const EDGE = 130; // px over which amplitude fades in/out at each end
const STEP = 5; // px between samples

function smoothstep(e0, e1, x) {
  const t = Math.min(1, Math.max(0, (x - e0) / (e1 - e0)));
  return t * t * (3 - 2 * t);
}

function buildPath(width) {
  const w = Math.max(320, Math.round(width));
  let d = "";
  for (let x = 0; x <= w; x += STEP) {
    // fade amplitude in over the first EDGE px and out over the last EDGE px
    const env = Math.min(smoothstep(0, EDGE, x), smoothstep(0, EDGE, w - x));
    const wave =
      Math.sin((x / LAMBDA) * Math.PI * 2) * 0.62 +
      Math.sin((x / (LAMBDA * 0.42)) * Math.PI * 2 + 1.1) * 0.26 +
      Math.sin((x / (LAMBDA * 2.3)) * Math.PI * 2 + 0.4) * 0.12;
    const y = MID - env * wave * AMP;
    d += `${x === 0 ? "M" : "L"} ${x} ${y.toFixed(2)} `;
  }
  return d.trim();
}

export default function WaveDivider({ flip = false }) {
  const id = useId().replace(/:/g, "");
  const reduce = useReducedMotion();
  const wrapRef = useRef(null);
  const [width, setWidth] = useState(1440); // SSR default; corrected on mount

  useLayoutEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const measure = () => setWidth(el.clientWidth || window.innerWidth);
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const path = useMemo(() => buildPath(width), [width]);
  const draw = reduce
    ? { pathLength: 1, opacity: 1 }
    : {
        pathLength: 1,
        opacity: 1,
        transition: {
          pathLength: { duration: 1.7, ease: [0.22, 1, 0.36, 1] },
          opacity: { duration: 0.4 },
        },
      };

  return (
    <div
      ref={wrapRef}
      aria-hidden
      style={{ lineHeight: 0, overflow: "hidden", transform: flip ? "scaleX(-1)" : undefined }}
    >
      <motion.svg
        width={width}
        height={HEIGHT}
        viewBox={`0 0 ${width} ${HEIGHT}`}
        preserveAspectRatio="none"
        style={{ width: "100%", height: "clamp(56px, 8vw, 116px)", display: "block", transformOrigin: "50% 50%" }}
        initial={reduce ? undefined : { scaleY: 1 }}
        animate={reduce ? undefined : { scaleY: [1, 1.05, 1], transition: { duration: 7, repeat: Infinity, ease: "easeInOut" } }}
      >
        <defs>
          <linearGradient id={`wave-${id}`} x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#5A2208" stopOpacity="0.2" />
            <stop offset="16%" stopColor="#C8560E" />
            <stop offset="42%" stopColor="#FC8A18" />
            <stop offset="50%" stopColor="#FCB828" />
            <stop offset="58%" stopColor="#FC8A18" />
            <stop offset="84%" stopColor="#C8560E" />
            <stop offset="100%" stopColor="#5A2208" stopOpacity="0.2" />
          </linearGradient>
        </defs>

        <line
          x1="0"
          y1={MID}
          x2={width}
          y2={MID}
          stroke={`url(#wave-${id})`}
          strokeWidth="1"
          strokeOpacity="0.16"
          vectorEffect="non-scaling-stroke"
        />

        <motion.path
          d={path}
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
        <motion.path
          d={path}
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
