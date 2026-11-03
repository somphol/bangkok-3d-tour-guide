# Changelog

All notable changes to **Bangkok 3D — Interactive Urban Tourist Guide & Explorer Studio** are
documented here. The format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/) and the
project uses [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.1.3] — 2026-11-03

### Added

- **On-screen walking arrow pad** for Walk mode. Hold ↑ / ↓ / ← / → with a mouse or touch to move;
  a physical keyboard is no longer required.
- Local CSS/JS cache-busting query strings tied to the app version.

### Fixed

- Walk-mode clicks now select only the small floating landmark markers. The broad invisible landmark
  volumes could previously open the guide from an ordinary scene click, pausing movement.
- The walk hint, mobile notice and accessibility/FAQ copy now describe pointer-free, keyboard-optional
  walking accurately.

### Changed

- Walk controls are documented as: on-screen pad, arrow keys, or WASD; drag to look; scroll to zoom.

[1.1.3]: https://github.com/somphol/bangkok-3d-tour-guide/compare/v1.1.2...v1.1.3

## [1.1.2] — 2026-11-03

### Fixed

- Restored reliable walking after interacting with the guide drawer or notes field. Focus returns to the
  scene, and a hidden textarea can no longer swallow walk keys.
- Arrow keys now prevent the page from scrolling while walk mode is active.
- Movement keys are focused on the scene after switching modes and closing overlays.

### Changed

- Walk hints and documentation now present **arrow keys** and WASD as equal options:
  `↑ ↓ ← →` / `W A S D`.

[1.1.2]: https://github.com/somphol/bangkok-3d-tour-guide/compare/v1.1.1...v1.1.2

## [1.1.1] — 2026-11-03

### Fixed

- Inverted the horizontal walk drag direction to match the landscape-grab model: dragging left now
  brings the right side of the scene into view, and dragging right brings the left side into view.
  Vertical look and all zoom behaviour are unchanged.

### Changed

- Patch version metadata to `1.1.1`.

[1.1.1]: https://github.com/somphol/bangkok-3d-tour-guide/compare/v1.1.0...v1.1.1

## [1.1.0] — 2026-11-03

### Added

- Scroll-wheel **field-of-view zoom** in Walk and Transit modes; the drone continues to zoom by
  OrbitControls distance.
- Complete release documentation: architecture, controls, data format, testing, deployment,
  accessibility, performance, FAQ, roadmap and release checklist.
- GitHub issue/PR templates, CODEOWNERS, EditorConfig, gitattributes and a dependency-free static CI
  workflow.
- A 24th self-test check covering drag-look and zoom controls.

### Changed

- Walk mode no longer captures the mouse. Look around by **dragging normally on the scene**; the cursor
  remains visible and usable for UI and landmark selection.
- Walk hints, help copy, controls docs and screenshots reflect drag-to-look.
- App metadata and export `appVersion` moved to `1.1.0`.

### Removed

- PointerLockControls and all pointer-lock code paths, including the “click to look around” flow and
  Escape-to-release behaviour. The Three.js OrbitControls CDN file remains.

### Fixed

- Releasing the mouse no longer leaves the interface in an ambiguous captured state.
- Walk hint now dismisses on first drag or after seven seconds instead of waiting for pointer lock.

## [1.0.0] — 2026-11-03

### Added

- Initial public release: five procedural Bangkok landmarks (Wat Arun, Wat Pho, Grand Palace, Golden
  Mount, Baiyoke Tower II), procedural city, river shader, traffic, boats, parks and bridges.
- Drone, first-person and automated transit camera modes.
- Bilingual English/Thai UI, stories, visitor tips and speech narration.
- Midday, golden-hour and neon-night lighting presets.
- Synthesised spatial Web Audio ambience and distance-synced footsteps.
- Visited landmarks, custom route, notes, localStorage autosave and JSON export/import as
  `bangkok_3d_tour.json`.
- Live minimap, responsive mobile layout, 23-check self-test, screenshots, licence, notices, robots,
  sitemap and GitHub Pages deployment.

[1.1.0]: https://github.com/somphol/bangkok-3d-tour-guide/compare/v1.0.0...v1.1.0
[1.0.0]: https://github.com/somphol/bangkok-3d-tour-guide/releases/tag/v1.0.0
