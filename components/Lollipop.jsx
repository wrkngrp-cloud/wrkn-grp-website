"use client";

import dynamic from "next/dynamic";

/* Client-only mount for the hero lollipop (three.js never renders on the server). */
const LollipopScene = dynamic(() => import("./LollipopScene"), { ssr: false });

export default function Lollipop(props) {
  return <LollipopScene {...props} />;
}
