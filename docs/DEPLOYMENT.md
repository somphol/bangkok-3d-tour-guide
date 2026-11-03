# Deployment

## Model

The site is fully static and has no build output. Deployment is a GitHub Pages publish of the
repository root:

- Repository: <https://github.com/somphol/bangkok-3d-tour-guide>
- Branch: `main`
- Folder: `/`
- Live URL: <https://somphol.github.io/bangkok-3d-tour-guide/>
- `.nojekyll` is present so files are served verbatim.

GitHub Pages serves `index.html`, `style.css`, `script.js`, `screenshots/`, `state.json`, and the
documentation files. The Three.js and font CDNs are loaded by the visitor’s browser, not by the Pages
build.

## Local preview

```sh
cd bangkok-3d-tour-guide
python3 -m http.server 8000
open http://127.0.0.1:8000/
```

The page also opens directly from `file://`, but the CDN scripts and Google Fonts need internet access.
A local HTTP server is closer to the deployed environment.

## First-time setup

1. Create the public repository.
2. Push `main` with at least `index.html`.
3. Settings → Pages → Build and deployment:
   - Source: **Deploy from a branch**
   - Branch: `main`
   - Folder: `/ (root)`
4. Wait for the Pages build to report **built**.
5. Open the live URL and run `?selftest=1`.
6. Set the repository homepage to the live URL and add topics such as `threejs`, `bangkok`, `3d`,
   `tourism`, `webgl`, `bilingual`.

## Routine release

```sh
# 1. version and copy
#    bump APP.version in script.js, CHANGELOG.md, state metadata as applicable

# 2. checks
node --check script.js
node scripts/verify-static.mjs
open 'http://127.0.0.1:8000/?selftest=1'

# 3. review and commit
git status
git diff
git add -A
git commit -m "release: v1.1.0"

# 4. tag and push
git tag -a v1.1.0 -m "Bangkok 3D v1.1.0"
git push origin main
git push origin v1.1.0
```

Then:

1. Create a GitHub Release from the tag, using the matching `CHANGELOG.md` section as notes.
2. Wait for the Pages build.
3. Verify:
   - `/` returns 200 with the correct title;
   - `/style.css` and `/script.js` return 200;
   - `/state.json` matches the release;
   - `?selftest=1` reports the documented pass count;
   - drag-to-look and wheel zoom work in Walk;
   - a marker opens the guide;
   - export downloads `bangkok_3d_tour.json`.
4. Record the deployed URL and verification result in `STATE.md` if the release is significant.

## Cache and CDN behaviour

- GitHub Pages serves through a CDN. A new build can take a minute to appear; append a cache-busting
  query (`?v=...`) when checking.
- `index.html` pins:
  - `https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js`
  - `https://cdn.jsdelivr.net/npm/three@0.128.0/examples/js/controls/OrbitControls.js`
- Google Fonts supplies Chonburi, Kanit and Cormorant Garamond. An offline/blocked CDN leaves the app
  with fallback fonts and a visible WebGL/library error if Three.js is unavailable.
- `index.html` references `style.css?v=1.2.0` and `script.js?v=1.2.0`. Bump these query strings with
  every release so browsers cannot mix a new HTML shell with an old script. The static check enforces
  the match.
- Do not add a service worker without a cache-versioning plan; stale HTML plus new `script.js` is a
  common failure mode.

## Rollback

The site is a static commit; roll back by reverting the release commit and pushing:

```sh
git revert <release-commit>
git push origin main
```

or move the Pages branch to the previous known-good commit through the GitHub UI. The previous
deployment remains in git history; no database migration is involved.

## Custom domain

If a custom domain is added:

1. Add a `CNAME` file at the repository root containing the domain.
2. Configure the DNS record (apex `A`/`AAAA` or `CNAME` for `www`).
3. Enable HTTPS in Pages and wait for the certificate.
4. Update the canonical URL, Open Graph URLs and `sitemap.xml`.

Do not commit a `CNAME` for a domain you do not control.

## Release artefacts

| Artefact | Location |
| --- | --- |
| Source | repository `main` |
| Screenshots | `screenshots/` |
| Build/token record | `state.json`, `STATE.md` |
| Changelog | `CHANGELOG.md` |
| Licence | `LICENSE` |
| Third-party notices | `THIRD_PARTY_NOTICES.md` |
| Policies | `CONTRIBUTING.md`, `CODE_OF_CONDUCT.md`, `SECURITY.md`, `SUPPORT.md`, `PRIVACY.md` |
| Citation | `CITATION.cff` |
| Templates | `.github/ISSUE_TEMPLATE/`, `.github/PULL_REQUEST_TEMPLATE.md` |
| CI | `.github/workflows/static-check.yml` |

## Environment constraints

- No npm install, no secrets and no environment variables are required.
- The GitHub Actions check only needs Node 22 and the repository contents.
- GitHub Pages must remain public for the free deployment; the site has no private data.
- The repository must not contain a token, key or personal travel file. See
  [SECURITY.md](../SECURITY.md).
