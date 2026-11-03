# Release Checklist

Use this before tagging a version. The repository is static; the release is the commit, the tag, the
GitHub Release and the Pages deployment.

## 1. Scope and version

- [ ] Decide the semantic version: patch for fixes, minor for compatible features, major for breaking
      contracts (state schema, exported format, landmark IDs).
- [ ] Update `APP.version` in `script.js`.
- [ ] Update `packageVersion`/`projectVersion` in `state.json` if present.
- [ ] Move the relevant notes into a dated `CHANGELOG.md` section; link the compare URL.
- [ ] Update the README badge/version references if they mention a version.

## 2. Documentation

- [ ] `README.md` reflects current controls, modes and data.
- [ ] `AGENTS.md` is still accurate for the next maintainer.
- [ ] `docs/CONTROLS.md` matches the actual input handlers.
- [ ] `docs/DATA_FORMAT.md` matches the export/import code.
- [ ] `docs/TESTING.md` names the current self-test count and checks.
- [ ] `docs/DEPLOYMENT.md`, `SECURITY.md`, `SUPPORT.md`, `CONTRIBUTING.md` are current.
- [ ] No secrets, tokens, personal notes or exported itineraries are staged.

## 3. Automated and manual verification

```sh
node --check script.js
node scripts/verify-static.mjs
python3 -m json.tool state.json > /dev/null
```

- [ ] Self-test passes at the documented count (`?selftest=1`).
- [ ] Drone drag, wheel zoom and right-drag pan work.
- [ ] Walk drag-look works; cursor is not captured; wheel zoom works.
- [ ] No drag opens a guide accidentally; a plain click on a marker does.
- [ ] Tour next/pause/replay works; wheel zoom does not break the route.
- [ ] All three lighting presets render and transition.
- [ ] EN/TH switch updates header, list, drawer and tour bar.
- [ ] Visited/route/notes persist after reload.
- [ ] Export downloads `bangkok_3d_tour.json`; import restores it.
- [ ] 430 × 900 mobile layout is usable.
- [ ] No console errors in a normal run.
- [ ] Screenshots are current; no raw PNG captures are committed.

## 4. Repository state

- [ ] `git status` is clean after the release commit.
- [ ] `git diff --stat` contains only intentional changes.
- [ ] `state.json` valid; `STATE.md` revision section current.
- [ ] `CHANGELOG.md` top section matches the tag.
- [ ] `LICENSE`, `THIRD_PARTY_NOTICES.md`, `CODE_OF_CONDUCT.md`, `SECURITY.md`, `SUPPORT.md` present.
- [ ] `.github` templates and workflow present; static check passes.

## 5. Tag and publish

```sh
git add -A
git commit -m "release: vX.Y.Z"
git tag -a vX.Y.Z -m "Bangkok 3D vX.Y.Z"
git push origin main
git push origin vX.Y.Z
```

- [ ] Create the GitHub Release from the tag using the changelog section.
- [ ] Confirm the Pages build reports **built**.
- [ ] Verify the live page and `?selftest=1`.
- [ ] Check the live `state.json` and a screenshot URL return 200.
- [ ] Confirm the repository is public, homepage points to Pages, and topics are set.
- [ ] Record the live URL and verification in `STATE.md` if it is a significant release.

## 6. Post-release

- [ ] If a regression is found, revert the release commit or publish a patch; do not rewrite a public
      tag.
- [ ] Keep the previous release notes and screenshots reachable in git history.
- [ ] Update the roadmap if the release changes priorities.
