#!/usr/bin/env node
/**
 * docs/tools/check.mjs — pre-release checker (no dependencies).
 *   node docs/tools/check.mjs            list everything still to do
 *   node docs/tools/check.mjs --strict   exit 1 if anything is found (use in CI)
 *
 * Reports: YOUR_… placeholders, placeholder files still in assets/, missing local files,
 * duplicate ids, broken in-page anchors, images without alt, new-tab links without rel,
 * and basic SEO tags. Run it from the project root.
 */
import { readFileSync, existsSync } from "node:fs";
import { join, resolve } from "node:path";

const root = resolve(process.argv.find((a) => !a.startsWith("-") && a !== process.argv[0] && a !== process.argv[1]) || process.cwd());
const raw = readFileSync(join(root, "index.html"), "utf8");
const html = raw.replace(/<!--[\s\S]*?-->/g, ""); // comments contain example snippets
const problems = [];
const add = (type, message) => problems.push({ type, message });

// 1. Placeholders (every YOUR_… token, with counts)
const tokens = {};
for (const m of html.matchAll(/YOUR_[A-Z0-9_]+/g)) tokens[m[0]] = (tokens[m[0]] || 0) + 1;
for (const [t, n] of Object.entries(tokens).sort()) add("placeholder", `${t} ×${n}`);

// 2. Local files referenced by href/src
const files = new Set();
for (const m of html.matchAll(/(?:href|src)="([^"#?]+)"/g)) {
  const url = m[1];
  if (/^(https?:|mailto:|tel:|data:|javascript:)/.test(url) || /^YOUR_/.test(url)) continue;
  files.add(url);
}
for (const f of files) {
  if (!existsSync(join(root, f))) add("missing-file", f);
  else if (/YOUR_/.test(f)) add("placeholder-file", `${f} is a placeholder file: replace it with your real file and update the link`);
}

// 3. Structure
const ids = [...html.matchAll(/\sid="([^"]+)"/g)].map((m) => m[1]);
for (const id of new Set(ids.filter((v, i) => ids.indexOf(v) !== i))) add("duplicate-id", id);
for (const m of html.matchAll(/href="#([^"]+)"/g)) if (!ids.includes(m[1])) add("broken-anchor", `#${m[1]}`);

// 4. Accessibility basics
for (const m of html.matchAll(/<img\b[^>]*>/g)) if (!/\balt=/.test(m[0])) add("img-alt", m[0].slice(0, 70));
for (const m of html.matchAll(/<a\b[^>]*target="_blank"[^>]*>/g)) if (!/noopener/.test(m[0])) add("noopener", m[0].slice(0, 70));

// 5. SEO basics
if (!/<link rel="canonical"/.test(html)) add("seo", "canonical link missing");
if (!/property="og:image"/.test(html)) add("seo", "og:image missing");
if ((html.match(/<h1\b/g) || []).length !== 1) add("seo", "page must have exactly one <h1>");

const groups = problems.reduce((acc, p) => ((acc[p.type] ||= []).push(p.message), acc), {});
for (const [type, list] of Object.entries(groups)) {
  console.log(`\n${type.toUpperCase()} (${list.length})`);
  list.slice(0, 60).forEach((m) => console.log("  - " + m));
}
const blocking = problems.filter((p) => p.type !== "placeholder" && p.type !== "placeholder-file");
console.log(`\n${problems.length} item(s) to review (${blocking.length} structural problem${blocking.length === 1 ? "" : "s"}).`);
if (process.argv.includes("--strict") && problems.length) process.exit(1);
