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
    "WRKN GRP is a working group, not a full-service agency: strategy leads, execution follows, without exception. Built with the cultural fluency of Lagos and the rigour a global brand demands.",
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
              Ambitious brands consistently win on product and lose on meaning. They build genuinely
              useful things, then never build the identity, trust, and cultural weight that would make
              them irreplaceable. Most agencies are execution shops with no argument underneath. Most
              global consultancies have the argument but no feel for how belief is actually earned on
              the ground.
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
            WRKN GRP&rsquo;s strategic edge is earned inside one of Africa&rsquo;s most significant
            fintech brands: leading campaigns, managing brand equity under real growth pressure, and
            learning what it takes to keep a brand resonant in a market as demanding as Lagos, and
            credible in the international rooms where capital gets decided.
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
            <Stat value={10} suffix="+" label="Years in the Craft" />
            <Stat value={6} label="Disciplines" />
          </div>
          <p style={{ marginTop: "2.5rem", opacity: 0.65, maxWidth: "44ch" }}>
            WRKN GRP is two years old, built on more than a decade in the craft.
          </p>
        </div>
      </CreamSection>
    </>
  );
}
