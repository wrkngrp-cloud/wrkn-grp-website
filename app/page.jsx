import Link from "next/link";
import Hero3D from "../components/Hero3D";
import CursorTrail from "../components/CursorTrail";
import DripDivider from "../components/DripDivider";
import Reveal from "../components/Reveal";
import Parallax from "../components/Parallax";
import AudioPlayer from "../components/AudioPlayer";
import SoundWave from "../components/SoundWave";
import { PROOF } from "../lib/credits";

const PRINCIPLES = [
  {
    title: "Feel first. Arrange after.",
    copy: "Every record starts as a feeling before it becomes a file. The chords go looking for that feeling; the arrangement follows it home.",
  },
  {
    title: "The demo already knows.",
    copy: "A song arrives knowing what it wants to be. The craft is listening closely enough to let it — instead of forcing it to be something else.",
  },
  {
    title: "A reason behind every note.",
    copy: "From a full record to a three-second sonic logo, every instrument earns its place — chosen for a reason the studio can write down and defend.",
  },
  {
    title: "Chase the moment.",
    copy: "The tear that lands before the mind can explain it. When that happens in the room, the record is finished being arranged — whatever the session clock says.",
  },
];

const DOORS = [
  {
    num: "01",
    title: "Records.",
    copy: "Full projects, single records, and now records of the studio's own. Built slow and built true — each one made to become somebody's favourite song.",
    href: "/work/",
    link: "The work",
  },
  {
    num: "02",
    title: "A voice for brands.",
    copy: "Sound is the feeling that stays when the screen goes dark. The studio composes that feeling on purpose — a voice your audience knows in three seconds flat.",
    href: "/what-we-do/",
    link: "What we do",
  },
  {
    num: "03",
    title: "The room.",
    copy: "Arrangement and direction for live nights — the kind a crowd carries home and keeps.",
    href: "/work/#live",
    link: "Live direction",
  },
];

export default function Home() {
  return (
    <main>
      <CursorTrail />

      <Hero3D />

      <DripDivider hotIndex={3} />

      {/* Manifesto */}
      <section className="section bg-glow">
        <div className="container">
          <Reveal>
            <p className="kicker mb-1">Why Sweetness exists</p>
            <h2 className="display-2 mb-2" style={{ maxWidth: "18ch" }}>
              Every life has a soundtrack. We&rsquo;re here to write it.
            </h2>
          </Reveal>
          <div className="grid-2">
            <div />
            <Reveal delay={0.1}>
              <p className="body-lg dim measure">
                The song that holds you together on a night nobody knows
                about. The chorus a whole room sings like one voice. The
                three seconds of sound that feel like home before a word is
                said. None of it is an accident. Someone sat with a feeling
                until it became sound — patient, deliberate, soul first.
                That is the work. That is the whole point of Sweetness.
              </p>
            </Reveal>
          </div>
        </div>
      </section>

      {/* The sound, visible */}
      <section aria-hidden style={{ padding: "0 0 2rem" }}>
        <div className="container">
          <SoundWave height={170} />
        </div>
      </section>

      {/* Principles */}
      <section className="section" style={{ paddingTop: 0 }}>
        <div className="container">
          <Reveal>
            <hr className="hairline mb-3" />
            <p className="kicker mb-2">How the work gets made</p>
          </Reveal>
          <div className="principles-grid">
            {PRINCIPLES.map((pr, i) => (
              <Reveal key={pr.title} delay={i * 0.08}>
                <article className="card" style={{ height: "100%" }}>
                  <h3 className="display-4 mb-1" style={{ fontSize: "1.35rem" }}>
                    {pr.title}
                  </h3>
                  <p className="dim" style={{ fontSize: "0.92rem" }}>{pr.copy}</p>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Three doors */}
      <section className="section" style={{ paddingTop: 0 }}>
        <div className="container">
          <Reveal>
            <p className="kicker mb-1">Three doors in</p>
            <h2 className="display-2 mb-3" style={{ maxWidth: "16ch" }}>
              One craft. Three rooms it shows up in.
            </h2>
          </Reveal>

          <div className="doors-grid">
            {DOORS.map((d, i) => (
              <Reveal key={d.num} delay={i * 0.12}>
                <Link href={d.href} style={{ color: "inherit", display: "block", height: "100%" }}>
                  <article className="card" style={{ height: "100%" }} data-cursor="Enter">
                    <div className="door-num">{d.num}</div>
                    <h3 className="display-4 mb-1">{d.title}</h3>
                    <p className="dim" style={{ fontSize: "0.98rem" }}>{d.copy}</p>
                    <span className="text-link mt-2" style={{ display: "inline-flex" }}>
                      {d.link} →
                    </span>
                  </article>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <DripDivider flip />

      {/* Selected work */}
      <section className="section bg-shafts" style={{ background: "var(--lift)" }}>
        <div className="container">
          <Reveal>
            <p className="kicker mb-1">Selected work</p>
            <h2 className="display-3 mb-3" style={{ maxWidth: "24ch" }}>
              Songs that found their moment. Sound that says who you are.
            </h2>
          </Reveal>

          <div className="doors-grid">
            <Reveal>
              <article className="card" style={{ height: "100%" }}>
                <p className="kicker mb-1" style={{ fontSize: "0.62rem" }}>On Netflix</p>
                <h3 className="display-4 mb-1">Ready</h3>
                <p className="dim mb-2" style={{ fontSize: "0.92rem" }}>
                  Written as a feeling first. The screen came looking for it —
                  it landed in <em>Ololade</em>.
                </p>
                <AudioPlayer title="Ready" sub="Featured in Ololade (Netflix)" />
              </article>
            </Reveal>
            <Reveal delay={0.1}>
              <article className="card" style={{ height: "100%" }}>
                <p className="kicker mb-1" style={{ fontSize: "0.62rem" }}>On Zikoko</p>
                <h3 className="display-4 mb-1">Safe</h3>
                <p className="dim mb-2" style={{ fontSize: "0.92rem" }}>
                  Made to sound like an exhale — like finally being held. It
                  found its film in <em>My Body, God&rsquo;s Temple</em>.
                </p>
                <AudioPlayer title="Safe" sub="Featured in My Body, God's Temple (Zikoko)" />
              </article>
            </Reveal>
            <Reveal delay={0.2}>
              <article className="card" style={{ height: "100%" }}>
                <p className="kicker mb-1" style={{ fontSize: "0.62rem" }}>The studio&rsquo;s own</p>
                <h3 className="display-4 mb-1">Sweetness Vol 1</h3>
                <p className="dim mb-2" style={{ fontSize: "0.92rem" }}>
                  An EP around the three things every Sweetness record returns
                  to — Life, Love, God.
                </p>
                <AudioPlayer title="Sweetness Vol 1" sub="EP · Life, Love, God" />
              </article>
            </Reveal>
          </div>

          <Reveal>
            <div className="mt-3">
              <Link href="/work/" className="text-link">
                All the work →
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Proof strip */}
      <section className="section">
        <div className="container">
          <Reveal>
            <p className="kicker mb-2">The company the sound keeps</p>
          </Reveal>
          <Parallax amount={26}>
            <div className="proof-strip">
              {PROOF.map((p) => (
                <span className="proof-item" key={p.name}>
                  {p.name}
                  {p.sub && <small>{p.sub}</small>}
                </span>
              ))}
            </div>
          </Parallax>
        </div>
      </section>

      {/* Closing */}
      <section className="section" style={{ paddingTop: 0 }}>
        <div className="container">
          <Reveal>
            <p
              className="pull-quote"
              style={{ maxWidth: "34ch", marginInline: "auto" }}
            >
              Before anyone touches an instrument, one question gets asked:
              what should this make a person feel? Everything Sweetness makes
              starts there. Every time.
            </p>
          </Reveal>
        </div>
      </section>
    </main>
  );
}
