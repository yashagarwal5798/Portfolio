# Performance Report

**Method:** static review of file sizes, request inventory, CSS cost drivers, scripting patterns and third-party dependencies. **No Lighthouse or field data was collected**; Core Web Vitals statements are risk assessments, and size savings are *estimates*.

## 1. Summary

| Priority | Count |
|---|---|
| High | 2 |
| Medium | 8 |
| Low | 4 |

## 2. Asset inventory (source, unminified)

| Type | Files | Size | Notes |
|---|---|---|---|
| HTML (8 fragments, merged into 1 page) | 8 | ≈ 82 KB | Roughly 1,230 static elements; ≈ 1,650 once the 371-cell calendar and repository cards render |
| CSS | 7 | ≈ 78 KB | Unminified, separate files |
| JavaScript | 9 | ≈ 43 KB | Unminified, separate files |
| Web fonts | 2 families | via Google Fonts | Render-blocking stylesheet from a third-party host |
| Skill logos | 25 SVGs | third-party CDN (pinned version) | One request each, lazy-loaded |
| Live data | 4 services | GitHub API, a contributions API, 2 LeetCode API hosts | Called from the visitor's browser |

*Estimate:* minified and compressed, the first-party code should land around 15–25 KB for CSS + JS together, which is comfortably within budget.

## 3. Core Web Vitals risk (qualitative)

| Metric | Risk | Reason |
|---|---|---|
| **LCP** | Medium | The hero headline is the likely LCP element; it starts transparent and fades in with a delay, and the page waits on a render-blocking font stylesheet |
| **CLS** | Low | Images have explicit dimensions; skeletons keep size; hero uses stable heights; the font swap can cause small shifts |
| **INP** | Low–Medium | Light JS, but many blurred layers can make scrolling and hover janky on mid-range phones |

## 4. Strengths

Passive scroll listeners; Intersection Observers instead of scroll polling; back-to-top uses `requestAnimationFrame`; animations are limited to `transform` and `opacity`; no `transition: all`; `will-change` only on the three background blobs; images use `loading="lazy"`, `decoding="async"` and fixed sizes; fonts use `display=swap`; network calls have timeouts, run in parallel and are cached for 30 minutes; every script is deferred.

## 5. Issues

| ID | Issue | Why it matters | Recommendation | Priority |
|---|---|---|---|---|
| PERF-01 | **Heavy blur compositing.** Three large fixed blobs use a 90 px blur and drift continuously; 27 further surfaces use `backdrop-filter`. | Blur is among the most GPU- and memory-hungry effects; on mid-range phones it causes dropped frames and battery drain across the whole page. | Reduce blur radius and blob size on small screens; pause the drift when the tab is hidden; avoid `backdrop-filter` on elements that sit inside other blurred elements; test on a throttled mid-range device. | High |
| PERF-02 | **LCP is delayed by entrance animation.** Hero text starts at opacity 0 and begins appearing after 80–400 ms, finishing near 1.1 s. | The browser cannot count invisible content as painted, so LCP is pushed back. | Render the headline immediately (animate only supporting elements), or shorten the delay. | Medium |
| PERF-03 | **Render-blocking third-party fonts** (Google Fonts stylesheet, two families). | A cross-origin round trip before first paint; also a privacy and availability dependency. | Self-host two subsetted WOFF2 files, preload the primary weight, keep `display=swap`. | Medium |
| PERF-04 | **No build step:** 16 first-party requests (7 CSS + 9 JS), unminified, no content hashing. | More requests and bytes than needed; no safe long-term caching. | Bundle and minify per type, add hashed file names, serve with immutable caching and Brotli/gzip. | Medium |
| PERF-05 | **25 skill logos from a public CDN**, one request each, plus a hard dependency on a third-party host. At least one icon path is unverified. | Request waterfall when the section scrolls in; a CDN outage or a renamed file leaves letter fallbacks. | Self-host only the logos used (a single SVG sprite or inline SVGs) and verify each one. | Medium |
| PERF-06 | The GitHub repositories response (up to 100 repos) is stored whole in `localStorage`. | A large synchronous write and parse on the main thread; storage quota pressure. | Cache only the fields used (name, description, language, stars, forks, dates, URL) for 6 repos. | Medium |
| PERF-07 | **LeetCode loading strategy.** Five parallel calls to a free, rate-limited community API; on failure each call retries on a second host. With 20 s timeouts the worst case is about 40 s before "Offline", and free hosts may need tens of seconds to wake up. | Slow, unpredictable, privacy-leaking (the visitor's IP reaches third parties) and fragile for a headline feature. | Prefer a **build-time snapshot** (a scheduled job writes a small JSON file served from your own origin) or a tiny cached proxy; keep the live path only as a fallback with a shorter timeout and a visible "last updated" label. | High |
| PERF-08 | **No rendering containment.** All eight long sections are laid out and painted up front. | A page of ≈ 1,650 elements triggers Lighthouse's DOM-size warning and slows first render. | Apply content-visibility with an intrinsic-size hint to below-the-fold sections; consider collapsing the calendar until needed. | Medium |
| PERF-09 | Roughly 14 infinite animations run all the time (blobs, glows, pulses, caret, wheel, avatar ring), including when scrolled out of view. | Constant work with no user benefit. | Start ambient animations only while visible (observer + paused state), and stop them when the tab is hidden. | Medium |
| PERF-10 | Image budget is undefined while real images (avatar, 4 project shots, 9 certificate thumbnails) are about to be added. | One unoptimised JPG can dwarf all the code. | Set a budget (≤ 200 KB per thumbnail), use AVIF/WebP with `srcset`, explicit width/height, and lazy loading. | Medium |
| PERF-11 | No resource hints for the data hosts. | The first API call pays DNS + TLS cost. | Preconnect to the origins only when the analytics section approaches the viewport. | Low |
| PERF-12 | Seven separate observers and three separate pointer-move handlers do the same job. | Small overhead but wasteful duplication. | Share one reveal observer and one glow handler (CR-01). | Low |
| PERF-13 | The nav scroll handler writes to the DOM on every scroll event without frame throttling. | Cheap now, but accumulates with more handlers. | Run through `requestAnimationFrame`, as the back-to-top already does. | Low |
| PERF-14 | The typing animation never pauses when the tab is hidden or off screen. | Pointless timers. | Pause with the same visibility observer as PERF-09. | Low |

## 6. Suggested budgets for sign-off

| Metric | Target (mobile, throttled) |
|---|---|
| LCP | ≤ 2.5 s |
| CLS | ≤ 0.1 |
| INP | ≤ 200 ms |
| Total transfer, first load | ≤ 300 KB excluding images |
| First-party JS (compressed) | ≤ 50 KB |
| Main-thread blocking | No long tasks over 100 ms during scroll |
| Lighthouse (mobile) | ≥ 90 performance, 100 accessibility, ≥ 95 best practices and SEO |

## 7. Verdict

Code-level performance habits are good. The release risks are **visual effects cost on mobile (PERF-01)** and the **live-data strategy (PERF-07)**. Everything else is routine production hardening.
