# AGENTS.md — Bangkok 3D

**Current release:** 1.2.0 · **Docs index:** [docs/README.md](docs/README.md) · **Full handoff:**
[docs/HANDOFF.md](docs/HANDOFF.md)

This file is the first thing a new agent should read. If this session has ended, the repository is the
source of truth; [docs/HANDOFF.md](docs/HANDOFF.md) contains the complete reproduction and continuation
record. Do not reconstruct behaviour from memory—read the docs, run the checks, and inspect git history.

## Current snapshot

| Fact | Value |
| --- | --- |
| App | Bangkok 3D — Interactive Urban Tourist Guide & Explorer Studio |
| Version | **1.2.0** |
| Repository | <https://github.com/somphol/bangkok-3d-tour-guide> |
| Live demo | <https://somphol.github.io/bangkok-3d-tour-guide/> |
| Latest release | <https://github.com/somphol/bangkok-3d-tour-guide/releases/tag/v1.2.0> |
| Deployment | GitHub Pages, `main`, repository root |
| Stack | Vanilla HTML5/CSS3/ES6, Three.js r128 (CDN), Web Audio |
| Build step | **None** |
| Self-test | **24 / 24** |
| Static release check | **19 / 19** |
| Session record | [state.json](state.json), [STATE.md](STATE.md) |

The live build and `git log -1` are the authority for the deployed revision. Tags exist from v1.0.0
through v1.2.0; v1.2.0 adds the layered low-poly traffic. Documentation commits after the tag do not
change runtime version.

## Read order

1. This file.
2. [docs/HANDOFF.md](docs/HANDOFF.md) — all decisions, invariants, reproduction paths, deployment.
3. [docs/REQUIREMENTS.md](docs/REQUIREMENTS.md) — the original brief plus every user amendment.
4. [docs/CODE_MAP.md](docs/CODE_MAP.md) — functions, constants, DOM/state/API contracts.
5. [README.md](README.md) — public feature tour and commands.
6. [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md), [docs/CONTROLS.md](docs/CONTROLS.md),
   [docs/TESTING.md](docs/TESTING.md), [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md).

Supporting references: [DATA_FORMAT](docs/DATA_FORMAT.md), [DESIGN](docs/DESIGN.md),
[ACCESSIBILITY](docs/ACCESSIBILITY.md), [PERFORMANCE](docs/PERFORMANCE.md),
[BROWSER_SUPPORT](docs/BROWSER_SUPPORT.md), [GALLERY](docs/GALLERY.md),
[GLOSSARY](docs/GLOSSARY.md), [FAQ](docs/FAQ.md), [ROADMAP](docs/ROADMAP.md).

## What it is

A static, single-page 3D miniature of Bangkok with five hand-built landmarks (Wat Arun, Wat Pho, Grand
Palace, Golden Mount, Baiyoke Tower II), three camera modes, bilingual EN/TH copy, three lighting
presets, synthesised spatial audio, local progress and JSON itinerary export/import. It is an editorial
tourist toy—not a GIS map, live travel service, booking app or photoreal reconstruction.

## Commands

```sh
# run — no install, no build
python3 -m http.server 8000
open http://127.0.0.1:8000/

# syntax + release skeleton (19 checks)
node --check script.js
node scripts/verify-static.mjs

# runtime self-test (24 checks) — expected 24 / 24
open 'http://127.0.0.1:8000/?selftest=1'

# useful states
open 'http://127.0.0.1:8000/?reset=1&autostart=1&mode=walk'
open 'http://127.0.0.1:8000/?reset=1&autostart=1&preset=night'
open 'http://127.0.0.1:8000/?reset=1&autostart=1&mode=tour'
open 'http://127.0.0.1:8000/?reset=1&autostart=1&drawer=wat-pho'
```

There is no npm, bundler, environment file or secret. Node 20+ is enough for the checks. Python is only
a convenient static server.

## Repository map

```text
index.html                 DOM shell + HUD + CDN tags + versioned CSS/JS URLs
style.css                  design system, responsive layout, walk pad, Thai typography
script.js                  one strict IIFE: world, landmarks, cameras, UI, audio, state, self-test
screenshots/               10 release JPEGs
docs/                      complete release/reference/handoff documentation
scripts/verify-static.mjs  dependency-free check run by CI and humans
.github/                   issue forms, PR template, CODEOWNERS, static-check workflow
state.json / STATE.md      build duration, tokens, model/harness provenance
README.md                  public guide
CHANGELOG.md               SemVer history
CONTRIBUTING.md            contribution contract
SECURITY.md / PRIVACY.md   security and data policies
SUPPORT.md                 troubleshooting
CITATION.cff               software citation
```

## Critical invariants — do not regress

Full rationale in [docs/HANDOFF.md](docs/HANDOFF.md#critical-invariants).

**Controls**

- **No pointer lock.** Walk look is ordinary drag-to-look. The cursor is never captured. Do not
  reintroduce PointerLockControls or “click to look”.
- **Horizontal walk drag is inverted**: drag left → the right side of the landscape comes into view
  (`walkLook.yaw += dx`). Vertical look and zoom are conventional.
- **Walk must not depend on keyboard focus.** `focusScene()` returns focus to `#scene` after intro, mode
  changes, guide/help close. A hidden notes textarea must not swallow movement keys.
- **Walk clicks pick only markers.** `pickAt()` skips objects whose `userData.pickKind !== 'marker'` in
  walk mode; broad landmark volumes must not open the guide from a scene click.
- **Movement has three inputs:** on-screen arrow pad (`padKeys`), arrow keys, optional WASD. All feed
  `updateWalk()`. The pad is required for keyboard-free/touch walking.
- **Zoom:** drone uses OrbitControls distance; walk/tour use `freeZoom` × base FOV (48° landscape / 62°
  portrait), clamped 26–86°. Call `applyViewFov()` on mode switch/resize.
- Walk is **east bank only**; the river is a hard boundary.

**Rendering and world**

- Use **`hipRoofMesh()`** for rectangular Thai roofs. The old rotated-cylinder approach distorted plans.
- Cars are **six InstancedMeshes** (body, cabin, roof, wheels, headlights, tail lights); local +Z is the
  front. Do not revert to one box.
- Preserve marker heights/offsets, especially Baiyoke `[18, 0, 10]`. Marker meshes are
  `pickKind='marker'`; selection spheres are `pickKind='volume'`.
- Preserve the sRGB split: `srgb()` for standard materials/lights; raw colours for custom sky/water
  shaders. Changing it shifts the palette.
- One 2048 shadow map with `autoUpdate=false`; refresh on build/preset changes. Do not make moving cars
  cast continuous shadows blindly.
- The city is compressed, not geographic. X east–west, Z north–south, Y up, river at `x=-26`.

**Data/content**

- Landmark IDs are contracts: `wat-arun`, `wat-pho`, `grand-palace`, `golden-mount`, `baiyoke`.
- Storage key `bangkok3d.state.v1`; export filename `bangkok_3d_tour.json`.
- Every UI string and every landmark field must exist in English and Thai. Stories have three
  paragraphs, a fact and five tips in both languages.
- Fees/hours are a dated 2026 editorial snapshot; never present as live data.
- Thai copy is written in Thai, not transliterated.

**Release**

- No build step/framework/dependency additions without a strong reason.
- Three.js is pinned to r128 because OrbitControls is a classic script mutating `THREE`.
- **Cache-busting must match `APP.version`**: currently `style.css?v=1.2.0` and `script.js?v=1.2.0`.
  `scripts/verify-static.mjs` enforces this. Bump both with every app version.
- Update README, CHANGELOG, AGENTS, screenshots and affected docs in the same release.
- Keep `state.json`/`STATE.md` valid and update revisions when the release changes.

## Current controls to preserve

| Mode | Interaction |
| --- | --- |
| Drone | left-drag orbit, wheel zoom, right-drag pan, `R` recenter, `1` |
| Walk | drag look, on-screen arrow pad / arrow keys / WASD, Shift run, wheel FOV zoom, `E` inspect, `2` |
| Transit | auto spline, pause button/`Space`, next/`N`, wheel FOV zoom, `3` |
| Global | `L` language, `T` lighting, `M` sound, `H`/`?` help, `Esc` close overlays |

## Verification

Before a push:

```sh
node --check script.js
node scripts/verify-static.mjs
open 'http://127.0.0.1:8000/?selftest=1'
```

Also test in a real focused browser: intro, all modes, walk via pad and arrow keys, guide close/focus,
EN/TH, all presets, export/import, and a 430 px viewport. Headless browsers pause animation/focus unless
focus emulation is enabled; use a headful Chrome for movement/focus checks. See
[docs/TESTING.md](docs/TESTING.md) and [docs/RELEASE_CHECKLIST.md](docs/RELEASE_CHECKLIST.md).

## Deployment

GitHub Pages from `main` / root, `.nojekyll` present. Push, wait for the Pages build, then verify `/`,
`/style.css`, `/script.js`, `/state.json` and `?selftest=1` on the live URL. Use the existing git
credential helper; never commit or echo a token. If a release is intended, bump `APP.version` and both
asset query strings, update the changelog/state, commit, tag, push, and create release notes. See
[docs/DEPLOYMENT.md](docs/DEPLOYMENT.md).

## Known issues

- Stylised, compressed geography; not for navigation.
- Walk is east-bank only; no bridge walking.
- Prices/hours are a snapshot.
- Narration depends on OS voices.
- First load needs CDN/font access; no service worker/offline package.
- Headless/software rendering is slow and not a performance benchmark.
- The tour is cinematic waypoints, not a real timetable.
- Accessibility gaps: no spatial screen-reader exploration of the canvas, focus trapping is limited.
- Single-maintainer, best-effort support.

## Continuity

- Local path at handoff: `~/Projects/bangkok-3d-tour-guide`
- Repository: <https://github.com/somphol/bangkok-3d-tour-guide>
- Live: <https://somphol.github.io/bangkok-3d-tour-guide/>
- Full handoff/reproduction: [docs/HANDOFF.md](docs/HANDOFF.md)
- Build record: [state.json](state.json), [STATE.md](STATE.md)
- Session: `ses_e60b2c542ffezeHzunC0PwPEEY`, OpenCode 2.2.5, DeepSeek V4.1 Flash

If this session ends, clone the repo, follow the read order above, run the checks, and make the smallest
compatible change. Do not recreate the project from scratch unless the source is genuinely lost; the
repository and tags are canonical. Update this file whenever commands, architecture, constraints or
deployment change.
