"use client";

import { useEffect, useRef, useState } from "react";

/*
 * A small musical signature above each capability on What We Do:
 * eighteen meter bars in the melt grade, each pattern shaped by what
 * the capability actually is. They grow in when the block reveals,
 * then idle with a faint meter shimmer. Wordless, decorative,
 * reduced-motion aware (see globals.css).
 */

const PATTERNS = [
  // 01 Music Production: a song's arc, verse into swell into release
  { bars: [0.2, 0.32, 0.26, 0.42, 0.38, 0.55, 0.48, 0.66, 0.78, 0.92, 0.84, 0.7, 0.58, 0.66, 0.46, 0.34, 0.26, 0.18] },
  // 02 Sonic Branding: the three-second sting, three notes out of silence
  { bars: [0.14, 0.12, 0.85, 0.16, 0.14, 0.12, 0.62, 0.95, 0.2, 0.14, 0.12, 0.16, 0.72, 0.14, 0.12, 0.16, 0.12, 0.14] },
  // 03 Audio Strategy: one motif, repeated at scale, a system
  { bars: [0.3, 0.55, 0.8, 0.3, 0.55, 0.8, 0.3, 0.55, 0.8, 0.3, 0.55, 0.8, 0.3, 0.55, 0.8, 0.3, 0.55, 0.8] },
  // 04 Film & Sync: a quiet score, then the sync moment lands (the hot bar)
  { bars: [0.2, 0.26, 0.22, 0.3, 0.24, 0.28, 0.22, 0.32, 0.26, 0.3, 0.98, 0.36, 0.28, 0.24, 0.28, 0.22, 0.26, 0.2], hot: 10 },
  // 05 Music Direction: thirty people to a sold-out room, one long crescendo
  { bars: [0.12, 0.16, 0.2, 0.24, 0.28, 0.34, 0.38, 0.44, 0.5, 0.55, 0.62, 0.68, 0.74, 0.8, 0.85, 0.9, 0.95, 1] },
];

function barColor(h, isHot) {
  if (isHot) return "var(--hot)";
  if (h > 0.72) return "var(--gold)";
  if (h > 0.42) return "var(--burnt)";
  return "var(--ember)";
}

export default function CapabilityMotif({ index = 0 }) {
  const ref = useRef(null);
  const [on, setOn] = useState(false);
  const p = PATTERNS[index % PATTERNS.length];

  useEffect(() => {
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setOn(true);
          io.disconnect();
        }
      },
      { rootMargin: "-60px" }
    );
    if (ref.current) io.observe(ref.current);
    return () => io.disconnect();
  }, []);

  return (
    <div ref={ref} className={`motif${on ? " on" : ""}`} aria-hidden>
      {p.bars.map((h, i) => (
        <span
          key={i}
          style={{
            height: `${Math.round(h * 100)}%`,
            background: barColor(h, p.hot === i),
            transitionDelay: `${i * 32}ms`,
            animationDelay: `${i * 140}ms`,
          }}
        />
      ))}
    </div>
  );
}
