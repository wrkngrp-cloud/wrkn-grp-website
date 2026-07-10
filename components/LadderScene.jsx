"use client";

import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { Canvas, useFrame } from "@react-three/fiber";
import { isMobileDevice } from "./perf";

/*
 * The service ladder as a climb through rooms.
 *
 * A first-person ascent up a staircase that passes through doorway after
 * doorway: each product is a threshold, and as you reach it the doors
 * swing open into the next room — another flight, another door, warm light
 * spilling from beyond. Textured charcoal walls, real contact shadows, and
 * a dark warm haze keep it cinematic; the copy reads over a dark scrim.
 */

export const RUNGS = 5;
const NSTEPS = 30;
const RISE = 0.34;
const RUN = 0.62;
const STAIR_W = 3.2;
const CORR_H = 3.3;
const LSTEP = Math.hypot(RISE, RUN);
const THETA = Math.atan2(RISE, RUN);
const MARK = [4, 10, 16, 22, 28]; // step index of each doorway

const DOOR_W = 2.0; // opening width
const DOOR_H = 2.55; // opening height
const OPEN_B = -0.2; // opening bottom (just above the floor line)
const CEIL = CORR_H - 0.5; // ceiling underside
const FLOORY = -0.35;

const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
const c255 = (v) => Math.max(0, Math.min(255, v | 0));

export default function LadderScene({ progressRef }) {
  // Phones can't afford shadow maps or 2x DPR here — dial the scene down.
  const mobile = isMobileDevice();
  return (
    <Canvas
      shadows={!mobile}
      dpr={mobile ? [1, 1.3] : [1, 1.75]}
      camera={{ position: [0, 1.6, 3], fov: 62, near: 0.1, far: 60 }}
      gl={{ alpha: true, antialias: !mobile, powerPreference: "high-performance" }}
      style={{ position: "absolute", inset: 0 }}
    >
      {/* Dark warm haze so unlit rooms fall away into shadow */}
      <fogExp2 attach="fog" args={["#1a150d", 0.04]} />
      <Corridor progressRef={progressRef} mobile={mobile} />
    </Canvas>
  );
}

function Corridor({ progressRef, mobile }) {
  const headlamp = useRef();
  const sun = useRef();
  const roomLight = useRef();
  const doorL = useRef([]);
  const doorR = useRef([]);
  const sunTarget = useMemo(() => new THREE.Object3D(), []);

  // Procedural plaster: mottled colour map + grayscale bump
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
      panelBump: make(bumpCanvas, 1, 2),
    };
  }, [colorCanvas, bumpCanvas]);

  // Geometry --------------------------------------------------------------
  const stepGeo = useMemo(() => new THREE.BoxGeometry(STAIR_W, RISE, RUN), []);
  const long = NSTEPS * LSTEP + 10;
  const wallGeo = useMemo(() => new THREE.BoxGeometry(0.3, CORR_H + 1.2, long), [long]);
  const ceilGeo = useMemo(() => new THREE.BoxGeometry(STAIR_W + 0.7, 0.3, long), [long]);
  const floorGeo = useMemo(() => new THREE.BoxGeometry(STAIR_W + 0.7, 0.3, long), [long]);
  const jambGeo = useMemo(() => new THREE.BoxGeometry((STAIR_W + 0.3 - DOOR_W) / 2, CEIL - FLOORY, 0.2), []);
  const lintelGeo = useMemo(() => new THREE.BoxGeometry(DOOR_W + 0.24, CEIL - (OPEN_B + DOOR_H), 0.2), []);
  const panelGeo = useMemo(() => new THREE.BoxGeometry(DOOR_W / 2, DOOR_H, 0.07), []);
  const seamGeo = useMemo(() => new THREE.BoxGeometry(0.05, DOOR_H * 0.9, 0.09), []);

  const stepMat = useMemo(
    () => new THREE.MeshStandardMaterial({ color: "#211c15", roughness: 0.72, metalness: 0.08, bumpMap: tex.stepBump, bumpScale: 0.012 }),
    [tex]
  );
  const wallMat = useMemo(
    () => new THREE.MeshStandardMaterial({ color: "#2b271f", roughness: 0.94, metalness: 0.03, map: tex.wallMap, bumpMap: tex.wallBump, bumpScale: 0.03 }),
    [tex]
  );
  const ceilMat = useMemo(
    () => new THREE.MeshStandardMaterial({ color: "#201c16", roughness: 0.96, metalness: 0.02, map: tex.ceilMap, bumpMap: tex.ceilBump, bumpScale: 0.03 }),
    [tex]
  );
  const floorMat = useMemo(
    () => new THREE.MeshStandardMaterial({ color: "#2c261d", roughness: 0.86, metalness: 0.04, map: tex.floorMap, bumpMap: tex.floorBump, bumpScale: 0.02 }),
    [tex]
  );
  const frameMat = useMemo(
    () => new THREE.MeshStandardMaterial({ color: "#221c15", roughness: 0.9, metalness: 0.05 }),
    []
  );
  const panelMat = useMemo(
    () => new THREE.MeshStandardMaterial({ color: "#2c2519", roughness: 0.62, metalness: 0.12, bumpMap: tex.panelBump, bumpScale: 0.02 }),
    [tex]
  );
  const seamMat = useMemo(
    () => new THREE.MeshStandardMaterial({ color: "#b08a1e", roughness: 0.4, metalness: 0.5 }),
    []
  );

  const tubeMid = -(NSTEPS * LSTEP) / 2 + 1;
  const jambX = (DOOR_W + (STAIR_W + 0.3 - DOOR_W) / 2) / 2; // centre of each jamb

  useEffect(() => {
    if (!sun.current) return;
    sun.current.target = sunTarget;
    if (mobile) return; // no shadow map on phones
    const s = sun.current.shadow;
    s.mapSize.set(1024, 1024);
    s.camera.left = -4;
    s.camera.right = 4;
    s.camera.top = 6;
    s.camera.bottom = -6;
    s.camera.near = 0.5;
    s.camera.far = 24;
    s.bias = -0.0004;
    s.normalBias = 0.02;
    s.camera.updateProjectionMatrix();
  }, [sunTarget, mobile]);

  useFrame((state) => {
    const p = clamp(progressRef.current, 0, 1);
    const c = MARK[0] - 3 + p * (MARK[RUNGS - 1] + 1.5 - (MARK[0] - 3));
    const t = state.clock.elapsedTime;

    // First-person camera: climbing, gentle idle sway + mouse-look
    const px = state.pointer.x;
    const py = state.pointer.y;
    const cam = state.camera;
    const bob = Math.sin(t * 1.4) * 0.03;
    cam.position.x += (px * 0.6 - cam.position.x) * 0.06;
    cam.position.y += (c * RISE + 1.55 + bob - cam.position.y) * 0.1;
    cam.position.z += (-c * RUN + 1.5 - cam.position.z) * 0.1;
    cam.lookAt(px * 1.4, c * RISE + 1.3 + py * 1.0 + Math.sin(t * 0.5) * 0.04, -c * RUN - 5);

    if (headlamp.current) headlamp.current.position.set(cam.position.x, cam.position.y + 0.2, cam.position.z - 0.2);
    if (sun.current) {
      sun.current.position.set(cam.position.x + 1.5, cam.position.y + 6.5, cam.position.z - 2.5);
      sunTarget.position.set(cam.position.x, cam.position.y - 1.6, cam.position.z - 4.5);
      sunTarget.updateMatrixWorld();
    }

    // Doors swing open as you approach; track the nearest to light its room
    let near = 0;
    let nearDist = Infinity;
    for (let k = 0; k < RUNGS; k++) {
      const m = MARK[k];
      const open = clamp((c - (m - 3.5)) / 2.6, 0, 1);
      const a = open * 1.95;
      if (doorL.current[k]) doorL.current[k].rotation.y = -a;
      if (doorR.current[k]) doorR.current[k].rotation.y = a;
      const d = Math.abs(c - m);
      if (d < nearDist) {
        nearDist = d;
        near = k;
      }
    }
    // A single warm lamp pools in the room beyond the door you're at
    if (roomLight.current) {
      const m = MARK[near];
      const open = clamp((c - (m - 3.5)) / 2.6, 0, 1);
      roomLight.current.position.set(0, m * RISE + 1.05, -m * RUN - 1.4);
      roomLight.current.intensity = 0.8 + open * 4.4;
    }
  });

  return (
    <group>
      <ambientLight intensity={0.7} color="#fff2da" />
      <directionalLight ref={sun} castShadow={!mobile} position={[1.5, 8, -6]} intensity={1.45} color="#ffe6b0" />
      <primitive object={sunTarget} />
      <pointLight ref={headlamp} color="#ffe4ab" intensity={4.8} distance={10.5} decay={2} />
      <pointLight ref={roomLight} color="#ffca6e" intensity={0.8} distance={7.5} decay={2} />

      {/* Corridor shell + doorways, tilted up the incline */}
      <group rotation={[THETA, 0, 0]}>
        <mesh geometry={floorGeo} material={floorMat} position={[0, FLOORY, tubeMid]} receiveShadow />
        <mesh geometry={ceilGeo} material={ceilMat} position={[0, CORR_H - 0.35, tubeMid]} receiveShadow />
        <mesh geometry={wallGeo} material={wallMat} position={[-STAIR_W / 2 - 0.15, CORR_H / 2 - 0.35, tubeMid]} receiveShadow />
        <mesh geometry={wallGeo} material={wallMat} position={[STAIR_W / 2 + 0.15, CORR_H / 2 - 0.35, tubeMid]} receiveShadow />

        {MARK.map((m, k) => {
          const z = -m * LSTEP;
          return (
            <group key={k} position={[0, 0, z]}>
              {/* Frame: two jambs + a lintel over the opening */}
              <mesh geometry={jambGeo} material={frameMat} position={[-jambX, (CEIL + FLOORY) / 2, 0]} receiveShadow />
              <mesh geometry={jambGeo} material={frameMat} position={[jambX, (CEIL + FLOORY) / 2, 0]} receiveShadow />
              <mesh geometry={lintelGeo} material={frameMat} position={[0, (CEIL + OPEN_B + DOOR_H) / 2, 0]} receiveShadow />

              {/* Two doors, hinged at the jambs, swinging into the next room */}
              <group ref={(el) => (doorL.current[k] = el)} position={[-DOOR_W / 2, OPEN_B + DOOR_H / 2, 0]}>
                <mesh geometry={panelGeo} material={panelMat} position={[DOOR_W / 4, 0, 0]} castShadow receiveShadow />
                <mesh geometry={seamGeo} material={seamMat} position={[DOOR_W / 2 - 0.02, 0, 0.05]} />
              </group>
              <group ref={(el) => (doorR.current[k] = el)} position={[DOOR_W / 2, OPEN_B + DOOR_H / 2, 0]}>
                <mesh geometry={panelGeo} material={panelMat} position={[-DOOR_W / 4, 0, 0]} castShadow receiveShadow />
                <mesh geometry={seamGeo} material={seamMat} position={[-DOOR_W / 2 + 0.02, 0, 0.05]} />
              </group>
            </group>
          );
        })}
      </group>

      {/* Steps climbing away from the viewer — cast + receive shadows */}
      {Array.from({ length: NSTEPS }, (_, i) => (
        <mesh
          key={i}
          geometry={stepGeo}
          material={stepMat}
          position={[0, (i + 0.5) * RISE, -(i + 0.5) * RUN]}
          castShadow
          receiveShadow
        />
      ))}

      {/* A quiet warm light in the final room at the top of the climb */}
      <pointLight color="#ffcf7a" intensity={2.6} distance={11} decay={2} position={[0, NSTEPS * RISE + 1.4, -NSTEPS * RUN - 1.5]} />
    </group>
  );
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
