# Design Language

## Intent

The interface should feel like a printed field guide that happens to be a 3D toy: midnight ink, temple
gold, river jade and warm terracotta; editorial Thai/Latin typography; restrained motion; and enough
negative space for the city to be the hero.

## Palette

| Token | Value | Use |
| --- | --- | --- |
| Ink | `#070b10` | Page and glass base |
| Panel | `#0c141b` | Solid panel fallback |
| Cream | `#f5ecd9` | Primary type |
| Muted | `#93a3a2` | Secondary copy |
| Gold | `#e7c27d` | Primary accent, active state, markers |
| Gold deep | `#c99a4b` | Gradients, borders |
| Jade | `#6cbcac` | Visited/route state, river cues |
| Rose | `#d9866d` | Secondary accent |
| Stroke | `rgba(231,194,125,.19)` | Glass outlines |

Landmark drawers set a per-landmark `--accent` and `--accent-2`; all other colour comes from the shared
tokens. Lighting presets are applied in WebGL, not by swapping CSS themes.

## Typography

- **Chonburi** — display title, gold seal equivalents and short hero statements. Thai-capable.
- **Kanit** — UI, body copy and Thai labels. Weights 300–600.
- **Cormorant Garamond** — English display names and italic pull quotes; gives the editorial guide feel.
- **System fallback** — sans-serif stack keeps Thai and Latin readable if Google Fonts is blocked.

Body copy is deliberately small (10–13 px in chrome, 12.5 px in the drawer) because the scene carries
the scale. On narrow screens, type sizes and padding collapse before content is removed.

## Layout

- A full-bleed WebGL canvas with a cinematic vignette.
- A top bar for identity and mode/lighting/language controls.
- A left trail panel for landmark progress and portable data.
- A right guide drawer for the reading experience.
- A bottom-centre hint/tour bar and a bottom-left minimap.
- A bottom-right walk pad with four arrows and a `WALK` hub.
- The title screen is an editorial cover, not a modal: mark at top, lede and actions centred, credit
  line at the bottom.

Breakpoints: 1240 px, 980 px, 860 px, 620 px. Below 860 px the trail panel becomes a button and labels
are hidden; below 620 px the top bar becomes two rows and the walk pad moves above the hint.

## 3D visual language

- Low-poly, compressed geography; a diorama tray rather than a survey.
- Cream stucco, orange/green tile, gold trim, dark glass and lush green.
- Hand-built silhouettes: prangs, hip roofs, chedis, an open Reclining Buddha canopy, a terraced mount
  and a glass tower.
- Procedural canvas facades avoid external imagery while keeping the skyline varied.
- Lighting presets: bright midday, low golden sun, neon night. Gold is the constant.
- Traffic is a layered toy car silhouette, not a photoreal vehicle.
- Water is a shader with moving bands and glints; it should read as the river, not a mirror.

## Iconography and motion

- Icons are simple inline SVG strokes and filled shapes, 14–21 px.
- Floating markers are gold rings with a gem and a light beam; they bob slowly.
- Hover raises a marker and shows a short tooltip; click opens the guide.
- Drawer motion slides from the right; labels fade; the guide hero uses a geological gradient.
- The title screen fades over 0.8 s; reduced-motion users get near-instant transitions.
- The walk pad is deliberately static and tactile: a held button fills gold.

## Sound design

- River: filtered noise with a slow swell, panned toward the water.
- Traffic: low rumble, never a loop with an obvious seam.
- Temple bell: sine/triangle partials through an HRTF panner at Wat Arun.
- Footsteps: short filtered noise plus a low thump, fired by travelled distance.
- No music, no autoplay, no recorded audio files.

## Copy voice

- English: calm, specific, sensory; avoid brochure superlatives.
- Thai: written as Thai for Thai readers, not a literal phrase-by-phrase translation.
- Facts are dated 2026 and marked as changing; the disclaimer sits at the bottom of every guide.
- Bilingual parity is a design constraint, not a toggle afterthought.

## Accessibility of the visual language

- State is never carried by colour alone: visited items gain a check/✦ marker and text count.
- Primary actions are native buttons with readable labels.
- Focus rings are gold and visible; the scene is a programmatic focus target for keyboard movement.
- The guide text is real DOM text, not baked into the canvas.
- Known gaps and the improvement plan live in [ACCESSIBILITY.md](ACCESSIBILITY.md).

## What not to do

- Do not replace the editorial serif/Thai pairing with a generic game HUD font.
- Do not add neon gradients unrelated to the Bangkok palette.
- Do not turn the scene into a photoreal or GIS map; the compression is the product.
- Do not use text baked into the canvas for anything a user must read.
- Do not add a build step or a UI framework to achieve a visual change.
