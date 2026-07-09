"use client";

import { useMemo, useRef } from "react";
import * as THREE from "three";
import { Canvas, useFrame } from "@react-three/fiber";

/*
 * The loader's opening act. A handful of ceramic blocks — the same
 * material language as the homepage assembly — drift in from scattered
 * depths and compact into a tight modular mark as the counter climbs to
 * 100. When the loader hands off, they explode outward and dissolve,
 * clearing the frame straight into the hero.
 *
 * `progressRef.current = { p, explode }` carries live state from the DOM
 * loader (p = load 0..1, explode = handoff 0..1); read per frame, no
 * React re-renders.
 */

const easeOutCubic = (v) => 1 - Math.pow(1 - Math.min(Math.max(v, 0), 1), 3);
const easeInCubic = (v) => Math.pow(Math.min(Math.max(v, 0), 1), 3);
const lerp = (a, b, t) => a + (b - a) * t;
const DEG = Math.PI / 180;

// Compact target lays the blocks out as a small modular "W"; each carries
// a scattered pose it flies in from and an outward vector it explodes along.
const RAW = [
  { tx: -1.35, ty: 0.5, sx: -5.4, sy: 2.8, sz: -3, rot: -40, rx: 60, ry: -50, spin: 3.2 },
  { tx: -0.68, ty: -0.62, sx: -3.6, sy: -4.2, sz: 2.4, rot: 55, rx: -70, ry: 40, spin: -2.6 },
  { tx: 0, ty: 0.62, sx: 0.4, sy: 5, sz: -3.6, rot: -70, rx: 90, ry: 70, gold: true, spin: 3.8 },
  { tx: 0.68, ty: -0.62, sx: 3.8, sy: -3.8, sz: 2.8, rot: 44, rx: -55, ry: -60, spin: -3 },
  { tx: 1.35, ty: 0.5, sx: 5.2, sy: 3.2, sz: -2.4, rot: 30, rx: 65, ry: 55, spin: 2.4 },
];

const PIECES = RAW.map((b) => {
  const len = Math.hypot(b.tx, b.ty) || 1;
  return {
    ...b,
    dir: { x: b.tx / len, y: b.ty / len, z: (b.gold ? 0.6 : -0.4) },
  };
});

export default function PreloaderScene({ progressRef }) {
  return (
    <Canvas
      dpr={[1, 2]}
      camera={{ position: [0, 0, 9], fov: 34 }}
      gl={{ alpha: true, antialias: true }}
      style={{ position: "absolute", inset: 0 }}
    >
      <ambientLight intensity={0.6} />
      <directionalLight position={[4, 7, 9]} intensity={1.6} color="#fff3da" />
      <directionalLight position={[-6, -2, 4]} intensity={0.35} color="#f4efe6" />
      <pointLight position={[0, -1.5, 4]} intensity={12} color="#efc835" distance={12} decay={2} />
      <Blocks progressRef={progressRef} />
    </Canvas>
  );
}

function Blocks({ progressRef }) {
  const group = useRef();
  const meshes = useRef([]);

  const geometry = useMemo(() => roundedBlockGeometry(0.9, 0.9, 0.4, 0.09), []);
  const creamMat = useMemo(
    () => new THREE.MeshStandardMaterial({ color: "#f4efe6", roughness: 0.48, metalness: 0.06, transparent: true }),
    []
  );
  const goldMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: "#efc835",
        roughness: 0.3,
        metalness: 0.2,
        emissive: new THREE.Color("#efc835"),
        emissiveIntensity: 0.4,
        transparent: true,
      }),
    []
  );

  useFrame((state, delta) => {
    const { p, explode } = progressRef.current;
    const asm = easeOutCubic(p);
    const e = easeInCubic(explode);

    // Fit the mark on narrow viewports; quiet cursor orbit keeps it alive.
    // Sit it above centre so the wordmark + counter clear it below.
    const s = Math.min(1, state.viewport.width / 5.4);
    group.current.scale.setScalar(s);
    group.current.position.y = 1.4;
    const targetRY = state.pointer.x * 0.22 * (1 - e);
    const targetRX = -state.pointer.y * 0.14 * (1 - e);
    group.current.rotation.y += (targetRY - group.current.rotation.y) * 0.06;
    group.current.rotation.x += (targetRX - group.current.rotation.x) * 0.06;

    const t = state.clock.elapsedTime;
    PIECES.forEach((pc, i) => {
      const mesh = meshes.current[i];
      if (!mesh) return;
      // Assemble from scatter to the compact mark
      let x = lerp(pc.sx, pc.tx, asm);
      let y = lerp(pc.sy, pc.ty, asm);
      let z = lerp(pc.sz, 0, asm);
      let rz = lerp(pc.rot * DEG, 0, asm);
      let rx = lerp(pc.rx * DEG, 0, asm);
      let ry = lerp(pc.ry * DEG, 0, asm);
      // A hair of breathing drift once settled so the mark isn't dead still
      const breathe = asm * (1 - e);
      x += Math.sin(t * 0.6 + i) * 0.04 * breathe;
      y += Math.cos(t * 0.5 + i * 1.3) * 0.04 * breathe;

      // Explosion: fling outward, spin, dissolve
      x += pc.dir.x * e * 10;
      y += pc.dir.y * e * 10;
      z += pc.dir.z * e * 7;
      rz += e * pc.spin;
      rx += e * pc.spin * 0.6;

      mesh.position.set(x, y, z);
      mesh.rotation.set(rx, ry, rz);
      const sc = (0.88 + 0.12 * asm) * (1 - 0.4 * e);
      mesh.scale.setScalar(sc);
      mesh.material.opacity = 1 - easeOutCubic(explode);
    });
  });

  return (
    <group ref={group}>
      {PIECES.map((pc, i) => (
        <mesh
          key={i}
          ref={(el) => (meshes.current[i] = el)}
          geometry={geometry}
          material={pc.gold ? goldMat : creamMat}
        />
      ))}
    </group>
  );
}

function roundedBlockGeometry(w, h, depth, r) {
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
    depth: depth - 0.08,
    bevelEnabled: true,
    bevelThickness: 0.04,
    bevelSize: 0.04,
    bevelSegments: 2,
    curveSegments: 5,
  });
  geo.center();
  return geo;
}
