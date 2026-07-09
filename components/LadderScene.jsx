"use client";

import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { Canvas, useFrame } from "@react-three/fiber";

/*
 * The service ladder as a space you climb through.
 *
 * A first-person ascent up a lit corridor-staircase: real steps underfoot,
 * textured charcoal walls and ceiling flanking you, warm haze fading the
 * far end into the cream, dust drifting in the light and soft contact
 * shadows stacking down the flight. Scroll walks you up; the mouse looks
 * around. Five gold "checkpoints" — one per product — ignite as you reach
 * them, guiding the climb toward the light at the top.
 *
 * Charcoal ceramic + gold + a cream fog: the same palette as the homepage
 * assembly, now built as an interior.
 */

export const RUNGS = 5;
const NSTEPS = 30;
const RISE = 0.34; // step height
const RUN = 0.62; // step depth
const STAIR_W = 3.2;
const CORR_H = 3.3; // corridor height above the steps
const LSTEP = Math.hypot(RISE, RUN);
const THETA = Math.atan2(RISE, RUN); // stair incline
const MARK = [4, 10, 16, 22, 28]; // step index of each product checkpoint

const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
const c255 = (v) => Math.max(0, Math.min(255, v | 0));

export default function LadderScene({ progressRef }) {
  return (
    <Canvas
      shadows
      dpr={[1, 2]}
      camera={{ position: [0, 1.6, 3], fov: 62, near: 0.1, far: 60 }}
      gl={{ alpha: true, antialias: true }}
      style={{ position: "absolute", inset: 0 }}
    >
      {/* Cream haze so the corridor dissolves into the section background */}
      <fogExp2 attach="fog" args={["#efe9de", 0.062]} />
      <Corridor progressRef={progressRef} />
    </Canvas>
  );
}

function Corridor({ progressRef }) {
  const headlamp = useRef();
  const sun = useRef();
  const markerLights = useRef([]);
  const bandMats = useRef([]);
  const glowMat = useRef();
  const sunTarget = useMemo(() => new THREE.Object3D(), []);

  // Procedural plaster/concrete: a mottled colour map + a grayscale height
  // map used for surface bump. Made once, reused with per-surface tiling.
  const { colorCanvas, bumpCanvas } = useMemo(
    () => ({ colorCanvas: makeConcreteCanvas("#1b1712", 16), bumpCanvas: makeGrayNoiseCanvas(46) }),
    []
  );
  const tex = useMemo(() => {
    const make = (canvas, rx, ry) => {
      const t = new THREE.CanvasTexture(canvas);
      t.wrapS = t.wrapT = THREE.RepeatWrapping;
      t.repeat.set(rx, ry);
      t.anisotropy = 4;
      return t;
    };
    return {
      wallMap: make(colorCanvas, 5, 2.4),
      wallBump: make(bumpCanvas, 5, 2.4),
      ceilMap: make(colorCanvas, 5, 1),
      ceilBump: make(bumpCanvas, 5, 1),
      floorMap: make(colorCanvas, 3, 5),
      floorBump: make(bumpCanvas, 3, 5),
      stepBump: make(bumpCanvas, 2, 1),
    };
  }, [colorCanvas, bumpCanvas]);

  // Geometry --------------------------------------------------------------
  const stepGeo = useMemo(() => new THREE.BoxGeometry(STAIR_W, RISE, RUN), []);
  const wallGeo = useMemo(() => new THREE.BoxGeometry(0.3, CORR_H + 1.2, NSTEPS * LSTEP + 10), []);
  const ceilGeo = useMemo(() => new THREE.BoxGeometry(STAIR_W + 0.7, 0.3, NSTEPS * LSTEP + 10), []);
  const floorGeo = useMemo(() => new THREE.BoxGeometry(STAIR_W + 0.7, 0.3, NSTEPS * LSTEP + 10), []);
  const bandGeo = useMemo(() => new THREE.BoxGeometry(0.08, CORR_H * 0.82, 0.16), []);

  const stepMat = useMemo(
    () => new THREE.MeshStandardMaterial({ color: "#211c15", roughness: 0.72, metalness: 0.08, bumpMap: tex.stepBump, bumpScale: 0.012 }),
    [tex]
  );
  const markStepMat = useMemo(
    () => new THREE.MeshStandardMaterial({ color: "#2a2114", roughness: 0.56, metalness: 0.12, emissive: new THREE.Color("#efc835"), emissiveIntensity: 0.12, bumpMap: tex.stepBump, bumpScale: 0.012 }),
    [tex]
  );
  const wallMat = useMemo(
    () => new THREE.MeshStandardMaterial({ color: "#2b271f", roughness: 0.94, metalness: 0.03, map: tex.wallMap, bumpMap: tex.wallBump, bumpScale: 0.03 }),
    [tex]
  );
  const ceilMat = useMemo(
    () => new THREE.MeshStandardMaterial({ color: "#211d17", roughness: 0.96, metalness: 0.02, map: tex.ceilMap, bumpMap: tex.ceilBump, bumpScale: 0.03 }),
    [tex]
  );
  const floorMat = useMemo(
    () => new THREE.MeshStandardMaterial({ color: "#2c261d", roughness: 0.86, metalness: 0.04, map: tex.floorMap, bumpMap: tex.floorBump, bumpScale: 0.02 }),
    [tex]
  );

  const markerSet = useMemo(() => new Set(MARK), []);
  const tubeMid = -(NSTEPS * LSTEP) / 2 + 1;
  const glowTex = useGlowTexture();

  // Shadow-casting "sun" pouring down from the exit; its frustum follows
  // the viewer so the contact shadows stay crisp all the way up.
  useEffect(() => {
    if (!sun.current) return;
    sun.current.target = sunTarget;
    const s = sun.current.shadow;
    s.mapSize.set(2048, 2048);
    s.camera.left = -4;
    s.camera.right = 4;
    s.camera.top = 6;
    s.camera.bottom = -6;
    s.camera.near = 0.5;
    s.camera.far = 24;
    s.bias = -0.0004;
    s.normalBias = 0.02;
    s.camera.updateProjectionMatrix();
  }, [sunTarget]);

  useFrame((state) => {
    const p = clamp(progressRef.current, 0, 1);
    const c = MARK[0] - 2.5 + p * (MARK[RUNGS - 1] + 1.5 - (MARK[0] - 2.5));
    const t = state.clock.elapsedTime;

    // First-person camera: on the step, looking up the flight, with a gentle
    // idle sway and mouse-look so it feels hand-held and interactive.
    const px = state.pointer.x;
    const py = state.pointer.y;
    const cam = state.camera;
    const bob = Math.sin(t * 1.4) * 0.03;
    cam.position.x += (px * 0.7 - cam.position.x) * 0.06;
    cam.position.y += (c * RISE + 1.55 + bob - cam.position.y) * 0.1;
    cam.position.z += (-c * RUN + 1.5 - cam.position.z) * 0.1;
    cam.lookAt(px * 1.6, c * RISE + 1.35 + py * 1.1 + Math.sin(t * 0.5) * 0.04, -c * RUN - 5);

    // Headlamp travels with the viewer so nearby steps read
    if (headlamp.current) {
      headlamp.current.position.set(cam.position.x, cam.position.y + 0.2, cam.position.z - 0.2);
    }

    // Sun + shadow frustum follow the climb, pouring down the flight
    if (sun.current) {
      sun.current.position.set(cam.position.x + 1.5, cam.position.y + 6.5, cam.position.z - 2.5);
      sunTarget.position.set(cam.position.x, cam.position.y - 1.6, cam.position.z - 4.5);
      sunTarget.updateMatrixWorld();
    }

    // Checkpoints ignite as you reach them
    for (let k = 0; k < RUNGS; k++) {
      const prox = clamp(1 - Math.abs(c - MARK[k]) / 4.5, 0, 1);
      const light = markerLights.current[k];
      if (light) light.intensity = 0.8 + 11 * prox * prox;
      const em = 0.32 + 1.7 * prox;
      const bl = bandMats.current[k * 2];
      const br = bandMats.current[k * 2 + 1];
      if (bl) bl.emissiveIntensity = em;
      if (br) br.emissiveIntensity = em;
    }

    if (glowMat.current) glowMat.current.opacity = 0.42 + Math.sin(t * 0.8) * 0.04;
  });

  return (
    <group>
      <ambientLight intensity={0.42} color="#fff4e0" />
      <directionalLight ref={sun} castShadow position={[1.5, 8, -6]} intensity={1.2} color="#ffe8b8" />
      <primitive object={sunTarget} />
      <pointLight ref={headlamp} color="#ffe6b0" intensity={3} distance={8.5} decay={2} />

      {/* Corridor shell: floor, ceiling and two walls, tilted up the incline */}
      <group rotation={[THETA, 0, 0]}>
        <mesh geometry={floorGeo} material={floorMat} position={[0, -0.32, tubeMid]} receiveShadow />
        <mesh geometry={ceilGeo} material={ceilMat} position={[0, CORR_H - 0.35, tubeMid]} receiveShadow />
        <mesh geometry={wallGeo} material={wallMat} position={[-STAIR_W / 2 - 0.15, CORR_H / 2 - 0.35, tubeMid]} receiveShadow />
        <mesh geometry={wallGeo} material={wallMat} position={[STAIR_W / 2 + 0.15, CORR_H / 2 - 0.35, tubeMid]} receiveShadow />

        {/* Gold checkpoint bands set into each wall at the marker steps */}
        {MARK.map((m, k) => (
          <group key={k} position={[0, CORR_H * 0.46, -m * LSTEP]}>
            <mesh geometry={bandGeo} position={[-STAIR_W / 2 + 0.02, 0, 0]}>
              <meshStandardMaterial ref={(el) => (bandMats.current[k * 2] = el)} color="#efc835" emissive={new THREE.Color("#efc835")} emissiveIntensity={0.5} roughness={0.3} metalness={0.2} toneMapped={false} />
            </mesh>
            <mesh geometry={bandGeo} position={[STAIR_W / 2 - 0.02, 0, 0]}>
              <meshStandardMaterial ref={(el) => (bandMats.current[k * 2 + 1] = el)} color="#efc835" emissive={new THREE.Color("#efc835")} emissiveIntensity={0.5} roughness={0.3} metalness={0.2} toneMapped={false} />
            </mesh>
          </group>
        ))}
      </group>

      {/* Gold checkpoint lamps out in world space, at each landing */}
      {MARK.map((m, k) => (
        <pointLight key={k} ref={(el) => (markerLights.current[k] = el)} color="#ffcf4a" intensity={1.2} distance={7} decay={2} position={[0, m * RISE + 1.1, -m * RUN]} />
      ))}

      {/* Steps climbing away from the viewer — cast and receive shadows */}
      {Array.from({ length: NSTEPS }, (_, i) => (
        <mesh
          key={i}
          geometry={stepGeo}
          material={markerSet.has(i) ? markStepMat : stepMat}
          position={[0, (i + 0.5) * RISE, -(i + 0.5) * RUN]}
          castShadow
          receiveShadow
        />
      ))}

      {/* Dust drifting in the light */}
      <Dust />

      {/* Warm glow disc at the top of the flight — the exit light */}
      <mesh position={[0, NSTEPS * RISE + 0.5, -NSTEPS * RUN - 1]}>
        <planeGeometry args={[7, 7]} />
        <meshBasicMaterial ref={glowMat} map={glowTex} transparent opacity={0.5} depthWrite={false} toneMapped={false} />
      </mesh>
    </group>
  );
}

/* Fine motes suspended in the corridor, drifting slowly up the flight and
 * catching the gold light. Additive so they only ever add warmth. */
function Dust() {
  const ref = useRef();
  const N = 320;
  const dotTex = useMemo(() => makeDotTexture(), []);

  const positions = useMemo(() => {
    const arr = new Float32Array(N * 3);
    for (let i = 0; i < N; i++) {
      const u = Math.random() * NSTEPS;
      arr[i * 3] = (Math.random() - 0.5) * (STAIR_W - 0.4);
      arr[i * 3 + 1] = u * RISE + 0.25 + Math.random() * (CORR_H * 0.8);
      arr[i * 3 + 2] = -u * RUN + (Math.random() - 0.5) * 0.5;
    }
    return arr;
  }, []);

  const speeds = useMemo(() => {
    const arr = new Float32Array(N);
    for (let i = 0; i < N; i++) arr[i] = 0.15 + Math.random() * 0.5;
    return arr;
  }, []);

  const geo = useMemo(() => {
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    return g;
  }, [positions]);

  const maxY = NSTEPS * RISE + CORR_H;
  useFrame((state, delta) => {
    const dt = Math.min(delta, 0.05);
    const t = state.clock.elapsedTime;
    const arr = geo.attributes.position.array;
    for (let i = 0; i < N; i++) {
      arr[i * 3] += Math.sin(t * 0.5 + i) * 0.0016;
      arr[i * 3 + 1] += speeds[i] * dt * 0.35; // drift up the flight
      arr[i * 3 + 2] -= speeds[i] * dt * 0.35 * (RUN / RISE);
      if (arr[i * 3 + 1] > maxY) {
        const u = Math.random() * 3; // reappear near the bottom
        arr[i * 3 + 1] = u * RISE + 0.2;
        arr[i * 3 + 2] = -u * RUN + (Math.random() - 0.5) * 0.5;
        arr[i * 3] = (Math.random() - 0.5) * (STAIR_W - 0.4);
      }
    }
    geo.attributes.position.needsUpdate = true;
    if (ref.current) ref.current.material.opacity = 0.42 + Math.sin(t * 0.6) * 0.08;
  });

  return (
    <points ref={ref} geometry={geo}>
      <pointsMaterial
        map={dotTex}
        color="#ffdca0"
        size={0.05}
        sizeAttenuation
        transparent
        opacity={0.45}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        toneMapped={false}
      />
    </points>
  );
}

// Soft radial gold-cream glow for the exit at the top of the stairs
function useGlowTexture() {
  return useMemo(() => {
    const c = document.createElement("canvas");
    c.width = c.height = 128;
    const g = c.getContext("2d");
    const grad = g.createRadialGradient(64, 64, 2, 64, 64, 64);
    grad.addColorStop(0, "rgba(255,240,205,0.95)");
    grad.addColorStop(0.4, "rgba(239,200,53,0.35)");
    grad.addColorStop(1, "rgba(239,200,53,0)");
    g.fillStyle = grad;
    g.fillRect(0, 0, 128, 128);
    return new THREE.CanvasTexture(c);
  }, []);
}

function makeDotTexture() {
  const c = document.createElement("canvas");
  c.width = c.height = 64;
  const g = c.getContext("2d");
  const grad = g.createRadialGradient(32, 32, 0, 32, 32, 32);
  grad.addColorStop(0, "rgba(255,255,255,1)");
  grad.addColorStop(0.35, "rgba(255,246,220,0.6)");
  grad.addColorStop(1, "rgba(255,246,220,0)");
  g.fillStyle = grad;
  g.fillRect(0, 0, 64, 64);
  return new THREE.CanvasTexture(c);
}

// Mottled charcoal plaster: base tint + per-pixel grain + soft blotches
function makeConcreteCanvas(base, spread) {
  const size = 256;
  const c = document.createElement("canvas");
  c.width = c.height = size;
  const g = c.getContext("2d");
  g.fillStyle = base;
  g.fillRect(0, 0, size, size);
  const img = g.getImageData(0, 0, size, size);
  const d = img.data;
  for (let i = 0; i < d.length; i += 4) {
    const n = (Math.random() - 0.5) * spread;
    d[i] = c255(d[i] + n);
    d[i + 1] = c255(d[i + 1] + n);
    d[i + 2] = c255(d[i + 2] + n);
  }
  g.putImageData(img, 0, 0);
  for (let k = 0; k < 26; k++) {
    const x = Math.random() * size;
    const y = Math.random() * size;
    const r = 18 + Math.random() * 54;
    const light = Math.random() > 0.5;
    const a = 0.04 + Math.random() * 0.06;
    const grad = g.createRadialGradient(x, y, 0, x, y, r);
    grad.addColorStop(0, `rgba(${light ? 255 : 0},${light ? 255 : 0},${light ? 255 : 0},${a})`);
    grad.addColorStop(1, "rgba(0,0,0,0)");
    g.fillStyle = grad;
    g.beginPath();
    g.arc(x, y, r, 0, Math.PI * 2);
    g.fill();
  }
  return c;
}

// Grayscale height noise for bump mapping
function makeGrayNoiseCanvas(spread) {
  const size = 256;
  const c = document.createElement("canvas");
  c.width = c.height = size;
  const g = c.getContext("2d");
  g.fillStyle = "#808080";
  g.fillRect(0, 0, size, size);
  const img = g.getImageData(0, 0, size, size);
  const d = img.data;
  for (let i = 0; i < d.length; i += 4) {
    const n = 128 + (Math.random() - 0.5) * spread;
    d[i] = d[i + 1] = d[i + 2] = c255(n);
  }
  g.putImageData(img, 0, 0);
  // a few faint scratches / trowel streaks
  g.strokeStyle = "rgba(150,150,150,0.5)";
  for (let k = 0; k < 40; k++) {
    g.lineWidth = 0.5 + Math.random();
    g.beginPath();
    const y = Math.random() * size;
    g.moveTo(0, y);
    g.lineTo(size, y + (Math.random() - 0.5) * 20);
    g.stroke();
  }
  return c;
}
