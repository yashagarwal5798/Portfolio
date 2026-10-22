/**
 * ui.js — interface behaviour: navigation, filters, certificate gallery & dialog,
 * copy-to-clipboard, back-to-top, plus small helpers the data modules reuse.
 * Motion is delegated to animations.js; this file never animates on its own.
 */
(() => {
  "use strict";

  const P = window.Portfolio;
  const { $, $$, prefersReducedMotion, matchesQuery } = P.utils;
  const A = P.animations;

  /* ===== Helpers shared with github.js / leetcode.js ========================= */

  /** Card status: loading | live | error. The note is a persistent live region (text only changes). */
  function setCardState(card, statusEl, noteEl, state, message = "") {
    card.dataset.state = state;
    statusEl.dataset.state = state;
    statusEl.textContent = { loading: "Loading", live: "Live", error: "Offline" }[state];
    noteEl.textContent = message;
  }

  /** Avatar image with an initial-letter fallback. */
  function setAvatar(imgEl, initialEl, url, name) {
    initialEl.textContent = (name || "?").trim().charAt(0).toUpperCase();
    if (!url) return;
    imgEl.addEventListener("load", () => { imgEl.hidden = false; initialEl.hidden = true; }, { once: true });
    imgEl.addEventListener("error", () => { imgEl.hidden = true; initialEl.hidden = false; }, { once: true });
    imgEl.src = url;
  }

  /* ===== Navigation ========================================================== */

  function initNav() {
    const nav = $("[data-nav]"), toggle = $("[data-nav-toggle]"), menu = $("[data-nav-menu]");
    if (!nav || !toggle || !menu) return;

    // Glass background once the page scrolls (frame-throttled)
    let ticking = false;
    const update = () => { nav.classList.toggle("is-scrolled", window.scrollY > 8); ticking = false; };
    window.addEventListener("scroll", () => { if (!ticking) { ticking = true; requestAnimationFrame(update); } }, { passive: true });
    update();

    // Mobile menu
    const isOpen = () => toggle.getAttribute("aria-expanded") === "true";
    const setOpen = (open) => {
      toggle.setAttribute("aria-expanded", String(open));
      toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
      menu.classList.toggle("is-open", open);
    };
    toggle.addEventListener("click", () => setOpen(!isOpen()));
    menu.addEventListener("click", (e) => { if (e.target.closest("a")) setOpen(false); });
    document.addEventListener("keydown", (e) => { if (e.key === "Escape" && isOpen()) { setOpen(false); toggle.focus(); } });
    document.addEventListener("click", (e) => { if (isOpen() && !e.target.closest("[data-nav]")) setOpen(false); });
    window.matchMedia("(min-width: 1001px)").addEventListener("change", () => setOpen(false));

    // Highlight the link of the section in the middle of the viewport
    const links = $$(".nav__link", menu);
    const targets = links.map((l) => document.getElementById(l.hash.slice(1))).filter(Boolean);
    if (!("IntersectionObserver" in window)) return;
    const io = new IntersectionObserver((entries) => entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      links.forEach((link) => {
        const active = link.hash === `#${entry.target.id}`;
        link.classList.toggle("is-active", active);
        if (active) link.setAttribute("aria-current", "location"); else link.removeAttribute("aria-current");
      });
    }), { rootMargin: "-45% 0px -50% 0px" });
    targets.forEach((t) => io.observe(t));
  }

  function initScrollCue() {
    const cue = $("[data-scroll-cue]");
    if (!cue) return;
    cue.addEventListener("click", () => {
      const next = $("#home")?.nextElementSibling;
      const top = next ? next.getBoundingClientRect().top + window.scrollY : window.innerHeight;
      window.scrollTo({ top, behavior: prefersReducedMotion() ? "auto" : "smooth" });
    });
    window.addEventListener("scroll", () => {
      const away = window.scrollY > 80;
      cue.style.opacity = away ? "0" : "";
      cue.style.pointerEvents = away ? "none" : "";
    }, { passive: true });
  }

  /** Floating button; the ring shows page scroll progress. */
  function initBackToTop() {
    const button = $("[data-to-top]");
    if (!button) return;
    const ring = $("[data-to-top-ring]", button);
    const circumference = 2 * Math.PI * 22;
    let ticking = false;
    const update = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const progress = max > 0 ? Math.min(window.scrollY / max, 1) : 0;
      button.classList.toggle("is-visible", window.scrollY > 600);
      if (ring) ring.style.strokeDashoffset = String(circumference * (1 - progress));
      ticking = false;
    };
    window.addEventListener("scroll", () => { if (!ticking) { ticking = true; requestAnimationFrame(update); } }, { passive: true });
    window.addEventListener("resize", update);
    update();
    button.addEventListener("click", () => {
      window.scrollTo({ top: 0, behavior: prefersReducedMotion() ? "auto" : "smooth" });
      const main = $("#main");
      if (main) main.focus({ preventScroll: true }); // keep keyboard users oriented
    });
  }

  /* ===== Filters (Projects, Skills) ========================================== */

  /** Wire category chips + search input; `onChange(state)` renders the result. */
  function wireFilter(root, { chips, input, onChange }) {
    const state = { category: "all", query: "" };
    chips.forEach((chip) => chip.addEventListener("click", () => {
      state.category = chip.dataset.filter;
      chips.forEach((c) => { const on = c === chip; c.classList.toggle("is-active", on); c.setAttribute("aria-pressed", String(on)); });
      onChange(state);
    }));
    input?.addEventListener("input", () => { state.query = input.value.trim().toLowerCase(); onChange(state); });
    onChange(state);
  }

  /** Reveal an item that was just filtered in (never leave it waiting for the scroll reveal). */
  function enterItem(node, index) {
    node.removeAttribute("data-reveal");
    node.classList.add("is-visible");
    if (prefersReducedMotion()) return;
    node.style.setProperty("--n", index);
    node.classList.add("is-entering");
    node.addEventListener("animationend", () => node.classList.remove("is-entering"), { once: true });
  }

  function initProjects() {
    const root = $("[data-projects]");
    if (!root) return;
    const items = $$("[data-project-grid] > .project-item", root);
    const status = $("[data-project-status]", root), empty = $("[data-project-empty]", root);
    const index = new Map(items.map((i) => [i, `${i.textContent} ${i.dataset.category}`.toLowerCase().replace(/\s+/g, " ")]));

    wireFilter(root, {
      chips: $$("[data-filter]", root), input: $("[data-project-search]", root),
      onChange({ category, query }) {
        let visible = 0;
        items.forEach((item) => {
          const show = (category === "all" || item.dataset.category.split(" ").includes(category)) && matchesQuery(query, index.get(item));
          const wasHidden = item.hidden;
          item.hidden = !show;
          if (show) { visible += 1; if (wasHidden) enterItem(item, visible - 1); }
        });
        empty.hidden = visible > 0;
        status.textContent = visible ? `Showing ${visible} of ${items.length} projects` : "No projects found";
      },
    });
  }

  function initSkills() {
    const root = $("[data-skills]");
    if (!root) return;
    const cards = $$("[data-skill-grid] > .cat-item", root);
    const status = $("[data-skill-status]", root), empty = $("[data-skill-empty]", root);
    const statNodes = $$("[data-stat]", root);

    wireFilter(root, {
      chips: $$("[data-filter]", root), input: $("[data-skill-search]", root),
      onChange({ category, query }) {
        const totals = { all: 0, advanced: 0, intermediate: 0, beginner: 0 };
        cards.forEach((card) => {
          const inCategory = category === "all" || card.dataset.category === category;
          const categoryName = $(".cat__title", card).textContent.toLowerCase();
          let shown = 0;
          $$(".skill", card).forEach((skill) => {
            const match = inCategory && matchesQuery(query, `${skill.dataset.name} ${skill.dataset.level} ${categoryName}`);
            skill.hidden = !match;
            if (match) { shown += 1; totals.all += 1; totals[skill.dataset.level] += 1; }
          });
          const wasHidden = card.hidden;
          card.hidden = shown === 0;
          $("[data-cat-count]", card).textContent = shown;
          if (shown && wasHidden) enterItem(card, 0);
          else if (shown) { card.removeAttribute("data-reveal"); card.classList.add("is-visible"); }
        });
        empty.hidden = totals.all > 0;
        status.textContent = totals.all ? `Showing ${totals.all} technolog${totals.all === 1 ? "y" : "ies"}` : "No technologies found";
        statNodes.forEach((n) => A.tween(n, totals[n.dataset.stat] ?? 0, { duration: 650 }));
      },
    });

    // A logo that fails to load falls back to the technology's initial
    root.addEventListener("error", (e) => {
      const img = e.target;
      if (!(img instanceof HTMLImageElement)) return;
      const fallback = document.createElement("span");
      fallback.className = "icon__fallback";
      fallback.textContent = img.dataset.fallback || "•";
      img.replaceWith(fallback);
    }, true);
  }

  /* ===== Certificates: expand/collapse + preview dialog ======================= */

  function initCertificates() {
    const root = $("[data-achievements]");
    if (!root) return;

    // View all / show fewer
    const button = $("[data-cert-toggle]", root), label = $("[data-cert-toggle-label]", root);
    const extras = $$("[data-extra]", root), count = $("[data-cert-count]", root);
    if (button && extras.length) {
      const total = Number(button.dataset.total);
      const render = (expanded) => {
        button.setAttribute("aria-expanded", String(expanded));
        label.textContent = expanded ? "Show fewer" : `View All Certificates (${total})`;
        count.textContent = `Showing ${expanded ? total : total - extras.length} of ${total} certificates`;
      };
      render(false);
      button.addEventListener("click", () => {
        const expand = button.getAttribute("aria-expanded") !== "true";
        extras.forEach((item, i) => { item.hidden = !expand; if (expand) enterItem(item, i); });
        render(expand);
        if (!expand) $(".certs__head", root).scrollIntoView({ behavior: prefersReducedMotion() ? "auto" : "smooth", block: "start" });
      });
    } else button?.closest(".certs__more")?.remove();

    // Preview dialog (progressive enhancement: without it, "View" opens the file)
    const dialog = $("[data-cert-dialog]", root);
    if (!dialog || typeof dialog.showModal !== "function") return;
    let opener = null;
    $$("[data-cert-view]", root).forEach((link) => link.addEventListener("click", (e) => {
      e.preventDefault();
      opener = link;
      const card = link.closest("[data-cert]"), file = link.getAttribute("href");
      $("[data-cert-d-title]", dialog).textContent = $(".cert__title", card).textContent;
      $("[data-cert-d-meta]", dialog).textContent = `${$(".cert__org", card).textContent} · ${$(".cert__date", card).textContent}`;
      $("[data-cert-d-skills]", dialog).innerHTML = $(".cert__skills", card).innerHTML; // our own markup, not external input
      $("[data-cert-d-open]", dialog).href = file;
      $("[data-cert-d-download]", dialog).href = file;
      $("[data-cert-preview]", dialog).replaceChildren($(".cert__media", card).cloneNode(true));
      document.documentElement.style.overflow = "hidden";
      dialog.showModal();
    }));
    $("[data-cert-close]", dialog).addEventListener("click", () => dialog.close());
    dialog.addEventListener("click", (e) => { if (e.target === dialog) dialog.close(); });
    dialog.addEventListener("close", () => { document.documentElement.style.overflow = ""; opener?.focus(); });
  }

  /* ===== Contact: copy email, footer year ===================================== */

  async function copyText(text) {
    try { await navigator.clipboard.writeText(text); return true; }
    catch {
      const ta = document.createElement("textarea");
      ta.value = text; ta.setAttribute("readonly", ""); ta.style.cssText = "position:fixed;opacity:0";
      document.body.append(ta); ta.select();
      let ok = false;
      try { ok = document.execCommand("copy"); } catch { /* unsupported */ }
      ta.remove();
      return ok;
    }
  }

  function initCopy() {
    $$("[data-copy]").forEach((btn) => {
      const label = $("[data-copy-label]", btn);
      let timer;
      btn.addEventListener("click", async () => {
        const ok = await copyText(btn.dataset.copy);
        label.textContent = ok ? "Copied!" : "Press Ctrl+C";
        btn.classList.toggle("is-copied", ok);
        btn.setAttribute("aria-label", ok ? "Email address copied" : "Copy email address");
        clearTimeout(timer);
        timer = setTimeout(() => {
          label.textContent = "Copy"; btn.classList.remove("is-copied"); btn.setAttribute("aria-label", "Copy email address");
        }, 2000);
      });
    });
  }

  const initYear = () => $$("[data-year]").forEach((n) => { n.textContent = new Date().getFullYear(); });

  function init() {
    [initNav, initScrollCue, initBackToTop, initProjects, initSkills, initCertificates, initCopy, initYear]
      .forEach((fn) => { try { fn(); } catch (err) { console.error(`[ui] ${fn.name} failed`, err); } });
  }

  P.ui = { init, setCardState, setAvatar };
})();
