"use client";

import { useRef, useLayoutEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") gsap.registerPlugin(ScrollTrigger);

/*
 * Scroll-reveal, rebuilt on GSAP ScrollTrigger.
 *
 * Robustness first: the content renders visible in the server markup and
 * stays visible if JavaScript never runs (no-JS, a headless/social render,
 * a slow load). Only once JS is live does GSAP set the hidden from-state
 * and reveal on scroll. useLayoutEffect applies that state before paint,
 * so there's no flash. This is the fix for the audit's blank-void bug,
 * where content was gated on the reveal and could ship empty.
 *
 * Reduced motion: no hidden state at all, content just is.
 */
export default function Reveal({ children, delay = 0, y = 32, ...rest }) {
  const ref = useRef(null);

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const ctx = gsap.context(() => {
      gsap.from(el, {
        opacity: 0,
        y,
        duration: 0.85,
        delay,
        ease: "power3.out",
        scrollTrigger: {
          trigger: el,
          start: "top 88%",
          toggleActions: "play none none none",
          once: true,
        },
      });
    }, el);

    return () => ctx.revert();
  }, [delay, y]);

  return (
    <div ref={ref} {...rest}>
      {children}
    </div>
  );
}
