import Link from "next/link";
import CursorTrail from "../components/CursorTrail";
import DripDivider from "../components/DripDivider";
import Reveal from "../components/Reveal";
import Parallax from "../components/Parallax";
import AudioPlayer from "../components/AudioPlayer";
import SoundWave from "../components/SoundWave";
import DawSession from "../components/DawSession";
import { PROOF } from "../lib/credits";

const PRINCIPLES = [
  {
    lane: "01 · Foundation",
    title: "Feel first. Arrange after.",
    copy: "Every record starts as a feeling before it becomes a file. The chords go looking for that feeling; the arrangement follows it home.",
  },
  {
    lane: "02 · Listening",
    title: "The demo already knows.",
    copy: "A song arrives knowing what it wants to be. The craft is listening closely enough to let it, instead of forcing it to be something else.",
  },
  {
    lane: "03 · Intention",
    title: "A reason behind every note.",
    copy: "From a full record to a three-second sonic logo, every instrument earns its place, chosen for a reason the studio can write down and defend.",
  },
  {
    lane: "04 · The take",
    title: "Chase the moment.",
    copy: "The tear that lands before the mind can explain it. When that happens in the room, the record is finished being arranged, whatever the session clock says.",
  },
];

const DOORS = [
  {
    num: "01",
    title: "Records.",
    copy: "Full projects, single records, and now records of the studio's own. Built slow and built true. Each one made to become somebody's favourite song.",
    href: "/work/",
    link: "The work",
  },
  {
    num: "02",
    title: "A voice for brands.",
    copy: "Sound is the feeling that stays when the screen goes dark. The studio composes that feeling on purpose. A voice your audience knows in three seconds flat.",
    href: "/what-we-do/",
    link: "What we do",
  },
  {
    num: "03",
    title: "The room.",
    copy: "Arrangement and direction for live nights. The kind a crowd carries home and keeps.",
    href: "/work/#live",
    link: "Live direction",
  },
];

export default function Home() {
  return (
    <main>
      <CursorTrail />

      <section data-scene="hero" style={{ position: "relative", minHeight: "165vh" }}>
        <div className="container hero-lead">
          <p className="kicker mb-1">Sweetness Studios</p>
          <h1 className="display-2" style={{ maxWidth: "22ch" }}>
            Some sounds are heard and forgotten. We make the ones that are
            felt, and remembered.
          </h1>
          <p className="body-lg dim measure mt-2">
            Music with soul at its core, written to become the soundtrack of
            somebody&rsquo;s life.
          </p>
          <div className="mt-2" style={{ display: "flex", gap: "1rem" }}>
            <Link href="/work/" className="btn">
              Hear the work
            </Link>
            <Link href="/contact/" className="text-link" style={{ alignSelf: "center" }}>
              Start something →
            </Link>
          </div>
          <div className="scroll-cue">Scroll · it melts</div>
        </div>
      </section>

      <DripDivider hotIndex={3} />

      {/* Manifesto */}
      <section className="section bg-glow" data-scene="glow-left">
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
                until it became sound. Patient, deliberate, soul first.
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

      {/* Principles as a session: tracks land one by one, like an
          arrangement coming together in the studio */}
      <section className="section" data-scene="peek" style={{ paddingTop: 0 }}>
        <div className="container">
          <Reveal>
            <hr className="hairline mb-3" />
            <p className="kicker mb-1">How the work gets made</p>
            <h2 className="display-3 mb-2" style={{ maxWidth: "22ch" }}>
              Four tracks in every session.
            </h2>
          </Reveal>
          <Reveal>
            <DawSession tracks={PRINCIPLES} />
          </Reveal>
        </div>
      </section>

      {/* Three doors */}
      <section className="section" data-scene="doors-left" style={{ paddingTop: 0 }}>
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
      <section className="section bg-shafts section-lift" data-scene="eq-left">
        <div className="container">
          <Reveal>
            <p className="kicker mb-1">Selected work</p>
            <h2 className="display-3 mb-3" style={{ maxWidth: "24ch" }}>
              Songs that found their moment. Sound that says who you are.
            </h2>
          </Reveal>

          <div className="principles-grid">
            <Reveal>
              <article className="card" style={{ height: "100%" }}>
                <p className="kicker mb-1" style={{ fontSize: "0.62rem" }}>Ric Hassani</p>
                <h3 className="display-4 mb-1">Ngozi</h3>
                <p className="dim mb-2" style={{ fontSize: "0.92rem" }}>
                  Co-produced for the Lagos Lover Boy world. A record that
                  sounds exactly like being chosen.
                </p>
                <AudioPlayer
                  title="Ngozi"
                  sub="Ric Hassani"
                  spotify="https://open.spotify.com/track/6YHRw6MptcrYWv7JYROGTk"
                />
              </article>
            </Reveal>
            <Reveal delay={0.08}>
              <article className="card" style={{ height: "100%" }}>
                <p className="kicker mb-1" style={{ fontSize: "0.62rem" }}>Kotrell</p>
                <h3 className="display-4 mb-1">Safe</h3>
                <p className="dim mb-2" style={{ fontSize: "0.92rem" }}>
                  Made to sound like an exhale, like finally being held. It
                  found its film in <em>My Body, God&rsquo;s Temple</em>.
                </p>
                <AudioPlayer
                  title="Safe"
                  sub="Kotrell · Zikoko"
                  spotify="https://open.spotify.com/track/6tPzBJptprIjA8hk4ir3rz"
                />
              </article>
            </Reveal>
            <Reveal delay={0.16}>
              <article className="card" style={{ height: "100%" }}>
                <p className="kicker mb-1" style={{ fontSize: "0.62rem" }}>Ric Hassani</p>
                <h3 className="display-4 mb-1">For You</h3>
                <p className="dim mb-2" style={{ fontSize: "0.92rem" }}>
                  The soft one. Built for the exact moment somebody realises
                  they mean it.
                </p>
                <AudioPlayer
                  title="For You"
                  sub="Ric Hassani"
                  spotify="https://open.spotify.com/search/Ric%20Hassani%20For%20You"
                />
              </article>
            </Reveal>
            <Reveal delay={0.24}>
              <article className="card" style={{ height: "100%" }}>
                <p className="kicker mb-1" style={{ fontSize: "0.62rem" }}>Kotrell</p>
                <h3 className="display-4 mb-1">Love Me Slow</h3>
                <p className="dim mb-2" style={{ fontSize: "0.92rem" }}>
                  Still healing, still willing. Tenderness at the tempo it
                  actually happens.
                </p>
                <AudioPlayer
                  title="Love Me Slow"
                  sub="Kotrell · Trelly Music"
                  spotify="https://open.spotify.com/search/Kotrell%20Love%20Me%20Slow"
                />
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
      <section className="section" data-scene="rings-center">
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
      <section className="section" data-scene="spots-center" style={{ paddingTop: 0 }}>
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
