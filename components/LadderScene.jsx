"use client";

import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { Canvas, useFrame } from "@react-three/fiber";

/*
 * The service ladder as a real 3D ladder — rungs are rings.
 *
 * Two warm-black rails carry five ceramic rings, numbered 01–05, threaded
 * between them like climbing rings. Same material language as the assembly
 * bricks. Scroll progress climbs the view up the ladder; the ring underfoot
 * pulls forward, scales up and turns gold, its numeral floating in the hole.
 * A damped cursor orbit keeps it alive between rungs.
 */

export const RUNGS = 5;
const SPACING = 1.35;
const RING_R = 0.7; // torus centre radius
const RING_TUBE = 0.13; // torus tube radius
const RAIL_X = 0.7; // rails sit on the ring's tube so they read as threaded

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
  const rings = useRef([]);
  const settled = useRef(false);

  const railGeo = useMemo(() => roundedBar(0.16, (RUNGS - 1) * SPACING + 1.6, 0.16, 0.05), []);
  const ringGeo = useMemo(() => new THREE.TorusGeometry(RING_R, RING_TUBE, 22, 64), []);
  const railMat = useMemo(
    () => new THREE.MeshStandardMaterial({ color: "#141310", roughness: 0.55, metalness: 0.12 }),
    []
  );
  const cream = useMemo(() => new THREE.Color("#f4efe6"), []);
  const gold = useMemo(() => new THREE.Color("#efc835"), []);
  const ringMats = useMemo(
    () =>
      Array.from(
        { length: RUNGS },
        () =>
          new THREE.MeshStandardMaterial({
            color: "#f4efe6",
            roughness: 0.4,
            metalness: 0.1,
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
    // Snap on the first frame so entering the pin never shows a half-slid ladder
    if (!settled.current) {
      group.current.position.y = targetY;
      settled.current = true;
    } else {
      group.current.position.y += (targetY - group.current.position.y) * 0.075;
    }

    // Three-quarter stance + damped cursor orbit
    const targetRX = 0.1 + -state.pointer.y * 0.12;
    const targetRY = -0.42 + state.pointer.x * 0.22;
    group.current.rotation.x += (targetRX - group.current.rotation.x) * 0.06;
    group.current.rotation.y += (targetRY - group.current.rotation.y) * 0.06;

    const s = Math.min(1, state.viewport.width / 3.6);
    group.current.scale.setScalar(s);

    // Active ring: gold, forward, slightly larger — falls off by distance
    rings.current.forEach((mesh, i) => {
      if (!mesh) return;
      const g = Math.max(0, 1 - Math.abs(climb - i));
      ringMats[i].color.lerpColors(cream, gold, g);
      ringMats[i].emissiveIntensity = g * 0.34;
      const sc = 1 + 0.12 * g;
      mesh.scale.set(sc, sc, sc);
      mesh.position.z = 0.32 * g;
    });
  });

  return (
    <group ref={group} rotation={[0.1, -0.42, 0]}>
      <mesh geometry={railGeo} material={railMat} position={[-RAIL_X, 0, 0]} />
      <mesh geometry={railGeo} material={railMat} position={[RAIL_X, 0, 0]} />
      {Array.from({ length: RUNGS }, (_, i) => (
        <mesh
          key={i}
          ref={(el) => (rings.current[i] = el)}
          geometry={ringGeo}
          material={ringMats[i]}
          position={[0, (i - (RUNGS - 1) / 2) * SPACING, 0]}
        >
          <NumeralPlane index={i} />
        </mesh>
      ))}
    </group>
  );
}

/* The rung's number, floating in the centre of its ring. */
function NumeralPlane({ index }) {
  const text = String(index + 1).padStart(2, "0");
  const texture = useMemo(() => {
    const canvas = document.createElement("canvas");
    canvas.width = 256;
    canvas.height = 128;
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
    <mesh position={[0, 0, 0.02]} raycast={() => null}>
      <planeGeometry args={[0.66, 0.33]} />
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
  ctx.font = "600 68px 'Heuvel Grotesk', 'General Sans', sans-serif";
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
