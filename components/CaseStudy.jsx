import Link from "next/link";
import CaseCover from "./CaseCover";
import StickyPanels from "./StickyPanels";
import SplitText from "./SplitText";
import Reveal from "./Reveal";
import TiltCard from "./TiltCard";
import Marquee from "./Marquee";

/* Shared case-study scaffold: header, parallax cover, pinned narrative, gallery, next link. */
export default function CaseStudy({
  numeral,
  client,
  headline,
  discipline,
  year,
  panels,
  resultStat,
  resultNote,
  coverLabel,
  gallery,
  next,
}) {
  return (
    <>
      <section className="theme-dark" style={{ paddingTop: "7rem" }}>
        <div className="container">
          <div className="wayfinding">
            <span>Case Study {numeral}</span>
            <span>{year}</span>
          </div>
          <div style={{ padding: "3.5rem 0 2.5rem" }}>
            <p className="eyebrow" style={{ marginBottom: "1.2rem" }}>
              {client}
            </p>
            <SplitText as="h1" className="display display-lg" style={{ maxWidth: "20ch" }}>
              {headline}
            </SplitText>
            <p className="small-caps" style={{ marginTop: "2rem", opacity: 0.6 }}>
              {discipline}
            </p>
          </div>
        </div>
        <CaseCover label={coverLabel} />
      </section>

      <section className="theme-dark">
        <StickyPanels
          visual={
            <div>
              <div className="img-slot" style={{ aspectRatio: "4 / 5", width: "100%" }} role="img" aria-label={`${client} key visual`}>
                <span className="img-slot__label">{client} key visual — pinned</span>
              </div>
              <p className="small-caps" style={{ marginTop: "1rem", opacity: 0.5 }}>
                {client} — {year}
              </p>
            </div>
          }
          panels={panels}
        />
      </section>

      {/* Result banner */}
      <section className="theme-cream" style={{ padding: "6rem 0" }}>
        <div className="container">
          <div className="wayfinding wayfinding--bottom" style={{ marginBottom: "3rem" }}>
            <span>The Result</span>
            <span>{client}</span>
          </div>
          <SplitText as="p" className="display display-md" style={{ maxWidth: "22ch" }}>
            {resultStat}
          </SplitText>
          <Reveal delay={0.2}>
            <p className="lede" style={{ marginTop: "1.8rem", maxWidth: "48rem", opacity: 0.85 }}>
              {resultNote}
            </p>
          </Reveal>
        </div>
      </section>

      {/* Gallery */}
      <section className="theme-dark container" style={{ padding: "5rem var(--gutter) 6rem" }}>
        <div className="wayfinding wayfinding--bottom" style={{ marginBottom: "3rem" }}>
          <span>Selected Frames</span>
          <span>1200×1200 square crops</span>
        </div>
        <div className="gallery-grid">
          {gallery.map((label, i) => (
            <Reveal key={i} delay={i * 0.1}>
              <TiltCard>
                <div className="img-slot" style={{ aspectRatio: "1 / 1" }} role="img" aria-label={label}>
                  <span className="img-slot__label">{label}</span>
                </div>
              </TiltCard>
            </Reveal>
          ))}
        </div>
      </section>

      <Marquee items={[client, "Led by Strategy", "Built in Culture"]} speed={30} />

      {/* Next case study */}
      <section className="theme-dark container" style={{ padding: "6rem var(--gutter)" }}>
        <Link href={next.href} data-cursor="Next" style={{ display: "block" }}>
          <p className="small-caps" style={{ opacity: 0.55, marginBottom: "1rem" }}>
            Next Case Study
          </p>
          <SplitText as="span" className="display display-lg link-draw" style={{ display: "inline-block" }}>
            {next.label}
          </SplitText>
        </Link>
      </section>
    </>
  );
}
