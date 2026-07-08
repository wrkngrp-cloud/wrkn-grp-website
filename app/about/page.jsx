import SectionDivider from "../../components/SectionDivider";
import SplitText from "../../components/SplitText";
import Reveal from "../../components/Reveal";
import CreamSection from "../../components/CreamSection";
import Stat from "../../components/Stat";
import Marquee from "../../components/Marquee";
import GlowBlob from "../../components/GlowBlob";

export const metadata = {
  title: "Why We Exist",
  description:
    "African challenger brands win on product and lose on brand. WRKN GRP exists in that gap: a working group built on the conviction that strategy leads and execution follows.",
};

const CLIENT_FIT = [
  "Founders who want a strategic thinking partner, not just deliverables",
  "New brands building from scratch who want to get it right from the start",
  "Brands willing to be challenged on their assumptions",
  "African tech companies going regional or international",
  "International brands entering West Africa who need genuine cultural translation",
  "Venture studios and VC firms who want a brand strategy partner embedded in their portfolio",
];

const VALUES = [
  {
    n: "01",
    title: "Thinking First",
    body: "Every deliverable is downstream of genuine strategic work. No creative output without a brief. No brief accepted without interrogating it.",
  },
  {
    n: "02",
    title: "Cultural Intelligence",
    body: "Not outsiders interpreting Africa. Embedded in the market, operating across multiple cultural registers, maintained through deliberate daily practice, not assembled from reports.",
  },
  {
    n: "03",
    title: "Challenger Bias",
    body: "Built for brands that are fighting, not coasting. Methods designed for less budget, less history, more agility than the brands they're trying to displace.",
  },
  {
    n: "04",
    title: "Long-Term Partnership",
    body: "Brand building takes years. The best work happens in year two and three of a relationship, once we understand a brand deeply enough to challenge it truthfully.",
  },
  {
    n: "05",
    title: "Strategic Rigour",
    body: "Every recommendation is evidence-based. Every framework tested against real market conditions. Opinions are never presented as strategy.",
  },
];

export default function AboutPage() {
  return (
    <>
      <section className="theme-dark" style={{ paddingTop: "7rem", position: "relative", overflow: "hidden" }}>
        <GlowBlob intensity={0.1} size={620} />
        <SectionDivider numeral="A" title="Why We Exist." label="About" right="A Working Group" />
        <div className="container" style={{ paddingBottom: "5rem", position: "relative", zIndex: 1 }}>
          <Reveal>
            <p className="lede" style={{ maxWidth: "44rem" }}>
              African challenger brands consistently win on product and lose on brand. They build
              genuinely useful things and never build the identity, trust, and cultural resonance that
              would make them irreplaceable. Most brand agencies in Lagos are execution shops. Most
              global consultancies lack the cultural fluency to make strategy land here.
            </p>
          </Reveal>
          <Reveal delay={0.12}>
            <p style={{ maxWidth: "56ch", marginTop: "2rem", opacity: 0.8 }}>
              WRKN GRP exists in that gap. We&rsquo;re a working group, not a full-service agency: a
              focused unit built around the conviction that strategy leads and execution follows, in
              that order, without exception.
            </p>
          </Reveal>
          <Reveal delay={0.2}>
            <p style={{ maxWidth: "56ch", marginTop: "1.4rem", opacity: 0.8 }}>
              We work with founders who want a thinking partner, not just deliverables. Brands willing
              to be challenged on their assumptions. New brands building from scratch who want to get
              it right from the start. African tech companies going regional or international.
              International brands entering West Africa who need genuine cultural translation, not a
              Silicon Valley playbook with the names changed.
            </p>
          </Reveal>
        </div>
      </section>

      {/* Who We Work With */}
      <CreamSection style={{ padding: "6rem 0" }}>
        <SectionDivider numeral="02" title="Who We Work With." label="Fit" right="Brand-Fit Criteria" />
        <div className="container">
          <ul style={{ listStyle: "none", maxWidth: "52rem" }}>
            {CLIENT_FIT.map((item, i) => (
              <Reveal key={i} delay={i * 0.05}>
                <li
                  style={{
                    display: "flex",
                    gap: "1.6rem",
                    alignItems: "baseline",
                    padding: "1.4rem 0",
                    borderBottom: "1px solid var(--black-faint)",
                  }}
                >
                  <span className="display" style={{ fontStyle: "italic", color: "#b8960f", minWidth: "2.4rem" }}>
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="display" style={{ fontSize: "clamp(1.1rem, 2.4vw, 1.6rem)" }}>
                    {item}
                  </span>
                </li>
              </Reveal>
            ))}
          </ul>
        </div>
      </CreamSection>

      {/* Values */}
      <section className="theme-dark" style={{ padding: "6rem 0" }}>
        <SectionDivider numeral="05" title="What We Hold To." label="Values" right="Five, Not Fifteen" />
        <div className="container">
          {VALUES.map((v, i) => (
            <Reveal key={v.n} delay={i * 0.05}>
              <div className="method-row">
                <span className="display" style={{ fontSize: "clamp(2rem, 5vw, 3.4rem)", fontStyle: "italic", color: "var(--gold)" }}>
                  {v.n}
                </span>
                <div>
                  <h3 className="display display-sm" style={{ marginBottom: "0.9rem" }}>
                    {v.title}
                  </h3>
                  <p style={{ maxWidth: "60ch", opacity: 0.78 }}>{v.body}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <Marquee items={["Thinking First", "Cultural Intelligence", "Challenger Bias", "Long-Term Partnership", "Strategic Rigour"]} />

      {/* Authority statement */}
      <section className="theme-dark container" style={{ padding: "6rem var(--gutter)" }}>
        <SplitText as="blockquote" className="display display-md" style={{ maxWidth: "26ch" }}>
          Earned, not theoretical.
        </SplitText>
        <Reveal delay={0.15}>
          <p className="lede" style={{ maxWidth: "48rem", marginTop: "2rem", opacity: 0.8 }}>
            WRKN GRP&rsquo;s strategic edge comes from direct experience inside one of Africa&rsquo;s
            most significant fintech brands, leading campaigns, managing brand equity under real
            growth pressure, and understanding what it actually takes to keep a brand resonant in a
            market as culturally dynamic as Lagos.
          </p>
        </Reveal>
      </section>

      {/* Stats band */}
      <CreamSection style={{ padding: "5rem 0 6rem" }}>
        <div className="container">
          <div className="wayfinding wayfinding--bottom" style={{ marginBottom: "3rem" }}>
            <span>The Record</span>
            <span>Honest Numbers Only</span>
          </div>
          <div className="stats-grid">
            <Stat value={16} suffix="+" label="Projects Delivered" />
            <Stat value={2} label="Years as WRKN GRP" />
            <Stat value={4} label="Disciplines" />
          </div>
          <p style={{ marginTop: "2.5rem", opacity: 0.65, maxWidth: "40ch" }}>
            Two years as WRKN GRP. Four years of the practice that built it.
          </p>
        </div>
      </CreamSection>
    </>
  );
}
