/**
 * utils.js — dependency-free helpers shared by every module.
 * Loaded first. Publishes window.Portfolio.utils (single global namespace).
 */
(() => {
  "use strict";

  const P = (window.Portfolio = window.Portfolio || {});
  const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");

  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
  const prefersReducedMotion = () => motionQuery.matches;

  /** Create an element with an optional class and text (text is never parsed as HTML). */
  const el = (tag, className, text) => {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (text != null) node.textContent = text;
    return node;
  };

  /** localStorage that never throws (private mode, blocked storage, quota). */
  const storage = {
    get(key) { try { return localStorage.getItem(key); } catch { return null; } },
    set(key, value) { try { localStorage.setItem(key, value); } catch { /* ignore */ } },
  };

  /**
   * Fetch JSON with a timeout and an optional versioned localStorage cache.
   * `map` reduces the payload BEFORE caching, so only the fields we use are stored.
   */
  const CACHE_PREFIX = "pf:v1:";
  async function fetchJSON(url, { ttl = 0, timeout = 15000, map = null } = {}) {
    const key = CACHE_PREFIX + url;
    if (ttl) {
      try {
        const hit = JSON.parse(storage.get(key));
        if (hit && Date.now() - hit.t < ttl) return hit.d;
      } catch { /* corrupt entry: refetch */ }
    }
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeout);
    try {
      const res = await fetch(url, { signal: controller.signal, headers: { Accept: "application/json" } });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      let data = await res.json();
      if (map) data = map(data);
      if (ttl) storage.set(key, JSON.stringify({ t: Date.now(), d: data }));
      return data;
    } finally { clearTimeout(timer); }
  }

  /** Accept only https URLs (and optionally only expected hosts) before putting them in href/src. */
  function safeUrl(value, hosts) {
    try {
      const u = new URL(value);
      if (u.protocol !== "https:") return null;
      if (hosts && !hosts.some((h) => u.hostname === h || u.hostname.endsWith("." + h))) return null;
      return u.href;
    } catch { return null; }
  }

  /** Consecutive active days ending today (or yesterday if today is still empty). Input: [[date, count], …] ascending. */
  function currentStreak(days) {
    let i = days.length - 1, streak = 0;
    if (i >= 0 && days[i][1] === 0) i -= 1;
    for (; i >= 0 && days[i][1] > 0; i -= 1) streak += 1;
    return streak;
  }

  function timeAgo(iso) {
    const seconds = (Date.now() - new Date(iso).getTime()) / 1000;
    const units = [["year", 31536000], ["month", 2592000], ["week", 604800], ["day", 86400], ["hour", 3600], ["minute", 60]];
    for (const [name, secs] of units) {
      const n = Math.floor(seconds / secs);
      if (n >= 1) return `${n} ${name}${n > 1 ? "s" : ""} ago`;
    }
    return "just now";
  }

  /** A value still holding a YOUR_… (or legacy your-…) placeholder counts as "not configured". */
  const isConfigured = (value) => Boolean(value) && !/^your[-_]/i.test(value.trim());

  /** Match when every typed word appears in the haystack (case-insensitive). */
  const matchesQuery = (query, haystack) => !query || query.split(" ").every((w) => haystack.includes(w));

  P.utils = { $, $$, el, storage, fetchJSON, safeUrl, currentStreak, timeAgo, isConfigured, matchesQuery, prefersReducedMotion };
})();
