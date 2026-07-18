"use client";

import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { Canvas, useFrame } from "@react-three/fiber";

/*
 * The service ladder as a real 3D climb — rungs are ceramic rings.
 *
 * Five rings, numbered 01–05, hang between two warm-black rails like the
 * rungs of a ladder. Scroll climbs the view up the ladder: the rung
 * underfoot centres, turns gold, pulls forward and lights up, while the
 * rest recede into a soft cream haze so the eye always knows where it is.
 * A damped cursor orbit keeps the sculpture alive between rungs.
 */

export const RUNGS = 5;
const SPACING = 2.0; // clear gap between rungs — distinct, not a chain
const RING_R = 0.74;
const RING_TUBE = 0.17;
const RAIL_X = 0.82;

const clamp = (v, a, b) => Math.min(b, Math.max(a, v));

export default function LadderScene({ progressRef }) {
  return (
    <Canvas
      dpr={[1, 2]}
      camera={{ position: [0, 0, 6.6], fov: 34 }}
      gl={{ alpha: true, antialias: true }}
      style={{ position: "absolute", inset: 0 }}
      onCreated={({ scene }) => {
        // Cream haze: rungs above and below the active one melt into the
        // section background, giving depth and focus.
        scene.fog = new THREE.Fog(new THREE.Color("#f4efe6"), 5.2, 11.5);
      }}
    >
      <ambientLight intensity={0.55} />
      <directionalLight position={[5, 7, 6]} intensity={1.7} color="#fff4e0" />
      <directionalLight position={[-6, -1, -3]} intensity={0.5} color="#eaf0ff" />
      <Ladder progressRef={progressRef} />
    </Canvas>
  );
}

function Ladder({ progressRef }) {
  const group = useRef();
  const rings = useRef([]);
  const glow = useRef();
  const settled = useRef(false);

  const railGeo = useMemo(() => roundedBar(0.13, (RUNGS - 1) * SPACING + 1.9, 0.2, 0.06), []);
  const ringGeo = useMemo(() => new THREE.TorusGeometry(RING_R, RING_TUBE, 26, 96), []);
  const railMat = useMemo(
    () => new THREE.MeshStandardMaterial({ color: "#17150f", roughness: 0.5, metalness: 0.18 }),
    []
  );
  const cream = useMemo(() => new THREE.Color("#efe7d6"), []);
  const gold = useMemo(() => new THREE.Color("#efc835"), []);
  const ringMats = useMemo(
    () =>
      Array.from(
        { length: RUNGS },
        () =>
          new THREE.MeshStandardMaterial({
            color: "#efe7d6",
            roughness: 0.34,
            metalness: 0.12,
            emissive: new THREE.Color("#efc835"),
            emissiveIntensity: 0,
          })
      ),
    []
  );

  useFrame((state) => {
    const p = clamp(progressRef.current, 0, 1);
    const climb = clamp(p * RUNGS - 0.5, 0, RUNGS - 1);

    // Slide the ladder down so the view climbs up it; snap on first frame.
    const targetY = ((RUNGS - 1) / 2) * SPACING - climb * SPACING;
    if (!settled.current) {
      group.current.position.y = targetY;
      settled.current = true;
    } else {
      group.current.position.y += (targetY - group.current.position.y) * 0.12;
    }

    // Gentle three-quarter stance + damped cursor orbit.
    const targetRX = 0.06 + -state.pointer.y * 0.1;
    const targetRY = -0.3 + state.pointer.x * 0.2;
    group.current.rotation.x += (targetRX - group.current.rotation.x) * 0.06;
    group.current.rotation.y += (targetRY - group.current.rotation.y) * 0.06;

    const s = Math.min(1, state.viewport.width / 3.4);
    group.current.scale.setScalar(s);

    // Active ring: gold, forward, larger, lit — falls off sharply by distance.
    let activeWorldY = 0;
    rings.current.forEach((mesh, i) => {
      if (!mesh) return;
      const d = Math.abs(climb - i);
      const g = Math.max(0, 1 - d); // 1 on the active rung, 0 a rung away
      ringMats[i].color.lerpColors(cream, gold, g);
      ringMats[i].emissiveIntensity = g * 0.5;
      const sc = 1 + 0.16 * g;
      mesh.scale.set(sc, sc, sc);
      mesh.position.z = 0.42 * g;
      if (g > 0.5) activeWorldY = mesh.position.y + group.current.position.y;
    });

    // Warm glow rides just behind the active rung.
    if (glow.current) {
      glow.current.position.set(0, activeWorldY * (group.current.scale.x), 0.2);
      glow.current.intensity = 6.5;
    }
  });

  return (
    <>
      <pointLight ref={glow} color="#efc835" distance={6} decay={2} intensity={0} />
      <group ref={group} rotation={[0.06, -0.3, 0]}>
        <mesh geometry={railGeo} material={railMat} position={[-RAIL_X, 0, 0]} />
        <mesh geometry={railGeo} material={railMat} position={[RAIL_X, 0, 0]} />
        {Array.from({ length: RUNGS }, (_, i) => (
          <mesh
            key={i}
            ref={(el) => (rings.current[i] = el)}
            geometry={ringGeo}
            material={ringMats[i]}
            position={[0, (i - (RUNGS - 1) / 2) * SPACING, 0]}
          >
            <NumeralPlane index={i} />
          </mesh>
        ))}
      </group>
    </>
  );
}

/* The rung's number, floating in the centre of its ring. */
function NumeralPlane({ index }) {
  const text = String(index + 1).padStart(2, "0");
  const texture = useMemo(() => {
    const canvas = document.createElement("canvas");
    canvas.width = 320;
    canvas.height = 160;
    drawNumeral(canvas, text);
    const tex = new THREE.CanvasTexture(canvas);
    tex.anisotropy = 8;
    return tex;
  }, [text]);

  useEffect(() => {
    let alive = true;
    if (document.fonts?.ready) {
      document.fonts.ready.then(() => {
        if (!alive) return;
        drawNumeral(texture.image, text);
        texture.needsUpdate = true;
      });
    }
    return () => {
      alive = false;
    };
  }, [text, texture]);

  return (
    <mesh position={[0, 0, 0.02]} raycast={() => null}>
      <planeGeometry args={[0.8, 0.4]} />
      <meshBasicMaterial map={texture} transparent toneMapped={false} />
    </mesh>
  );
}

function drawNumeral(canvas, text) {
  const ctx = canvas.getContext("2d");
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "#14120c";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.font = "600 84px 'Heuvel Grotesk', 'General Sans', sans-serif";
  if ("letterSpacing" in ctx) ctx.letterSpacing = "7px";
  ctx.fillText(text, canvas.width / 2, canvas.height / 2 + 5);
}

function roundedBar(w, h, depth, r) {
  const shape = new THREE.Shape();
  const x = -w / 2;
  const y = -h / 2;
  shape.moveTo(x + r, y);
  shape.lineTo(x + w - r, y);
  shape.quadraticCurveTo(x + w, y, x + w, y + r);
  shape.lineTo(x + w, y + h - r);
  shape.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  shape.lineTo(x + r, y + h);
  shape.quadraticCurveTo(x, y + h, x, y + h - r);
  shape.lineTo(x, y + r);
  shape.quadraticCurveTo(x, y, x + r, y);

  const geo = new THREE.ExtrudeGeometry(shape, {
    depth: Math.max(0.02, depth - 0.06),
    bevelEnabled: true,
    bevelThickness: 0.03,
    bevelSize: 0.03,
    bevelSegments: 2,
    curveSegments: 5,
  });
  geo.center();
  return geo;
}
