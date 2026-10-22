/**
 * leetcode.js — LeetCode card.
 * LeetCode has no official public REST API, so this reads the community-run
 * alfa-leetcode-api (two public hosts, tried in order). Field names are read
 * defensively because third-party response shapes can change.
 *
 * Optional, recommended for production: set data-leetcode-snapshot="data/leetcode.json" on the
 * analytics section. A scheduled job can write that file (same shapes as the API responses:
 * { profile, solved, contest, badges, calendar }) so visitors never wait on a free third-party host.
 */
(() => {
  "use strict";

  const P = window.Portfolio;
  const { $, fetchJSON, safeUrl, currentStreak, isConfigured } = P.utils;
  const { countUp } = P.animations;
  const HOSTS = ["https://alfa-leetcode-api.vercel.app", "https://alfa-leetcode-api.onrender.com"];
  const TTL = 30 * 60 * 1000;
  const num = (...values) => { const v = values.find((x) => x !== undefined && x !== null && !Number.isNaN(Number(x))); return v === undefined ? null : Number(v); };

  function init() {
    const section = $("[data-analytics]");
    const card = section && $("[data-lc-card]", section);
    if (!card) return;

    const user = section.dataset.leetcodeUser;
    const l = (name) => $(`[data-lc="${name}"]`, section);
    const count = (name) => $(`[data-lc-count="${name}"]`, section);
    const state = (s, msg) => P.ui.setCardState(card, l("status"), l("note"), s, msg);

    /* Try each host until one answers (free hosts sleep or rate-limit) */
    async function api(path) {
      let lastError;
      for (const host of HOSTS) {
        try { return await fetchJSON(`${host}/${path}`, { ttl: TTL, timeout: 12000 }); }
        catch (e) { lastError = e; }
      }
      throw lastError;
    }

    /* Renderers ------------------------------------------------------------- */
    const renderProfile = (p) => {
      const name = p.name || p.realName || user;
      l("name").textContent = name;
      const link = l("profile");
      link.href = `https://leetcode.com/u/${encodeURIComponent(user)}/`;
      link.firstChild.textContent = `@${p.username || user}`;
      l("button").href = link.href;
      P.ui.setAvatar(l("avatar"), l("initial"), safeUrl(p.avatar || p.userAvatar), name);
    };

    const renderSolved = (s) => {
      const easy = num(s.easySolved), medium = num(s.mediumSolved), hard = num(s.hardSolved);
      const sum = (easy ?? 0) + (medium ?? 0) + (hard ?? 0);
      countUp(count("solved"), num(s.solvedProblem, s.totalSolved, sum));
      countUp(count("easy"), easy); countUp(count("medium"), medium); countUp(count("hard"), hard);

      if (sum) {
        [["easy", easy], ["medium", medium], ["hard", hard]].forEach(([k, v]) => l(`bar-${k}`).style.setProperty("--w", `${((v ?? 0) / sum) * 100}%`));
        const bar = $(".solved__bar", card);
        bar.classList.add("is-filled");
        bar.setAttribute("aria-label", `Easy ${easy}, Medium ${medium}, Hard ${hard}`);
      }

      // Acceptance rate = accepted submissions ÷ all submissions
      let rate = num(s.acceptanceRate);
      const pick = (arr) => (Array.isArray(arr) ? arr.find((x) => x.difficulty === "All") : null);
      const accepted = pick(s.acSubmissionNum), total = pick(s.totalSubmissionNum);
      if (rate === null && accepted && total && total.submissions) rate = (accepted.submissions / total.submissions) * 100;
      if (rate !== null) countUp(count("acceptance"), rate, { decimals: 1, suffix: "%" });
    };

    const renderContest = (c) => {
      const rating = num(c.contestRating, c.userContestRanking?.rating, c.rating);
      if (rating !== null) countUp(count("rating"), Math.round(rating)); // stays "—" if no contests entered
    };

    const renderBadge = (b) => {
      const active = b.activeBadge || (Array.isArray(b.badges) ? b.badges[0] : null);
      if (!active) { l("badge").textContent = "None yet"; return; }
      l("badge").textContent = active.displayName || active.name || "Badge";
      const raw = active.icon || active.medal?.config?.iconGif;
      const src = raw && safeUrl(raw.startsWith("/") ? `https://leetcode.com${raw}` : raw);
      if (src) {
        const icon = l("badge-icon");
        icon.addEventListener("load", () => { icon.hidden = false; }, { once: true });
        icon.src = src;
      }
    };

    const renderCalendar = (c) => {
      let calendar = c.submissionCalendar;
      if (typeof calendar === "string") { try { calendar = JSON.parse(calendar); } catch { calendar = null; } }
      let streak = null;
      if (calendar && typeof calendar === "object") {
        const byDay = new Map();
        Object.entries(calendar).forEach(([ts, n]) => byDay.set(new Date(Number(ts) * 1000).toISOString().slice(0, 10), Number(n)));
        const end = new Date(); end.setUTCHours(0, 0, 0, 0);
        const days = [];
        for (let i = 400; i >= 0; i -= 1) { // ~13 months, ascending, today last (LeetCode days are UTC)
          const d = new Date(end.getTime() - i * 86400000).toISOString().slice(0, 10);
          days.push([d, byDay.get(d) || 0]);
        }
        streak = currentStreak(days);
      }
      countUp(count("streak"), num(streak, c.streak));
    };

    const JOBS = [
      ["profile", "", renderProfile], ["solved", "/solved", renderSolved], ["contest", "/contest", renderContest],
      ["badges", "/badges", renderBadge], ["calendar", "/calendar", renderCalendar],
    ];

    /* Orchestration --------------------------------------------------------- */
    async function load() {
      if (!isConfigured(user)) { state("error", "Set your LeetCode username in the data-leetcode-user attribute."); return; }
      const u = encodeURIComponent(user);

      let results;
      const snapshotUrl = section.dataset.leetcodeSnapshot;
      if (snapshotUrl) {
        try {
          const snap = await fetchJSON(snapshotUrl, { timeout: 8000 });
          results = JOBS.map(([key]) => ({ status: snap[key] ? "fulfilled" : "rejected", value: snap[key] }));
        } catch { /* fall through to live data */ }
      }
      if (!results) results = await Promise.allSettled(JOBS.map(([, suffix]) => api(`${u}${suffix}`)));

      let ok = 0;
      results.forEach((r, i) => {
        if (r.status !== "fulfilled" || !r.value || r.value.errors || r.value.error) return;
        try { JOBS[i][2](r.value); ok += 1; } catch { /* leave that tile as "—" */ }
      });
      if (ok === 0) state("error", "Couldn’t reach the LeetCode stats service. It may be waking up — try again shortly.");
      else if (ok < JOBS.length) state("live", "Some LeetCode stats couldn’t be loaded.");
      else state("live");
    }

    load().catch(() => state("error", "Something went wrong loading LeetCode data."));
  }

  P.leetcode = { init };
})();
