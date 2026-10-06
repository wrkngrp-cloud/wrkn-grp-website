import Link from "next/link";
import Hero from "../components/Hero";
import AssemblySequence from "../components/AssemblySequence";
import CreamSection from "../components/CreamSection";
import SectionDivider from "../components/SectionDivider";
import SplitText from "../components/SplitText";
import Reveal from "../components/Reveal";
import Stat from "../components/Stat";
import Marquee from "../components/Marquee";
import Magnetic from "../components/Magnetic";
import GlowBlob from "../components/GlowBlob";
import CursorField from "../components/CursorField";
import HomeLadder from "../components/HomeLadder";

export const metadata = {
  title: "WRKN GRP — Led by Strategy. Built in Culture.",
  description:
    "A strategy-led creative partner for brands with global ambition. We move founders and CMOs from having a product to having a point of view, and from being seen to being remembered.",
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
              The best brands are rarely the ones with the best product. They are the ones people
              believe in. Most companies build something genuinely useful, then stop short of the
              meaning and cultural weight that would make them impossible to replace. WRKN GRP lives
              in that gap, and closes it.
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
              <div className="arm arm--lead">
                <span className="eyebrow">The Strategy Arm</span>
                <h3 className="display display-sm" style={{ margin: "1.2rem 0 1rem" }}>
                  Decides how you win.
                </h3>
                <p style={{ opacity: 0.78, maxWidth: "42ch" }}>
                  Strategy is the reason and the route: why you deserve attention, who you are really
                  up against, and the sharpest way through. It is the thinking that tells the rest of
                  the work what to do, and why. Nothing gets made until it is settled.
                </p>
                <dl className="arm-list">
                  <div className="arm-list__row">
                    <dt>Brand Strategy</dt>
                    <dd>The core argument: what you stand for, and why it matters now.</dd>
                  </div>
                  <div className="arm-list__row">
                    <dt>Positioning</dt>
                    <dd>The space you own in the category, and the language that defends it.</dd>
                  </div>
                  <div className="arm-list__row">
                    <dt>Campaign Strategy</dt>
                    <dd>How one idea travels a whole season without losing its edge.</dd>
                  </div>
                  <div className="arm-list__row">
                    <dt>Cultural Intelligence</dt>
                    <dd>Reading Lagos and the wider market so the work lands in context, not a vacuum.</dd>
                  </div>
                  <div className="arm-list__row">
                    <dt>Fractional CMO</dt>
                    <dd>Senior marketing leadership inside your team, owning the outcome.</dd>
                  </div>
                </dl>
              </div>
            </Reveal>
            <Reveal delay={0.15}>
              <div className="arm">
                <span className="eyebrow" style={{ color: "var(--cream)", opacity: 0.7 }}>
                  The Creative Execution Arm
                </span>
                <h3 className="display display-sm" style={{ margin: "1.2rem 0 1rem" }}>
                  Makes it undeniable.
                </h3>
                <p style={{ opacity: 0.78, maxWidth: "42ch" }}>
                  A strategy nobody sees stays a theory. This is where the argument becomes an
                  identity, a film, a product: the work people actually meet, remember, and act on.
                </p>
                <dl className="arm-list">
                  <div className="arm-list__row">
                    <dt>Brand Identity</dt>
                    <dd>The system of marks, type and colour that keeps you recognisable everywhere.</dd>
                  </div>
                  <div className="arm-list__row">
                    <dt>Visual Direction</dt>
                    <dd>The look and feel that carries the idea across every surface.</dd>
                  </div>
                  <div className="arm-list__row">
                    <dt>Campaign Creative</dt>
                    <dd>The work that makes a season impossible to scroll past.</dd>
                  </div>
                  <div className="arm-list__row">
                    <dt>Motion</dt>
                    <dd>Film and movement that give the brand rhythm and presence.</dd>
                  </div>
                  <div className="arm-list__row">
                    <dt>Digital Design</dt>
                    <dd>The sites and products where the brand does its daily work.</dd>
                  </div>
                </dl>
              </div>
            </Reveal>
          </div>
          <Reveal delay={0.25}>
            <p className="small-caps" style={{ marginTop: "2.2rem", opacity: 0.62, maxWidth: "64ch" }}>
              One arm decides what is worth saying. The other makes sure it is worth remembering.
              Neither moves without the other.
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
          <Stat value={10} suffix="+" label="Years in the Craft" />
          <Stat value={6} label="Disciplines" />
        </div>
        <p style={{ marginTop: "2.5rem", opacity: 0.6, maxWidth: "48ch" }}>
          WRKN GRP is two years old, built on more than a decade in the craft. Six disciplines under
          two arms: strategy, brand identity, campaign, motion, digital, and print &amp; editorial.
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
