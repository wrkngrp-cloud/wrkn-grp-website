import Link from "next/link";
import CursorTrail from "../../components/CursorTrail";
import DripDivider from "../../components/DripDivider";
import Reveal from "../../components/Reveal";
import SoundWave from "../../components/SoundWave";

export const metadata = {
  title: "Releases · Sweetness Studios",
  description:
    "Sweetness Releases. Where the studio starts putting out its own. The first project is on its way.",
};

export default function Releases() {
  return (
    <main>
      <CursorTrail />

      <section className="section bg-glow" data-scene="eq-right" style={{ paddingTop: "clamp(8rem, 18vh, 12rem)" }}>
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

      <section className="section" data-scene="glow-left" style={{ paddingTop: 0 }}>
        <div className="container grid-2">
          <Reveal>
            <span className="section-num">05</span>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="body-lg measure">
              The producers this studio measures itself against didn&rsquo;t
              stop at making other people&rsquo;s records. Sarz. DJ Neptune.
              Spinall. Jae5. Juls. Each of them eventually built a house
              and started calling artists home to it. That&rsquo;s the model
              being built here. Not because it&rsquo;s a smart business move
              (though it is), but because a producer&rsquo;s ear is its own
              kind of artist statement.
            </p>
          </Reveal>
        </div>
      </section>

      <section aria-hidden style={{ padding: "0 0 1rem" }}>
        <div className="container">
          <SoundWave height={140} />
        </div>
      </section>

      <section className="section bg-shafts section-lift" data-scene="spots-center">
        <div className="container">
          <Reveal>
            <article className="card" style={{ padding: "clamp(2rem, 5vw, 4rem)" }}>
              <p className="kicker mb-1">First out the door</p>
              <h2 className="display-3 mb-1">Still under wraps.</h2>
              <p className="dim measure">
                The first Sweetness project is on its way. What can be said:
                it returns to the three things every Sweetness record returns
                to. Life. Love. God. A rotating cast of trusted voices,
                produced under Sweetness. When it lands, it lands here first.
              </p>
              <span className="player-badge mt-2" style={{ display: "inline-block" }}>
                Coming soon
              </span>
            </article>
          </Reveal>
        </div>
      </section>

      <section className="section" data-scene="peek">
        <div className="container grid-2">
          <div />
          <div className="stack-lg">
            <Reveal>
              <p className="dim">
                And honestly, because this studio would rather tell the
                truth than sell a headline: today, this page is releases. The
                next step is a real home. Artists on development deals, the
                room, the production, and the belief it takes to help someone
                become fully themselves. After that, actual record deals. The
                order is deliberate. Prove the sound first; sign the artist
                second. Three artists built properly beat fifteen signed
                hollow.
              </p>
            </Reveal>
            <Reveal>
              <p className="body-lg">
                If this reads like a room you&rsquo;d want your music to live
                in, the door is open.
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
