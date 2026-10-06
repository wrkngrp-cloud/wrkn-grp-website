import SectionDivider from "../../components/SectionDivider";
import Reveal from "../../components/Reveal";
import WorkCard from "../../components/WorkCard";
import Marquee from "../../components/Marquee";

export const metadata = {
  title: "The Work",
  description:
    "A deliberately small, high-stakes body of work. Case studies for Nyla and the Aliko Dangote Foundation, where every result is measured, not claimed.",
};

export default function WorkPage() {
  return (
    <>
      <section className="theme-dark" style={{ paddingTop: "7rem", paddingBottom: "3rem" }}>
        <SectionDivider numeral="W" title="The Work." label="Index" right="Two Case Studies" />
        <div className="container">
          <p className="lede" style={{ maxWidth: "42rem", opacity: 0.8 }}>
            A deliberately small, high-stakes body of work. Every project here is real, and every
            result is measured, not claimed.
          </p>
        </div>
      </section>

      <section className="theme-dark container" style={{ paddingBottom: "6rem" }}>
        <div className="gallery-grid">
          <Reveal>
            <WorkCard
              href="/work/nyla"
              client="Nyla"
              title="Keeping a digital bank's brand disciplined through its most important year."
              tags={["Creative Direction", "Motion", "Social", "Events"]}
              stat="40% uptake"
              statNote="in brand association and positioning within the ethical finance space."
              coverLabel="Nyla campaign visual — cover"
              height="32rem"
            />
          </Reveal>
          <Reveal delay={0.12}>
            <WorkCard
              href="/work/aliko-dangote-foundation"
              client="Aliko Dangote Foundation"
              title="A 25th anniversary campaign built for the room it needed to win."
              tags={["Print", "Editorial", "Institutional"]}
              stat="100+ investors"
              statNote="reached at a single institutional fundraising event in New York."
              coverLabel="ADF anniversary brochure — cover"
              height="32rem"
            />
          </Reveal>
        </div>
      </section>

      <Marquee items={["Real Work Only", "No Invented Clients", "No Borrowed Stats", "Strategy First"]} speed={34} />
    </>
  );
}
