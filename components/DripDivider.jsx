"use client";

import { useId } from "react";
import { motion } from "framer-motion";

/*
 * Section divider: a liquid edge pouring off a hairline. Each drip is a
 * curved hanging blob — soft shoulders, a fat rounded belly — not a bar,
 * and a few droplets detach and fall on a loop so the melt never reads
 * static. Graded gold → burnt orange → ember → amber shadow to match
 * the 3D hero's material. One drip per divider may carry the rare
 * hot-red catch (`hotIndex`).
 */
const DRIPS = [
  { x: 55, w: 16, d: 46 },
  { x: 145, w: 26, d: 84 },
  { x: 240, w: 18, d: 34 },
  { x: 350, w: 30, d: 96 },
  { x: 462, w: 18, d: 52 },
  { x: 552, w: 26, d: 72 },
  { x: 660, w: 22, d: 104 },
  { x: 762, w: 24, d: 44 },
  { x: 862, w: 16, d: 64 },
  { x: 944, w: 22, d: 38 },
];

// A hanging blob: down the left shoulder, around the belly, back up.
function blobPath({ x, w, d }) {
  const half = w / 2;
  return [
    `M ${x - half - w * 0.4} 0`,
    // left shoulder easing off the ceiling into the neck
    `C ${x - half} 0 ${x - half * 0.9} ${d * 0.28} ${x - half * 0.82} ${d * 0.55}`,
    // left side of the belly down to the rounded tip
    `C ${x - half * 0.78} ${d * 0.85} ${x - half * 0.5} ${d} ${x} ${d}`,
    // right side back up
    `C ${x + half * 0.5} ${d} ${x + half * 0.78} ${d * 0.85} ${x + half * 0.82} ${d * 0.55}`,
    `C ${x + half * 0.9} ${d * 0.28} ${x + half} 0 ${x + half + w * 0.4} 0`,
    "Z",
  ].join(" ");
}

// Which drips shed a falling droplet, and on what rhythm.
const DROPLETS = [
  { drip: 1, dur: 4.2, delay: 0.6 },
  { drip: 3, dur: 5.1, delay: 2.1 },
  { drip: 6, dur: 4.7, delay: 3.4 },
];

export default function DripDivider({ flip = false, hotIndex = -1 }) {
  const id = useId().replace(/:/g, "");

  return (
    <div
      aria-hidden
      style={{
        transform: flip ? "scaleY(-1)" : undefined,
        lineHeight: 0,
        overflow: "hidden",
      }}
    >
      <svg
        viewBox="0 0 1000 190"
        preserveAspectRatio="none"
        style={{ width: "100%", height: "clamp(64px, 10vw, 150px)" }}
      >
        <defs>
          <linearGradient id={`melt-${id}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#FCA818" />
            <stop offset="30%" stopColor="#FC7818" />
            <stop offset="62%" stopColor="#A8460E" />
            <stop offset="88%" stopColor="#380E00" />
            <stop offset="100%" stopColor="#2A0E00" />
          </linearGradient>
          <linearGradient id={`melt-hot-${id}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#FC2418" />
            <stop offset="55%" stopColor="#A8460E" />
            <stop offset="100%" stopColor="#2A0E00" />
          </linearGradient>
        </defs>

        <rect x="0" y="0" width="1000" height="3" fill={`url(#melt-${id})`} />

        {DRIPS.map((d, i) => (
          <motion.path
            key={i}
            d={blobPath(d)}
            fill={i === hotIndex ? `url(#melt-hot-${id})` : `url(#melt-${id})`}
            initial={{ scaleY: 0.12 }}
            whileInView={{ scaleY: 1 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{
              duration: 1.5,
              delay: i * 0.07,
              ease: [0.22, 1, 0.36, 1],
            }}
            style={{ transformOrigin: "50% 0%" }}
          />
        ))}

        {DROPLETS.map((dp, i) => {
          const d = DRIPS[dp.drip];
          return (
            <motion.ellipse
              key={`drop-${i}`}
              cx={d.x}
              rx={d.w * 0.22}
              ry={d.w * 0.3}
              fill={
                dp.drip === hotIndex
                  ? `url(#melt-hot-${id})`
                  : `url(#melt-${id})`
              }
              initial={{ cy: d.d + 6, opacity: 0 }}
              animate={{ cy: d.d + 80, opacity: [0, 0.9, 0.9, 0] }}
              transition={{
                duration: dp.dur * 0.4,
                delay: dp.delay,
                repeat: Infinity,
                repeatDelay: dp.dur * 0.6,
                ease: [0.5, 0, 0.9, 0.4],
              }}
            />
          );
        })}
      </svg>
    </div>
  );
}
