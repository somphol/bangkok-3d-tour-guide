# Testing

Bangkok 3D is verified at three levels: static checks, an in-page self-test, and driven browser flows.
There is no unit-test framework; the app is a single static document, so the browser is the test runner.

## 1. Static checks

```sh
node --check script.js
node scripts/verify-static.mjs
python3 -m json.tool state.json > /dev/null
```

`scripts/verify-static.mjs` checks the release skeleton without a browser:

- required files and documentation exist
- `state.json` and the export filename convention are intact
- README image links resolve
- the Three.js/OrbitControls CDN pins are present and PointerLockControls is not
- APP version matches the changelog and state metadata
- obvious credential patterns are absent
- screenshots and the documented self-test count are present

The same command runs in GitHub Actions (`.github/workflows/static-check.yml`) on pushes and pull
requests.

## 2. In-page self-test

Open:

```text
http://127.0.0.1:8000/?selftest=1
```

The current release must report **24 / 24**. The checks are:

1. scene is built
2. five landmark groups
3. five 3D markers
4. five pick volumes
5. five labels
6. bilingual UI key parity
7. bilingual landmark parity
8. five ordered tour stops
9. three lighting presets
10. three camera modes
11. walk drag-look + zoom controls
12. walk collision field (more than 60 colliders)
13. traffic instances
14. river shader and time uniform
15. local state round-trip
16. export payload shape
17. export filename `bangkok_3d_tour.json`
18. note sanitisation/capping path
19. minimap canvas
20. audio synthesis class
21. no captured runtime errors
22. WebGL context
23. camera mode switching is callable
24. language switching changes the document language

A failure is displayed in the panel and logged with `console.table`. The result is also available as
`window.__selfTestResults` for automation.

## 3. Manual browser matrix

Run at least one desktop and one narrow viewport. Suggested current browsers:

| Browser | Desktop | Narrow / touch emulation |
| --- | --- | --- |
| Chrome / Edge (Chromium) | Required | Required |
| Safari (macOS/iOS) | Required | Required |
| Firefox | Recommended | Recommended |

Checklist:

- [ ] Intro appears; **Enter the city** dismisses it and starts sound.
- [ ] Drone drag orbits; wheel zooms; right-drag pans; recenter returns.
- [ ] Walk: drag looks; cursor stays visible; no pointer capture; WASD moves; Shift runs; wheel zooms.
- [ ] Walk cannot leave the east bank or pass through buildings/trees/temple bases.
- [ ] Clicking a marker or label opens the guide; dragging never opens it.
- [ ] Transit: stops advance, Space pauses, N jumps, replay works.
- [ ] Midday, golden and night all render; windows/lamps/neon respond.
- [ ] EN ⇄ TH switches header, panel, drawer, tips, hints and tour bar.
- [ ] Mark visited, add to route, type a note; reload and confirm they persist.
- [ ] Export downloads `bangkok_3d_tour.json`; import restores visited/route/notes.
- [ ] Minimap triangle follows the camera; visited markers fill.
- [ ] 430 × 900: mode switch, trail button, drawer and hint bar remain usable.
- [ ] Audio starts only after a gesture; mute/unmute works.

## 4. Driven browser verification

For release checks, the project has been driven through Chrome DevTools Protocol with a headless
Chromium build. The flows cover:

- boot, loading and intro
- URL parameters (`reset`, `autostart`, `mode`, `preset`, `lang`, `drawer`)
- actual mouse drag on the canvas (camera direction changes; no pointer lock)
- scroll-wheel zoom (FOV changes in Walk and Transit; drone FOV returns to base)
- marker raycast picking
- tour next/pause and stop framing
- EN/TH with an open drawer
- visited/route/note persistence and localStorage reload
- JSON download to disk and import from disk
- 430 × 900 layout
- self-test 24/24 with zero console errors

Headless runs used ANGLE/SwiftShader. This validates logic and layout but is not a GPU performance
benchmark; see [PERFORMANCE.md](PERFORMANCE.md).

### Reproducing a control check

1. Open `?reset=1&autostart=1&mode=walk`.
2. Wait until the loading layer is gone.
3. Drag left-to-right on the canvas; the view should turn and the walk hint should disappear.
4. Scroll up; the FOV should decrease (zoom in). Scroll down to zoom out.
5. Switch to Drone; the FOV should return to the base and the scroll should change orbit distance.
6. Switch to Transit; scroll should change FOV without interrupting the route.

## 5. Visual regression and screenshots

The release screenshots in `screenshots/` are 1600 px JPEGs (mobile at 430 px), captured from the live
build with a state reset. When a visual change is intentional, recapture the affected images and update
the README if a new view is worth showing. Do not commit raw PNG captures or browser profiles.

## 6. Known environment limits

- Software WebGL (SwiftShader) runs at a few frames per second; wall-clock drags can feel slow.
- Optional audio cannot be heard in a headless run; only the graph/class and absence of exceptions are
  checked.
- Speech narration depends on installed system voices.
- Cross-browser testing is best-effort; no CI browser farm is configured.

## Release gate

A release is ready only when:

- `node --check` and `scripts/verify-static.mjs` pass;
- the current browser self-test passes at the documented count;
- the control/manual checklist has no regressions;
- export and import work;
- the deployed Pages copy passes the self-test;
- [CHANGELOG.md](../CHANGELOG.md), [STATE.md](../STATE.md) and screenshots are current.
