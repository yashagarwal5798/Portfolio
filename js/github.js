/**
 * github.js — GitHub card, contribution calendar and recent repositories.
 * Sources: api.github.com (official, 60 requests/hour unauthenticated → cached 30 min)
 *          github-contributions-api.jogruber.de (public; GitHub has no official calendar API)
 * Only the fields the UI needs are cached.
 */
(() => {
  "use strict";

  const P = window.Portfolio;
  const { $, el, fetchJSON, safeUrl, currentStreak, timeAgo, isConfigured } = P.utils;
  const { countUp } = P.animations;
  const TTL = 30 * 60 * 1000;

  const LANG_COLORS = {
    JavaScript: "#f1e05a", TypeScript: "#3178c6", Python: "#3572a5", Java: "#b07219", "C++": "#f34b7d", C: "#7a7a7a",
    HTML: "#e34c26", CSS: "#563d7c", "Jupyter Notebook": "#da5b0b", Shell: "#89e051", Go: "#00add8", Kotlin: "#a97bff",
  };
  const langColor = (lang) => LANG_COLORS[lang] || "var(--blue-400)";

  /* Reducers: keep only what we render before the payload is cached */
  const pickProfile = (p) => ({ login: p.login, name: p.name, html_url: p.html_url, avatar_url: p.avatar_url, public_repos: p.public_repos, followers: p.followers, following: p.following });
  const pickRepos = (list) => list.map((r) => ({ name: r.name, html_url: r.html_url, description: r.description, language: r.language, stargazers_count: r.stargazers_count, forks_count: r.forks_count, pushed_at: r.pushed_at, fork: r.fork }));
  const pickDays = (d) => (Array.isArray(d.contributions) ? d.contributions.map((c) => ({ date: c.date, count: c.count, level: c.level })) : []);

  function init() {
    const section = $("[data-analytics]");
    const card = section && $("[data-gh-card]", section);
    if (!card) return;

    const user = section.dataset.githubUser;
    const g = (name) => $(`[data-gh="${name}"]`, section);
    const count = (name) => $(`[data-gh-count="${name}"]`, section);
    const state = (s, msg) => P.ui.setCardState(card, g("status"), g("note"), s, msg);
    const emptyRepos = (text) => g("repos").replaceChildren(el("li", "repos__empty", text));

    /* Profile --------------------------------------------------------------- */
    const renderProfile = (p) => {
      g("name").textContent = p.name || p.login;
      const url = safeUrl(p.html_url, ["github.com"]) || `https://github.com/${encodeURIComponent(p.login)}`;
      const link = g("profile");
      link.href = url;
      link.firstChild.textContent = `@${p.login}`;
      g("button").href = url;
      P.ui.setAvatar(g("avatar"), g("initial"), safeUrl(p.avatar_url), p.login);
      countUp(count("repos"), p.public_repos);
      countUp(count("followers"), p.followers);
      countUp(count("following"), p.following);
    };

    /* Languages & repositories --------------------------------------------- */
    const renderLanguages = (repos) => {
      const tally = {};
      repos.filter((r) => !r.fork && r.language).forEach((r) => { tally[r.language] = (tally[r.language] || 0) + 1; });
      const top = Object.entries(tally).sort((a, b) => b[1] - a[1]).slice(0, 5);
      const total = top.reduce((sum, [, n]) => sum + n, 0);
      const bar = g("lang-bar"), list = g("lang-list");
      bar.replaceChildren(); list.replaceChildren();
      if (!total) { list.append(el("li", "langs__empty", "No language data yet")); return; }
      bar.setAttribute("aria-label", "Top languages: " + top.map(([l, n]) => `${l} ${Math.round((n / total) * 100)}%`).join(", "));
      top.forEach(([lang, n]) => {
        const seg = el("span", "langs__seg");
        seg.style.setProperty("--w", `${(n / total) * 100}%`);
        seg.style.background = langColor(lang);
        bar.append(seg);
        const item = el("li", "langs__item");
        const dot = el("span", "langs__dot"); dot.style.background = langColor(lang);
        item.append(dot, el("span", "", lang), el("span", "langs__pct", `${Math.round((n / total) * 100)}%`));
        list.append(item);
      });
      bar.classList.add("is-filled");
    };

    const renderRepos = (repos) => {
      const recent = repos.filter((r) => !r.fork).slice(0, 6);
      if (!recent.length) { emptyRepos("No public repositories to show yet."); return; }
      const list = g("repos");
      list.replaceChildren();
      recent.forEach((r, i) => {
        const li = el("li", "repo");
        li.style.setProperty("--n", i);
        li.classList.add("is-entering");
        li.addEventListener("animationend", () => li.classList.remove("is-entering"), { once: true });
        const a = el("a", "repo__link");
        a.href = safeUrl(r.html_url, ["github.com"]) || "#";
        a.target = "_blank"; a.rel = "noopener noreferrer";
        a.append(el("span", "repo__name", r.name), el("span", "sr-only", " (opens in a new tab)"));
        li.append(a, el("p", "repo__desc", r.description || "No description provided."));
        const meta = el("div", "repo__meta");
        if (r.language) {
          const lang = el("span", "repo__lang"); const dot = el("span", "langs__dot"); dot.style.background = langColor(r.language);
          lang.append(dot, r.language); meta.append(lang);
        }
        meta.append(el("span", "", `★ ${r.stargazers_count}`), el("span", "", `⑂ ${r.forks_count}`), el("span", "repo__time", `Updated ${timeAgo(r.pushed_at)}`));
        li.append(meta);
        list.append(li);
      });
    };

    /* Contribution calendar ------------------------------------------------- */
    const renderCalendar = (days) => {
      const grid = g("cal-grid"), months = g("cal-months");
      grid.replaceChildren(); months.replaceChildren();
      const at = (iso) => new Date(`${iso}T00:00:00`);
      const first = at(days[0].date);
      for (let i = 0; i < first.getDay(); i += 1) grid.append(el("i", "cell cell--empty")); // align to Sunday-start rows

      const frag = document.createDocumentFragment();
      days.forEach((d) => {
        const cell = el("i", "cell");
        cell.dataset.level = d.level;
        cell.title = `${d.count} contribution${d.count === 1 ? "" : "s"} on ${at(d.date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}`;
        frag.append(cell);
      });
      grid.append(frag);

      const weeks = Math.ceil((first.getDay() + days.length) / 7);
      months.style.setProperty("--weeks", weeks);
      let lastMonth = -1;
      days.forEach((d, i) => {
        const date = at(d.date);
        if (date.getMonth() === lastMonth || date.getDate() > 7) return;
        lastMonth = date.getMonth();
        const col = Math.floor((first.getDay() + i) / 7) + 1;
        if (col <= weeks - 2) { const s = el("span", "", date.toLocaleDateString("en-US", { month: "short" })); s.style.gridColumn = col; months.append(s); }
      });

      const total = days.reduce((sum, d) => sum + d.count, 0);
      grid.setAttribute("aria-label", `${total.toLocaleString("en-US")} contributions in the last year`);
      const scroller = g("cal-scroll"); scroller.scrollLeft = scroller.scrollWidth; // most recent weeks first
      return total;
    };

    /* Orchestration --------------------------------------------------------- */
    async function load() {
      if (!isConfigured(user)) {
        state("error", "Set your GitHub username in the data-github-user attribute.");
        g("cal-total").textContent = "Add your GitHub username to see contributions.";
        emptyRepos("Repositories will appear once a GitHub username is set.");
        return;
      }
      const u = encodeURIComponent(user);
      const [profile, repos, contrib] = await Promise.allSettled([
        fetchJSON(`https://api.github.com/users/${u}`, { ttl: TTL, map: pickProfile }),
        fetchJSON(`https://api.github.com/users/${u}/repos?sort=pushed&per_page=100`, { ttl: TTL, map: pickRepos }),
        fetchJSON(`https://github-contributions-api.jogruber.de/v4/${u}?y=last`, { ttl: TTL, map: pickDays }),
      ]);

      let ok = 0;
      if (profile.status === "fulfilled") { renderProfile(profile.value); ok += 1; }
      if (repos.status === "fulfilled") { renderLanguages(repos.value); renderRepos(repos.value); ok += 1; }
      else emptyRepos("Couldn’t load repositories right now.");

      if (contrib.status === "fulfilled" && contrib.value.length) {
        const days = contrib.value.slice().sort((a, b) => a.date.localeCompare(b.date));
        const total = renderCalendar(days);
        g("cal-total").textContent = `${total.toLocaleString("en-US")} contributions in the last year`;
        countUp(count("contributions"), total);
        countUp(count("streak"), currentStreak(days.map((d) => [d.date, d.count])));
        ok += 1;
      } else g("cal-total").textContent = "Contribution data is unavailable right now.";

      if (ok === 0) state("error", "Couldn’t reach GitHub. Check the username or try again later.");
      else if (ok < 3) state("live", "Some GitHub data couldn’t be loaded.");
      else state("live");
    }

    load().catch(() => state("error", "Something went wrong loading GitHub data."));
  }

  P.github = { init };
})();
