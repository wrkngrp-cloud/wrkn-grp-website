"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { Canvas } from "@react-three/fiber";
import WorldScene from "./WorldScene";

/*
 * The site's one continuous world: a fixed canvas behind every page.
 * The melting lollipop lives in it permanently and travels as you
 * scroll. Sections declare a scene with data-scene="<preset>", and the
 * world eases the lollipop's position, its scale, and the surrounding
 * elements (light slats, sound rings, spectrum bars, glow, dust)
 * toward whichever section holds the middle of the viewport.
 */
export const PRESETS = {
  // name:        lollipop x/y/scale + element weights
  hero: { x: 1.5, y: -0.05, s: 0.82, blinds: 1, rings: 0.15, eq: 0, glow: 1 },
  "glow-left": { x: -1.7, y: 0.15, s: 0.5, blinds: 0.2, rings: 0.5, eq: 0, glow: 0.85 },
  "rings-right": { x: 1.7, y: 0.1, s: 0.5, blinds: 0, rings: 1, eq: 0, glow: 0.6 },
  "rings-center": { x: 0, y: 0.35, s: 0.52, blinds: 0, rings: 1, eq: 0.15, glow: 0.7 },
  "eq-left": { x: -1.7, y: 0, s: 0.5, blinds: 0, rings: 0.2, eq: 1, glow: 0.6 },
  "eq-right": { x: 1.7, y: 0, s: 0.5, blinds: 0, rings: 0.2, eq: 1, glow: 0.6 },
  "blinds-right": { x: 1.6, y: 0.1, s: 0.56, blinds: 1, rings: 0.1, eq: 0, glow: 0.85 },
  peek: { x: 2.05, y: 0.85, s: 0.34, blinds: 0.15, rings: 0.15, eq: 0, glow: 0.35 },
};

export default function SceneRoot() {
  const pathname = usePathname();
  // What the world eases toward, written every frame from the DOM.
  const sceneRef = useRef({ target: PRESETS.hero, scrollY: 0 });

  useEffect(() => {
    let frame;
    const tick = () => {
      const vh = window.innerHeight;
      let preset = "peek";
      document.querySelectorAll("[data-scene]").forEach((el) => {
        const r = el.getBoundingClientRect();
        if (r.top <= vh * 0.5 && r.bottom >= vh * 0.5) {
          preset = el.dataset.scene;
        }
      });
      sceneRef.current.target = PRESETS[preset] || PRESETS.peek;
      sceneRef.current.scrollY = window.scrollY;
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [pathname]);

  return (
    <div
      aria-hidden
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 0,
        pointerEvents: "none",
      }}
    >
      <Canvas
        dpr={[1, 2]}
        camera={{ fov: 35, position: [0, 0, 7.2] }}
        gl={{ antialias: true, alpha: true }}
      >
        <WorldScene sceneRef={sceneRef} />
      </Canvas>
    </div>
  );
}
