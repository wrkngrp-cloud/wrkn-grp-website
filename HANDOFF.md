# Handoff — open items for Emmanuel

## Decisions the brief asked to flag, not guess

1. **3D scope (July 2026 redesign).** The global 3D world (metaball
   lollipop + per-section scenery) is removed: it sat behind every
   page's copy and fought it. In its place, one curated 3D scene, the
   Signal (`components/SignalField.jsx`): waveform lines receding into
   darkness in the ember grade. It appears exactly twice, in its own
   space: the Home hero band and a full-width band on Releases (dimmer,
   tighter, one pink line, the record still held back). The lollipop
   survives as the redrawn SVG mark (nav, footer, favicon); the melt
   lives on in the divider gradient.
2. **Audio (brief §7.3).** No track files or embeds were provided, so
   every player renders the fully styled UI in its "Audio coming" state.
   Wiring is one prop per player (`src`) once files or embed URLs land:
   Ready, Safe, The Awakening, The Welcome, Sweetness Vol 1.
3. **Typography.** The single-face lock was lifted by Emmanuel
   (July 2026). The site now pairs Fraunces Variable (display, optical
   sizing, italics as the emotional register) with Schibsted Grotesk
   (body and UI). Both are self-hosted via fontsource npm packages
   imported in `app/layout.jsx`; no CDN request at runtime.

## Content notes

- **Selected Work (Home), per Emmanuel:** Ngozi, Safe, For You,
  Love Me Slow. Spotify links are wired on every player: Ngozi and
  Safe have exact track URLs; For You, Love Me Slow, and Ready use
  Spotify search deep-links until Emmanuel pastes the exact track URLs
  from his playlist (swap the `spotify` props in `app/page.jsx`,
  `app/work/page.jsx`, `app/what-we-do/page.jsx`).
- **Kuda is removed site-wide** (per Emmanuel): no Kuda mention or
  sonic-logo players anywhere. Sonic Branding on What We Do describes
  the craft without naming the client.
- **Scenes (July 2026 redesign):** three purposeful moments instead of
  a world: the Signal (3D, Home hero + Releases band), the DAW
  arrangement view for the principles (DOM,
  `components/DawSession.jsx`), and the melt dividers. Everything else
  is type, spacing, and motion.
- **The first release is under wraps** per Emmanuel: no "Sweetness
  Vol 1" name anywhere on the site. The Releases page teases it as
  "Still under wraps" with the Life/Love/God throughline only.
- **Trelly Music** added to the proof strip as Kotrell's label (per
  Emmanuel).
- **WRKN GRP** appears only in the footer, as "A WRKN GRP subsidiary".
- **Writing standards:** no em dashes anywhere in site copy; keep the
  banned-word list from the WRKN GRP build in mind (delve, robust,
  landscape, pivotal, "In conclusion").

- **Proof strip ("The company the sound keeps")** now shows record
  labels/platforms as styled wordmarks: Riverland Records (Ric
  Hassani's label), Jonzing World (Ruger's label at the time of the
  Europe & Canada tour), Mavin Records (Bayanni), Netflix, Zikoko.
  Actual logo image files were NOT embedded — label logos are
  trademarks and need clearance/assets from Emmanuel. Drop licensed
  SVGs into `public/brand/labels/` and swap the wordmarks in
  `components/` when ready. Kuda is intentionally left off the Home
  page (strip + selected work) per Emmanuel's note (July 2026); Kuda
  detail remains on What We Do and Work — remove there too if the
  intent was site-wide.

- The v0.2 content doc's credits table lists "Safe" (Kotrell) twice —
  a playlist duplication. The site shows it once (27 rows). If the
  double entry was intentional, add it back in `lib/credits.js`.
- The content doc's own open decisions (label name "Releases" vs
  "Records", label credits per track, full table vs curated run, artist
  submissions now vs later) are still open. Current build: "Sweetness
  Releases", full 27-track table, submissions door open via Contact.
- Logo: the mark was redrawn as SVG (`public/brand/mark.svg`,
  `components/Logo.jsx`) from the logo file's exact hexes. Swap in the
  original asset if pixel-perfect fidelity is wanted.
- Contact form posts via a pre-filled mailto (static export, no
  backend). Swap for a form endpoint when one exists.

## Repo note

The GitHub integration for this session couldn't create a new
repository (403 — the app is scoped to wrkn-grp-website only). This
project has its own standalone git history and was pushed as the
orphan branch `claude/sweetness-studios-website-qoikdn` on
wrkn-grp-website. Once a `sweetness-studios-website` repo exists and
the Claude GitHub app has access, push it 1:1:

```bash
git remote add sweetness git@github.com:wrkngrp-cloud/sweetness-studios-website.git
git push -u sweetness main
```
