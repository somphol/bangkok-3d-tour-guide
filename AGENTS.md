# AGENTS.md — Bangkok 3D

**Current release:** 1.1.0 · **Docs index:** [docs/README.md](docs/README.md)

## What it is

A static, single-page interactive miniature of Bangkok built with vanilla HTML/CSS/ES6 and Three.js
r128 from CDN. It renders a compressed Rattanakosin city with five procedural landmarks, offers three
camera modes (orbit drone, drag-to-look walk, automated spline tour), bilingual EN/TH copy, three
lighting presets, synthesised Web Audio ambience and local JSON itinerary export/import. It is a
tourist-guide toy, not a map, GIS product or live travel-data service. See [README.md](README.md) for
the feature tour.

## Commands

```sh
# run (no install, no build)
python3 -m http.server 8000
open http://127.0.0.1:8000/

# syntax check + release skeleton
node --check script.js
node scripts/verify-static.mjs

# in-browser self-test (24 checks)
open 'http://127.0.0.1:8000/?selftest=1'

# screenshots / debug: add reset + autostart + optional mode/preset/lang/drawer
open 'http://127.0.0.1:8000/?reset=1&autostart=1&preset=night'
```

Deployment is GitHub Pages from `main` / repository root (`.nojekyll` included). There is no npm,
bundler, test runner or environment variable.

## Documentation

- [README](README.md) — quick tour and links.
- [docs/README.md](docs/README.md) — controls, architecture, data format, testing, deployment, release
  checklist, accessibility, performance, FAQ and roadmap.
- Root policies: [CONTRIBUTING](CONTRIBUTING.md), [CODE_OF_CONDUCT](CODE_OF_CONDUCT.md),
  [SECURITY](SECURITY.md), [SUPPORT](SUPPORT.md), [CHANGELOG](CHANGELOG.md), [AUTHORS](AUTHORS.md).

## Architecture

- `index.html` — all DOM: header, mode/time/sound controls, trail panel, minimap, tour bar, drawer,
  intro, help, loading, self-test container. The two CDN script tags are pinned (Three r128 and
  OrbitControls r128) and load in that order. Walk look is implemented in-house with pointer drag.
- `style.css` — design tokens, glass panels, responsive breakpoints (1240 / 980 / 860 / 620 px),
  Thai-capable typography (Chonburi, Kanit, Cormorant Garamond), reduced-motion support.
- `script.js` — one IIFE with eight numbered sections. Boot order is: reset param → renderer/materials
  → sky/lights → ground/roads/bridges/park → landmarks/markers → city blocks/trees/lamps/traffic/boats
  → controls/tour → UI bindings → language/preset hydration → URL params → animation → self-test.

Important functions: `buildLandmarks()`, `buildMarkers()`, `buildCityBlocks()`, `setupTour()`,
`updateTour()`, `updateWalk()`, `openLandmark()`, `renderDrawer()`, `buildExport()`, `importJSON()`,
`runSelfTest()`. `window.Bangkok3D` exposes the scene, camera, state, tour state and debug helpers.

LocalStorage key: `bangkok3d.state.v1`. Export file: `bangkok_3d_tour.json`. The five landmark IDs are
`wat-arun`, `wat-pho`, `grand-palace`, `golden-mount`, `baiyoke` and must stay stable across the
dataset, UI, export schema and self-test.

## Decisions and constraints

- **No build step.** Three files + static assets must work from GitHub Pages and `file://`. Do not
  introduce npm, TypeScript, modules or a bundler without a compelling reason.
- **Three.js is pinned to r128** because the examples are loaded as classic scripts that mutate the
  `THREE` global. Upgrading requires replacing those controls and retesting all modes.
- **Coordinates are intentionally compressed**: X east–west, Z north–south, Y up, river centred near
  `x = -26`. Landmarks are placed for readability, not survey accuracy. Do not “correct” them to real
  coordinates without redesigning the city grid and tour spline.
- **Bilingual parity is a hard invariant.** Every UI key must exist in both `I18N.en` and `I18N.th`;
  every landmark must have `en` and `th` with three story paragraphs, five tips and a fact. The
  self-test checks key counts.
- **State is additive and validated.** `sanitiseState()` drops unknown landmark IDs and caps notes at
  4000 characters. Keep the export schema backwards-compatible; import is deliberately permissive
  about missing metadata but strict about shapes.
- **Materials use sRGB→linear conversion.** `srgb()` is used for standard materials and lights; custom
  sky/water shaders receive unconverted colours because they do not use the built-in encoding chunk.
  Changing this will wash out or crush the palette.
- **Geometry is procedural.** No external models, photography or map tiles. Roofs use `hipRoofMesh()`
  (two-tier hip roofs); the old rotated-cylinder roof approach distorts rectangular plans and must not
  return.
- **Audio is gesture-gated.** Never autoplay; synthesis only starts after “Enter the city” or the sound
  toggle. `setEnabled(false)` ramps the master gain and is safe to call repeatedly.
- **Walk look is drag-based, deliberately not pointer lock.** Do not reintroduce PointerLockControls;
  dragging the canvas updates `walkLook` yaw/pitch and the walk hint auto-dismisses. Scroll zoom in
  walk/tour changes the field of view (`freeZoom`, 0.6–1.8); the drone uses OrbitControls distance.
- **Screenshots are 1600 px JPEGs**, mobile at 430 px, captured through headless Chrome CDP. Do not
  commit raw PNG captures; keep the repository lean.

## Known issues

- Walk mode requires a keyboard; mouse drag is used to look. Touch devices get a toast and should use
  drone/tour. The walk boundary is the east bank; there is no bridge collision or west-bank walking.
- The tourist fees and opening hours are a 2026 snapshot and are not fetched live.
- Speech narration depends on installed OS voices; Thai may fall back to an English voice on some
  systems.
- The tour is a cinematic spline, not a timetable; “stops” are camera dwell points, not simulated
  vehicles boarding passengers.
- Headless GPU rendering (SwiftShader) runs at a few FPS; use hardware acceleration for a fair
  performance check. The self-test does not measure FPS.
- The distant plain is a flat green plane: it reads as a diorama tray, not real Bangkok sprawl.

## Continuity

- Local path: `~/Projects/bangkok-3d-tour-guide`
- Repository: <https://github.com/somphol/bangkok-3d-tour-guide>
- Deployed copy: <https://somphol.github.io/bangkok-3d-tour-guide/>
- Build record (duration, tokens, model/harness credit): [state.json](state.json) and [STATE.md](STATE.md).

Keep this file current whenever commands, architecture, constraints or deployment change.
