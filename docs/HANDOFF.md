# Handoff and Reproduction Guide

**Read this after [AGENTS.md](../AGENTS.md) and before changing the project.** It exists because the
build session will end; it records the decisions, contracts and failure modes that are not obvious from
the code alone.

## Current snapshot

| Fact | Value |
| --- | --- |
| Project | Bangkok 3D — Interactive Urban Tourist Guide & Explorer Studio |
| App version | **1.2.0** |
| Runtime | Vanilla HTML5, CSS3, ES6, Three.js r128 (CDN), Web Audio |
| Deployment | GitHub Pages, `main` branch, repository root |
| Repository | <https://github.com/somphol/bangkok-3d-tour-guide> |
| Live app | <https://somphol.github.io/bangkok-3d-tour-guide/> |
| Latest release | <https://github.com/somphol/bangkok-3d-tour-guide/releases/tag/v1.2.0> |
| CI | `.github/workflows/static-check.yml` — static check succeeds |
| Self-test | **24 / 24** |
| Static check | **19 / 19** |
| Screenshots | 10 JPEG files in `screenshots/` |
| Build/session record | [state.json](../state.json), [STATE.md](../STATE.md) |
| Local path at handoff | `~/Projects/bangkok-3d-tour-guide` |
| Model/harness | DeepSeek V4.1 Flash via OpenCode 2.2.5 |
| Session id | `ses_e60b2c542ffezeHzunC0PwPEEY` |

Do not rely on the local path or session id surviving; the repository is the source of truth. Check
`git log -1`, `git tag`, and the live self-test for the actual deployed revision.

## First 10 minutes for a new agent

1. Read [AGENTS.md](../AGENTS.md), this file, [REQUIREMENTS.md](REQUIREMENTS.md),
   [CODE_MAP.md](CODE_MAP.md), [ARCHITECTURE.md](ARCHITECTURE.md), [CONTROLS.md](CONTROLS.md).
2. Clone the repo and run the static server:

   ```sh
   git clone https://github.com/somphol/bangkok-3d-tour-guide.git
   cd bangkok-3d-tour-guide
   python3 -m http.server 8000
   open http://127.0.0.1:8000/
   ```

3. Run the checks:

   ```sh
   node --check script.js
   node scripts/verify-static.mjs
   open 'http://127.0.0.1:8000/?selftest=1'
   ```

4. Open the live app and reproduce one full flow: intro → drone → walk with the on-screen pad →
   guide → export/import → transit → night preset.
5. Before editing, read “Critical invariants” below. Several of them are user-requested corrections to
   the original brief.

## What this project is

A static, self-contained 3D tourist guide to Bangkok. Five hand-built landmarks sit in a compressed
Rattanakosin/Chao Phraya diorama with procedural streets, traffic, trees, boats, sky, water and sound.
Three camera modes, bilingual EN/TH content, three lighting presets, local progress and JSON
export/import. It is a tourist toy and editorial object, **not** a GIS map, live travel service, booking
tool or photoreal reconstruction.

Canonical source is exactly three runtime files: `index.html`, `style.css`, `script.js`. Everything else
is documentation, screenshots, state metadata, CI or static hosting.

## Repository map

```text
index.html              DOM shell, HUD, drawer, intro, CDN tags, versioned asset URLs
style.css               design system, responsive layout, Thai typography, walk pad
script.js               one IIFE; city, landmarks, cameras, UI, audio, state, self-test
screenshots/            10 release JPEGs
docs/                   full reference set (this file, requirements, code map, architecture, ...)
scripts/verify-static.mjs  dependency-free release check used by CI
.github/                issue forms, PR template, CODEOWNERS, CI workflow
state.json              machine-readable build/session/token metadata
STATE.md                human-readable build record
README.md               public feature tour
AGENTS.md               first-read agent handoff
CHANGELOG.md            semantic release history
CONTRIBUTING.md         contribution workflow and invariants
CODE_OF_CONDUCT.md      Contributor Covenant 2.1
SECURITY.md             security policy and scope
PRIVACY.md              data/network/privacy policy
SUPPORT.md              troubleshooting and issue guidance
AUTHORS.md              maintainer/credits
CITATION.cff            software citation metadata
LICENSE                 MIT
THIRD_PARTY_NOTICES.md  Three.js and font licences
robots.txt, sitemap.xml, favicon.svg, .nojekyll
```

## Reproduction paths

### A. Continue from the repository (normal)

Clone and serve; there is no install or build. The only external requirements are internet access for
the CDN/fonts and a WebGL-capable browser. Node is used only for the static checks and screenshot
automation; Python is only a convenient static server.

### B. Recreate the project from an empty folder

The repository and its tags are the canonical artifact. If the source itself is lost, recreate in this
order; do not skip the data/invariant sections:

1. **Scaffold** `index.html`, `style.css`, `script.js`. Add the Google Fonts (Chonburi, Kanit, Cormorant
   Garamond) and pinned CDN scripts:
   - Three.js r128 `https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js`
   - OrbitControls r128 `https://cdn.jsdelivr.net/npm/three@0.128.0/examples/js/controls/OrbitControls.js`
   - Do **not** add PointerLockControls; walk look is in-house.
2. **State and data first.** Define the five stable ids, bilingual landmark objects, `I18N`, state
   schema and export filename. See [DATA_FORMAT.md](DATA_FORMAT.md) and [CODE_MAP.md](CODE_MAP.md).
3. **Renderer and palette.** Implement `srgb()`, shared materials, sky shader, stars/sun/moon, lights,
   facade textures and the three lighting presets. The exact values are in `PRESETS`/`makeLightMix`.
4. **City.** Build the river axis at `x=-26`, banks at `-35/-16`, ground slabs, promenades, railing,
   roads, bridges, park, trees, lamps, traffic, boats. Keep the `world` constants and coordinate
   system from the code map.
5. **Landmarks.** Build each landmark in local space with the shared helpers. Use `hipRoofMesh()` for
   rectangular Thai roofs; do not use rotated cylinders. Place them at the documented positions and
   plaza radii; add pick volumes and markers.
6. **Cameras.** OrbitControls drone; in-house drag-look walk with collision and pad; Catmull-Rom tour
   with five explicit stop views. No pointer lock.
7. **UI.** Build the HUD, trail panel, drawer, tour bar, minimap, walk pad, intro, loading and help.
   Every user-facing string goes through `I18N`, including ARIA labels.
8. **Audio and persistence.** Gesture-gated Web Audio graph, footsteps, bells, localStorage,
   sanitised import, export as `bangkok_3d_tour.json`.
9. **Self-test.** Recreate the 24 runtime checks and the 19 static checks; do not lower the counts
   without updating all docs and state.
10. **Visual QA.** Capture the ten screenshots at 1600×1000 (mobile 430×900) with a reset state, compress
    to JPEG, update README/gallery if the framing changes.
11. **Publish.** GitHub Pages from `main` root, `.nojekyll`, versioned `style.css?v=` / `script.js?v=`
    queries, tag/release and live verification.

### C. Adapt to another city

The mechanism is reusable; the geography and copy are not. Re-author the outline, roads, landmark
positions/views, tour curve, bilingual content, palette and screenshots together. A new city with old
Bangkok coordinates will read as a reskin. See the `city-miniature` skill caution: use existing work as
a mechanism reference, never as a template to reskin.

## Critical invariants

These are non-obvious and were explicitly requested or learned during the build. Breaking one will
likely produce a regression that the self-test does not catch.

### Controls

1. **No pointer lock.** Walk look is drag-based. The cursor must stay visible and usable. Do not
   reintroduce `PointerLockControls`, “click to capture” copy, or Escape-to-release behaviour.
2. **Horizontal drag is inverted.** `walkLook.yaw += dx * sensitivity`; dragging left brings the right
   side of the landscape into view. Vertical look and both zoom directions are conventional.
3. **Walking must not depend on keyboard focus.** `focusScene()` returns focus to `#scene` after the
   intro, mode changes, guide close and help close. Clicking/dragging the scene also focuses it. A hidden
   textarea must not swallow movement keys.
4. **Walk clicks are marker-only.** `pickAt()` skips objects whose `userData.pickKind !== 'marker'` while
   in walk mode. The broad invisible landmark volumes are for drone selection, not walk selection. This
   prevents a scene click from opening a guide and pausing movement.
5. **Movement is shared.** The on-screen pad (`padKeys`), arrow keys and WASD all feed `updateWalk()`.
   The pad is the keyboard-free/touch path; do not hide it or make it desktop-only.
6. **Zoom modes.** Drone uses OrbitControls distance; walk/tour use `freeZoom` × base FOV (48° landscape,
   62° portrait), clamped 26–86°. `applyViewFov()` must run on mode switch and resize.
7. **Walk boundary.** East bank only; the river blocks movement. There is no bridge walking or west-bank
   collision.

### Rendering and geometry

8. **sRGB split.** Standard material colours and lights use `srgb()`; custom sky/water shaders receive
   raw colours because they do not include the output-encoding chunk. Changing this shifts the entire
   palette.
9. **Roofs.** Use `hipRoofMesh()`; the old rotated-cylinder roof distorted rectangular plans.
10. **Cars.** Six InstancedMeshes (body, cabin, roof, wheels, headlights, tail lights). Do not revert to
    one moving box. Car local +Z is the front; root yaw maps direction. Offsets are in local units before
    root scale. Lights respond to the night preset.
11. **Markers.** Bobbing ring/gem/beam/glow; marker meshes carry `pickKind='marker'`; the big pick sphere
    carries `pickKind='volume'`. Keep marker heights/offsets, especially Baiyoke’s `[18,0,10]` offset.
12. **Shadows.** One 2048 map with `autoUpdate=false`; refresh on build/preset transitions. Do not make
    moving cars cast continuous shadows without measuring the cost.
13. **Urban grid.** Buildings are generated from street intervals and excluded/capped near plazas and
    parks. Coordinates are compressed; do not “correct” them to real lat/long.

### Data and content

14. **Landmark IDs are contracts:** `wat-arun`, `wat-pho`, `grand-palace`, `golden-mount`, `baiyoke`.
    Visited/route/notes and exported files depend on them.
15. **Storage key/export name:** `bangkok3d.state.v1` and `bangkok_3d_tour.json`. The export button must
    produce exactly that filename.
16. **Bilingual parity:** every `I18N.en` key needs a `th` value; every landmark has three story
    paragraphs, a fact and five tips in both languages. The self-test checks parity.
17. **Prices/hours:** a 2026 editorial snapshot, explicitly marked as changing. Never present them as
    live data.
18. **Copy voice:** clear, specific, sensory; Thai is native Thai, not transliterated English. See
    [DESIGN.md](DESIGN.md).

### Release

19. **Cache-busting:** `index.html` must reference `style.css?v=1.2.0` and `script.js?v=1.2.0` matching
    `APP.version`; `scripts/verify-static.mjs` enforces it. When bumping the app version, update both
    query strings. Otherwise users can mix old script/CSS with new HTML.
20. **No build step/dependencies:** static files only. Do not add npm, a bundler, TypeScript, a framework
    or new runtime libraries without a compelling reason and a full re-verification.
21. **Three r128 pin:** classic-script OrbitControls mutates `THREE`; upgrading requires replacing the
    control integration and retesting all modes.
22. **Documentation is part of the release:** update README, CHANGELOG, AGENTS, screenshots and affected
    docs in the same change. `scripts/verify-static.mjs` checks required files, image links, version
    consistency and obvious credential patterns.

## Contracts and APIs

### State (`localStorage`)

```json
{
  "version": 1,
  "lang": "en",
  "preset": "day",
  "mode": "drone",
  "audio": true,
  "visited": [],
  "itinerary": [],
  "notes": {}
}
```

- Valid preset: `day`, `golden`, `night`.
- Valid mode: `drone`, `walk`, `tour`.
- Notes cap: 4,000 characters per landmark.
- Unknown landmark IDs are dropped.

### Export/import

`bangkok_3d_tour.json` contains `app`, `appVersion`, `city`, `exportedAt`, `language`, `preset`,
`visited`, `itinerary`, `notes`, `stats`, `credits`. Import accepts this or `{ "state": { ... } }`, and
requires at least one of `visited`, `itinerary` or `notes`. Full rules: [DATA_FORMAT.md](DATA_FORMAT.md).

### Debug API

`window.Bangkok3D` exposes `app`, `scene`, `camera`, `renderer`, `orbit`, `state`, `landmarks`,
`tourStops`, `setMode`, `setPreset`, `applyLanguage`, `openLandmark`, `closeDrawer`, `flyToLandmark`,
`saveItinerary`, `buildExport`, `pickAt`, `runSelfTest`, `getStats`, `getTour`, `getControls`, `getWalk`
and `getAudio`. Use it for console debugging and screenshot automation; do not remove it casually.

### URL parameters

`reset=1`, `autostart=1`, `mode=drone|walk|tour`, `preset=day|golden|night`, `lang=en|th`,
`drawer=<landmark-id>`, `selftest=1`, `cam=x,y,z` + `look=x,y,z`.

## Testing and release gate

```sh
node --check script.js
node scripts/verify-static.mjs
python3 -m http.server 8000
open 'http://127.0.0.1:8000/?selftest=1'
```

Expected at handoff: static **19 / 19**, runtime **24 / 24**, zero console errors. The live copy must
also pass the same self-test. See [TESTING.md](TESTING.md) for the manual/CDP checklist and
[RELEASE_CHECKLIST.md](RELEASE_CHECKLIST.md) for the full release gate.

Browser verification used Chrome 156 headless (ANGLE/SwiftShader) and a headful focused Chrome for
input/focus checks. Headless pauses animation/focus unless focus emulation is enabled; use a headful
window to trust movement tests.

## Deployment and credentials

- GitHub Pages, source `main`, folder `/`, `.nojekyll` present.
- Public repository `somphol/bangkok-3d-tour-guide`; the site has no private data.
- Publishing requires a GitHub credential. The macOS `git credential` helper may be used for one
  retrieval per publish batch; never write a token into the repository, README, scripts or remote URL.
  If token-based API calls are used, keep them in a variable and do not echo them.
- After a push, wait for the Pages build and verify `/`, `/style.css`, `/script.js`, `/state.json` and
  `?selftest=1`.
- Cache-busting query strings must match `APP.version`; bump them in the same release commit.

## Known issues and honest limits

- Geography is compressed; not a map, not GIS, not navigable in real life.
- Fees/hours are a 2026 snapshot; not live.
- Walk is east-bank only; no bridge/west-bank walking.
- Walk uses drag look plus pad/keys; there is no aim/zoom reticle or physics beyond AABB sliding.
- Narration depends on OS voices; Thai may fall back.
- Headless/software WebGL is slow; performance numbers from it are invalid.
- No service worker/offline cache; first load needs the CDN/fonts.
- The scene has no screen-reader spatial exploration; see ACCESSIBILITY.
- The transit tour is cinematic waypoints, not a timetable or vehicle simulation.
- The repository is a single-maintainer project with best-effort support.

## Session history and user amendments

The original brief is preserved in [REQUIREMENTS.md](REQUIREMENTS.md). After the first release the user
requested these changes, which are now canonical:

- remove the sticky pointer-lock mode; use ordinary drag-to-look and allow zoom;
- invert horizontal walk drag (left drag reveals the right side of the landscape);
- make arrow keys first-class and fix walking after guide/notes focus;
- add a visible on-screen arrow pad so walking needs no keyboard;
- prevent scene clicks from opening guides via oversized landmark pick volumes;
- replace moving boxes with layered low-poly cars;
- ship a complete professional documentation set, and this handoff so knowledge survives the session.

Version history: `v1.0.0` initial; `v1.1.0` drag-look/zoom + docs; `v1.1.1` drag inversion; `v1.1.2`
focus/arrow fixes; `v1.1.3` walk pad/picking/cache-busting; `v1.2.0` low-poly cars. Documentation
additions after v1.2.0 do not change runtime version.

## If you extend the project

1. Read the relevant docs and identify the contract you are changing.
2. Make the smallest change in `script.js`/`style.css`/`index.html`.
3. Preserve state/export IDs and bilingual parity.
4. Run `node --check`, static check and in-page self-test.
5. Test in a real focused browser: intro, all modes, walk via pad/keys, guide close focus, export/import,
   mobile.
6. Update `CHANGELOG`, `README`, affected docs and screenshots.
7. Bump `APP.version` **and** both cache-busting query strings together; update `state.json`/`STATE.md`
   metadata if the release is significant.
8. Commit, push, verify Pages, and—if releasing—tag and create GitHub release notes.

See [ROADMAP.md](ROADMAP.md) for planned work and [CONTRIBUTING.md](../CONTRIBUTING.md) for the
contribution contract.

## Deliberately not done

- No real-time travel data, booking, accounts or cloud sync.
- No PointerLockControls.
- No photoreal imagery or external map tiles.
- No analytics or tracking.
- No build pipeline/framework.
- No general-purpose city editor.
- No promise that the diorama matches real geography.

## Provenance

Built with **OpenCode 2.2.5** and **DeepSeek V4.1 Flash** (`opencode-go/deepseek-v4.1-flash`). Three.js
r128 (MIT) and OrbitControls; Google Fonts (SIL OFL). All geometry, procedural textures, shaders, copy,
audio synthesis and screenshots are original work. Exact build time/token/model metadata is recorded in
[state.json](../state.json) and [STATE.md](../STATE.md). The live Pages deployment and git history are the
final authority.
