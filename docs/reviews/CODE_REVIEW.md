# Code Review

**Scope:** 8 HTML fragments, 7 CSS files, 9 JS files, and the folder layout, reviewed as a production-release architect would. **Method:** read-through plus scripted counts (duplicate selectors, colour/radius/breakpoint usage, duplicated logic, unused classes, syntax check). Nothing was modified.

## 1. Summary

| Priority | Count |
|---|---|
| High | 1 |
| Medium | 9 |
| Low | 9 |

**Overall:** clean, readable, defensive code. Each file has a purpose header, scripts use strict mode and module-style objects, third-party calls are time-limited and cached, no dead CSS, no syntax errors. The weaknesses are **repetition across phases** (a natural result of building one section at a time) and **missing project scaffolding**. Both are cheap to fix at merge time, and the design-system documents already define the targets.

## 2. Inventory and dependency map

| Area | Files | Depends on |
|---|---|---|
| Foundation + Landing + Nav | `index.html`, `styles.css`, `main.js` | Fonts |
| About | `about.html/.css/.js` | styles.css tokens and button, container |
| Projects | `projects.html/.css/.js` | styles.css |
| Skills | `skills.html/.css/.js` | styles.css, external logo CDN |
| Analytics | `analytics.html/.css`, `analytics.js`, `github.js`, `leetcode.js` | styles.css; **load order: analytics → github → leetcode** |
| Achievements | `achievements.html/.css/.js` | styles.css |
| Contact + Resume + CTA | `contact.html/.css/.js` | styles.css |
| Footer + back-to-top | `footer.html` | `contact.css/.js` (shared styles and script) |

Notable: the footer fragment has no stylesheet or script of its own — it relies on Contact's — so it cannot be included without them.

## 3. What is good

| Area | Observation |
|---|---|
| Structure | Per-section file trios, clear headers, ordered CSS sections (tokens → base → components → motion → responsive) |
| Naming | Consistent block__element--modifier style; state classes `is-ready`, `is-visible`, `is-entering`; JS hooks via `data-*` attributes |
| Progressive enhancement | Content visible without JS; hiding for reveal only after the script marks the section ready |
| Resilience | Timeouts, parallel fetching with partial-failure handling, graceful "—" states, icon fallback, clipboard fallback |
| Safety | Dynamic text set with `textContent`; the one `innerHTML` copies the page's own markup; no `eval`; links carry `noopener` |
| Hygiene | No dead CSS; no `transition: all`; `!important` only in reduced-motion; all runtime-set custom properties are intentional |

## 4. Issues

| ID | Issue | Why it matters | Recommendation | Priority |
|---|---|---|---|---|
| CR-01 | **Duplicated JS utilities:** the scroll-reveal observer is written 6 times, count-up 3 times (three durations: 0.65 s, 1.1 s, 1.2 s), pointer glow 3 times, the reduced-motion check 7 times, the `$` helper 4 times. | A fix or tweak must be repeated; behaviour has already drifted (count-up timing). | One shared utilities file loaded before the section scripts, exposing reveal, count-up, glow and motion preference. | Medium |
| CR-02 | **Duplicated CSS components:** filter chip, search field and toolbar exist in both Projects and Skills; small-button in Projects (global) and Achievements (scoped); large-button only in Contact; tag styles recur in several files. | Visual drift and double maintenance. | Create shared component styles (button sizes, chip, search, tag, glass card, section header, icon tile) and delete the section copies. | Medium |
| CR-03 | **No single source of content.** Placeholder profile data is typed directly into many places: username ×19, email ×8, name ×5, resume path ×3, social URLs in 3 sections plus the footer. Analytics reads its usernames from attributes on its own section. | Updating one detail means editing five files, and mismatches are likely. | One content/config file (name, role, email, resume path, social URLs, usernames) read by a small build step or loader; ban hand-typed duplicates. | High |
| CR-04 | **Project scaffolding is missing:** no README, no package manifest or build, no lint/format configuration, no assets folder, favicon, 404, `robots.txt` or sitemap; no `.gitignore` or `.editorconfig`. | New contributors, CI and deployment have nothing to work from; assets referenced in HTML do not exist. | Add the structure in §5, a short README (run, build, deploy, content editing), and the missing public files. | Medium |
| CR-05 | **Fragments are pasted manually** into `index.html`; the merge order and the matching link/script tags live only in conversation notes. | Easy to miss a stylesheet, paste in the wrong order or forget the footer's dependency. | Document the merge manifest (order of sections, CSS and JS) in the README, or generate the page from partials at build time. | Medium |
| CR-06 | **Generic class names live in section files:** `icon`, `stat`, `cat`, `skill`, `tile`, `pill`, `cell`, `seg`, `repo`, `tags`, `chip`, `search`. One collision (`avatar`) already occurred and was fixed by renaming. | Any later component reusing a common word can silently restyle another section. | Reserve generic names for the shared layer; give section-specific parts a consistent prefix or scope all rules under the section class. | Medium |
| CR-07 | **Token coverage is partial:** only the core palette, radius 12 px, nav height and easing are tokens. Section files define their own `--card-radius` (6 times), use 30+ hard-coded hex colours outside the token definitions (plus many translucent tints), 14 distinct pixel radii and many off-scale rem spacings. | Retheming or rescaling requires touching every file. | Expand `:root` to the full token set from the design-system documents, then replace literals. | Medium |
| CR-08 | **No security headers or content-security policy guidance.** 71 inline `style` attributes (staggers, placeholder gradients) would force a permissive style policy. | A static site still benefits from CSP, referrer policy and frame protection; inline styles weaken CSP. | Set headers at the host; replace presentational inline styles with data attributes or classes; allow-list only the required third-party origins. | Medium |
| CR-09 | **Hidden coupling between scripts:** `github.js` and `leetcode.js` exit silently if `analytics.js` has not loaded. | Misordered tags produce a blank dashboard with no clue why. | Warn in the console, or bundle the three in one fixed order. | Medium |
| CR-10 | **No automated quality gates:** no HTML validation, CSS/JS linting, accessibility scan, link checker or Lighthouse budget. | Regressions (such as a new low-contrast colour) reach production unnoticed. | CI step: HTML validator, Stylelint, ESLint, axe, link checker, Lighthouse CI with the budgets in PERFORMANCE_REPORT §6. | Medium |
| CR-11 | **Near-duplicate animations:** 15 keyframes including 4 identical "fade-in-up" variants, 3 glow pulses and 2 status pulses. | Bloat and inconsistent timing. | One entrance, one glow and one pulse keyframe in the shared layer. | Low |
| CR-12 | **Magic numbers** for timings and thresholds (observer thresholds 0.1–0.15, count-up 650–1200 ms, typing speeds) are spread through the scripts. | Hard to retune globally. | Group them in one configuration object next to the motion tokens. | Low |
| CR-13 | **External responses are trusted for URLs:** profile, repository and badge URLs from APIs are assigned to `href` and `src` without checking the scheme or origin. | Low risk with official GitHub data, but a compromised third-party response could inject an unsafe link. | Accept only `https:` URLs and expected hosts before assigning. | Low |
| CR-14 | **Cache entries are unversioned** and store raw third-party payloads under URL keys. | A future change to the stored shape could be fed stale data for up to 30 minutes; storage bloat (PERF-06). | Prefix keys with a version and store reduced objects. | Low |
| CR-15 | **Prefix scheme is inconsistent:** `an-`, `ach`, `c-`, `r-` prefixes alongside BEM blocks (`cert`, `project`, `feature`). | Harder to predict where a class lives. | Pick one convention (section-name block names) and apply it. | Low |
| CR-16 | **Leftover rules:** a redundant `text-decoration: none` rule on achievements buttons; 10 hook classes in the markup with no style (`certs`, `repos`, `langs`, `solved`, `resume__body` …). | Small noise; unclear whether they are intentional. | Remove the no-op rule; keep hook classes only if scripts or future styles use them. | Low |
| CR-17 | **No declared browser support policy.** The CSS uses `dialog`, `:has()`, `svh`/`dvh`, `inset`, `aspect-ratio` and `backdrop-filter`. | Unknown fallback expectations (older iOS lacks some of these). | State support (for example the latest two years of evergreen browsers) and test the fallbacks accordingly. | Low |
| CR-18 | **Stray files in the output folder:** the superseded single-file prototype (`portfolio.html`) and a hidden artifacts state folder sit beside the real project. | Risk of editing or deploying the wrong file. | Delete the prototype and exclude tool folders from the repository. | Low |
| CR-19 | **Failures are swallowed silently** in several `catch` blocks (storage, parsing). | Hard to diagnose in production. | Log at debug level behind a flag. | Low |

## 5. Recommended folder structure (plan only)

| Path | Purpose |
|---|---|
| `/` | `index.html` (merged page), `README`, `robots`, `sitemap`, `404`, favicon files, build/lint config |
| `/src/content` | one profile/config file (name, role, links, usernames, project and certificate lists) |
| `/src/partials` | the section HTML fragments, in page order |
| `/src/styles` | `tokens`, `base`, `layout`, `components` (button, card, chip, tag, icon tile, section header, dialog), then `sections/` (one file per section) |
| `/src/scripts` | `ui` (shared utilities), `sections/` (one file per section), `data/` (analytics, GitHub, LeetCode) |
| `/public/assets` | `resume`, `certificates`, `projects`, `avatar`, `icons` (self-hosted logos) |
| `/docs` | the design-system documents and these review reports |

## 6. Merge readiness checklist

| Step | Status |
|---|---|
| Resolve CR-01 and CR-02 into shared layers | To do |
| Move content to one config (CR-03) | To do |
| Expand tokens and replace literals (CR-07) | To do |
| Update the navigation for all sections (QA-01, RESP-01) | To do |
| Fix filled-button contrast (ACC-01) | To do |
| Add assets, favicon and meta (SEO-01…SEO-08) | To do |
| Decide the live-data strategy (PERF-07, QA-04) | To do |
| Scaffolding, lint and CI (CR-04, CR-10) | To do |
| Re-run all six reviews on the merged build | After merge |

## 7. Verdict

**Approve for merge preparation with changes.** No defects that block merging were found in the code itself. Resolve CR-03 (High) and the shared-layer work (CR-01, CR-02, CR-06, CR-07) as part of the merge, so the final build is a single coherent system rather than seven stitched phases.
