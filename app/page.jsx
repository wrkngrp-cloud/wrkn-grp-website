import Link from "next/link";
import Hero3D from "../components/Hero3D";
import CursorTrail from "../components/CursorTrail";
import DripDivider from "../components/DripDivider";
import Reveal from "../components/Reveal";
import Parallax from "../components/Parallax";
import { PROOF } from "../lib/credits";

const DOORS = [
  {
    num: "01",
    title: "Records.",
    copy: "Six years, 30+ songs, artists whose stories I got to help tell. Full projects, single records, and now, records I'm building myself.",
    href: "/work/",
    link: "Work",
  },
  {
    num: "02",
    title: "A voice for brands.",
    copy: "Sound isn't decoration on a brand. It's a feeling with the screen off. We build that, on purpose, with a reason behind every note.",
    href: "/what-we-do/",
    link: "What We Do",
  },
  {
    num: "03",
    title: "The room.",
    copy: "Direction and arrangement for the night people remember.",
    href: "/work/#live",
    link: "Work / Live",
  },
];

export default function Home() {
  return (
    <main>
      <CursorTrail />

      <Hero3D />

      <DripDivider hotIndex={3} />

      <section className="section">
        <div className="container grid-2">
          <Reveal>
            <span className="section-num">01</span>
            <p className="kicker mt-2">Why</p>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="body-lg measure">
              I have been making music for six years now, and if you ask me
              why, the honest answer hasn&rsquo;t changed since the beginning.
              I want people to feel something real when they hear what I made.
              Not vibes for the sake of vibes (though I make those too, and I
              make them well). I mean the kind of feeling that meets you in a
              low moment and tells you somebody else has been there.
              That&rsquo;s the whole job, as far as I&rsquo;m concerned.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="section" style={{ paddingTop: 0 }}>
        <div className="container">
          <Reveal>
            <p className="kicker mb-1">The three doors</p>
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

      <section className="section" style={{ background: "var(--lift)" }}>
        <div className="container">
          <Reveal>
            <p className="kicker mb-2">The company we keep</p>
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

      <section className="section">
        <div className="container">
          <Reveal>
            <p
              className="pull-quote"
              style={{ maxWidth: "34ch", marginInline: "auto" }}
            >
              If it needs a sound, it needs somebody who&rsquo;ll ask what that
              sound is supposed to make someone feel, before we ever touch an
              instrument. That&rsquo;s where we start. Every time.
            </p>
          </Reveal>
        </div>
      </section>
    </main>
  );
}
