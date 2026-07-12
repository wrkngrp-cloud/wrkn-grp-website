"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { Canvas } from "@react-three/fiber";
import LollipopScene from "./LollipopScene";

/*
 * Homepage hero: a ~260vh scroll runway with the lollipop pinned for its
 * full length. Scroll progress (0→1 across the runway) drives rotation
 * and the melt; the copy sits over the lower third of the first screen.
 */
export default function LollipopHero() {
  const sectionRef = useRef(null);
  const progressRef = useRef(0);

  useEffect(() => {
    const onScroll = () => {
      const el = sectionRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const runway = rect.height - window.innerHeight;
      progressRef.current = Math.min(1, Math.max(0, -rect.top / runway));
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return (
    <section ref={sectionRef} style={{ height: "260vh", position: "relative" }}>
      <div className="hero-sticky">
        <div className="hero-canvas">
          <Canvas
            dpr={[1, 2]}
            camera={{ fov: 35, position: [0, 0, 7.2] }}
            gl={{ antialias: true, alpha: true }}
          >
            <LollipopScene progressRef={progressRef} />
          </Canvas>
        </div>

        <div className="container hero-copy">
          <p className="kicker mb-1">Sweetness Studios · The sound arm of WRKN GRP</p>
          <h1 className="display-2" style={{ maxWidth: "22ch" }}>
            Some sounds are heard and forgotten. We make the ones that are
            felt — and remembered.
          </h1>
          <p className="body-lg dim measure mt-2">
            Sweetness Studios is the sound arm of WRKN GRP. Music with soul
            at its core, written to become the soundtrack of somebody&rsquo;s
            life.
          </p>
          <div className="mt-2" style={{ display: "flex", gap: "1rem" }}>
            <Link href="/work/" className="btn">
              Hear the work
            </Link>
            <Link href="/contact/" className="text-link" style={{ alignSelf: "center" }}>
              Start something →
            </Link>
          </div>
        </div>

        <div className="scroll-cue">Scroll · it melts</div>
      </div>
    </section>
  );
}
