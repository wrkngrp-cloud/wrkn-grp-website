import DripDivider from "../../components/DripDivider";
import Reveal from "../../components/Reveal";
import AudioPlayer from "../../components/AudioPlayer";

export const metadata = {
  title: "What We Do — Sweetness Studios",
  description:
    "Five capabilities, each one honest about the feeling behind it: music production, sonic branding, audio strategy, film & sync, music direction.",
};

const CAPABILITIES = [
  {
    num: "01",
    title: "Music Production",
    copy: "A record only works if it carries something true. Before we touch a plugin, we're asking what this song is supposed to feel like in somebody's chest. Then we build toward that, from the first chord to the final master. Afrobeats, R&B, gospel, the soft records and the ones built for the club. Six years, 30+ songs, and every one of them started as a feeling before it was a file.",
  },
  {
    num: "02",
    title: "Sonic Branding",
    copy: "A brand has a voice whether it plans for one or not. We just make sure it's on purpose. For Kuda, that meant two sonic logos built on traditional Nigerian instrumentation (Kalimba, Agidigbo, Agogo, shekere), each one tied directly to what the brand actually stands for, not to whatever loop sounded current that week. When it's done right, someone hears three seconds of it and knows exactly who it is, before a single word tells them.",
    audio: [
      { title: "The Awakening", sub: "Kuda · sonic logo" },
      { title: "The Welcome", sub: "Kuda · sonic logo" },
    ],
  },
  {
    num: "03",
    title: "Audio Strategy",
    copy: "Before the sound, there has to be a plan for the sound. Where does your brand live in someone's ear. What should it feel like there, consistently, from the ad to the app to the room at your activation. Most brands stop at a jingle. We build the system underneath it, because a system is what people actually remember.",
  },
  {
    num: "04",
    title: "Film & Sync",
    copy: "Songs I've produced have found their way into film without me chasing it, because a record with real feeling in it tends to find the moment it belongs to. “Ready” landed in Ololade, on Netflix. “Safe” landed in My Body, God's Temple, on Zikoko's channel. If you're building something for the screen, we score it and design the sound around it. If you've got a song that's ready for its moment, we help it find one.",
    audio: [
      { title: "Ready", sub: "Kotrell · featured in Ololade (Netflix)" },
      { title: "Safe", sub: "Kotrell · featured in My Body, God's Temple (Zikoko)" },
    ],
  },
  {
    num: "05",
    title: "Music Direction",
    copy: "A recording is a photograph. A live room is a night, and a night only lands if somebody's directing it with intention. We arranged and directed the music for Ruger's first-ever tour of Europe and Canada, and for Kotyard. The first time I arranged a show for Kotrell, it was a livestream to about thirty people during lockdown. A few years later he sold out a venue in Abuja. Watching that happen from the inside, still building the arrangements with him, is the kind of thing that reminds you why you do this.",
  },
];

export default function WhatWeDo() {
  return (
    <main>
      <section className="section" style={{ paddingTop: "clamp(8rem, 18vh, 12rem)" }}>
        <div className="container">
          <Reveal>
            <p className="kicker mb-1">What We Do</p>
            <h1 className="display-2" style={{ maxWidth: "18ch" }}>
              Five things. Each one written from the feeling first.
            </h1>
            <p className="body-lg dim measure mt-2">
              The deliverable comes second, because that&rsquo;s the actual
              order they happen in.
            </p>
          </Reveal>
        </div>
      </section>

      <DripDivider hotIndex={1} />

      <section className="section" style={{ paddingTop: 0 }}>
        <div className="container">
          {CAPABILITIES.map((c) => (
            <Reveal key={c.num}>
              <article className="work-block">
                <span className="section-num" style={{ fontSize: "clamp(3rem, 7vw, 6rem)" }}>
                  {c.num}
                </span>
                <div>
                  <h2 className="display-3 mb-1">{c.title}</h2>
                  <p className="dim measure">{c.copy}</p>
                  {c.audio && (
                    <div className="mt-2" style={{ display: "grid", gap: "0.8rem", maxWidth: "38rem" }}>
                      {c.audio.map((a) => (
                        <AudioPlayer key={a.title} title={a.title} sub={a.sub} />
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
