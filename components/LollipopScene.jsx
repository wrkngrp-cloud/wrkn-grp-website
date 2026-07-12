"use client";

import { useEffect, useMemo, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { createSwirlTexture, createBlindsTexture } from "../lib/lollipopTexture";

/*
 * The melting lollipop — a faithful 3D replica of the logo file.
 *
 * GEOMETRY (fixed, replicates the logo): the swirled head faces the
 * camera at rest so the single-arm spiral reads exactly like the flat
 * mark; the drip curtain hangs off the head's lower silhouette at the
 * logo's own positions, colors, and rest lengths (the logo is already
 * mid-melt — scroll advances the melt further, it doesn't start it);
 * the ice-blue stick drops from behind the curtain.
 *
 * TEXTURING (provisional, swappable): every painted surface comes from
 * lib/lollipopTexture.js — replace that module's output with future
 * texture assets without touching this geometry.
 *
 * LIGHTING (per the deck's hero photography): one warm off-axis key
 * through a blinds gobo, hot-red rim from behind, warm-slat PMREM
 * environment, on true black.
 */

const HEAD_R = 1.35;
const HEAD_Y = 0.9;

// The drip curtain, left → right as drawn in the logo file: logo hexes,
// widths, and rest lengths (`len`), with tops riding the head's circle
// edge. `x` is world units from the head's axis.
const DRIPS = [
  { x: -1.12, r: 0.11, len: 0.85, color: 0xfc5484 },
  { x: -0.94, r: 0.13, len: 1.45, color: 0xfc2418 },
  { x: -0.76, r: 0.12, len: 2.0, color: 0xfc5484 },
  { x: -0.55, r: 0.14, len: 1.05, color: 0xfc7818 },
  { x: -0.35, r: 0.12, len: 1.7, color: 0xfca818 },
  { x: -0.15, r: 0.15, len: 2.35, color: 0xfc7818 },
  { x: 0.07, r: 0.12, len: 1.15, color: 0xfc2418 },
  { x: 0.28, r: 0.14, len: 2.1, color: 0xfca818 },
  { x: 0.5, r: 0.13, len: 1.5, color: 0xfc7818 },
  { x: 0.72, r: 0.11, len: 0.95, color: 0xfca818 },
  { x: 0.94, r: 0.13, len: 1.3, color: 0xfc7818 },
  { x: 1.12, r: 0.1, len: 0.65, color: 0xfc2418 },
];

// Tops sit on the circle silhouette, tucked slightly into the glass so
// each stream grows out of the head, exactly as the flat mark overlaps.
const dripTopY = (x) =>
  HEAD_Y - Math.sqrt(Math.max(0, HEAD_R * HEAD_R - x * x)) + 0.18;

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

export default function LollipopScene({ progressRef }) {
  const group = useRef(null);
  const headRef = useRef(null);
  const dripRefs = useRef([]);
  const pointer = useRef({ x: 0, y: 0 });

  useWarmEnvironment();

  const swirlTex = useMemo(() => createSwirlTexture(), []);
  const blindsTex = useMemo(() => createBlindsTexture(), []);

  // The hero material: glass/hard-candy per the brief — transmission,
  // low roughness, full clearcoat, resin-range IOR. The swirl map also
  // glows faintly through the glass so the bands stay readable in
  // shadow instead of sinking into flat dark red.
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
  // Unit capsule: radius 1, total height 4, spanning y ∈ [0, -4].
  const dripGeo = useMemo(() => {
    const g = new THREE.CapsuleGeometry(1, 2, 6, 14);
    g.translate(0, -2, 0);
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

    // At rest the mark is face-on, exactly as the logo file reads.
    // Scroll turns it under the light; a breath of sway keeps it alive.
    group.current.rotation.y = p * Math.PI * 1.5 + Math.sin(t * 0.3) * 0.04;
    group.current.rotation.x =
      -0.04 + pointer.current.y * 0.05 + Math.sin(t * 0.4) * 0.015;
    group.current.rotation.z = pointer.current.x * 0.03;

    // The head slumps slightly as the melt advances
    if (headRef.current) {
      const slump = 1 - p * 0.07;
      headRef.current.scale.set(HEAD_R, HEAD_R * slump, HEAD_R * 0.92);
      headRef.current.position.y = HEAD_Y - p * 0.16;
    }

    // The logo is already mid-melt: drips hold their drawn rest lengths
    // at the top and stretch up to ~1.9× as scroll advances, each on a
    // slow ooze of its own.
    dripRefs.current.forEach((mesh, i) => {
      if (!mesh) return;
      const d = DRIPS[i];
      const eased = 1 - Math.pow(1 - p, 2);
      const ooze = 1 + Math.sin(t * 0.9 + i * 1.7) * 0.03;
      const len = d.len * (1 + eased * 0.9) * ooze;
      mesh.scale.set(d.r, len / 4, d.r);
      mesh.position.y = dripTopY(d.x) - p * 0.16;
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
        {/* Swirled head — pole faced to the camera so the single-arm
            spiral reads face-on, curl at the centre, like the mark */}
        <mesh
          ref={headRef}
          position={[0, HEAD_Y, 0]}
          rotation={[Math.PI / 2, 0, 0]}
          material={candyMat}
        >
          <sphereGeometry args={[1, 96, 96]} />
        </mesh>

        {/* The drip curtain, tops riding the head's silhouette */}
        {DRIPS.map((d, i) => (
          <mesh
            key={i}
            ref={(el) => (dripRefs.current[i] = el)}
            position={[d.x, dripTopY(d.x), 0.42]}
            geometry={dripGeo}
            material={dripMats[i]}
          />
        ))}

        {/* Ice-blue stick — the logo's one cool note, dropping from
            behind the curtain and running out of frame like the mark */}
        <mesh position={[0, -1.4, 0]} material={stickMat}>
          <cylinderGeometry args={[0.085, 0.085, 4.4, 24]} />
        </mesh>
      </group>
    </>
  );
}
