// HTML templates for Agent Academy. Pure functions: (site, ...) => html string.
const esc = (s = "") =>
  String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
const json = (v) => JSON.stringify(v).replace(/</g, "\\u003c");

const SITE_NAME = "Agent Academy";
const LEVELS = { beginner: "Beginner", intermediate: "Intermediate", advanced: "Advanced" };

const NAV = [
  ["curriculum.html", "Curriculum"],
  ["paths.html", "Paths"],
  ["lab.html", "Lab"],
  ["glossary.html", "Glossary"],
  ["papers.html", "Reading List"],
  ["cheatsheet.html", "Cheat Sheet"],
];

const ICON = {
  search: `<svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true"><path fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" d="M11 4a7 7 0 1 0 0 14 7 7 0 0 0 0-14zm9 16-4.3-4.3"/></svg>`,
  sun: `<svg class="i-sun" viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><g fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/></g></svg>`,
  moon: `<svg class="i-moon" viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><path fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round" d="M20 14.5A8.5 8.5 0 1 1 9.5 4a7 7 0 0 0 10.5 10.5z"/></svg>`,
  menu: `<svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true"><path fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" d="M4 6h16M4 12h16M4 18h16"/></svg>`,
  check: `<svg viewBox="0 0 24 24" width="14" height="14" aria-hidden="true"><path fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" d="m5 12 5 5 9-10"/></svg>`,
  logo: `<svg viewBox="0 0 32 32" width="26" height="26" aria-hidden="true"><defs><linearGradient id="lg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#7c5cff"/><stop offset="1" stop-color="#22c3ee"/></linearGradient></defs><rect x="2" y="2" width="28" height="28" rx="8" fill="url(#lg)"/><path d="M10 21.5 16 9l6 12.5M12.3 17h7.4" fill="none" stroke="#fff" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/><circle cx="23.5" cy="9.5" r="2.2" fill="#fff"/></svg>`,
};

function layout({ title, description = "", body, page = "", bodyAttrs = "", scripts = [], fullTitle = false }) {
  const t = fullTitle ? title : `${title} · ${SITE_NAME}`;
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(t)}</title>
<meta name="description" content="${esc(description)}">
<meta property="og:title" content="${esc(t)}">
<meta property="og:description" content="${esc(description)}">
<meta name="theme-color" content="#7c5cff">
<link rel="icon" href="assets/favicon.svg" type="image/svg+xml">
<script>(function(){try{var t=localStorage.getItem('aa-theme');if(!t){t=matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light'}document.documentElement.dataset.theme=t}catch(e){}})();</script>
<link rel="stylesheet" href="assets/styles.css">
</head>
<body data-page="${esc(page)}" ${bodyAttrs}>
<a class="skip-link" href="#main">Skip to content</a>
<div class="read-progress" aria-hidden="true"></div>
<header class="site-header">
  <button class="icon-btn menu-btn" type="button" aria-label="Open navigation" aria-expanded="false">${ICON.menu}</button>
  <a class="brand" href="index.html">${ICON.logo}<span>${SITE_NAME}</span></a>
  <nav class="top-nav" aria-label="Main">
    ${NAV.map(([h, l]) => `<a href="${h}"${page === h.replace(".html", "") ? ' aria-current="page"' : ""}>${l}</a>`).join("")}
  </nav>
  <div class="header-actions">
    <button class="search-btn" type="button" aria-label="Search (Ctrl+K)">${ICON.search}<span>Search</span><kbd>⌘K</kbd></button>
    <a class="progress-pill" href="progress.html" title="Your progress"><span class="pp-ring"></span><span class="pp-text">0%</span></a>
    <button class="icon-btn theme-btn" type="button" aria-label="Toggle dark mode">${ICON.sun}${ICON.moon}</button>
  </div>
</header>
<div class="mobile-nav" hidden>
  ${NAV.map(([h, l]) => `<a href="${h}">${l}</a>`).join("")}
  <a href="progress.html">Progress</a><a href="flashcards.html">Flashcards</a><a href="exam.html">Practice Exam</a>
</div>
${body}
<footer class="site-footer">
  <div class="footer-inner">
    <div class="footer-brand"><a class="brand" href="index.html">${ICON.logo}<span>${SITE_NAME}</span></a>
      <p>A free, open, comprehensive course on AI agents — from first principles to production and the research frontier.</p></div>
    <div class="footer-cols">
      <div><h4>Learn</h4><a href="curriculum.html">Curriculum</a><a href="paths.html">Learning paths</a><a href="lab.html">Interactive lab</a></div>
      <div><h4>Practice</h4><a href="flashcards.html">Flashcards</a><a href="exam.html">Practice exam</a><a href="progress.html">Your progress</a></div>
      <div><h4>Reference</h4><a href="glossary.html">Glossary</a><a href="papers.html">Reading list</a><a href="cheatsheet.html">Cheat sheet</a><a href="about.html">About</a></div>
    </div>
  </div>
  <p class="footer-note">Content current as of November 2026. The field moves fast — principles age slower than product names. Progress is stored only in your browser.</p>
</footer>
<div class="search-modal" hidden role="dialog" aria-modal="true" aria-label="Search">
  <div class="search-panel">
    <div class="search-input-row">${ICON.search}<input type="search" placeholder="Search lessons, glossary, papers…" aria-label="Search" autocomplete="off"><kbd>Esc</kbd></div>
    <div class="search-results" role="listbox"></div>
    <div class="search-hint"><span><kbd>↑</kbd><kbd>↓</kbd> navigate</span><span><kbd>↵</kbd> open</span><span><kbd>Esc</kbd> close</span></div>
  </div>
</div>
<script src="assets/course-data.js"></script>
<script src="assets/app.js"></script>
${scripts.map((s) => `<script src="${s}"></script>`).join("\n")}
</body>
</html>`;
}

// ---------- sidebar ----------
function sidebar(site, current) {
  return `<aside class="sidebar" aria-label="Course navigation">
  <div class="sidebar-inner">
    <a class="sidebar-home" href="curriculum.html">← Full curriculum</a>
    ${site.curriculum.modules
      .map((m, mi) => {
        const open = current && current.module.id === m.id;
        return `<details class="side-module" ${open ? "open" : ""} data-module="${m.id}">
      <summary><span class="side-mod-icon">${m.icon}</span><span class="side-mod-title"><small>Module ${mi + 1}</small>${esc(m.title)}</span><span class="side-mod-count" data-module-count="${m.id}"></span></summary>
      <ol>
        ${m.lessonObjs
          .map(
            (l) =>
              `<li><a href="${l.slug}.html" data-slug="${l.slug}"${current && current.slug === l.slug ? ' aria-current="page"' : ""}><span class="side-check">${ICON.check}</span><span>${esc(l.title)}</span></a></li>`
          )
          .join("\n        ")}
      </ol>
    </details>`;
      })
      .join("\n")}
    <div class="side-extra">
      <a href="cheatsheet.html">📋 Cheat sheet</a>
      <a href="glossary.html">📖 Glossary</a>
      <a href="flashcards.html">🃏 Flashcards</a>
      <a href="exam.html">🎓 Practice exam</a>
    </div>
  </div>
</aside>`;
}

function toc(headings) {
  if (!headings.length) return "";
  return `<aside class="toc" aria-label="On this page"><div class="toc-inner"><h4>On this page</h4><ul>
${headings.map((h) => `<li class="toc-h${h.depth}"><a href="#${h.id}">${esc(h.text)}</a></li>`).join("\n")}
</ul></div></aside>`;
}

// ---------- lesson ----------
export function lessonPage(site, l) {
  const modIndex = site.curriculum.modules.indexOf(l.module) + 1;
  const prereqs = l.prerequisites
    .filter((p) => site.bySlug.has(p))
    .map((p) => `<a href="${p}.html">${esc(site.bySlug.get(p).title)}</a>`)
    .join(", ");
  const scripts = [];
  if (l.widgets.length) scripts.push("assets/widgets.js");
  const body = `<div class="layout-lesson">
${sidebar(site, l)}
<main id="main" class="lesson" data-slug="${l.slug}">
  <nav class="breadcrumb"><a href="curriculum.html">Curriculum</a><span>›</span><a href="curriculum.html#${l.module.id}">Module ${modIndex}: ${esc(l.module.title)}</a></nav>
  <header class="lesson-header">
    <h1>${esc(l.title)}</h1>
    <p class="lead">${esc(l.description)}</p>
    <div class="lesson-meta">
      <span class="badge badge-${esc(l.level)}">${LEVELS[l.level] || esc(l.level)}</span>
      <span>⏱ ${l.duration} min</span>
      ${l.quiz.length ? `<span>✅ ${l.quiz.length}-question quiz</span>` : ""}
      ${l.widgets.length ? `<span>🧪 Interactive</span>` : ""}
      <span>Lesson ${l.order} of ${site.lessons.length}</span>
      <span class="lesson-status" data-status-for="${l.slug}"></span>
    </div>
  </header>
  ${
    l.objectives.length || prereqs
      ? `<section class="objectives">
    ${l.objectives.length ? `<h2 class="objectives-title">What you'll learn</h2><ul>${l.objectives.map((o) => `<li>${esc(o)}</li>`).join("")}</ul>` : ""}
    ${prereqs ? `<p class="prereqs"><strong>Builds on:</strong> ${prereqs}</p>` : ""}
  </section>`
      : ""
  }
  <article class="prose">
${l.html}
  </article>
  <section class="complete-box">
    <div><h3>Finished this lesson?</h3><p>Mark it complete to track your progress. Your progress is saved in this browser.</p></div>
    <button type="button" class="btn btn-primary complete-btn" data-slug="${l.slug}">Mark as complete</button>
  </section>
  <section class="notes-box">
    <label for="notes-${l.slug}"><strong>📝 Your notes</strong> <small>(saved automatically in your browser)</small></label>
    <textarea id="notes-${l.slug}" class="notes" data-slug="${l.slug}" rows="4" placeholder="Jot down insights, questions, ideas to try…"></textarea>
  </section>
  <nav class="pager">
    ${l.prev ? `<a class="pager-prev" href="${l.prev.slug}.html"><small>← Previous</small><span>${esc(l.prev.title)}</span></a>` : "<span></span>"}
    ${l.next ? `<a class="pager-next" href="${l.next.slug}.html"><small>Next →</small><span>${esc(l.next.title)}</span></a>` : `<a class="pager-next" href="exam.html"><small>Finale →</small><span>Take the practice exam</span></a>`}
  </nav>
</main>
${toc(l.headings)}
</div>`;
  return layout({ title: l.title, description: l.description, body, page: "lesson", scripts, bodyAttrs: `data-mermaid="${l.hasMermaid ? 1 : 0}"` });
}

// ---------- home ----------
export function homePage(site) {
  const { lessons, curriculum, glossary, papers } = site;
  const hours = Math.round(lessons.reduce((a, l) => a + l.duration, 0) / 60);
  const quizCount = lessons.reduce((a, l) => a + l.quiz.length, 0);
  const widgetCount = new Set(lessons.flatMap((l) => l.widgets)).size;
  const first = lessons[0];
  const body = `<main id="main" class="home">
<section class="hero">
  <div class="hero-text">
    <p class="eyebrow">Free · Self-paced · Interactive</p>
    <h1>Learn <span class="grad">everything</span> about AI agents.</h1>
    <p class="hero-sub">From the first principles of the agent loop to tools, memory, multi-agent systems, evaluation, security and the research frontier. ${lessons.length} in-depth lessons, hands-on code, interactive labs and quizzes.</p>
    <div class="hero-cta">
      <a class="btn btn-primary btn-lg continue-btn" href="${first ? first.slug + ".html" : "#"}" data-first="${first ? first.slug : ""}">Start learning →</a>
      <a class="btn btn-ghost btn-lg" href="paths.html">Choose a path</a>
    </div>
  </div>
  <div class="hero-visual" aria-hidden="true">
    <svg viewBox="0 0 360 320" class="loop-svg">
      <defs>
        <linearGradient id="hg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#7c5cff"/><stop offset="1" stop-color="#22c3ee"/></linearGradient>
        <marker id="arr" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0 0L10 5L0 10z" fill="currentColor"/></marker>
      </defs>
      <circle cx="180" cy="160" r="112" fill="none" stroke="url(#hg)" stroke-width="2" stroke-dasharray="6 8" class="loop-ring"/>
      <g class="loop-node n1"><rect x="120" y="18" width="120" height="44" rx="14"/><text x="180" y="46">🧠 Think</text></g>
      <g class="loop-node n2"><rect x="240" y="180" width="112" height="44" rx="14"/><text x="296" y="208">🛠️ Act</text></g>
      <g class="loop-node n3"><rect x="8" y="180" width="124" height="44" rx="14"/><text x="70" y="208">👁️ Observe</text></g>
      <g class="loop-core"><circle cx="180" cy="160" r="46"/><text x="180" y="156">Goal</text><text x="180" y="176" class="small">+ context</text></g>
      <circle r="6" class="loop-dot"><animateMotion dur="6s" repeatCount="indefinite" path="M180,48 A112,112 0 1,1 179.9,48"/></circle>
    </svg>
  </div>
</section>

<section class="stats">
  <div><strong>${lessons.length}</strong><span>lessons</span></div>
  <div><strong>${hours}h</strong><span>of material</span></div>
  <div><strong>${quizCount}</strong><span>quiz questions</span></div>
  <div><strong>${widgetCount}</strong><span>interactive labs</span></div>
  <div><strong>${glossary.length}</strong><span>glossary terms</span></div>
  <div><strong>${papers.length}</strong><span>curated readings</span></div>
</section>

<section class="resume-card" hidden>
  <div class="resume-text"><p class="eyebrow">Welcome back</p><h2>Continue where you left off</h2><p class="resume-detail"></p></div>
  <div class="resume-bar"><div class="bar"><span></span></div><a class="btn btn-primary continue-btn2" href="#">Continue →</a></div>
</section>

<section class="section">
  <div class="section-head"><h2>See an agent think</h2><p>Every agent — from a coding assistant to a deep-research system — runs some version of this loop. Step through a real trace:</p></div>
  <div class="widget" data-widget="agent-loop"></div>
</section>

<section class="section">
  <div class="section-head"><h2>Pick a learning path</h2><p>Four curated routes through the material. Or just start at lesson one — the course is designed to be read in order.</p></div>
  <div class="path-grid">
    ${curriculum.paths
      .map(
        (p) => `<a class="path-card" href="paths.html#${p.id}" data-path="${p.id}">
      <span class="path-icon">${p.icon}</span><h3>${esc(p.title)}</h3><p>${esc(p.description)}</p>
      <span class="path-meta">${p.lessons.filter((s) => site.bySlug.has(s)).length} lessons · ~${Math.round(
          p.lessons.reduce((a, s) => a + (site.bySlug.get(s)?.duration || 0), 0) / 60
        )}h</span><div class="bar"><span data-path-bar="${p.id}"></span></div></a>`
      )
      .join("\n")}
  </div>
</section>

<section class="section">
  <div class="section-head"><h2>The curriculum</h2><p>Eight modules that take you from "what is an agent?" to training agentic models with reinforcement learning.</p></div>
  <div class="module-grid">
    ${curriculum.modules
      .map(
        (m, i) => `<div class="module-card">
      <div class="module-top"><span class="module-icon">${m.icon}</span><span class="module-num">Module ${i + 1}</span></div>
      <h3><a href="curriculum.html#${m.id}">${esc(m.title)}</a></h3>
      <p>${esc(m.description)}</p>
      <ol class="module-lessons">${m.lessonObjs.map((l) => `<li><a href="${l.slug}.html" data-slug="${l.slug}"><span class="side-check">${ICON.check}</span>${esc(l.title)}</a></li>`).join("")}</ol>
      <div class="bar"><span data-module-bar="${m.id}"></span></div>
    </div>`
      )
      .join("\n")}
  </div>
</section>

<section class="section">
  <div class="section-head"><h2>Built for learning that sticks</h2></div>
  <div class="feature-grid">
    <a class="feature" href="lab.html"><span>🧪</span><h3>Interactive lab</h3><p>Step through agent traces, watch a context window fill up, simulate prompt injection, compute pass^k and costs.</p></a>
    <a class="feature" href="curriculum.html"><span>✅</span><h3>Quizzes in every lesson</h3><p>${quizCount} questions with explanations that test understanding, not trivia.</p></a>
    <a class="feature" href="flashcards.html"><span>🃏</span><h3>Spaced-repetition flashcards</h3><p>Drill ${glossary.length} key terms with a Leitner-box system that focuses on what you miss.</p></a>
    <a class="feature" href="exam.html"><span>🎓</span><h3>Practice exam</h3><p>Randomized questions across the whole course, with per-module scoring and review links.</p></a>
    <a class="feature" href="papers.html"><span>📚</span><h3>Curated reading list</h3><p>${papers.length} essential papers, essays and guides — filtered, summarized and trackable.</p></a>
    <a class="feature" href="cheatsheet.html"><span>📋</span><h3>Builder's cheat sheet</h3><p>Loop code, patterns, checklists and formulas on one dense page.</p></a>
  </div>
</section>
</main>`;
  return layout({
    title: "Agent Academy — Learn everything about AI agents",
    fullTitle: true,
    description: "A free, comprehensive, interactive course on AI agents: the agent loop, tools, memory, RAG, context engineering, multi-agent systems, MCP, evals, security, and training.",
    body,
    page: "home",
    scripts: ["assets/widgets.js"],
  });
}

// ---------- curriculum ----------
export function curriculumPage(site) {
  const body = `<main id="main" class="page">
<header class="page-header"><p class="eyebrow">Syllabus</p><h1>The full curriculum</h1>
<p class="lead">${site.lessons.length} lessons in ${site.curriculum.modules.length} modules, ordered so each builds on the last. Total reading time ≈ ${Math.round(
    site.lessons.reduce((a, l) => a + l.duration, 0) / 60
  )} hours.</p></header>
${site.curriculum.modules
  .map(
    (m, i) => `<section class="syllabus-module" id="${m.id}">
  <div class="syllabus-head"><span class="module-icon">${m.icon}</span><div><small>Module ${i + 1}</small><h2>${esc(m.title)}</h2><p>${esc(m.description)}</p></div><div class="syllabus-progress"><div class="bar"><span data-module-bar="${m.id}"></span></div><small data-module-count="${m.id}"></small></div></div>
  <ol class="syllabus-lessons">
  ${m.lessonObjs
    .map(
      (l) => `<li class="syllabus-lesson" data-slug="${l.slug}">
    <a href="${l.slug}.html"><span class="side-check">${ICON.check}</span><span class="sl-num">${l.order}</span>
    <div class="sl-body"><h3>${esc(l.title)}</h3><p>${esc(l.description)}</p>
    <div class="sl-meta"><span class="badge badge-${esc(l.level)}">${LEVELS[l.level] || esc(l.level)}</span><span>⏱ ${l.duration} min</span>${l.quiz.length ? `<span>✅ ${l.quiz.length} questions</span>` : ""}${l.widgets.length ? "<span>🧪 Interactive</span>" : ""}</div></div></a>
  </li>`
    )
    .join("\n")}
  </ol>
</section>`
  )
  .join("\n")}
</main>`;
  return layout({ title: "Curriculum", description: "The full Agent Academy syllabus.", body, page: "curriculum" });
}

// ---------- paths ----------
export function pathsPage(site) {
  const body = `<main id="main" class="page">
<header class="page-header"><p class="eyebrow">Learning paths</p><h1>Choose your route</h1>
<p class="lead">Each path is a curated sequence through the course for a particular goal. Lessons you complete count toward every path that includes them.</p></header>
${site.curriculum.paths
  .map((p) => {
    const ls = p.lessons.filter((s) => site.bySlug.has(s)).map((s) => site.bySlug.get(s));
    return `<section class="path-section" id="${p.id}">
  <div class="path-section-head"><span class="path-icon">${p.icon}</span><div><h2>${esc(p.title)}</h2><p>${esc(p.description)}</p>
  <small>${ls.length} lessons · ~${Math.round(ls.reduce((a, l) => a + l.duration, 0) / 60)} hours</small></div>
  <div class="syllabus-progress"><div class="bar"><span data-path-bar="${p.id}"></span></div><small data-path-count="${p.id}"></small></div></div>
  <ol class="path-steps">
    ${ls
      .map(
        (l, i) => `<li data-slug="${l.slug}"><a href="${l.slug}.html"><span class="step-dot">${i + 1}</span><span class="side-check">${ICON.check}</span><div><strong>${esc(l.title)}</strong><small>${esc(l.module.title)} · ${l.duration} min</small></div></a></li>`
      )
      .join("\n")}
  </ol>
</section>`;
  })
  .join("\n")}
</main>`;
  return layout({ title: "Learning Paths", description: "Curated learning paths through Agent Academy.", body, page: "paths" });
}

// ---------- glossary ----------
export function glossaryPage(site) {
  const letters = [...new Set(site.glossary.map((g) => g.term[0].toUpperCase().replace(/[^A-Z]/, "#")))];
  let lastLetter = "";
  const items = site.glossary
    .map((g) => {
      const L = g.term[0].toUpperCase().replace(/[^A-Z]/, "#");
      const anchor = L !== lastLetter ? ` data-letter="${L}"` : "";
      const letterHead = L !== lastLetter ? `<h2 class="gl-letter" id="letter-${L === "#" ? "num" : L}">${L}</h2>` : "";
      lastLetter = L;
      const lesson = g.lesson && site.bySlug.get(g.lesson);
      return `${letterHead}<div class="gl-item" id="${site.slugify(g.term)}"${anchor} data-text="${esc((g.term + " " + (g.aliases || []).join(" ") + " " + g.definition).toLowerCase())}">
  <dt>${esc(g.term)}${g.aliases && g.aliases.length ? ` <small>(${g.aliases.map(esc).join(", ")})</small>` : ""}</dt>
  <dd>${esc(g.definition)}${lesson ? ` <a class="gl-more" href="${lesson.slug}.html">→ ${esc(lesson.title)}</a>` : ""}</dd>
</div>`;
    })
    .join("\n");
  const body = `<main id="main" class="page page-narrow">
<header class="page-header"><p class="eyebrow">Reference</p><h1>Glossary</h1>
<p class="lead">${site.glossary.length} essential terms, defined plainly. Want to memorize them? Try the <a href="flashcards.html">flashcards</a>.</p></header>
<div class="filter-bar"><input type="search" class="gl-filter" placeholder="Filter terms…" aria-label="Filter glossary"><span class="gl-count"></span></div>
<nav class="letter-nav">${letters.map((L) => `<a href="#letter-${L === "#" ? "num" : L}">${L}</a>`).join("")}</nav>
<dl class="glossary">
${items}
</dl>
<p class="gl-empty" hidden>No terms match your filter.</p>
</main>`;
  return layout({ title: "Glossary", description: "Glossary of AI agent terminology.", body, page: "glossary" });
}

// ---------- papers ----------
export function papersPage(site) {
  const cats = [...new Set(site.papers.map((p) => p.category).filter(Boolean))];
  const body = `<main id="main" class="page">
<header class="page-header"><p class="eyebrow">Reference</p><h1>Reading list</h1>
<p class="lead">${site.papers.length} papers, essays and guides that shaped the field. Start with the ⭐ essentials. Tick items off as you read them.</p></header>
<div class="filter-bar papers-filter">
  <input type="search" class="pp-filter" placeholder="Search titles, authors, summaries…" aria-label="Search reading list">
  <label class="toggle"><input type="checkbox" class="pp-essential"> ⭐ Essentials only</label>
  <label class="toggle"><input type="checkbox" class="pp-unread"> Unread only</label>
  <span class="pp-count"></span>
</div>
<div class="chips">${["All", ...cats].map((c, i) => `<button type="button" class="chip${i === 0 ? " active" : ""}" data-cat="${esc(c)}">${esc(c)}</button>`).join("")}</div>
<div class="paper-list">
${site.papers
  .slice()
  .sort((a, b) => (a.category || "").localeCompare(b.category || "") || (a.year || 0) - (b.year || 0))
  .map((p) => {
    const id = site.slugify(p.title).slice(0, 80);
    const lesson = p.lesson && site.bySlug.get(p.lesson);
    return `<article class="paper" data-cat="${esc(p.category || "")}" data-essential="${p.essential ? 1 : 0}" data-id="${id}" data-text="${esc(
      (p.title + " " + (p.authors || "") + " " + (p.summary || "") + " " + (p.year || "")).toLowerCase()
    )}">
  <label class="paper-check" title="Mark as read"><input type="checkbox" data-paper="${id}"><span>${ICON.check}</span></label>
  <div class="paper-body">
    <h3><a href="${esc(p.url)}" target="_blank" rel="noopener">${esc(p.title)}</a>${p.essential ? ' <span class="star" title="Essential">⭐</span>' : ""}</h3>
    <p class="paper-meta">${esc(p.authors || "")}${p.year ? ` · ${p.year}` : ""} · <span class="paper-cat">${esc(p.category || "")}</span></p>
    <p>${esc(p.summary || "")}</p>
    ${lesson ? `<a class="paper-lesson" href="${lesson.slug}.html">Covered in: ${esc(lesson.title)} →</a>` : ""}
  </div>
</article>`;
  })
  .join("\n")}
</div>
<p class="pp-empty" hidden>Nothing matches these filters.</p>
</main>`;
  return layout({ title: "Reading List", description: "Essential papers and guides on AI agents.", body, page: "papers" });
}

// ---------- cheat sheet ----------
export function cheatsheetPage(site) {
  const c = site.cheatsheet;
  const body = `<div class="layout-lesson">
${sidebar(site, null)}
<main id="main" class="lesson">
  <header class="lesson-header"><p class="eyebrow">Reference</p><h1>${esc(c.title || "Cheat Sheet")}</h1><p class="lead">${esc(c.description || "")}</p>
  <div class="lesson-meta"><button type="button" class="btn btn-ghost print-btn">🖨️ Print / save as PDF</button></div></header>
  <article class="prose cheatsheet">${c.html}</article>
</main>
${toc(c.headings)}
</div>`;
  return layout({ title: c.title || "Cheat Sheet", description: c.description || "", body, page: "cheatsheet", bodyAttrs: `data-mermaid="${c.hasMermaid ? 1 : 0}"` });
}

// ---------- lab ----------
const LAB = [
  ["agent-loop", "The agent loop, step by step", "Watch a ReAct-style agent think, call tools and observe results while it works toward a goal. Inspect the exact messages the model sees at each step.", "the-agent-loop"],
  ["autonomy-spectrum", "The autonomy spectrum", "Slide from a plain chatbot to a fully autonomous agent and see what changes: who decides the next step, what can go wrong, and what oversight is needed.", "what-is-an-agent"],
  ["compounding-errors", "Compounding errors", "Why long, unsupervised chains fail: see how per-step reliability compounds over many steps, and how checkpoints and verification change the math.", "when-to-use-agents"],
  ["tool-call-anatomy", "Anatomy of a tool call", "Edit a tool definition and see the request the model receives, the tool_use block it emits, and the tool_result your code returns.", "tool-use"],
  ["pattern-explorer", "Workflow pattern explorer", "Animated diagrams of the six canonical patterns — chaining, routing, parallelization, orchestrator-workers, evaluator-optimizer and the autonomous agent.", "workflow-patterns"],
  ["context-window", "Context window simulator", "Run an agent for many turns and watch its context window fill with tool results. Try compaction, clearing tool results and sub-agents.", "context-engineering"],
  ["pass-at-k", "pass@k vs pass^k", "Explore how the same per-trial success rate looks wildly different depending on whether you need one success or consistent success.", "evaluating-agents"],
  ["cost-calculator", "Agent cost calculator", "Estimate the cost of an agent run: turns, tokens per turn, tool output sizes, model choice and prompt caching.", "cost-and-latency"],
  ["prompt-injection", "Prompt injection simulator", "See how an indirect prompt injection hidden in a web page can hijack an agent — then toggle defenses to see which ones actually help.", "agent-security"],
];
export function labPage(site) {
  const body = `<main id="main" class="page">
<header class="page-header"><p class="eyebrow">Hands-on</p><h1>Interactive lab</h1>
<p class="lead">Interactive simulations of the core mechanics of AI agents. Each one also appears inside the lesson it supports.</p>
<nav class="lab-nav">${LAB.map(([id, t]) => `<a href="#lab-${id}">${esc(t)}</a>`).join("")}</nav></header>
${LAB.map(
  ([id, t, d, slug]) => `<section class="lab-section" id="lab-${id}">
  <div class="section-head"><h2>${esc(t)}</h2><p>${esc(d)} ${site.bySlug.has(slug) ? `<a href="${slug}.html">Read the lesson →</a>` : ""}</p></div>
  <div class="widget" data-widget="${id}"></div>
</section>`
).join("\n")}
</main>`;
  return layout({ title: "Interactive Lab", description: "Interactive simulations of AI agent mechanics.", body, page: "lab", scripts: ["assets/widgets.js"] });
}

// ---------- flashcards ----------
export function flashcardsPage(site) {
  const cards = site.glossary.map((g) => ({ t: g.term, d: g.definition, l: g.lesson || "", m: g.lesson && site.bySlug.get(g.lesson) ? site.bySlug.get(g.lesson).module.id : "" }));
  const body = `<main id="main" class="page page-narrow">
<header class="page-header"><p class="eyebrow">Practice</p><h1>Flashcards</h1>
<p class="lead">Spaced repetition with Leitner boxes: cards you know move to higher boxes and appear less often; cards you miss go back to box 1. Press <kbd>Space</kbd> to flip, <kbd>1</kbd> = again, <kbd>2</kbd> = got it.</p></header>
<div class="fc-controls">
  <label>Deck <select class="fc-deck"><option value="">All modules</option>${site.curriculum.modules.map((m) => `<option value="${m.id}">${esc(m.title)}</option>`).join("")}</select></label>
  <label class="toggle"><input type="checkbox" class="fc-reverse"> Reverse (definition → term)</label>
  <button type="button" class="btn btn-ghost fc-reset">Reset progress</button>
</div>
<div class="fc-boxes"></div>
<div class="fc-stage">
  <button type="button" class="fc-card" aria-live="polite"><div class="fc-face fc-front"></div><div class="fc-face fc-back"></div></button>
</div>
<div class="fc-actions"><button type="button" class="btn btn-ghost fc-again">✗ Again <kbd>1</kbd></button><button type="button" class="btn btn-ghost fc-flip">Flip <kbd>Space</kbd></button><button type="button" class="btn btn-primary fc-good">✓ Got it <kbd>2</kbd></button></div>
<p class="fc-session"></p>
<script>window.FLASHCARDS=${json(cards)};</script>
</main>`;
  return layout({ title: "Flashcards", description: "Spaced-repetition flashcards for AI agent terminology.", body, page: "flashcards" });
}

// ---------- exam ----------
export function examPage(site) {
  const qs = [];
  for (const l of site.lessons) for (const q of l.quiz) qs.push({ ...q, s: l.slug, m: l.module.id });
  const body = `<main id="main" class="page page-narrow">
<header class="page-header"><p class="eyebrow">Practice</p><h1>Practice exam</h1>
<p class="lead">Randomized questions drawn from all ${qs.length} quiz questions in the course. You'll get a score by module and links to review what you missed.</p></header>
<section class="exam-setup card">
  <label>Questions <select class="ex-n"><option>10</option><option selected>25</option><option>50</option><option value="${qs.length}">All (${qs.length})</option></select></label>
  <label>Scope <select class="ex-scope"><option value="">Whole course</option>${site.curriculum.modules.map((m) => `<option value="${m.id}">${esc(m.title)}</option>`).join("")}<option value="done">Lessons I've completed</option></select></label>
  <button type="button" class="btn btn-primary ex-start">Start exam</button>
  <p class="ex-best"></p>
</section>
<section class="exam-run" hidden></section>
<script>window.EXAM=${json(qs)};window.MODULE_TITLES=${json(Object.fromEntries(site.curriculum.modules.map((m) => [m.id, m.title])))};</script>
</main>`;
  return layout({ title: "Practice Exam", description: "Randomized practice exam covering the whole AI agents course.", body, page: "exam" });
}

// ---------- progress ----------
export function progressPage(site) {
  const body = `<main id="main" class="page">
<header class="page-header"><p class="eyebrow">Dashboard</p><h1>Your progress</h1>
<p class="lead">Everything here is stored locally in your browser. Export it to move between devices.</p></header>
<section class="dash-top">
  <div class="dash-ring card"><svg viewBox="0 0 120 120"><circle cx="60" cy="60" r="52" class="ring-bg"/><circle cx="60" cy="60" r="52" class="ring-fg"/></svg><div class="ring-label"><strong class="dash-pct">0%</strong><small>complete</small></div></div>
  <div class="dash-stats card"></div>
</section>
<section class="section"><h2>By module</h2><div class="dash-modules"></div></section>
<section class="section"><h2>Quiz scores</h2><div class="dash-quizzes"></div></section>
<section class="section"><h2>Your notes</h2><div class="dash-notes"></div></section>
<section class="section"><h2>Backup</h2>
<div class="dash-actions"><button type="button" class="btn btn-ghost dash-export">⬇️ Export progress</button><label class="btn btn-ghost">⬆️ Import progress<input type="file" accept="application/json" class="dash-import" hidden></label><button type="button" class="btn btn-danger dash-reset">Reset everything</button></div>
</section>
</main>`;
  return layout({ title: "Your Progress", description: "Your Agent Academy progress dashboard.", body, page: "progress" });
}

// ---------- about ----------
export function aboutPage(site) {
  const body = `<main id="main" class="page page-narrow prose-page">
<header class="page-header"><p class="eyebrow">About</p><h1>About Agent Academy</h1></header>
<article class="prose">
<p>Agent Academy is a free, comprehensive course on AI agents: systems in which a language model directs its own process — deciding which actions to take, using tools, observing results, and iterating toward a goal.</p>
<h2 id="how-to-use">How to use this site</h2>
<ul>
<li><strong>Read in order</strong> if you're new. The <a href="curriculum.html">curriculum</a> is sequenced so each lesson builds on the previous ones. Or pick a <a href="paths.html">learning path</a> tailored to your goal.</li>
<li><strong>Do the exercises.</strong> Every lesson ends with exercises, from thought experiments to coding challenges. Building is the fastest way to learn agents.</li>
<li><strong>Take the quizzes.</strong> They're designed to check understanding and application. Explanations appear after you answer.</li>
<li><strong>Play in the <a href="lab.html">lab</a>.</strong> Simulations make abstract mechanics — context windows, compounding errors, prompt injection — tangible.</li>
<li><strong>Review with <a href="flashcards.html">flashcards</a></strong> and test yourself with the <a href="exam.html">practice exam</a>.</li>
<li><strong>Keyboard shortcuts:</strong> <kbd>⌘K</kbd>/<kbd>Ctrl K</kbd> or <kbd>/</kbd> to search, <kbd>←</kbd>/<kbd>→</kbd> (with <kbd>Alt</kbd>) for previous/next lesson, <kbd>T</kbd> to toggle theme.</li>
</ul>
<h2 id="code">About the code examples</h2>
<p>Examples are in Python unless noted. LLM calls use the Anthropic Python SDK (<code>pip install anthropic</code>) with current (2026) conventions; the concepts transfer directly to any provider. Framework examples follow each project's documented API at the time of writing — APIs evolve, so check the official docs when something doesn't match.</p>
<h2 id="accuracy">A note on a fast-moving field</h2>
<p>Content is current as of November 2026. Model names, product features and benchmark numbers change monthly; the underlying principles — the loop, tool design, context management, evaluation discipline, least privilege — change slowly. Lessons try to teach the durable ideas and flag the perishable details.</p>
<h2 id="privacy">Privacy</h2>
<p>There is no tracking and no account. Progress, quiz scores, notes and flashcard state are stored in your browser's <code>localStorage</code>. Use the <a href="progress.html">progress page</a> to export or reset them.</p>
<h2 id="built">How it's built</h2>
<p>A small Node build script turns Markdown lessons into a static site with zero runtime dependencies (Mermaid is vendored for diagrams). Everything works offline once loaded, and the site can be hosted anywhere static files can.</p>
</article>
</main>`;
  return layout({ title: "About", description: "About Agent Academy.", body, page: "about" });
}
