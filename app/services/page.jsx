import Link from "next/link";
import SectionDivider from "../../components/SectionDivider";
import SplitText from "../../components/SplitText";
import Reveal from "../../components/Reveal";
import ServiceLadder from "../../components/ServiceLadder";
import CreamSection from "../../components/CreamSection";
import Marquee from "../../components/Marquee";
import Magnetic from "../../components/Magnetic";

export const metadata = {
  title: "What We Do",
  description:
    "The WRKN GRP service ladder, from a positioning workshop to Fractional CMO. Every service is a product, and each one leads to the next. Strategy first, always.",
};

const LADDER = [
  {
    step: "01",
    name: "Brand Positioning Workshop",
    blurb:
      "Entry point. A structured two-hour session that diagnoses a brand's positioning problem and clarifies what it stands for, who it's for, and what makes it irreplaceable.",
    who: "For founders who suspect their problem is positioning and want a diagnosis before committing to a bigger engagement.",
  },
  {
    step: "02",
    name: "Brand Strategy Sprint",
    blurb:
      "A focused multi-week intensive producing a complete brand strategy: positioning statement, narrative architecture, audience definition, messaging framework, creative direction principles.",
    who: "For pre-launch brands, or established brands undertaking a strategic rebrand.",
  },
  {
    step: "03",
    name: "Creative Advisory Retainer",
    blurb:
      "Ongoing monthly advisory: brand health reviews, messaging and campaign input, competitive intelligence, creative direction. Where the deepest work happens, over time, not in a sprint.",
    who: "For brands that want a thinking partner in the room every month, not a vendor at arm's length.",
  },
  {
    step: "04",
    name: "Campaign Strategy & Brand Initiatives",
    blurb:
      "360° campaign and initiative architecture across ATL and BTL, grounded in cultural intelligence. Strategic thinking that makes campaigns land, not media buying or content production.",
    who: "For brands that know their positioning and are ready to act from it.",
  },
  {
    step: "05",
    name: "Fractional CMO",
    blurb:
      "The top of the ladder. WRKN GRP serves as CMO: setting strategy, hiring and managing the team, owning the brand. Executive responsibility, not advisory.",
    who: "For scaling brands where marketing leadership is critical but a full-time hire is premature.",
  },
];

const METHOD = [
  {
    n: "01",
    title: "Diagnose Before You Prescribe",
    body: "Every engagement starts with a genuine diagnosis: what the brand claims, what the market experiences, what the data says, what competitors occupy. The real problem is almost never the one the client came in with.",
  },
  {
    n: "02",
    title: "Find the One True Thing",
    body: "Every strong brand is built on one insight so true and specific that no competitor can claim it. True, distinctive, strategically useful. One. Not seven.",
  },
  {
    n: "03",
    title: "Apply Cultural Intelligence",
    body: "The layer most strategy firms can't add. A strategy that works in San Francisco fails in Lagos if it doesn't account for how trust is built here, how aspiration is expressed here, which references land and which fall flat.",
  },
  {
    n: "04",
    title: "Build the Narrative Architecture",
    body: "Positioning statement, brand voice, messaging hierarchy, the principles that govern how a brand behaves at every touchpoint. Architecture before creativity. Architecture without creativity is dry. Creativity without architecture is noise.",
  },
  {
    n: "05",
    title: "Measure What Matters",
    body: "Brand strategy produces measurable outcomes: lower acquisition costs, higher retention, stronger pricing power, compounding recognition. Success metrics are defined before the work begins.",
  },
];

const STANDARD = [
  {
    title: "Strategy First",
    body: "Every piece of work has a reason for existing. Every creative choice traces back to positioning. If you can't explain why in brand terms, it isn't ready.",
  },
  {
    title: "Cultural Precision",
    body: "Work built for African audiences, not adapted for them. If something feels imported, it isn't done yet.",
  },
  {
    title: "Craft Without Compromise",
    body: "Every deliverable represents WRKN GRP. Technically sound but visually flat isn't acceptable.",
  },
  {
    title: "Consistency Across Touchpoints",
    body: "A brand has to feel like one thing everywhere. The parts have to add up to something coherent, not just individually impressive.",
  },
];

export default function ServicesPage() {
  return (
    <>
      <section className="theme-dark" style={{ paddingTop: "7rem" }}>
        <SectionDivider numeral="S" title="What We Do." label="Services" right="Strategy First, Always" />
        <div className="container" style={{ paddingBottom: "4rem" }}>
          <p className="lede" style={{ maxWidth: "40rem", opacity: 0.8 }}>
            Our services, offered as products. Each one leads to the next. Strategy first, always.
          </p>
          <Reveal delay={0.15}>
            <p style={{ maxWidth: "56ch", marginTop: "2rem", opacity: 0.7 }}>
              WRKN GRP operates through two arms. The Strategy Arm decides how you win: positioning,
              narrative architecture, campaign strategy, cultural intelligence, Fractional CMO work.
              The Creative Execution Arm makes it undeniable: brand identity, visual direction,
              campaign creative, motion, digital design. Execution never runs ahead of the thinking.
              That sequence is the whole point.
            </p>
          </Reveal>
        </div>
      </section>

      {/* The Ladder */}
      <section className="theme-dark container" style={{ paddingBottom: "7rem" }}>
        <div className="wayfinding wayfinding--bottom" style={{ marginBottom: "3.5rem" }}>
          <span>The Ladder</span>
          <span>Five Rungs — Each Leads to the Next</span>
        </div>
        <ServiceLadder items={LADDER} />
      </section>

      <Marquee items={["Diagnose", "One True Thing", "Cultural Intelligence", "Narrative Architecture", "Measure What Matters"]} />

      {/* How We Think */}
      <CreamSection style={{ padding: "6rem 0" }}>
        <SectionDivider numeral="05" title="How We Think." label="Methodology" right="Five Moves, In Order" />
        <div className="container">
          {METHOD.map((m, i) => (
            <Reveal key={m.n} delay={i * 0.05}>
              <div className="method-row">
                <span className="display" style={{ fontSize: "clamp(2rem, 5vw, 3.4rem)", fontStyle: "italic", color: "#b8960f" }}>
                  {m.n}
                </span>
                <div>
                  <h3 className="display display-sm" style={{ marginBottom: "0.9rem" }}>
                    {m.title}
                  </h3>
                  <p style={{ maxWidth: "60ch", opacity: 0.8 }}>{m.body}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </CreamSection>

      {/* The Standard */}
      <section className="theme-dark" style={{ padding: "6rem 0" }}>
        <SectionDivider numeral="04" title="The Standard." label="Quality" right="Non-Negotiable" />
        <div className="container">
          <div className="ladder-grid">
            {STANDARD.map((s, i) => (
              <Reveal key={s.title} delay={i * 0.08}>
                <div style={{ border: "1px solid var(--cream-faint)", padding: "2rem", height: "100%" }}>
                  <h3 className="display display-sm" style={{ fontSize: "1.4rem", marginBottom: "0.9rem", color: "var(--gold)" }}>
                    {s.title}
                  </h3>
                  <p style={{ fontSize: "0.95rem", opacity: 0.75 }}>{s.body}</p>
                </div>
              </Reveal>
            ))}
          </div>
          <div style={{ marginTop: "4rem", textAlign: "center" }}>
            <Magnetic>
              <Link href="/contact" className="btn btn--gold">
                Start a Conversation
              </Link>
            </Magnetic>
          </div>
        </div>
      </section>
    </>
  );
}
