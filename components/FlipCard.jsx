"use client";

import { useEffect, useRef, useState } from "react";
import { useInView } from "framer-motion";

/*
 * Full 180° flip card. Desktop: flips on hover (CSS). Touch: flips when
 * it settles into the middle of the viewport, and tap toggles it.
 */
export default function FlipCard({ front, back, height = "28rem", cursorLabel }) {
  const ref = useRef(null);
  const [touch, setTouch] = useState(false);
  const [flipped, setFlipped] = useState(false);
  const inView = useInView(ref, { margin: "-42% 0px -42% 0px" });

  useEffect(() => {
    setTouch(!window.matchMedia("(hover: hover) and (pointer: fine)").matches);
  }, []);

  useEffect(() => {
    if (touch) setFlipped(inView);
  }, [touch, inView]);

  return (
    <div
      ref={ref}
      className={`flip-scene${touch && flipped ? " is-flipped" : ""}`}
      data-cursor={cursorLabel}
      onClickCapture={
        touch
          ? (e) => {
              // first tap flips, second tap follows any link on the back
              if (!flipped) {
                e.preventDefault();
                e.stopPropagation();
                setFlipped(true);
              }
            }
          : undefined
      }
      style={{ height, width: "100%" }}
    >
      <div className="flip-inner">
        <div className="flip-face">{front}</div>
        <div className="flip-face flip-face--back">{back}</div>
      </div>
    </div>
  );
}
