# Contributing to Bangkok 3D

Thanks for taking the time to improve the guide. This is a small, deliberately dependency-free static
project; the best contributions are focused, tested and easy to review.

## Before you start

- Read [README.md](README.md), [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) and
  [AGENTS.md](AGENTS.md).
- By participating you agree to the [Code of Conduct](CODE_OF_CONDUCT.md).
- Security issues should follow [SECURITY.md](SECURITY.md), not a public issue.
- For questions and setup help, see [SUPPORT.md](SUPPORT.md).

## Local workflow

There is no install step and no build step.

```sh
cd bangkok-3d-tour-guide
python3 -m http.server 8000
open http://127.0.0.1:8000/
```

Useful checks:

```sh
node --check script.js
node scripts/verify-static.mjs
open 'http://127.0.0.1:8000/?selftest=1'
```

The browser self-test must stay at **24 / 24** (or higher if you add checks and update the documented
count everywhere). The static check also runs in GitHub Actions.

## What to change

The project is intentionally plain:

- `index.html`, `style.css`, `script.js` — the application.
- `docs/` — long-form documentation.
- `screenshots/` — release renders.
- Root policies and metadata — changelog, contributing, security, support, licence, notices.

Keep new runtime dependencies out unless there is a compelling reason. The site must keep working from
GitHub Pages and directly from disk. Three.js is pinned to r128; upgrading it means replacing the
non-module OrbitControls integration and retesting all three camera modes.

## Code style

- ES2019+ in one IIFE, strict mode, no bundler, no framework.
- Two-space indentation, single quotes, semicolons, trailing commas only where already used.
- Prefer small named functions and the existing helper vocabulary (`addBox`, `hipRoofMesh`, `damp`,
  `clamp`, `tf`).
- Never use `innerHTML` with user-controlled text. Imported notes are plain strings.
- English identifiers and comments; all user-facing copy goes through `I18N`.
- Add both `en` and `th` values for every new UI string and every landmark field. Bilingual parity is a
  hard invariant.
- Keep coordinates in the existing system: X east–west, Z north–south, Y up, river near `x = -26`.
- Keep the state schema and `bangkok_3d_tour.json` backwards-compatible. Additive fields only unless a
  migration and a version bump are included.

## Adding or editing a landmark

1. Update `LANDMARKS` in `script.js`: stable `id`, `index`, position, plaza radius, marker height,
   focus/fly-to view, tour point, tour view and both language objects.
2. Add a builder to `BUILDERS`; reuse the geometry helpers and shared materials.
3. Update the tour stop data if the route should visit it, and check that stop ordering remains valid.
4. Update the guide copy, tips and any self-test count.
5. Recapture the relevant screenshot under `screenshots/` (1600 px JPEG).
6. Run `node --check`, the static check and the in-page self-test; walk and fly to the new landmark.

Do not move existing landmark IDs: visited stamps, routes, notes and exported JSON depend on them.

## Pull requests

Open a pull request using the template. Include:

- What changed and why.
- The verification you ran (commands, self-test result, browser/OS).
- Screenshots for user-visible changes.
- Whether data formats, controls or documentation changed.

Keep pull requests focused. If a change touches controls, state, export or the tour, call that out
explicitly.

## Commit messages

Use a short imperative subject, optionally with a scope:

```text
tour: keep the camera above the bridge deck
docs: add data-format reference
walk: ignore secondary mouse buttons while dragging
```

## Release process

See [docs/RELEASE_CHECKLIST.md](docs/RELEASE_CHECKLIST.md). Documentation changes should update the
[CHANGELOG.md](CHANGELOG.md) when they affect users or the public contract.
