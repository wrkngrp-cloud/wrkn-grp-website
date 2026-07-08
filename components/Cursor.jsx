"use client";

import { useEffect, useRef, useState } from "react";

/*
 * Custom cursor: solid dot + trailing ring.
 * - Ring eases toward the dot each frame.
 * - Grows + blends over interactive elements.
 * - Expands into a labelled pill over elements with [data-cursor].
 * - Gets pulled slightly toward the hovered interactive element.
 */
export default function Cursor() {
  const dotRef = useRef(null);
  const ringRef = useRef(null);
  const [label, setLabel] = useState("");
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const fine = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!fine || reduced) return;

    setEnabled(true);
    document.body.classList.add("has-custom-cursor");

    const state = {
      x: -100,
      y: -100,
      ringX: -100,
      ringY: -100,
      target: null,
      hover: false,
      labelled: false,
    };

    const onMove = (e) => {
      state.x = e.clientX;
      state.y = e.clientY;
      const el = e.target.closest("a, button, [data-cursor], .flip-scene, input, select, textarea, label");
      state.target = el;
      state.hover = !!el;
      const text = el?.closest("[data-cursor]")?.dataset.cursor || "";
      state.labelled = !!text;
      setLabel(text);
    };

    let frame;
    const tick = () => {
      // Slight pull toward the hovered element before its own magnetism kicks in
      let tx = state.x;
      let ty = state.y;
      if (state.target && state.target.isConnected) {
        const r = state.target.getBoundingClientRect();
        if (r.width < 420 && r.height < 240) {
          tx += (r.left + r.width / 2 - state.x) * 0.14;
          ty += (r.top + r.height / 2 - state.y) * 0.14;
        }
      }

      state.ringX += (tx - state.ringX) * 0.16;
      state.ringY += (ty - state.ringY) * 0.16;

      if (dotRef.current) {
        dotRef.current.style.transform = `translate(${tx}px, ${ty}px) translate(-50%, -50%) scale(${
          state.labelled ? 0 : state.hover ? 1.8 : 1
        })`;
      }
      if (ringRef.current) {
        const scale = state.labelled ? 1 : state.hover ? 1.7 : 1;
        ringRef.current.style.transform = `translate(${state.ringX}px, ${state.ringY}px) translate(-50%, -50%) scale(${scale})`;
        ringRef.current.dataset.mode = state.labelled ? "label" : state.hover ? "hover" : "idle";
      }
      frame = requestAnimationFrame(tick);
    };

    window.addEventListener("mousemove", onMove, { passive: true });
    frame = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener("mousemove", onMove);
      cancelAnimationFrame(frame);
      document.body.classList.remove("has-custom-cursor");
    };
  }, []);

  if (!enabled) return null;

  return (
    <>
      <div
        ref={dotRef}
        aria-hidden
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: 8,
          height: 8,
          borderRadius: "50%",
          background: "#f4efe6",
          mixBlendMode: "difference",
          zIndex: 3000,
          pointerEvents: "none",
          transition: "width .2s, height .2s",
        }}
      />
      <div
        ref={ringRef}
        aria-hidden
        className="cursor-ring"
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          zIndex: 3000,
          pointerEvents: "none",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            width: label ? "auto" : 40,
            height: label ? "auto" : 40,
            minWidth: 40,
            minHeight: 40,
            padding: label ? "0.55rem 1.2rem" : 0,
            borderRadius: 999,
            border: label ? "none" : "1px solid rgba(244,239,230,.85)",
            background: label ? "#efc835" : "transparent",
            color: "#0a0a0a",
            fontSize: "0.68rem",
            fontWeight: 600,
            letterSpacing: "0.16em",
            textTransform: "uppercase",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            whiteSpace: "nowrap",
            mixBlendMode: label ? "normal" : "difference",
            transition: "background .25s, padding .25s",
          }}
        >
          {label}
        </div>
      </div>
    </>
  );
}
