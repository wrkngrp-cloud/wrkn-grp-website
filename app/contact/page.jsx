import SectionDivider from "../../components/SectionDivider";
import Reveal from "../../components/Reveal";
import ContactForm from "../../components/ContactForm";
import GlowBlob from "../../components/GlowBlob";
import CursorField from "../../components/CursorField";

export const metadata = {
  title: "Start a Conversation",
  description:
    "Ready to move from being seen to being remembered? Tell us what you're building. Reach WRKN GRP at emmanuel@wrkngrp.com or on Instagram @wrkngrp.",
};

export default function ContactPage() {
  return (
    <section className="theme-dark" style={{ paddingTop: "7rem", paddingBottom: "6rem", position: "relative", overflow: "hidden" }}>
      <CursorField tone="dark" opacity={0.7} />
      <GlowBlob intensity={0.12} size={680} />
      <SectionDivider numeral="C" title="Start a Conversation." label="Contact" right="No Forms You Don't Need" />
      <div
        className="container"
        style={{
          position: "relative",
          zIndex: 1,
          display: "flex",
          flexWrap: "wrap",
          gap: "4rem",
          justifyContent: "space-between",
        }}
      >
        <div style={{ maxWidth: "26rem", display: "flex", flexDirection: "column", gap: "2.4rem" }}>
          <Reveal>
            <p className="lede" style={{ opacity: 0.85 }}>
              Ready to move from being seen to being remembered? Tell us what you&rsquo;re building,
              and where you want it to matter.
            </p>
          </Reveal>
          <Reveal delay={0.1}>
            <div>
              <p className="small-caps" style={{ opacity: 0.55, marginBottom: "0.6rem" }}>
                Email
              </p>
              <a href="mailto:emmanuel@wrkngrp.com" className="link-draw display" style={{ fontSize: "clamp(1.1rem, 2.4vw, 1.6rem)" }}>
                emmanuel@wrkngrp.com
              </a>
            </div>
          </Reveal>
          <Reveal delay={0.18}>
            <div>
              <p className="small-caps" style={{ opacity: 0.55, marginBottom: "0.6rem" }}>
                Instagram
              </p>
              <a
                href="https://instagram.com/wrkngrp"
                target="_blank"
                rel="noopener noreferrer"
                className="link-draw display"
                style={{ fontSize: "clamp(1.1rem, 2.4vw, 1.6rem)" }}
              >
                @wrkngrp
              </a>
            </div>
          </Reveal>
        </div>

        <Reveal delay={0.15} style={{ flex: "1 1 24rem" }}>
          <ContactForm />
        </Reveal>
      </div>
    </section>
  );
}
