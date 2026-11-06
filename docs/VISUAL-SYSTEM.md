# Portfolio visual system

- Surface: `--brand-black` (#080808). Typography: `--brand-white` (#ffffff), optionally 70% opacity for secondary copy. Accent: `--brand-gold` (#d4af6a).
- No separate silver palette, cool zinc text, grey metallic panels or white glow shadows. Photos and client logos retain their original colors.
- Headings are white. Gold is reserved for actions, icons, selected/focus states and the kinetic artwork. Section labels use white text with one gold rule.
- Primary actions use `brand-action` / `studio-cta`. Secondary icon controls use `brand-outline`. Calendar panels use `ui-panel`, icon tiles `ui-icon`. Hover does not introduce a new hue or a glow.
- Reflections are white transparency over the same gold, not a collection of gold hex values.
- Hero uses the original side-standing `/images/profile-1-cutout.png`, with its lower body masked into #080808. The whole upper section and navigation are dark. Do not restore the ground, desk, light background or independent portrait movement.
- Projects form one native horizontal shelf containing every filtered item. Cover art fills the expanding card; identity moves from vertical spine to the upper edge. Mouse dragging, touch scrolling and arrow controls are available. Do not split the shelf into rows.
- Contact triggers are 44px phone/envelope icons with no visible rectangular container. Revealed contact data uses at least 15px type on mobile and supports direct tel/mailto actions.
- Motion honors reduced-motion preferences. The client logo loop can be paused, supports dragging and stops when offscreen or the tab is hidden.
- Verify the calendar using mocked available-day/slot responses; visual testing must never create an appointment.
- Regression coverage: `visual-system.test.ts`, `brand-contrast.test.ts`, `kinetic-form.test.ts`, `marquee.test.ts`.
