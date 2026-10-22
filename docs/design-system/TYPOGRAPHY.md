# Typography

Two typefaces, one scale, strict roles. Headlines are tight and confident; labels are monospaced and quiet.

---

## 1. Typefaces

| Role | Family | Weights | Fallback stack |
|---|---|---|---|
| **UI & content** | Inter | 400, 500, 600, 700 | system-ui, -apple-system, Segoe UI, Roboto, sans-serif |
| **Labels, data, code, tags** | JetBrains Mono | 400, 500 | ui-monospace, SFMono-Regular, Menlo, monospace |

**Loading:** both from one font request with `display=swap`; preconnect to the font hosts. Limit to the weights above.

**Why this pairing:** Inter gives the Apple/Linear neutrality; the mono face adds the developer-dashboard voice without needing decoration.

---

## 2. Type scale

Sizes use fluid ranges so no breakpoint overrides are needed. Format: `min → preferred → max` in rem.

| Token | Role | Size | Weight | Line height | Tracking |
|---|---|---|---|---|---|
| `type-display-xl` | Hero headline | 2.6 → 8vw → 5.5 | 700 | 1.05 | −0.04em |
| `type-display-lg` | Closing CTA headline | 2.0 → 6vw → 4.0 | 700 | 1.08 | −0.04em |
| `type-heading-xl` | **Section title** | 2.0 → 5vw → 3.25 | 700 | 1.1 | −0.035em |
| `type-heading-lg` | Featured card title, big stat value | 1.4 → 3vw → 2.0 | 600–700 | 1.2 | −0.03em |
| `type-heading-md` | Card title | 1.15 → 1.3 | 600 | 1.3 | −0.02em |
| `type-heading-sm` | Row / small card title | 1.0 → 1.05 | 600 | 1.35 | −0.01em |
| `type-body-lg` | Section subtitle, lead paragraph | 1.0 → 1.6vw → 1.15 | 400 | 1.6 | 0 |
| `type-body` | Default paragraph | 1.0 | 400 | 1.6 | 0 |
| `type-body-sm` | Card descriptions | 0.95 | 400 | 1.55 | 0 |
| `type-caption` | Hints, meta, helper text | 0.85–0.88 | 400 | 1.5 | 0 |
| `type-label` | Eyebrow, tile label, filter label | 0.72–0.8, mono, uppercase | 500 | 1.4 | +0.08 to +0.14em |
| `type-tag` | Tech tags, skill chips | 0.72–0.75, mono | 500 | 1.2 | 0 |
| `type-data` | Stats, counters | 1.7 → 2.6, tabular figures | 700 | 1.1 | −0.03em |
| `type-code` | Terminal card, inline code | 0.85, mono | 400 | 1.9 | 0 |

**Consolidation notes for the merge**
- Section title currently appears as five slightly different clamp values; use `type-heading-xl` only.
- Eyebrow is `type-label` with tracking **+0.14em** and accent colour; tile labels use **+0.08–0.1em** and muted colour.
- Collapse the many card-title sizes (1.05 / 1.1 / 1.15 / 1.2) into `heading-md` (1.2) and `heading-sm` (1.05).

---

## 3. Hierarchy within a section

Every section header uses the same three-line stack:

| Layer | Style | Colour | Spacing below |
|---|---|---|---|
| Eyebrow | `type-label`, uppercase | `color-text-accent` | 8–10 px |
| Title | `type-heading-xl` + **one** gradient phrase | primary | 16 px |
| Subtitle | `type-body-lg`, max width 40 rem | muted | 40 px to content |

---

## 4. Rules

**Measure & wrapping**
- Paragraph max width: 34–40 rem (≈ 60–68 characters).
- Headlines may break manually only in the hero and closing CTA (two-line statement). Everywhere else let the browser wrap.
- Long unbroken strings (emails, repo names) must wrap anywhere.

**Numerals**
- All counters, stats, percentages and dates use **tabular figures** so values do not jitter while animating.
- Large numerals may take the accent gradient; small numerals stay primary.

**Case**
- Sentence case for titles and buttons. UPPERCASE only for `type-label`.
- No all-caps body text; no italics except in quoted testimonials (none planned).

**Punctuation**
- Typographic apostrophes and quotes (’ “ ”), en dash for ranges (2022 – 2026), middle dot as separator (·), ellipsis character (…).
- Straight quotes belong only to code.

**Links**
- Inline links: accent colour, underline on hover with 3 px offset.
- Card links: whole card clickable; the heading text is the link text.
- External links announce "opens in a new tab" for assistive tech.

**Weight discipline**
- 700 only for display, section titles and big numbers.
- 600 for card titles and buttons-as-emphasis.
- 500 for buttons, chips, labels.
- 400 for everything else.

**Truncation**
- Descriptions on repo cards clamp to 3 lines; titles never truncate.
- Never truncate user-critical content (emails, dates).

---

## 5. Accessibility

- Body text is never below 15 px equivalent; captions never below 13 px; mono micro labels are the only 12 px elements and must be uppercase with tracking.
- Minimum text contrast 4.5 : 1 (see `COLOR_SYSTEM.md`); muted text meets it on all glass surfaces.
- Respect browser text-size settings: all sizes in rem, never px for type.
- One `h1` per page (hero). Section titles are `h2`; card titles `h3`; list-item titles inside cards `h4`. Do not skip levels.

---

## 6. Don'ts

- No third typeface, no display or script fonts.
- No text shadows. No letter-spacing on body text.
- No gradient text below 1.4 rem (legibility).
- No centred long paragraphs; centre only the hero, closing CTA and short empty states.
