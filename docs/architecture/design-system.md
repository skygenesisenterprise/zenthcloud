# ZenthCloud visual identity — "Ink & Signal"

Official visual support for the public website and generated assets. It is an
original system. Reference sites informed the *composition principles* only:
a single saturated hero panel, a fine dot field, one oversized centred
headline and one pill action. No logo, proprietary layout, illustration,
typeface or other asset is reproduced from them.

## 1. Palette

| Token | Role | Light | Dark |
| --- | --- | --- | --- |
| `--paper` | Page background | near-white | — |
| `--ink` | Chrome, footer, dark bands | deep navy | deep navy |
| `--ink-foreground` | Text on ink | near-white | near-white |
| `--primary` | Links, small accents | mid blue | lighter blue |
| `--signal` | Marks and emphasis on ink | light blue | light blue |
| `--brand` | The single saturated hero surface | deep signal blue | deep signal blue |
| `--brand-foreground` | Text and actions on the panel | white | white |

Rules:

- One saturated surface per page. The hero panel is that surface; do not add a
  second coloured panel on the same screen.
- Signal blue is for meaning (link, mark, focus, emphasis), never decoration.
- Status colours (`success`, `warning`, `destructive`) are semantic only and are
  never used to decorate a section.
- Foreground/background pairs must reach WCAG 2.2 AA contrast. The panel uses
  white on `--brand` (#0B3C8C-range), which clears 4.5:1.

## 2. Typography

- Display: the site display face for headlines only, weight 600–700.
- Body: Inter, 16px base, line-height 1.5 minimum.
- Display tracking is size-specific and negative; never apply negative tracking
  to body copy.
- The hero headline is centred, balanced and limited to two lines on desktop.
- Eyebrows are 11px, uppercase, `0.2em` tracking, at 70% opacity.

## 3. The Signal panel (official hero support)

Component: `components/site/SignalHero.tsx`.

- Full-width rounded panel (`rounded-xl`) on an ink band.
- Background `--brand`; texture: 20px dot field, 16% white, masked to fade
  before the edges.
- One soft white glow at the bottom centre, no other gradients.
- Content stack, centred, max width 4xl: eyebrow → headline → one-sentence
  description → one white pill action → secondary text link.
- No illustration, screenshot, product UI or stock imagery inside the panel.
- The panel is a surface, not a claim: never place uptime, capacity, region or
  certification figures inside it unless they are verified data.

## 4. Surfaces and borders

- Default surfaces are flat paper/card. Depth comes from hairlines, not shadows.
- Borders are 1px at low contrast; section separators use the same hairline.
- Radii: panels `rounded-xl`, controls `rounded-md`, pill actions
  `rounded-full`. Do not mix radii inside one control group.
- Ink bands are used for chrome (utility strip, footer) and the hero frame.

## 5. Actions

- Primary action: solid, high contrast. On the panel, white pill with ink text.
- Secondary action: text link with underline offset, or outline button on paper.
- Focus: 2px ring plus 2px offset, visible on both themes; never remove it.
- Minimum target 44×44px; icon-only controls require an accessible name.

## 6. Motion

- Short fades and 8–12px slides, 150–200ms, ease-out.
- Menus and dialogs may animate opacity and transform only.
- `prefers-reduced-motion` removes transform and duration; content remains
  visible without animation.
- No parallax, no autoplaying loops, no animated background fields.

## 7. Generated assets

- Social card: 1200×630, ink background, one signal mark, white display title,
  footer with domain and positioning line (`lib/og-image.ts`).
- Regenerate the static card with `npx vite-node scripts/generate-og.ts`.
- The same palette constants are exported as `OG_PALETTE` for consistency.

## 8. Do not

- Copy a reference company's logo, orange/gradient identity, icon set,
  illustrations, page copy or exact section order.
- Use more than one saturated panel, gradient wash or glow per view.
- Put text below 12px, use grey-on-grey, or rely on colour alone for state.
- Advertise unverified prices, regions, certifications, SLAs or capacity —
  identity work never overrides the data rules in `lib/domain/schema.ts`.
