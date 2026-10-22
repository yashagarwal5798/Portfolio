# Design System — Developer Portfolio

**Version 1.0 · Status: Blueprint for the merge of all phases**

This is the entry point. The other five documents go deeper: `COLOR_SYSTEM.md`, `TYPOGRAPHY.md`, `SPACING_SYSTEM.md`, `COMPONENT_GUIDELINES.md`, `UI_RULES.md`.

Rule of precedence when documents disagree: **DESIGN_SYSTEM.md → the specific system file → COMPONENT_GUIDELINES.md → UI_RULES.md.**

---

## 1. Product feel

The portfolio should read as a **developer dashboard**, not a brochure: calm black surfaces, one confident blue, dense-but-airy information, and motion that confirms rather than performs.

| Principle | Meaning | Borrowed from |
|---|---|---|
| **Quiet confidence** | Black canvas, one accent. Colour is a signal, never decoration. | Apple |
| **Precision** | Hairline borders, tight tracking on headlines, tabular numbers, monospaced labels. | Vercel, Linear |
| **Information first** | Real data (repos, streaks, solves) is the hero of each card. | GitHub |
| **Depth through light** | Hierarchy comes from glass, glow and blur, not heavy shadows. | Apple, Linear |
| **Motion with purpose** | Every animation explains a state change or reveals content. Nothing loops for decoration except the ambient background. | Linear |
| **Accessible by default** | Keyboard, screen reader, reduced-motion and no-JS must all work. | — |

**Theme:** dark only (Black + Blue). A light theme is out of scope for v1; tokens are structured so one could be added later (see `COLOR_SYSTEM.md` §9).

---

## 2. Foundations at a glance

| Foundation | Standard | Detail file |
|---|---|---|
| Base canvas | Near-black `#05070D` with blue ambient light | COLOR_SYSTEM |
| Accent | Blue 500 `#3B82F6`, ramp 400–600, cyan `#38BDF8` as highlight only | COLOR_SYSTEM |
| Typefaces | Inter (UI) + JetBrains Mono (labels, data, code) | TYPOGRAPHY |
| Base spacing unit | 4 px; layout rhythm in multiples of 8 | SPACING_SYSTEM |
| Container | 1120 px max, 20 px side gutters on small screens | SPACING_SYSTEM |
| Breakpoints | 1000 / 760 / 520 px (max-width, desktop-first) | SPACING_SYSTEM |
| Radius scale | 8 · 12 · 16 · 20 · 24 · 32 · pill | SPACING_SYSTEM |
| Elevation | Border + glow, five levels | SPACING_SYSTEM §7 |
| Motion | One easing curve, five durations, transform/opacity only | UI_RULES §4 |
| Icons | 24 px grid, 1.7 stroke, rounded caps | COMPONENT_GUIDELINES §6 |

---

## 3. Page architecture

Single page, vertical scroll, fixed glass navigation.

| Order | Section | Anchor ID | In nav? |
|---|---|---|---|
| 1 | Landing (hero) | `home` | Yes |
| 2 | About | `about` | Yes |
| 3 | Projects | `projects` | Yes |
| 4 | Tech Stack & Skills | `skills` | Yes |
| 5 | Developer Analytics (GitHub + LeetCode) | `analytics` | Yes |
| 6 | Achievements & Certifications | `achievements` | Yes |
| 7 | Experience *(not built yet)* | `experience` | Yes, when built |
| 8 | Contact (+ Resume card, CTA) | `contact` (resume at `resume`) | Yes |
| 9 | Footer | — | No |

**Shell elements:** ambient background (fixed, behind everything), skip link, sticky navigation, back-to-top button, footer.

**Section rhythm:** every content section uses the same vertical padding, the same header pattern (eyebrow → title → subtitle), and the same reveal behaviour. A visitor should be unable to tell where one phase ended and the next began.

---

## 4. Layering model

Surfaces are described from back to front. Never skip a layer.

1. **Canvas** — flat near-black.
2. **Ambient light** — three blurred blue blobs and a faint masked grid, fixed, slow drift.
3. **Content surfaces** — glass cards (translucent white 5%, hairline border, backdrop blur).
4. **Raised accents** — featured cards (blue-tinted gradient glass, accent border, soft glow).
5. **Floating UI** — navigation, back-to-top, dialogs (stronger blur, darker fill).

Anything on layers 3–5 uses a border. Anything interactive gains a blue glow on hover or focus.

---

## 5. How the system is used

- **Tokens first.** Every colour, size, radius, shadow, duration and breakpoint comes from a named token. No raw values inside components (see UI_RULES §2).
- **Components second.** Pages are assembled from the components in `COMPONENT_GUIDELINES.md`. A new visual pattern requires adding a component to the guidelines before it is built.
- **Sections third.** A section is a composition of the section header, a layout grid and components. It should not introduce its own button, card or chip style.

---

## 6. Governance

- Changes to tokens or components are made in the documents **first**, then in code.
- Each deviation found during merge is logged in `UI_RULES.md` §9 (reconciliation list) and resolved to the standard, not to the nearest phase.
- The standard wins over any individual phase, including the landing page.

---

## 7. Out of scope for v1

Light theme, localisation/RTL, CMS-driven content, and the not-yet-built features (command palette, theme toggle, loading screen). Their expected behaviour is noted in `UI_RULES.md` §10 so they can be added without redesign.
