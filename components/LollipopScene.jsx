"use client";

import { useEffect, useMemo, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

/*
 * The melting lollipop, built toward the Vol. 1 deck's hero photography:
 * twisted amber-red glass on true black, one warm key light raking
 * across it through blind-like shafts, a hot red rim to pull it off the
 * background. Geometry follows the logo silhouette (swirled head, drip
 * streams, ice-blue stick); the material carries the grade.
 */

// The graded swirl: logo hues at the lit end, deck shadow tones baked in
// so no band ever reads as flat saturated candy-color.
const BAND_STOPS = [
  { at: 0.0, c: [0xfc, 0xa8, 0x18] }, // gold
  { at: 0.22, c: [0xfc, 0x78, 0x18] }, // burnt orange
  { at: 0.42, c: [0xfc, 0x24, 0x18] }, // hot red
  { at: 0.55, c: [0x8c, 0x38, 0x0e] }, // burnt amber
  { at: 0.68, c: [0xfc, 0x54, 0x84] }, // the single pink note
  { at: 0.78, c: [0xb6, 0x46, 0x0e] }, // ember
  { at: 0.9, c: [0x54, 0x1c, 0x00] }, // amber shadow
  { at: 1.0, c: [0xfc, 0xa8, 0x18] }, // wrap back to gold
];

function bandColor(t) {
  t = ((t % 1) + 1) % 1;
  for (let i = 0; i < BAND_STOPS.length - 1; i++) {
    const a = BAND_STOPS[i];
    const b = BAND_STOPS[i + 1];
    if (t >= a.at && t <= b.at) {
      const f = (t - a.at) / (b.at - a.at || 1);
      return [
        a.c[0] + (b.c[0] - a.c[0]) * f,
        a.c[1] + (b.c[1] - a.c[1]) * f,
        a.c[2] + (b.c[2] - a.c[2]) * f,
      ];
    }
  }
  return BAND_STOPS[0].c;
}

// Swirl texture in UV space: bands spiral pole-to-pole, so with the
// sphere's pole aimed at the camera the face reads as the logo's spiral.
function makeSwirlTexture() {
  const size = 1024;
  const canvas = document.createElement("canvas");
  canvas.width = canvas.height = size;
  const ctx = canvas.getContext("2d");
  const img = ctx.createImageData(size, size);
  const turns = 3;

  for (let y = 0; y < size; y++) {
    const v = y / size;
    for (let x = 0; x < size; x++) {
      const u = x / size;
      const t = u * turns + v * 1.35;
      const [r, g, b] = bandColor(t);
      // Fall toward the deck's amber shadow at the melting (south) pole
      const sink = 0.82 + 0.18 * (1 - v);
      const i = (y * size + x) * 4;
      img.data[i] = r * sink;
      img.data[i + 1] = g * sink;
      img.data[i + 2] = b * sink;
      img.data[i + 3] = 255;
    }
  }
  ctx.putImageData(img, 0, 0);

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
  tex.anisotropy = 8;
  return tex;
}

// Striped gobo for the key light — the "window blinds" from the deck photo.
function makeBlindsTexture() {
  const size = 512;
  const canvas = document.createElement("canvas");
  canvas.width = canvas.height = size;
  const ctx = canvas.getContext("2d");
  ctx.fillStyle = "#000";
  ctx.fillRect(0, 0, size, size);
  ctx.save();
  ctx.translate(size / 2, size / 2);
  ctx.rotate(-0.42); // diagonal shafts, off-axis like the reference
  const stripe = 46;
  ctx.fillStyle = "#fff";
  for (let y = -size; y < size; y += stripe * 2) {
    ctx.fillRect(-size, y, size * 2, stripe * 1.15);
  }
  ctx.restore();
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

// Environment the glass reflects: a black room with warm striped panels,
// so every highlight it catches is an ember-toned streak.
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

    // Warm key wall of slats, upper right
    for (let i = 0; i < 5; i++) {
      panel(0xffb060, 5.5, 6, 0.5, [4, 2.4 - i * 0.9, 3], -Math.PI / 3);
    }
    // Dim ember bounce, left
    panel(0x8c380e, 1.6, 5, 4, [-5, 0, 1], Math.PI / 2.6);
    // Faint red kicker behind
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

// Drip streams around the lower rim, echoing the logo's melt silhouette.
// Each carries one hue from the swirl; lengths are animated by scroll.
const DRIPS = [
  { x: -1.06, z: 0.28, r: 0.09, len: 1.0, color: 0xfc5484, lag: 0.0 },
  { x: -0.78, z: 0.5, r: 0.12, len: 1.6, color: 0xfc7818, lag: 0.12 },
  { x: -0.45, z: 0.66, r: 0.1, len: 1.25, color: 0xfca818, lag: 0.05 },
  { x: -0.14, z: 0.74, r: 0.13, len: 1.9, color: 0xfc2418, lag: 0.2 },
  { x: 0.18, z: 0.72, r: 0.11, len: 1.45, color: 0xfca818, lag: 0.08 },
  { x: 0.5, z: 0.62, r: 0.13, len: 1.75, color: 0xfc7818, lag: 0.16 },
  { x: 0.82, z: 0.44, r: 0.1, len: 1.15, color: 0xb6460e, lag: 0.03 },
  { x: 1.08, z: 0.2, r: 0.08, len: 0.9, color: 0xfc5484, lag: 0.1 },
];

export default function LollipopScene({ progressRef }) {
  const group = useRef(null);
  const headRef = useRef(null);
  const dripRefs = useRef([]);
  const pointer = useRef({ x: 0, y: 0 });

  useWarmEnvironment();

  const swirlTex = useMemo(() => makeSwirlTexture(), []);
  const blindsTex = useMemo(() => makeBlindsTexture(), []);

  // The hero material: glass/hard-candy, per the brief — transmission,
  // low roughness, full clearcoat, resin-range IOR. Grade comes from the
  // swirl map; attenuation pulls depth toward the deck's amber shadow.
  const candyMat = useMemo(
    () =>
      new THREE.MeshPhysicalMaterial({
        map: swirlTex,
        transmission: 0.88,
        thickness: 1.4,
        roughness: 0.14,
        clearcoat: 1.0,
        clearcoatRoughness: 0.12,
        ior: 1.45,
        attenuationColor: new THREE.Color(0x8c380e),
        attenuationDistance: 2.2,
        envMapIntensity: 1.35,
        // The swirl glows faintly through the glass so the bands stay
        // readable in shadow instead of sinking into flat dark red.
        emissiveMap: swirlTex,
        emissive: new THREE.Color(0x8a8a8a),
        emissiveIntensity: 0.4,
      }),
    [swirlTex]
  );

  const dripMats = useMemo(
    () =>
      DRIPS.map(
        (d) =>
          new THREE.MeshPhysicalMaterial({
            color: d.color,
            transmission: 0.85,
            thickness: 0.6,
            roughness: 0.16,
            clearcoat: 1.0,
            clearcoatRoughness: 0.15,
            ior: 1.45,
            attenuationColor: new THREE.Color(0x541c00),
            attenuationDistance: 1.1,
            envMapIntensity: 1.2,
            emissive: new THREE.Color(0x2a0e00),
            emissiveIntensity: 0.5,
          })
      ),
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

  // Drip geometry with its origin at the top so scale.y pours downward.
  const dripGeo = useMemo(() => {
    const g = new THREE.CapsuleGeometry(1, 2, 6, 14);
    g.translate(0, -2, 0); // top of capsule at local origin
    return g;
  }, []);

  useEffect(() => {
    const onMove = (e) => {
      pointer.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      pointer.current.y = (e.clientY / window.innerHeight) * 2 - 1;
    };
    window.addEventListener("mousemove", onMove, { passive: true });
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  useFrame((state) => {
    const p = progressRef?.current ?? 0;
    const t = state.clock.elapsedTime;
    if (!group.current) return;

    // Desktop: object sits right-of-center so the headline owns the left.
    // Small screens: centered and slightly smaller.
    const wide = state.size.width > 900;
    const narrow = state.size.width < 640;
    group.current.position.x = wide ? 1.15 : 0;
    const s = narrow ? 0.72 : 1;
    group.current.scale.set(s, s, s);

    // Slow idle turn plus the scroll-driven rotation
    group.current.rotation.y = t * 0.12 + p * Math.PI * 1.5;
    group.current.rotation.x =
      -0.12 + pointer.current.y * 0.06 + Math.sin(t * 0.4) * 0.02;
    group.current.rotation.z = pointer.current.x * 0.04;

    // The head slumps slightly as the melt advances
    if (headRef.current) {
      const slump = 1 - p * 0.1;
      headRef.current.scale.set(1.35, 1.35 * slump, 1.05);
      headRef.current.position.y = 0.9 - p * 0.22;
    }

    // Drips lengthen with scroll, each on its own lag, with a slow ooze
    dripRefs.current.forEach((mesh, i) => {
      if (!mesh) return;
      const d = DRIPS[i];
      const local = THREE.MathUtils.clamp((p - d.lag) / (1 - d.lag), 0, 1);
      const eased = 1 - Math.pow(1 - local, 3);
      const ooze = 1 + Math.sin(t * 0.9 + i * 1.7) * 0.035;
      const len = (0.16 + eased * d.len) * ooze;
      mesh.scale.set(d.r, len * 0.5, d.r);
      // Tops tucked into the head's lower half so streams grow out of
      // the glass instead of hanging detached beside it
      mesh.position.y = 0.9 - (headRef.current ? p * 0.22 : 0) - 0.72;
    });
  });

  return (
    <>
      {/* Warm key, off-axis upper right, throwing the blind shafts */}
      <spotLight
        position={[5, 4, 4]}
        angle={0.55}
        penumbra={0.45}
        intensity={260}
        color={0xffb060}
        map={blindsTex}
        castShadow={false}
      />
      {/* Hot red rim from behind-left — the rare #FC2418 moment */}
      <pointLight position={[-4, 1.2, -3.5]} intensity={60} color={0xfc2418} />
      {/* Whisper of ember fill so shadows fall to #2A0E00, not void */}
      <ambientLight intensity={0.06} color={0xb6460e} />

      <group ref={group} position={[0, -0.1, 0]}>
        {/* Swirled head — pole faced to camera so the spiral reads */}
        <mesh
          ref={headRef}
          position={[0, 0.9, 0]}
          rotation={[Math.PI / 2, 0, 0.35]}
          material={candyMat}
        >
          <sphereGeometry args={[1, 96, 96]} />
        </mesh>

        {/* Melt streams */}
        {DRIPS.map((d, i) => (
          <mesh
            key={i}
            ref={(el) => (dripRefs.current[i] = el)}
            position={[d.x, -0.2, d.z]}
            geometry={dripGeo}
            material={dripMats[i]}
          />
        ))}

        {/* Ice-blue stick — the logo's one cool note */}
        <mesh position={[0, -1.55, 0]} material={stickMat}>
          <cylinderGeometry args={[0.075, 0.075, 3.1, 24]} />
        </mesh>
      </group>
    </>
  );
}
