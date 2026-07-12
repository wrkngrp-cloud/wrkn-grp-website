import Link from "next/link";
import CursorTrail from "../../components/CursorTrail";
import DripDivider from "../../components/DripDivider";
import Reveal from "../../components/Reveal";
import AudioPlayer from "../../components/AudioPlayer";

export const metadata = {
  title: "Releases — Sweetness Studios",
  description:
    "Sweetness Releases. Where the studio starts putting out its own. Sweetness Vol 1: Life, Love, God.",
};

export default function Releases() {
  return (
    <main>
      <CursorTrail />

      <section className="section" style={{ paddingTop: "clamp(8rem, 18vh, 12rem)" }}>
        <div className="container">
          <Reveal>
            <p className="kicker mb-1">Releases</p>
            <h1 className="display-2" style={{ maxWidth: "18ch" }}>
              Sweetness Releases. Where the studio starts putting out its own.
            </h1>
          </Reveal>
        </div>
      </section>

      <DripDivider hotIndex={2} />

      <section className="section" style={{ paddingTop: 0 }}>
        <div className="container grid-2">
          <Reveal>
            <span className="section-num">05</span>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="body-lg measure">
              The producers I look up to most didn&rsquo;t stop at making
              other people&rsquo;s records. Sarz. DJ Neptune. Spinall. Jae5.
              Juls. Each of them eventually built a house and started calling
              artists home to it. That&rsquo;s the model I&rsquo;m building
              here, not because it&rsquo;s a smart business move (though it
              is), but because I&rsquo;ve always believed a producer&rsquo;s
              ear is its own kind of artist statement.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="section" style={{ background: "var(--lift)" }}>
        <div className="container">
          <Reveal>
            <article className="card" style={{ padding: "clamp(2rem, 5vw, 4rem)" }}>
              <p className="kicker mb-1">First out the door</p>
              <h2 className="display-3 mb-1">Sweetness Vol 1</h2>
              <p className="dim measure">
                An EP built around three things I keep coming back to in
                everything I make: Life, Love, God. Produced under Sweetness,
                featuring a rotating cast of artists I trust. The &ldquo;Vol
                1&rdquo; is not just a number. It&rsquo;s a promise that
                there&rsquo;s more coming behind it.
              </p>
              <div className="mt-2" style={{ maxWidth: "38rem" }}>
                <AudioPlayer title="Sweetness Vol 1" sub="EP · Life, Love, God" />
              </div>
            </article>
          </Reveal>
        </div>
      </section>

      <section className="section">
        <div className="container grid-2">
          <div />
          <div className="stack-lg">
            <Reveal>
              <p className="dim">
                Here&rsquo;s where I&rsquo;m honest about the road ahead,
                because I&rsquo;d rather tell you the truth than sell you a
                headline. Right now, this page is releases. The next step is a
                real home, artists on development deals, the room and the
                production and the belief to help someone become fully
                themselves. After that, actual record deals. I&rsquo;m not
                rushing the order. Prove the sound first. Sign the artist
                second. I&rsquo;d rather build three artists properly than
                sign fifteen and let the whole thing feel hollow.
              </p>
            </Reveal>
            <Reveal>
              <p className="body-lg">
                If you&rsquo;re an artist and this reads like a room
                you&rsquo;d want to be in, the door is open.
              </p>
              <Link href="/contact/" className="btn mt-2">
                Send the music
              </Link>
            </Reveal>
          </div>
        </div>
      </section>
    </main>
  );
}
