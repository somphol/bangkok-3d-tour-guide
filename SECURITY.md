# Security Policy

## Supported versions

| Version | Supported |
| --- | --- |
| 1.1.x | Yes |
| 1.0.x | Best effort |
| < 1.0 | No |

## Reporting a vulnerability

Please **do not open a public issue** for a security problem.

Preferred route: use GitHub’s **private vulnerability reporting** on the repository’s Security tab
(“Report a vulnerability”). If that is unavailable, contact the maintainer through the contact options
on <https://github.com/somphol> and include a short private summary.

Please include:

- The affected version or commit.
- Browser, operating system and device.
- A description of the impact and a minimal reproduction.
- Whether the issue is in this project or in a third-party CDN dependency.
- Any suggested fix, if you have one.

You can expect an acknowledgement on a best-effort basis. This is a personal open-source project with
no security team or SLA. Please allow time for a fix and coordinated disclosure; do not publish details
before a fix or mitigation is available.

## Scope

Bangkok 3D is a **static client-side application**. There is no server, account system, database,
analytics, advertising, cookie or remote API owned by this project. The production page loads Three.js
and OrbitControls from public CDNs and fonts from Google Fonts.

In scope:

- Cross-site scripting or DOM injection through imported itinerary files or notes.
- Unsafe handling of `localStorage` data.
- Logic that could expose a user’s private notes or exported file unexpectedly.
- Supply-chain risk introduced by the pinned CDN URLs or the build-less deployment.
- A regression that allows the page to send data to an unexpected third party.

Out of scope / not considered vulnerabilities:

- The stylised geography, landmark positions, fees, opening hours or historical copy being inaccurate
  or out of date. These are editorial content issues; use a normal issue.
- Browsers blocking audio until a user gesture, or WebGL being unavailable.
- Performance on software rendering or very old devices.
- Losing `localStorage` through private browsing, storage eviction or clearing site data.
- Reports that only say “missing CSP” without a concrete exploit; the static host controls headers.
  Hardening suggestions are still welcome as normal issues.
- Third-party vulnerabilities that are already fixed in a newer Three.js release but not exploitable in
  this build. Please report the dependency anyway; it will be triaged.

## Security design notes

- All user-generated content is stored as plain text and rendered with `textContent`, never as HTML.
- Imported JSON is shape-checked; unknown landmark IDs are dropped and notes are capped at 4,000
  characters.
- There are no secrets, API keys, tokens or credentials in the repository or the client bundle.
- The app does not make network requests for user data. The only outbound requests are the pinned
  Three.js/OrbitControls files and the Google Fonts stylesheet.
- The export file is created locally with a Blob URL and is never uploaded.

## Hardening opportunities for hosts

If you fork and deploy this, consider adding at the hosting layer:

- `Content-Security-Policy` allowing only the CDNs actually used.
- `Permissions-Policy` that disables sensors and payment APIs.
- HSTS and a strict referrer policy (GitHub Pages already provides HTTPS).
- Subresource Integrity for the pinned Three.js and OrbitControls files, after verifying the hashes.

## Third-party dependencies

See [THIRD_PARTY_NOTICES.md](THIRD_PARTY_NOTICES.md). Three.js r128 is pinned deliberately because the
project uses the classic-script OrbitControls integration. Upgrading is a compatibility change, not a
routine dependency bump; test all three camera modes and the self-test after any upgrade.
