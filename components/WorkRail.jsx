"use client";

import { useRef, useState } from "react";

/*
 * Horizontal rail: native scroll (wheel + touch work for free),
 * plus mouse drag-to-scroll for desktop.
 */
export default function WorkRail({ children }) {
  const railRef = useRef(null);
  const [dragging, setDragging] = useState(false);
  const drag = useRef({ active: false, startX: 0, startScroll: 0, moved: 0 });

  const onPointerDown = (e) => {
    if (e.pointerType !== "mouse") return;
    drag.current = {
      active: true,
      startX: e.clientX,
      startScroll: railRef.current.scrollLeft,
      moved: 0,
    };
  };
  const onPointerMove = (e) => {
    if (!drag.current.active) return;
    const dx = e.clientX - drag.current.startX;
    drag.current.moved = Math.max(drag.current.moved, Math.abs(dx));
    if (drag.current.moved > 6) setDragging(true);
    railRef.current.scrollLeft = drag.current.startScroll - dx;
  };
  const endDrag = () => {
    drag.current.active = false;
    setTimeout(() => setDragging(false), 50);
  };

  return (
    <div
      ref={railRef}
      data-cursor="Drag"
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={endDrag}
      onPointerLeave={endDrag}
      onClickCapture={(e) => {
        if (dragging) {
          e.preventDefault();
          e.stopPropagation();
        }
      }}
      style={{
        display: "flex",
        gap: "2rem",
        overflowX: "auto",
        padding: "1rem var(--gutter) 2rem",
        scrollSnapType: "x proximity",
        scrollbarWidth: "none",
        userSelect: "none",
        WebkitUserSelect: "none",
      }}
    >
      {children}
    </div>
  );
}
