import Link from "next/link";
import FlipCard from "./FlipCard";

/*
 * Case-study card: front is the cover + client, back flips 180° to the
 * one-line result stat with the link through to the case study.
 * Front text sits on a scrim gradient so it stays legible over any
 * cover art that lands in the slot later.
 */
export default function WorkCard({ href, client, title, tags, stat, statNote, coverLabel, height = "30rem" }) {
  return (
    <FlipCard
      height={height}
      cursorLabel="View"
      front={
        <Link href={href} style={{ display: "block", height: "100%", position: "relative" }} aria-label={`${client} — view case study`}>
          <div className="img-slot" style={{ height: "100%", alignItems: "flex-start" }}>
            <span className="img-slot__label">{coverLabel}</span>
          </div>
          <div
            style={{
              position: "absolute",
              left: 0,
              right: 0,
              bottom: 0,
              padding: "5.5rem 1.6rem 1.6rem",
              display: "flex",
              flexDirection: "column",
              gap: "0.7rem",
              background: "linear-gradient(180deg, rgba(10,10,10,0) 0%, rgba(10,10,10,0.72) 42%, rgba(10,10,10,0.94) 100%)",
              borderRadius: "0 0 6px 6px",
            }}
          >
            <span className="display" style={{ fontSize: "clamp(1.8rem, 3.4vw, 2.6rem)", color: "var(--cream)", lineHeight: 1 }}>
              {client}
            </span>
            <span style={{ fontSize: "1.05rem", color: "var(--cream)", opacity: 0.95, maxWidth: "36ch", lineHeight: 1.45 }}>
              {title}
            </span>
            <span style={{ fontSize: "0.74rem", fontWeight: 600, letterSpacing: "0.18em", textTransform: "uppercase", color: "var(--gold)" }}>
              {tags.join(" · ")}
            </span>
          </div>
        </Link>
      }
      back={
        <Link
          href={href}
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "flex-start",
            gap: "1.2rem",
            height: "100%",
            background: "var(--black)",
            border: "1px solid rgba(239,200,53,0.4)",
            padding: "2.2rem",
          }}
        >
          <span className="eyebrow">The Result</span>
          <span className="display" style={{ fontSize: "clamp(2.2rem, 4vw, 3.2rem)", color: "var(--gold)", lineHeight: 1 }}>
            {stat}
          </span>
          <span style={{ fontSize: "1.08rem", color: "var(--cream)", opacity: 0.95, maxWidth: "34ch", lineHeight: 1.55 }}>
            {statNote}
          </span>
          <span className="link-draw small-caps" style={{ color: "var(--cream)", marginTop: "0.6rem" }}>
            View Case Study →
          </span>
        </Link>
      }
    />
  );
}
