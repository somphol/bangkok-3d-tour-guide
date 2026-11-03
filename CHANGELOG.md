# Changelog

All notable changes to **Bangkok 3D — Interactive Urban Tourist Guide & Explorer Studio** are
documented here. The format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/) and the
project uses [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

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
