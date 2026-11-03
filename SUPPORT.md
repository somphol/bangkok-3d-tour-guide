# Support

## Start here

- **Live demo:** <https://somphol.github.io/bangkok-3d-tour-guide/>
- **Feature and controls guide:** [README.md](README.md), [docs/CONTROLS.md](docs/CONTROLS.md)
- **FAQ:** [docs/FAQ.md](docs/FAQ.md)
- **Build and test instructions:** [docs/TESTING.md](docs/TESTING.md)
- **Data and export format:** [docs/DATA_FORMAT.md](docs/DATA_FORMAT.md)

## Quick troubleshooting

| Symptom | Likely cause / fix |
| --- | --- |
| Nothing renders; a WebGL message appears | Hardware acceleration or WebGL 2 is unavailable. Try a current Chrome, Safari, Edge or Firefox. |
| Three.js or fonts fail to load | The page needs internet for the CDN and Google Fonts. Check the network or a content blocker. |
| Sound is silent | Browsers require a gesture. Click **Enter the city** or the sound toggle; check the tab is not muted. |
| Walk mode feels stuck | Click a mode button again, or drag on the scene (not the UI). The cursor is no longer captured. |
| Zoom does nothing in Walk/Tour | Use the scroll wheel over the scene. In drone mode, scroll zooms the orbit distance. |
| My notes disappeared | Data is stored per browser/profile under `localStorage` key `bangkok3d.state.v1`. Use **Save itinerary** for a portable backup. |
| Imported file is rejected | It must contain `visited`, `itinerary` or `notes` in the documented shape. See `docs/DATA_FORMAT.md`. |
| Self-test shows a failure | Include the failed check names and console output in a bug report. |

## Self-test

Open:

```text
https://somphol.github.io/bangkok-3d-tour-guide/?selftest=1
```

The panel should report **24 / 24** on the current release. It checks scene construction, landmarks,
bilingual parity, tour order, lighting, controls, colliders, traffic, shaders, state round-tripping,
export schema, notes, minimap, audio class, WebGL and mode/language switching.

## Reporting a bug

Open an issue using the **Bug report** template:

<https://github.com/somphol/bangkok-3d-tour-guide/issues/new/choose>

Include:

- What you expected and what happened.
- Exact steps, including camera mode and language.
- Browser, operating system and device.
- Whether the self-test passes and any failed check names.
- Console errors (open DevTools → Console).
- A screenshot or short recording if the problem is visual.
- Whether you had imported an itinerary file.

Do not attach private notes from your personal itinerary unless you are comfortable sharing them.
Redact any personal travel information.

## Feature requests

Use the **Feature request** template. Explain the user problem, not only the widget you want. The
roadmap and design constraints are in [docs/ROADMAP.md](docs/ROADMAP.md).

## What support is available

This is a personal open-source project maintained on a best-effort basis. There is no commercial SLA,
no guaranteed response time and no support for modified forks. Good bug reports and reproducible
examples are the fastest way to get help.

## Security

Never report a vulnerability in a public issue. See [SECURITY.md](SECURITY.md).
