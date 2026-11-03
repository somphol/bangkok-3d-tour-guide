# Code Map

`script.js` is one strict-mode IIFE with eight labelled sections. This map is for a new agent who needs
to find the right code quickly. Search by function name rather than line number; the file is edited often.

## Top-level constants

| Name | Location / meaning |
| --- | --- |
| `APP` | Name, version (`1.2.0`), city, storage key, export filename, model/harness credits |
| `I18N` | English and Thai UI strings; every key must exist in both |
| `LANDMARKS` | Five landmark objects: id, index, position, plaza, marker, tour point/view, accents, EN/TH copy |
| `LANDMARK_BY_ID` | Fast ID lookup |
| `world` | City extents, river, road arrays, park rectangle |
| `PRESETS` | `day`, `golden`, `night` colours and light values |
| `MAT` | Shared standard materials |
| `EYE` | Walk eye height, `1.72` |
| `ZOOM_MIN` / `ZOOM_MAX` | Walk/tour field-of-view zoom, `0.6–1.8` |

Current landmark data:

```text
wat-arun      position [-50, 30]   plaza 18  marker 40  tourPoint [-31,11,48]  tourView [-14,20,72]
wat-pho       position [ -8, 20]   plaza 17  marker 19  tourPoint [-30,11,26]  tourView [-32,22,58]
grand-palace  position [ -8,-16]   plaza 21  marker 23  tourPoint [-27,13,-2]  tourView [-32,22,24]
golden-mount  position [ 16,-52]   plaza 18  marker 35  tourPoint [  6,30,-34]  tourView [-10,38,-8]
baiyoke       position [ 54,-66]   plaza 16  marker 64  tourPoint [ 28,44,-46]  tourView [ 10,60,-10]
```

Tour curve points (south→north, then inland):

```text
[-30,9,72] [-30,10,58] [-31,11,48] [-30,11,34] [-30,11,26]
[-29,12,10] [-27,13,-2] [-20,18,-12] [-12,24,-22] [-2,28,-30]
[6,30,-34] [18,36,-40] [28,44,-46] [38,46,-52]
```

World:

```text
minX -94  maxX 96  minZ -86  maxZ 86
river centre x=-26, half width 9, banks -35 / -16
east roads x [-12, 4, 20, 36, 52, 68, 84]
east roads z [-72,-54,-36,-18, 0, 18, 36, 54, 72]
west roads x [-74,-58,-42]
park x=36 z=26 w=22 d=15
```

## Section 1 — copy and landmarks (roughly lines 1–520)

- `I18N.en`, `I18N.th` — all UI strings, hints, toasts, errors, help.
- `LANDMARKS` — stories, facts, five tips, accents, camera anchors.
- `t(key)`, `tf(key, vars)`, `landmarkText(l)` — localisation helpers.

Adding a landmark requires all of: stable id, index, position, plaza, markerY, focus, tourPoint,
tourView, fly-to `view`, accent colours, EN/TH content and a builder in `BUILDERS`.

## Section 2 — state (roughly 520–580)

- `defaultState()`, `sanitiseState(raw)`, `saveState()`.
- Load happens once at boot from `localStorage`; failures are non-fatal.
- Valid ids are the five landmark ids. Unknown ids are dropped; notes are capped at 4,000 characters.

## Section 3 — renderer, sky, materials, lighting (roughly 580–1260)

- `srgb(hex)` — converts a hex colour to linear space for standard materials/lights. **Do not** apply it
  to custom shader colours.
- `buildMaterials()` — all shared materials.
- `facadeTexture()`, `buildFacadeMaterialSet()` — eight procedural facade variants, colour + emissive maps.
- `makeNeonMaterial()`, `plazaTexture()`, `radialTexture()`, `cloudTexture()`.
- `initRenderer()` — WebGL renderer, sRGB output, ACES, shadows, camera, material setup.
- `buildSky()` — sky shader, stars, sun/moon sprites, clouds, lights, accent point lights.
- `makeLightMix()`, `applyLightMix()`, `writeLightMix()`, `updateLighting()` — preset interpolation.
- `setPreset()`, `cyclePreset()` — UI/state entry points.

## Section 4 — procedural city (roughly 1260–1970)

- `addBox`, `addCyl`, `addCone`, `addSphere`, `addTorus` — shared geometry helpers.
- `buildGround()` — river trench, ground slabs, promenade, railings, lamps, water shader.
- `buildRoads()`, `buildBridges()` — street grid, dashes, crossings, two bridges.
- `addPlaza()`, `inPlaza()`, `inPark()`, `buildPark()`.
- `buildingHeight()`, `buildCityBlocks()`, `makeBuilding()`, `addRoofSign()`.
- `buildTrees()`, `nearRoad()`, `collidesStatic()`, `buildStreetLamps()`.
- **Traffic:** `taperedCarShell()`, `buildTraffic()`, `setCarPart()`, `updateTraffic()`.
  - Six InstancedMeshes: body, cabin, roof, wheels, head, tail.
  - `carData[]`: axis, lane, direction, position, bounds, speed, size, colour.
  - `CAR_ROOT` etc are preallocated matrices; do not use one box mesh again.
- `buildBoats()`, `updateBoats()`.

## Section 5 — landmarks (roughly 1970–2460)

- `hipRoofMesh()` — six-vertex hip roof; **do not** replace with rotated cylinders (rectangular roofs
  distort).
- `thaiRoof()` — two-tier roof, gold trim, chofah.
- `thaiChedi()` — lathe bell, rings, spire.
- `buildWatArun()`, `buildWatPho()`, `buildGrandPalace()`, `buildGoldenMount()`, `buildBaiyoke()`.
- `BUILDERS` — id→builder map.
- `markLandmark()`, `buildLandmarks()` — placement, plaza, pick volume, colliders.
- `markerWorld()`, `buildMarkers()` — bobbing ring/gem/beam/glow; marker meshes get
  `userData.pickKind = 'marker'`; volumes get `'volume'`.

## Section 6 — camera, walking and tour (roughly 2460–2910)

- `setupControls()` — OrbitControls only; no PointerLockControls exists.
- `baseFov()`, `applyViewFov()` — 48° landscape / 62° portrait, multiplied by `freeZoom`.
- `walkLook` object — active, pointer, last position, yaw, pitch, movement distance.
- Pointer handlers:
  - `pointerdown` captures, derives yaw/pitch, starts drag.
  - `onPointerMove` applies `walkLook.yaw += dx * sensitivity` (inverted/grab-the-landscape), clamps
    pitch and updates the quaternion.
  - `pointerup`/`endWalkDrag` releases; a stationary click may pick a landmark.
  - wheel → `onWheelZoom`.
- `padKeys` + `.walk-pad-btn` — on-screen movement. `releaseWalkPad()` clears stuck holds.
- `focusScene()` — blurs hidden form controls and focuses the canvas (`tabindex="-1"`).
- `setMode()`, `updateModeUI()`, `updateHint()` — mode transitions, pad/hint visibility, focus.
- `updateWalk()` — combines keyboard and pad keys; flattens camera direction; axis-separated collision;
  head bob; footsteps; `E` proximity hint.
- `walkBlocked()` — river/city bounds plus AABB colliders.
- `nearestLandmark()`.
- `setupTour()`, `enterTour()`, `updateTour()`, `updateTourHud()`, `tourNext()`, `toggleTourPlay()`.
- `flyToLandmark()`, `startTween()`, `updateTween()`, `recenterDrone()`.

### Walk-mode invariants

1. Never reintroduce pointer lock or cursor capture.
2. Horizontal drag is inverted: left drag → look right.
3. A stationary click in walk mode may open only a marker; `pickAt` skips `pickKind !== 'marker'`.
4. A hidden notes field must not swallow movement keys; focus returns to the canvas after overlays.
5. The on-screen pad, arrow keys and WASD all feed the same `updateWalk` movement path.
6. Vertical look and zoom are conventional.

## Section 7 — UI, audio, export (roughly 2910–3700)

- `CityAudio` — Web Audio graph, chimes, footsteps, listener/pan updates (`getAudio()` debug endpoint).
- `toast`, `updateTimeButtons`, `updateLangUI`, `applyLanguage`, `updateTrailPanelText`.
- `updateProgress`, `buildLandmarkList`, `updateLandmarkList`, `buildLabels`, `updateLabelsText`,
  `updateLabels`.
- `openLandmark`, `closeDrawer`, `renderDrawer`, `stepLandmark`, `toggleVisited`, `toggleItinerary`,
  `updateDrawerButtons`, `noteChanged`, `toggleNarration`, `stopNarration`, `setHovered`.
- `drawMinimap()`, `updateMinimap()`.
- `buildExport()`, `downloadJSON()`, `importJSON()`, `updateAudioUI`, `toggleAudio`, `openHelp`,
  `closeHelp`, `updateTrailFab`, `toggleTrailPanel`, `bindEvents`, `onPointerMove`, `pickAt`.
- `onKeyDown`, `onResize`, `hideIntro`, `animate`, `markersUpdate`.

## Section 8 — boot and self-test (roughly 3700–end)

- `setLoading`, `showFatal`, `parseParams`, `boot`, `runSelfTest`.
- `boot()` order: reset param → renderer/materials → sky/lights → ground/roads/park → landmarks → city →
  trees/lamps/traffic/boats → controls/tour → UI/language/preset → URL params → animation → hide loader.
- `window.Bangkok3D` exposes `scene`, `camera`, `renderer`, `orbit`, `state`, `landmarks`, `tourStops`,
  mode/preset/language/open/fly/save functions, `buildExport`, `pickAt`, `getStats`, `getTour`,
  `getControls`, `getWalk`, `getAudio`, `runSelfTest`.

## DOM contracts

| Id/class | Purpose |
| --- | --- |
| `#scene` | WebGL canvas, `tabindex="-1"`, focus target for walking |
| `#modeSwitch`, `.mode-btn[data-mode]` | Drone/Walk/Transit |
| `#timeSwitch [data-preset]` | Day/golden/night |
| `#langBtn`, `#audioBtn`, `#helpBtn` | Global toggles |
| `#trailPanel`, `#landmarkList`, `#progressText`, `#routeText` | Landmark progress |
| `#saveBtn`, `#loadBtn`, `#importFile` | JSON export/import |
| `#walkPad`, `.walk-pad-btn[data-move]` | On-screen walk arrows |
| `#walkHint`, `#crosshair` | Walk onboarding; crosshair is intentionally hidden |
| `#tourBar`, `#tourPlayBtn`, `#tourNextBtn`, `#tourTrack` | Transit UI |
| `#drawer`, `#drawerTitle`, `#drawerTips`, `#noteInput` | Bilingual guide |
| `#minimap` | Optional river map |
| `#intro`, `#loading`, `#selftest`, `#webglError` | Layers and diagnostics |

## CSS map

- Design tokens at `:root`; glass, top bar, mode switch, trail panel, minimap, labels, tour bar, walk
  hint, walk pad, drawer, intro, loading, modal, self-test and responsive breakpoints.
- `body.is-intro` hides HUD layers; `body.is-walking` sets the grab cursor.
- `#scene.is-dragging` sets grabbing.
- Breakpoints: 1240, 980, 860, 620 px, plus short-height and reduced-motion rules.

## Tests

- `node --check script.js`.
- `node scripts/verify-static.mjs` — 19 release-skeleton checks.
- `?selftest=1` — 24 runtime checks.
- See [TESTING.md](TESTING.md) for browser/CDP flows and release gate.
