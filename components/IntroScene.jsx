"use client";

import { useMemo, useRef } from "react";
import * as THREE from "three";
import { Canvas, useFrame } from "@react-three/fiber";

/*
 * Loader → hero transition, made physical from the tagline.
 *
 * "Led by Strategy" — a single gold line ignites at centre and draws
 * outward: one clear axis, drawn first, leading.
 * "Built in Culture" — cream ceramic bricks (the same material as the
 * assembly mark) bloom out of that line in a wave, dispersing into a
 * shallow 3D field with a few gold accents: the many, built from the one.
 *
 * `progressRef.current` (0..1) is the loader clock, read per frame.
 */

const COUNT = 60;
const DEG = Math.PI / 180;
const clamp01 = (v) => Math.min(1, Math.max(0, v));
const easeOutCubic = (v) => 1 - Math.pow(1 - clamp01(v), 3);
const easeInOut = (v) => (v < 0.5 ? 4 * v * v * v : 1 - Math.pow(-2 * v + 2, 3) / 2);

export default function IntroScene({ progressRef, burstRef }) {
  return (
    <Canvas
      dpr={[1, 1.5]}
      camera={{ position: [0, 0, 9], fov: 38 }}
      gl={{ alpha: true, antialias: true }}
      style={{ position: "absolute", inset: 0 }}
    >
      <ambientLight intensity={0.7} />
      <directionalLight position={[4, 6, 8]} intensity={1.4} color="#fff3da" />
      <directionalLight position={[-5, -2, 4]} intensity={0.35} color="#f4efe6" />
      <pointLight position={[0, -0.2, 4]} intensity={9} color="#efc835" distance={13} decay={2} />
      <Field progressRef={progressRef} burstRef={burstRef} />
    </Canvas>
  );
}

function Field({ progressRef, burstRef }) {
  const group = useRef();
  const lineRef = useRef();
  const bricks = useRef([]);

  const brickGeo = useMemo(() => roundedBlock(0.5, 0.5, 0.22, 0.08), []);
  const lineGeo = useMemo(() => new THREE.BoxGeometry(1, 0.055, 0.055), []);

  const creamMat = useMemo(
    () => new THREE.MeshStandardMaterial({ color: "#f4efe6", roughness: 0.5, metalness: 0.06, transparent: true }),
    []
  );
  const goldMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: "#efc835",
        roughness: 0.3,
        metalness: 0.2,
        emissive: new THREE.Color("#efc835"),
        emissiveIntensity: 0.3,
        transparent: true,
      }),
    []
  );
  const lineMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: "#efc835",
        roughness: 0.35,
        metalness: 0.3,
        emissive: new THREE.Color("#efc835"),
        emissiveIntensity: 1,
        transparent: true,
      }),
    []
  );

  // Bricks disperse on a golden-angle spiral so the field reads even; the
  // outer ones start later, so the bloom travels outward from the line.
  const field = useMemo(() => {
    const arr = [];
    for (let i = 0; i < COUNT; i++) {
      const ang = i * 137.5 * DEG;
      const rad = 1.1 + (i / COUNT) * 4.7;
      arr.push({
        tx: Math.cos(ang) * rad * 1.28,
        ty: Math.sin(ang) * rad * 0.72 - 0.2,
        tz: ((i % 5) - 2) * 0.52 - (i / COUNT) * 1.1,
        rx: ((i * 13) % 90 - 45) * DEG,
        ry: ((i * 29) % 90 - 45) * DEG,
        rz: ((i * 7) % 90 - 45) * DEG,
        // Bloom early (0.12 → ~0.5) so the field settles and is seen before
        // the counter finishes and the detonation begins.
        startFrac: Math.min(0.55, 0.12 + (rad / 6.4) * 0.42),
        gold: i % 11 === 5,
        sc: 0.58 + (i % 4) * 0.12,
      });
    }
    return arr;
  }, []);

  useFrame((state) => {
    const raw = progressRef.current;
    const burst = burstRef ? burstRef.current : 0;
    const be = burst * burst; // accelerate as the detonation takes hold

    // The strategic line: draws outward early, holds, then blows out.
    const lp = easeInOut(Math.min(1, raw / 0.38));
    if (lineRef.current) {
      lineRef.current.scale.x = (0.4 + lp * 9.6) * (1 + be * 3);
      lineMat.emissiveIntensity = (0.4 + lp * 0.9) * (1 - burst);
      lineMat.opacity = 1 - burst;
    }

    // Fit to viewport width; a slow ambient drift keeps it alive.
    const s = Math.min(1, state.viewport.width / 9);
    group.current.scale.setScalar(s);
    group.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.16) * 0.05 + state.pointer.x * 0.05;
    group.current.rotation.x = state.pointer.y * -0.04;

    // Culture spreads out into the world: the field detonates outward, staying
    // lit and cream until the tail so the blast reads before it dissolves.
    const expand = 1 + be * 7.4;
    const f = clamp01((burst - 0.32) / 0.68);
    const fade = 1 - f * f;
    creamMat.opacity = fade;
    goldMat.opacity = fade;

    field.forEach((b, i) => {
      const mesh = bricks.current[i];
      if (!mesh) return;
      const v = easeOutCubic((raw - b.startFrac) / (1 - b.startFrac));
      const bx = b.tx * v;
      const by = -0.2 * (1 - v) + b.ty * v;
      const bz = b.tz * v;
      // Explode outward across the frame, with a little depth toward the camera.
      mesh.position.set(bx * expand, by * expand, bz + be * 4.2);
      mesh.rotation.set(b.rx * v + be * 3.4, b.ry * v + be * 2.8, b.rz * v);
      const sc = b.sc * v;
      mesh.scale.setScalar(Math.max(0.0001, sc));
      mesh.visible = v > 0.002 && fade > 0.02;
    });
  });

  return (
    <group ref={group}>
      <mesh ref={lineRef} geometry={lineGeo} material={lineMat} position={[0, -0.2, 0.2]} />
      {field.map((b, i) => (
        <mesh
          key={i}
          ref={(el) => (bricks.current[i] = el)}
          geometry={brickGeo}
          material={b.gold ? goldMat : creamMat}
          visible={false}
        />
      ))}
    </group>
  );
}

function roundedBlock(w, h, depth, r) {
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
    depth: depth - 0.06,
    bevelEnabled: true,
    bevelThickness: 0.03,
    bevelSize: 0.03,
    bevelSegments: 2,
    curveSegments: 4,
  });
  geo.center();
  return geo;
}
