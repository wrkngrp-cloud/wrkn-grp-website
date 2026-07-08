# WRKN GRP — Website

Led by Strategy. Built in Culture.

Next.js (App Router) + Framer Motion + Lenis. All seven routes prerender as static HTML, so every URL (`/work/nyla`, etc.) resolves directly and is shareable.

## Run it

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # production build (static)
```

## The signature mechanic

`components/AssemblySequence.jsx` + `components/AssemblyScene.jsx` — a pinned 420vh scroll section on the homepage driving a WebGL scene (three.js via react-three-fiber, lazy-loaded so it never blocks first paint). Thirteen lit, bevel-extruded ceramic blocks — each tagged as a piece of execution (Identity, Motion, Social, Campaign, Decks, Events) — start scattered through 3D space and travel into the modular W as you scroll, with a damped cursor orbit on the whole group. The emissive gold block, the one true thing, lands last; then the mark resolves into the actual wordmark. Three narrative beats phase through: *A brand isn't the pieces → Strategy writes the brief → One thing. Everywhere. Remembered.*

Note: three is pinned to 0.170.x to match react-three-fiber 8; newer three versions log deprecation warnings through fiber 8.

## Logo

The official wordmark (serif-italic "wrkn" + bold sans "grp.") is inlined via `components/Logo.jsx` (path in `components/logoPath.js`, source SVGs in `public/brand/`). It renders in `currentColor`, so it sits on warm black or cream without separate assets. Used in the nav, footer, preloader wipe, and as the assembly sequence's final resolve.

## Fonts

Larken is a licensed family (Ellen Luff) and is not on Fontshare or Google Fonts. The CSS stack leads with `Larken` so it activates the moment the licensed files are self-hosted (drop `@font-face` rules into `app/globals.css`). Until then the live fallbacks load from Fontshare: **Sentient** (display italic) and **General Sans** (body), per the brief's fallback chain. Heuvel Grotesk, if licensed later, slots in the same way.

## Image placeholders

All visuals are clearly marked slots (`.img-slot`) with the required crops noted in-place:
- Case study covers: 1920×1080 minimum, full-bleed
- Gallery frames: 1200×1200 square crops
- ADF print work should be supplied as angled/in-hand mockups, not flat scans

Swap each slot for a real `<img>` (with descriptive alt text) when assets arrive; lazy-loading via `loading="lazy"` on everything below the fold.

## Motion system map

| Mechanic | File |
|---|---|
| Scroll-linked WebGL assembly (pinned) | `components/AssemblySequence.jsx`, `components/AssemblyScene.jsx` |
| Cursor-reactive dot field | `components/CursorField.jsx` |
| Interactive service ladder | `components/ServiceLadder.jsx` |
| Custom cursor: dot + ring, morph, label pill, pull | `components/Cursor.jsx` |
| Preloader with counter + wordmark reveal | `components/Preloader.jsx` |
| Multi-layer parallax hero | `components/Hero.jsx` |
| Split-text headline reveals | `components/SplitText.jsx` |
| 3D tilt scroll reveals | `components/Reveal.jsx`, `components/TiltCard.jsx` |
| Card flips (hover / scroll-trigger on touch) | `components/FlipCard.jsx`, `components/WorkCard.jsx` |
| Horizontal drag rail | `components/WorkRail.jsx` |
| Sticky case-study panels | `components/StickyPanels.jsx` |
| Cream "page flip" section inversion | `components/CreamSection.jsx` |
| Chapter numerals + wayfinding bars | `components/SectionDivider.jsx` |
| Magnetic buttons | `components/Magnetic.jsx` |
| Count-up stats | `components/Stat.jsx` |
| Marquee bands | `components/Marquee.jsx` |
| Cursor-tracking glow | `components/GlowBlob.jsx` |
| Page transitions (fade + vertical shift) | `app/template.jsx` |
| Grain, dot-matrix, fill-wipe buttons, underline draws | `app/globals.css` |

`prefers-reduced-motion` is honoured everywhere as a fallback: animations collapse to static/instant states without removing content.

## Deliberate exclusions (per brief)

No pricing, no team/bios/founder name, no testimonials, no Sweetness Studios, no roadmap or internal planning content, no placeholder social links. Instagram is the only social channel.
