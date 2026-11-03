## Summary

What changed, and why?

## Type

- [ ] Bug fix
- [ ] Feature
- [ ] Controls / interaction
- [ ] Data format / state
- [ ] Documentation / release
- [ ] Performance / accessibility

## Verification

- [ ] `node --check script.js`
- [ ] `node scripts/verify-static.mjs`
- [ ] In-page self-test: `____ / 24` (or current documented count)
- [ ] Desktop browser: `________________`
- [ ] Narrow viewport: `________________`
- [ ] Drone / Walk / Transit checked

Notes:

```text
Paste console errors or failure output here. Remove private data.
```

## Screenshots

Before/after images for visual changes.

## Compatibility checklist

- [ ] Landmark IDs, `bangkok3d.state.v1` and `bangkok_3d_tour.json` remain compatible.
- [ ] Every new UI string and landmark field exists in both English and Thai.
- [ ] Coordinates still follow X east–west, Z north–south, Y up.
- [ ] Walk look remains drag-based (no pointer lock) unless this PR is an explicitly reviewed control redesign.
- [ ] Docs/changelog updated if user-visible behaviour changed.
- [ ] No secrets, tokens, personal notes or browser profiles are committed.
