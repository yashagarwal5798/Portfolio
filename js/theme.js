/**
 * theme.js — dark (default) / light theme toggle.
 * The saved choice is applied before first paint by a tiny inline script in <head>;
 * this module keeps the toggle button, <meta name="theme-color"> and storage in sync.
 */
(() => {
  "use strict";

  const P = window.Portfolio;
  const { $, storage } = P.utils;
  const KEY = "pf-theme";
  const COLORS = { dark: "#05070d", light: "#f6f8fc" };

  function apply(theme) {
    document.documentElement.dataset.theme = theme;
    const meta = $('meta[name="theme-color"]');
    if (meta) meta.setAttribute("content", COLORS[theme]);
    const button = $("[data-theme-toggle]");
    if (button) button.setAttribute("aria-pressed", String(theme === "light"));
  }

  function init() {
    const saved = storage.get(KEY);
    apply(saved === "light" ? "light" : "dark");

    const button = $("[data-theme-toggle]");
    if (!button) return;
    button.addEventListener("click", () => {
      const next = document.documentElement.dataset.theme === "light" ? "dark" : "light";
      apply(next);
      storage.set(KEY, next);
    });
  }

  P.theme = { init, apply };
})();
