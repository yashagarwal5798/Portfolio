# Color System

Dark-only. Black canvas, one blue accent family, a small set of semantic colours. Colour carries meaning; if something is blue, it is interactive, active, or primary data.

Contrast figures below are approximate, calculated against the base canvas `#05070D`. **Re-verify with a contrast checker during QA.**

---

## 1. Token naming

Tokens use the pattern `color-{role}-{variant}`. The "Current name" column maps today's phase code to the standard so the merge can rename once.

---

## 2. Core palette

### Backgrounds & surfaces

| Standard token | Value | Current name | Use |
|---|---|---|---|
| `color-bg-base` | `#05070D` | `--bg` | Page canvas |
| `color-bg-elevated` | `#0A0F1C` | `--bg-elevated` | Top of background gradient, avatar disc, dialogs |
| `color-surface-glass` | white 5% (`rgba(255,255,255,.05)`) | `--glass` | Default card fill |
| `color-surface-glass-subtle` | white 3–4% | (hard-coded) | Tiles *inside* cards |
| `color-surface-overlay` | `rgba(8,12,22,.72)` | `--glass-strong` | Nav on scroll, mobile menu, back-to-top |
| `color-surface-dialog` | `rgba(8,12,22,.92)` | (hard-coded) | Modal panels |
| `color-surface-hover` | blue 8% | (hard-coded) | Row/list hover |
| `color-surface-accent` | blue 10% | (hard-coded) | Icon tiles, tags, active chips' soft variant |
| `color-surface-featured` | gradient: blue 12–14% → glass | (hard-coded) | Featured card, resume card, CTA panel |

### Text

| Token | Value | Current | Contrast | Use |
|---|---|---|---|---|
| `color-text-primary` | `#F2F5FB` | `--text` | ≈ 18 : 1 | Headings, key values |
| `color-text-muted` | `#8B97B0` | `--text-muted` | ≈ 6.8 : 1 | Body copy, labels, hints |
| `color-text-accent` | `#60A5FA` | `--blue-400` | ≈ 7.9 : 1 | Eyebrows, links, tags, org names |
| `color-text-on-accent` | `#FFFFFF` | (hard-coded) | see §5 | Text on filled blue |

### Blue ramp

| Token | Value | Current | Use |
|---|---|---|---|
| `color-blue-300` | `#93C5FD` | (calendar level 4) | Highest data intensity |
| `color-blue-400` | `#60A5FA` | `--blue-400` | Accent text, icons, focus ring |
| `color-blue-500` | `#3B82F6` | `--blue-500` | Primary accent, borders on hover, data fills |
| `color-blue-600` | `#2563EB` | `--blue-600` | Button gradient end, pressed states |
| `color-blue-700` | `#1D4ED8` | (hard-coded) | Deep gradient stops, ambient blob |
| `color-blue-900` | `#1E3A8A` | (hard-coded) | Lowest data intensity, placeholder gradients |
| `color-cyan-400` | `#38BDF8` | `--cyan-400` | Gradient partner only; never standalone text |
| `color-indigo-900` | `#312E81` | (hard-coded) | Ambient blob, placeholder gradients |

### Lines & light

| Token | Value | Current | Use |
|---|---|---|---|
| `color-border-subtle` | white 9% | `--border` | Default hairline on every surface |
| `color-border-accent-soft` | blue-400 20–22% | (hard-coded) | Icon tiles, tags |
| `color-border-accent` | blue-400 45–50% | (hard-coded) | Hover/focus-within border on cards |
| `color-glow` | blue-500 35% | `--glow` | All glow shadows and radial highlights |

---

## 3. Semantic colours

Used **only** for state and data, never for branding.

| Token | Value | Meaning | Where |
|---|---|---|---|
| `color-success` | `#34D399` | Live, copied, Easy | Status pill (live), copy confirmation, LeetCode Easy |
| `color-warning` | `#FBBF24` | Caution, Medium | Partial-data note, LeetCode Medium |
| `color-danger` | `#F87171` | Error, offline, Hard | Status pill (offline), LeetCode Hard |
| `color-streak` | `#FB923C` | Streak flame | Streak icon only |
| `color-level-beginner` | `#818CF8` | Skill level 1 | Skill bars |
| `color-level-intermediate` | `#38BDF8` | Skill level 2 | Skill bars |
| `color-level-advanced` | `#60A5FA` | Skill level 3 | Skill bars |

> **Standardise:** the "available" dot currently uses `#22C55E`; replace with `color-success`.

Semantic tints (backgrounds and borders) are the colour at **8%** fill and **35%** border.

---

## 4. Gradients

| Name | Definition | Use |
|---|---|---|
| **Accent text** | 110° blue-400 → blue-500 (45%) → cyan-400 | The one highlighted phrase in a title; big numbers |
| **Primary button** | 180° blue-600 → blue-700 (see §5) | Filled buttons |
| **Featured surface** | 135° blue 12% → glass at 55–60% | Featured, resume, CTA |
| **Placeholder media** | 135° two blues + white radial highlight top-left + dark fade bottom | Image placeholders |
| **Avatar ring** | Conic blue-600 → cyan-400 → transparent → blue-500 | Rotating ring |

**Rules:** one accent-text phrase per section title; never place two gradient fills side by side; no gradients on body text.

---

## 5. Known contrast issue to fix at merge

The primary button gradient currently runs from blue-400 to blue-600 with white text. Approximate contrast of white text against each stop: blue-400 `#60A5FA` ≈ **2.5 : 1**, blue-500 `#3B82F6` ≈ **3.7 : 1**, blue-600 `#2563EB` ≈ **5.2 : 1**, blue-700 `#1D4ED8` ≈ **6.7 : 1**. Normal-size text needs 4.5 : 1 at every point the text sits on.

**Standard:** filled blue controls (primary buttons, selected chips) use a **blue-600 → blue-700** gradient, or solid blue-600. Blue-400 and blue-500 are for text-on-dark, borders, icons and glows, never as a fill under white text.

## 6. Glow & ambient light

- Glow is always `color-glow` (blue 35%), applied as a large soft shadow or a radial highlight. Never use a hard-edged coloured shadow.
- Ambient blobs: blue-700 (40%), sky `#0EA5E9` (22%), indigo-900 (35%) at heavy blur; opacity must not exceed 40%.
- Ambient grid lines use `color-border-subtle` and fade out with a radial mask.

---

## 7. Data visualisation

| Chart | Colours |
|---|---|
| Contribution calendar (5 levels) | white 6% → blue-900 → blue-700 → blue-500 → blue-300 |
| Difficulty split | success / warning / danger |
| Language bar | Language brand colours (muted by the dark surface); fallback blue-400 |
| Progress bars | Gradient blue-600 → cyan-400 with glow |

Never rely on colour alone: every chart needs a text equivalent (label, value, or `aria-label`).

---

## 8. Usage ratios

On any screen, aim for roughly **90% neutral** (black, glass, muted text), **8% blue** (accents, tags, active states), **2% semantic** (status, difficulty).

If a section feels loud, remove blue; do not add another hue.

---

## 9. Future light theme (not in v1)

Add a second set of values for the same tokens only: invert bg/text, raise glass opacity to 65% white, keep blue-500/600 for accents, drop ambient blob opacity. No component should need a rewrite.

---

## 10. Don'ts

- No pure `#000` backgrounds or pure `#FFF` body text.
- No purple/pink accents; indigo only inside ambient and placeholder gradients.
- No more than one saturated element competing in the same card.
- No red/green pairing as the only distinction.
