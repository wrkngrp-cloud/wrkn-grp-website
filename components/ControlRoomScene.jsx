"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { makeWarmEnv } from "./warmEnv";

/*
 * The control room at 4am: the Studio page's one cinematic scene,
 * in its own full-width band. A console fading into darkness: fader
 * lanes catching a warm key, two or three faders riding automation
 * on their own, a meter bridge dancing to an unheard playback, and a
 * monitor above it carrying a live waveform. Wordless, ember on
 * black. Pauses offscreen; near-freezes under reduced motion.
 */

const LED_COLORS = ["#8C380E", "#A8460E", "#FC7818", "#FCA818", "#FCA818", "#FC2418"];
const STRIPS = 14;
const SPACING = 0.86;
const AUTOMATED = [2, 5, 9, 12];

function makeMonitorCanvas() {
  const c = document.createElement("canvas");
  c.width = 512;
  c.height = 192;
  const ctx = c.getContext("2d");
  ctx.fillStyle = "#000";
  ctx.fillRect(0, 0, c.width, c.height);
  return { c, ctx };
}

function drawMonitor(ctx, w, h, t) {
  // trail fade
  ctx.fillStyle = "rgba(0, 0, 0, 0.2)";
  ctx.fillRect(0, 0, w, h);

  // faint session grid
  ctx.strokeStyle = "rgba(201, 126, 91, 0.06)";
  ctx.lineWidth = 1;
  ctx.beginPath();
  for (let x = 0; x <= w; x += 64) {
    ctx.moveTo(x + 0.5, 0);
    ctx.lineTo(x + 0.5, h);
  }
  ctx.moveTo(0, h / 2 + 0.5);
  ctx.lineTo(w, h / 2 + 0.5);
  ctx.stroke();

  // the waveform, scrolling like playback
  const grad = ctx.createLinearGradient(0, 0, w, 0);
  grad.addColorStop(0, "rgba(84, 28, 0, 0.9)");
  grad.addColorStop(0.45, "rgba(252, 120, 24, 0.95)");
  grad.addColorStop(0.75, "rgba(252, 168, 24, 1)");
  grad.addColorStop(1, "rgba(168, 70, 14, 0.9)");
  ctx.strokeStyle = grad;
  ctx.lineWidth = 1.6;
  ctx.beginPath();
  const mid = h / 2;
  for (let x = 0; x <= w; x += 3) {
    const u = x / w;
    const px = u * 9 + t * 0.7;
    const env =
      0.35 +
      0.65 *
        Math.pow(
          Math.abs(Math.sin(px * 0.7 + 0.4) * 0.6 + Math.sin(px * 0.23) * 0.4),
          1.5
        );
    const y =
      mid +
      env *
        (h * 0.36) *
        (Math.sin(px * 4.2) * 0.5 + Math.sin(px * 9.1 + 2) * 0.32 + Math.sin(px * 17.3) * 0.18);
    if (x === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  }
  ctx.stroke();

  // playhead
  const phx = ((t * 0.055) % 1) * w;
  const pg = ctx.createLinearGradient(phx - 14, 0, phx, 0);
  pg.addColorStop(0, "rgba(252, 168, 24, 0)");
  pg.addColorStop(1, "rgba(252, 168, 24, 0.28)");
  ctx.fillStyle = pg;
  ctx.fillRect(phx - 14, 0, 14, h);
  ctx.fillStyle = "rgba(252, 168, 24, 0.9)";
  ctx.fillRect(phx, 0, 1.5, h);
}

function Room({ reduced }) {
  const rig = useRef();
  const pointer = useRef({ x: 0, y: 0 });
  const ledRefs = useRef([]);
  const capRefs = useRef([]);
  const recRef = useRef();
  const texRef = useRef();
  const { gl, scene, camera } = useThree();

  useEffect(() => {
    camera.lookAt(0, 0.35, -1.2);
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
    scene.fog = new THREE.Fog(0x000000, 5.5, 13.5);
    return () => {
      scene.environment = null;
      scene.fog = null;
      env.dispose();
    };
  }, [scene, env]);

  const monitor = useMemo(() => {
    const { c, ctx } = makeMonitorCanvas();
    const tex = new THREE.CanvasTexture(c);
    tex.colorSpace = THREE.SRGBColorSpace;
    return { ctx, tex, w: c.width, h: c.height };
  }, []);
  useEffect(() => {
    texRef.current = monitor;
    return () => monitor.tex.dispose();
  }, [monitor]);

  // deterministic per-strip character
  const strips = useMemo(() => {
    const out = [];
    for (let i = 0; i < STRIPS; i++) {
      const x = (i - (STRIPS - 1) / 2) * SPACING;
      const seed = Math.sin(i * 127.1) * 43758.5453;
      const r = seed - Math.floor(seed);
      out.push({
        x,
        capRest: 0.45 + r * 0.9,
        phase: r * Math.PI * 2,
        sens: 0.55 + 0.45 * Math.abs(Math.sin(i * 2.3)),
        auto: AUTOMATED.includes(i),
      });
    }
    return out;
  }, []);

  useFrame((state) => {
    const t = reduced ? 7.3 : state.clock.elapsedTime;

    // parallax + slow drift, very quiet
    if (rig.current) {
      const ry = pointer.current.x * 0.035 + (reduced ? 0 : 0.018 * Math.sin(t * 0.1));
      const rx = pointer.current.y * 0.02;
      rig.current.rotation.y += (ry - rig.current.rotation.y) * 0.04;
      rig.current.rotation.x += (rx - rig.current.rotation.x) * 0.04;
    }

    // meters: an unheard playback, per-beat decay with per-strip feel
    strips.forEach((s, i) => {
      const b = (t * 1.55 + s.phase) % 1;
      const kick = Math.exp(-4.2 * b);
      const level = Math.min(
        1,
        Math.max(0, 0.18 + 0.72 * kick * s.sens + 0.12 * Math.sin(t * 1.3 + i * 1.7))
      );
      const lit = level * 6;
      for (let j = 0; j < 6; j++) {
        const m = ledRefs.current[i * 6 + j];
        if (!m) continue;
        const on = Math.min(1, Math.max(0, lit - j));
        m.material.opacity = 0.05 + 0.9 * on;
      }
      // automation: a few faders ride on their own
      const cap = capRefs.current[i];
      if (cap) {
        cap.position.z = s.auto
          ? 0.95 + 0.52 * Math.sin(t * 0.16 + s.phase)
          : 0.35 + s.capRest * 0.75;
      }
    });

    // record light breathing
    if (recRef.current) {
      recRef.current.material.opacity =
        0.15 + 0.8 * Math.pow(0.5 + 0.5 * Math.sin(t * 2.2), 3);
    }

    // the monitor is alive
    const m = texRef.current;
    if (m) {
      drawMonitor(m.ctx, m.w, m.h, t);
      m.tex.needsUpdate = true;
    }
  });

  return (
    <group ref={rig}>
      {/* the desk, catching the warm key */}
      <mesh rotation={[-Math.PI / 2 + 0.1, 0, 0]} position={[0, -0.62, 0.4]}>
        <planeGeometry args={[17, 5]} />
        <meshStandardMaterial color="#0a0500" metalness={0.45} roughness={0.4} envMapIntensity={0.7} />
      </mesh>

      {/* channel strips */}
      <group position={[0, -0.6, 0.4]} rotation={[0.1, 0, 0]}>
        {strips.map((s, i) => (
          <group key={s.x} position={[s.x, 0, 0]}>
            {/* fader rail */}
            <mesh position={[0, 0.015, 0.95]}>
              <boxGeometry args={[0.035, 0.012, 1.5]} />
              <meshBasicMaterial color="#2a0e00" />
            </mesh>
            {/* fader cap */}
            <mesh ref={(el) => (capRefs.current[i] = el)} position={[0, 0.05, 0.9]}>
              <boxGeometry args={[0.3, 0.07, 0.13]} />
              <meshStandardMaterial
                color="#140a04"
                metalness={0.3}
                roughness={0.35}
                emissive={s.auto ? "#fc7818" : "#541c00"}
                emissiveIntensity={s.auto ? 0.55 : 0.28}
                envMapIntensity={0.8}
              />
            </mesh>
            {/* two knobs above the rail */}
            {[-0.22, -0.52].map((z) => (
              <group key={z} position={[0, 0.035, z]}>
                <mesh>
                  <cylinderGeometry args={[0.085, 0.095, 0.07, 18]} />
                  <meshStandardMaterial color="#140a04" metalness={0.5} roughness={0.35} envMapIntensity={0.9} />
                </mesh>
                <mesh position={[0, 0.037, -0.045]}>
                  <boxGeometry args={[0.022, 0.008, 0.05]} />
                  <meshBasicMaterial color="#c97e5b" transparent opacity={0.85} />
                </mesh>
              </group>
            ))}
            {/* meter column on the bridge */}
            {LED_COLORS.map((col, j) => (
              <mesh
                key={col + j}
                ref={(el) => (ledRefs.current[i * 6 + j] = el)}
                position={[0, 0.24 + j * 0.135, -1.05]}
                rotation={[0.14, 0, 0]}
              >
                <planeGeometry args={[0.17, 0.075]} />
                <meshBasicMaterial color={col} transparent opacity={0.05} />
              </mesh>
            ))}
          </group>
        ))}
      </group>

      {/* the monitor, floating in the dark above the bridge */}
      <group position={[0, 1.78, -2.7]}>
        <mesh>
          <planeGeometry args={[4.8, 1.8]} />
          <meshBasicMaterial
            map={monitor.tex}
            transparent
            blending={THREE.AdditiveBlending}
            depthWrite={false}
            toneMapped={false}
          />
        </mesh>
        <lineSegments>
          <edgesGeometry args={[new THREE.PlaneGeometry(4.96, 1.96)]} />
          <lineBasicMaterial color="#541c00" transparent opacity={0.9} />
        </lineSegments>
        {/* the red light is on */}
        <mesh ref={recRef} position={[2.62, 0.86, 0]}>
          <circleGeometry args={[0.042, 20]} />
          <meshBasicMaterial color="#fc2418" transparent opacity={0.2} toneMapped={false} />
        </mesh>
      </group>

      {/* one warm key from high left, nothing else */}
      <ambientLight intensity={0.14} />
      <directionalLight position={[3.5, 4.5, 2.5]} intensity={1.3} color="#fca818" />
      <directionalLight position={[-2.5, 1.5, 3.5]} intensity={0.25} color="#c97e5b" />
    </group>
  );
}

export default function ControlRoomScene() {
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
        transition: "opacity 2s ease 0.3s",
      }}
    >
      <Canvas
        dpr={[1, 1.75]}
        frameloop={inView ? "always" : "never"}
        gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
        camera={{ position: [0, 1.5, 6.4], fov: 34, near: 0.1, far: 30 }}
        onCreated={() => setReady(true)}
        style={{ background: "transparent" }}
      >
        <Room reduced={reduced} />
      </Canvas>
    </div>
  );
}
