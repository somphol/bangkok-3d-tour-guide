# FAQ

### Is this an accurate map of Bangkok?

No. It is a stylised, geographically compressed diorama. Positions, distances and heights are adjusted
so five landmarks fit one readable 3D scene. Do not use it for navigation, measurements or planning.

### Why these five landmarks?

They give the guide a strong spread of typologies and geography: the river’s west bank (Wat Arun), the
old town (Wat Pho, Grand Palace), a hill temple (Golden Mount) and modern vertical Bangkok (Baiyoke).
Together they tell the city’s historical-to-contemporary story within one route.

### Are the entry fees and opening hours live?

No. They are a 2026 editorial snapshot. Temples change prices, hours and dress-code enforcement. Check
official sources before travelling. Corrections to the copy are welcome.

### Why is there no real map or satellite imagery?

Real imagery would introduce licensing, attribution and offline-weight problems, and would not match
the hand-built low-poly visual language. Every building, texture and landmark is procedural.

### Why does the walk mode need a keyboard?

Walking is spatial movement, not just looking. A keyboard gives continuous forward/strafe control and
is the only supported input for movement in this release. Touch users can drag to look, but should use
the drone or transit tour for the intended mobile experience.

### Is the mouse captured?

No. There is no pointer lock. Drag on the scene to look; the cursor stays visible and can reach the HUD,
drawer and landmark labels at any time.

### How do I zoom?

- Drone: scroll to change orbit distance; pinch on touch.
- Walk: scroll to change field of view.
- Transit: scroll to change field of view.
- The zoom is remembered between walk and transit; drone uses its own camera distance.

### Why does sound not start automatically?

Browsers block audio before a user gesture. Click **Enter the city** or the sound button. The sound
button is the speaker icon in the top bar.

### Does it work offline?

The app logic is local, but the first load needs internet for the Three.js/OrbitControls CDN and Google
Fonts. Without them, fonts fall back and the 3D library cannot start; a visible error is shown. There is
no service worker or offline package.

### Where is my progress stored?

In this browser profile under `bangkok3d.state.v1`: visited landmarks, route, notes, language, lighting,
mode and sound preference. Nothing is uploaded. Use **Save itinerary** for a portable
`bangkok_3d_tour.json`.

### Can I move my itinerary to another device?

Yes. **Save itinerary** downloads the JSON; **Load itinerary** imports it on another browser/device.
Notes are included in plain text. See [DATA_FORMAT.md](DATA_FORMAT.md).

### Why was my imported file rejected?

It must be valid JSON and contain at least one of `visited`, `itinerary` or `notes` in the documented
shape. A file that contains only unrelated metadata is not a route. Use a file exported by this app.

### Is any data collected?

No analytics, ads, accounts or project-owned backend. The page loads Three.js, OrbitControls and Google
Fonts from public CDNs; those hosts may receive normal request metadata. See [SECURITY.md](../SECURITY.md).

### Can I reuse the code or the screenshots?

Code is MIT licensed; see [LICENSE](../LICENSE). Screenshots are original renders and may be reused with
attribution. Landmark names are factual; no institutional logos are included. Fonts and Three.js retain
their own licences — see [THIRD_PARTY_NOTICES.md](../THIRD_PARTY_NOTICES.md).

### Why Three.js r128?

The app uses the classic, non-module OrbitControls build that attaches to the global `THREE`. Upgrading
requires replacing that integration and retesting all camera modes. The version is pinned deliberately;
see [ARCHITECTURE.md](ARCHITECTURE.md).

### Why is the scene sometimes slow in a headless browser?

Headless Chrome may use software WebGL (SwiftShader), which runs at a few frames per second. Use a
hardware-accelerated browser for a fair performance check. See [PERFORMANCE.md](PERFORMANCE.md).

### How do I add a landmark or a language?

Read [CONTRIBUTING.md](../CONTRIBUTING.md) and [ARCHITECTURE.md](ARCHITECTURE.md). Stable IDs, bilingual
parity, plaza/tour anchors and screenshots all need to agree.

### How do I verify a release?

Run the static check, the in-page self-test and the manual checklist in [TESTING.md](TESTING.md). The
current release expects **24 / 24**.
