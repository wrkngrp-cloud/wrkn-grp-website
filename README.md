# Sweetness Studios — website

The sound arm of WRKN GRP. Music with soul at its core. Built from the
v0.2 build brief and v0.2 content doc.

## Run it

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # static export of all 6 routes → out/
```

## Brand system (locked — do not drift)

**Black & ember palette**, sourced exactly, not approximated:

- Logo hues (the hot end): hot red `#FC2418`, burnt orange `#FC7818`,
  gold-orange `#FCA818`, coral-pink `#FC5484`, ice blue `#C0D8E4` (stick).
- Deck photography grade (the shadow end): true black `#000000`, amber
  shadows `#2A0E00`/`#380E00`, burnt amber `#541C00`/`#8C380E`, ember
  `#A8460E`/`#B6460E`, and terracotta `#C97E5B` as the functional UI
  color (links, labels) — taken from the deck's own contact links.
- `#0A0500` only as the faintest lift off black (cards, nav, footer).
- `#FC2418` is a rare accent (rim light, one hot drip per divider).
  `#C0D8E4` ice blue has exactly one functional use per page (site-wide
  it's the keyboard focus ring, plus the lollipop's stick). `#FC5484`
  pink is an occasional note inside the melt gradient, never a UI color.
- Every drip/divider/trail runs the same material grade:
  gold → burnt orange → ember → amber shadow (`--melt` in `globals.css`).

**Type:** Fraunces Variable (display voice, optical sizing on, italics
for the emotional register) over Schibsted Grotesk (body and UI).
Both self-hosted via fontsource packages, imported in `app/layout.jsx`
and bundled by Next, so the GitHub Pages base path is handled by the
asset pipeline. Stacks in `globals.css`.

## Architecture

Next.js 14 App Router (JS), static export. Framer Motion + Lenis smooth
scroll. Three.js `0.170.x` via `@react-three/fiber@8` (pinned pair, same
as the WRKN GRP build — don't bump three alone).

Signature pieces:

- `components/SignalField.jsx` (mounted via `components/Signal.jsx`) —
  the Signal: the site's one 3D moment. A stack of waveform lines
  receding into darkness, graded gold through ember to amber shadow,
  breathing slowly, tilting with the pointer. It renders in its own
  space only (Home hero band, Releases signal band), never behind
  running text. Pauses offscreen; near-freezes under reduced motion.
  Per-placement props: lines, points, amp, speed, pinkLine, camY, camZ.
- `components/DawSession.jsx` — the principles staged as a DAW
  arrangement view; clips land track by track on scroll.
- `components/DripDivider.jsx` — graded SVG melt dividers, the candy
  language, used once or twice per page.
- `components/AudioPlayer.jsx` — inline player, fully styled; Spotify
  mode wired, file mode ready via the `src` prop.
- `components/Intro.jsx` — load-sequence rise for hero copy;
  `components/Reveal.jsx` for scroll reveals.
- `app/template.jsx` — page transition: a gold hairline sweep while
  the page rises into place.

## Content rules

The copy is written in the studio's voice (third person, soul-first),
built from the principles and history in
`sweetness-studios-website-content-v0.2.md` — facts, credits, names and
placements are used exactly as supplied there, never invented.
No invented credits, artists, or stats. Credits data lives in
`lib/credits.js`. Contact details (beatsbynuel@gmail.com, IG @nuelbeatz)
are from the deck's closing slide. The deck's investor content
(financials, roster, raise terms) stays off the site.
