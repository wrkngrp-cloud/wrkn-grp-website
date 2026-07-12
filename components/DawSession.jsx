"use client";

import { motion } from "framer-motion";

/*
 * The principles, staged as a session in an arrangement view: four
 * tracks land one by one as you scroll to them, each dropping a colored
 * clip onto the timeline with its own waveform. The session builds the
 * way a record does.
 */
const TRACK_COLORS = [
  { bar: "#FCA818", fill: "rgba(252,168,24,0.14)", wave: "#FCA818" },
  { bar: "#FC7818", fill: "rgba(252,120,24,0.13)", wave: "#FC7818" },
  { bar: "#A8460E", fill: "rgba(168,70,14,0.16)", wave: "#C97E5B" },
  { bar: "#FC5484", fill: "rgba(252,84,132,0.1)", wave: "#FC5484" },
];

// Deterministic pseudo-waveform so server and client agree
function waveHeights(seed, n = 42) {
  const out = [];
  for (let i = 0; i < n; i++) {
    const v =
      Math.abs(Math.sin(i * 0.83 + seed * 2.7)) * 0.6 +
      Math.abs(Math.sin(i * 2.19 + seed)) * 0.4;
    out.push(0.18 + v * 0.82);
  }
  return out;
}

function ClipWave({ color, seed }) {
  const heights = waveHeights(seed);
  return (
    <svg
      viewBox={`0 0 ${heights.length * 6} 40`}
      preserveAspectRatio="none"
      style={{ position: "absolute", inset: "6px 10px", width: "calc(100% - 20px)", height: "calc(100% - 12px)", opacity: 0.75 }}
      aria-hidden
    >
      {heights.map((h, i) => (
        <rect
          key={i}
          x={i * 6}
          y={20 - h * 18}
          width={3.4}
          height={h * 36}
          rx={1.6}
          fill={color}
        />
      ))}
    </svg>
  );
}

export default function DawSession({ tracks }) {
  return (
    <div className="daw" role="list">
      <div className="daw-ruler" aria-hidden>
        {["1", "5", "9", "13", "17", "21", "25", "29"].map((b) => (
          <span key={b}>{b}</span>
        ))}
      </div>

      {tracks.map((t, i) => {
        const c = TRACK_COLORS[i % TRACK_COLORS.length];
        return (
          <div className="daw-track" role="listitem" key={t.title}>
            <div className="daw-head">
              <span className="daw-lane-label">{t.lane}</span>
              <h3 className="daw-title">{t.title}</h3>
              <p className="daw-copy">{t.copy}</p>
            </div>
            <div className="daw-lane">
              <motion.div
                className="daw-clip"
                style={{
                  background: c.fill,
                  borderLeft: `3px solid ${c.bar}`,
                  marginLeft: `${i * 7}%`,
                }}
                initial={{ width: "3%", opacity: 0 }}
                whileInView={{ width: `${66 - i * 5}%`, opacity: 1 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{
                  duration: 1.1,
                  delay: 0.25 + i * 0.28,
                  ease: [0.22, 1, 0.36, 1],
                }}
              >
                <ClipWave color={c.wave} seed={i + 1} />
                <span className="daw-clip-name">{t.title}</span>
              </motion.div>
            </div>
          </div>
        );
      })}

      <div className="daw-foot" aria-hidden>
        <span className="daw-dot" /> Session · Sweetness Studios · 96 kHz
      </div>
    </div>
  );
}
