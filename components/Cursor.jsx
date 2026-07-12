"use client";

import { useEffect, useRef, useState } from "react";

/*
 * Custom cursor: solid dot + trailing ring, adapted from the WRKN GRP
 * interaction logic, recolored into the ember system.
 * - Ring eases toward the dot each frame.
 * - Grows over interactive elements; pill label over [data-cursor].
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
      const el = e.target.closest(
        "a, button, [data-cursor], input, select, textarea, label"
      );
      state.target = el;
      state.hover = !!el;
      const text = el?.closest("[data-cursor]")?.dataset.cursor || "";
      state.labelled = !!text;
      setLabel(text);
    };

    let frame;
    const tick = () => {
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
        ringRef.current.dataset.mode = state.labelled
          ? "label"
          : state.hover
            ? "hover"
            : "idle";
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
          background: "#FCA818",
          mixBlendMode: "screen",
          zIndex: 3000,
          pointerEvents: "none",
          willChange: "transform",
        }}
      />
      <div
        ref={ringRef}
        aria-hidden
        data-mode="idle"
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: 34,
          height: 34,
          borderRadius: "50%",
          border: "1px solid rgba(201,126,91,0.6)",
          zIndex: 2999,
          pointerEvents: "none",
          willChange: "transform",
          display: "grid",
          placeItems: "center",
          fontSize: 10,
          letterSpacing: "0.2em",
          textTransform: "uppercase",
          color: "#FCA818",
          transition: "width .25s ease, height .25s ease, background .25s ease",
          ...(label
            ? {
                width: 86,
                height: 86,
                background: "rgba(42,14,0,0.85)",
                borderColor: "#8C380E",
              }
            : {}),
        }}
      >
        {label}
      </div>
    </>
  );
}
