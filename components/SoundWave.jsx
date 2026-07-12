"use client";

import { useEffect, useRef } from "react";

/*
 * The sound made visible: flowing liquid waveform ribbons in the melt
 * grade. Same physics-of-feeling as the lollipop — soft, viscous, never
 * still. Amplitude swells as the element crosses the middle of the
 * viewport, so scrolling "plays" it.
 */
const RIBBONS = [
  { color: "252,168,24", amp: 1.0, speed: 0.55, freq: 1.6, width: 2.2, alpha: 0.85 },
  { color: "252,120,24", amp: 0.75, speed: 0.4, freq: 2.3, width: 1.8, alpha: 0.6 },
  { color: "168,70,14", amp: 1.25, speed: 0.3, freq: 1.1, width: 1.6, alpha: 0.5 },
  { color: "252,84,132", amp: 0.5, speed: 0.7, freq: 3.1, width: 1.2, alpha: 0.35 },
];

export default function SoundWave({ height = 180 }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    let w, h, dpr, frame;

    const resize = () => {
      dpr = Math.min(2, window.devicePixelRatio || 1);
      const rect = canvas.getBoundingClientRect();
      w = canvas.width = rect.width * dpr;
      h = canvas.height = rect.height * dpr;
    };
    resize();
    window.addEventListener("resize", resize);

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const start = performance.now();

    const draw = (now) => {
      const t = ((now - start) / 1000) * (reduced ? 0.15 : 1);

      // Swell with viewport position: full voice mid-screen, hush at edges
      const rect = canvas.getBoundingClientRect();
      const mid = rect.top + rect.height / 2;
      const closeness =
        1 - Math.min(1, Math.abs(mid - window.innerHeight / 2) / (window.innerHeight * 0.7));
      const swell = 0.35 + 0.65 * closeness;

      ctx.clearRect(0, 0, w, h);
      ctx.globalCompositeOperation = "lighter";

      RIBBONS.forEach((r, ri) => {
        ctx.beginPath();
        const baseAmp = (h / 2) * 0.55 * r.amp * swell;
        for (let x = 0; x <= w; x += 4 * dpr) {
          const u = x / w;
          // Two detuned sines + a slow drift = a wave that feels played,
          // not looped
          const y =
            h / 2 +
            Math.sin(u * Math.PI * 2 * r.freq + t * r.speed * 2.2 + ri * 1.7) *
              baseAmp *
              Math.sin(u * Math.PI) + // pinch to silence at both ends
            Math.sin(u * Math.PI * 2 * (r.freq * 2.7) - t * r.speed * 1.3) *
              baseAmp *
              0.18 *
              Math.sin(u * Math.PI);
          if (x === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.strokeStyle = `rgba(${r.color},${r.alpha * swell})`;
        ctx.lineWidth = r.width * dpr;
        ctx.stroke();
      });

      frame = requestAnimationFrame(draw);
    };
    frame = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      style={{ width: "100%", height, display: "block" }}
    />
  );
}
