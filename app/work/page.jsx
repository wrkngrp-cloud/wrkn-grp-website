import DripDivider from "../../components/DripDivider";
import Reveal from "../../components/Reveal";
import Parallax from "../../components/Parallax";
import AudioPlayer from "../../components/AudioPlayer";
import { TRACKS } from "../../lib/credits";

export const metadata = {
  title: "Work — Sweetness Studios",
  description:
    "Six years, one catalogue. Ric Hassani, Kotrell, Kuda, Ruger, Netflix, Zikoko — the real run of it.",
};

export default function Work() {
  return (
    <main>
      <section className="section" style={{ paddingTop: "clamp(8rem, 18vh, 12rem)" }}>
        <div className="container">
          <Reveal>
            <p className="kicker mb-1">Work</p>
            <h1 className="display-2" style={{ maxWidth: "20ch" }}>
              Six years. One catalogue. Nothing rounded up.
            </h1>
            <p className="body-lg dim mt-2">
              The real run of it — the records, the screens they found, the
              brands they voiced, the rooms they moved.
            </p>
          </Reveal>
        </div>
      </section>

      <DripDivider hotIndex={4} />

      {/* Artists */}
      <section className="section" style={{ paddingTop: 0 }}>
        <div className="container">
          <Reveal>
            <p className="kicker mb-2">Artists we&rsquo;ve produced</p>
          </Reveal>

          <Parallax amount={20}>
            <Reveal>
              <article className="work-block">
                <span className="section-num" style={{ fontSize: "clamp(3rem, 7vw, 6rem)" }}>A</span>
                <div>
                  <h2 className="display-3 mb-1">Ric Hassani</h2>
                  <p className="dim measure">
                    Co-produced across his Lagos Lover Boy world, including{" "}
                    <em>Intro (Lagos Lover Boy)</em>, <em>Canopy</em>,{" "}
                    <em>Ngozi</em>, <em>For You</em>, <em>Catch Cruise</em>,{" "}
                    <em>Ayiba</em>, <em>Holy Matrimony</em>, and more.
                  </p>
                </div>
              </article>
            </Reveal>
          </Parallax>

          <Parallax amount={20}>
            <Reveal>
              <article className="work-block">
                <span className="section-num" style={{ fontSize: "clamp(3rem, 7vw, 6rem)" }}>B</span>
                <div>
                  <h2 className="display-3 mb-1">Kotrell</h2>
                  <p className="dim measure">
                    Primary producer across <em>Ready</em>, <em>Safe</em>,{" "}
                    <em>Heavy</em>, <em>Home</em>, <em>Whole World</em>,{" "}
                    <em>Only You</em>, <em>Proud of You</em>, <em>Watch Me</em>,
                    and more. Six years of friendship as much as work — and
                    you can hear it in the records.
                  </p>
                </div>
              </article>
            </Reveal>
          </Parallax>

          <Reveal>
            <p className="dim measure mt-2">
              Feature and additional credits: <strong>Bayanni</strong> on{" "}
              <em>I.G.D.T (I Go Dey There)</em>, <strong>T-Classic</strong> and{" "}
              <strong>Andxion</strong> on <em>Friends</em>,{" "}
              <strong>DOTTi The Deity</strong> and <strong>Sage Baba</strong>{" "}
              on Ric Hassani records, and <strong>CillSoul</strong>,{" "}
              <strong>Flora Sparkle</strong>, <strong>ayomidetPh</strong>,{" "}
              <strong>Nyinée</strong>.
            </p>
          </Reveal>
        </div>
      </section>

      <DripDivider flip />

      {/* On screen */}
      <section className="section" style={{ background: "var(--lift)" }}>
        <div className="container">
          <Reveal>
            <p className="kicker mb-1">On screen</p>
            <h2 className="display-3 mb-2" style={{ maxWidth: "24ch" }}>
              Two records, built as feelings first, that ended up on screen.
            </h2>
          </Reveal>

          <div className="grid-2">
            <Reveal>
              <article className="card">
                <h3 className="display-4 mb-1">Ready</h3>
                <p className="dim mb-2" style={{ fontSize: "0.95rem" }}>
                  Kotrell — featured in <em>Ololade</em>, a series on Netflix.
                </p>
                <AudioPlayer title="Ready" sub="Kotrell · Ololade (Netflix)" />
              </article>
            </Reveal>
            <Reveal delay={0.1}>
              <article className="card">
                <h3 className="display-4 mb-1">Safe</h3>
                <p className="dim mb-2" style={{ fontSize: "0.95rem" }}>
                  Kotrell — featured in <em>My Body, God&rsquo;s Temple</em>,
                  on Zikoko&rsquo;s YouTube channel. Produced to feel like
                  security — like somebody finally exhaling. When Kotrell sent
                  back his first line, &ldquo;I feel safe here,&rdquo; it was
                  almost word for word what the production had been playing
                  toward. Alignment like that can&rsquo;t be forced. It can
                  only be recognised when it arrives.
                </p>
                <AudioPlayer title="Safe" sub="Kotrell · My Body, God's Temple (Zikoko)" />
              </article>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Sonic branding */}
      <section className="section">
        <div className="container grid-2">
          <Reveal>
            <p className="kicker mb-1">Sonic branding</p>
            <h2 className="display-3">Kuda</h2>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="dim measure">
              Two sonic logos, &ldquo;The Awakening&rdquo; and &ldquo;The
              Welcome,&rdquo; built on the More Life ethos and the
              brand&rsquo;s three principles: Pulse, Real, Strong Spirit.
              Every instrument, from the Kalimba to the shekere, was chosen
              for a reason the studio wrote down and can defend. Plus launch
              audio for a Snapchat Lens and jingle work for a Spotify ad.
            </p>
            <div className="mt-2" style={{ display: "grid", gap: "0.8rem" }}>
              <AudioPlayer title="The Awakening" sub="Kuda · sonic logo" />
              <AudioPlayer title="The Welcome" sub="Kuda · sonic logo" />
            </div>
          </Reveal>
        </div>
      </section>

      <DripDivider hotIndex={7} />

      {/* Live */}
      <section className="section" id="live" style={{ paddingTop: 0 }}>
        <div className="container">
          <Reveal>
            <p className="kicker mb-2" style={{ marginTop: "3rem" }}>Live direction</p>
          </Reveal>
          <div className="grid-2">
            <Reveal>
              <article className="card">
                <h3 className="display-4 mb-1">Ruger</h3>
                <p className="dim" style={{ fontSize: "0.98rem" }}>
                  Directed and arranged the music for his first-ever tour of
                  Europe and Canada.
                </p>
              </article>
            </Reveal>
            <Reveal delay={0.1}>
              <article className="card">
                <h3 className="display-4 mb-1">Kotyard</h3>
                <p className="dim" style={{ fontSize: "0.98rem" }}>
                  Music direction for the full live experience.
                </p>
              </article>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Full credits */}
      <section className="section" style={{ background: "var(--lift)" }}>
        <div className="container">
          <Reveal>
            <p className="kicker mb-1">The catalogue</p>
            <h2 className="display-3 mb-2">Full production credits</h2>
            <p className="dim mb-3" style={{ fontSize: "0.9rem" }}>
              From the Produced/Co-Produced by Nuel Beatz playlist. The stated
              catalogue is 30+.
            </p>
          </Reveal>
          <Reveal>
            <div style={{ overflowX: "auto" }}>
              <table className="credits-table">
                <thead>
                  <tr>
                    <th className="num">No.</th>
                    <th>Track</th>
                    <th>Artist(s)</th>
                  </tr>
                </thead>
                <tbody>
                  {TRACKS.map((t, i) => (
                    <tr key={`${t.track}-${i}`}>
                      <td className="num">{String(i + 1).padStart(2, "0")}</td>
                      <td>{t.track}</td>
                      <td>{t.artists}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Reveal>
        </div>
      </section>
    </main>
  );
}
