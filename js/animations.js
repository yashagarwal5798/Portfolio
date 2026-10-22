/**
 * animations.js — every motion behaviour in one place:
 * scroll reveal, count-up, pointer glow, typing effect, ambient pause.
 * All of it respects prefers-reduced-motion.
 */
(() => {
  "use strict";

  const P = window.Portfolio;
  const { $, $$, prefersReducedMotion } = P.utils;
  const canObserve = "IntersectionObserver" in window;

  /* Scroll reveal ------------------------------------------------------------
     Elements are hidden only once .reveal-ready is set (so no-JS and failed
     scripts still show everything). After the transition the [data-reveal]
     attribute is removed so the element's own hover transitions take over. */
  function revealNow(node) {
    if (!node.hasAttribute("data-reveal")) return;
    node.classList.add("is-visible");
    const finish = () => node.removeAttribute("data-reveal");
    node.addEventListener("transitionend", (e) => { if (e.target === node && e.propertyName === "opacity") finish(); });
    setTimeout(finish, 1800); // safety net
  }

  function initReveal() {
    const items = $$("[data-reveal]");
    if (!items.length || prefersReducedMotion() || !canObserve) return;
    document.documentElement.classList.add("reveal-ready");
    const io = new IntersectionObserver((entries) => entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      io.unobserve(entry.target);
      revealNow(entry.target);
    }), { threshold: 0.12, rootMargin: "0px 0px -6% 0px" });
    items.forEach((item) => io.observe(item));
  }

  /* Number tween & count-up --------------------------------------------------- */
  const frames = new WeakMap();

  /** Animate a number inside `node` to `target`, starting from `from` (default: current text). */
  function tween(node, target, { from, decimals = 0, suffix = "", duration = 1100 } = {}) {
    if (target == null || Number.isNaN(Number(target))) { node.textContent = "—"; return; }
    const format = (n) => n.toLocaleString("en-US", { minimumFractionDigits: decimals, maximumFractionDigits: decimals }) + suffix;
    const start = from ?? (parseFloat(node.textContent.replace(/[^\d.-]/g, "")) || 0);
    cancelAnimationFrame(frames.get(node));
    if (prefersReducedMotion() || start === target) { node.textContent = format(target); return; }
    const t0 = performance.now();
    const step = (now) => {
      const t = Math.min((now - t0) / duration, 1);
      node.textContent = format(start + (target - start) * (1 - Math.pow(1 - t, 3)));
      if (t < 1) frames.set(node, requestAnimationFrame(step));
    };
    frames.set(node, requestAnimationFrame(step));
  }

  /** Count up from 0 once the element is on screen. */
  function countUp(node, target, options = {}) {
    if (target == null || Number.isNaN(Number(target))) { node.textContent = "—"; return; }
    if (prefersReducedMotion() || !canObserve) { tween(node, target, { ...options, from: target }); return; }
    const io = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      io.disconnect();
      tween(node, target, { ...options, from: 0 });
    }, { threshold: 0.4 });
    io.observe(node);
  }

  /** Static numbers declared in markup: <span data-count="350" data-suffix="+">. */
  function initCounters() {
    $$("[data-count]").forEach((node) => {
      countUp(node, Number(node.dataset.count), { suffix: node.dataset.suffix || "", decimals: Number(node.dataset.decimals || 0) });
    });
  }

  /* Pointer glow: feeds --mx / --my to the card's ::before gradient -------------- */
  function initGlow() {
    if (prefersReducedMotion() || !window.matchMedia("(hover: hover)").matches) return;
    $$("[data-glow]").forEach((card) => card.addEventListener("pointermove", (e) => {
      const rect = card.getBoundingClientRect();
      card.style.setProperty("--mx", `${e.clientX - rect.left}px`);
      card.style.setProperty("--my", `${e.clientY - rect.top}px`);
    }, { passive: true }));
  }

  /* Typing effect for the hero roles (pauses on hover/focus and in hidden tabs) ---- */
  function initTyping() {
    const node = $("[data-typing]");
    if (!node || prefersReducedMotion()) return; // static first role is already in the markup
    let roles;
    try { roles = JSON.parse(node.dataset.roles); } catch { return; }
    if (!Array.isArray(roles) || !roles.length) return;

    let paused = false, role = 0, count = roles[0].length, deleting = true;
    const host = node.closest(".hero__roles") || node;
    ["pointerenter", "focusin"].forEach((n) => host.addEventListener(n, () => { paused = true; }));
    ["pointerleave", "focusout"].forEach((n) => host.addEventListener(n, () => { paused = false; }));

    const TYPE = 75, DELETE = 38, HOLD = 1700, GAP = 350;
    const tick = () => {
      if (paused || document.hidden) { setTimeout(tick, 400); return; }
      const word = roles[role];
      count += deleting ? -1 : 1;
      node.textContent = word.slice(0, count);
      let delay = deleting ? DELETE : TYPE;
      if (!deleting && count === word.length) { deleting = true; delay = HOLD; }
      else if (deleting && count === 0) { deleting = false; role = (role + 1) % roles.length; delay = GAP; }
      setTimeout(tick, delay);
    };
    setTimeout(tick, HOLD);
  }

  /* Ambient motion is paused when off-screen or when the tab is hidden --------- */
  function initAmbient() {
    document.addEventListener("visibilitychange", () => {
      document.documentElement.classList.toggle("is-tab-hidden", document.hidden);
    });
    if (!canObserve) return;
    const io = new IntersectionObserver((entries) => entries.forEach((e) => e.target.classList.toggle("is-paused", !e.isIntersecting)));
    $$("[data-ambient]").forEach((n) => io.observe(n));
  }

  function init() {
    initReveal();
    initCounters();
    initGlow();
    initTyping();
    initAmbient();
  }

  P.animations = { init, revealNow, tween, countUp };
})();
