"use client";

import dynamic from "next/dynamic";

/* WebGL is client-only; the runway keeps its height while the scene loads. */
const LollipopHero = dynamic(() => import("./LollipopHero"), {
  ssr: false,
  loading: () => <div style={{ height: "260vh" }} />,
});

export default function Hero3D() {
  return <LollipopHero />;
}
