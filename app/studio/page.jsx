import DripDivider from "../../components/DripDivider";
import Reveal from "../../components/Reveal";

export const metadata = {
  title: "Studio — Sweetness Studios",
  description:
    "Where this came from, and what it's for. Sweetness Studios is the music and creative arm of WRKN GRP.",
};

export default function Studio() {
  return (
    <main>
      <section className="section" style={{ paddingTop: "clamp(8rem, 18vh, 12rem)" }}>
        <div className="container">
          <Reveal>
            <p className="kicker mb-1">Studio</p>
            <h1 className="display-2" style={{ maxWidth: "22ch" }}>
              Sweetness Studios started the way most true things start. Late,
              alone, and because I couldn&rsquo;t not make it.
            </h1>
          </Reveal>
        </div>
      </section>

      <DripDivider hotIndex={6} />

      <section className="section">
        <div className="container grid-2">
          <Reveal>
            <span className="section-num">02</span>
          </Reveal>
          <div className="stack-lg">
            <Reveal>
              <p className="body-lg">
                There have been nights I finished a beat at four in the
                morning, feeling low for no reason I could name, and the only
                language I had for that feeling was sound. I&rsquo;d post the
                snippet, go to sleep, and wake up knowing it was going to mean
                something to somebody, because it had already meant something
                to me first. That&rsquo;s not a marketing story. That&rsquo;s
                just how I&rsquo;ve always worked.
              </p>
            </Reveal>
            <Reveal>
              <p className="dim">
                Over six years that turned into a catalogue. Ric Hassani.
                Kotrell. A run of records that don&rsquo;t all sound alike,
                because they were never meant to. Each one was built to feel
                like the person who was going to sing it, and the person who
                was going to hear it back.
              </p>
            </Reveal>
            <Reveal>
              <p className="dim">
                Somewhere in there I realised I wasn&rsquo;t just making beats.
                I was building a way of working. Play to feel first, arrange
                after. Let the demo tell you what it already wants to be.
                Chase the moment where a tear drops before you can explain why
                (it happens more than you&rsquo;d think, and I&rsquo;ve never
                been embarrassed by it).
              </p>
            </Reveal>
          </div>
        </div>
      </section>

      <section className="section" style={{ background: "var(--lift)" }}>
        <div className="container">
          <Reveal>
            <blockquote className="pull-quote" style={{ maxWidth: "30ch" }}>
              I don&rsquo;t make sound that&rsquo;s nice. I make sound that
              means something, and I can always tell you why it does.
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
                Sweetness Studios is the music and creative arm of WRKN GRP,
                and that matters more than it sounds like it should. Most
                studios can hand you a nice sound. Fewer can tell you the
                reason it&rsquo;s the right sound for who you&rsquo;re trying
                to reach. We can do both, because strategy and sound live at
                the same table here, not in two different buildings that
                occasionally talk.
              </p>
            </Reveal>
            <Reveal>
              <p className="dim">
                Two rooms, one house. In one, we build records and, God
                willing, a label people trust with their story. In the other,
                we give brands a voice, score what&rsquo;s on screen, and
                direct the room when the lights come up. Different clients.
                Same question every time: what do you want somebody to feel,
                and how do we make sure they actually feel it.
              </p>
            </Reveal>
          </div>
        </div>
      </section>
    </main>
  );
}
