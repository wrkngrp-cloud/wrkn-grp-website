"use client";

import { useId } from "react";
import { motion } from "framer-motion";

/*
 * Section divider: a run of melt streams pouring off a hairline,
 * graded gold → burnt orange → ember → amber shadow so it matches
 * the 3D hero's material. `flip` points the pour upward.
 * One drip per divider may carry the rare hot-red catch (`hotIndex`).
 */
const DRIPS = [
  { x: 6, w: 2.2, len: 46 },
  { x: 15, w: 3.4, len: 78 },
  { x: 24, w: 2.6, len: 34 },
  { x: 35, w: 4.2, len: 92 },
  { x: 46, w: 2.4, len: 52 },
  { x: 55, w: 3.8, len: 70 },
  { x: 66, w: 2.8, len: 100 },
  { x: 76, w: 3.2, len: 44 },
  { x: 86, w: 2.2, len: 64 },
  { x: 94, w: 3, len: 38 },
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
        viewBox="0 0 1000 120"
        preserveAspectRatio="none"
        style={{ width: "100%", height: "clamp(48px, 8vw, 110px)" }}
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
          <motion.rect
            key={i}
            x={d.x * 10 - d.w * 5}
            y="0"
            width={d.w * 10}
            rx={d.w * 5}
            fill={i === hotIndex ? `url(#melt-hot-${id})` : `url(#melt-${id})`}
            initial={{ height: 6 }}
            whileInView={{ height: d.len }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{
              duration: 1.3,
              delay: i * 0.06,
              ease: [0.22, 1, 0.36, 1],
            }}
          />
        ))}
      </svg>
    </div>
  );
}
