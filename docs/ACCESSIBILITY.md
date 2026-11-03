# Accessibility

Bangkok 3D is a visual 3D experience, but the interface is designed to remain operable by keyboard and
to communicate state without relying on colour alone. This page records what is implemented, what is
known to be incomplete, and how to improve it.

## Implemented

- **Keyboard control:** `1`/`2`/`3` modes, `L` language, `T` lighting, `M` sound, `H`/`?` help, `R`
  recenter, `Space` pause tour, `N` next stop, `Esc` close overlays. Walk uses `WASD`/arrows and `E` to
  inspect.
- **No forced pointer capture:** walk look is drag-based; the cursor remains available. Users are never
  trapped by pointer lock.
- **Visible focus:** `:focus-visible` outlines are defined for buttons, links and the notes field.
- **Semantic controls:** the main actions are native `<button>` elements with labels; the guide is a
  labelled dialog (`role="dialog"`, `aria-modal`), and landmarks have accessible names.
- **Bilingual document language:** the root `lang` attribute switches between `en` and `th`.
- **Text alternatives:** every UI control has visible text or an `aria-label`; the loading and WebGL
  error states are real DOM text, not canvas-only.
- **Colour independence:** visited landmarks also show a check/✦ flag; the tour uses numbered stops and
  labels; progress is stated in text (`3 of 5 visited`), not only a bar.
- **Motion preference:** `prefers-reduced-motion` collapses CSS animations and transitions.
- **No autoplay audio:** sound starts only after a gesture.
- **Responsive layout:** common phone widths keep the mode switch, drawer and trail button usable.
- **Zoom:** camera zoom is available in all modes (drone distance, walk/tour FOV), and browser page
  zoom still works because the UI uses relative sizing and reflows.

## Known gaps

- **Canvas description:** the 3D scene has an `aria-label`, but a screen reader cannot explore the city
  spatially. The landmark trail panel is the fallback content path.
- **Focus trapping:** the guide drawer and help modal move focus on open, but do not yet implement a
  complete focus trap or return focus to the invoking control in every path.
- **Keyboard-only walking:** walk look requires pointer drag; there is no arrow-key look alternative
  while walking. Orbit mode is fully keyboard-limited as well (pointer drag is primary).
- **Touch walk:** the on-screen arrow pad supports touch movement; drag still handles look.
- **Small Thai text:** some Thai labels are 8–10 px at the smallest breakpoint; readability should be
  tested with Thai users.
- **Contrast:** gold-on-glass text meets the intended dark palette visually but has not been fully
  audited against WCAG AA at every opacity/state.
- **Screen-reader live regions:** progress/toasts use `role="status"` for the toast and updating labels,
  but the dynamic landmark list is not announced comprehensively.
- **Reduced motion in WebGL:** the camera flights and tour still animate; only CSS motion is reduced.
- **Audio:** no captions for environmental sound; narration is device-dependent and not a complete
  alternative to the written guide.

## Recommended next steps

1. Add a focus trap/return-focus helper for the drawer and help modal.
2. Provide a non-drag look option in walk mode (arrow-key look while holding a modifier, or an on-screen
   look pad).
3. Make the landmark list a proper `aria-live` or landmark navigation list with clear visited state.
4. Audit colour contrast at every glass/overlay combination, including Thai text.
5. Add a "reduce camera motion" option that disables flights, tour sway and head bob.
6. Add captions/transcripts for narration and an audio-description pass for the city.
7. Test with VoiceOver/NVDA, keyboard only, 200% page zoom and a screen reader on mobile.

## Reporting an accessibility issue

Open an issue with the **Bug report** template and include the assistive technology, browser, viewport,
the step that failed, and whether the self-test passes. Accessibility bugs are treated as normal bugs,
not feature requests.
