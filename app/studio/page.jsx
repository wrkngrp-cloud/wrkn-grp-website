import WaveDivider from "../../components/WaveDivider";
import Reveal from "../../components/Reveal";
import Intro from "../../components/Intro";
import ControlRoom from "../../components/ControlRoom";

export const metadata = {
  title: "Studio · Sweetness Studios",
  description:
    "Where Sweetness Studios came from, what it believes, and why strategy and sound sit at the same table.",
};

export default function Studio() {
  return (
    <main>
      <section className="section bg-glow" style={{ paddingTop: "clamp(8.5rem, 20vh, 13rem)" }}>
        <div className="container">
          <Intro delay={0.1}>
            <p className="kicker mb-2">Studio</p>
          </Intro>
          <Intro delay={0.25} blur={8}>
            <h1 className="display-2" style={{ maxWidth: "24ch" }}>
              Built the way true things get built. Late, alone, and because it
              couldn&rsquo;t <em>not</em> exist.
            </h1>
          </Intro>
        </div>
      </section>

      <WaveDivider />

      <section className="section">
        <div className="container grid-2">
          <div />
          <div className="stack-lg">
            <Reveal>
              <p className="body-lg">
                Sweetness Studios began with beats finished at four in the
                morning. Sound made because it was the only language
                available for a feeling that had no name yet. A snippet
                posted, slept on, and understood by sunrise: if it already
                meant something to the person who made it, it would mean
                something to somebody else. It always did. That isn&rsquo;t a
                marketing story. It&rsquo;s the studio&rsquo;s operating
                principle, and it hasn&rsquo;t changed since.
              </p>
            </Reveal>
            <Reveal>
              <p className="dim">
                Over six years that principle became a catalogue: records
                for names you&rsquo;d recognise and voices you&rsquo;ll meet
                soon, and none of them sound alike. Each one was built to
                feel like the person singing it, and the person who would
                hear it back, alone, at the exact moment they needed it.
              </p>
            </Reveal>
            <Reveal>
              <p className="dim">
                Somewhere in that run, the beats became a method. Play to feel
                first, arrange after. Let the demo say what it already wants
                to be. Chase the moment where a tear lands before the mind can
                explain it. It happens more often than anyone admits, and
                this studio has never once been embarrassed by it.
              </p>
            </Reveal>
          </div>
        </div>
      </section>

      {/* The control room at 4am: faders riding automation, meters
          dancing to an unheard playback. Wordless, in its own band. */}
      <section className="room-band" aria-hidden>
        <ControlRoom />
      </section>

      <section className="section section-lift">
        <div className="container">
          <Reveal>
            <blockquote className="pull-quote" style={{ maxWidth: "32ch" }}>
              We don&rsquo;t just make sound that&rsquo;s nice. We make sound
              that means something, and we can always tell you why it does.
            </blockquote>
          </Reveal>
        </div>
      </section>

      <section className="section">
        <div className="container grid-2">
          <div />
          <div className="stack-lg">
            <Reveal>
              <p className="dim">
                Sweetness Studios grew up inside a strategy house, and that
                matters more than it sounds like it should. Most
                studios can hand you a beautiful sound. Far fewer can tell you
                why it&rsquo;s the right sound for the person you&rsquo;re
                trying to reach. Here, strategy and sound sit at the same
                table, not in two buildings that occasionally call each
                other.
              </p>
            </Reveal>
            <Reveal>
              <p className="dim">
                Two rooms, one house. In one, records, and in time a label
                people trust with their story. In the other, a voice for
                brands, scores for the screen, and direction for the room when
                the lights come up. Different doors, different clients. The
                same question behind every one of them: what should this make
                a person feel, and how do we make sure they actually feel it?
              </p>
            </Reveal>
          </div>
        </div>
      </section>
    </main>
  );
}
