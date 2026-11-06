# Portfolio visual system

- Surface: `--brand-black` (#080808). Typography: `--brand-white` (#ffffff), optionally 70% opacity for secondary copy. Accent: `--brand-gold` (#d4af6a).
- No separate silver palette, cool zinc text, grey metallic panels or white glow shadows. Photos and client logos retain their original colors.
- Headings are white. Gold is reserved for actions, icons, selected/focus states and the kinetic artwork. Section labels use white text with one gold rule.
- Primary actions use `brand-action` / `studio-cta`. Secondary icon controls use `brand-outline`. Calendar panels use `ui-panel`, icon tiles `ui-icon`. Hover does not introduce a new hue or a glow.
- Reflections are white transparency over the same gold, not a collection of gold hex values.
- Background is a continuously projected 3D loop with rotation and scale changes, not a cursor-driven static texture. It stays fixed while content scrolls, runs without pointer input on mobile, and has a pause control.
- Motion honors reduced-motion preferences and pauses in hidden tabs. Mobile uses fewer strands/samples and a 24 fps cap; desktop is capped at 30 fps. Perspective trigonometry is calculated once per frame.
- Verify the calendar using mocked available-day/slot responses; visual testing must never create an appointment.
- Regression coverage: `visual-system.test.ts`, `brand-contrast.test.ts`, `kinetic-form.test.ts`, `marquee.test.ts`.
