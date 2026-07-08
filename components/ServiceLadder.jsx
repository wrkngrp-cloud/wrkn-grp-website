"use client";

import { useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";

/*
 * The service ladder as an instrument, not a grid.
 *
 * Right: five rungs. Hovering (desktop) or tapping (touch) a rung makes
 * it the active one — it expands to show the full description, and a
 * gold rail climbs the ladder to its position.
 *
 * Left: a sticky spec panel that swaps with the active rung — massive
 * italic numeral, product name, and who it's for.
 */
export default function ServiceLadder({ items }) {
  const [active, setActive] = useState(0);
  const reduced = useReducedMotion();
  const item = items[active];

  return (
    <div className="ladder">
      {/* Sticky spec panel */}
      <div className="ladder__panel">
        <div style={{ position: "sticky", top: "16vh" }}>
          <AnimatePresence mode="wait">
            <motion.div
              key={active}
              initial={reduced ? false : { opacity: 0, y: 26 }}
              animate={{ opacity: 1, y: 0 }}
              exit={reduced ? undefined : { opacity: 0, y: -18 }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            >
              <span
                className="display"
                aria-hidden
                style={{
                  fontStyle: "italic",
                  fontSize: "clamp(5rem, 12vw, 10rem)",
                  lineHeight: 0.9,
                  color: "var(--gold)",
                  display: "block",
                }}
              >
                {item.step}
              </span>
              <h3 className="display display-sm" style={{ margin: "1.4rem 0 1rem" }}>
                {item.name}
              </h3>
              <p className="small-caps" style={{ color: "var(--gold)", marginBottom: "0.7rem" }}>
                Who It&rsquo;s For
              </p>
              <p style={{ maxWidth: "34ch", opacity: 0.85, fontSize: "1.05rem" }}>{item.who}</p>
              <Link href="/contact" className="link-draw small-caps" style={{ marginTop: "1.6rem", display: "inline-block" }}>
                Start Here →
              </Link>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Rungs */}
      <div className="ladder__rungs" style={{ position: "relative" }}>
        {/* Climbing gold rail */}
        <motion.span
          aria-hidden
          animate={{ top: `${(active / items.length) * 100}%` }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          style={{
            position: "absolute",
            left: 0,
            width: 2,
            height: `${100 / items.length}%`,
            background: "var(--gold)",
            zIndex: 1,
          }}
        />
        {items.map((s, i) => {
          const isActive = i === active;
          return (
            <button
              key={s.step}
              type="button"
              onMouseEnter={() => setActive(i)}
              onFocus={() => setActive(i)}
              onClick={() => setActive(i)}
              aria-expanded={isActive}
              className="ladder__rung"
              style={{
                display: "block",
                width: "100%",
                textAlign: "left",
                borderTop: "1px solid var(--cream-faint)",
                borderLeft: "2px solid transparent",
                padding: "1.7rem 1.4rem 1.7rem 1.8rem",
                background: isActive ? "#111009" : "transparent",
                transition: "background .35s",
                cursor: "pointer",
              }}
            >
              <span style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", gap: "1rem" }}>
                <motion.span
                  animate={{ x: isActive ? 10 : 0 }}
                  transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                  className="display"
                  style={{
                    fontSize: "clamp(1.4rem, 2.6vw, 2rem)",
                    color: isActive ? "var(--gold)" : "var(--cream)",
                    transition: "color .3s",
                    display: "inline-flex",
                    alignItems: "baseline",
                    gap: "1rem",
                  }}
                >
                  <span style={{ fontSize: "0.55em", opacity: 0.55, fontStyle: "italic" }}>{s.step}</span>
                  {s.name}
                </motion.span>
                <motion.span
                  aria-hidden
                  animate={{ rotate: isActive ? 45 : 0 }}
                  transition={{ duration: 0.3 }}
                  style={{ fontSize: "1.3rem", lineHeight: 1, color: "var(--gold)", flex: "none" }}
                >
                  +
                </motion.span>
              </span>
              <motion.span
                initial={false}
                animate={{ height: isActive ? "auto" : 0, opacity: isActive ? 1 : 0 }}
                transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                style={{ display: "block", overflow: "hidden" }}
              >
                <span style={{ display: "block", padding: "1.1rem 0 0.2rem", maxWidth: "58ch", opacity: 0.85, fontSize: "1.02rem", lineHeight: 1.65 }}>
                  {s.blurb}
                </span>
                <span className="ladder__who" style={{ display: "none", paddingTop: "0.9rem" }}>
                  <span className="small-caps" style={{ color: "var(--gold)", display: "block", marginBottom: "0.4rem" }}>
                    Who It&rsquo;s For
                  </span>
                  <span style={{ display: "block", opacity: 0.85, maxWidth: "50ch" }}>{s.who}</span>
                </span>
              </motion.span>
            </button>
          );
        })}
        <div style={{ borderTop: "1px solid var(--cream-faint)" }} />
      </div>

      <style jsx>{`
        .ladder {
          display: grid;
          grid-template-columns: 1fr 1.5fr;
          gap: clamp(2rem, 5vw, 5rem);
          align-items: start;
        }
        @media (max-width: 880px) {
          .ladder {
            grid-template-columns: 1fr;
          }
          .ladder__panel {
            display: none;
          }
          .ladder :global(.ladder__who) {
            display: block !important;
          }
        }
      `}</style>
    </div>
  );
}
