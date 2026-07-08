"use client";

import { motion, useReducedMotion } from "framer-motion";

/*
 * Case-study spine: the cover visual pins while narrative panels
 * (The Brief / What We Did / The Result) scroll past and cross-fade.
 */
export default function StickyPanels({ visual, panels }) {
  const reduced = useReducedMotion();

  return (
    <div className="sticky-panels container" style={{ paddingTop: "3rem", paddingBottom: "5rem" }}>
      <div className="sticky-panels__grid">
        <div className="sticky-panels__visual">
          <div style={{ position: "sticky", top: "14vh" }}>{visual}</div>
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          {panels.map((p, i) => (
            <motion.article
              key={i}
              initial={reduced ? false : { opacity: 0.12, y: 60 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ margin: "-30% 0px -30% 0px" }}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
              style={{
                minHeight: "72vh",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                gap: "1.4rem",
                paddingBottom: "2rem",
              }}
            >
              <span className="eyebrow">
                {String(i + 1).padStart(2, "0")} — {p.kicker}
              </span>
              <h2 className="display display-sm">{p.heading}</h2>
              {p.body.map((para, j) => (
                <p key={j} style={{ opacity: 0.82, maxWidth: "56ch" }}>
                  {para}
                </p>
              ))}
            </motion.article>
          ))}
        </div>
      </div>

      <style jsx>{`
        .sticky-panels__grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: clamp(2rem, 5vw, 5rem);
        }
        @media (max-width: 880px) {
          .sticky-panels__grid {
            grid-template-columns: 1fr;
          }
          .sticky-panels__visual {
            position: relative;
          }
        }
      `}</style>
    </div>
  );
}
