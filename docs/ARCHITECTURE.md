# Architecture

## Goals and non-goals

**Goal:** one static, self-contained browser experience that reads as a polished tourist guide to
Bangkok: five recognisable landmarks, three ways to move, bilingual guide content, convincing light and
sound, and durable local data.

**Non-goals:** GIS accuracy, live travel data, routing, multi-user features, accounts, a backend,
photo-real reconstruction, or an engine that can host arbitrary cities without authoring new geometry.

## Runtime topology

```text
Browser
  ├─ index.html
  │    ├─ Google Fonts stylesheet  (Chonburi, Kanit, Cormorant Garamond)
  │    ├─ Three.js r128            (cdnjs)
  │    ├─ OrbitControls r128       (jsDelivr, classic script)
  │    └─ script.js                (one IIFE, no modules)
  ├─ style.css
  └─ Canvas WebGL + DOM HUD/drawer + Web Audio
```

There is no server-side code, no database and no API owned by the project. GitHub Pages serves the
repository root as static files. The page can also run from `file://` with internet access for the CDN
and fonts.

## Source layout

`index.html` owns the semantic shell:

- loading and intro layers
- top bar: brand/help, mode switch, language, lighting, sound
- trail panel and mobile trail button
- minimap, floating label container, tooltip
- bottom hint bar and transit bar
- walk look hint, crosshair element (retained but hidden)
- guide drawer and scrim
- help modal, toast, self-test container, WebGL error layer
- pinned CDN scripts in dependency order

`style.css` is a hand-written design system: CSS variables, glass surfaces, typography, layout
breakpoints, Thai font coverage, drawer transitions, reduced-motion fallback.

`script.js` is one strict-mode IIFE. It is intentionally ordered as eight sections:

1. **Copy** — `I18N` for English/Thai UI, `LANDMARKS` for all landmark data and camera anchors.
2. **State** — default schema, sanitisation, localStorage load/save.
3. **Renderer, sky, light, materials** — renderer settings, sky shader, stars/sun/moon, procedural
   textures, facade material sets, time-preset interpolation.
4. **City** — river, embankments, promenades, railings, roads, bridges, park, trees, lamps, traffic,
   boats, blocks/parcels.
5. **Landmarks** — five hand-authored builders, plazas, pick volumes, floating markers.
6. **Camera** — OrbitControls, drag-look walking, collision, tour spline and stop state machine.
7. **UI** — bilingual rendering, drawer, minimap, audio graph, narration, export/import.
8. **Boot, self-test, debug API** — staged loading, URL parameters, `window.Bangkok3D`.

## Coordinate system and scale

- X is east–west, Z is north–south, Y is up.
- The Chao Phraya is centred near `x = -26`, with banks at approximately `x = -35` and `x = -16`.
- City extent is roughly `x ∈ [-94, 96]`, `z ∈ [-86, 86]`.
- One unit is a few metres; heights and distances are compressed for readability.
- Plazas suppress buildings and traffic so landmarks stay legible.
- The walkable area is the east bank, bounded by the river and the city edge.

Landmark positions, marker heights, plaza radii, fly-to views, tour points and tour views live together
in `LANDMARKS`. Changing one without the others produces camera or collision mismatches.

## World construction order

1. `initRenderer()` creates the WebGL context, scene, camera, material library, facade texture sets and
   plaza material.
2. `buildSky()` adds the shader sky, stars, sun/moon sprites, clouds, hemisphere/directional/ambient
   lights and five accent point lights.
3. `buildGround()` adds the river trench, embankments, promenade, railings, lamps and custom water
   shader.
4. `buildRoads()` lays the grid, sidewalks, lane dashes, crossings and two bridges.
5. `buildPark()` adds the Lumphini-style lawn, paths, pond and benches.
6. `buildLandmarks()` builds each landmark group, plaza ring, pick sphere, walk collider and floating
   marker.
7. `buildCityBlocks()` fills the remaining blocks with parcels, facades, roof plant, antennas, neon
   signs and building colliders.
8. `buildTrees()`, `buildStreetLamps()`, `buildTraffic()`, `buildBoats()` add life and additional
   colliders.
9. `setupControls()`, `setupTour()`, UI bindings and state hydration complete startup.
10. A static shadow map is rendered once; preset changes refresh it while the transition runs.

Buildings are placed from street intervals, not a GIS parcel layer. Blocks are skipped or capped near
plazas, parks and the river. This is the main reason the city reads as “around the landmarks” without
burying them.

## Camera and movement

### Drone

`THREE.OrbitControls` owns the camera. It is damped, limited in distance and polar angle, supports pan,
and is disabled during the tour and while the guide drawer is open. A tween helper interpolates between
saved fly-to views; recentering uses the same tween.

### Walk

Walk look is implemented in-house, with **no pointer lock**:

- `pointerdown` on the canvas records the pointer, captures it, derives yaw/pitch from the camera’s
  `YXZ` quaternion and starts a drag.
- `pointermove` applies yaw/pitch deltas, clamps pitch to ±1.45 radians and writes the quaternion back.
- `pointerup`/`pointercancel` release capture. A release with less than seven pixels of movement is
  treated as a click and may open a marker.
- Movement uses the camera’s flattened forward/right vectors. X and Z are resolved independently
  against an AABB collider list, which gives axis-aligned sliding along walls.
- Eye height is 1.72 units with a small speed-dependent head bob; footsteps fire on travelled distance.
- The on-screen arrow pad writes the same movement flags as the keyboard, so mouse/touch walking and
  keyboard walking share one movement path.
- The zoom wheel changes `freeZoom` (0.6–1.8) and the camera field of view (26–86°).

### Transit tour

A `CatmullRomCurve3` through 14 authored points follows the river south-to-north, then turns inland to
Golden Mount and Baiyoke. Each stop stores a curve parameter `u`, an explicit camera view and a look
target. The state machine is:

```text
travel(u += dt × speed)
  → cross stop.u
  → dwell 7.2s, lerp to stop.view, look at focus
  → index++
  → travel again
  → after last dwell: complete (replay available)
```

Pause/resume, next-stop jumps, drawer-open pausing and replay all operate on that state. The tour HUD is
a projection of the same state, not a separate animation.

## Rendering and material pipeline

- `renderer.outputEncoding = sRGBEncoding`, ACES filmic tone mapping, PCF soft shadows, pixel ratio
  capped at 2.
- Standard-material colours are converted from sRGB to linear with `srgb()`. Textures declare
  `sRGBEncoding`. Custom sky and water shaders receive raw colours because they do not include the
  built-in output-encoding chunk. This split is deliberate; changing it shifts the whole palette.
- Eight facade material sets come from procedural canvas textures (colour + emissive mask). They are
  shared across buildings to keep draw calls and memory down.
- The river is a custom shader with animated bands, glints, fog chunks and preset colours.
- Thai roofs use `hipRoofMesh()` (a six-vertex hip roof) rather than a rotated cylinder, which would
  distort rectangular plans.
- The shadow map covers ±130 units of the city and refreshes after construction and during lighting
  transitions. Moving cars and boats intentionally do not drive continuous shadow updates.

## Lighting presets

`day`, `golden` and `night` describe colours, sun angle/intensity, hemisphere/ambient levels, fog,
exposure, water colours, stars, clouds and a `night` factor. `applyLightMix()` writes the interpolated
values to lights, fog, shaders and emissive materials. `night` drives lit windows, lamps, neon, marker
glow, temple floodlights and the beacon. Presets are CSS-independent; the only UI coupling is the
active button and the state value.

## Picking and labels

- Each landmark has an invisible sphere pick volume for gross selection plus the visible marker meshes.
- A `Raycaster` is built from the pointer; hits are resolved to `userData.landmarkId`.
- HTML labels are positioned by projecting marker anchors every frame. They are hidden during the
  intro/drawer/help, at narrow widths, and when off-screen.
- Clicks with more than seven pixels of movement are treated as drags and never open a guide.

## Audio graph

```text
noise buffer ── bandpass ── gain ── stereo panner ─┐
              ├ lowpass  ── gain ── stereo panner ─┤
              └ highpass ── gain ─────────────────┤
                                                    ├─ master gain → destination
temple bell oscillators ── envelope ── HRTF panner ─┤
footstep noise + low thump ────────────────────────┘
```

The audio context is created only after a user gesture. The river bed has a slow LFO swell. Listener
position/orientation follows the camera; the river pan follows the bank. Speech narration uses
`speechSynthesis` and the current language, with no recorded audio files.

## State and data

`bangkok3d.state.v1` holds language, preset, camera mode, audio preference, visited IDs, route IDs and
per-landmark notes. It is sanitised on load. Export produces `bangkok_3d_tour.json`; import accepts the
same shape or a wrapped `{ state: … }` shape. The detailed contract is in
[DATA_FORMAT.md](DATA_FORMAT.md).

## Boot and failure handling

`boot()` stages progress across paint frames:

1. reset parameter (optional), renderer, sky/lights
2. ground, roads, park
3. landmarks, city blocks, life
4. controls, tour, UI, language, preset
5. URL overrides, first render, hide loader

If Three.js fails to load or WebGL cannot be created, the loader is replaced by a visible error panel.
There is no silent blank canvas. All runtime exceptions are captured into an in-page array for the
self-test.

## Extension points

- Add a landmark: data + builder + plaza/marker + tour anchors + screenshots, as described in
  [CONTRIBUTING.md](../CONTRIBUTING.md).
- Add a lighting preset: extend `PRESETS` and the button group; `applyLightMix()` handles the rest.
- Add a camera mode: extend the mode switch, `setMode()`, hints and the self-test; keep orbit/walk/tour
  state isolated.
- Add a language: extend `I18N` and every landmark’s language object; parity is enforced by the
  self-test.

## Why this shape

The no-build, three-file structure makes the project portable and reviewable. A framework would add
tooling without helping the core problems: procedural geometry, a readable camera state machine and
careful bilingual copy. The cost is a large `script.js`; the numbered sections and shared helper
vocabulary are the mitigation.
