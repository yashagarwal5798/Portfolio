# Phase 12 — Merge Report

**Result:** Phases 2–10 merged into `final/`, following `PHASE11_INTEGRATION_PLAN.md` and the Phase 9 design system. All personal data is a `YOUR_…` placeholder.
**Existing folders:** `portfolio/`, `design-system/`, `reviews/`, `portfolio-site/`, `portfolio.html` and the Phase 11 plan were **not modified** (72 files checksummed before and after: 72 identical).

## 1. Decisions applied (approved "with recommendations")

| ID | Decision | Applied |
|---|---|---|
| D1 | `portfolio-site/` was reference only | Yes; `final/` was rebuilt from the original phase files |
| D2 | Theme toggle | Included; dark is the default |
| D3 | Nav collapse breakpoint | 1000 px |
| D4 | Button colour | Darker blue gradient (blue-600 → blue-700) for contrast |
| D5 | LeetCode strategy | Optional snapshot file (`data-leetcode-snapshot`) with live API as fallback |
| D6 | Script style | Classic deferred scripts, one namespace (works from `file://`) |
| D7 | Experience section, command palette | Not built (later phase) |
| D8 | About header | Standard header added |
| D9 | Achievement numbers | Static sample values, relabelled "all-time" |
| D10 | Self-host fonts/logos | Deferred (still Google Fonts + jsDelivr) |
| D11 | Hosting target | Not chosen; README lists the headers to set |
| D12 | Content | Placeholders first |

## 2. Merged file checklist

### HTML (8 → 1)
| Source (`portfolio/`) | Final location | Status |
|---|---|---|
| `index.html` | `index.html` (shell, head, nav, hero) | Merged; SEO head added |
| `about.html` | `#about` | Merged; standard header added |
| `projects.html` | `#projects` | Merged |
| `skills.html` | `#skills` | Merged |
| `analytics.html` | `#analytics` | Merged; `noscript` note added |
| `achievements.html` | `#achievements` | Merged; certificates regenerated with placeholders |
| `contact.html` | `#contact`, `#resume` | Merged |
| `footer.html` | after `</main>` (footer + back-to-top) | Merged |

### CSS (7 → 5)
| Source | `variables` | `style` | `components` | `animations` | `responsive` |
|---|---|---|---|---|---|
| `styles.css` | tokens | base, nav, hero, background | buttons | keyframes | nav collapse |
| `about.css` | — | layout | avatar, info card | — | stacking |
| `projects.css` | — | grid, toolbar | project card, chip, search, tag | — | columns |
| `skills.css` | level colours | category grid, stats | category card, skill row, progress | progress fill | columns, small-phone stats |
| `analytics.css` | difficulty colours | dashboard grid | cards, tiles, calendar, repos, pills | — | columns |
| `achievements.css` | — | grids | achievement, featured, certificate, dialog | — | columns |
| `contact.css` | — | contact grid, footer, CTA | contact card, resume, social, back-to-top | — | stacking |
| *(new)* | light theme, motion tokens | section scaffold + header | icon button, size modifiers, wrapping | single entrance/glow/pulse/shimmer, reveal, reduced-motion | touch, print, forced-colors |

### JavaScript (9 → 7)
| Source | Final module |
|---|---|
| `main.js` | `ui.js` (nav, menu, active link, scroll cue), `animations.js` (typing), `main.js` (boot) |
| `about.js`, `projects.js`, `skills.js`, `achievements.js`, `contact.js` | `ui.js` (filters, gallery, dialog, copy, back-to-top) and `animations.js` (reveal, glow, counters) |
| `analytics.js` | `utils.js` (fetch, streak, helpers), `animations.js` (count-up), `ui.js` (card state, avatar) |
| `github.js` | `github.js` |
| `leetcode.js` | `leetcode.js` (+ snapshot option) |
| *(new)* | `theme.js` |

### Other files
`404.html`, `robots.txt`, `sitemap.xml`, `README.md`, `assets/icons/{favicon.svg, apple-touch-icon.png}`, `assets/images/og-image.png`, `assets/resume/YOUR_RESUME.pdf` (placeholder), `assets/certificates/YOUR_CERTIFICATE_1…9.pdf` (placeholders), `docs/` (design system, reviews, Phase 11 plan, this report, `tools/check.mjs`).

Note: the tool environment embeds content-credential metadata in generated image/SVG files, so some are larger than their visual content needs.

## 3. Review findings (Phase 10)

**Fixed:** QA-01, 02, 06, 07, 08, 10–17 · RESP-01, 02, 03, 05, 06, 08, 09, 12 · ACC-01, 02, 03, 04, 06, 07, 08, 09, 11, 12, 13, 14, 15 · PERF-02, 03 (non-blocking), 06, 07, 09, 12, 13, 14 · SEO-01, 02, 04–08, 10, 13 · CR-01, 02, 05, 06, 07, 09, 11, 13, 14, 18.

**Partly fixed:**
| ID | What is done | What remains |
|---|---|---|
| QA-03 / SEO-03 | All personal data is a `YOUR_…` token; placeholder PDFs make every link work; checker lists the rest | You must replace them |
| QA-05 | Theme toggle built | Experience, command palette, loading screen (D7) |
| ACC-05 | Typing pauses on hover/focus and in hidden tabs; ambient loops pause off-screen | No site-wide motion toggle; decorative loops still run for users without the OS setting |
| ACC-16 | Certificates announce "(PDF)" | Resume button text unchanged |
| PERF-01 | Lighter blur on phones; off-screen pause | Blur cost still needs a real-device measurement |
| PERF-11 | `dns-prefetch` for API/CDN hosts | No preconnect on demand |
| SEO-09 | Image paths/alt pattern in comments | Real images not yet added |
| CR-03 | Consistent placeholder tokens + checker | Still edited by hand in `index.html` |
| CR-10 | Checker script | No CI pipeline |

**Not done (deferred or judged risky):** PERF-04 (minify/bundle), PERF-05 and PERF-10 (self-hosted logos/fonts and image budget, D10), PERF-08 (`content-visibility`: can misplace anchor jumps), ACC-10 (calendar data table), RESP-04 (partly: only 3 breakpoints remain but nothing else changed), RESP-07 (skills rows on very small phones not changed), RESP-10 (`overflow-x: hidden` on body kept), RESP-11, SEO-11, SEO-12, SEO-14, CR-04 (no package manifest by design), CR-08 (headers are documentation only), CR-12, CR-15, CR-16, CR-17 (no browser-support statement yet), CR-19.

## 4. Verification results

Environment: headless Chromium (Playwright), local web server and `file://`. GitHub/LeetCode were tested with **mocked responses** only; live services were not reachable.

| Area | Result |
|---|---|
| Shipped build (placeholders) | No JS errors; 24 local files referenced, all return 200; title and canonical carry placeholders; both cards show "Offline — set your username" |
| GitHub module | Counters, 12-day streak, top languages, 6 repo cards, 376-cell calendar all render; status "Live" |
| LeetCode module | Solved 212 (110/80/22), acceptance 50.0 %, rating 1,635, badge, streak 5; status "Live" |
| Achievements counters | 45 · 350+ · 1,200+ · 8 · 5 · 12 animate and settle |
| Projects | Java filter → 1 of 4; empty search shows empty state |
| Skills | Search "python" → 1 technology; counters update |
| Certificates | 6 shown → 9 on expand; dialog opens, shows title/download link, closes with Esc |
| Theme | Toggles to light and back; choice persisted |
| Contact | Copy button copies the email placeholder; back-to-top appears and returns to 0 |
| Navigation | 7 nav links, 7 footer links (incl. `#resume`), hero button, About "Contact Me", Achievements "See the project": **all land on target; active link correct** |
| Responsive | 1440, 1280, 1024, 1000, 900, 768, 414, 390, 360, 320 px: no horizontal overflow, no clipped text; hamburger from 1000 px down; inline nav fits at 1024 |
| Scripts off | No hidden content; loading pills hidden |
| Reduced motion | Reveal gate off, 0 running animations, static first typing role |
| `file://` | All modules load, no errors |
| APIs blocked | Both cards "Offline" with explanation; rest of page works |
| Accessibility scan | 0 unnamed buttons/links, 0 images without alt, 0 heading skips, 1 `h1`, skip link is first Tab stop and moves focus to `main` |
| Structure | No duplicate ids; no broken anchors; balanced tags; 3 breakpoints, 11 keyframes, no raw colours or pixel radii in component CSS |

**Bugs found and fixed during verification:** a leftover fragment of an old certificate after the first regeneration; featured-card text clipped on phones when a long unbroken word appeared (now wraps).

**Not tested:** live GitHub/LeetCode/contributions responses, Safari/iOS, Firefox, real screen readers, Lighthouse/axe scores, real-device performance.

## 5. Placeholder inventory
`YASH AGARWAL`, `YOUR_EMAIL`, `YOUR_GITHUB_USERNAME`, `YOUR_LEETCODE_USERNAME`, `YOUR_LINKEDIN_URL`, `YOUR_X_URL`, `YOUR_INSTAGRAM_URL`, `YOUR_DOMAIN`, `YOUR_RESUME.pdf`, `YOUR_CERTIFICATE_1…9` (+ `_TITLE_`, `_IMAGE_`), `YOUR_ORGANIZATION`, `YOUR_DATE`, `YOUR_SKILL_1…3`, `YOUR_PROJECT_TITLE_1…4`, `YOUR_PROJECT_DESCRIPTION`, `YOUR_PROJECT_IMAGE_1`, `YOUR_REPOSITORY_1…4`, `YOUR_LIVE_DEMO_URL`, `YOUR_FEATURED_ACHIEVEMENT_TITLE/DESCRIPTION`, `YOUR_ROLE`, `YOUR_NUMBER`, `YOUR_DEGREE`, `YOUR_UNIVERSITY`, `YOUR_CITY`, `YOUR_COUNTRY`, `YOUR_AVATAR`. Run `node docs/tools/check.mjs .` for counts.

Sample (non-token) content to review: achievement numbers, skills and levels, project tags/categories, typing roles, About paragraphs.

## 6. Stop point
Phase 12 ends here. No further improvements will be made until you approve.
