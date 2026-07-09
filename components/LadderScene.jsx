"use client";

import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { Canvas, useFrame } from "@react-three/fiber";

/*
 * The service ladder, portrayed as an ascent.
 *
 * Five ceramic steps interlock into one solid flight climbing into depth.
 * Scroll walks the camera up it: the step underfoot detaches from the
 * structure, lifts and pulls forward to the focal point, turns gold and
 * glows. A gold path-line runs up the left like a banister and draws
 * itself upward as you climb — every product leading to the next. Steps
 * ahead recede toward the cream; climbed steps hold a little warmth.
 *
 * Warm-charcoal ceramic on cream keeps the contrast; the gold lamp,
 * emissive step and cream/charcoal palette are the same language as the
 * homepage assembly.
 */

export const RUNGS = 5;
const HALF = (RUNGS - 1) / 2;
const RISE = 0.92; // vertical climb per step
const RUN = 1.16; // depth each step recedes
const STEP_W = 2.5;
const STEP_H = RISE + 0.14; // riser face height — overlaps the step below
const STEP_D = RUN + 0.28; // tread depth — overlaps the step in front
const FOCAL_Y = 0.05; // where the active step is framed
const FOCAL_Z = 2.15;

const clamp = (v, a, b) => Math.min(b, Math.max(a, v));

// Reference point of step i: the front-top edge of its tread. The solid
// block hangs below and behind it so consecutive steps interlock.
const refPos = (i) => ({ y: (i - HALF) * RISE, z: -(i - HALF) * RUN });

export default function LadderScene({ progressRef }) {
  return (
    <Canvas
      dpr={[1, 2]}
      camera={{ position: [0, 0.5, 7.6], fov: 36 }}
      gl={{ alpha: true, antialias: true }}
      style={{ position: "absolute", inset: 0 }}
    >
      {/* Low ambient for real shading; warm key gives the flight dimension */}
      <ambientLight intensity={0.36} />
      <directionalLight position={[5, 9, 6]} intensity={2.05} color="#fff4dc" />
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
  const shadow = useRef();

  // Per-step spring state so a step overshoots and settles as it arrives
  const disp = useRef(new Float32Array(RUNGS));
  const vel = useRef(new Float32Array(RUNGS));

  const stepGeo = useMemo(() => roundedBox(STEP_W, STEP_H, STEP_D, 0.08), []);

  // Soft contact shadow — a radial smudge that grounds the flight on the cream
  const shadowTex = useMemo(() => {
    const c = document.createElement("canvas");
    c.width = c.height = 128;
    const g = c.getContext("2d");
    const grad = g.createRadialGradient(64, 64, 3, 64, 64, 62);
    grad.addColorStop(0, "rgba(20,18,14,0.5)");
    grad.addColorStop(0.5, "rgba(20,18,14,0.2)");
    grad.addColorStop(1, "rgba(20,18,14,0)");
    g.fillStyle = grad;
    g.fillRect(0, 0, 128, 128);
    const tex = new THREE.CanvasTexture(c);
    return tex;
  }, []);
  const shadowMat = useMemo(
    () => new THREE.MeshBasicMaterial({ map: shadowTex, transparent: true, opacity: 0.32, depthWrite: false, toneMapped: false }),
    [shadowTex]
  );

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

  // Gold path-line up the left side like a banister — the route through the
  // flight rather than a spike through the steps
  const curve = useMemo(() => {
    const pts = Array.from({ length: RUNGS }, (_, i) => {
      const r = refPos(i);
      // Hug the front-left top corner of each tread so it reads as an
      // inlaid gold route climbing the stairs, not a floating line
      return new THREE.Vector3(-STEP_W / 2 + 0.07, r.y + 0.05, r.z + 0.5);
    });
    return new THREE.CatmullRomCurve3(pts, false, "catmullrom", 0.5);
  }, []);
  const tubeGeo = useMemo(() => new THREE.TubeGeometry(curve, 140, 0.03, 8, false), [curve]);
  const litGeo = useMemo(() => new THREE.TubeGeometry(curve, 140, 0.034, 8, false), [curve]);
  const faintTubeMat = useMemo(
    () => new THREE.MeshBasicMaterial({ color: "#b8960f", transparent: true, opacity: 0.26, toneMapped: false }),
    []
  );
  const litTubeMat = useMemo(
    () => new THREE.MeshBasicMaterial({ color: "#efc835", transparent: true, opacity: 0.95, toneMapped: false }),
    []
  );

  useFrame((state) => {
    const p = clamp(progressRef.current, 0, 1);
    const t = state.clock.elapsedTime;
    // Which step is underfoot: a short dwell on each across the scroll
    const climb = clamp(p * RUNGS - 0.5, 0, RUNGS - 1);

    // Fit to viewport, then a gentle three-quarter stance + cursor orbit
    // with a slow autonomous drift so it breathes even when idle.
    const s = Math.min(1, state.viewport.width / 4.9);
    fit.current.scale.setScalar(s);
    const targetRY = -0.28 + state.pointer.x * 0.16 + Math.sin(t * 0.3) * 0.02;
    const targetRX = 0.16 + -state.pointer.y * 0.07 + Math.sin(t * 0.24) * 0.012;
    fit.current.rotation.y += (targetRY - fit.current.rotation.y) * 0.06;
    fit.current.rotation.x += (targetRX - fit.current.rotation.x) * 0.06;
    fit.current.rotation.z = Math.sin(t * 0.4) * 0.005;

    // Walk the flight so the active step's edge arrives at the focal point
    const active = refPos(climb);
    rig.current.position.y += (FOCAL_Y - active.y - rig.current.position.y) * 0.09;
    rig.current.position.z += (FOCAL_Z - active.z - rig.current.position.z) * 0.09;

    // Gold lamp pools on whatever sits at the focal point
    if (lamp.current) lamp.current.position.set(0, FOCAL_Y + 0.4, FOCAL_Z + 0.9);

    steps.current.forEach((mesh, i) => {
      if (!mesh) return;
      const d = Math.abs(climb - i);
      const g = Math.max(0, 1 - d); // target activeness within one step

      // Spring the display activeness toward its target so an arriving step
      // overshoots a touch and settles, rather than tracking rigidly.
      vel.current[i] += (g - disp.current[i]) * 0.16;
      vel.current[i] *= 0.72;
      disp.current[i] += vel.current[i];
      const gv = disp.current[i]; // may slightly overshoot 1 — used for the pop
      const gc = clamp(gv, 0, 1); // clamped — used for colour/light

      // Ahead of the climb stays present (leads to the next); climbed steps
      // hold a little light behind you.
      const ahead = Math.max(0, i - climb);
      const behind = Math.max(0, climb - i);
      const focus = clamp(1 - ahead * 0.36 - behind * 0.22, 0.22, 1);

      // Solid block hangs below/behind its front-top reference; the active
      // step detaches, rising and pulling forward out of the structure, with
      // a gentle idle bob so it feels alive at the focal point.
      const bob = Math.sin(t * 1.15 + i * 0.7) * 0.02 * gc;
      const r = refPos(i);
      mesh.position.set(
        0,
        r.y - STEP_H / 2 + 0.34 * gv + bob,
        r.z - STEP_D / 2 + 0.48 * gv
      );
      const sc = 1 + 0.07 * gv;
      mesh.scale.set(sc, sc, sc);

      stepMats[i].color.lerpColors(charcoal, gold, gc);
      stepMats[i].emissiveIntensity = gc * 0.95;
      stepMats[i].opacity = focus;

      const nm = numerals.current[i];
      if (nm) {
        nm.color.lerpColors(cream, charcoal, gc);
        nm.opacity = clamp(focus + 0.12, 0, 1);
      }
    });

    // Ground shadow sits under the focal step and softly breathes
    if (shadow.current) {
      shadow.current.material.opacity = 0.3 + Math.sin(t * 1.15) * 0.02;
    }

    // Gold path draws itself from the base up to the current step
    if (litTube.current?.geometry.index) {
      const total = litTube.current.geometry.index.count;
      const reveal = Math.floor(total * clamp((climb + 0.55) / RUNGS, 0, 1));
      litTube.current.geometry.setDrawRange(0, reveal);
    }
  });

  return (
    <group ref={fit} rotation={[0.16, -0.28, 0]}>
      <pointLight ref={lamp} color="#ffcf4a" intensity={3.4} distance={4.6} decay={2.2} />

      {/* Soft contact shadow beneath the focal step, grounding the flight */}
      <mesh
        ref={shadow}
        material={shadowMat}
        position={[0, FOCAL_Y - STEP_H - 0.12, FOCAL_Z + 0.15]}
        rotation={[-Math.PI / 2, 0, 0]}
        scale={[STEP_W * 1.05, STEP_D * 1.35, 1]}
        raycast={() => null}
      >
        <planeGeometry args={[1, 1]} />
      </mesh>

      <group ref={rig}>
        {/* Gold path-line: faint full run + bright climbed portion */}
        <mesh geometry={tubeGeo} material={faintTubeMat} raycast={() => null} />
        <mesh ref={litTube} geometry={litGeo} material={litTubeMat} raycast={() => null} />

        {Array.from({ length: RUNGS }, (_, i) => {
          const r = refPos(i);
          return (
            <mesh
              key={i}
              ref={(el) => (steps.current[i] = el)}
              geometry={stepGeo}
              material={stepMats[i]}
              position={[0, r.y - STEP_H / 2, r.z - STEP_D / 2]}
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
 * The step's number, on its front riser face. White glyph on transparent
 * canvas so the parent can tint it per frame (cream on charcoal, charcoal
 * on gold when active).
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

  // Sit on the front riser face, a touch above centre so it reads on the tread edge
  return (
    <mesh position={[0, STEP_H / 2 - 0.34, STEP_D / 2 + 0.01]} raycast={() => null}>
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
