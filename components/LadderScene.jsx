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
const lp = (a, b, t) => a + (b - a) * t;
const smooth01 = (x) => x * x * (3 - 2 * x);
const c255 = (v) => Math.max(0, Math.min(255, v | 0));

export default function LadderScene({ progressRef }) {
  // Phones skip shadow maps (the heavy cost) but keep full resolution and
  // antialiasing so nothing looks pixelated.
  const mobile = isMobileDevice();
  return (
    <Canvas
      shadows={!mobile}
      dpr={[1, 2]}
      camera={{ position: [0, 1.6, 3], fov: 62, near: 0.1, far: 60 }}
      gl={{ alpha: true, antialias: true, powerPreference: "high-performance" }}
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
  const leverL = useRef([]);
  const leverR = useRef([]);
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
  const seamGeo = useMemo(() => new THREE.BoxGeometry(0.045, DOOR_H * 0.9, 0.09), []);
  const plateGeo = useMemo(() => new THREE.BoxGeometry(0.075, 0.3, 0.03), []);
  const leverGeo = useMemo(() => new THREE.BoxGeometry(0.22, 0.045, 0.05), []);

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
  const handleMat = useMemo(
    () => new THREE.MeshStandardMaterial({ color: "#e8c25c", roughness: 0.28, metalness: 0.7 }),
    []
  );
  // The apex: a warm, luminous back wall that turns the final room into a
  // light-filled destination rather than a dead end.
  const apexTex = useMemo(() => makeApexTexture(), []);
  const apexGeo = useMemo(() => new THREE.PlaneGeometry(6.6, 4.7), []);
  const mullionMat = useMemo(
    () => new THREE.MeshStandardMaterial({ color: "#0e0b06", roughness: 0.7, metalness: 0.2 }),
    []
  );
  const apexMat = useMemo(
    () => new THREE.MeshBasicMaterial({ map: apexTex, toneMapped: false }),
    [apexTex]
  );
  // Warm charcoal for the dais/desk at the summit
  const apexDarkMat = useMemo(
    () => new THREE.MeshStandardMaterial({ color: "#221a11", roughness: 0.52, metalness: 0.16 }),
    []
  );
  // The leadership chair: a warmer, softer dark leather so it reads as an
  // upholstered seat catching the room light, not a black cutout.
  const chairMat = useMemo(
    () => new THREE.MeshStandardMaterial({ color: "#33261a", roughness: 0.62, metalness: 0.12 }),
    []
  );
  // Set-dressing so each room speaks to its offering: a dark board backing plus
  // three self-lit accents (gold, warm cream, amber) that glow without adding
  // dynamic lights.
  const boardMat = useMemo(
    () => new THREE.MeshStandardMaterial({ color: "#171009", roughness: 0.85, metalness: 0.05 }),
    []
  );
  const emGold = useMemo(
    () => new THREE.MeshBasicMaterial({ color: "#ffdf8f", toneMapped: false, side: THREE.DoubleSide }),
    []
  );
  const emCream = useMemo(
    () => new THREE.MeshBasicMaterial({ color: "#e7dabd", toneMapped: false, side: THREE.DoubleSide }),
    []
  );
  const emAmber = useMemo(
    () => new THREE.MeshBasicMaterial({ color: "#f4c65e", toneMapped: false, side: THREE.DoubleSide }),
    []
  );

  const tubeMid = -(NSTEPS * LSTEP) / 2 + 1;
  const jambX = (DOOR_W + (STAIR_W + 0.3 - DOOR_W) / 2) / 2; // centre of each jamb

  useEffect(() => {
    if (!sun.current) return;
    sun.current.target = sunTarget;
    if (mobile) return; // no shadow map on phones
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
  }, [sunTarget, mobile]);

  useFrame((state) => {
    const p = clamp(progressRef.current, 0, 1);
    // Climb from before the first door up past the last one, walking right
    // into the command room at the summit.
    const c = MARK[0] - 3 + p * (NSTEPS + 2 - (MARK[0] - 3));
    const t = state.clock.elapsedTime;

    // First-person camera: climbing, with a slow idle sway + mouse-look. Near
    // the top it levels off onto the landing and squares up to the command
    // desk, so you arrive facing the leadership seat rather than overshooting.
    const px = state.pointer.x;
    const py = state.pointer.y;
    const cam = state.camera;
    const bob = Math.sin(t * 0.7) * 0.015;
    const sway = Math.sin(t * 0.4) * 0.025;
    const arrive = smooth01(clamp((p - 0.72) / 0.16, 0, 1)); // fully in the room by ~0.88
    const cc = Math.min(c, NSTEPS - 1.5); // climb pose stops at the top step
    const yTop = NSTEPS * RISE;
    const zTop = -NSTEPS * RUN;

    // Arrival pose: stand just inside the threshold, offset to one side and
    // looking gently down, so the whole command office composes in a 3/4 view
    // rather than pressing the lens against the chair.
    const camX = lp(px * 0.5, 0.3 + px * 0.15, arrive);
    const camY = lp(cc * RISE + 1.55 + bob, yTop + 1.95 + bob * 0.4, arrive);
    const camZ = lp(-cc * RUN + 1.5, zTop + 1.5, arrive); // just past the door, into the room
    cam.position.x += (camX - cam.position.x) * 0.05;
    cam.position.y += (camY - cam.position.y) * 0.08;
    cam.position.z += (camZ - cam.position.z) * 0.08;

    const lookX = lp(px * 1.2, px * 0.2, arrive);
    const lookY = lp(cc * RISE + 1.3 + py * 0.85 + sway, yTop + 1.62 + py * 0.25 + sway * 0.5, arrive);
    const lookZ = lp(-cc * RUN - 5, zTop - 2.1, arrive);
    cam.lookAt(lookX, lookY, lookZ);

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
      // The handle turns down first, then the door swings open behind it.
      const turn = clamp(open * 4, 0, 1);
      const a = clamp((open - 0.12) / 0.88, 0, 1) * 1.95;
      if (leverL.current[k]) leverL.current[k].rotation.z = turn * 0.85;
      if (leverR.current[k]) leverR.current[k].rotation.z = -turn * 0.85;
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

              {/* Two doors, hinged at the jambs, swinging into the next room,
                  each with a gold lever handle that turns as it opens. */}
              <group ref={(el) => (doorL.current[k] = el)} position={[-DOOR_W / 2, OPEN_B + DOOR_H / 2, 0]}>
                <mesh geometry={panelGeo} material={panelMat} position={[DOOR_W / 4, 0, 0]} castShadow receiveShadow />
                <mesh geometry={seamGeo} material={seamMat} position={[DOOR_W / 2 - 0.02, 0, 0.05]} />
                <group position={[DOOR_W / 2 - 0.15, -0.02, 0.055]}>
                  <mesh geometry={plateGeo} material={handleMat} castShadow />
                  <group ref={(el) => (leverL.current[k] = el)} position={[-0.015, 0, 0.03]}>
                    <mesh geometry={leverGeo} material={handleMat} position={[-0.1, 0, 0]} castShadow />
                  </group>
                </group>
              </group>
              <group ref={(el) => (doorR.current[k] = el)} position={[DOOR_W / 2, OPEN_B + DOOR_H / 2, 0]}>
                <mesh geometry={panelGeo} material={panelMat} position={[-DOOR_W / 4, 0, 0]} castShadow receiveShadow />
                <mesh geometry={seamGeo} material={seamMat} position={[-DOOR_W / 2 + 0.02, 0, 0.05]} />
                <group position={[-DOOR_W / 2 + 0.15, -0.02, 0.055]}>
                  <mesh geometry={plateGeo} material={handleMat} castShadow />
                  <group ref={(el) => (leverR.current[k] = el)} position={[0.015, 0, 0.03]}>
                    <mesh geometry={leverGeo} material={handleMat} position={[0.1, 0, 0]} castShadow />
                  </group>
                </group>
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

      {/* Each door opens on a room dressed for its offering. The rooms sit in
          world space (upright) along the climb, timed to the copy that reads
          alongside them, and each leads the eye up to the next threshold. */}

      {/* Room 01 — Brand Positioning Workshop: the one thing you stand for,
          pinned down. A dark board on each wall with a gold crosshair and a
          single lit point. */}
      <group position={[0, 3.5 * RISE, -3.5 * RUN]}>
        {[-1, 1].map((side) => (
          <group key={side} position={[side * 1.5, 1.15, 0]} rotation={[0, -side * Math.PI / 2, 0]}>
            <mesh material={boardMat} castShadow>
              <boxGeometry args={[1.5, 1.5, 0.06]} />
            </mesh>
            <mesh material={emGold} position={[0, 0, 0.04]}>
              <boxGeometry args={[1.15, 0.018, 0.02]} />
            </mesh>
            <mesh material={emGold} position={[0, 0, 0.04]}>
              <boxGeometry args={[0.018, 1.15, 0.02]} />
            </mesh>
            <mesh material={emGold} position={[0.26, 0.2, 0.05]}>
              <boxGeometry args={[0.1, 0.1, 0.03]} />
            </mesh>
          </group>
        ))}
      </group>

      {/* Room 02 — Brand Strategy Sprint: the position built into a plan. A wall
          of pinned strategy pages on each side, threaded by a gold line. */}
      <group position={[0, 8 * RISE, -8 * RUN]}>
        {[-1, 1].map((side) => (
          <group key={side} position={[side * 1.5, 1.28, 0]} rotation={[0, -side * Math.PI / 2, 0]}>
            {[-0.52, 0, 0.52].map((x) =>
              [0.42, -0.24].map((y) => (
                <mesh key={`${x}-${y}`} material={emCream} position={[x, y, 0.03]}>
                  <planeGeometry args={[0.4, 0.54]} />
                </mesh>
              ))
            )}
            <mesh material={emGold} position={[0, 0.09, 0.04]}>
              <boxGeometry args={[1.45, 0.014, 0.02]} />
            </mesh>
          </group>
        ))}
      </group>

      {/* Room 03 — Creative Advisory Retainer: a thinking partner in the room.
          Two chairs facing each other under a single warm pendant. */}
      <group position={[0, 14.5 * RISE, -14.5 * RUN]}>
        {[-1, 1].map((side) => (
          <group key={side} position={[side * 1.0, 0, 0]} rotation={[0, -side * Math.PI / 2, 0]}>
            <mesh material={chairMat} position={[0, 0.45, 0]} castShadow>
              <boxGeometry args={[0.66, 0.12, 0.62]} />
            </mesh>
            <mesh material={chairMat} position={[0, 0.85, -0.28]} castShadow>
              <boxGeometry args={[0.7, 0.9, 0.12]} />
            </mesh>
            <mesh material={chairMat} position={[-0.3, 0.62, 0]} castShadow>
              <boxGeometry args={[0.1, 0.34, 0.56]} />
            </mesh>
            <mesh material={chairMat} position={[0.3, 0.62, 0]} castShadow>
              <boxGeometry args={[0.1, 0.34, 0.56]} />
            </mesh>
          </group>
        ))}
        <mesh material={emAmber} position={[0, 1.78, 0]}>
          <boxGeometry args={[0.16, 0.16, 0.16]} />
        </mesh>
        {!mobile && (
          <pointLight color="#ffca6e" intensity={4.5} distance={6} decay={2} position={[0, 1.62, 0]} />
        )}
      </group>

      {/* Room 04 — Campaign Strategy & Brand Initiatives: take it to market.
          Banners hang overhead on both sides, gold-hemmed, catching the light. */}
      <group position={[0, 20.5 * RISE, -20.5 * RUN]}>
        {[-1.4, -0.8, 0.8, 1.4].map((x, i) => (
          <group key={i} position={[x, 2.05, i < 2 ? -0.3 : 0.3]}>
            <mesh material={emCream}>
              <planeGeometry args={[0.46, 1.5]} />
            </mesh>
            <mesh material={emGold} position={[0, -0.78, 0.01]}>
              <boxGeometry args={[0.48, 0.06, 0.02]} />
            </mesh>
            <mesh material={emGold} position={[0, 0.78, 0.01]}>
              <boxGeometry args={[0.48, 0.06, 0.02]} />
            </mesh>
          </group>
        ))}
        {!mobile && (
          <pointLight color="#ffe6b0" intensity={5} distance={9} decay={2} position={[0, 2.4, 0]} />
        )}
      </group>

      {/* The apex: the seat of leadership. A command desk and a high-backed
          chair on a raised dais, backlit by a warm view — the CMO seat you
          climb toward, where WRKN GRP takes ownership of the whole function. */}
      <group position={[0, NSTEPS * RISE, -NSTEPS * RUN]}>
        {/* Warm dusk skyline behind the seat — backlights the silhouette */}
        <mesh geometry={apexGeo} material={apexMat} position={[0, 2.35, -3.62]} />
        {/* Window mullions: two verticals + one horizontal transom so the glow
            reads as a floor-to-ceiling corner-office window */}
        <mesh material={mullionMat} position={[-1.6, 2.35, -3.55]}>
          <boxGeometry args={[0.08, 4.7, 0.06]} />
        </mesh>
        <mesh material={mullionMat} position={[1.6, 2.35, -3.55]}>
          <boxGeometry args={[0.08, 4.7, 0.06]} />
        </mesh>
        <mesh material={mullionMat} position={[0, 3.15, -3.55]}>
          <boxGeometry args={[6.6, 0.08, 0.06]} />
        </mesh>
        <mesh material={mullionMat} position={[0, 1.4, -3.55]}>
          <boxGeometry args={[6.6, 0.07, 0.06]} />
        </mesh>

        {/* Raised dais with a gold leading edge */}
        <mesh material={apexDarkMat} position={[0, 0.1, -1.9]} receiveShadow castShadow>
          <boxGeometry args={[3.6, 0.3, 3.0]} />
        </mesh>
        <mesh material={handleMat} position={[0, 0.26, -0.42]}>
          <boxGeometry args={[3.6, 0.05, 0.07]} />
        </mesh>

        {/* Command desk: front panel + top slab with a gold inlay */}
        <mesh material={apexDarkMat} position={[0, 0.64, -1.2]} castShadow>
          <boxGeometry args={[2.4, 0.74, 0.16]} />
        </mesh>
        <mesh material={apexDarkMat} position={[0, 1.02, -1.48]} castShadow>
          <boxGeometry args={[2.55, 0.12, 1.0]} />
        </mesh>
        <mesh material={handleMat} position={[0, 1.09, -1.02]}>
          <boxGeometry args={[2.55, 0.02, 0.07]} />
        </mesh>

        {/* High-backed leadership chair, facing the climber */}
        <mesh material={chairMat} position={[0, 0.9, -2.25]} castShadow>
          <boxGeometry args={[0.94, 0.18, 0.8]} />
        </mesh>
        <mesh material={chairMat} position={[0, 1.9, -2.6]} castShadow>
          <boxGeometry args={[0.98, 2.05, 0.16]} />
        </mesh>
        <mesh material={handleMat} position={[0, 2.93, -2.6]}>
          <boxGeometry args={[0.98, 0.06, 0.19]} />
        </mesh>
        {/* Armrests read the silhouette as a chair, not a slab */}
        <mesh material={chairMat} position={[-0.53, 1.14, -2.3]} castShadow>
          <boxGeometry args={[0.12, 0.5, 0.66]} />
        </mesh>
        <mesh material={chairMat} position={[0.53, 1.14, -2.3]} castShadow>
          <boxGeometry args={[0.12, 0.5, 0.66]} />
        </mesh>

        {/* Warm command lighting: backlight, camera-side fill, and a soft
            overhead so the room glows rather than reads gloomy */}
        <pointLight color="#ffe6b0" intensity={7} distance={11} decay={2} position={[0, 2.6, -3.1]} />
        <pointLight color="#ffdf9a" intensity={9} distance={9} decay={2} position={[0, 1.55, -0.4]} />
        <pointLight color="#ffdca0" intensity={4} distance={13} decay={2} position={[0, 3.3, -1.2]} />
      </group>
      <pointLight color="#ffd27a" intensity={4} distance={13} decay={2} position={[0, NSTEPS * RISE + 0.4, -(NSTEPS - 5) * RUN]} />
    </group>
  );
}

// The view from the summit: a warm dusk skyline seen through a corner-office
// window. A graded sky drops to a bright horizon, a low city silhouette sits
// on it, and warm haze lifts off the skyline — a destination, not a dead end.
function makeApexTexture() {
  const w = 512;
  const h = 400;
  const c = document.createElement("canvas");
  c.width = w;
  c.height = h;
  const g = c.getContext("2d");

  // Sky: deep warm amber up top easing to a hot horizon glow
  const sky = g.createLinearGradient(0, 0, 0, h);
  sky.addColorStop(0, "#3a2c10");
  sky.addColorStop(0.34, "#7a541a");
  sky.addColorStop(0.6, "#c68f34");
  sky.addColorStop(0.78, "#ffd97e");
  sky.addColorStop(0.9, "#ffe9ad");
  sky.addColorStop(1, "#fff2cf");
  g.fillStyle = sky;
  g.fillRect(0, 0, w, h);

  // Sun bloom low on the horizon
  const horizon = h * 0.82;
  const bloom = g.createRadialGradient(w * 0.5, horizon, 6, w * 0.5, horizon, w * 0.5);
  bloom.addColorStop(0, "rgba(255,247,224,0.95)");
  bloom.addColorStop(0.5, "rgba(255,224,150,0.35)");
  bloom.addColorStop(1, "rgba(255,224,150,0)");
  g.fillStyle = bloom;
  g.fillRect(0, 0, w, h);

  // City silhouette: staggered towers rising to the horizon
  g.fillStyle = "rgba(24,17,7,0.92)";
  let x = -10;
  while (x < w + 10) {
    const bw = 12 + Math.random() * 30;
    const bh = 20 + Math.random() * 120;
    g.fillRect(x, horizon - bh, bw, bh + (h - horizon));
    // occasional lit window rows
    if (Math.random() > 0.55) {
      g.fillStyle = "rgba(255,214,140,0.5)";
      for (let wy = horizon - bh + 8; wy < horizon - 6; wy += 12) {
        if (Math.random() > 0.5) g.fillRect(x + 4, wy, bw - 8, 3);
      }
      g.fillStyle = "rgba(24,17,7,0.92)";
    }
    x += bw + 3 + Math.random() * 6;
  }
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
