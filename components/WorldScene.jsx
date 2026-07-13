"use client";

import { useEffect, useMemo, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { MarchingCubes } from "three/examples/jsm/objects/MarchingCubes.js";
import { createSwirlTexture, createBlindsTexture } from "../lib/lollipopTexture";

/*
 * The world the whole site lives in.
 *
 * LOLLIPOP: the flat-disc logo replica with its continuous liquid melt
 * (marching-cubes metaballs). It travels between scene positions as
 * sections scroll past, and scroll turns it on its axis. Smaller now:
 * an inhabitant of the scene, not the scene itself.
 *
 * SCENERY, per section weights, all graded to the palette:
 * - desk + speakers: an abstract control room. A mixing console rises
 *   into the bottom of the frame with glowing faders, studio monitors
 *   flank the lollipop and their cones pulse on a slow kick.
 * - vinyl: a record spinning in the dark for the story sections.
 * - doors: three tall doorframes of light for the three-doors moments.
 * - spots: stage light cones sweeping slowly for the live sections.
 * - blinds, glow, dust, rings, eq: light slats, ember glow, drifting
 *   motes, breathing sound rings, circular spectrum.
 */

const HEAD_R = 1.35;
const HEAD_Y = 0.9;

// The lollipop is a resident of the scene, not the scene. This global
// multiplier shrinks it on top of every preset's own scale so the
// rooms around it read as the main event.
const LOLLI_SCALE = 0.6;

const STREAMS = [
  { x: -1.02, w: 0.8, len: 1.5, rest: 0.42, T: 7.3, color: 0xfc5484 },
  { x: -0.68, w: 1.0, len: 2.2, rest: 0.34, T: 5.9, color: 0xfc7818 },
  { x: -0.34, w: 0.85, len: 1.7, rest: 0.5, T: 8.7, color: 0xfca818 },
  { x: 0.0, w: 1.1, len: 2.5, rest: 0.38, T: 6.6, color: 0xfc2418 },
  { x: 0.34, w: 0.9, len: 1.9, rest: 0.46, T: 7.9, color: 0xfca818 },
  { x: 0.68, w: 1.0, len: 2.3, rest: 0.36, T: 6.1, color: 0xfc7818 },
  { x: 1.02, w: 0.8, len: 1.4, rest: 0.44, T: 9.1, color: 0xb6460e },
];

const rimY = (x) =>
  HEAD_Y - Math.sqrt(Math.max(0.05, HEAD_R * HEAD_R - x * x)) * 0.96;

const EQ_BARS = 26;
const DUST_COUNT = 240;

function useWarmEnvironment() {
  const gl = useThree((s) => s.gl);
  const scene = useThree((s) => s.scene);

  useEffect(() => {
    const env = new THREE.Scene();
    env.background = new THREE.Color(0x000000);

    const panel = (color, intensity, w, h, pos, rotY) => {
      const mat = new THREE.MeshBasicMaterial({ color });
      mat.color.multiplyScalar(intensity);
      const mesh = new THREE.Mesh(new THREE.PlaneGeometry(w, h), mat);
      mesh.position.set(...pos);
      mesh.rotation.y = rotY;
      env.add(mesh);
    };

    for (let i = 0; i < 5; i++) {
      panel(0xffb060, 5.5, 6, 0.5, [4, 2.4 - i * 0.9, 3], -Math.PI / 3);
    }
    panel(0x8c380e, 1.6, 5, 4, [-5, 0, 1], Math.PI / 2.6);
    panel(0xfc2418, 0.9, 4, 3, [-2, 1, -5], 0.2);

    const pmrem = new THREE.PMREMGenerator(gl);
    const envTex = pmrem.fromScene(env, 0.05).texture;
    scene.environment = envTex;

    return () => {
      scene.environment = null;
      envTex.dispose();
      pmrem.dispose();
    };
  }, [gl, scene]);
}

function makeGlowTexture() {
  const size = 256;
  const canvas = document.createElement("canvas");
  canvas.width = canvas.height = size;
  const ctx = canvas.getContext("2d");
  const g = ctx.createRadialGradient(128, 128, 0, 128, 128, 128);
  g.addColorStop(0, "rgba(252,168,24,0.55)");
  g.addColorStop(0.35, "rgba(168,70,14,0.28)");
  g.addColorStop(1, "rgba(42,14,0,0)");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, size, size);
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

function makeVinylTexture() {
  const size = 512;
  const canvas = document.createElement("canvas");
  canvas.width = canvas.height = size;
  const ctx = canvas.getContext("2d");
  const cx = size / 2;
  ctx.fillStyle = "#0a0500";
  ctx.beginPath();
  ctx.arc(cx, cx, cx, 0, Math.PI * 2);
  ctx.fill();
  // grooves
  for (let r = 60; r < 250; r += 4) {
    ctx.strokeStyle = `rgba(201,126,91,${0.05 + (r % 24 === 0 ? 0.1 : 0)})`;
    ctx.lineWidth = 1.1;
    ctx.beginPath();
    ctx.arc(cx, cx, r, 0, Math.PI * 2);
    ctx.stroke();
  }
  // label
  ctx.fillStyle = "#8c380e";
  ctx.beginPath();
  ctx.arc(cx, cx, 52, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "#fca818";
  ctx.beginPath();
  ctx.arc(cx, cx, 6, 0, Math.PI * 2);
  ctx.fill();
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

// Console fader/knob layout, memo-stable
const DESK_KNOBS = (() => {
  const out = [];
  const cols = 14;
  for (let r = 0; r < 2; r++) {
    for (let i = 0; i < cols; i++) {
      out.push({
        x: -3.1 + i * (6.2 / (cols - 1)),
        z: 0.25 - r * 0.55,
        c: [0xfca818, 0xc97e5b, 0xa8460e, 0xfc7818][(i + r) % 4],
      });
    }
  }
  return out;
})();

export default function WorldScene({ sceneRef }) {
  const lolli = useRef(null);
  const headRef = useRef(null);
  const glowRef = useRef(null);
  const ringRefs = useRef([]);
  const eqGroup = useRef(null);
  const eqRefs = useRef([]);
  const dustRef = useRef(null);
  const blindsGroup = useRef(null);
  const deskGroup = useRef(null);
  const deskKnobRefs = useRef([]);
  const speakerRefs = useRef([]);
  const vinylGroup = useRef(null);
  const doorsGroup = useRef(null);
  const spotRefs = useRef([]);
  const pointer = useRef({ x: 0, y: 0 });
  const size = useThree((s) => s.size);

  // Eased scene state; snapped to the page's first scene on mount so
  // inner pages don't fade out of the hero's control room.
  const cur = useRef({
    x: 1.5, y: -0.05, s: 0.82,
    blinds: 1, rings: 0.15, eq: 0, glow: 1,
    desk: 0, speakers: 0, vinyl: 0, doors: 0, spots: 0,
  });
  const snapped = useRef(false);

  useWarmEnvironment();

  const swirlTex = useMemo(() => createSwirlTexture(), []);
  const blindsTex = useMemo(() => createBlindsTexture(), []);
  const glowTex = useMemo(() => makeGlowTexture(), []);
  const vinylTex = useMemo(() => makeVinylTexture(), []);

  const candyMat = useMemo(
    () =>
      new THREE.MeshPhysicalMaterial({
        map: swirlTex,
        transmission: 0.45,
        thickness: 0.9,
        roughness: 0.16,
        clearcoat: 1.0,
        clearcoatRoughness: 0.1,
        ior: 1.45,
        attenuationColor: new THREE.Color(0x8c380e),
        attenuationDistance: 2.2,
        envMapIntensity: 1.3,
        emissiveMap: swirlTex,
        emissive: new THREE.Color(0x6f6f6f),
        emissiveIntensity: 0.34,
      }),
    [swirlTex]
  );

  const gooMat = useMemo(
    () =>
      new THREE.MeshPhysicalMaterial({
        vertexColors: true,
        roughness: 0.1,
        clearcoat: 1.0,
        clearcoatRoughness: 0.12,
        envMapIntensity: 1.5,
        emissive: new THREE.Color(0x1c0800),
        emissiveIntensity: 0.9,
      }),
    []
  );

  const goo = useMemo(() => {
    const resolution = size.width < 640 ? 54 : 80;
    const mc = new MarchingCubes(resolution, gooMat, false, true, 80000);
    mc.position.set(0, -0.9, 0);
    mc.scale.set(2.1, 2.6, 0.55);
    return mc;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gooMat]);

  const streamColors = useMemo(
    () => STREAMS.map((s) => new THREE.Color(s.color)),
    []
  );

  const stickMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: 0xc0d8e4,
        roughness: 0.35,
        metalness: 0.05,
        envMapIntensity: 0.6,
      }),
    []
  );

  // Dust motes: warm specks drifting through the dark
  const dust = useMemo(() => {
    const positions = new Float32Array(DUST_COUNT * 3);
    const colors = new Float32Array(DUST_COUNT * 3);
    const palette = [
      new THREE.Color(0xfca818),
      new THREE.Color(0xa8460e),
      new THREE.Color(0x8c380e),
      new THREE.Color(0xc97e5b),
    ];
    for (let i = 0; i < DUST_COUNT; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 14;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 9;
      positions[i * 3 + 2] = -1 - Math.random() * 5;
      const c = palette[(Math.random() * palette.length) | 0];
      colors[i * 3] = c.r;
      colors[i * 3 + 1] = c.g;
      colors[i * 3 + 2] = c.b;
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geo.setAttribute("color", new THREE.BufferAttribute(colors, 3));
    return geo;
  }, []);

  const ringGeos = useMemo(
    () =>
      [1.35, 2.1, 2.85, 3.6].map(
        (r) => new THREE.TorusGeometry(r, 0.03, 8, 140)
      ),
    []
  );

  const eqGeo = useMemo(() => new THREE.BoxGeometry(0.05, 1, 0.05), []);
  const eqMats = useMemo(() => {
    const cols = [0xfca818, 0xfc7818, 0xa8460e, 0xc97e5b];
    return Array.from({ length: EQ_BARS }, (_, i) => {
      const m = new THREE.MeshBasicMaterial({
        color: cols[i % cols.length],
        transparent: true,
        opacity: 0,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      });
      return m;
    });
  }, []);

  const ringMats = useMemo(
    () =>
      [0xfca818, 0xfc7818, 0xa8460e, 0xc97e5b].map(
        (c) =>
          new THREE.MeshBasicMaterial({
            color: c,
            transparent: true,
            opacity: 0,
            blending: THREE.AdditiveBlending,
            depthWrite: false,
          })
      ),
    []
  );

  useEffect(() => {
    const onMove = (e) => {
      pointer.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      pointer.current.y = (e.clientY / window.innerHeight) * 2 - 1;
    };
    window.addEventListener("mousemove", onMove, { passive: true });
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  const toField = (wx, wy) => [
    (wx - goo.position.x) / (2 * goo.scale.x) + 0.5,
    (wy - goo.position.y) / (2 * goo.scale.y) + 0.5,
  ];

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    const target = sceneRef.current.target;
    const scrollY = sceneRef.current.scrollY;
    const narrow = state.size.width < 640;
    // Horizontal spread: scenery world-x compresses so the control room,
    // doors and vinyl stay inside the frame on phones and small laptops.
    const spread = narrow ? 0.42 : state.size.width < 1100 ? 0.72 : 1;
    const c = cur.current;

    if (!snapped.current) {
      snapped.current = true;
      Object.assign(c, {
        x: target.x * (narrow ? 0.3 : 1),
        y: target.y,
        s: target.s * (narrow ? 0.85 : 1),
        blinds: target.blinds || 0,
        rings: target.rings || 0,
        eq: target.eq || 0,
        glow: target.glow || 0,
        desk: target.desk || 0,
        speakers: target.speakers || 0,
        vinyl: target.vinyl || 0,
        doors: target.doors || 0,
        spots: target.spots || 0,
      });
    }

    // Ease the world toward the active section's scene
    const k = 0.05;
    const tx = target.x * (narrow ? 0.3 : 1);
    const ts = target.s * (narrow ? 0.85 : 1);
    c.x += (tx - c.x) * k;
    c.y += (target.y - c.y) * k;
    c.s += (ts - c.s) * k;
    c.blinds += (target.blinds - c.blinds) * k;
    c.rings += (target.rings - c.rings) * k;
    c.eq += (target.eq - c.eq) * k;
    c.glow += (target.glow - c.glow) * k;
    c.desk += ((target.desk || 0) - c.desk) * k;
    c.speakers += ((target.speakers || 0) - c.speakers) * k;
    c.vinyl += ((target.vinyl || 0) - c.vinyl) * k;
    c.doors += ((target.doors || 0) - c.doors) * k;
    c.spots += ((target.spots || 0) - c.spots) * k;

    // ---- lollipop ----
    if (lolli.current) {
      lolli.current.position.set(c.x, c.y - 0.1, 0);
      lolli.current.scale.setScalar(c.s * LOLLI_SCALE);
      // Scroll turns it, continuously, across the whole site
      lolli.current.rotation.y = scrollY * 0.0021 + Math.sin(t * 0.3) * 0.05;
      lolli.current.rotation.x =
        -0.04 + pointer.current.y * 0.05 + Math.sin(t * 0.4) * 0.015;
      lolli.current.rotation.z = pointer.current.x * 0.03;
    }

    if (headRef.current) {
      const sag = Math.sin(t * 0.5) * 0.01;
      headRef.current.scale.set(HEAD_R, HEAD_R * 0.34, HEAD_R * (1 + sag));
      headRef.current.position.y = HEAD_Y;
    }

    // ---- the liquid, always melting on its own clock ----
    const mc = goo;
    mc.reset();
    const sub = 12;

    STREAMS.forEach((st, i) => {
      const col = streamColors[i];
      const top = rimY(st.x) + 0.32;

      const [px, py] = toField(st.x * 0.92, top);
      mc.addBall(px, py, 0.5, 0.075 * st.w, sub, col);

      const breathe =
        st.rest +
        (1 - st.rest) *
          (0.5 + 0.5 * Math.sin(t * (0.14 + i * 0.013) + i * 2.1));
      const ooze = 1 + Math.sin(t * 0.6 + i * 1.9) * 0.05;
      const reach = st.len * (0.55 + 0.45 * breathe) * ooze;
      const steps = Math.max(3, Math.ceil(reach / 0.16));
      for (let q = 1; q <= steps; q++) {
        const f = q / steps;
        const profile = 0.042 - 0.02 * Math.sin(f * Math.PI) + 0.03 * f * f;
        const wobble = Math.sin(t * 0.9 + i * 2.3 + f * 5) * 0.02;
        const [bx, by] = toField(st.x + wobble, top - 0.14 - reach * f);
        mc.addBall(bx, by, 0.5, profile * st.w, sub, col);
      }

      const cycle = (t / st.T + i * 0.37) % 1;
      const frontY = top - 0.14 - reach;
      if (cycle < 0.55) {
        const grow = cycle / 0.55;
        const [dx, dy] = toField(st.x, frontY - 0.07 * grow);
        mc.addBall(dx, dy, 0.5, (0.03 + 0.045 * grow) * st.w, sub, col);
      } else {
        const fall = (cycle - 0.55) / 0.45;
        const dyWorld = frontY - 0.12 - fall * fall * 3.4;
        const stretch = 0.1 + fall * 0.22;
        const [dx, dy] = toField(st.x, dyWorld);
        const [dx2, dy2] = toField(st.x, dyWorld + stretch);
        const sz = (0.05 - 0.02 * fall) * st.w;
        if (dy > 0.02) {
          mc.addBall(dx, dy, 0.5, sz, sub, col);
          mc.addBall(dx2, dy2, 0.5, sz * 0.7, sub, col);
        }
        for (let q = 1; q <= 3; q++) {
          const f = q / 4;
          const [tx2, ty2] = toField(st.x, frontY - (frontY - dyWorld) * f);
          if (ty2 > 0.02) {
            mc.addBall(tx2, ty2, 0.5, 0.014 * st.w * (1 - fall * 0.7), sub, col);
          }
        }
        const [rx, ry] = toField(st.x, frontY - 0.05);
        mc.addBall(rx, ry, 0.5, 0.025 * st.w * (1 - fall * 0.4), sub, col);
      }
    });

    mc.update();

    // ---- scenery ----
    if (glowRef.current) {
      glowRef.current.position.set(c.x, c.y + 0.1, -2.2);
      glowRef.current.scale.setScalar(8.5 * (0.7 + c.s * 0.5));
      glowRef.current.material.opacity = 1.1 * c.glow;
    }

    ringRefs.current.forEach((m, i) => {
      if (!m) return;
      m.position.set(c.x, c.y + 0.15, -1.4 - i * 0.35);
      const pulse = 1.35 + 0.2 * Math.sin(t * 1.6 - i * 1.1);
      m.scale.setScalar(pulse);
      m.material.opacity = c.rings * (0.85 - i * 0.18);
    });

    if (eqGroup.current) {
      eqGroup.current.position.set(c.x, c.y + 0.1, -1.2);
      eqGroup.current.rotation.z = t * 0.06;
      eqGroup.current.scale.setScalar(1.15);
    }
    eqRefs.current.forEach((m, i) => {
      if (!m) return;
      const a = (i / EQ_BARS) * Math.PI * 2;
      const level =
        0.25 +
        Math.abs(Math.sin(t * 2.4 + i * 0.73)) * 0.7 +
        Math.abs(Math.sin(t * 1.1 + i * 1.9)) * 0.3;
      const r = 2.35;
      m.position.set(Math.cos(a) * r, Math.sin(a) * r, 0);
      m.rotation.z = a + Math.PI / 2;
      m.scale.set(2.2, 0.35 + level * 1.05, 2.2);
      m.material.opacity = c.eq * 0.95;
    });

    if (dustRef.current) {
      dustRef.current.rotation.y = t * 0.014;
      dustRef.current.position.y = Math.sin(t * 0.1) * 0.3;
      dustRef.current.material.opacity = 0.7 + c.glow * 0.3;
    }

    if (blindsGroup.current) {
      blindsGroup.current.children.forEach((m, i) => {
        m.material.opacity = c.blinds * (0.34 - i * 0.03);
      });
      blindsGroup.current.position.x = c.x * 0.4;
    }

    // Console: rises into frame when its scene is on
    if (deskGroup.current) {
      deskGroup.current.position.y = -3.9 + c.desk * 1.65;
      deskGroup.current.scale.x = spread;
      deskGroup.current.visible = c.desk > 0.02;
    }
    deskKnobRefs.current.forEach((m, i) => {
      if (!m) return;
      const flicker = 0.55 + 0.45 * Math.abs(Math.sin(t * 2.1 + i * 1.37));
      m.material.opacity = c.desk * flicker;
    });

    // Monitors slide in from the sides, cones pulsing on a slow kick
    const kick = Math.pow(Math.max(0, Math.sin(t * 4.4)), 6);
    speakerRefs.current.forEach((sp, i) => {
      if (!sp) return;
      const side = i === 0 ? -1 : 1;
      sp.position.x = side * (3.35 * spread + (1 - c.speakers) * 2.2);
      sp.visible = c.speakers > 0.02;
      const cone = sp.children[1];
      if (cone) cone.scale.setScalar(1 + 0.14 * kick);
      sp.children.forEach((m2) => {
        if (m2.material && m2.material.transparent) {
          m2.material.opacity = c.speakers * (m2.userData.op ?? 0.6);
        }
      });
    });

    // Vinyl spins opposite the lollipop
    if (vinylGroup.current) {
      vinylGroup.current.position.set(
        -Math.sign(c.x || 1) * 2.1 * spread,
        0.35,
        -2.1
      );
      vinylGroup.current.rotation.z = -t * 1.1;
      vinylGroup.current.visible = c.vinyl > 0.02;
      vinylGroup.current.children.forEach((m2) => {
        if (m2.material) m2.material.opacity = c.vinyl;
      });
    }

    // Three doorframes of light, opposite side, receding
    if (doorsGroup.current) {
      doorsGroup.current.position.x = -Math.sign(c.x || 1) * 2.0 * spread;
      doorsGroup.current.visible = c.doors > 0.02;
      doorsGroup.current.children.forEach((frame, fi) => {
        const breathe = 0.8 + 0.2 * Math.sin(t * 0.9 + fi * 1.4);
        frame.children.forEach((m2) => {
          if (m2.material) {
            m2.material.opacity =
              c.doors * (m2.userData.spill ? 0.17 : 0.95 - fi * 0.2) * breathe;
          }
        });
      });
    }

    // Stage spotlights sway over the live moments
    spotRefs.current.forEach((cone, i) => {
      if (!cone) return;
      const side = i === 0 ? -1 : 1;
      cone.position.set(c.x + side * 1.7 * spread, 3.1, -1.9);
      cone.rotation.z = side * (0.16 + 0.1 * Math.sin(t * 0.45 + i * 2));
      cone.visible = c.spots > 0.02;
      if (cone.material) cone.material.opacity = c.spots * 0.24;
    });
  });

  return (
    <>
      <spotLight
        position={[5, 4, 4]}
        angle={0.55}
        penumbra={0.45}
        intensity={260}
        color={0xffb060}
        map={blindsTex}
        castShadow={false}
      />
      <pointLight position={[-4, 1.2, -3.5]} intensity={60} color={0xfc2418} />
      <ambientLight intensity={0.06} color={0xb6460e} />

      {/* Far scenery: warm blind slats slanting through the dark */}
      <group ref={blindsGroup}>
        {[0, 1, 2, 3, 4].map((i) => (
          <mesh
            key={i}
            position={[1.2 + i * 0.28, 2.6 - i * 1.35, -5.5]}
            rotation={[0, 0, -0.42]}
          >
            <planeGeometry args={[13, 0.5]} />
            <meshBasicMaterial
              color={0xffb060}
              transparent
              opacity={0}
              blending={THREE.AdditiveBlending}
              depthWrite={false}
            />
          </mesh>
        ))}
      </group>

      {/* Ember glow pooled behind the lollipop */}
      <sprite ref={glowRef} position={[1.5, 0, -2.2]}>
        <spriteMaterial
          map={glowTex}
          transparent
          opacity={0.85}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </sprite>

      {/* Sound rings breathing outward */}
      {ringGeos.map((g, i) => (
        <mesh
          key={i}
          ref={(el) => (ringRefs.current[i] = el)}
          geometry={g}
          material={ringMats[i]}
        />
      ))}

      {/* Circular spectrum, a room hearing a record */}
      <group ref={eqGroup}>
        {Array.from({ length: EQ_BARS }, (_, i) => (
          <mesh
            key={i}
            ref={(el) => (eqRefs.current[i] = el)}
            geometry={eqGeo}
            material={eqMats[i]}
          />
        ))}
      </group>

      {/* The console the lollipop stands at */}
      <group ref={deskGroup} position={[0, -3.9, 0]}>
        <mesh position={[0, -0.3, 1.1]}>
          <boxGeometry args={[9.5, 0.55, 1.7]} />
          <meshStandardMaterial color={0x0a0500} roughness={0.55} metalness={0.2} />
        </mesh>
        <mesh position={[0, -0.02, 1.95]}>
          <boxGeometry args={[9.5, 0.015, 0.015]} />
          <meshBasicMaterial
            color={0xfca818}
            transparent
            opacity={0.5}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
          />
        </mesh>
        {DESK_KNOBS.map((kn, i) => (
          <mesh
            key={i}
            ref={(el) => (deskKnobRefs.current[i] = el)}
            position={[kn.x, 0, 1.1 + kn.z]}
          >
            <boxGeometry args={[0.055, 0.12, 0.055]} />
            <meshBasicMaterial
              color={kn.c}
              transparent
              opacity={0}
              blending={THREE.AdditiveBlending}
              depthWrite={false}
            />
          </mesh>
        ))}
      </group>

      {/* Studio monitors flanking the scene */}
      {[0, 1].map((i) => (
        <group key={i} ref={(el) => (speakerRefs.current[i] = el)} position={[i === 0 ? -3.35 : 3.35, -1.05, -1.4]}>
          <mesh>
            <boxGeometry args={[0.95, 1.4, 0.7]} />
            <meshStandardMaterial color={0x1c0f06} roughness={0.55} />
          </mesh>
          <mesh position={[0, -0.18, 0.36]} userData={{ op: 0.95 }}>
            <torusGeometry args={[0.3, 0.02, 8, 48]} />
            <meshBasicMaterial
              color={0xa8460e}
              transparent
              opacity={0}
              blending={THREE.AdditiveBlending}
              depthWrite={false}
            />
          </mesh>
          <mesh position={[0, 0.42, 0.36]} userData={{ op: 0.8 }}>
            <torusGeometry args={[0.11, 0.015, 8, 32]} />
            <meshBasicMaterial
              color={0xfca818}
              transparent
              opacity={0}
              blending={THREE.AdditiveBlending}
              depthWrite={false}
            />
          </mesh>
        </group>
      ))}

      {/* A record spinning in the dark */}
      <group ref={vinylGroup} position={[-2.1, 0.35, -2.6]} rotation={[-0.12, 0.18, 0]}>
        <mesh>
          <circleGeometry args={[1.4, 64]} />
          <meshBasicMaterial map={vinylTex} transparent opacity={0} depthWrite={false} />
        </mesh>
      </group>

      {/* Three doorframes of light */}
      <group ref={doorsGroup} position={[-2.3, -0.2, -3.0]} rotation={[0, 0.3, 0]}>
        {[0, 1, 2].map((fi) => {
          const w = 1.2;
          const h = 2.8;
          const x = fi * -1.5;
          const z = fi * -0.85;
          const col = [0xfca818, 0xa8460e, 0xc97e5b][fi];
          const bar = (
            <meshBasicMaterial
              color={col}
              transparent
              opacity={0}
              blending={THREE.AdditiveBlending}
              depthWrite={false}
            />
          );
          return (
            <group key={fi} position={[x, 0, z]}>
              <mesh position={[-w / 2, 0, 0]}>
                <boxGeometry args={[0.05, h, 0.05]} />
                {bar}
              </mesh>
              <mesh position={[w / 2, 0, 0]}>
                <boxGeometry args={[0.05, h, 0.05]} />
                {bar}
              </mesh>
              <mesh position={[0, h / 2, 0]}>
                <boxGeometry args={[w + 0.05, 0.05, 0.05]} />
                {bar}
              </mesh>
              <mesh userData={{ spill: true }}>
                <planeGeometry args={[w, h]} />
                {bar}
              </mesh>
            </group>
          );
        })}
      </group>

      {/* Stage spotlights */}
      {[0, 1].map((i) => (
        <mesh key={i} ref={(el) => (spotRefs.current[i] = el)} position={[0, 3.1, -1.9]}>
          <coneGeometry args={[1.5, 5.2, 32, 1, true]} />
          <meshBasicMaterial
            color={0xffb060}
            transparent
            opacity={0}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
            side={THREE.DoubleSide}
          />
        </mesh>
      ))}

      {/* Dust drifting through the light */}
      <points ref={dustRef} geometry={dust}>
        <pointsMaterial
          size={0.05}
          vertexColors
          transparent
          opacity={0.7}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
          sizeAttenuation
        />
      </points>

      {/* The lollipop itself, resident of every scene */}
      <group ref={lolli}>
        <mesh
          ref={headRef}
          position={[0, HEAD_Y, 0]}
          rotation={[Math.PI / 2, 0, 0]}
          material={candyMat}
        >
          <sphereGeometry args={[1, 96, 96]} />
        </mesh>

        <primitive object={goo} />

        <mesh position={[0, -1.4, 0]} material={stickMat}>
          <cylinderGeometry args={[0.085, 0.085, 4.4, 24]} />
        </mesh>
      </group>
    </>
  );
}
