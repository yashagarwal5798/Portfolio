/**
 * main.js — application entry point.
 * Boots each module in dependency order; one failing module never stops the others.
 *
 * Load order (index.html): utils → theme → animations → ui → github → leetcode → main
 * Everything shares the window.Portfolio namespace (no build step, works from file://).
 */
(() => {
  "use strict";

  const P = window.Portfolio;
  if (!P || !P.utils) { console.error("[portfolio] utils.js did not load; scripts are out of order."); return; }

  const MODULES = ["theme", "animations", "ui", "github", "leetcode"];

  function boot() {
    MODULES.forEach((name) => {
      const mod = P[name];
      if (!mod || typeof mod.init !== "function") { console.warn(`[portfolio] module "${name}" is missing — check the <script> order.`); return; }
      try { mod.init(); } catch (err) { console.error(`[portfolio] module "${name}" failed to start`, err); }
    });
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();
})();
