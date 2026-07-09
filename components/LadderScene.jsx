"use client";

import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { Canvas, useFrame } from "@react-three/fiber";

/*
 * The service ladder, portrayed as an ascent.
 *
 * Five broad ceramic steps climb diagonally into depth like a grand
 * staircase. Scroll walks the camera up the flight: the step underfoot
 * rises to the focal point, lifts, turns gold and glows, while a gold
 * path-line threads step to step and draws itself upward as you climb —
 * every product leading to the next. Steps ahead recede toward the cream;
 * steps already climbed hold their light.
 *
 * Warm-charcoal ceramic on cream keeps the contrast; the gold lamp,
 * emissive step and cream/charcoal palette are the same language as the
 * homepage assembly.
 */

export const RUNGS = 5;
const HALF = (RUNGS - 1) / 2;
const RISE = 1.04; // how much each step climbs
const RUN = 1.44; // how far each step recedes
const FOCAL_Y = -0.15; // where the active step is framed
const FOCAL_Z = 2.0;

const clamp = (v, a, b) => Math.min(b, Math.max(a, v));

// Local resting position of step i along the flight
const stepPos = (i) => ({ y: (i - HALF) * RISE, z: -(i - HALF) * RUN });

export default function LadderScene({ progressRef }) {
  return (
    <Canvas
      dpr={[1, 2]}
      camera={{ position: [0, 0.4, 7.4], fov: 36 }}
      gl={{ alpha: true, antialias: true }}
      style={{ position: "absolute", inset: 0 }}
    >
      {/* Low ambient for real shading; warm key gives the flight dimension */}
      <ambientLight intensity={0.36} />
      <directionalLight position={[5, 9, 6]} intensity={2.0} color="#fff4dc" />
      <directionalLight position={[-6, -2, 5]} intensity={0.5} color="#f4efe6" />
      <Ascent progressRef={progressRef} />
    </Canvas>
  );
}

function Ascent({ progressRef }) {
  const fit = useRef();
  const rig = useRef();
  const steps = useRef([]);
  const numerals = useRef([]);
  const lamp = useRef();
  const litTube = useRef();

  const stepGeo = useMemo(() => roundedBox(2.4, 0.5, 1.25, 0.09), []);

  const charcoal = useMemo(() => new THREE.Color("#1c1812"), []);
  const gold = useMemo(() => new THREE.Color("#efc835"), []);
  const cream = useMemo(() => new THREE.Color("#f4efe6"), []);

  const stepMats = useMemo(
    () =>
      Array.from(
        { length: RUNGS },
        () =>
          new THREE.MeshStandardMaterial({
            color: "#1c1812",
            roughness: 0.46,
            metalness: 0.16,
            emissive: new THREE.Color("#efc835"),
            emissiveIntensity: 0,
            transparent: true,
            opacity: 1,
          })
      ),
    []
  );

  // Gold path-line running up the left side like a banister, so it reads as
  // the route through the flight rather than a spike through the steps
  const curve = useMemo(() => {
    const pts = Array.from({ length: RUNGS }, (_, i) => {
      const s = stepPos(i);
      return new THREE.Vector3(-1.32, s.y + 0.18, s.z + 0.52);
    });
    return new THREE.CatmullRomCurve3(pts, false, "catmullrom", 0.5);
  }, []);
  const tubeGeo = useMemo(() => new THREE.TubeGeometry(curve, 140, 0.026, 8, false), [curve]);
  const litGeo = useMemo(() => new THREE.TubeGeometry(curve, 140, 0.03, 8, false), [curve]);
  const faintTubeMat = useMemo(
    () => new THREE.MeshBasicMaterial({ color: "#b8960f", transparent: true, opacity: 0.28, toneMapped: false }),
    []
  );
  const litTubeMat = useMemo(
    () => new THREE.MeshBasicMaterial({ color: "#efc835", transparent: true, opacity: 0.95, toneMapped: false }),
    []
  );

  useFrame((state) => {
    const p = clamp(progressRef.current, 0, 1);
    // Which step is underfoot: a short dwell on each across the scroll
    const climb = clamp(p * RUNGS - 0.5, 0, RUNGS - 1);

    // Fit to viewport, then a gentle three-quarter stance + cursor orbit
    const s = Math.min(1, state.viewport.width / 4.1);
    fit.current.scale.setScalar(s);
    const targetRY = -0.26 + state.pointer.x * 0.18;
    const targetRX = 0.14 + -state.pointer.y * 0.08;
    fit.current.rotation.y += (targetRY - fit.current.rotation.y) * 0.06;
    fit.current.rotation.x += (targetRX - fit.current.rotation.x) * 0.06;

    // Walk the flight so the active step arrives at the focal point
    const active = stepPos(climb);
    rig.current.position.y += (FOCAL_Y - active.y - rig.current.position.y) * 0.09;
    rig.current.position.z += (FOCAL_Z - active.z - rig.current.position.z) * 0.09;

    // Gold lamp pools on whatever sits at the focal point
    if (lamp.current) lamp.current.position.set(0, FOCAL_Y + 0.35, FOCAL_Z + 0.7);

    steps.current.forEach((mesh, i) => {
      if (!mesh) return;
      const d = Math.abs(climb - i);
      const g = Math.max(0, 1 - d); // activeness within one step
      // Ahead of the climb fades quickly; already-climbed steps hold light
      const ahead = Math.max(0, i - climb);
      const behind = Math.max(0, climb - i);
      const focus = clamp(1 - ahead * 0.5 - behind * 0.24, 0.12, 1);

      const base = stepPos(i);
      mesh.position.set(0, base.y + 0.36 * g, base.z + 0.5 * g);
      const sc = 1 + 0.1 * g;
      mesh.scale.set(sc, sc, sc);

      stepMats[i].color.lerpColors(charcoal, gold, g);
      stepMats[i].emissiveIntensity = g * 0.95;
      stepMats[i].opacity = focus;

      const nm = numerals.current[i];
      if (nm) {
        nm.color.lerpColors(cream, charcoal, g);
        nm.opacity = clamp(focus + 0.12, 0, 1);
      }
    });

    // Gold path draws itself from the base up to the current step
    if (litTube.current?.geometry.index) {
      const total = litTube.current.geometry.index.count;
      const reveal = Math.floor(total * clamp((climb + 0.55) / RUNGS, 0, 1));
      litTube.current.geometry.setDrawRange(0, reveal);
    }
  });

  return (
    <group ref={fit} rotation={[0.14, -0.26, 0]}>
      <pointLight ref={lamp} color="#ffcf4a" intensity={5} distance={4.2} decay={2.2} />
      <group ref={rig}>
        {/* Gold path-line: faint full run + bright climbed portion */}
        <mesh geometry={tubeGeo} material={faintTubeMat} raycast={() => null} />
        <mesh ref={litTube} geometry={litGeo} material={litTubeMat} raycast={() => null} />

        {Array.from({ length: RUNGS }, (_, i) => {
          const s = stepPos(i);
          return (
            <mesh
              key={i}
              ref={(el) => (steps.current[i] = el)}
              geometry={stepGeo}
              material={stepMats[i]}
              position={[0, s.y, s.z]}
            >
              <NumeralPlane index={i} matRef={(m) => (numerals.current[i] = m)} />
            </mesh>
          );
        })}
      </group>
    </group>
  );
}

/*
 * The step's number, on its front face. White glyph on transparent canvas
 * so the parent can tint it per frame (cream on charcoal, charcoal on gold).
 */
function NumeralPlane({ index, matRef }) {
  const text = String(index + 1).padStart(2, "0");
  const materialRef = useRef();

  const texture = useMemo(() => {
    const canvas = document.createElement("canvas");
    canvas.width = 384;
    canvas.height = 128;
    drawNumeral(canvas, text);
    const tex = new THREE.CanvasTexture(canvas);
    tex.anisotropy = 4;
    return tex;
  }, [text]);

  useEffect(() => {
    if (materialRef.current) matRef?.(materialRef.current);
  }, [matRef]);

  useEffect(() => {
    let alive = true;
    if (document.fonts?.ready) {
      document.fonts.ready.then(() => {
        if (!alive) return;
        drawNumeral(texture.image, text);
        texture.needsUpdate = true;
      });
    }
    return () => {
      alive = false;
    };
  }, [text, texture]);

  return (
    <mesh position={[0, 0, 0.63]} raycast={() => null}>
      <planeGeometry args={[0.82, 0.273]} />
      <meshBasicMaterial
        ref={materialRef}
        map={texture}
        transparent
        toneMapped={false}
        color="#f4efe6"
      />
    </mesh>
  );
}

function drawNumeral(canvas, text) {
  const ctx = canvas.getContext("2d");
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "#ffffff";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.font = "600 72px 'Heuvel Grotesk', 'General Sans', sans-serif";
  if ("letterSpacing" in ctx) ctx.letterSpacing = "8px";
  ctx.fillText(text, canvas.width / 2 + 4, canvas.height / 2 + 4);
}

// A rounded rectangle (w × h) extruded to `depth` along z — a slab.
function roundedBox(w, h, depth, r) {
  const shape = new THREE.Shape();
  const x = -w / 2;
  const y = -h / 2;
  shape.moveTo(x + r, y);
  shape.lineTo(x + w - r, y);
  shape.quadraticCurveTo(x + w, y, x + w, y + r);
  shape.lineTo(x + w, y + h - r);
  shape.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  shape.lineTo(x + r, y + h);
  shape.quadraticCurveTo(x, y + h, x, y + h - r);
  shape.lineTo(x, y + r);
  shape.quadraticCurveTo(x, y, x + r, y);

  const geo = new THREE.ExtrudeGeometry(shape, {
    depth: Math.max(0.02, depth - 0.06),
    bevelEnabled: true,
    bevelThickness: 0.03,
    bevelSize: 0.03,
    bevelSegments: 2,
    curveSegments: 5,
  });
  geo.center();
  return geo;
}
