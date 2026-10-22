# UI Rules

The enforceable rules. If a decision is not covered here, default to **less**: less colour, less motion, less decoration.

---

## 1. Golden rules

1. **One accent.** Blue is the only brand hue. Semantic colours only for state and data.
2. **One primary action per block.**
3. **Hairline borders on every surface.** Glass without a border looks accidental.
4. **Light, not shadow.** Depth comes from glow and blur.
5. **Everything is tokenised.** No raw colour, size, radius, duration or breakpoint in a component.
6. **Content survives failure.** No JavaScript, no network, no images, reduced motion — the page still reads.
7. **Same pattern, same look.** A card in Projects and a card in Achievements are siblings.

---

## 2. Tokens & values

- Use named tokens from the system files for: colour, type scale, spacing, radius, shadow, duration, easing, breakpoint, z-index.
- If a value is missing, **add a token to the documents first**; do not invent a one-off.
- Allowed fluid values: type scale (clamp) and section padding. Nothing else is fluid.
- Opacity on colours is expressed through the defined tints (3 / 5 / 8 / 10 / 18 / 35 / 45–50%), not arbitrary numbers.
- Do not hard-code hex values in components. The only places hex values appear are the colour token definitions and brand/language data colours.

---

## 3. Accessibility rules

| Area | Rule |
|---|---|
| Structure | Landmarks: header (nav), main, footer. One `h1`; sections `h2`; cards `h3`; no skipped levels. Every section labelled via `aria-labelledby`. |
| Keyboard | Everything operable by keyboard; logical tab order; visible focus ring (2 px blue-400, 3 px offset) on **every** interactive element. |
| Skip link | First tab stop, jumps to main content. |
| Names | Icon-only controls have an accessible name; links that open a new tab say so; "View"/"Download" buttons include the item name for screen readers. |
| Live regions | Filter counts and data-loading outcomes use polite `role="status"`. |
| Toggle controls | Filters use `aria-pressed`; expanders use `aria-expanded` + `aria-controls`; the current nav item uses `aria-current`. |
| Colour | 4.5 : 1 for text, 3 : 1 for UI boundaries; never colour alone (add text, icon or pattern). |
| Motion | Respect reduced-motion (see §4). No flashing; no parallax. |
| Targets | ≥ 44 px recommended hit area; ≥ 8 px between adjacent targets. |
| Images | Meaningful → descriptive alt; decorative → empty alt or `aria-hidden`. |
| Data visuals | Every chart or calendar has a text summary. |
| Dialogs | Focus enters and returns; Esc closes; background inert. |
| Language | `lang` set on the document. |

---

## 4. Motion rules

### Principles
Motion is **subtle, short, and one-directional**. Elements move toward rest, never away. Only `transform` and `opacity` animate (plus colour/border/shadow on hover); never animate layout properties.

### Tokens

| Token | Value | Use |
|---|---|---|
| `ease-standard` | cubic-bezier(0.22, 1, 0.36, 1) | All UI motion |
| `ease-linear` | linear | Rotating avatar ring, spinners |
| `ease-ambient` | ease-in-out | Background blobs, glow pulses |
| `duration-instant` | 150 ms | Colour/opacity on small controls |
| `duration-fast` | 250–300 ms | Hover colour/border/transform on controls |
| `duration-base` | 450 ms | Card lift, dialog open, filter enter |
| `duration-slow` | 800 ms | Scroll reveal |
| `duration-data` | 1100–1200 ms | Counters, bar fills |
| `duration-ambient` | 6–38 s | Background drift, glow pulse, avatar ring (8 s) |

### Patterns

| Pattern | Spec |
|---|---|
| **Scroll reveal** | Start 24–26 px below + transparent → rest. Triggers once at ≈ 12% visibility with a −6% bottom margin. Stagger siblings by 90 ms × index, **max 5 steps**. |
| **Hover lift** | Small tiles / icon buttons: −2 to −3 px. **Cards: −4 px.** Never more than −6 px. |
| **Image zoom** | Scale 1.06 inside a clipped frame over 700 ms; the frame never moves. |
| **Hover glow** | Border to accent + level-1 glow, 300–450 ms. |
| **Pointer glow** | Radial gradient follows the pointer inside the card; pointer devices only. |
| **Filter result** | Entering items fade/rise 14 px over 450 ms. Leaving items disappear immediately. |
| **Count-up** | Starts when ≥ 40–60% visible, ease-out cubic over 1.1–1.2 s, runs once per value. |
| **Bars** | Fill from 0 on reveal, 1.1–1.2 s. |
| **Typing** | 75 ms/char typing, 38 ms/char deleting, 1.7 s hold, 350 ms gap. Static first word when reduced motion. |
| **Status pulse** | Dot ring pulse 2.2 s, infinite — status dots only. |
| **Page-level** | Smooth scrolling for in-page links; anchor offset equals the nav height. |

### Reveal gating (no-JS safety)
Elements are hidden for reveal **only after** scripting marks the section ready. If scripting or IntersectionObserver is unavailable, all content is visible.

### Reduced motion
When the user prefers reduced motion: no reveals (content appears instantly), no lift or zoom, counters jump to final values, no typing, no ambient animation, smooth scroll becomes instant. Hover colour changes remain.

### Forbidden
Parallax, scroll-jacking, bouncing/elastic easing, rotating cards, auto-playing carousels, motion longer than 1.2 s (except ambient), simultaneous animation of more than ~12 elements.

---

## 5. Responsive rules

- Design desktop-first, verify at 360 / 390 / 768 / 1024 / 1280 / 1440 px.
- Only the three breakpoints in `SPACING_SYSTEM.md` §6 are used.
- No horizontal page scroll at any width. Wide content (tables, calendars, code) scrolls inside its own container.
- Columns collapse in order: 4 → 2 → 1, 3 → 2 → 1. Never 3 → 1 directly unless the card is very wide.
- Action rows stack and fill width ≤ 520 px.
- Typography is fluid; do not override sizes per breakpoint.
- Safe areas respected for fixed top/bottom elements.
- Touch devices: no hover-only information; hover effects are enhancement only.

---

## 6. Content rules

| Topic | Rule |
|---|---|
| Voice | First person, plain, specific. No buzzwords ("passionate", "guru"). |
| Titles | Sentence case; ≤ 6 words for section titles. |
| Subtitles | 1–2 sentences, ≤ 25 words each. |
| Descriptions | Outcome-first, ≤ 2 lines in cards at desktop. |
| Numbers | Real, current, sourced; mark approximations with "+". Use thousands separators. |
| Dates | "Mon YYYY" in UI, ISO value in the `datetime` attribute. |
| Placeholder text | Obviously placeholder (`Your Name`, `your-username`); never lorem ipsum. |
| Links | Descriptive text; never "click here". |
| Empty or failed data | Plain-language reason + next step. |

---

## 7. Performance rules

- Total blurred (backdrop-filter) layers visible at once should stay modest; nested glass inside glass does **not** re-blur.
- Animate only `transform` and `opacity`; promote only the ambient blobs.
- Images: lazy-loaded below the fold, explicit dimensions (no layout shift), modern formats, ≤ 200 KB for thumbnails.
- Third-party data: cached (30 min), time-limited requests, parallel fetching, graceful degradation, no blocking of first paint.
- Fonts: two families, swap display, preconnect.
- Scripts: deferred; one passive scroll listener per concern; use observers instead of scroll polling where possible.
- Respect rate limits of third-party APIs; never poll.

---

## 8. Code architecture & naming (blueprint only)

| Topic | Rule |
|---|---|
| Structure | One stylesheet and one script per section **plus** shared layers: tokens/base/components (CSS) and a shared UI utilities script. |
| Layers (CSS) | Tokens → Base → Layout → Shared components → Section styles → Utilities. Later layers may not redefine earlier tokens. |
| Naming | Block–Element–Modifier (e.g. `card`, `card__title`, `card--featured`). Hooks for JavaScript use `data-` attributes, never styling classes. |
| Scoping | Section-specific blocks are prefixed or scoped to the section. **Generic names (`card`, `tile`, `icon`, `avatar`, `chip`, `search`, `pill`) belong to the shared layer only.** |
| Shared JS utilities | Scroll reveal, count-up, pointer glow, reduced-motion check, cached fetch, in-view helper. Sections consume them; they do not re-implement. |
| Section IDs | As listed in `DESIGN_SYSTEM.md` §3; stable, lowercase, no changes after launch. |
| Assets | `assets/` for resume, certificates, avatar, project images; file names kebab-case. |
| Comments | Explain *why*, not *what*; each file begins with a purpose line and its dependencies. |
| Progressive enhancement | Every interactive element has a no-JS fallback (links stay links; content visible). |

---

## 9. Reconciliation list — fix at merge

Findings from the phase-by-phase review. Resolve each to the standard, not to the nearest phase.

### 9.1 Cross-cutting

| # | Finding | Standard |
|---|---|---|
| C1 | Scroll-reveal logic repeated in six sections with six attribute names | One shared reveal utility and one attribute |
| C2 | Count-up logic repeated in three sections with different timings | One shared count-up; 1.1–1.2 s, ease-out |
| C3 | Pointer-glow logic repeated in three sections (About, Skills, Contact) | One shared utility |
| C4 | Section padding, eyebrow, title and subtitle styles redefined per section | One **section header** component and one section padding token |
| C5 | Card radius varies: 16, 18, 20, 22, 26 | Radius scale (card = 20, featured = 24) |
| C6 | Card hover lift varies: −4, −5, −6 | −4 px for all cards |
| C7 | Image/placeholder zoom varies 1.06–1.08 | 1.06 |
| C8 | Hard-coded hex values (success, warning, danger, indigo, blues) inside components | Colour tokens |
| C9 | Breakpoints: 1000, 860, 760, 720, 640, 560, 520, 480 | 1000 / 760 / 520 |
| C10 | Off-scale spacing values (0.35, 0.55, 0.65, 0.85, 0.9, 1.1 rem …) | Spacing scale |
| C11 | Generic class names collide across sections (e.g. an avatar name used in About and Analytics; chip/search/toolbar duplicated in Projects and Skills) | Shared components own generic names; sections use scoped names |
| C12 | Small-button size defined in several places | One size modifier in the shared button |
| C13 | Large-button size defined only in Contact | Shared button size |
| C14 | Tag/chip styles repeated in Projects, Skills and Achievements | One tag component |
| C15 | Focus styling for whole-card links relies on a newer selector | Provide a fallback ring on the link itself |
| C16 | A superseded single-file prototype still exists | Delete before merge |

### 9.2 By phase

| Phase | Items to align |
|---|---|
| **Landing + Nav** (source of tokens) | Add the new sections to navigation (Analytics, Achievements, Resume/Experience); primary-button gradient contrast (see `COLOR_SYSTEM.md` §5); promote its tokens to the standard names; hero uses CSS-only reveal — acceptable, but must match reveal tokens |
| **About** | Avatar ring is a *section-specific* component — rename to avoid generic collision; info cards align to Cards-4 pattern; card radius 18 → 20 |
| **Projects** | Own the **filter chip**, **search** and **toolbar** definitions as shared components; lift −6 → −4; local card radius 22 → 20 |
| **Skills** | Uses the shared chip/search/toolbar; icon container and stat tiles use shared names; documented dependency on an external icon CDN with letter fallback |
| **Analytics** | Status colours → semantic tokens; tiles/cards → shared; dependency on third-party APIs documented; success dot colour alignment |
| **Achievements** | Remove duplicate small-button; certificate card is the shared media card; dialog is the shared dialog |
| **Contact / Footer** | Large button → shared; social icon button → shared icon button; back-to-top is a shell element, independent of any section |

### 9.3 Content / IDs

| Item | Standard |
|---|---|
| Section IDs | `home, about, projects, skills, analytics, achievements, experience, contact` (+ `resume` inside contact) |
| Resume file | One path used by About, Contact and Footer |
| Usernames and emails | Defined once in a single content/config location, referenced everywhere |
| Experience section | Not built — either build to this system or remove from nav/footer plans |

---

## 10. Planned features (design rules for later)

| Feature | Rule |
|---|---|
| **Command palette** (Ctrl/⌘ + K) | Native dialog, `radius-2xl`, search field on top, grouped results (Navigate, Projects, Links, Actions), keyboard arrows + Enter, Esc closes, footer hint row with key caps; opening trigger visible in nav on desktop |
| **Theme toggle** | Icon button in nav; system preference is default; choice persisted; dark remains the reference design |
| **Loading screen** | Full-screen base colour, wordmark + thin indeterminate bar, ≥ 600 ms minimum, fades out 600 ms, skipped under reduced motion; must never block content for more than a second beyond real load |
| **Key caps** | Mono, radius `sm`, glass fill, border — already used in hints |

---

## 11. Merge checklist

**Visual**
- [ ] All sections share the same header, padding, container and grid gaps
- [ ] Only the three breakpoints exist
- [ ] Radius, lift, zoom and shadow levels match the scales
- [ ] No hard-coded colours remain in components
- [ ] Primary button contrast fixed

**Behaviour**
- [ ] One reveal, one count-up, one pointer-glow implementation
- [ ] Nav lists every section, highlights the current one, closes on mobile after click
- [ ] Back-to-top ring and focus return work
- [ ] Filters announce counts; empty states appear

**Resilience**
- [ ] Page is fully readable with JavaScript off
- [ ] Reduced motion removes all non-essential animation
- [ ] Third-party failures show "Offline" states and never break layout
- [ ] No horizontal scroll at 360 px

**Accessibility**
- [ ] Keyboard-only run-through of every control
- [ ] Heading outline has no gaps
- [ ] Contrast spot-checks on muted text, tags and buttons
- [ ] External links announce new-tab behaviour

**Content**
- [ ] All placeholders replaced (name, usernames, email, resume, images, certificates)
- [ ] Dates and numbers verified
- [ ] Meta title/description and favicon set
