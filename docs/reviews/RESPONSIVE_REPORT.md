# Responsive Report

**Method:** static analysis of every `@media` rule, grid definition and fixed dimension. Widths were reasoned from the CSS, **not rendered on devices**. Items marked *estimate* should be confirmed on real devices.

## 1. Breakpoint audit

| File | Media queries used |
|---|---|
| styles.css (Landing + Nav) | 480, 760 |
| about.css | 520, 760, 1000 |
| projects.css | 640, 1000 |
| skills.css | 640, 1000 |
| analytics.css | 560, 860, 1000 |
| achievements.css | 560, 760, 1000 |
| contact.css | 520, 720, 1000 |

**8 distinct values across 7 files** against a documented standard of three (1000 / 760 / 520). 1000 is shared by all six content sections, which is good.

## 2. Expected behaviour by width (from CSS)

| Section | 360–390 | 768 | 1024–1440 |
|---|---|---|---|
| Navigation | Hamburger panel | Inline links (hamburger starts at ≤ 760) | Inline links |
| Hero | Centred, buttons full width (≤ 480) | Centred | Centred, headline up to 88 px |
| About | Stacked, centred, 4 info cards in 1 column | Avatar + text side by side; cards in 2 columns | Two-column + 4 cards |
| Projects | 1 column; toolbar stacked | 2 columns; featured card stacked | 3 columns; featured wide |
| Skills | 1 column; stats strip compact | 2 columns | 3 columns |
| Analytics | 1 column; repos 1 col; calendar scrolls | GitHub + LeetCode stacked; repos 2 col | Two cards side by side; repos 3 col |
| Achievements | 1 column; feature stacked | 2 columns; feature side by side | 3 columns |
| Contact / Resume | 1 column; resume stacked | 2 columns | 4 columns; resume side by side |
| Footer | 1 column | 2 columns | 3 columns |

## 3. Strengths

Fluid type (clamp) with no per-breakpoint overrides; fluid container (`min(1120px, 100% − 2.5rem)`); `min-width: 0` on grid children so long strings cannot break layouts; wide content (calendar) scrolls inside its own container; action rows stack at the smallest sizes; `100vh` fallback before `100svh`; no fixed pixel widths on text blocks.

## 4. Issues

| ID | Issue | Why it matters | Recommendation | Priority |
|---|---|---|---|---|
| RESP-01 | The hamburger menu begins at ≤ 760 px, but the final navigation will have about 8 links (Home, About, Projects, Skills, Analytics, Achievements, Experience, Contact). *Estimate:* eight links plus brand need roughly 900 px, so between about 761 and 950 px the bar will overflow or wrap. | Broken header on tablets and small laptops, the most visible spot on the page. | Raise the menu breakpoint to 1000 px, or shorten labels and tighten padding between 761 and 1000. Re-test at 768 and 900. | High |
| RESP-02 | The viewport is set to `viewport-fit=cover`, but the container gutters use plain 20 px and never add `env(safe-area-inset-left/right)`. | In landscape on notched iPhones, content and the back-to-top button can sit under the notch or rounded corners. | Add left/right insets to the container and to the fixed back-to-top position. | Medium |
| RESP-03 | `scroll-padding-top` and the hero's top padding use the 64 px nav height but ignore the top inset the nav itself adds. | With a Dynamic Island, anchored headings can hide under the nav. | Include the top inset in both. | Medium |
| RESP-04 | Eight breakpoint values cause layouts to change at different widths: around 800–950 px Analytics is single-column, Projects is two-column, and the nav is full. | Uneven rhythm and extra test cases. | Consolidate to 1000 / 760 / 520 (mapping in `SPACING_SYSTEM.md` §6). | Medium |
| RESP-05 | Hover transforms are applied on all pointers. | On touch, cards stay lifted and glowing after a tap. | Gate hover effects to hover-capable devices. | Medium |
| RESP-06 | The open mobile menu has no height limit. With 8 links in landscape phones (about 390 px tall) the panel will extend below the viewport. | Last links unreachable. | Add a max height with internal scroll. | Medium |
| RESP-07 | Skills rows at ≤ 400 px share one line between logo, name and level (bars + word). *Estimate:* roughly 96 px remains for the name, so "Tailwind CSS" and "scikit-learn" are tight. | Wrapped or truncated names on small phones. | Below ~400 px place the level under the name, or hide the bars and keep the word. | Medium |
| RESP-08 | Copy button, filter chips and small buttons are about 26–36 px tall. | Hard to tap accurately (see ACC-07). | Increase the hit area on touch devices without changing the look. | Medium |
| RESP-09 | The dialog uses `100dvh` without a fallback. | On browsers lacking `dvh` the height limit is ignored and the dialog can overflow short screens. | Declare a `vh` fallback first. | Low |
| RESP-10 | `body { overflow-x: hidden }` hides any accidental overflow instead of exposing it. | Layout bugs become invisible during testing. | Remove during QA to detect overflow; keep only if a specific element needs it. | Low |
| RESP-11 | Analytics tile labels (uppercase mono with letter spacing) wrap to two lines at 360 px, making tile heights uneven. | Minor visual roughness. | Allow the label row a consistent minimum height or shorten the label ("Contributions"). | Low |
| RESP-12 | No print stylesheet. The resume and certificate sections are likely print targets. | Printed pages show glass effects and fixed UI. | Add a minimal print style (white background, hide nav/back-to-top/animations). | Low |

## 5. Test matrix for sign-off

| Device class | Width × height | Key checks |
|---|---|---|
| Small phone | 360 × 640 | Hero fits, skills rows, calendar scroll, menu |
| Phone | 390 × 844 | Safe areas, sticky nav, forms of tap targets |
| Phone landscape | 844 × 390 | Hero overflow, menu height, safe-area sides |
| Tablet portrait | 768 × 1024 | Nav (RESP-01), 2-column grids |
| Tablet landscape / small laptop | 1024 × 768 | 3-column grids, feature cards |
| Laptop / desktop | 1280–1440 | Container centring, hero scale |
| Zoom | 200% at 1280 | Reflow, no clipped text |

## 6. Verdict

Layout fundamentals are sound and consistent. **One High issue (RESP-01) must be resolved before the final navigation is merged**; the rest are tuning items.
