# Data Format

Bangkok 3D keeps progress in the browser and can export a portable JSON file. There is no server,
account or sync service.

## localStorage

| Key | Value |
| --- | --- |
| `bangkok3d.state.v1` | JSON object with the current session state |

Example:

```json
{
  "version": 1,
  "lang": "en",
  "preset": "golden",
  "mode": "drone",
  "audio": true,
  "visited": ["wat-arun", "wat-pho"],
  "itinerary": ["wat-arun", "grand-palace"],
  "notes": {
    "wat-arun": "Go at 17:00 for the last light.",
    "wat-pho": "Massage school is behind the main hall."
  }
}
```

| Field | Type | Meaning |
| --- | --- | --- |
| `version` | number | Storage schema version. Currently `1`. |
| `lang` | `"en"` \| `"th"` | Interface and guide language. |
| `preset` | `"day"` \| `"golden"` \| `"night"` | Lighting preset. |
| `mode` | `"drone"` \| `"walk"` \| `"tour"` | Last camera mode. |
| `audio` | boolean | Whether ambience is enabled. |
| `visited` | string[] | Landmark IDs marked visited; deduplicated on load. |
| `itinerary` | string[] | Landmark IDs on the custom route, in click order. |
| `notes` | object | Map of landmark ID → plain-text note, capped at 4,000 characters. |

Valid landmark IDs:

```text
wat-arun
wat-pho
grand-palace
golden-mount
baiyoke
```

Unknown IDs are dropped when state is loaded or imported. Invalid languages/presets/modes fall back to
`en`/`day`/`drone`.

## Exported itinerary

**Button:** 💾 Save itinerary  
**Filename:** `bangkok_3d_tour.json`  
**MIME type:** `application/json`  
**Created:** locally with a Blob URL; never uploaded.

Example:

```json
{
  "app": "Bangkok 3D — Interactive Urban Tourist Guide & Explorer Studio",
  "appVersion": "1.1.0",
  "city": "Bangkok",
  "exportedAt": "2026-11-03T04:30:00.000Z",
  "language": "en",
  "preset": "golden",
  "visited": ["wat-arun", "wat-pho"],
  "itinerary": ["wat-arun", "grand-palace"],
  "notes": {
    "wat-arun": "Go at 17:00 for the last light.",
    "wat-pho": "Massage school is behind the main hall."
  },
  "stats": {
    "visitedCount": 2,
    "totalLandmarks": 5,
    "itineraryCount": 2,
    "noteCount": 2
  },
  "credits": {
    "harness": "OpenCode",
    "model": "DeepSeek V4.1 Flash",
    "graphics": "Three.js r128"
  }
}
```

| Field | Required on import | Notes |
| --- | --- | --- |
| `app` | No | Informational. |
| `appVersion` | No | Informational; import does not require a version match. |
| `city` | No | Informational. |
| `exportedAt` | No | ISO-8601 timestamp. |
| `language` | No | Also accepts `lang`. |
| `preset` | No | Falls back to current preset. |
| `visited` | Shape trigger | Array of landmark IDs. |
| `itinerary` | Shape trigger | Array of landmark IDs. |
| `notes` | Shape trigger | Object of string notes. |
| `stats` | No | Recomputed by the UI; informational. |
| `credits` | No | Informational. |

At least one of `visited`, `itinerary` or `notes` must be present for a file to be accepted.

## Import rules

**Button:** 📂 Load itinerary → file picker.

The importer accepts either the flat export above or a wrapped object:

```json
{ "state": { "visited": ["wat-arun"], "notes": { "wat-arun": "Hello" } } }
```

Processing:

1. Parse JSON. Invalid JSON → “That file is not a Bangkok 3D route.”
2. Choose `data.state` if present, otherwise the root object.
3. Require at least one known array/object key.
4. Merge the imported values over the current state:
   - `visited` and `itinerary` are replaced, not appended.
   - `notes` is replaced as a whole with the imported notes object.
   - `language`/`lang` and `preset` are applied when valid.
   - `audio` and `mode` remain the current device’s values.
5. Deduplicate arrays, drop unknown landmark IDs, cap each note at 4,000 characters.
6. Save to `localStorage`, re-render progress, list, labels, preset and language.
7. Show “Itinerary restored. Welcome back.”

A missing `visited`/`itinerary`/`notes` key in an accepted file is treated as an empty replacement for
that field, so export first if you want to keep existing progress.

## Versioning and compatibility

- The storage key is versioned: `bangkok3d.state.v1`.
- Exported files remain readable across point releases. New optional fields may be added.
- A breaking data change requires a new storage key and a migration path; do not silently change the
  meaning of existing IDs.
- `appVersion` is informational and not used as a gate.
- The browser keeps the last state even if the tab is closed. Clearing site data removes it.

## Privacy

- Notes are private to the browser profile; the app never transmits them.
- Exported files contain your notes in plain text. Treat them as personal travel data.
- Imported files are parsed locally; no request is made with their contents.
- Avoid attaching a real personal itinerary to a public issue. See [SECURITY.md](../SECURITY.md) and
  [SUPPORT.md](../SUPPORT.md).
