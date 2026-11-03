# Roadmap

The roadmap is intentionally small and honest. Items are not commitments or dates.

## Shipped

- Five procedural Bangkok landmarks with bilingual guides and visitor notes.
- Drone, drag-look walk and automated five-stop transit tour.
- EN/TH interface, stories and speech narration.
- Midday, golden-hour and neon-night lighting.
- Spatial Web Audio ambience and walking footsteps.
- Local storage, portable JSON export/import, minimap and responsive layout.
- 24-check in-page self-test, static CI and release documentation.

## Next

1. **Accessibility pass** — focus trap/return focus for the guide and help dialogs; a non-drag look
   alternative; contrast audit including Thai text.
2. **Quality selector** — shadows off/low/high, pixel-ratio cap and reduced effects for weaker GPUs.
3. **Touch walk control** — a simple on-screen stick/look pad for phones, or explicitly keep walk
   desktop-only and improve the guidance.
4. **More stop detail** — short audio pronunciations for Thai names, and a “nearby” view from each tour
   stop.
5. **Print/share card** — export a clean itinerary summary image or print stylesheet.

## Later

- Additional Bangkok landmarks (Wat Saket is already modelled; Wat Benchamabophit, Chinatown gate,
  ICONSIAM or the Memorial Bridge are candidates) with a route that still fits one readable scene.
- A second city using the same engine, with a documented city-data interface.
- WebXR/viewer mode for headsets, if it can be done without breaking the no-build constraint.
- Optional PWA shell with a deliberate cache-versioning strategy.
- Localisation framework for a third language (the current two are hard-coded by design).

## Explicit non-goals

- A navigation or GIS product, live ticket/hotel booking, or real-time opening hours.
- Photo-real reconstruction, scanned assets or satellite imagery.
- User accounts, cloud sync, social features or analytics.
- A general-purpose game engine or editor UI.
- Mobile-first first-person movement without a deliberate control redesign.

## How to influence the roadmap

Open a feature request with the problem, the user affected and the smallest useful version. Read
[CONTRIBUTING.md](../CONTRIBUTING.md) and [ARCHITECTURE.md](ARCHITECTURE.md) first; changes that break
the no-build/static constraint or bilingual parity need a strong case.
