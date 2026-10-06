import CaseStudy from "../../../components/CaseStudy";

export const metadata = {
  title: "Nyla — Case Study",
  description:
    "Creative advisory for a digital bank's most important year: illustration systems, social design, motion graphics and event branding held to one set of brand rules.",
};

export default function NylaPage() {
  return (
    <CaseStudy
      numeral="01"
      client="Nyla"
      headline="A digital bank's most important year."
      discipline="Creative Direction · Illustration · Social Design · Motion Graphics · Event Branding"
      year="Pre-Launch Push"
      coverLabel="Nyla campaign visual — full-bleed cover"
      panels={[
        {
          kicker: "The Brief",
          heading: "Correct, every time.",
          body: [
            "Nyla was preparing to launch and needed every piece of creative work, decks, illustrations, social content, motion graphics, and event branding, to stay disciplined to a single set of brand rules.",
            "Not just consistent. Correct, every time, across every touchpoint, in the run-up to a launch where the brand's first impression only happens once.",
          ],
        },
        {
          kicker: "What We Did",
          heading: "The full pre-launch push.",
          body: [
            "We handled the full creative execution across Nyla's pre-launch push. That meant illustration systems built to hold up across formats, social designs built for a finance brand trying to feel human, motion graphics for video content, and event branding that carried the same discipline into physical spaces.",
            "We also designed decks used in Nyla's fundraising conversations, though those decks stay private.",
          ],
        },
        {
          kicker: "The Result",
          heading: "Measured, not claimed.",
          body: [
            "The work contributed to a 40% uptake in brand association and positioning within the ethical finance space, alongside a measurable increase in engagement across social content.",
            "Decks we designed were used in raising over $250,000.",
          ],
        },
      ]}
      resultStat="40% uptake in brand association within ethical finance."
      resultNote="Alongside a measurable increase in engagement across social content. Decks we designed were used in raising over $250,000."
      gallery={[
        "Nyla campaign visual — illustration system frame",
        "Nyla campaign visual — social design set",
        "Nyla campaign visual — event branding in situ",
      ]}
      next={{ href: "/work/aliko-dangote-foundation", label: "Aliko Dangote Foundation →" }}
    />
  );
}
