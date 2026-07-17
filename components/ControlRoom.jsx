"use client";

import dynamic from "next/dynamic";

/* Client-only mount for the Studio control-room scene. */
const ControlRoomScene = dynamic(() => import("./ControlRoomScene"), { ssr: false });

export default function ControlRoom(props) {
  return <ControlRoomScene {...props} />;
}
