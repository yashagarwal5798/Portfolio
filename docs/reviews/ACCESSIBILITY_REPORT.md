# Accessibility Report

**Target:** WCAG 2.2 Level AA · **Method:** static review of markup, CSS and scripts; contrast ratios *calculated* from the colour values (not measured with a tool); no screen-reader or keyboard session was run. Treat everything below as a pre-audit; a manual pass with VoiceOver, NVDA and axe is still required.

## 1. Summary

| Priority | Count |
|---|---|
| High | 1 |
| Medium | 9 |
| Low | 6 |

The foundations are strong for a portfolio: real landmarks, correct heading hierarchy, native `dialog`, `aria-pressed` and `aria-expanded` used correctly, hidden text for icon-only controls, thorough reduced-motion support. The largest problem is **colour contrast on filled blue buttons**.

## 2. What already works

| Area | Evidence |
|---|---|
| Landmarks and structure | header + labelled `nav`, one `main`, footer; sections linked to their headings with `aria-labelledby` |
| Headings | One `h1`; `h2` per section; no skipped levels |
| Skip link | Present, first in tab order, visible on focus |
| Keyboard | Menu closes on Esc and returns focus; dialog traps focus and restores it; calendar scroller is focusable |
| Names | Icon-only buttons have `aria-label`; links that open a new tab say so; "View" and "Download" include the item name for screen readers |
| Toggles | Filters use `aria-pressed`; the certificate expander uses `aria-expanded` and `aria-controls` |
| Live updates | Filter counts use `role="status"` |
| Motion | `prefers-reduced-motion` handled in all 7 stylesheets and in JS (typing, counters, scrolling) |
| Non-colour cues | Difficulty and skill levels have text labels; the calendar has a text summary |
| Lists | `role="list"` restores list semantics on styled lists |
| Document | `lang` set; zoom not disabled; `color-scheme` declared |

## 3. Issues

| ID | Issue | Why it matters | Recommendation | Priority |
|---|---|---|---|---|
| ACC-01 | **Filled blue controls fail contrast.** White text on the primary gradient: against blue-400 ≈ 2.5 : 1, blue-500 ≈ 3.7 : 1, blue-600 ≈ 5.2 : 1. The same gradient is used for the selected filter chip. (WCAG 1.4.3) | The most important call-to-action buttons are hard to read for low-vision users and in sunlight. | Use a blue-600 → blue-700 gradient (≈ 5.2–6.7 : 1) or solid blue-600 for any fill under white text. | High |
| ACC-02 | Two text styles use reduced opacity: tile hint text and language percentages are muted text at 70% opacity, giving *about* 3.8 : 1. | Falls below 4.5 : 1 for small text. | Remove the opacity and use the muted token directly (≈ 6.8 : 1). | Medium |
| ACC-03 | Many small mono labels are set at 0.68–0.74 rem (≈ 11–12 px): 14 declarations across Analytics, Achievements, Contact, Projects and Skills. | Hard to read and, with letter-spacing and uppercase, tiring; breaks the system's own 12 px floor. | Raise to at least 0.75 rem (12 px). | Medium |
| ACC-04 | The skip link points to `#home` (the hero section), which is not a focusable target. | In some browsers focus does not move, so keyboard users are not actually skipped. | Point it at the `main` element and give that element `tabindex="-1"` and an `id`. | Medium |
| ACC-05 | The roles line cycles automatically for longer than 5 seconds with no way to pause. (WCAG 2.2.2) The ambient background and pulsing dots also run indefinitely. | Distracting for people with attention or vestibular issues who have not set reduced-motion at the OS level. | Pause the typing on hover/focus, or stop after one cycle; offer a motion toggle when the theme toggle is built. | Medium |
| ACC-06 | Status messages toggle from `hidden` to visible and change text in the same step; the analytics loading outcome is shown only in a pill that is not a live region. | Screen readers may not announce "Live data loaded / Offline / some data unavailable". | Keep one persistent, always-present polite live region per card and change only its text. | Medium |
| ACC-07 | Several controls are small: copy-email button ≈ 26 px high, filter chips and small buttons ≈ 36 px, status pills. | Misses the 44 px comfort target; the 24 px minimum (2.5.8) is only just met by the copy button. | Increase vertical padding or add an invisible hit area to ≥ 44 px on touch. | Medium |
| ACC-08 | The current navigation item uses `aria-current="true"`, and the highlight is wrong for Analytics and Achievements (QA-01). | Screen-reader users hear incorrect location information. | Use `aria-current="location"` and fix the section coverage. | Medium |
| ACC-09 | Without JavaScript the analytics cards keep the text "Loading" and "—" with no explanation. | Misleading to assistive tech and to anyone with scripts blocked. | Add a `noscript` message and a neutral default state. | Medium |
| ACC-10 | The calendar's per-day information is only a `title` tooltip on non-focusable cells (mouse and long-press only). | Keyboard and touch users cannot get daily values. | Provide an accessible data alternative (a summary table of weeks, or the busiest days) in a disclosure. | Medium |
| ACC-11 | The About section's `h2` is the person's name, so the section is announced as "Your Name" rather than "About". | Confusing landmark list; the nav says About. | Use "About me" as the heading and the name as supporting text, or add a visually hidden prefix. | Low |
| ACC-12 | Whole-card links remove the link's own outline and rely on a `:has()` rule on the card to show focus. | A browser without `:has()` support would show no focus indicator. | Keep an outline on the link as a fallback. | Low |
| ACC-13 | Windows high-contrast / forced-colors mode is not handled: the active filter chip is distinguished only by a gradient fill, which is removed. | The selected state becomes invisible. | Add a forced-colors rule that gives the selected chip a visible border/outline. | Low |
| ACC-14 | Icon links carry both a `title` and hidden text with the same label. | Some screen readers may announce the name twice. | Keep one of the two. | Low |
| ACC-15 | An empty `h3` sits inside the closed certificate dialog until it is opened. | Harmless while closed, but would be flagged by a static scan. | Seed it with a default title or skip heading-order checks inside the dialog. | Low |
| ACC-16 | Download links to PDFs do not say the file type or size. | Users cannot decide before downloading. | Add "PDF" (and size) to the visible text or hint. | Low |

## 4. Manual test script (to complete before release)

1. **Keyboard only:** Tab through the whole page; every control reachable, focus ring always visible, no traps; menu, filters, dialog, expander, copy and back-to-top all operable with Enter/Space/Esc.
2. **Screen reader (VoiceOver iOS + macOS, NVDA + Firefox):** landmark list, heading list, announcements for filters, copy confirmation, dialog open/close, live data states.
3. **Zoom and reflow:** 200% and 400% at 1280 px; no horizontal scrolling except the calendar.
4. **Contrast:** run a contrast checker on text over every glass surface (glass lets the animated background show through, so test a bright blob position).
5. **Reduced motion and no-JS:** OS reduced motion on; JavaScript disabled; both must leave all content readable.
6. **Touch:** tap targets and sticky hover on a real phone.
7. **Automated:** axe DevTools and Lighthouse accessibility; resolve all critical and serious findings.

## 5. Verdict

**Conditionally ready.** Fix ACC-01 (High) and the Medium items before release; Low items can follow.
