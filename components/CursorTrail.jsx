"use client";

import { useEffect, useRef } from "react";

/*
 * Viscous melt trail — Home and Releases only.
 * Blobs spawn along the pointer's path, sag downward under their own
 * weight, and fade through the material grade: gold → burnt orange →
 * ember → amber shadow. Drawn additively so overlaps glow like lit candy.
 */
const GRADE = [
  [252, 168, 24], // #FCA818 gold
  [252, 120, 24], // #FC7818 burnt orange
  [168, 70, 14], // #A8460E ember
  [56, 14, 0], // #380E00 amber shadow
];

function gradeAt(t) {
  const seg = Math.min(GRADE.length - 2, Math.floor(t * (GRADE.length - 1)));
  const f = t * (GRADE.length - 1) - seg;
  const a = GRADE[seg];
  const b = GRADE[seg + 1];
  return [
    a[0] + (b[0] - a[0]) * f,
    a[1] + (b[1] - a[1]) * f,
    a[2] + (b[2] - a[2]) * f,
  ];
}

export default function CursorTrail() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const fine = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!fine || reduced) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    let w, h, dpr;

    const resize = () => {
      dpr = Math.min(2, window.devicePixelRatio || 1);
      w = canvas.width = window.innerWidth * dpr;
      h = canvas.height = window.innerHeight * dpr;
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
    };
    resize();
    window.addEventListener("resize", resize);

    const blobs = [];
    const pos = { x: -100, y: -100, px: -100, py: -100 };

    const onMove = (e) => {
      pos.px = pos.x;
      pos.py = pos.y;
      pos.x = e.clientX;
      pos.y = e.clientY;
      const dist = Math.hypot(pos.x - pos.px, pos.y - pos.py);
      // Seed blobs along the path so fast moves stay a continuous stream
      const steps = Math.min(6, Math.max(1, Math.round(dist / 14)));
      for (let i = 0; i < steps; i++) {
        const f = i / steps;
        blobs.push({
          x: pos.px + (pos.x - pos.px) * f,
          y: pos.py + (pos.y - pos.py) * f,
          r: 7 + Math.random() * 9,
          life: 1,
          vy: 0.25 + Math.random() * 0.5, // the sag: melt runs downhill
          vx: (Math.random() - 0.5) * 0.3,
        });
      }
      if (blobs.length > 220) blobs.splice(0, blobs.length - 220);
    };

    let frame;
    const tick = () => {
      ctx.clearRect(0, 0, w, h);
      ctx.globalCompositeOperation = "lighter";

      for (let i = blobs.length - 1; i >= 0; i--) {
        const b = blobs[i];
        b.life -= 0.016;
        if (b.life <= 0) {
          blobs.splice(i, 1);
          continue;
        }
        b.y += b.vy; // viscous drop
        b.x += b.vx;
        b.vy *= 1.012; // slowly accelerating, like a drip letting go

        const t = 1 - b.life;
        const [r, g, bl] = gradeAt(t);
        const radius = b.r * (0.55 + b.life * 0.45) * dpr;
        const grad = ctx.createRadialGradient(
          b.x * dpr,
          b.y * dpr,
          0,
          b.x * dpr,
          b.y * dpr,
          radius
        );
        grad.addColorStop(0, `rgba(${r | 0},${g | 0},${bl | 0},${0.5 * b.life})`);
        grad.addColorStop(1, `rgba(${r | 0},${g | 0},${bl | 0},0)`);
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(b.x * dpr, b.y * dpr, radius, 0, Math.PI * 2);
        ctx.fill();
      }

      frame = requestAnimationFrame(tick);
    };

    window.addEventListener("mousemove", onMove, { passive: true });
    frame = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 2500,
        pointerEvents: "none",
      }}
    />
  );
}
