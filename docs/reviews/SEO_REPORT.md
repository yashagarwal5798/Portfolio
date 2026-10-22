# SEO Report

**Method:** static review of `index.html` and all section fragments (as they will appear after merge). No crawler, Search Console or Lighthouse run. A portfolio's SEO goals are narrow: be found by **name**, preview well when **shared**, and look trustworthy to recruiters.

## 1. Summary

| Priority | Count |
|---|---|
| High | 3 |
| Medium | 6 |
| Low | 5 |

## 2. Present vs missing in `<head>`

| Element | Status |
|---|---|
| `lang` attribute | Present (`en`) |
| Viewport (with `viewport-fit=cover`) | Present |
| Title | Present — but contains no name (see SEO-01) |
| Meta description | Present — short and generic (≈ 78 characters; SEO-02) |
| Theme colour | Present |
| Canonical URL | **Missing** |
| Open Graph + Twitter card tags | **Missing** |
| Share image (1200 × 630) | **Missing** |
| Favicon / touch icon / web manifest | **Missing** |
| Structured data (Person) | **Missing** |
| `robots.txt`, `sitemap.xml`, 404 page | **Missing** |

## 3. Strengths

Semantic landmarks and one `h1`; heading hierarchy is clean; link text is descriptive (hidden text adds the item name to "View" and "Download"); `<time>` elements carry machine-readable dates; important content (About, Projects, Skills, Certificates, Contact) is **in the HTML**, not injected by JavaScript; all external links use `rel="noopener noreferrer"`; no duplicate IDs; section anchors are stable.

## 4. Issues

| ID | Issue | Why it matters | Recommendation | Priority |
|---|---|---|---|---|
| SEO-01 | The page title is "Building Software. Solving Problems. \| AI & Data Science Student" — it has **no name**. | People search for a portfolio owner by name; the title is the strongest on-page ranking and click signal. | Pattern: "Full Name — Role (AI & Data Science Student) \| Portfolio", under about 60 characters. | High |
| SEO-02 | There are no Open Graph or Twitter/X card tags and no share image. | Links shared on LinkedIn, WhatsApp, Slack or X show a bare URL, the most common way recruiters first see a portfolio. | Add title, description, URL, type, site name and a 1200 × 630 image (keep it under ≈ 300 KB) for both OG and Twitter large-image cards. | High |
| SEO-03 | Outbound and internal links are still placeholders: `your-username` ×19, Live Demo → `example.com` ×4, mailto → `hello@example.com` ×8, plus missing `assets/` files. | Broken or fake links look careless to users and crawlers, and 404s on the resume and certificates damage trust. | Replace all, then run a link checker in the release pipeline (see QA-03). | High |
| SEO-04 | The meta description is short and generic. | Search snippets and some share previews use it; a weak one wastes the best free copy. | Write 120–155 characters that include your name, role, main skills and what the visitor can do (view projects, resume). | Medium |
| SEO-05 | The `h1` is a tagline; your name and role never appear in a heading. The About `h2` is the name, but later on the page. | Search engines weight the `h1`; name and role are the primary entity. | Keep the tagline visually, but include the name and role in the `h1` (or add a visually hidden prefix) and keep the About heading explicit. | Medium |
| SEO-06 | No `Person` structured data. | Gives search engines a clean statement of name, role, links and profiles, and can enrich results. | Add one JSON-LD block (name, job title, URL, image, `sameAs` for GitHub, LinkedIn, LeetCode, email). | Medium |
| SEO-07 | No canonical URL. | The same page may be reachable with and without `www`, with tracking parameters or via preview hosts, splitting signals. | Add a canonical tag with the final HTTPS address and redirect the alternates. | Medium |
| SEO-08 | No favicon, touch icon or manifest. | Browsers request them anyway (404 noise), and tabs, bookmarks and home screens look unfinished. | Provide an SVG favicon plus 180 px touch icon; optional manifest. | Medium |
| SEO-09 | Image strategy is undefined for incoming real assets (avatar, project screenshots, certificate thumbnails). | Alt text and file names are indexed; poor ones lose image search and accessibility value. | Descriptive kebab-case file names, meaningful `alt` for content images, empty `alt` for decoration, explicit width and height. | Medium |
| SEO-10 | No `robots.txt` or `sitemap.xml`, and no custom 404 page. | Minor for one page, but expected by tools and good hygiene. | Add a permissive `robots.txt` pointing to the sitemap; a one-URL sitemap; a branded 404. | Low |
| SEO-11 | Everything lives on one URL; projects have no pages of their own. | Deep project content cannot rank or be shared individually. | Optional, v2: give each featured project its own page with a clear title and description. | Low |
| SEO-12 | Live GitHub and LeetCode figures exist only after JavaScript runs. | Crawlers and link previews see "—". | Pair with the build-time snapshot suggested in PERF-07, which can also provide server-rendered numbers. | Low |
| SEO-13 | Social profile links do not declare identity (`rel="me"`) and the resume file name is generic. | Weaker identity verification and a poor file name when downloaded or indexed. | Add `rel="me"` on profile links; name the PDF "Firstname-Lastname-Resume.pdf" and give it a document title. | Low |
| SEO-14 | Performance and accessibility affect rankings and are not yet measured. | Slow or inaccessible pages are demoted and abandoned. | Hit the budgets in PERFORMANCE_REPORT §6 and the checks in ACCESSIBILITY_REPORT §4. | Low |

## 5. Pre-launch SEO checklist

| Item | Done when |
|---|---|
| Title, description, canonical | Name present; ≤ 60 / 120–155 characters; final URL |
| OG + Twitter cards | Previewed in LinkedIn Post Inspector, X card validator and a messaging app |
| Icons | Favicon + touch icon visible in tab and bookmarks |
| JSON-LD | Passes Google's Rich Results / Schema validator |
| Links | Link checker reports 0 errors, 0 placeholder domains |
| `robots.txt` + sitemap | Reachable and correct |
| HTTPS + redirects | One canonical host; HTTP and `www` redirect |
| Lighthouse SEO | 100 |
| Search Console | Property verified; sitemap submitted |

## 6. Verdict

The page is **technically well-structured for search** (semantic HTML, real content in the markup). Discoverability and sharing are the gap: **SEO-01, SEO-02 and SEO-03 must be fixed before launch.**
