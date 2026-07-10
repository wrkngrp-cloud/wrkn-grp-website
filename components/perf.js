"use client";

import { useEffect, useRef, useState } from "react";

/*
 * Mount-when-near: keeps a heavy WebGL scene out of the initial load and
 * ensures only one 3D context spins up at a time. Returns true once the
 * observed element comes within `rootMargin` of the viewport.
 */
export function useInView(ref, rootMargin = "40% 0px") {
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el || inView) return;
    if (typeof IntersectionObserver === "undefined") {
      setInView(true);
      return;
    }
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setInView(true);
          io.disconnect();
        }
      },
      { rootMargin }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [ref, rootMargin, inView]);
  return inView;
}

// Synchronous, client-only check for phone-class devices (used to dial WebGL
// down). Safe to call at render inside ssr:false components.
export function isMobileDevice() {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(max-width: 820px), (pointer: coarse)").matches;
}

// Reactive version for layout decisions in components that render on the server.
export function useIsMobile() {
  const [m, setM] = useState(false);
  const q = useRef("(max-width: 820px), (pointer: coarse)");
  useEffect(() => {
    const mq = window.matchMedia(q.current);
    const on = () => setM(mq.matches);
    on();
    mq.addEventListener?.("change", on);
    return () => mq.removeEventListener?.("change", on);
  }, []);
  return m;
}
