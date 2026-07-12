# Handoff — open items for Emmanuel

## Decisions the brief asked to flag, not guess

1. **3D material scope (brief §3/§7.2).** The full physical glass is
   built and shipping: transmission 0.9, clearcoat 1.0, ior 1.45, plus
   the blinds-gobo key light and warm PMREM environment. No fallback
   downgrade was taken. If it proves heavy on low-end devices, the
   documented fallback (gradient-map + fake fresnel, same grading) can
   be added behind a capability check — say the word.
2. **Audio (brief §7.3).** No track files or embeds were provided, so
   every player renders the fully styled UI in its "Audio coming" state.
   Wiring is one prop per player (`src`) once files or embed URLs land:
   Ready, Safe, The Awakening, The Welcome, Sweetness Vol 1.
3. **Typography.** Balkist + Heuvel Grotesk are set as instructed, but
   neither license is self-hosted yet. Live fallbacks are Zodiak
   (display) and General Sans (body) from Fontshare. Drop the licensed
   woff2 files into `public/fonts/`, add `@font-face` rules, done.

## Content notes

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
