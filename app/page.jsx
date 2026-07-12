import Link from "next/link";
import Hero3D from "../components/Hero3D";
import CursorTrail from "../components/CursorTrail";
import DripDivider from "../components/DripDivider";
import Reveal from "../components/Reveal";
import Parallax from "../components/Parallax";
import AudioPlayer from "../components/AudioPlayer";
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
    copy: "Six years, 30-plus songs, artists whose stories the studio helped tell — and now, records of its own.",
    href: "/work/",
    link: "The work",
  },
  {
    num: "02",
    title: "A voice for brands.",
    copy: "Sound isn't decoration on a brand. It's the feeling that's left when the screen goes dark. The studio builds that feeling on purpose, with a reason behind every note.",
    href: "/what-we-do/",
    link: "What we do",
  },
  {
    num: "03",
    title: "The room.",
    copy: "Direction and arrangement for the night people remember — the live room, built with the same intention as the record.",
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
      <section className="section">
        <div className="container">
          <Reveal>
            <p className="kicker mb-1">Why this studio exists</p>
            <h2 className="display-2 mb-2" style={{ maxWidth: "20ch" }}>
              Every life has a soundtrack. This studio builds the songs that
              end up on it.
            </h2>
          </Reveal>
          <div className="grid-2">
            <div />
            <Reveal delay={0.1}>
              <p className="body-lg dim measure">
                The record that carried you through a year you don&rsquo;t
                talk about. The three seconds of sound that mean your bank
                before a single word is said. The chorus a room full of
                strangers sings like they rehearsed it together. None of that
                happens by accident. Somebody sat with a feeling until it
                became sound — patiently, deliberately, from the soul out.
                That is the entire job of this studio.
              </p>
            </Reveal>
          </div>
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
      <section className="section" style={{ background: "var(--lift)" }}>
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
                  Built with Kotrell as a feeling first — then it found its
                  screen, in <em>Ololade</em>.
                </p>
                <AudioPlayer title="Ready" sub="Kotrell · Ololade (Netflix)" />
              </article>
            </Reveal>
            <Reveal delay={0.1}>
              <article className="card" style={{ height: "100%" }}>
                <p className="kicker mb-1" style={{ fontSize: "0.62rem" }}>On Zikoko</p>
                <h3 className="display-4 mb-1">Safe</h3>
                <p className="dim mb-2" style={{ fontSize: "0.92rem" }}>
                  Produced to feel like somebody finally exhaling — it landed
                  in <em>My Body, God&rsquo;s Temple</em>.
                </p>
                <AudioPlayer title="Safe" sub="Kotrell · My Body, God's Temple (Zikoko)" />
              </article>
            </Reveal>
            <Reveal delay={0.2}>
              <article className="card" style={{ height: "100%" }}>
                <p className="kicker mb-1" style={{ fontSize: "0.62rem" }}>Sonic identity</p>
                <h3 className="display-4 mb-1">Kuda</h3>
                <p className="dim mb-2" style={{ fontSize: "0.92rem" }}>
                  Two sonic logos on traditional Nigerian instrumentation —
                  three seconds that say the brand&rsquo;s name without a word.
                </p>
                <AudioPlayer title="The Awakening" sub="Kuda · sonic logo" />
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
            <p className="kicker mb-2">The company the studio keeps</p>
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
              If it needs a sound, it needs someone who will ask what that
              sound should make a person feel — before anyone touches an
              instrument. That is where this studio starts. Every time.
            </p>
          </Reveal>
        </div>
      </section>
    </main>
  );
}
