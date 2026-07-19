"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { makeWarmEnv } from "./warmEnv";

/*
 * The lollipop: the mark made physical, and the hero's one 3D object.
 * A small flat-disc candy head carrying the logo's spiral swirl,
 * glossy under a warm off-axis key and a hot rim, on true black.
 * It melts on a slow loop: a few tapered drips lengthen, one droplet
 * swells and falls, everything eases back. Gentle sway and a little
 * pointer parallax; no scroll coupling. Lives only in its own hero
 * panel, sized to the container.
 */

const GOLD = "#FCA818";
const BURNT = "#FC7818";
const HOT = "#FC2418";
const PINK = "#FC5484";
const ICE = "#C0D8E4";

/* ---------- candy face: the swirl, painted once ---------- */

function makeSwirlTexture() {
  const s = 1024;
  const c = document.createElement("canvas");
  c.width = c.height = s;
  const ctx = c.getContext("2d");
  const cx = s / 2;
  const cy = s / 2;

  // base candy: gold heart falling to hot red at the rim
  const base = ctx.createRadialGradient(
    cx - s * 0.06,
    cy - s * 0.08,
    s * 0.04,
    cx,
    cy,
    s * 0.52
  );
  base.addColorStop(0, GOLD);
  base.addColorStop(0.46, BURNT);
  base.addColorStop(1, HOT);
  ctx.fillStyle = base;
  ctx.fillRect(0, 0, s, s);

  // a spiral band, drawn as short tapering segments
  const spiral = (color, alpha, turns, r0, r1, w0, w1, offset) => {
    ctx.strokeStyle = color;
    ctx.globalAlpha = alpha;
    ctx.lineCap = "round";
    const steps = Math.floor(turns * 140);
    let px = null;
    let py = null;
    for (let i = 0; i <= steps; i++) {
      const t = i / steps;
      const a = offset + t * turns * Math.PI * 2;
      const r = r0 + (r1 - r0) * t;
      const x = cx + Math.cos(a) * r;
      const y = cy + Math.sin(a) * r;
      if (px !== null) {
        ctx.lineWidth = w0 + (w1 - w0) * t;
        ctx.beginPath();
        ctx.moveTo(px, py);
        ctx.lineTo(x, y);
        ctx.stroke();
      }
      px = x;
      py = y;
    }
    ctx.globalAlpha = 1;
  };

  // the pink swirl (the mark's signature), widening as it unwinds
  spiral(PINK, 0.9, 2.35, s * 0.015, s * 0.42, s * 0.02, s * 0.062, -0.6);
  // a slim gold echo, half a turn behind
  spiral(GOLD, 0.8, 2.05, s * 0.012, s * 0.35, s * 0.008, s * 0.024, 2.3);

  // hot rim so the wrapped edge of the disc reads deep red
  ctx.strokeStyle = HOT;
  ctx.lineWidth = s * 0.05;
  ctx.beginPath();
  ctx.arc(cx, cy, s * 0.475, 0, Math.PI * 2);
  ctx.stroke();

  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 4;
  return tex;
}

/* ---------- geometry ---------- */

// flat disc with a rounded rim; UVs planar-projected for the face art
function makeDiscGeometry(R, T) {
  const pts = [new THREE.Vector2(0.001, T)];
  const rimSegs = 14;
  for (let i = 0; i <= rimSegs; i++) {
    const a = (i / rimSegs) * Math.PI;
    pts.push(new THREE.Vector2(R - T + Math.sin(a) * T, Math.cos(a) * T));
  }
  pts.push(new THREE.Vector2(0.001, -T));
  const geo = new THREE.LatheGeometry(pts, 96);
  const pos = geo.attributes.position;
  const uv = geo.attributes.uv;
  for (let i = 0; i < pos.count; i++) {
    uv.setXY(i, pos.getX(i) / (R * 2) + 0.5, pos.getZ(i) / (R * 2) + 0.5);
  }
  geo.computeVertexNormals();
  return geo;
}

const smooth = (a, b, x) => {
  const t = Math.min(1, Math.max(0, (x - a) / (b - a)));
  return t * t * (3 - 2 * t);
};

// A viscous hanging drip, not an icicle: it attaches wide at the rim,
// necks in, swells into a heavy bead, and closes with a ROUNDED cap so
// the bottom reads as a hanging droplet of liquid, never a point. Unit
// height (~1); scale.y stretches it into a longer teardrop on the melt.
function makeDripGeometry() {
  const pts = [];
  const topR = 0.115; // flush attach to the head's rim
  const neckR = 0.062; // the pinch just below the rim
  const bellyR = 0.135; // the heavy bead near the bottom
  const bodyEnd = 0.8; // where the rounded cap begins (in -y)

  const bodyN = 30;
  for (let i = 0; i <= bodyN; i++) {
    const t = i / bodyN;
    const y = -bodyEnd * t;
    // top -> neck (settles by t~0.3), then neck -> belly (by t~0.9)
    const r =
      t < 0.32
        ? topR + (neckR - topR) * smooth(0, 0.32, t)
        : neckR + (bellyR - neckR) * smooth(0.32, 0.92, t);
    pts.push(new THREE.Vector2(Math.max(r, 0.006), y));
  }
  // rounded hemispherical cap: the droplet belly, no point
  const capN = 12;
  for (let i = 1; i <= capN; i++) {
    const a = (i / capN) * (Math.PI / 2);
    pts.push(
      new THREE.Vector2(
        Math.max(bellyR * Math.cos(a), 0.001),
        -bodyEnd - bellyR * Math.sin(a)
      )
    );
  }
  return new THREE.LatheGeometry(pts, 32);
}

/* ---------- the melt: drip layout ---------- */

// Drips clustered toward the bottom of the disc so the melt reads as
// pooling off the BASE, not the flanks. ROOT_TUCK lifts each root just
// inside the candy surface so the drip flows out of it seamlessly.
const ROOT_TUCK = 0.07;
const DRIPS = [
  { x: -0.44, color: PINK, rest: 0.34, extend: 0.42, phase: 0.05, girth: 0.92 },
  { x: -0.15, color: BURNT, rest: 0.5, extend: 0.7, phase: 0.0, girth: 1.18, droplet: true },
  { x: 0.16, color: GOLD, rest: 0.46, extend: 0.56, phase: 0.03, girth: 1.08 },
  { x: 0.45, color: HOT, rest: 0.32, extend: 0.4, phase: 0.07, girth: 0.86 },
];

// y of the base silhouette at a given x, tucked slightly up into the candy
const rootYAt = (x) => -Math.sqrt(Math.max(0, 1 - x * x)) + ROOT_TUCK;

const CYCLE = 13; // seconds per melt loop

function Lolli({ reduced }) {
  const rig = useRef();
  const head = useRef();
  const dripRefs = useRef([]);
  const dropRef = useRef();
  const pointer = useRef({ x: 0, y: 0 });
  const { gl, scene, camera } = useThree();

  useEffect(() => {
    camera.lookAt(0, 0, 0);
  }, [camera]);

  useEffect(() => {
    const onMove = (e) => {
      pointer.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      pointer.current.y = (e.clientY / window.innerHeight) * 2 - 1;
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, []);

  const env = useMemo(() => makeWarmEnv(gl), [gl]);
  useEffect(() => {
    scene.environment = env.texture;
    return () => {
      scene.environment = null;
      env.dispose();
    };
  }, [scene, env]);

  const swirl = useMemo(() => makeSwirlTexture(), []);
  const discGeo = useMemo(() => makeDiscGeometry(1, 0.16), []);
  const dripGeo = useMemo(() => makeDripGeometry(), []);
  useEffect(() => {
    return () => {
      swirl.dispose();
      discGeo.dispose();
      dripGeo.dispose();
    };
  }, [swirl, discGeo, dripGeo]);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    const tc = reduced ? 0.12 : (t % CYCLE) / CYCLE;

    // idle: a slow sway and breath, plus pointer parallax
    if (rig.current) {
      const sway = reduced ? 0 : 1;
      const ry = 0.14 * Math.sin(t * 0.22) * sway + pointer.current.x * 0.16;
      const rx = 0.05 * Math.sin(t * 0.17 + 1.4) * sway + pointer.current.y * 0.1;
      rig.current.rotation.y += (ry - rig.current.rotation.y) * 0.045;
      rig.current.rotation.x += (rx - rig.current.rotation.x) * 0.045;
      rig.current.position.y = reduced ? 0 : 0.035 * Math.sin(t * 0.5);
    }
    // the swirl turns, barely
    if (head.current && !reduced) head.current.rotation.y = t * 0.04;

    // melt envelope per drip: lengthen slowly, ease back
    DRIPS.forEach((d, i) => {
      const m = dripRefs.current[i];
      if (!m) return;
      const rise = smooth(0.24 + d.phase, 0.56 + d.phase, tc);
      const fall = 1 - smooth(0.66 + d.phase, 0.94 + d.phase, tc);
      const env01 = rise * fall;
      const len = d.rest * (1 + (d.extend / d.rest) * env01);
      m.scale.set(d.girth, len, d.girth);
    });

    // the droplet: swells at the long drip's tip, lets go, falls, fades
    const drop = dropRef.current;
    if (drop) {
      const d = DRIPS[1];
      const rootY = rootYAt(d.x);
      const rise = smooth(0.24 + d.phase, 0.56 + d.phase, tc);
      const fall = 1 - smooth(0.66 + d.phase, 0.94 + d.phase, tc);
      const len = d.rest * (1 + (d.extend / d.rest) * rise * fall);
      const tipY = rootY - len * 0.92;
      const swell = smooth(0.4, 0.64, tc);
      const released = tc > 0.66;
      if (!released) {
        drop.position.set(d.x, tipY - 0.02, 0);
        drop.scale.setScalar(Math.max(0.001, swell));
        drop.material.opacity = 0.95 * swell;
      } else {
        const ds = (tc - 0.66) * CYCLE;
        drop.position.set(d.x, tipY - 0.02 - 0.28 * ds - 0.55 * ds * ds, 0);
        drop.scale.setScalar(1);
        drop.material.opacity = 0.95 * (1 - smooth(0.8, 0.92, tc));
      }
      if (reduced) drop.material.opacity = 0;
    }
  });

  return (
    <group position={[0, 0.55, 0]}>
      <group ref={rig}>
        {/* candy head: flat disc, swirl face, glossy physical shell */}
        <mesh ref={head} geometry={discGeo} rotation={[Math.PI / 2, 0, 0]}>
          <meshPhysicalMaterial
            map={swirl}
            roughness={0.16}
            metalness={0}
            clearcoat={1}
            clearcoatRoughness={0.12}
            transmission={0.08}
            thickness={0.5}
            ior={1.45}
            envMapIntensity={1.1}
            transparent
          />
        </mesh>

        {/* stick: the one ice-blue note */}
        <mesh position={[0, -1.55, 0]}>
          <capsuleGeometry args={[0.052, 1.9, 6, 14]} />
          <meshStandardMaterial color={ICE} roughness={0.4} metalness={0} envMapIntensity={0.5} />
        </mesh>

        {/* drips off the lower rim */}
        {DRIPS.map((d, i) => (
          <mesh
            key={d.x}
            ref={(el) => (dripRefs.current[i] = el)}
            geometry={dripGeo}
            position={[d.x, rootYAt(d.x), 0.02]}
          >
            <meshPhysicalMaterial
              color={d.color}
              roughness={0.2}
              clearcoat={1}
              clearcoatRoughness={0.18}
              envMapIntensity={0.9}
            />
          </mesh>
        ))}

        {/* the falling droplet */}
        <mesh ref={dropRef} scale={0.001}>
          <sphereGeometry args={[0.075, 20, 16]} />
          <meshPhysicalMaterial
            color={BURNT}
            roughness={0.15}
            clearcoat={1}
            clearcoatRoughness={0.15}
            envMapIntensity={1}
            transparent
            opacity={0}
          />
        </mesh>
      </group>

      {/* one warm off-axis key, a soft fill, and the hot rim */}
      <ambientLight intensity={0.16} />
      <directionalLight position={[2.6, 2.4, 3.2]} intensity={2.1} color="#fca818" />
      <directionalLight position={[-1.8, 0.4, 2.8]} intensity={0.35} color="#f3ede6" />
      <directionalLight position={[-2.6, 1.2, -2.4]} intensity={1.6} color="#fc2418" />
    </group>
  );
}

export default function LollipopScene() {
  const rootRef = useRef(null);
  const [inView, setInView] = useState(true);
  const [reduced, setReduced] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setReduced(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
    const io = new IntersectionObserver(([e]) => setInView(e.isIntersecting), {
      rootMargin: "80px",
    });
    if (rootRef.current) io.observe(rootRef.current);
    return () => io.disconnect();
  }, []);

  return (
    <div
      ref={rootRef}
      aria-hidden
      style={{
        position: "absolute",
        inset: 0,
        opacity: ready ? 1 : 0,
        transition: "opacity 1.8s ease 0.5s",
      }}
    >
      <Canvas
        dpr={[1, 1.75]}
        frameloop={inView ? "always" : "never"}
        gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
        camera={{ position: [0, 0.15, 7], fov: 38, near: 0.1, far: 30 }}
        onCreated={() => setReady(true)}
        style={{ background: "transparent" }}
      >
        <Lolli reduced={reduced} />
      </Canvas>
    </div>
  );
}
