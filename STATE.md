# Build State

| Field | Value |
| --- | --- |
| Project | Bangkok 3D — Interactive Urban Tourist Guide & Explorer Studio (`bangkok-3d-tour-guide`) |
| Version | **1.2.0** |
| Session started | 2026-11-03 02:46:41 UTC |
| Build started | 2026-11-03 02:48:24 UTC |
| Source frozen | 2026-11-03 03:49:43 UTC |
| Published / verified | 2026-11-03 03:52:10 UTC |
| Build duration | **1h 1m 19s** (3,679 seconds) |
| Session duration to freeze | **1h 3m 2s** (3,782 seconds) |
| Session duration to publish | **1h 5m 29s** (3,929 seconds) |
| Harness | OpenCode 2.2.5 |
| Model | DeepSeek V4.1 Flash (`opencode-go/deepseek-v4.1-flash`) |
| Session | `ses_e60b2c542ffezeHzunC0PwPEEY` |
| Repository | <https://github.com/somphol/bangkok-3d-tour-guide> |
| Live demo | <https://somphol.github.io/bangkok-3d-tour-guide/> |
| Release | [v1.2.0](https://github.com/somphol/bangkok-3d-tour-guide/releases/tag/v1.2.0) · previous [v1.1.3](https://github.com/somphol/bangkok-3d-tour-guide/releases/tag/v1.1.3) |
| Self-test | **24 / 24 PASS** (local and live, zero runtime errors) |

## Token usage

| Metric | Tokens |
| --- | ---: |
| Input | 795,219 |
| Output | 239,137 |
| Reasoning | 229,271 |
| **Total (input + output + reasoning)** | **1,263,627** |
| Cache read | 153,624,832 |
| Cache write | 1,230 |
| Total including cache | 154,889,689 |

> Snapshot from the OpenCode session record at 2026-11-03T05:30:09Z, after the 1.2.0 low-poly traffic release and
> local verification. Total cost reported by the session: **$0.00**. The final commit, Pages rebuild
> and closing response add a small amount more. Cache reads/writes are context-usage figures and are
> reported separately from the input/output/reasoning total.

## What was built

A complete, self-contained 3D tourist guide to Bangkok in three modular source files — `index.html`,
`style.css` and `script.js` — plus ten screenshots and documentation. There is no build step, bundler,
package manager, API key or tracking.

### 1. Procedural city and five landmarks

- **Chao Phraya axis** — an animated custom-shader river with embankments, stone promenades, railings,
  lamps, two bridges, a park with pond, street trees, street lights, lane markings, crossings and 108
  instanced cars. The water, ground, landmarks and camera all share one compressed coordinate system
  (X east–west, Z north–south, Y up; river centred near `x = -26`).
- **Wat Arun** — a nine-tier central prang with redented corners, gold cornices, green/orange porcelain
  bands and face panels, a gilded spire and four satellite prangs on the west bank.
- **Wat Pho** — cloister walls, a long ubosot with a two-tier hip roof, four mosaic chedis, and an
  open-canopy Reclining Buddha with a gold body, head, topknot, feet and columns.
- **Grand Palace** — white crenellated walls with merlons and gates, Wat Phra Kaew, the golden chedi,
  the Chakri Maha Prasat with three gold spires, Dusit Maha Prasat and wall-corner towers.
- **Golden Mount** — a five-layer terraced hill, a 3.3-turn spiral path tube, slope pavilions, trees
  and a lathe-built gold chedi with rings and spire.
- **Baiyoke Tower II** — a podium, seven tapered glass sections, observation deck, gold band, neon
  crown ring, antenna, blinking beacon and a lit BAIYOKE sign.
- **City fabric** — procedural blocks and parcels with eight facade texture variants, roof plant,
  antennas and rooftop neon signs; parks and plazas; five floating gold markers with beams and glows.
- **Rendering** — ACES tone mapping, sRGB output, sRGB→linear material conversion, one 2048 shadow map,
  fog, procedural canvas textures, custom sky and water shaders, stars, sun/moon sprites and clouds.

### 2. Three camera modes

- **Drone** — OrbitControls with damping, limits, pan, zoom, cinematic intro auto-rotate, recenter and
  a smooth fly-to view per landmark.
- **Walk** — drag-to-look with the mouse and WASD/arrow movement, sprint, head bob, scroll-wheel FOV
  zoom, distance-synced footsteps, collision against buildings, trees, temple bases and the riverbank,
  and `E` inspection within 30 units. Walk state is preserved when switching modes.
- **Transit tour** — a centripetal Catmull-Rom route from the southern river through Rattanakosin and
  inland to Baiyoke. Five stops with distinct camera views and look targets, dwell timing, pause/resume,
  next-stop jumps, replay, progress boat and stop nodes. Scroll-wheel FOV zoom works here too.

### 3. Bilingual HUD, lighting and audio

- **EN ⇄ TH** — 90+ UI strings plus every landmark's name, kicker, tagline, three story paragraphs,
  fact and five visitor tips. All toasts, hints, tour labels, minimap captions and aria labels follow
  the switch. Thai copy is written as Thai, not a transliteration.
- **Lighting** — midday, golden hour and neon night smoothly interpolate sky shader colours, sun
  colour/position/intensity, hemisphere and ambient light, fog near/far/colour, exposure, water colours,
  facade emissive intensity, lamps, neon, marker glows and landmark floodlights.
- **Audio** — Web Audio noise beds (river, traffic, air), an LFO river swell, HRTF-panned temple bells,
  schedule-based chimes, footstep noise plus low thump, and device speech narration of the open guide.
- **HUD** — mode switch, time switch, language, sound, help, progress, route count, minimap with camera
  heading, tour bar, contextual hints and a full-screen title sequence.

### 4. Persistence and export

- `localStorage` key `bangkok3d.state.v1` stores language, lighting, camera mode, sound, visited IDs,
  route IDs and per-landmark notes.
- **💾 Save itinerary** downloads `bangkok_3d_tour.json` with app/version/city metadata, language,
  preset, visited, route, notes, stats and credits.
- **📂 Load itinerary** restores and sanitises another device's file. Unknown IDs are dropped and notes
  are capped at 4,000 characters.
- Visited stamps, route membership and notes are reflected immediately in the trail panel, drawer,
  labels and minimap.

## Verification

- `node --check script.js` passes.
- In-page self-test: **24 / 24**, including scene construction, five landmarks/markers/labels, five pick
  volumes, EN/TH key parity, landmark bilingual parity, ordered tour stops, three presets, three camera
  modes, drag-look + zoom controls, walk colliders, traffic instances, river shader, local state
  round-trip, export schema and filename, note sanitising, minimap, audio class, WebGL context, mode
  switching and language switching.
- Headless Chrome 156 (ANGLE/SwiftShader) drove: boot and intro, all three modes, tour next/pause,
  marker raycast picking, drawer visited/route/note actions, Thai switch with the drawer open, all three
  lighting presets, JSON download to disk, JSON import from disk, localStorage reload, and a 430×900
  mobile layout. **Zero console errors or uncaught exceptions.**
- The self-test panel is available at `?selftest=1`.

## Files

| File | Lines | Role |
| --- | ---: | --- |
| `index.html` | 265 | DOM, HUD, intro, guide drawer, CDN tags |
| `style.css` | 1,377 | design system, glass UI, responsive/Thai typography |
| `script.js` | 4,168 | world, landmarks, cameras, UI, audio, state, self-test |
| `screenshots/` | 10 | intro, day, golden, night, walk, river tour, tour stop, guide, Thai guide, mobile |
| `docs/` | 11 | controls, architecture, data, testing, deployment, release, accessibility, performance, FAQ, roadmap, index |
| Root policies | 9 | changelog, contributing, conduct, security, support, authors, licence, notices, state |
| `README.md` | — | features, run, controls, architecture, credits |
| `AGENTS.md` | — | handoff: commands, architecture, constraints, known issues |
| `LICENSE` | — | MIT |
| `THIRD_PARTY_NOTICES.md` | — | Three.js and font licences |

## Decisions

- No build step and no dependencies beyond pinned CDN files; the site must run from Pages and `file://`.
- Geography is compressed and interpretive; positions and heights serve the diorama, not navigation.
- Coordinates are fixed: X east–west, Z north–south, Y up; river near `x = -26`.
- sRGB→linear conversion is applied to standard materials/lights but not to the custom sky/water
  shaders, which write raw colour. Changing this changes the whole palette.
- Landmark IDs, state schema and `bangkok_3d_tour.json` are public contracts; keep them stable.
- Audio is gesture-gated by design; no autoplay.
- Walk mode uses keyboard movement and mouse drag to look; the walkable area is the east bank.

## Credits

Built with **[OpenCode](https://opencode.ai)** 2.2.5 and **DeepSeek V4.1 Flash**
(`opencode-go/deepseek-v4.1-flash`). Graphics by [Three.js](https://threejs.org) r128 (MIT), with the
r128 OrbitControls example. Walk look is implemented in-house. Fonts: Chonburi, Kanit, Cormorant Garamond
(Google Fonts, SIL OFL 1.1). All geometry, textures, audio and copy are original. See
`THIRD_PARTY_NOTICES.md`.

## Revisions after the original freeze

- **Documentation release:** version 1.1.0 adds the release documentation set, GitHub templates, a
  static CI check and a changelog. The behaviour is unchanged after the drag-look/zoom revision above.

- **Controls revision:** pointer lock was removed. Walk mode now uses normal drag-to-look, the cursor is
  never captured, and scroll-wheel field-of-view zoom was added to Walk and Transit. The self-test
  gained a 24th check. This supersedes the PointerLockControls wording in the original build snapshot
  above.
- **Patch 1.1.1:** horizontal walk drag is inverted to a grab-the-landscape feel; drag left brings the
  right side of the scene into view. Vertical look and zoom are unchanged.
- **Patch 1.1.2:** walking focus restored after using the guide/notes; arrow keys now prevent page
  scrolling and are documented alongside WASD.
- **Patch 1.1.3:** on-screen mouse/touch walk pad added; Walk-mode clicks only select the small marker
  icons; CSS/JS cache-busting added.
- **Feature 1.2.0:** layered low-poly traffic with body, cabin, roof, wheels, headlights and tail lights;
  still six instanced draw calls.

## Post-freeze work

The live Pages build was verified at the published timestamp above, including a 24/24 self-test. This
state file is the build record; the deployed site is the source of truth for the finished artefact.
