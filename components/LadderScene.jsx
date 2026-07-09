"use client";

import { useMemo, useRef } from "react";
import * as THREE from "three";
import { Canvas, useFrame } from "@react-three/fiber";

/*
 * The service ladder as a space you climb through.
 *
 * A first-person ascent up a lit corridor-staircase: real steps underfoot,
 * charcoal walls and ceiling flanking you, warm haze fading the far end
 * into the cream. Scroll walks you up the flight; the mouse looks around.
 * Five gold "checkpoints" are set into the walls — one per product — and
 * ignite as you reach them, guiding the climb toward the light at the top.
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

export default function LadderScene({ progressRef }) {
  return (
    <Canvas
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
  const markerLights = useRef([]);
  const bandMats = useRef([]);
  const glowMat = useRef();

  // Geometry ---------------------------------------------------------------
  const stepGeo = useMemo(() => new THREE.BoxGeometry(STAIR_W, RISE, RUN), []);
  const wallGeo = useMemo(() => new THREE.BoxGeometry(0.3, CORR_H + 1.2, NSTEPS * LSTEP + 10), []);
  const ceilGeo = useMemo(() => new THREE.BoxGeometry(STAIR_W + 0.7, 0.3, NSTEPS * LSTEP + 10), []);
  const floorGeo = useMemo(() => new THREE.BoxGeometry(STAIR_W + 0.7, 0.3, NSTEPS * LSTEP + 10), []);
  const bandGeo = useMemo(() => new THREE.BoxGeometry(0.08, CORR_H * 0.82, 0.16), []);

  const stepMat = useMemo(
    () => new THREE.MeshStandardMaterial({ color: "#1f1b15", roughness: 0.62, metalness: 0.1 }),
    []
  );
  const markStepMat = useMemo(
    () => new THREE.MeshStandardMaterial({ color: "#2a2114", roughness: 0.5, metalness: 0.12, emissive: new THREE.Color("#efc835"), emissiveIntensity: 0.12 }),
    []
  );
  const wallMat = useMemo(
    () => new THREE.MeshStandardMaterial({ color: "#181510", roughness: 0.85, metalness: 0.04 }),
    []
  );
  const ceilMat = useMemo(
    () => new THREE.MeshStandardMaterial({ color: "#13110d", roughness: 0.9, metalness: 0.03 }),
    []
  );
  const floorMat = useMemo(
    () => new THREE.MeshStandardMaterial({ color: "#221d16", roughness: 0.8, metalness: 0.05 }),
    []
  );

  const markerSet = useMemo(() => new Set(MARK), []);
  const tubeMid = -(NSTEPS * LSTEP) / 2 + 1;
  const glowTex = useGlowTexture();

  useFrame((state) => {
    const p = clamp(progressRef.current, 0, 1);
    // Walk from just below the first checkpoint up to the last
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
    const lookAt = new THREE.Vector3(
      px * 1.6,
      c * RISE + 1.35 + py * 1.1 + Math.sin(t * 0.5) * 0.04,
      -c * RUN - 5
    );
    cam.lookAt(lookAt);

    // Headlamp travels with the viewer so nearby steps read
    if (headlamp.current) {
      headlamp.current.position.set(cam.position.x, cam.position.y + 0.2, cam.position.z - 0.2);
    }

    // Checkpoints ignite as you reach them
    for (let k = 0; k < RUNGS; k++) {
      const prox = clamp(1 - Math.abs(c - MARK[k]) / 4.5, 0, 1);
      const light = markerLights.current[k];
      if (light) light.intensity = 0.8 + 11 * prox * prox;
      const bl = bandMats.current[k * 2];
      const br = bandMats.current[k * 2 + 1];
      const em = 0.32 + 1.7 * prox;
      if (bl) bl.emissiveIntensity = em;
      if (br) br.emissiveIntensity = em;
    }

    // Soft glow disc at the top pulls the eye toward the exit
    if (glowMat.current) glowMat.current.opacity = 0.42 + Math.sin(t * 0.8) * 0.04;
  });

  const wallPositions = useMemo(() => {
    // Lay the corridor in a tube tilted to the stair incline
    const lift = CORR_H / 2 - 0.35;
    return { lift };
  }, []);

  return (
    <group>
      {/* Ambient + a warm key from the top (the light you climb toward) */}
      <ambientLight intensity={0.32} color="#fff4e0" />
      <directionalLight position={[0.5, 8, -6]} intensity={1.1} color="#ffe8b8" />
      <pointLight ref={headlamp} color="#ffe6b0" intensity={2.4} distance={7} decay={2} />

      {/* Corridor shell: floor, ceiling and two walls, tilted up the incline */}
      <group rotation={[THETA, 0, 0]}>
        <mesh geometry={floorGeo} material={floorMat} position={[0, -0.32, tubeMid]} />
        <mesh geometry={ceilGeo} material={ceilMat} position={[0, CORR_H - 0.35, tubeMid]} />
        <mesh geometry={wallGeo} material={wallMat} position={[-STAIR_W / 2 - 0.15, wallPositions.lift, tubeMid]} />
        <mesh geometry={wallGeo} material={wallMat} position={[STAIR_W / 2 + 0.15, wallPositions.lift, tubeMid]} />

        {/* Gold checkpoint bands set into each wall at the marker steps */}
        {MARK.map((m, k) => (
          <group key={k} position={[0, CORR_H * 0.46, -m * LSTEP]}>
            <mesh geometry={bandGeo} position={[-STAIR_W / 2 + 0.02, 0, 0]}>
              <meshStandardMaterial
                ref={(el) => (bandMats.current[k * 2] = el)}
                color="#efc835"
                emissive={new THREE.Color("#efc835")}
                emissiveIntensity={0.5}
                roughness={0.3}
                metalness={0.2}
                toneMapped={false}
              />
            </mesh>
            <mesh geometry={bandGeo} position={[STAIR_W / 2 - 0.02, 0, 0]}>
              <meshStandardMaterial
                ref={(el) => (bandMats.current[k * 2 + 1] = el)}
                color="#efc835"
                emissive={new THREE.Color("#efc835")}
                emissiveIntensity={0.5}
                roughness={0.3}
                metalness={0.2}
                toneMapped={false}
              />
            </mesh>
          </group>
        ))}
      </group>

      {/* Gold checkpoint lamps out in world space, at each landing */}
      {MARK.map((m, k) => (
        <pointLight
          key={k}
          ref={(el) => (markerLights.current[k] = el)}
          color="#ffcf4a"
          intensity={1.2}
          distance={7}
          decay={2}
          position={[0, m * RISE + 1.1, -m * RUN]}
        />
      ))}

      {/* Steps climbing away from the viewer */}
      {Array.from({ length: NSTEPS }, (_, i) => (
        <mesh
          key={i}
          geometry={stepGeo}
          material={markerSet.has(i) ? markStepMat : stepMat}
          position={[0, (i + 0.5) * RISE, -(i + 0.5) * RUN]}
        />
      ))}

      {/* Warm glow disc at the top of the flight — the exit light */}
      <mesh position={[0, NSTEPS * RISE + 0.5, -NSTEPS * RUN - 1]}>
        <planeGeometry args={[7, 7]} />
        <meshBasicMaterial ref={glowMat} map={glowTex} transparent opacity={0.5} depthWrite={false} toneMapped={false} />
      </mesh>
    </group>
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
