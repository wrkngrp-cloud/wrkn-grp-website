"use client";

import { useEffect, useRef } from "react";

/*
 * Cursor-reactive dot field. A grid of dots fills the parent section:
 * dots near the cursor are pushed away (with eased spring-back) and
 * warm toward gold; the whole field carries a slow autonomous drift so
 * it is alive even before the cursor arrives. Canvas 2D — cheap enough
 * to run in several sections at once.
 *
 * Parent must be position:relative. `tone` matches the section theme.
 */
export default function CursorField({ tone = "dark", opacity = 1 }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const parent = canvas.parentElement;
    const ctx = canvas.getContext("2d");
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const DPR = Math.min(window.devicePixelRatio || 1, 2);
    const GAP = 38;
    const PUSH = 26;
    const RADIUS = 170;

    const base = tone === "dark" ? [244, 239, 230] : [10, 10, 10];
    const gold = [239, 200, 53];
    const baseAlpha = tone === "dark" ? 0.16 : 0.2;

    let W = 0;
    let H = 0;
    let dots = [];
    let raf;
    const mouse = { x: -9999, y: -9999, tx: -9999, ty: -9999 };

    const resize = () => {
      const r = parent.getBoundingClientRect();
      W = r.width;
      H = r.height;
      canvas.width = W * DPR;
      canvas.height = H * DPR;
      canvas.style.width = `${W}px`;
      canvas.style.height = `${H}px`;
      ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
      dots = [];
      for (let x = GAP / 2; x < W; x += GAP) {
        for (let y = GAP / 2; y < H; y += GAP) {
          dots.push({ x, y, ox: 0, oy: 0, phase: (x * 13 + y * 7) % (Math.PI * 2) });
        }
      }
      if (reduced) drawStatic();
    };

    const drawStatic = () => {
      ctx.clearRect(0, 0, W, H);
      ctx.fillStyle = `rgba(${base[0]},${base[1]},${base[2]},${baseAlpha})`;
      for (const d of dots) {
        ctx.beginPath();
        ctx.arc(d.x, d.y, 1, 0, Math.PI * 2);
        ctx.fill();
      }
    };

    const onMove = (e) => {
      const r = parent.getBoundingClientRect();
      mouse.tx = e.clientX - r.left;
      mouse.ty = e.clientY - r.top;
    };

    let t = 0;
    const frame = () => {
      t += 0.016;
      mouse.x += (mouse.tx - mouse.x) * 0.12;
      mouse.y += (mouse.ty - mouse.y) * 0.12;
      ctx.clearRect(0, 0, W, H);
      const R2 = RADIUS * RADIUS;

      for (const d of dots) {
        const driftX = Math.sin(t * 0.55 + d.phase) * 2.4;
        const driftY = Math.cos(t * 0.45 + d.phase * 1.3) * 2.4;

        const dx = d.x - mouse.x;
        const dy = d.y - mouse.y;
        const dist2 = dx * dx + dy * dy;
        let px = 0;
        let py = 0;
        let glow = 0;
        if (dist2 < R2 * 4) {
          const dist = Math.sqrt(dist2) || 1;
          glow = Math.exp(-dist2 / R2);
          px = (dx / dist) * glow * PUSH;
          py = (dy / dist) * glow * PUSH;
        }
        d.ox += (px - d.ox) * 0.14;
        d.oy += (py - d.oy) * 0.14;

        // The gold warmth is an accent, not the point — dial the tint down
        // so the field reads as light shifting, not a gold spotlight. Motion
        // (push, brighten, grow) still tracks the cursor at full strength.
        const warm = glow * 0.4;
        const cr = (base[0] + (gold[0] - base[0]) * warm) | 0;
        const cg = (base[1] + (gold[1] - base[1]) * warm) | 0;
        const cb = (base[2] + (gold[2] - base[2]) * warm) | 0;
        ctx.beginPath();
        ctx.arc(d.x + d.ox + driftX, d.y + d.oy + driftY, 1 + glow * 1.6, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${cr},${cg},${cb},${baseAlpha + glow * 0.45})`;
        ctx.fill();
      }
      raf = requestAnimationFrame(frame);
    };

    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(parent);
    if (!reduced) {
      window.addEventListener("mousemove", onMove, { passive: true });
      raf = requestAnimationFrame(frame);
    }

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("mousemove", onMove);
      ro.disconnect();
    };
  }, [tone]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      style={{
        position: "absolute",
        inset: 0,
        pointerEvents: "none",
        opacity,
        zIndex: 0,
        maskImage: "radial-gradient(ellipse 95% 85% at 50% 45%, black 35%, transparent 82%)",
        WebkitMaskImage: "radial-gradient(ellipse 95% 85% at 50% 45%, black 35%, transparent 82%)",
      }}
    />
  );
}
