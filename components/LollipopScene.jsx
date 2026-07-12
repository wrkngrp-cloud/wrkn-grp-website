"use client";

import { useEffect, useMemo, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { MarchingCubes } from "three/examples/jsm/objects/MarchingCubes.js";
import { createSwirlTexture, createBlindsTexture } from "../lib/lollipopTexture";

/*
 * The melting lollipop.
 *
 * HEAD — a 3D read of the logo file: a FLAT disc lollipop (lens
 * profile, rounded rim), face-on single-arm spiral with the curl at the
 * centre, glossy candy surface (see lib/lollipopTexture.js, the
 * texturing swap point).
 *
 * MELT — a real liquid: a marching-cubes metaball field. The melt
 * sheathes the underside of the head, runs down in viscous streams that
 * thicken into hanging beads, and the beads swell, neck, detach and
 * fall as droplets. Nothing is a rigid capsule; every surface is the
 * smooth isosurface of the field, so streams merge and pull apart the
 * way syrup actually behaves. Scroll advances the melt; the drip cycle
 * never fully sleeps, so the object reads alive even at rest.
 *
 * LIGHTING — per the deck's hero photography: one warm off-axis key
 * through a blinds gobo, hot-red rim, warm-slat PMREM environment, on
 * true black.
 */

const HEAD_R = 1.35;
const HEAD_Y = 0.9;

// Melt streams, left → right, carrying the logo's drip hues. `len` is
// the full-melt reach in world units, `rest` how melted the logo
// already is at the top of the page, `T` the seconds per droplet cycle.
const STREAMS = [
  { x: -1.02, w: 0.8, len: 1.5, rest: 0.42, T: 7.3, color: 0xfc5484 },
  { x: -0.68, w: 1.0, len: 2.2, rest: 0.34, T: 5.9, color: 0xfc7818 },
  { x: -0.34, w: 0.85, len: 1.7, rest: 0.5, T: 8.7, color: 0xfca818 },
  { x: 0.0, w: 1.1, len: 2.5, rest: 0.38, T: 6.6, color: 0xfc2418 },
  { x: 0.34, w: 0.9, len: 1.9, rest: 0.46, T: 7.9, color: 0xfca818 },
  { x: 0.68, w: 1.0, len: 2.3, rest: 0.36, T: 6.1, color: 0xfc7818 },
  { x: 1.02, w: 0.8, len: 1.4, rest: 0.44, T: 9.1, color: 0xb6460e },
];

// The underside of the head, where the melt clings.
const rimY = (x) =>
  HEAD_Y - Math.sqrt(Math.max(0.05, HEAD_R * HEAD_R - x * x)) * 0.96;

// Environment the candy reflects: a black room with warm striped panels,
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

export default function LollipopScene({ progressRef }) {
  const group = useRef(null);
  const headRef = useRef(null);
  const mcRef = useRef(null);
  const pointer = useRef({ x: 0, y: 0 });
  const size = useThree((s) => s.size);

  useWarmEnvironment();

  const swirlTex = useMemo(() => createSwirlTexture(), []);
  const blindsTex = useMemo(() => createBlindsTexture(), []);

  // Glossy hard-candy head: still wet-looking under the clearcoat, but
  // more sugar than glass — the swirl carries the color.
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

  // The liquid: one smooth isosurface, vertex-colored per stream,
  // polished like warm syrup catching the slat light.
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
    const resolution = size.width < 640 ? 44 : 64;
    const mc = new MarchingCubes(resolution, gooMat, false, true, 30000);
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

  useEffect(() => {
    const onMove = (e) => {
      pointer.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      pointer.current.y = (e.clientY / window.innerHeight) * 2 - 1;
    };
    window.addEventListener("mousemove", onMove, { passive: true });
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  // World → metaball field (0..1 inside the field box).
  const toField = (wx, wy) => [
    (wx - goo.position.x) / (2 * goo.scale.x) + 0.5,
    (wy - goo.position.y) / (2 * goo.scale.y) + 0.5,
  ];

  useFrame((state) => {
    const p = progressRef?.current ?? 0;
    const t = state.clock.elapsedTime;
    if (!group.current) return;

    const wide = state.size.width > 900;
    const narrow = state.size.width < 640;
    group.current.position.x = wide ? 1.15 : 0;
    const s = narrow ? 0.72 : 1;
    group.current.scale.set(s, s, s);

    // Face-on at rest, turning gently as the page scrolls. The turn is
    // shallow so the liquid always reads in profile.
    group.current.rotation.y = p * 0.9 + Math.sin(t * 0.3) * 0.05;
    group.current.rotation.x =
      -0.04 + pointer.current.y * 0.05 + Math.sin(t * 0.4) * 0.015;
    group.current.rotation.z = pointer.current.x * 0.03;

    // The head softens and slumps as the melt advances.
    if (headRef.current) {
      const slump = 1 - p * 0.08;
      const sag = Math.sin(t * 0.5) * 0.01;
      // The mesh is rotated 90° about X, so local Y is the pole axis
      // pointing at the camera (world depth) — that's the axis the flat
      // disc thins on. Local Z is world-vertical and carries the slump.
      headRef.current.scale.set(
        HEAD_R * (1 + p * 0.04),
        HEAD_R * 0.34,
        HEAD_R * (slump + sag)
      );
      headRef.current.position.y = HEAD_Y - p * 0.18;
    }

    // ---- the liquid field ----
    const mc = goo;
    mc.reset();

    const drop = p * 0.18; // whole melt follows the head down
    const sub = 12;

    STREAMS.forEach((st, i) => {
      const col = streamColors[i];
      const top = rimY(st.x) + 0.32 - drop;

      // Pool bead clinging to the head's underside — keeps the melt
      // visually fused to the head.
      const [px, py] = toField(st.x * 0.92, top);
      mc.addBall(px, py, 0.5, 0.075 * st.w * (0.7 + p * 0.3), sub, col);

      // Stream body: a chain of blending beads whose reach grows with
      // scroll. A slow ooze keeps it moving even when the page is still.
      const melt = st.rest + (1 - st.rest) * (1 - Math.pow(1 - p, 2));
      const ooze = 1 + Math.sin(t * 0.6 + i * 1.9) * 0.06;
      const reach = st.len * melt * ooze;
      const steps = Math.max(3, Math.ceil(reach / 0.16));
      for (let k = 1; k <= steps; k++) {
        const f = k / steps;
        // Streams thin through the middle and swell at the front — the
        // viscous neck-and-bead profile of a real drip.
        const profile = 0.042 - 0.02 * Math.sin(f * Math.PI) + 0.03 * f * f;
        const wobble = Math.sin(t * 0.9 + i * 2.3 + f * 5) * 0.02;
        const [bx, by] = toField(
          st.x + wobble,
          top - 0.14 - reach * f
        );
        mc.addBall(bx, by, 0.5, profile * st.w, sub, col);
      }

      // Droplet cycle: the front bead swells, necks, releases, falls.
      const cycle = (t / st.T + i * 0.37) % 1;
      const frontY = top - 0.14 - reach;
      if (cycle < 0.55) {
        // swelling at the tip
        const grow = cycle / 0.55;
        const [dx, dy] = toField(st.x, frontY - 0.07 * grow);
        mc.addBall(dx, dy, 0.5, (0.03 + 0.045 * grow) * st.w, sub, col);
      } else {
        // free fall, accelerating, shrinking as it goes
        const fall = (cycle - 0.55) / 0.45;
        const dyWorld = frontY - 0.12 - fall * fall * 3.2;
        const [dx, dy] = toField(st.x, dyWorld);
        const sz = (0.055 - 0.025 * fall) * st.w;
        if (dy > 0.02) mc.addBall(dx, dy, 0.5, sz, sub, col);
        // the tip it left behind, retracting
        const [rx, ry] = toField(st.x, frontY - 0.05);
        mc.addBall(rx, ry, 0.5, 0.025 * st.w * (1 - fall * 0.4), sub, col);
      }
    });

    mc.update();
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

        {/* The liquid melt */}
        <primitive object={goo} />

        {/* Ice-blue stick — the logo's one cool note, dropping from
            behind the melt and running out of frame like the mark */}
        <mesh position={[0, -1.4, 0]} material={stickMat}>
          <cylinderGeometry args={[0.085, 0.085, 4.4, 24]} />
        </mesh>
      </group>
    </>
  );
}
