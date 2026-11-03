# Performance

## Design target

A mid-range laptop or recent phone should hold a comfortable interactive frame rate in the drone and
walk modes, with the transit tour smooth enough to read as motion. The scene is deliberately low-poly
and uses shared materials and instancing rather than dense unique meshes.

No formal FPS budget is enforced in CI. The values below are design intentions, not measured guarantees
on every device.

## What is in the scene

- Five hand-authored landmark groups with a few hundred small meshes in total.
- Roughly 70–90 city blocks/parcels, depending on the randomised block fill.
- Eight shared facade material sets (colour + emissive canvas textures).
- Instanced trees (trunks and canopies), street lamps, lane dashes and cars (108 instances).
- Three animated boats.
- A custom water shader, sky shader, stars, sun/moon sprites and nine clouds.
- One 2048² directional shadow map covering the central city.
- Five accent point lights at night (no shadows).

The exact scene-child count varies slightly because parcels, trees and texture sets are randomised at
load. The self-test reports the current count through `window.Bangkok3D.getStats()`.

## Techniques in use

| Technique | Where |
| --- | --- |
| Shared unit box geometry and material arrays | Buildings |
| InstancedMesh | Trees, lamps, lane dashes, traffic |
| Shared canvas textures | Facades, neon, plaza, water glints |
| Pixel-ratio cap | `Math.min(devicePixelRatio, 2)` |
| Static shadow refresh | `shadowMap.autoUpdate = false`; updates on build/preset transitions |
| Low-segment procedural geometry | Prangs, roofs, chedis, trees |
| Fog + far-plane budget | Hides the edge of the diorama |
| Reduced shadow casters | Cars and markers do not cast moving shadows |
| Mobile FOV | Portrait viewports use a wider base FOV instead of a larger pixel budget |
| DOM throttling | Minimap redraws at ~11 Hz, not every frame |

## Costs to watch

1. **Landmark mesh count.** Wat Arun, the Grand Palace and the Golden Mount have many small decorative
   boxes and cones. Adding more corners or per-face detail increases draw calls quickly.
2. **Unique materials.** Each neon sign currently creates a texture/material. Keep sign count bounded.
3. **Transparent/additive objects.** Marker glows, lamp glow points and sprites are cheap in isolation
   but can cause overdraw when many overlap at night.
4. **Shadow map updates.** Leave `autoUpdate = false`. Continuous full-city shadows are the most
   expensive change you can make.
5. **DPR on 3× phones.** The cap at 2 protects fill rate; raising it is rarely worth the cost.
6. **Shader complexity.** The water shader is evaluated across a large plane. Extra noise octaves or
   texture lookups compound on integrated GPUs.

## Measuring

- Use Chrome DevTools Performance with hardware acceleration enabled; record one orbit, one walk and one
  tour stop.
- Check `renderer.info` from `window.Bangkok3D.renderer.info` for draw calls and triangles.
- Test at 1600×1000, 1280×800 and 430×900 with DPR 1, 2 and 3.
- Watch memory after repeated mode switches and drawer open/close cycles.
- Headless SwiftShader runs are useful for correctness, not frame timing.

## Known limits

- The scene is built synchronously across staged paint frames; first load can take a second or two on a
  slow device.
- Mobile walk needs a keyboard, so mobile performance is primarily drone/tour.
- There is no adaptive quality fallback or automatic shadow reduction on low-end GPUs.
- The 3D scene is not deferred or streamed; all geometry is generated at boot.
- The full 2048 shadow map and landmark detail are not reduced at narrow viewports.

## Future options

- A quality selector (shadows off / low / high, DPR cap, cloud count).
- Reduce the water plane segments or move to a normal-mapped material.
- Instance repeated roof details and chedi rings.
- Pause rendering when the tab is hidden or when the intro is the only visible layer.
- A simple FPS/quality diagnostic behind a debug flag, not in the main HUD.
