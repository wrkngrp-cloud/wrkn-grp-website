import WaveDivider from "../../components/WaveDivider";
import Reveal from "../../components/Reveal";
import Intro from "../../components/Intro";
import AudioPlayer from "../../components/AudioPlayer";
import { TRACKS } from "../../lib/credits";

export const metadata = {
  title: "Work · Sweetness Studios",
  description:
    "Six years, one catalogue. Ric Hassani, Kotrell, Ruger, Netflix, Zikoko. The real run of it.",
};

export default function Work() {
  return (
    <main>
      <section className="section bg-glow" style={{ paddingTop: "clamp(8.5rem, 20vh, 13rem)" }}>
        <div className="container">
          <Intro delay={0.1}>
            <p className="kicker mb-2">Work</p>
          </Intro>
          <Intro delay={0.25} blur={8}>
            <h1 className="display-2" style={{ maxWidth: "20ch" }}>
              Six years. One catalogue. <em>Nothing rounded up.</em>
            </h1>
          </Intro>
          <Intro delay={0.6}>
            <p className="body-lg dim mt-2">
              The real run of it: the records, the screens they found, the
              rooms they moved.
            </p>
          </Intro>
        </div>
      </section>

      <WaveDivider />

      {/* Artists */}
      <section className="section" style={{ paddingTop: 0 }}>
        <div className="container">
          <Reveal>
            <p className="kicker mb-2">Artists we&rsquo;ve produced</p>
          </Reveal>

          <Reveal>
            <article className="work-block">
              <span className="glyph">A</span>
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

          <Reveal>
            <article className="work-block">
              <span className="glyph">B</span>
              <div>
                <h2 className="display-3 mb-1">Kotrell</h2>
                <p className="dim measure">
                  Primary producer across <em>Ready</em>, <em>Safe</em>,{" "}
                  <em>Heavy</em>, <em>Home</em>, <em>Whole World</em>,{" "}
                  <em>Only You</em>, <em>Proud of You</em>, <em>Watch Me</em>,
                  and more. Six years of friendship as much as work, and
                  you can hear it in the records.
                </p>
              </div>
            </article>
          </Reveal>

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

      <WaveDivider flip />

      {/* On screen */}
      <section className="section section-lift">
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
                  Kotrell. Featured in <em>Ololade</em>, a series on Netflix.
                </p>
                <AudioPlayer title="Ready" sub="Kotrell · Ololade (Netflix)" spotify="https://open.spotify.com/search/Kotrell%20Ready" />
              </article>
            </Reveal>
            <Reveal delay={0.1}>
              <article className="card">
                <h3 className="display-4 mb-1">Safe</h3>
                <p className="dim mb-2" style={{ fontSize: "0.95rem" }}>
                  Kotrell. Featured in <em>My Body, God&rsquo;s Temple</em>,
                  on Zikoko&rsquo;s YouTube channel. Produced to feel like
                  security, like somebody finally exhaling. When Kotrell sent
                  back his first line, &ldquo;I feel safe here,&rdquo; it was
                  almost word for word what the production had been playing
                  toward. Alignment like that can&rsquo;t be forced. It can
                  only be recognised when it arrives.
                </p>
                <AudioPlayer title="Safe" sub="Kotrell · My Body, God's Temple (Zikoko)" spotify="https://open.spotify.com/track/6tPzBJptprIjA8hk4ir3rz" />
              </article>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Live */}
      <section className="section" id="live">
        <div className="container">
          <Reveal>
            <p className="kicker mb-2">Live direction</p>
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
      <section className="section section-lift">
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
