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

**Type:** Heuvel Grotesk everywhere (licensed; General Sans is the live
Fontshare fallback). Stack in `globals.css`; swap in the licensed files
when self-hosted. No second face.

## Architecture

Next.js 14 App Router (JS), static export. Framer Motion + Lenis smooth
scroll. Three.js `0.170.x` via `@react-three/fiber@8` (pinned pair, same
as the WRKN GRP build — don't bump three alone).

Signature pieces:

- `components/SceneRoot.jsx` + `components/WorldScene.jsx` — the one
  continuous world behind every page: a fixed canvas holding the
  melting lollipop (flat-disc logo replica, marching-cubes metaball
  liquid that never stops dripping) plus per-section scenery: warm
  blind-light slats, an ember glow, drifting dust, breathing sound
  rings, and a circular spectrum of bars. Sections opt in with
  data-scene="<preset>" (presets in SceneRoot); the lollipop travels,
  scales, and the scenery crossfades as sections pass. Scroll turns
  the lollipop continuously across the whole site.
- `components/CursorTrail.jsx` — viscous melt trail, Home + Releases only.
- `components/DripDivider.jsx` — graded SVG melt dividers.
- `components/AudioPlayer.jsx` — inline player, fully styled; currently
  in "Audio coming" state until real files/embeds are wired (`src` prop).
- `app/template.jsx` — liquid pour page transition.

## Content rules

The copy is written in the studio's voice (third person, soul-first),
built from the principles and history in
`sweetness-studios-website-content-v0.2.md` — facts, credits, names and
placements are used exactly as supplied there, never invented.
No invented credits, artists, or stats. Credits data lives in
`lib/credits.js`. Contact details (beatsbynuel@gmail.com, IG @nuelbeatz)
are from the deck's closing slide. The deck's investor content
(financials, roster, raise terms) stays off the site.
