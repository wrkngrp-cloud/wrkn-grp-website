import DripDivider from "../../components/DripDivider";
import Reveal from "../../components/Reveal";
import ContactForm from "../../components/ContactForm";

export const metadata = {
  title: "Contact · Sweetness Studios",
  description:
    "Three doors. Come through the one that's yours. Brands, artists, everything else.",
};

const DOORS = [
  {
    title: "Brands.",
    copy: "A sonic identity, an audio strategy, a film score, a room that needs directing. Tell us what you want someone to feel, and we'll build the sound that does it.",
  },
  {
    title: "Artists.",
    copy: "Production, a feature on a Sweetness release, or a real conversation about being developed. Send the music. That's always the fastest way in.",
  },
  {
    title: "Everything else.",
    copy: "Booking, press, the thing that doesn't fit a box. Reach out anyway.",
  },
];

export default function Contact() {
  return (
    <main>
      <section className="section bg-glow" data-scene="doors-left" style={{ paddingTop: "clamp(8rem, 18vh, 12rem)" }}>
        <div className="container">
          <Reveal>
            <p className="kicker mb-1">Contact</p>
            <h1 className="display-2" style={{ maxWidth: "16ch" }}>
              Three doors. Come through the one that&rsquo;s yours.
            </h1>
          </Reveal>
        </div>
      </section>

      <DripDivider hotIndex={5} />

      <section className="section" data-scene="glow-left" style={{ paddingTop: 0 }}>
        <div className="container grid-2">
          <div className="stack-lg">
            {DOORS.map((d, i) => (
              <Reveal key={d.title} delay={i * 0.08}>
                <div>
                  <h2 className="display-4 mb-1">{d.title}</h2>
                  <p className="dim measure">{d.copy}</p>
                </div>
              </Reveal>
            ))}
            <Reveal>
              <hr className="hairline" />
              <p className="dim mt-2" style={{ fontSize: "0.95rem" }}>
                Or straight to the inbox:{" "}
                <a href="mailto:beatsbynuel@gmail.com">beatsbynuel@gmail.com</a>
              </p>
            </Reveal>
          </div>

          <Reveal delay={0.15}>
            <ContactForm />
          </Reveal>
        </div>
      </section>
    </main>
  );
}
