import DripDivider from "../../components/DripDivider";
import Reveal from "../../components/Reveal";
import Intro from "../../components/Intro";
import AudioPlayer from "../../components/AudioPlayer";
import CapabilityMotif from "../../components/CapabilityMotif";

export const metadata = {
  title: "What We Do · Sweetness Studios",
  description:
    "Music production, sonic branding, audio strategy, film & sync, music direction: every capability starts with the feeling and works backward to the deliverable.",
};

const CAPABILITIES = [
  {
    num: "01",
    title: "Music Production",
    copy: "A record only works if it carries something true. Before a single plugin opens, the question on the table is what this song should feel like in somebody's chest. Then everything from the first chord to the final master is built toward that answer. Afrobeats, R&B, gospel; the soft records and the ones built for the club. Six years, 30-plus songs, and every one of them was a feeling before it was a file.",
  },
  {
    num: "02",
    title: "Sonic Branding",
    copy: "A brand has a voice whether it plans one or not. This studio makes sure it's on purpose. Sonic identities built on traditional Nigerian instrumentation (Kalimba, Agidigbo, Agogo, shekere), each note tied to what a brand actually stands for, not to whatever loop sounded current that week. Done right, three seconds of sound says exactly who it is before a single word does.",
  },
  {
    num: "03",
    title: "Audio Strategy",
    copy: "Before the sound, a plan for the sound. Where does a brand live in someone's ear? What should it feel like there, consistently, from the ad to the app to the room at the activation? Most brands stop at a jingle. This studio builds the system underneath it, because the system is what people actually remember.",
  },
  {
    num: "04",
    title: "Film & Sync",
    copy: "Records with real feeling in them find the screen on their own. “Ready” landed in Ololade on Netflix. “Safe” landed in My Body, God's Temple on Zikoko's channel. Neither was chased. Both were recognised. For work built for the screen, the studio scores it and designs the sound around it. For a song that's ready for its moment, the studio helps it find one.",
    audio: [
      {
        title: "Ready",
        sub: "Featured in Ololade (Netflix)",
        spotify: "https://open.spotify.com/search/Kotrell%20Ready",
      },
      {
        title: "Safe",
        sub: "Featured in My Body, God's Temple (Zikoko)",
        spotify: "https://open.spotify.com/track/6tPzBJptprIjA8hk4ir3rz",
      },
    ],
  },
  {
    num: "05",
    title: "Music Direction",
    copy: "A recording is a photograph. A live room is a night, and a night only lands if somebody directs it with intention. The studio arranged and directed the music for Ruger's first-ever tour of Europe and Canada, and for Kotyard. And the first show it ever arranged was a lockdown livestream playing to about thirty people; a few years later, that same artist sold out a venue in Abuja with the studio still building the arrangements beside him. That arc is the reason this door exists.",
  },
];

export default function WhatWeDo() {
  return (
    <main>
      <section className="section bg-glow" style={{ paddingTop: "clamp(8.5rem, 20vh, 13rem)" }}>
        <div className="container">
          <Intro delay={0.1}>
            <p className="kicker mb-2">What We Do</p>
          </Intro>
          <Intro delay={0.25} blur={8}>
            <h1 className="display-2" style={{ maxWidth: "20ch" }}>
              Five capabilities. Every one starts with <em>the feeling.</em>
            </h1>
          </Intro>
          <Intro delay={0.6}>
            <p className="body-lg dim measure mt-2">
              The deliverable comes second, because in this studio,
              that&rsquo;s the order it actually happens in.
            </p>
          </Intro>
        </div>
      </section>

      <DripDivider hotIndex={1} />

      <section className="section" style={{ paddingTop: 0 }}>
        <div className="container">
          {CAPABILITIES.map((c, i) => (
            <Reveal key={c.num}>
              <article className="work-block">
                <span className="glyph">{c.num}</span>
                <div>
                  <CapabilityMotif index={i} />
                  <h2 className="display-3 mb-1">{c.title}</h2>
                  <p className="dim measure">{c.copy}</p>
                  {c.audio && (
                    <div className="mt-2" style={{ display: "grid", gap: "0.8rem", maxWidth: "38rem" }}>
                      {c.audio.map((a) => (
                        <AudioPlayer key={a.title} title={a.title} sub={a.sub} spotify={a.spotify} />
                      ))}
                    </div>
                  )}
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </section>
    </main>
  );
}
