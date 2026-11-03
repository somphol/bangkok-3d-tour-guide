# Privacy

Bangkok 3D is a static browser experience. It has no account system, backend, database, analytics,
advertising, tracking pixels or cookies owned by this project.

## What stays on your device

- **Progress** — visited landmarks, route IDs, private notes, language, lighting preset, camera mode and
  sound preference are stored in `localStorage` under `bangkok3d.state.v1`.
- **Exported itinerary** — `bangkok_3d_tour.json` is created locally with a Blob URL and downloaded by
  your browser. It contains your visited IDs, route, notes and app metadata. The app never uploads it.
- **Imported itinerary** — the file is parsed locally with the File API. Its contents are not sent
  anywhere.
- **No server-side profile** — clearing site data, using a private window, or clearing the browser
  profile removes the saved state. The app cannot recover it.

## Network requests

The deployed page loads these third-party resources:

| Host | Resource | Purpose |
| --- | --- | --- |
| `cdnjs.cloudflare.com` | Three.js r128 | WebGL renderer |
| `cdn.jsdelivr.net` | OrbitControls r128 | Drone camera controls |
| `fonts.googleapis.com` | Font CSS | Chonburi, Kanit, Cormorant Garamond |
| `fonts.gstatic.com` | Font files (referenced by the CSS) | Glyph delivery |

Those hosts receive ordinary HTTP request metadata (IP address, user agent, referrer, timing) under
their own policies. This project does not add query parameters containing personal data and does not
contact any other service at runtime. There is no analytics endpoint to disable.

If you fork or self-host, review the third-party requests you add. See
[SECURITY.md](SECURITY.md) for host-level hardening suggestions.

## What is not collected

- No names, email addresses, accounts or passwords.
- No location/GPS, contacts, camera, microphone or sensor data.
- No advertising identifiers or cross-site tracking.
- No private notes are transmitted to the maintainer or any third party.
- No cookies are set by this application.

## Children

The experience is a general-audience travel guide, not directed at children under 13. It does not
knowingly collect personal information from anyone. Notes are local and user-authored.

## Retention and deletion

Local state remains until you clear it. There is no remote copy to delete. To erase progress:

1. Use the browser’s site-data settings for the origin, or
2. Run `localStorage.removeItem('bangkok3d.state.v1')` in DevTools, or
3. Use a private window.

Exported JSON files are under your control; delete them like any other document.

## Changes

Material privacy changes will be recorded in [CHANGELOG.md](CHANGELOG.md). This project has no mailing
list or account to notify; the repository history is the record.

## Contact

Questions about this policy can be raised as a normal issue or through the contact options on the
maintainer’s [GitHub profile](https://github.com/somphol). Do not post private itinerary contents in a
public issue.
