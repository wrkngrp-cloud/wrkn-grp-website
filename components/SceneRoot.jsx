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
  // Each preset: lollipop x/y/scale + weights for the scene elements
  // (blinds, rings, eq, glow, desk, speakers, vinyl, doors, spots).
  // The control room: console up, monitors in, light through blinds.
  hero: { x: 1.45, y: 0.1, s: 0.78, blinds: 0.75, rings: 0, eq: 0, glow: 1, desk: 1, speakers: 1 },
  // The listening room: a record turning in the dark.
  "glow-left": { x: -1.7, y: 0.15, s: 0.5, blinds: 0.15, rings: 0.35, glow: 0.85, vinyl: 1 },
  // Sound rings breathing outward.
  "rings-right": { x: 1.7, y: 0.1, s: 0.5, rings: 1, glow: 0.6 },
  "rings-center": { x: 0, y: 0.35, s: 0.52, rings: 1, eq: 0.15, glow: 0.7 },
  // The room hearing a record: circular spectrum + stage light.
  "eq-left": { x: -1.7, y: 0, s: 0.5, rings: 0.2, eq: 1, glow: 0.6, spots: 0.6 },
  "eq-right": { x: 1.7, y: 0, s: 0.5, rings: 0.2, eq: 1, glow: 0.6, spots: 0.6 },
  // The 4 a.m. room: blinds heavy, a record still turning.
  "blinds-right": { x: 1.6, y: 0.1, s: 0.56, blinds: 1, rings: 0.1, glow: 0.85, vinyl: 0.4 },
  // Three doorframes of light.
  "doors-left": { x: 1.7, y: 0.1, s: 0.5, glow: 0.55, doors: 1 },
  // The gear room: console racks glowing at the edge of frame.
  "rack-right": { x: 1.7, y: 0.1, s: 0.52, eq: 0.4, glow: 0.75, desk: 0.85 },
  // The stage: spotlights on.
  "spots-center": { x: 0, y: 0.3, s: 0.52, rings: 0.25, glow: 0.7, spots: 1 },
  // The archive: records and rings.
  "vinyl-right": { x: 1.7, y: 0.1, s: 0.5, rings: 0.4, glow: 0.65, vinyl: 1 },
  peek: { x: 2.05, y: 0.85, s: 0.34, blinds: 0.15, rings: 0.15, glow: 0.35 },
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
