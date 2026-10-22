# Spacing, Layout & Elevation System

Covers spacing scale, grid, containers, breakpoints, radius, borders and shadows.

---

## 1. Base unit

**4 px base. Layout rhythm in multiples of 8.** All margins, paddings and gaps come from this scale.

| Token | px | rem | Typical use |
|---|---|---|---|
| `space-1` | 4 | 0.25 | Icon-to-text hairline gaps |
| `space-2` | 8 | 0.5 | Chip gaps, tag gaps, tight stacks |
| `space-3` | 12 | 0.75 | Inline icon + label, list row padding |
| `space-4` | 16 | 1.0 | Standard gap in dense grids, small card padding |
| `space-5` | 20 | 1.25 | **Standard grid gap**, container gutter |
| `space-6` | 24 | 1.5 | **Standard card padding** |
| `space-8` | 32 | 2.0 | Feature card padding, group separation |
| `space-10` | 40 | 2.5 | Section header → content |
| `space-12` | 48 | 3.0 | Between stacked blocks inside a section |
| `space-16` | 64 | 4.0 | Large block separation |
| `space-20` | 80 | 5.0 | **Minimum section padding** |
| `space-32` | 128 | 8.0 | **Maximum section padding** |

Fluid exceptions are allowed only for section padding and hero (see §3).

**Consolidation notes:** the phases used off-scale values (0.35, 0.45, 0.55, 0.65, 0.85, 0.9, 1.1 rem). Snap to the nearest token: 0.35→`space-1`/`space-2`, 0.55–0.65→`space-2`/`space-3`, 0.85–0.9→`space-3`/`space-4`, 1.1→`space-4`.

---

## 2. Component spacing standards

| Element | Padding / gap |
|---|---|
| Card (standard) | `space-6` all sides (24) |
| Card (compact, tiles/rows) | `space-4` (16) |
| Card (featured / resume / CTA) | fluid: 24 → 5vw → 48 (CTA up to 88 vertical) |
| Icon tile (container) | 44 px square; 40 px compact |
| Button (md) | 14 × 24 |
| Button (sm) | 9 × 17 |
| Button (lg) | 16 × 30 |
| Chip / pill | 8 × 18 |
| Input | 11 × 16 (left padding 42 when it has an icon) |
| Grid gap — dense (tiles, small cards) | `space-4` |
| Grid gap — standard (cards) | `space-5` |
| Grid gap — spacious (featured pairs) | `space-6` |
| Heading → body inside a card | `space-2` to `space-3` |
| Card media → card body | 0 (media bleeds to the edge); body padding `space-6` |

---

## 3. Vertical rhythm of a section

| Zone | Spacing |
|---|---|
| Section top & bottom padding | fluid: 80 → 10vw → 128 |
| Eyebrow → title | 8–10 |
| Title → subtitle | 16 |
| Subtitle → toolbar / grid | 40 |
| Toolbar → status line → grid | 16 / 16 |
| Between major blocks in a section (e.g. cards → featured → gallery) | 56–88 (fluid) |
| Last block → section end | covered by section padding |

Hero is the only section that fills the viewport (100svh) and is padded for the fixed nav (64 px + 32).

---

## 4. Container & layout

| Property | Standard |
|---|---|
| Max content width | **1120 px** |
| Side gutters | **20 px** each side (content width = viewport − 40 px) |
| Alignment | Left-aligned content; centred only for hero and closing CTA |
| Readable text width | 34–40 rem |
| Fixed nav height | **64 px** + device safe-area top |
| Anchor offset | nav height (+8) so headings never hide under the nav |
| Safe areas | Respect top/bottom insets for the nav, back-to-top and footer |

---

## 5. Grid

Mental model: a **12-column grid**, but implementation uses **named column patterns** rather than 12-col math.

| Pattern | Desktop (> 1000) | Tablet (761–1000) | Mobile (≤ 760) | Small (≤ 520) |
|---|---|---|---|---|
| **Cards-4** (contact, stats, info) | 4 | 2 | 2 | 1 |
| **Cards-3** (projects, certificates, achievements, repos, categories) | 3 | 2 | 2 → 1 at ≤ 640 | 1 |
| **Split-2** (GitHub + LeetCode, about layout) | 2 | 1 | 1 | 1 |
| **Feature** (image + text) | 55 / 45 | stacked | stacked | stacked |
| **Feature-lead** (one wide + n standard) | wide card spans all columns, rest follow Cards-3 | same | same | 1 |
| **Stats strip** (1 hero + 3) | 1.4fr + 3 × 1fr | hero full row, 3 below | same | hero full row, 3 compact |

Rules:
- Grids are CSS grid with `gap` from §2; no negative margins, no float hacks.
- Items inside a grid must be able to shrink (`min-width: 0`) so long strings never break layout.
- Grid items that filter in/out are removed from flow (hidden), never visually emptied.
- Orphan rows are acceptable; do not pad with empty cards.

---

## 6. Breakpoints

Desktop-first, `max-width` queries. **Three** breakpoints plus one optional.

| Token | Width | Behaviour changes |
|---|---|---|
| `bp-lg` | ≤ **1000 px** | 3-col → 2-col; 4-col → 2-col; split layouts stack where tight; footer drops to 2 cols; **navigation collapses to the hamburger menu** |
| `bp-md` | ≤ **760 px** | Hero grids stack; about/resume stack and centre; 3-col grids → 1-col |
| `bp-sm` | ≤ **520 px** | Single column everywhere; buttons go full-width in action rows; compact data cells |
| `bp-xl` *(optional)* | ≥ 1400 px | Container stays 1120; only background scale changes |

**Consolidation notes:** phases used 1000, 860, 760, 720, 640, 560, 520, 480. Map: 860 → 1000; 720/640 → 760; 560/480 → 520.

Test widths: 360, 390, 768, 1024, 1280, 1440.

Touch targets: minimum **44 × 44 px** (icon buttons are 40–48; do not go below 40 with ≥ 4 px spacing).

---

## 7. Radius, borders & elevation

### Radius scale

| Token | px | Use |
|---|---|---|
| `radius-xs` | 4 | Calendar cells, progress bars |
| `radius-sm` | 8 | Tags, small buttons, copy button |
| `radius-md` | 12 | Buttons, inputs, nav links (rounded), icon tiles |
| `radius-lg` | 16 | Tiles inside cards, list rows, mobile menu |
| `radius-xl` | 20 | **Standard card** |
| `radius-2xl` | 24 | Featured cards, dialogs |
| `radius-3xl` | 32 | Closing CTA panel only |
| `radius-full` | 999 | Pills, chips, avatars, search field, status pills |

Nested radius rule: inner radius = outer radius − padding gap (roughly one step down the scale).

**Consolidation notes:** 14 → 12 or 16; 18 → 20; 22 → 20 (standard card) or 24 (featured); 26 → 24.

### Borders

- Default: **1 px** `color-border-subtle` on every surface.
- Hover / focus-within: `color-border-accent`.
- Featured: border at blue 28–35%.
- Dashed borders only for empty/placeholder states.

### Elevation (shadows)

Dark UIs use **light**, not shadow, to show depth.

| Level | Name | Treatment | Used for |
|---|---|---|---|
| 0 | Flat | Border only | Resting cards, tiles |
| 1 | Hover | Soft blue glow: offset-Y 18–22, blur 44–56, negative spread, `color-glow` | Card hover |
| 2 | Featured | Offset-Y 30, blur 80, spread −40, `color-glow` | Featured, resume, CTA |
| 3 | Floating | Offset-Y 12, blur 30, spread −8, `color-glow` | Back-to-top hover, buttons hover |
| 4 | Modal | Offset-Y 40, blur 120, spread −30, `color-glow` + backdrop dim 70% + blur | Dialogs |

**Primary button glow:** offset-Y 8, blur 28, spread −8, `color-glow`; plus a 1 px top inner highlight (white 25%).

**Focus ring:** 2 px `color-blue-400`, 3 px offset, radius follows the element. Input focus adds a 4 px soft blue halo (18%).

### Glass recipe

Fill `color-surface-glass` + 1 px border + **backdrop blur 12–16 px** (nav and dialogs 16–24 px, with saturate 160%).
Limit simultaneous full-size blurred layers on a screen (performance); tiles inside a glass card do not blur again.

### Z-index scale

| Layer | Value |
|---|---|
| Ambient background | −1 |
| Content | 0 |
| Back-to-top | 90 |
| Navigation | 100 |
| Skip link | 200 |
| Loading screen *(future)* | 1000 |
| Dialogs / command palette | browser top layer (native dialog) |
