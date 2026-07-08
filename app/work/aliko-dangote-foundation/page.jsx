import CaseStudy from "../../../components/CaseStudy";

export const metadata = {
  title: "Aliko Dangote Foundation — Case Study",
  description:
    "A 25th anniversary print and editorial campaign built to celebrate a quarter-century of impact and win a room of institutional investors in New York.",
};

export default function ADFPage() {
  return (
    <CaseStudy
      numeral="02"
      client="Aliko Dangote Foundation"
      headline="Built for the room it needed to win."
      discipline="Print & Editorial · Institutional Communications"
      year="25th Anniversary Campaign"
      coverLabel="ADF anniversary brochure — mockup at an angle, full-bleed cover"
      panels={[
        {
          kicker: "The Brief",
          heading: "Two jobs at once.",
          body: [
            "To mark the Foundation's 25th anniversary, the brief was to create print materials that could do two things at once: celebrate a quarter-century of impact, and reposition the Foundation for relevance with a new audience, high-net-worth individuals in New York, at a moment when a fundraising push depended on it.",
          ],
        },
        {
          kicker: "What We Did",
          heading: "Institutional weight, no stiffness.",
          body: [
            "We designed the anniversary corporate materials and investor relations brochure from the ground up.",
            "Every page had to carry institutional weight without feeling stiff, built for a room full of people deciding whether to write a check.",
          ],
        },
        {
          kicker: "The Result",
          heading: "The room it was built for.",
          body: [
            "The brochure was used at an event reaching over 100 institutional investors, part of a broader fundraising push for the Foundation's next chapter.",
          ],
        },
      ]}
      resultStat="100+ institutional investors reached."
      resultNote="The brochure anchored an event in New York, part of a broader fundraising push for the Foundation's next chapter."
      gallery={[
        "ADF brochure spread — mockup on surface",
        "ADF brochure — in-hand mockup",
        "ADF anniversary materials — angled spread mockup",
      ]}
      next={{ href: "/work/nyla", label: "Nyla →" }}
    />
  );
}
