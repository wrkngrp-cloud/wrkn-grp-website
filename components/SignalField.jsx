"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

/*
 * The Signal: the site's one 3D moment. A stack of waveform lines
 * receding into darkness, graded gold (near) through ember to amber
 * shadow (far), breathing slowly like a take being played back in a
 * dark control room. It always sits in its own space, never behind
 * running text.
 *
 * Tunable per placement:
 * - lines / points: density
 * - amp: overall wave height
 * - speed: playback tempo (0 freezes for reduced motion)
 * - pinkLine: index of a single line carried in the rare pink accent
 *   (the Releases variant, a note inside the melt gradient)
 */

const GRADE = [
  new THREE.Color("#FCA818"), // gold, nearest
  new THREE.Color("#FC7818"), // burnt orange
  new THREE.Color("#A8460E"), // ember
  new THREE.Color("#541C00"), // amber deep
  new THREE.Color("#2A0E00"), // amber shadow, farthest
];

function gradeAt(t) {
  const x = t * (GRADE.length - 1);
  const i = Math.min(GRADE.length - 2, Math.floor(x));
  return GRADE[i].clone().lerp(GRADE[i + 1], x - i);
}

const PINK = new THREE.Color("#FC5484");

function Waves({ lines, points, amp, speed, pinkLine, drift }) {
  const group = useRef();
  const pointer = useRef({ x: 0, y: 0 });
  const { camera } = useThree();

  useEffect(() => {
    camera.lookAt(0, 0.35, -5);
  }, [camera]);

  useEffect(() => {
    const onMove = (e) => {
      pointer.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      pointer.current.y = (e.clientY / window.innerHeight) * 2 - 1;
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, []);

  const built = useMemo(() => {
    const out = [];
    for (let i = 0; i < lines; i++) {
      const t = i / Math.max(1, lines - 1);
      const geo = new THREE.BufferGeometry();
      const pos = new Float32Array(points * 3);
      const col = new Float32Array(points * 3);
      const z = -t * 11.5;
      const base = pinkLine === i ? PINK.clone() : gradeAt(t);
      // fade edges of each line into the black
      for (let p = 0; p < points; p++) {
        const u = p / (points - 1);
        const x = (u - 0.5) * (16 + t * 14);
        pos[p * 3] = x;
        pos[p * 3 + 1] = 0;
        pos[p * 3 + 2] = z;
        const edge = Math.pow(Math.sin(u * Math.PI), 0.85);
        const near = 1 - t * 0.55;
        col[p * 3] = base.r * edge * near;
        col[p * 3 + 1] = base.g * edge * near;
        col[p * 3 + 2] = base.b * edge * near;
      }
      geo.setAttribute("position", new THREE.BufferAttribute(pos, 3));
      geo.setAttribute("color", new THREE.BufferAttribute(col, 3));
      const mat = new THREE.LineBasicMaterial({
        vertexColors: true,
        transparent: true,
        opacity: 0.85,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      });
      out.push({
        line: new THREE.Line(geo, mat),
        phase: i * 0.42,
        t,
      });
    }
    return out;
  }, [lines, points, pinkLine]);

  useEffect(() => {
    return () => {
      built.forEach(({ line }) => {
        line.geometry.dispose();
        line.material.dispose();
      });
    };
  }, [built]);

  useFrame((state) => {
    const time = state.clock.elapsedTime * speed;
    // slow breath, like a room with a pulse
    const breath = 0.82 + 0.18 * Math.sin(time * 0.45);

    built.forEach(({ line, phase, t }) => {
      const posAttr = line.geometry.getAttribute("position");
      const arr = posAttr.array;
      const n = arr.length / 3;
      const lineAmp = amp * breath * (0.55 + 0.45 * Math.sin(t * Math.PI));
      for (let p = 0; p < n; p++) {
        const x = arr[p * 3];
        const u = p / (n - 1);
        const env = Math.pow(Math.sin(u * Math.PI), 1.4);
        arr[p * 3 + 1] =
          lineAmp *
          env *
          (Math.sin(x * 0.42 + time * 0.9 + phase) * 0.62 +
            Math.sin(x * 0.93 - time * 0.62 + phase * 1.7) * 0.27 +
            Math.sin(x * 1.71 + time * 1.35 + phase * 0.6) * 0.11);
      }
      posAttr.needsUpdate = true;
    });

    if (group.current && drift) {
      const target = group.current.rotation;
      target.y += (pointer.current.x * 0.05 - target.y) * 0.04;
      target.x += (pointer.current.y * 0.03 - target.x) * 0.04;
    }
  });

  return (
    <group ref={group}>
      {built.map((b, i) => (
        <primitive key={i} object={b.line} />
      ))}
    </group>
  );
}

export default function SignalField({
  lines = 36,
  points = 150,
  amp = 1.15,
  speed = 1,
  pinkLine = -1,
  camY = 2.1,
  camZ = 7.5,
}) {
  const rootRef = useRef(null);
  const [inView, setInView] = useState(true);
  const [reduced, setReduced] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setReduced(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
    const io = new IntersectionObserver(
      ([e]) => setInView(e.isIntersecting),
      { rootMargin: "80px" }
    );
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
        transition: "opacity 1.6s ease 0.25s",
      }}
    >
      <Canvas
        dpr={[1, 1.75]}
        frameloop={inView ? "always" : "never"}
        gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
        camera={{ position: [0, camY, camZ], fov: 40, near: 0.1, far: 40 }}
        onCreated={({ scene }) => {
          scene.fog = new THREE.Fog(0x000000, 6.5, 19);
          setReady(true);
        }}
        style={{ background: "transparent" }}
      >
        <Waves
          lines={lines}
          points={points}
          amp={amp}
          speed={reduced ? 0.04 : speed}
          pinkLine={pinkLine}
          drift={!reduced}
        />
      </Canvas>
    </div>
  );
}
