# QA Report — Developer Portfolio (pre-merge review)

**Reviewer role:** Senior Frontend Architect / QA · **Scope:** all completed phases (Landing + Nav, About, Projects, Skills, Analytics, Achievements, Contact + Resume + Footer) · **Standard:** `design-system/` documents

## 1. Method and limits

This is a **static review**: every HTML, CSS and JS file was read, and scripted checks counted selectors, colours, radii, breakpoints, IDs, headings, links and duplicated logic. **Not done:** rendering in a browser, device testing, calling the live GitHub / LeetCode APIs, or measuring with Lighthouse. Findings that depend on those are marked *estimate* or *unverified*. Nothing was merged or modified.

## 2. Release verdict

**Not release-ready — expected, since the phases are unmerged.** No blocking code defects were found (all 9 JS files parse; no duplicate IDs; every in-page anchor resolves once the fragments are merged). The blockers are **content and integration**: placeholder data and missing assets, an incomplete navigation, contradictory numbers between sections, and an unverified LeetCode data path.

| Priority | Count |
|---|---|
| High | 4 |
| Medium | 9 |
| Low | 4 |

## 3. What passed

| Check | Result |
|---|---|
| Duplicate element IDs across all fragments | None |
| In-page `href="#…"` links without a target (after merge) | None |
| Exactly one `h1`; no skipped heading levels | Pass (one empty `h3` inside the closed dialog) |
| External links with `target="_blank"` missing `rel="noopener"` | 0 of all |
| Reduced-motion handling in every stylesheet | 7 of 7 |
| `transition: all`; stray `!important` | 0; 3 (all inside reduced-motion) |
| CSS custom properties used but never defined | None (the few "undefined" ones are set at runtime: stagger index, pointer position) |
| CSS classes never referenced by HTML/JS (dead CSS) | None |
| `hidden` attribute overridden by `display:flex/grid` | Handled everywhere it matters |
| Typing animation has screen-reader text and static fallback | Pass |
| Core colours, section title size, eyebrow style, section padding | Consistent across all phases |

## 4. Issues

### 4.1 Functional and integration

| ID | Issue | Why it matters | Recommendation | Priority |
|---|---|---|---|---|
| QA-01 | Navigation lists only Home, About, Projects, Skills, Contact. Analytics, Achievements (and Experience) have no link. The active-link logic only observes sections that are in the menu, so while viewing Analytics or Achievements the highlight stays on "Skills". | Visitors cannot navigate to two of the strongest sections, and the nav shows a wrong state. | Add every section to the nav in page order; confirm active-state on all; keep desktop/mobile menus in sync (see RESP-01). | High |
| QA-02 | Achievements shows static numbers (45-day streak, 350+ solved, 1,200+ contributions) while Analytics shows live numbers for the same metrics. | After merge the page will contradict itself, which damages credibility more than missing data. | Single source of truth: either feed Achievements from the live data, or relabel them as fixed milestones ("longest streak", "all-time"). | High |
| QA-03 | Placeholder content and missing assets: `your-username` ×19, `hello@example.com` ×8, `https://example.com` Live Demo ×4, "Your Name" ×5, and 30+ references into an `assets/` folder that does not exist (resume PDF, 9 certificates, avatar, project images). | Shipping would produce 404s on View/Download/Resume, dead demo links and generic copy. | Create one content/config file; add the `assets/` folder; replace placeholders; add a pre-release grep for `your-` and `example.com`. | High |
| QA-04 | LeetCode integration depends on a free community API whose response fields were **not verified against the live service**. Wrong field names leave tiles on "—". | A headline feature may appear broken on launch. | Verify each endpoint with the real username before release; prefer a build-time snapshot or a small proxy (see PERF-07). | High |
| QA-05 | The brief's feature list is not fully covered: Experience section, Command Palette (Ctrl+K), theme toggle and loading screen are not built. The hero still advertises none of them, but the original scope listed them. | Stakeholder expectation gap. | Decide scope explicitly: build per `UI_RULES.md` §10 or formally defer to v1.1. | Medium |
| QA-06 | Analytics without JavaScript shows "Loading" status pills and "—" values permanently. | Misleading state for no-JS, blocked-script and crawler views. | Add a `noscript` message; make the default server-rendered state neutral ("Live data requires JavaScript"). | Medium |
| QA-07 | `analytics.js` must load before `github.js` and `leetcode.js`; if the order changes they exit silently. | Fragile coupling that fails with no clue. | Log a console warning when the shared core is missing, or bundle them in a fixed order. | Medium |
| QA-08 | "Updated Oct 2026" on the resume card is hard-coded. | It becomes stale and untrue. | Set from a single config value, or remove the date. | Low |
| QA-09 | Contact is mailto-only (no form, no fallback if no mail client). | Visitors on shared computers cannot send a message. | Keep copy-email (already present); optionally add a form service later. | Low |

### 4.2 UI consistency

| ID | Issue | Why it matters | Recommendation | Priority |
|---|---|---|---|---|
| QA-10 | **Section headers differ:** every section has eyebrow + title + subtitle except About, which has only an eyebrow and uses the person's name as the `h2`. | The first content section looks unlike the rest. | Give About the standard header; keep the name as a card/lead element. | Medium |
| QA-11 | **Card radius varies for equal-rank cards:** 18 (About tiles), 20 (Achievements, Contact), 22 (Projects, Skills, Analytics, certificates). Featured: 24/26. | Visible softness differences between sections. | Apply the radius scale: standard card 20, featured 24, CTA 32. | Medium |
| QA-12 | **Hover lift varies:** −4, −5 and −6 px; image zoom 1.06 vs 1.08. | Interaction feel is inconsistent. | Standardise to −4 px and 1.06. | Medium |
| QA-13 | **Duplicated component CSS:** filter chip, search field and toolbar are defined in both Projects and Skills; small button defined in Projects (global) and Achievements (scoped); large button only in Contact. | Changes must be made twice; drift is already starting. | Move to shared components before merge (see CR-02). | Medium |
| QA-14 | Hover effects (lift, glow, zoom) are not limited to hover-capable devices. | On touch screens the "hover" state sticks after a tap. | Wrap hover-only transforms in a hover-capable media query. | Medium |
| QA-15 | Status greens differ (`#22c55e` vs `#34d399`); semantic colours are hard-coded (12 hex values in Analytics, 7 in Contact). | Colour drift and no single place to retune. | Introduce semantic tokens (see COLOR_SYSTEM §3). | Medium |
| QA-16 | Off-scale radii and spacing: 9, 10, 13, 14 px radii; 0.35–1.1 rem odd gaps. | Visual noise; harder maintenance. | Snap to the scales in `SPACING_SYSTEM.md`. | Low |
| QA-17 | JetBrains Mono loads weight 500 only, while the design system lists 400 and 500 and some labels request 400. | The browser substitutes 500; labels look heavier than designed. | Load 400 and 500, or standardise on 500 in docs and code. | Low |

### 4.3 Colour, typography, buttons, cards (summary)

| Area | Verdict | Note |
|---|---|---|
| Colour | Mostly consistent | Core palette identical everywhere; semantic colours and one gradient (QA-15, ACC-01) need tokens |
| Typography | Consistent | Same clamp for all section titles, same eyebrow, same label style; sizes under 12 px are an accessibility concern (ACC-03) |
| Buttons | Consistent look, inconsistent definition | QA-13; contrast on filled buttons fails (ACC-01) |
| Cards | Consistent recipe, inconsistent numbers | QA-11, QA-12 |
| Navigation | Behaviour good, content incomplete | QA-01 |
| Folder structure | Needs work | See CODE_REVIEW.md |

## 5. Recommended order of work

1. QA-01, QA-02, QA-03 (content/nav integrity) · 2. QA-04 and PERF-07 (live-data strategy) · 3. QA-13, QA-11, QA-12, QA-15 (shared components and tokens) · 4. ACC-01 (button contrast) · 5. Medium items · 6. Low items.

## 6. Test plan for release candidate

Browsers: current Chrome, Safari (iOS and macOS), Firefox, Edge. Widths: 360, 390, 768, 1024, 1280, 1440. States: JS off, reduced motion on, offline, API failure, empty filter results, keyboard-only, screen reader (VoiceOver and NVDA). Tools: Lighthouse (mobile), axe DevTools, WAVE, a contrast checker, and a manual 200% zoom pass.
