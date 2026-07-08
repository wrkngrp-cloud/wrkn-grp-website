# Handoff — continuing on mobile / a fresh session

This is the WRKN GRP website. A previous local Claude Code session built it; this note carries the context a new (cloud/mobile) session needs, since chat history doesn't travel with the repo.

## Run it

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # static export of all 7 routes
```

See `README.md` for the full component/motion map. Brief lived in the original chat; the locked essentials are below.

## Locked brand constraints (do not drift)

- Palette: warm black `#0A0A0A`, cream `#F4EFE6`, gold `#EFC835` only. No other accent colors. (Old black/lime + Syne/Manrope is banned.)
- Type: Larken display serif-italic (licensed, not yet self-hosted — **Sentient** is the live Fontshare fallback) + General Sans body (Heuvel Grotesk when licensed). Stack already set in `globals.css`.
- Copy rules: no em dashes as a stylistic crutch; a specific banned-word list (delve, robust, landscape, pivotal, "In conclusion", etc.). Keep copy sharp, Lagos-native, evidence-backed.
- Do NOT add: pricing, team/bios/founder name, testimonials, Sweetness Studios, the internal roadmap, or fake social links. Instagram (@wrkngrp) is the only social channel. Only real clients: Nyla, Aliko Dangote Foundation.

## Architecture

Next.js App Router (JS, not TS). Framer Motion + Lenis smooth scroll. Three.js via `@react-three/fiber@8` for the WebGL pieces. **three is pinned to `0.170.x`** to match fiber 8 — do not bump it (newer three spams deprecation warnings through fiber 8).

Signature WebGL pieces:
- `components/AssemblySequence.jsx` + `AssemblyScene.jsx` — homepage hero mechanic: 13 labeled ceramic bricks scatter in 3D and assemble into the modular "W", gold "One True Thing" brick lands last, resolves into the wordmark.
- `components/HomeLadder.jsx` + `LadderScene.jsx` — **section 04 "What We Do"**: a pinned ~340vh scroll that climbs a 3D ladder rung by rung (01→05); the active rung turns gold + pulls forward while a text panel swaps the product name/summary. **This was just built and compiles; it still needs a real in-browser scroll-through to confirm rung sync, panel timing, and mobile layout.** That's the first thing to verify.
- `components/CursorField.jsx` — cursor-reactive dot-field canvas (hero, assembly, CTA, contact, ladder).
- `components/ServiceLadder.jsx` — the interactive accordion ladder on the `/services` page (separate from the homepage 3D ladder).

## Known gotchas

- Never run `next build` while `next dev` is serving this project — they share `.next` and the build wipes the dev server's chunks, freezing pages at SSR state with no errors (tiny ~300-byte JS chunks are the tell). Build only with the dev server stopped, then `rm -rf .next` if it wedges.
- Per-word split-text reveals observe the headline container, not the masked word spans (a span translated 115% inside `overflow:hidden` never intersects the viewport). See `components/SplitText.jsx`.
- Overlays that exit via AnimatePresence wedge in hidden tabs (rAF pauses) — `Preloader.jsx` hard-skips when `document.hidden`.

## Immediate next step

Verify the section-04 3D ladder (`HomeLadder`) in the browser: scroll through it, confirm each rung lights gold in sync with its panel copy, and check the mobile (single-column) layout where the ladder stacks above the text.
