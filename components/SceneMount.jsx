"use client";

import dynamic from "next/dynamic";

/* The global 3D world is client-only and lives behind every page. */
const SceneRoot = dynamic(() => import("./SceneRoot"), { ssr: false });

export default function SceneMount() {
  return <SceneRoot />;
}
