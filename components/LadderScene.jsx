"use client";

import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { Canvas, useFrame } from "@react-three/fiber";

/*
 * The service ladder as a real 3D climb.
 *
 * Two warm-black rails carry five machined rungs numbered 01–05. On a
 * cream section, cream rungs vanished — so the rungs are warm charcoal
 * and the light does the work: low ambient for genuine shading, a moving
 * gold lamp that pools on whichever rung is underfoot. That rung ignites
 * gold, pulls forward and scales up; the rest recede toward the cream,
 * so the eye always sits on the current step. A gold filament fills up
 * the rails as you climb, so progress up the ladder is legible at a glance.
 */

export const RUNGS = 5;
const SPACING = 1.42;
const HALF = (RUNGS - 1) / 2;

const clamp = (v, a, b) => Math.min(b, Math.max(a, v));

export default function LadderScene({ progressRef }) {
  return (
    <Canvas
      dpr={[1, 2]}
      camera={{ position: [0, 0, 7.4], fov: 34 }}
      gl={{ alpha: true, antialias: true }}
      style={{ position: "absolute", inset: 0 }}
    >
      {/* Low ambient so surfaces actually shade; warm key for dimension. */}
      <ambientLight intensity={0.34} />
      <directionalLight position={[5, 8, 6]} intensity={2.1} color="#fff4dc" />
      <directionalLight position={[-6, -3, 4]} intensity={0.55} color="#f4efe6" />
      <Ladder progressRef={progressRef} />
    </Canvas>
  );
}

function Ladder({ progressRef }) {
  const group = useRef();
  const rungs = useRef([]);
  const numerals = useRef([]);
  const lamp = useRef();
  const fillL = useRef();
  const fillR = useRef();

  const railGeo = useMemo(() => roundedBar(0.18, (RUNGS - 1) * SPACING + 1.9, 0.2, 0.06), []);
  const rungGeo = useMemo(() => roundedBar(2.1, 0.32, 0.32, 0.1), []);
  const fillGeo = useMemo(() => roundedBar(0.08, 1, 0.08, 0.03), []);

  const railMat = useMemo(
    () => new THREE.MeshStandardMaterial({ color: "#17140f", roughness: 0.5, metalness: 0.28 }),
    []
  );
  const fillMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: "#efc835",
        roughness: 0.3,
        metalness: 0.2,
        emissive: new THREE.Color("#efc835"),
        emissiveIntensity: 0.6,
      }),
    []
  );

  const charcoal = useMemo(() => new THREE.Color("#1c1812"), []);
  const gold = useMemo(() => new THREE.Color("#efc835"), []);
  const cream = useMemo(() => new THREE.Color("#f4efe6"), []);

  const rungMats = useMemo(
    () =>
      Array.from(
        { length: RUNGS },
        () =>
          new THREE.MeshStandardMaterial({
            color: "#1c1812",
            roughness: 0.44,
            metalness: 0.16,
            emissive: new THREE.Color("#efc835"),
            emissiveIntensity: 0,
            transparent: true,
            opacity: 1,
          })
      ),
    []
  );

  useFrame((state) => {
    const p = clamp(progressRef.current, 0, 1);
    // Which rung is underfoot: a short dwell on each rung across the scroll
    const climb = clamp(p * RUNGS - 0.5, 0, RUNGS - 1);

    // Slide the whole ladder down so the view climbs up it
    const targetY = HALF * SPACING - climb * SPACING;
    group.current.position.y += (targetY - group.current.position.y) * 0.08;

    // Three-quarter stance + a quiet damped cursor orbit
    const targetRX = 0.08 + -state.pointer.y * 0.1;
    const targetRY = -0.36 + state.pointer.x * 0.2;
    group.current.rotation.x += (targetRX - group.current.rotation.x) * 0.06;
    group.current.rotation.y += (targetRY - group.current.rotation.y) * 0.06;

    const s = Math.min(1, state.viewport.width / 3.9);
    group.current.scale.setScalar(s);

    // Gold lamp rides with the active rung and pools light on its neighbours
    if (lamp.current) lamp.current.position.set(0, (climb - HALF) * SPACING, 1.0);

    rungs.current.forEach((mesh, i) => {
      if (!mesh) return;
      const d = Math.abs(climb - i);
      const g = Math.max(0, 1 - d); // activeness, only within one rung
      // Distance focus: rungs away from the step recede toward the cream
      const focus = clamp(1 - d * 0.42, 0.2, 1);

      rungMats[i].color.lerpColors(charcoal, gold, g);
      rungMats[i].emissiveIntensity = g * 0.85;
      rungMats[i].opacity = focus;

      const sc = 1 + 0.14 * g;
      mesh.scale.set(sc, sc, sc);
      mesh.position.z = 0.4 * g;

      // Numeral flips from cream (on the dark rung) to charcoal (on gold)
      const nm = numerals.current[i];
      if (nm) {
        nm.color.lerpColors(cream, charcoal, g);
        nm.opacity = clamp(focus + 0.15, 0, 1);
      }
    });

    // Rails' gold fill grows from the base up to the current step
    const fillH = (climb + 0.5) * SPACING;
    const fillCenter = -HALF * SPACING - 0.95 + fillH / 2;
    for (const f of [fillL.current, fillR.current]) {
      if (!f) continue;
      f.scale.y = Math.max(0.001, fillH);
      f.position.y = fillCenter;
    }
  });

  const railFillY = 0; // recomputed per frame
  return (
    <group ref={group} rotation={[0.08, -0.36, 0]}>
      <pointLight ref={lamp} color="#ffcf4a" intensity={9} distance={5.5} decay={2} />

      {/* Rails */}
      <mesh geometry={railGeo} material={railMat} position={[-1.08, 0, 0]} />
      <mesh geometry={railGeo} material={railMat} position={[1.08, 0, 0]} />

      {/* Gold climb-fill, one filament grooved into each rail */}
      <mesh ref={fillL} geometry={fillGeo} material={fillMat} position={[-1.08, railFillY, 0.12]} />
      <mesh ref={fillR} geometry={fillGeo} material={fillMat} position={[1.08, railFillY, 0.12]} />

      {/* Rungs */}
      {Array.from({ length: RUNGS }, (_, i) => (
        <mesh
          key={i}
          ref={(el) => (rungs.current[i] = el)}
          geometry={rungGeo}
          material={rungMats[i]}
          position={[0, (i - HALF) * SPACING, 0]}
        >
          <NumeralPlane index={i} matRef={(m) => (numerals.current[i] = m)} />
        </mesh>
      ))}
    </group>
  );
}

/*
 * The rung's number. Drawn as a white glyph on transparent canvas so the
 * parent can tint it per frame (cream on a dark rung, charcoal on gold).
 */
function NumeralPlane({ index, matRef }) {
  const text = String(index + 1).padStart(2, "0");
  const materialRef = useRef();

  const texture = useMemo(() => {
    const canvas = document.createElement("canvas");
    canvas.width = 320;
    canvas.height = 120;
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
    <mesh position={[0, 0, 0.18]} raycast={() => null}>
      <planeGeometry args={[0.66, 0.247]} />
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
  ctx.font = "600 66px 'Heuvel Grotesk', 'General Sans', sans-serif";
  if ("letterSpacing" in ctx) ctx.letterSpacing = "8px";
  ctx.fillText(text, canvas.width / 2 + 4, canvas.height / 2 + 4);
}

function roundedBar(w, h, depth, r) {
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
