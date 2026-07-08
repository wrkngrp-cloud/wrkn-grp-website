"use client";

import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { Canvas, useFrame } from "@react-three/fiber";

/*
 * WebGL version of the assembly mechanic. Thirteen bevel-extruded
 * blocks, lit cream ceramic with one emissive gold piece, travel from
 * scattered depths into the modular W as scroll progress advances.
 *
 * - `progressRef.current` carries live scroll progress (0..1) from the
 *   pinned DOM section — read per frame, no React re-renders.
 * - The group hangs tilted while assembling and resolves to flat, with
 *   a damped cursor orbit layered on top (stronger while scattered,
 *   nearly still once the mark locks).
 */

const COLS = 7;
const ROWS = 5;
const SPACING = 1.04;

const easeOutCubic = (v) => 1 - Math.pow(1 - Math.min(Math.max(v, 0), 1), 3);
const DEG = Math.PI / 180;

export default function AssemblyScene({ progressRef, blocks }) {
  return (
    <Canvas
      dpr={[1, 2]}
      camera={{ position: [0, 0, 13], fov: 34 }}
      gl={{ alpha: true, antialias: true }}
      style={{ position: "absolute", inset: 0 }}
    >
      <ambientLight intensity={0.62} />
      <directionalLight position={[4, 7, 9]} intensity={1.5} color="#fff3da" />
      <directionalLight position={[-6, -2, 4]} intensity={0.35} color="#f4efe6" />
      <pointLight position={[0, -2.5, 4.5]} intensity={14} color="#efc835" distance={14} decay={2} />
      <BlockField progressRef={progressRef} blocks={blocks} />
    </Canvas>
  );
}

function BlockField({ progressRef, blocks }) {
  const group = useRef();
  const meshes = useRef([]);

  const geometry = useMemo(() => roundedBlockGeometry(0.92, 0.92, 0.4, 0.09), []);
  const creamMat = useMemo(
    () => new THREE.MeshStandardMaterial({ color: "#f4efe6", roughness: 0.48, metalness: 0.06 }),
    []
  );
  const goldMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: "#efc835",
        roughness: 0.3,
        metalness: 0.2,
        emissive: new THREE.Color("#efc835"),
        emissiveIntensity: 0.35,
      }),
    []
  );

  // Precompute per-block flight data: final grid slot + scattered pose
  const flights = useMemo(
    () =>
      blocks.map((b, i) => {
        const order = b.gold ? blocks.length - 1 : i;
        const start = 0.08 + (order / blocks.length) * 0.28;
        return {
          start,
          end: start + 0.3,
          fx: (b.c - (COLS - 1) / 2) * SPACING,
          fy: ((ROWS - 1) / 2 - b.r) * SPACING,
          // Scatter tuned to the camera frustum: pieces start visible in
          // the frame (some just past its edge), not lost off-screen.
          sx: b.dx / 130,
          sy: -b.dy / 120,
          sz: b.dz / 85,
          rz: b.rot * DEG,
          rx: b.rx * DEG,
          ry: b.ry * DEG,
        };
      }),
    [blocks]
  );

  useFrame((state) => {
    const p = progressRef.current;

    // Fit the 7-wide mark inside narrow viewports
    const s = Math.min(1, state.viewport.width / 8.6);
    group.current.scale.setScalar(s);

    // Base tilt resolves to flat by ~72% scroll; cursor orbit rides on
    // top and quiets down as the mark completes.
    const settle = easeOutCubic((p - 0.05) / 0.67);
    const orbit = 0.34 - 0.26 * settle;
    const targetRX = 0.42 * (1 - settle) + -state.pointer.y * orbit * 0.6;
    const targetRY = -0.24 * (1 - settle) + state.pointer.x * orbit;
    group.current.rotation.x += (targetRX - group.current.rotation.x) * 0.07;
    group.current.rotation.y += (targetRY - group.current.rotation.y) * 0.07;

    flights.forEach((f, i) => {
      const mesh = meshes.current[i];
      if (!mesh) return;
      const v = easeOutCubic((p - f.start) / (f.end - f.start));
      const inv = 1 - v;
      mesh.position.set(f.fx + f.sx * inv, f.fy + f.sy * inv, f.sz * inv);
      mesh.rotation.set(f.rx * inv, f.ry * inv, f.rz * inv);
      const sc = 0.84 + 0.16 * v;
      mesh.scale.setScalar(sc);
    });
  });

  return (
    <group ref={group}>
      {blocks.map((b, i) => (
        <mesh
          key={i}
          ref={(el) => (meshes.current[i] = el)}
          geometry={geometry}
          material={b.gold ? goldMat : creamMat}
        >
          {b.label && <LabelPlane text={b.label} />}
        </mesh>
      ))}
    </group>
  );
}

/*
 * The brick's label, drawn onto a canvas texture and floated a hair in
 * front of the extruded face so it tumbles and lands with the brick.
 */
function LabelPlane({ text }) {
  const texture = useMemo(() => {
    const canvas = document.createElement("canvas");
    canvas.width = 256;
    canvas.height = 256;
    drawLabel(canvas, text);
    const tex = new THREE.CanvasTexture(canvas);
    tex.anisotropy = 4;
    return tex;
  }, [text]);

  // Redraw once the brand font is actually loaded — the first paint may
  // have used the fallback sans.
  useEffect(() => {
    let alive = true;
    if (document.fonts?.ready) {
      document.fonts.ready.then(() => {
        if (!alive) return;
        drawLabel(texture.image, text);
        texture.needsUpdate = true;
      });
    }
    return () => {
      alive = false;
    };
  }, [text, texture]);

  return (
    <mesh position={[0, 0, 0.215]} raycast={() => null}>
      <planeGeometry args={[0.88, 0.88]} />
      <meshBasicMaterial map={texture} transparent toneMapped={false} />
    </mesh>
  );
}

function drawLabel(canvas, text) {
  const ctx = canvas.getContext("2d");
  const size = canvas.width;
  ctx.clearRect(0, 0, size, size);
  ctx.fillStyle = "#0a0a0a";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.font = "600 30px 'Heuvel Grotesk', 'General Sans', sans-serif";
  if ("letterSpacing" in ctx) ctx.letterSpacing = "3px";

  // Wrap on words; the longest label is three short lines
  const words = text.toUpperCase().split(" ");
  const lines = [];
  let line = "";
  for (const w of words) {
    const next = line ? `${line} ${w}` : w;
    if (ctx.measureText(next).width > size * 0.78 && line) {
      lines.push(line);
      line = w;
    } else {
      line = next;
    }
  }
  lines.push(line);

  // Shrink to fit: long single words (e.g. ILLUSTRATION) can't wrap
  const maxWidth = Math.max(...lines.map((l) => ctx.measureText(l).width));
  const fit = Math.min(1, (size * 0.8) / maxWidth);
  if (fit < 1) ctx.font = `600 ${Math.floor(30 * fit)}px 'Heuvel Grotesk', 'General Sans', sans-serif`;

  const lineHeight = 40 * Math.max(fit, 0.85);
  const startY = size / 2 - ((lines.length - 1) * lineHeight) / 2;
  lines.forEach((l, i) => ctx.fillText(l, size / 2, startY + i * lineHeight));
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
