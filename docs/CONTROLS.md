# Controls

Bangkok 3D has no pointer lock and no hidden mouse capture. The cursor stays visible and usable for the
interface at all times.

## Camera modes

| Mode | Shortcut | How the camera moves |
| --- | --- | --- |
| Drone flyover | `1` | Orbit drag, wheel zoom, right-drag pan |
| Street walk | `2` | Drag to look, arrow keys or WASD to walk, wheel to zoom |
| Transit tour | `3` | Automated spline; wheel changes field of view |

## Drone mode

| Input | Action |
| --- | --- |
| Left-drag | Orbit around the current target |
| Wheel / trackpad scroll | Zoom in and out (changes orbit distance) |
| Right-drag | Pan the target across the city |
| Middle-drag | Pan (if the browser maps it) |
| `R` | Recenter to the opening river view |
| Landmark list item | Open its guide and fly to its camera view |
| “Fly here” | Fly to the landmark of the open guide |
| Click a marker/label | Open the landmark guide |

The drone is constrained between 16 and 270 units from its target, with the polar angle kept above the
ground plane so the camera cannot roll under the city.

## Street walk

Walk mode uses ordinary **drag-to-look**. There is no pointer capture.

| Input | Action |
| --- | --- |
| Left-drag on the scene | Look around; the cursor remains visible |
| `↑` `↓` `←` `→` or `W` `A` `S` `D` | Walk forward/back and strafe |
| `Shift` | Run |
| Scroll wheel | Zoom in/out by changing the field of view |
| `E` | Open the nearest landmark within 30 units |
| Click without dragging | Select a marker or label under the cursor |
| Click the guide/list | Open the visitor drawer |
| `2` again | Re-enter walk mode at the saved position |

Arrow keys are the simplest option if you do not use WASD. Both are supported. Walking is blocked by buildings, trees, temple bases and the riverbank. The walkable area is the east
bank; there is no bridge walking in this release. The look hint appears on entry, dismisses on the first
drag, and auto-hides after seven seconds.

### Drag feel

- Horizontal drag follows a **grab-the-landscape** model: drag left to bring the right side into view,
  drag right to bring the left side into view.
- Drag down to look down and drag up to look up.
- Pitch is clamped to about ±83° so the camera cannot flip over.
- Sensitivity scales with the current zoom, so a zoomed-in view is easier to aim.
- Releasing the mouse, switching mode, opening the guide, losing focus or hiding the tab ends the drag
  cleanly.

## Transit tour

The camera follows a Catmull-Rom route from the southern Chao Phraya through Rattanakosin and inland to
Baiyoke. It pauses at five landmarks.

| Input | Action |
| --- | --- |
| `Space` or the pause button | Pause / resume |
| `N` or **Next** | Jump to the next stop |
| Scroll wheel | Zoom the field of view |
| Click a marker/label | Open the guide; the tour pauses while the drawer is open |
| Mode button | Leave the tour; progress is retained for the session |

When the final stop finishes, the bar shows **Tour complete**; the play button becomes a replay button.

## Zoom ranges

- Drone: OrbitControls distance, 16–270 units.
- Walk and transit: field of view = base × zoom, where zoom is 0.6–1.8 and base is 48° on landscape
  or 62° on a portrait/narrow viewport. The result is clamped to 26–86°.
- The zoom level is remembered when moving between walk and transit; drone always uses its own base FOV.

## Global keyboard shortcuts

| Key | Action |
| --- | --- |
| `1` / `2` / `3` | Drone / Walk / Transit |
| `L` | Switch English ⇄ ไทย |
| `T` | Cycle Midday → Golden hour → Neon night |
| `M` | Mute / unmute ambience |
| `H` or `?` | Open help |
| `R` | Recenter the drone |
| `Esc` | Close the guide drawer, then help |

Shortcuts are ignored while typing in the notes field. When a drawer or help dialog is open, only `Esc`
is handled; the underlying camera shortcuts are paused.

## Markers, labels and the guide

- Floating markers bob above each landmark. Hover (in drone/walk) shows a tooltip; click opens the
  bilingual drawer.
- Clicking a landmark name in the trail panel opens the guide and flies the drone there.
- The drawer supports:
  - **Mark visited** / **Visited ✓**
  - **Add to route** / **On your route ✓**
  - private notes, saved automatically
  - **Listen to the story** device narration
  - previous/next landmark navigation
  - **Fly here**
- Labels are hidden at narrow widths; use the trail panel instead.

## Trail panel, minimap and files

| Action | Where |
| --- | --- |
| Show/hide the landmark panel | Panel close button, or the trail button on narrow screens |
| Recenter the drone | Crosshair button below the minimap |
| Save a portable itinerary | **Save itinerary** → `bangkok_3d_tour.json` |
| Restore an itinerary | **Load itinerary** → file picker |
| Read progress | Visited count and route count in the trail panel |

## Touch devices

- Drone: one-finger orbit, pinch zoom, two-finger pan (OrbitControls).
- Transit: touch controls can select UI; wheel zoom is unavailable, but the tour runs automatically.
- Walk: the scene can be dragged to look, but movement needs a physical keyboard. The HUD shows a
  notice and recommends drone or transit.
- Markers and labels are tappable.

## URL parameters

These are intended for screenshots, QA and links into a specific view.

| Parameter | Example | Effect |
| --- | --- | --- |
| `reset=1` | `?reset=1` | Clear saved state before boot |
| `autostart=1` | `?autostart=1` | Skip the title screen |
| `mode` | `?mode=walk` | `drone`, `walk` or `tour` |
| `preset` | `?preset=night` | `day`, `golden` or `night` |
| `lang` | `?lang=th` | `en` or `th` |
| `drawer` | `?drawer=wat-pho` | Open a landmark by ID |
| `selftest=1` | `?selftest=1` | Run the in-page verification panel |
| `cam` + `look` | `?cam=96,108,124&look=0,8,-10` | Debug camera position/target |
