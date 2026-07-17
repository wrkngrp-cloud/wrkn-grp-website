"use client";

import dynamic from "next/dynamic";

/* Client-only mount for the Signal (three.js never renders on the server). */
const SignalField = dynamic(() => import("./SignalField"), { ssr: false });

export default function Signal(props) {
  return <SignalField {...props} />;
}
