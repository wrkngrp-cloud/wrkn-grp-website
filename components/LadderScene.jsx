"use client";

import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { Canvas, useFrame } from "@react-three/fiber";

/*
 * The service ladder as a real 3D ladder.
 *
 * Two warm-black rails, five ceramic rungs numbered 01–05 — the same
 * material language as the assembly bricks. Scroll progress climbs the
 * view up the ladder; the rung underfoot pulls forward, scales up and
 * turns gold. A damped cursor orbit keeps it alive between rungs.
 */

export const RUNGS = 5;
const SPACING = 1.3;

const clamp = (v, a, b) => Math.min(b, Math.max(a, v));

export default function LadderScene({ progressRef }) {
  return (
    <Canvas
      dpr={[1, 2]}
      camera={{ position: [0, 0, 7.5], fov: 35 }}
      gl={{ alpha: true, antialias: true }}
      style={{ position: "absolute", inset: 0 }}
    >
      <ambientLight intensity={0.8} />
      <directionalLight position={[4, 6, 8]} intensity={1.25} color="#fff8e8" />
      <directionalLight position={[-5, -3, 6]} intensity={0.45} color="#f4efe6" />
      <Ladder progressRef={progressRef} />
    </Canvas>
  );
}

function Ladder({ progressRef }) {
  const group = useRef();
  const rungs = useRef([]);

  const railGeo = useMemo(() => roundedBar(0.16, (RUNGS - 1) * SPACING + 1.7, 0.16, 0.05), []);
  const rungGeo = useMemo(() => roundedBar(2.0, 0.24, 0.26, 0.09), []);
  const railMat = useMemo(
    () => new THREE.MeshStandardMaterial({ color: "#141310", roughness: 0.55, metalness: 0.12 }),
    []
  );
  const cream = useMemo(() => new THREE.Color("#f4efe6"), []);
  const gold = useMemo(() => new THREE.Color("#efc835"), []);
  const rungMats = useMemo(
    () =>
      Array.from(
        { length: RUNGS },
        () =>
          new THREE.MeshStandardMaterial({
            color: "#f4efe6",
            roughness: 0.42,
            metalness: 0.08,
            emissive: new THREE.Color("#efc835"),
            emissiveIntensity: 0,
          })
      ),
    []
  );

  useFrame((state) => {
    const p = clamp(progressRef.current, 0, 1);
    // Which rung is underfoot: dwell on each fifth of the scroll
    const climb = clamp(p * RUNGS - 0.5, 0, RUNGS - 1);

    // Slide the whole ladder down so the view climbs up it
    const targetY = ((RUNGS - 1) / 2) * SPACING - climb * SPACING;
    group.current.position.y += (targetY - group.current.position.y) * 0.075;

    // Three-quarter stance + damped cursor orbit
    const targetRX = 0.1 + -state.pointer.y * 0.12;
    const targetRY = -0.42 + state.pointer.x * 0.22;
    group.current.rotation.x += (targetRX - group.current.rotation.x) * 0.06;
    group.current.rotation.y += (targetRY - group.current.rotation.y) * 0.06;

    const s = Math.min(1, state.viewport.width / 3.6);
    group.current.scale.setScalar(s);

    // Active rung: gold, forward, slightly larger — falls off by distance
    rungs.current.forEach((mesh, i) => {
      if (!mesh) return;
      const g = Math.max(0, 1 - Math.abs(climb - i));
      rungMats[i].color.lerpColors(cream, gold, g);
      rungMats[i].emissiveIntensity = g * 0.32;
      const sc = 1 + 0.1 * g;
      mesh.scale.set(sc, sc, sc);
      mesh.position.z = 0.28 * g;
    });
  });

  return (
    <group ref={group} rotation={[0.1, -0.42, 0]}>
      <mesh geometry={railGeo} material={railMat} position={[-1.05, 0, 0]} />
      <mesh geometry={railGeo} material={railMat} position={[1.05, 0, 0]} />
      {Array.from({ length: RUNGS }, (_, i) => (
        <mesh
          key={i}
          ref={(el) => (rungs.current[i] = el)}
          geometry={rungGeo}
          material={rungMats[i]}
          position={[0, (i - (RUNGS - 1) / 2) * SPACING, 0]}
        >
          <NumeralPlane index={i} />
        </mesh>
      ))}
    </group>
  );
}

/* The rung's number, drawn onto its front face. */
function NumeralPlane({ index }) {
  const text = String(index + 1).padStart(2, "0");
  const texture = useMemo(() => {
    const canvas = document.createElement("canvas");
    canvas.width = 256;
    canvas.height = 96;
    drawNumeral(canvas, text);
    const tex = new THREE.CanvasTexture(canvas);
    tex.anisotropy = 4;
    return tex;
  }, [text]);

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
    <mesh position={[0, 0, 0.145]} raycast={() => null}>
      <planeGeometry args={[0.52, 0.195]} />
      <meshBasicMaterial map={texture} transparent toneMapped={false} />
    </mesh>
  );
}

function drawNumeral(canvas, text) {
  const ctx = canvas.getContext("2d");
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "#0a0a0a";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.font = "600 56px 'Heuvel Grotesk', 'General Sans', sans-serif";
  if ("letterSpacing" in ctx) ctx.letterSpacing = "6px";
  ctx.fillText(text, canvas.width / 2, canvas.height / 2 + 4);
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
