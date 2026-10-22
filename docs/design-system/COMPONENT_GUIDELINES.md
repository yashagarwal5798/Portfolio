# Component Guidelines

Every reusable piece of UI, with anatomy, variants, states and accessibility rules. Values refer to tokens in `COLOR_SYSTEM.md`, `TYPOGRAPHY.md` and `SPACING_SYSTEM.md`.

**State vocabulary used throughout:** default · hover · focus-visible · active (pressed) · selected/current · disabled · loading · empty · error.

---

## 1. Section header

The identical opening of every content section.

| Part | Spec |
|---|---|
| Eyebrow | `type-label`, accent colour, e.g. "Developer analytics" |
| Title | `type-heading-xl`; one gradient phrase, e.g. "Code, *measured*" |
| Subtitle | `type-body-lg`, muted, max 40 rem, 1–2 sentences |
| Alignment | Left |
| Motion | Fades up as one block (reveal) |

Rules: always an `h2` linked to the section with `aria-labelledby`. Never add icons or buttons to the header; actions live below it.

---

## 2. Buttons

### Variants

| Variant | Appearance | Use |
|---|---|---|
| **Primary** | Blue-600→700 gradient, white text, glow, 1 px inner top highlight | The single main action of a block |
| **Secondary (ghost)** | Glass fill, subtle border, blur | Supporting action beside a primary |
| **Icon button** | 40–48 px square, glass, radius `md`/`lg` | Theme toggle, menu, close, back-to-top, social |
| **Link button** | Text + trailing arrow, no fill | Rare; tertiary navigation |

### Sizes

| Size | Height (approx.) | Text | Use |
|---|---|---|---|
| Small | 36 | 0.86 rem | Inside cards (GitHub / Live Demo, View / Download) |
| Medium | 46 | 0.95 rem | Default, hero, section actions |
| Large | 52 | 1.0 rem | Closing CTA only |

### Rules
- **Max one primary per visible block.** Pair it with at most one ghost.
- Label = verb + object ("Download Resume"). Sentence case.
- Trailing icon: arrow-right (navigates inside the site), arrow-up-right (leaves the site / new tab), download arrow (downloads). Icon nudges 3–4 px on hover in its direction.
- External links open in a new tab, carry `rel="noopener noreferrer"` and a hidden "(opens in a new tab)" announcement.
- Buttons that perform an action are real buttons; buttons that navigate are links. Never fake either.
- In action rows on small screens, buttons stack and go full width.

### States

| State | Treatment |
|---|---|
| Hover | Lift 2 px, glow intensifies (primary) or border turns blue (ghost) |
| Focus-visible | Standard focus ring |
| Active | Returns to rest position, no glow change |
| Disabled | 45% opacity, no hover, not focusable if truly unavailable |
| Loading | Replace label with "Loading…" and `aria-busy`; do not add spinners to buttons |

---

## 3. Cards

All cards share the **glass card base**: glass fill, 1 px subtle border, backdrop blur, radius `xl`, padding `space-6`, no resting shadow.

### 3.1 Variants

| Variant | Differences from base | Examples |
|---|---|---|
| **Standard card** | Base | Contact, achievement, category, GitHub/LeetCode |
| **Media card** | Media on top (16 : 10), body below; media zooms on hover | Project, certificate |
| **Tile** | Compact padding (`space-4`), radius `lg`, glass-subtle fill, sits *inside* a card | Stat tile, info tile |
| **List row** | No border at rest; hover adds soft blue fill and 3 px nudge | Skill row, learning item |
| **Featured card** | Accent-tinted gradient, accent border, level-2 glow, radius `2xl`, larger padding | Featured project, featured achievement, resume |
| **CTA panel** | Featured + radius `3xl`, centred, ambient glow behind | Closing call-to-action |

### 3.2 Anatomy of a standard card (top to bottom)
Icon tile → label (mono) → value or title → description/hint → optional actions. Actions always sit at the bottom edge (cards in a row align their buttons).

### 3.3 Interaction
- **Hover / focus-within:** lift 4 px, border → accent, level-1 glow. Optional pointer-following radial glow inside the card on pointer devices.
- **Entire card clickable** only when it has a single destination (contact cards). Implementation must keep one real link per card and keep any secondary button (e.g. copy) above it. Nested interactive elements are never allowed.
- **Cards with several actions** (projects, certificates) are *not* clickable as a whole.
- Resting cards must not be so busy that hover cannot add emphasis.

### 3.4 Content rules
- Titles: 1–2 lines. Descriptions: 2–3 lines (clamp at 3).
- Tags: max 5 per card.
- One image per card; always has a gradient placeholder fallback.

### 3.5 States
Loading → content replaced by muted shimmer (opacity pulse 1.6 s). Empty → dashed border, centred muted sentence. Error → semantic note inside the card (see §10), card stays in place.

---

## 4. Chips, tags, badges, pills

| Component | Shape / style | Use |
|---|---|---|
| **Filter chip** | Pill, glass, 14 px text; **selected = filled blue-600→700 gradient + glow** | Category filters; toggle with `aria-pressed` |
| **Tech tag** | Radius `sm`, mono 12 px, blue text on blue 10% fill, blue 18–20% border | Stack on cards, skills covered |
| **Badge** | Pill, mono uppercase 11–12 px, accent or neutral | "Featured", "Resume" |
| **Status pill** | Pill, mono uppercase, semantic tint (success / danger), pulsing dot while loading | Live / Offline / Loading |
| **Count pill** | Pill, mono, neutral border | Number of items in a category |
| **Availability badge** | Glass pill with pulsing green dot | Hero eyebrow, CTA |

Rules: tags are not interactive; chips are. Colour of tags is always the blue family regardless of technology.

---

## 5. Inputs & toolbars

### Search field
Pill, glass + blur, leading search icon (17 px), 15 px text, max width 300 px (full width on mobile).
Focus: border blue-500 + 4 px soft halo. Always has a visually hidden `label`. Uses `type="search"` so the browser supplies the clear control.

### Filter + search toolbar
Chips on the left, search on the right; wraps on tablet, stacks on mobile. A **live status line** below announces result counts politely ("Showing 3 of 4 projects").

### Behaviour standards
- Filtering and searching combine (AND).
- Matching is case-insensitive, every typed word must match.
- Zero results → empty state card with a suggestion, never a blank gap.
- Filtered-in items animate in (fade/raise 14 px, 450 ms); filtered-out items are removed from layout instantly.

---

## 6. Icons

| Property | Standard |
|---|---|
| Source | Inline SVG, one consistent line style; brand logos use official marks |
| Grid | 24 × 24 viewBox |
| Stroke | **1.7** (UI), 2 (inside buttons and small icons), round caps and joins, no fill |
| Colour | `currentColor`; accent icons use blue-400, muted icons use text-muted |
| Sizes | 14 (inline in labels), 16–18 (buttons), 20–22 (tile icons), 40–48 (illustration) |
| Brand icons | Filled glyph, `currentColor`; technology logos on tiles use full-colour official art |
| Decorative icons | `aria-hidden`; meaning must exist in text |
| Icon-only controls | Must have an accessible name |

**Icon tile (container):** 40–44 px square, radius `md`–`lg`, blue 10% fill, blue-400 20% border, blue-400 icon. On card hover the fill rises to 18% and a small glow appears.

**Dark-logo rule:** logos that are black (e.g. GitHub, Express) are inverted to white on dark surfaces. A failed logo falls back to the technology's initial letter in the tile.

**Stroke consistency fix for merge:** some placeholder art used 1.2–1.4 strokes; allowed only for large (≥ 40 px) illustrations.

---

## 7. Navigation

| Element | Spec |
|---|---|
| Bar | Fixed, 64 px, transparent at top; on scroll: overlay fill, 1 px bottom border, blur 16 px + saturate |
| Brand | Mono logo mark tile + wordmark; links to `#home` |
| Links | Pill-shaped hit areas, muted → primary on hover, **current section = glass pill + `aria-current`** |
| Order | Matches the page architecture in `DESIGN_SYSTEM.md` §3 |
| Collapsed (≤ 1000, because the menu has seven links) | Hamburger icon button (animates to ✕); panel drops below the bar, glass overlay, one link per row |
| Behaviours | Menu closes on link click, Esc, outside click, or resize to desktop; Esc returns focus to the toggle |
| Skip link | First focusable element, appears on focus |

Current-section detection uses the middle band of the viewport; sections missing from the page are ignored.

---

## 8. Data display

### Stat / counter
Large value (`type-data`, tabular, accent gradient for the hero metric), mono label above, optional unit in muted text. Counts up when scrolled into view (1.1–1.2 s, ease-out); instant with reduced motion; shows "—" when unavailable.

### Progress & segmented bars
4–8 px high, pill ends, track = border colour. Fill animates width/scale 1.1–1.2 s on reveal. Always paired with the numeric value as text.

### Skill-level indicator
Three segments (Beginner 1, Intermediate 2, Advanced 3) + text label. Segment colour = level colour.

### Contribution calendar
Square cells (11–13 px, radius 3), 5 intensity steps, week columns, month labels above, legend bottom-right, horizontally scrollable on mobile starting at the latest week. Tooltip text lives in a native title; the grid has a single summary label for assistive tech.

### Language bar
Segmented bar + legend (dot, name, percentage). Label states the basis ("by repository").

### Streak
Flame icon (streak colour) + number + "days". Counts consecutive days ending today or yesterday.

---

## 9. Dialog (modal)

Native dialog element. Radius `2xl`, dialog surface, accent border, level-4 elevation, backdrop dimmed 70% with blur.
- Close: ✕ icon button (top-right), Esc, click on backdrop.
- Focus: moves in on open, returns to the trigger on close; page scroll locked while open.
- Content: media/preview + title, meta, tags, actions.
- Mobile: single column, panel scrolls internally, margin 16 px.
- The trigger remains a real link when scripting fails (progressive enhancement).

---

## 10. Feedback & states

| Pattern | Spec |
|---|---|
| **Inline note** | Semantic tint (8% fill, 20% border), `type-caption`, `role="status"`; sits above the card's action |
| **Toast-like confirmation** | In-place label change on the control ("Copy" → "Copied!") for 2 s; no floating toasts |
| **Loading** | Opacity shimmer on values/cards; skeletons keep final dimensions to prevent layout shift |
| **Empty** | Dashed border container, 1 sentence, optional hint |
| **Error** | Status pill → "Offline" + inline note explaining what to do; partial failures show what loaded plus a "some data couldn't be loaded" note |
| **Offline third-party data** | Never block the page; every dependent value shows "—" |

---

## 11. Hero, footer, back-to-top

**Hero:** full-viewport, centred; availability/role badge → display headline with one gradient line → typed role line (mono, prompt glyph, blinking caret) → two actions → scroll cue. Soft blue glow behind the headline (pulse 7 s).

**Scroll cue:** mouse outline with a travelling wheel dot; fades out after 80 px of scroll; clicking scrolls to the next section.

**Footer:** top border; brand + one-line pitch + 3 social icon buttons; two link columns (Navigate, Connect); bottom bar with copyright (current year) and credits. Link hover = blue and 3 px shift.

**Back-to-top:** 48 px glass circle bottom-right, appears after 600 px scroll, circular **scroll-progress ring** around it; click scrolls to top and moves focus to the top landmark.

---

## 12. Media placeholders

Until real images exist, media areas show a two-blue gradient (135°), a soft white radial highlight at top-left, a dark fade at the bottom, and a centred white line icon (≈ 22–54% width). Swapping in a photo must not change the frame: same aspect ratio, `object-fit: cover`, lazy-loaded, explicit dimensions, descriptive `alt` (empty `alt` when the image is purely decorative).

| Context | Aspect ratio |
|---|---|
| Project (standard) | 16 : 10 |
| Project (featured) | fills height, min 320 px (stacked: 16 : 8) |
| Certificate | 16 : 10 |
| Avatar | 1 : 1, circular |
