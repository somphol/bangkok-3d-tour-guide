# Browser Support

## Supported

Bangkok 3D targets current evergreen browsers with **WebGL 2**, ES2020 JavaScript, Pointer Events and
the Web Audio API.

| Browser | Desktop | Mobile / touch | Notes |
| --- | --- | --- | --- |
| Chrome / Edge (Chromium) | Supported, primary target | Supported | Tested on Chrome 156 (desktop and 430×900 emulation) |
| Safari (macOS) | Supported | Supported | Speech voice availability varies |
| Safari (iOS/iPadOS) | — | Supported | Walk uses drag look + the on-screen arrow pad |
| Firefox | Supported | Supported | Best-effort verification; WebGL performance varies |
| Internet Explorer | Not supported | — | No polyfills or legacy build |
| Browsers with WebGL disabled | Error panel | Error panel | Hardware acceleration must be enabled |

“Supported” means the documented modes and data features are intended to work. The project is
maintained by one person and does not run a browser farm; the matrix reflects direct testing and
reasonable compatibility, not a guarantee for every device.

## Requirements

- **WebGL 2** — the scene uses Three.js r128 with modern material and texture paths. If the context
  cannot be created, a visible error explains the problem instead of a blank canvas.
- **JavaScript enabled** — there is no non-JavaScript fallback.
- **Internet on first load** — Three.js/OrbitControls and Google Fonts are loaded from public CDNs.
  Fonts fall back if blocked; the 3D library cannot.
- **Audio** — sound starts only after a user gesture, as required by browsers. Device narration uses
  installed `speechSynthesis` voices.
- **Input** — drone and transit work with mouse/touch. Walk supports drag look plus the on-screen arrow
  pad, arrow keys or WASD. A keyboard is optional.
- **Storage** — progress needs `localStorage`. Private browsing can clear or block it; the app then
  runs without persistence (writes are wrapped and ignored on failure).

## Known browser-specific behaviour

- Safari may have a different set of Thai/English system voices for narration.
- Firefox/Safari may report lower software-rendering performance; use hardware acceleration.
- iOS may suspend Web Audio when the tab is backgrounded; the app stops ambience and pauses the tour.
- Pointer capture and focus behaviour differ slightly across browsers; the scene re-focuses itself after
  overlays close so keyboard movement remains available.
- Very high device-pixel-ratio screens are capped at pixel ratio 2 to protect fill rate.

## Not supported

- IE11, legacy EdgeHTML, browsers without WebGL 2.
- Server-side rendering, Node execution of the app, or non-browser test runners.
- Offline-first use without cached CDN assets.
- Screen-reader exploration of the 3D scene itself; see [ACCESSIBILITY.md](ACCESSIBILITY.md).

## Testing a browser

```sh
python3 -m http.server 8000
open http://127.0.0.1:8000/
open 'http://127.0.0.1:8000/?selftest=1'
```

Check all three modes, EN/TH, the three lighting presets, drag/zoom, the walk pad, export/import and a
430 px viewport. Report a browser-specific issue with the version and the self-test result.
