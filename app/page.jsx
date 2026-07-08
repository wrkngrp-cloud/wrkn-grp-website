import Link from "next/link";
import Hero from "../components/Hero";
import AssemblySequence from "../components/AssemblySequence";
import CreamSection from "../components/CreamSection";
import SectionDivider from "../components/SectionDivider";
import SplitText from "../components/SplitText";
import Reveal from "../components/Reveal";
import Stat from "../components/Stat";
import Marquee from "../components/Marquee";
import WorkRail from "../components/WorkRail";
import WorkCard from "../components/WorkCard";
import Magnetic from "../components/Magnetic";
import GlowBlob from "../components/GlowBlob";
import CursorField from "../components/CursorField";
import HomeLadder from "../components/HomeLadder";

export const metadata = {
  title: "WRKN GRP — Led by Strategy. Built in Culture.",
  description:
    "The strategic creative partner for challenger brands building in Africa. We help founders and CMOs move from having a product to having a point of view, from being seen, to being remembered.",
};

export default function HomePage() {
  return (
    <>
      <Hero />

      <AssemblySequence />

      {/* The Gap */}
      <CreamSection style={{ padding: "6rem 0 7rem" }}>
        <SectionDivider numeral="01" title="The Gap." label="01 — Why We Exist" right="WRKN GRP" />
        <div className="container" style={{ display: "flex", flexWrap: "wrap", gap: "3rem", justifyContent: "space-between" }}>
          <Reveal>
            <p className="lede" style={{ maxWidth: "42rem" }}>
              Most African challenger brands win on product and lose on brand. They build something
              genuinely useful, then never build the identity or cultural resonance that would make
              them irreplaceable. WRKN GRP exists in that gap.
            </p>
          </Reveal>
          <Reveal delay={0.15}>
            <Link href="/about" className="link-draw small-caps" style={{ alignSelf: "flex-end" }}>
              Why We Exist →
            </Link>
          </Reveal>
        </div>
      </CreamSection>

      {/* Two Arms, One Standard */}
      <section className="theme-dark" style={{ padding: "6rem 0 7rem", position: "relative", overflow: "hidden" }}>
        <GlowBlob intensity={0.08} size={560} />
        <SectionDivider numeral="02" title="Two Arms. One Standard." label="02 — The Structure" right="Strategy → Execution" />
        <div className="container">
          <div className="arms-grid">
            <Reveal>
              <div style={{ border: "1px solid var(--cream-faint)", borderTop: "2px solid var(--gold)", padding: "2.5rem", height: "100%" }}>
                <span className="eyebrow">The Strategy Arm</span>
                <h3 className="display display-sm" style={{ margin: "1.2rem 0" }}>
                  Writes the brief.
                </h3>
                <p style={{ opacity: 0.78 }}>
                  Brand strategy, positioning, campaign strategy, cultural intelligence, Fractional CMO.
                </p>
              </div>
            </Reveal>
            <Reveal delay={0.15}>
              <div style={{ border: "1px solid var(--cream-faint)", padding: "2.5rem", height: "100%" }}>
                <span className="eyebrow" style={{ color: "var(--cream)", opacity: 0.7 }}>
                  The Creative Execution Arm
                </span>
                <h3 className="display display-sm" style={{ margin: "1.2rem 0" }}>
                  Brings it to life.
                </h3>
                <p style={{ opacity: 0.78 }}>
                  Brand identity, visual direction, campaign creative, motion, digital design.
                </p>
              </div>
            </Reveal>
          </div>
          <Reveal delay={0.25}>
            <p className="small-caps" style={{ marginTop: "2.2rem", opacity: 0.6 }}>
              Strategy writes the brief. Execution never runs ahead of it.
            </p>
          </Reveal>
        </div>
      </section>

      {/* Stats band */}
      <section className="theme-dark container" style={{ paddingBottom: "6rem" }}>
        <div className="wayfinding wayfinding--bottom" style={{ marginBottom: "3.5rem" }}>
          <span>The Record</span>
          <span>Honest Numbers Only</span>
        </div>
        <div className="stats-grid">
          <Stat value={16} suffix="+" label="Projects Delivered" />
          <Stat value={2} label="Years as WRKN GRP" />
          <Stat value={4} label="Disciplines" />
        </div>
        <p style={{ marginTop: "2.5rem", opacity: 0.6, maxWidth: "40ch" }}>
          Two years as WRKN GRP. Four years of the practice that built it. Strategy, Brand Identity,
          Motion, Print &amp; Editorial.
        </p>
      </section>

      <Marquee
        items={[
          "Positioning",
          "Narrative Architecture",
          "Cultural Intelligence",
          "Campaign Strategy",
          "Brand Identity",
          "Motion",
        ]}
      />

      {/* Selected Work */}
      <section className="theme-dark" style={{ padding: "5rem 0 6rem" }}>
        <SectionDivider numeral="03" title="Selected Work." label="03 — The Work" right="Drag to Explore" />
        <WorkRail>
          <div className="rail-card">
            <WorkCard
              href="/work/nyla"
              client="Nyla"
              title="Creative Advisory for a Digital Bank's Most Important Year"
              tags={["Creative Direction", "Motion", "Social", "Events"]}
              stat="40% uptake"
              statNote="in brand association and positioning within the ethical finance space."
              coverLabel="Nyla campaign visual — cover"
            />
          </div>
          <div className="rail-card">
            <WorkCard
              href="/work/aliko-dangote-foundation"
              client="Aliko Dangote Foundation"
              title="A 25th Anniversary Campaign for a Landmark Institution"
              tags={["Print", "Editorial", "Institutional"]}
              stat="100+ investors"
              statNote="reached at a single institutional fundraising event in New York."
              coverLabel="ADF anniversary brochure — cover"
            />
          </div>
          <div className="rail-card rail-card--cta">
            <Link
              href="/work"
              data-cursor="Explore"
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                height: "30rem",
                border: "1px dashed var(--cream-faint)",
                borderRadius: 6,
              }}
            >
              <span className="display display-sm">All Work →</span>
            </Link>
          </div>
        </WorkRail>
      </section>

      {/* Services — the ladder as a pinned 3D climb */}
      <HomeLadder />

      {/* Closing CTA */}
      <section className="theme-dark" style={{ padding: "9rem 0", position: "relative", overflow: "hidden", textAlign: "center" }}>
        <CursorField tone="dark" opacity={0.7} />
        <GlowBlob intensity={0.12} size={640} />
        <div className="container" style={{ position: "relative", zIndex: 1 }}>
          <SplitText as="h2" className="display display-lg" style={{ maxWidth: "16ch", margin: "0 auto" }}>
            Ready to move from being seen to being remembered?
          </SplitText>
          <div style={{ marginTop: "3rem", display: "flex", flexDirection: "column", alignItems: "center", gap: "1.6rem" }}>
            <Magnetic>
              <a href="mailto:emmanuel@wrkngrp.com" className="btn btn--gold">
                Get In Touch
              </a>
            </Magnetic>
            <p className="small-caps" style={{ opacity: 0.55 }}>
              Or find us on Instagram{" "}
              <a href="https://instagram.com/wrkngrp" target="_blank" rel="noopener noreferrer" className="link-draw">
                @wrkngrp
              </a>
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
