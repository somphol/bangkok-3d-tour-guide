# Requirements and Acceptance Criteria

This is the preserved brief for the shipped project, including the user-requested changes that superseded
parts of the original task. It exists so a future agent can tell what must remain true after a session
ends.

## Original brief

Build a complete, production-ready, interactive 3D web application named **“[CITY_NAME] 3D: Interactive
Urban Tourist Guide & Explorer Studio”** using vanilla HTML5, CSS3, ES6 JavaScript and Three.js via
CDN. For this project `CITY_NAME = Bangkok`, and the deliverable is three source files:
`index.html`, `style.css`, `script.js`.

Required capabilities:

1. **3D city landscape**
   - Low-poly terrain/grid around Bangkok’s central axis (the Chao Phraya).
   - Procedural blocks, streets, trees, traffic, water and decorative surfaces.
   - Five culturally specific landmarks at relative geographic positions.
   - Floating, bobbing 3D markers that open an educational guide on hover/click.
2. **Navigation**
   - Drone flyover using OrbitControls (360° orbit, tilt, zoom).
   - First-person street walking with ground movement, collision and landmark hotspots.
   - Automated transit tour along a city route, stopping at each landmark.
3. **Bilingual HUD, audio and time**
   - EN ⇄ Thai toggle for all UI, histories, tips, fees, dress codes, transit and audio prompts.
   - Midday / golden hour / neon night lighting.
   - Spatial Web Audio ambience and footsteps synchronised with walking speed.
4. **Persistence**
   - Visited landmarks, itinerary and notes saved locally.
   - **Save itinerary** downloads `bangkok_3d_tour.json`.
   - **Load itinerary** restores it on another device.
5. **Delivery**
   - Complete source in three clearly separated files.
   - Production-quality visuals, responsive UI, no build step.

## Delivered implementation

- Three static files, one IIFE in `script.js`, no package manager or bundler.
- Five landmarks: Wat Arun, Wat Pho, Grand Palace, Golden Mount (Wat Saket) and Baiyoke Tower II.
- Three camera modes: OrbitControls drone, in-house drag-look walk, Catmull-Rom transit tour.
- EN/TH copy, stories, facts, five tips per landmark, speech narration.
- Three lighting presets driven by a shared interpolation engine.
- Synthesised Web Audio beds, HRTF temple bells, footsteps.
- `localStorage` key `bangkok3d.state.v1`; export/import of `bangkok_3d_tour.json`.
- 24-check self-test, static CI, screenshots, documentation and GitHub Pages release.

## User amendments that override the original brief

These are part of the current contract; do not “restore” the earlier behaviour:

1. **No pointer lock in walking.** The mouse must never be captured. Look around by dragging the
   scene. The original PointerLockControls requirement is intentionally removed.
2. **Horizontal walk drag is inverted.** Dragging **left** brings the **right** side of the landscape
   into view; dragging right brings the left side into view. Vertical look is conventional.
3. **Zoom must work.** Drone uses OrbitControls distance; Walk and Transit use scroll-wheel field of
   view (clamped).
4. **Movement must be accessible without WASD knowledge.** Provide an on-screen arrow pad for mouse and
   touch, plus arrow-key support and optional WASD.
5. **Walking must survive focus changes.** After closing the guide/help or using the notes field, focus
   returns to the scene; hidden text fields must not swallow movement keys.
6. **Scene clicks in Walk mode must only pick the small floating markers**, not broad invisible landmark
   volumes that pause walking by opening the guide.
7. **Traffic must look like cars**, not single boxes: layered body, glass cabin, roof, four wheels,
   headlights and tail lights, still instanced for performance.
8. **A professional documentation set must ship in-repo**, including this handoff, so the work survives
   session termination.

## Acceptance criteria

- [x] `index.html`, `style.css`, `script.js` are present and the app runs from a static server.
- [x] Five landmarks are individually recognisable and have working markers.
- [x] Drone, Walk and Transit work; transit visits all five stops.
- [x] Walk uses drag-to-look, no pointer capture, inverted horizontal pan, on-screen pad, arrow keys and
      optional WASD; movement collides with the city.
- [x] EN/TH switches all visible guide and HUD copy.
- [x] Midday, golden and night presets transition sky, sun, fog, water, windows and lights.
- [x] Web Audio starts only after a gesture and footstep/chime/bed synthesis works.
- [x] Visited, route, notes and language/preset persist; export filename is exactly
      `bangkok_3d_tour.json`; import restores progress.
- [x] Mobile 430×900 layout is usable; walk pad makes touch walking possible.
- [x] Self-test passes **24 / 24**; static check passes **19 / 19**; live Pages copy verified.
- [x] Documentation, licence, notices, privacy, security, support, changelog, roadmap, CI and release
      history are present.

## Non-goals

- Survey-accurate geography, live ticket/hotel data, routing or GPS.
- Photoreal reconstruction, external map tiles or scanned models.
- Accounts, cloud sync, analytics, ads or a backend.
- A general-purpose city engine or editor.
- Mobile-first first-person movement with gesture look only; the pad is the mobile walk solution.

## Definition of done for future changes

A change is not complete until:

1. the code runs locally and the self-test remains green;
2. `node scripts/verify-static.mjs` passes (including cache-busting/version checks);
3. both languages remain in parity;
4. state/export IDs remain compatible;
5. screenshots/documentation/changelog are updated if the user-visible experience changed;
6. the Pages deployment is rebuilt and verified.
