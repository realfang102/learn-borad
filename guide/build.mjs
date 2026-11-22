// "Agents Made Simple" — beginner guide builder.
// guide/pages/chapters/*.md + guide/pages/examples/*.md + guide/sims/*.js + guide/prompts.yml
//   → docs/guide/ (static, offline-capable, relative links only)
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { Marked, Renderer } from "marked";
import hljs from "highlight.js";
import yaml from "js-yaml";

const G = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(G, "..");
const OUT = path.join(ROOT, "docs", "guide");
const site = JSON.parse(fs.readFileSync(path.join(G, "site.json"), "utf8"));
const warnings = [];
const warn = (m) => warnings.push(m);

const esc = (s = "") => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
const slugify = (s) => String(s).toLowerCase().replace(/<[^>]+>/g, "").replace(/&[a-z]+;/g, "").replace(/[^\p{L}\p{N}\s-]/gu, "").trim().replace(/\s+/g, "-");
const strip = (h) => h.replace(/<pre[\s\S]*?<\/pre>/g, " ").replace(/<[^>]+>/g, " ").replace(/&#39;|&apos;/g, "'").replace(/&quot;/g, '"').replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&[a-z#0-9]+;/g, " ").replace(/\s+/g, " ").trim();

function frontMatter(raw, file) {
  const m = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/);
  if (!m) { warn(`${file}: no front matter`); return { data: {}, body: raw }; }
  try { return { data: yaml.load(m[1]) || {}, body: m[2] }; } catch (e) { warn(`${file}: ${e.message}`); return { data: {}, body: m[2] }; }
}

const CALLOUTS = {
  TIP: ["💡", "Tip"], NOTE: ["📝", "Note"], WARNING: ["⚠️", "Watch out"], KEY: ["🔑", "Big idea"],
  TRY: ["🧪", "Try it"], ANALOGY: ["🧩", "Think of it like this"], EXAMPLE: ["👀", "Example"],
};

function render(md, slug) {
  const ctx = { headings: [], ids: new Set(), quiz: 0, links: [], sims: [], widgets: [] };
  const marked = new Marked({ gfm: true });
  const inline = (s) => marked.parseInline(s || "");
  marked.use({
    renderer: {
      heading({ tokens, depth }) {
        const text = this.parser.parseInline(tokens);
        let id = slugify(strip(text)) || "s"; const base = id; let n = 2;
        while (ctx.ids.has(id)) id = `${base}-${n++}`;
        ctx.ids.add(id);
        if (depth === 2) ctx.headings.push({ text: strip(text), id });
        return `<h${depth} id="${id}">${text}</h${depth}>\n`;
      },
      code({ text, lang }) {
        const l = (lang || "").trim().toLowerCase();
        if (l === "quiz") return quizHtml(text, inline, ctx, slug);
        if (l === "prompt") {
          return `<div class="prompt-card"><div class="prompt-head"><span>Prompt</span><button type="button" class="copy-btn">Copy</button></div><pre class="prompt-text">${esc(text)}</pre></div>\n`;
        }
        const html = l && hljs.getLanguage(l) ? hljs.highlight(text, { language: l, ignoreIllegals: true }).value : esc(text);
        return `<div class="code-card"><div class="code-head"><span>${esc(l || "text")}</span><button type="button" class="copy-btn">Copy</button></div><pre><code class="hljs">${html}</code></pre></div>\n`;
      },
      blockquote({ tokens }) {
        const body = this.parser.parse(tokens);
        const m = body.match(/^<p>\[!([A-Z]+)\][ \t]*([^\n<]*)(?:\n|<\/p>)/);
        if (m && CALLOUTS[m[1]]) {
          let rest = body.slice(m[0].length);
          if (m[0].endsWith("\n")) rest = "<p>" + rest;
          rest = rest.replace(/^<p>\s*<\/p>/, "");
          const [icon, label] = CALLOUTS[m[1]];
          return `<div class="callout c-${m[1].toLowerCase()}" role="note"><div class="callout-title"><span aria-hidden="true">${icon}</span>${m[2].trim() || label}</div>${rest}</div>\n`;
        }
        return `<blockquote>${body}</blockquote>\n`;
      },
      table(token) { return `<div class="table-wrap">${Renderer.prototype.table.call(this, token)}</div>\n`; },
      link({ href, title, tokens }) {
        const text = this.parser.parseInline(tokens);
        const ext = /^https?:\/\//.test(href);
        if (!ext && /\.html(#.*)?$/.test(href)) ctx.links.push(href.replace(/#.*$/, ""));
        return `<a href="${esc(href)}"${title ? ` title="${esc(title)}"` : ""}${ext ? ' target="_blank" rel="noopener"' : ""}>${text}</a>`;
      },
    },
  });
  let html = marked.parse(md);
  ctx.sims = [...html.matchAll(/data-sim="([a-z0-9-]+)"/g)].map((m) => m[1]);
  ctx.widgets = [...html.matchAll(/data-widget="([a-z0-9-]+)"/g)].map((m) => m[1]);
  return { html, ...ctx };
}

function quizHtml(text, inline, ctx, slug) {
  const qs = []; let cur = null;
  for (const raw of text.split(/\r?\n/)) {
    const l = raw.trimEnd();
    if (/^Q:/.test(l)) { cur = { q: l.slice(2).trim(), o: [], c: -1, e: "" }; qs.push(cur); }
    else if (cur && /^-\s*\[( |x|X)\]/.test(l)) { if (/\[(x|X)\]/.test(l)) cur.c = cur.o.length; cur.o.push(l.replace(/^-\s*\[( |x|X)\]\s*/, "")); }
    else if (cur && /^E:/.test(l)) cur.e = l.slice(2).trim();
    else if (cur && l.trim() && cur.e) cur.e += " " + l.trim();
  }
  const ok = qs.filter((q) => q.c >= 0 && q.o.length >= 2);
  if (ok.length !== qs.length) warn(`${slug}: malformed quiz question`);
  for (const q of ok) { // deterministic shuffle so answer position carries no signal
    let seed = 0; for (const ch of q.q) seed = (Math.imul(seed, 31) + ch.charCodeAt(0)) | 0;
    const rnd = () => ((seed = (Math.imul(seed ^ (seed >>> 15), 2246822507) + 0x6d2b79f5) | 0), (seed >>> 0) / 4294967296);
    const idx = q.o.map((_, i) => i);
    for (let i = idx.length - 1; i > 0; i--) { const j = Math.floor(rnd() * (i + 1)); [idx[i], idx[j]] = [idx[j], idx[i]]; }
    q.o = idx.map((i) => q.o[i]); q.c = idx.indexOf(q.c);
  }
  ctx.quiz += ok.length;
  return `<div class="quiz" data-quiz="${esc(slug)}">${ok.map((q, i) => `
<div class="quiz-q" data-correct="${q.c}"><p class="quiz-question"><span class="qn">${i + 1}</span>${inline(q.q)}</p>
<div class="quiz-opts">${q.o.map((o, j) => `<button type="button" class="quiz-opt" data-i="${j}">${inline(o)}</button>`).join("")}</div>
<div class="quiz-expl" hidden><strong class="verdict"></strong> ${inline(q.e)}</div></div>`).join("")}
<div class="quiz-score" aria-live="polite"></div></div>\n`;
}

// ---------- load ----------
const chapters = [], examples = [], bySlug = new Map();
let n = 0;
for (const part of site.parts) {
  part.items = [];
  for (const slug of part.chapters) {
    const f = path.join(G, "pages", "chapters", `${slug}.md`);
    if (!fs.existsSync(f)) { warn(`missing chapter ${slug}.md`); continue; }
    const { data, body } = frontMatter(fs.readFileSync(f, "utf8"), `${slug}.md`);
    const r = render(body, slug);
    const c = { kind: "chapter", slug, part, num: ++n, title: data.title || slug, emoji: data.emoji || "📘", subtitle: data.subtitle || "", minutes: data.minutes || Math.max(5, Math.round(strip(r.html).split(" ").length / 180)), ...r };
    chapters.push(c); part.items.push(c); bySlug.set(slug, c);
  }
}
chapters.forEach((c, i) => { c.prev = chapters[i - 1] || null; c.next = chapters[i + 1] || null; });
for (const slug of site.examples) {
  const f = path.join(G, "pages", "examples", `${slug}.md`);
  if (!fs.existsSync(f)) { warn(`missing example ${slug}.md`); continue; }
  const { data, body } = frontMatter(fs.readFileSync(f, "utf8"), `${slug}.md`);
  const r = render(body, `example-${slug}`);
  const e = { kind: "example", slug, title: data.title || slug, emoji: data.emoji || "🤖", subtitle: data.subtitle || "", category: data.category || "Work", level: data.level || "Intermediate", concepts: data.concepts || [], sim: data.sim || slug, ...r };
  if (!fs.existsSync(path.join(G, "sims", `${e.sim}.js`))) warn(`example ${slug}: missing sims/${e.sim}.js`);
  examples.push(e);
}
examples.forEach((e, i) => { e.prev = examples[i - 1] || null; e.next = examples[i + 1] || null; });
const prompts = fs.existsSync(path.join(G, "prompts.yml")) ? yaml.load(fs.readFileSync(path.join(G, "prompts.yml"), "utf8")) || [] : [];

// ---------- validate ----------
const pages = new Set(["index.html", "examples.html", "prompts.html", "chapters.html", "playground.html", "../index.html",
  ...site.parts.flatMap((p) => p.chapters.map((s) => `${s}.html`)), ...site.examples.map((s) => `example-${s}.html`)]);
for (const p of [...chapters, ...examples]) {
  for (const l of p.links) if (!pages.has(l)) warn(`${p.slug}: broken link ${l}`);
  for (const c of p.concepts || []) if (!bySlug.has(c) && !site.parts.some((x) => x.chapters.includes(c))) warn(`${p.slug}: unknown concept ${c}`);
}

// ---------- templates ----------
// line icons (24x24, stroke = currentColor)
const IC = {
  Software: '<path d="M8 8l-4 4 4 4M16 8l4 4-4 4M13.5 5l-3 14"/>',
  Research: '<circle cx="11" cy="11" r="6.5"/><path d="M16 16l4.5 4.5"/>',
  "Customer service": '<path d="M4 13v-1a8 8 0 0 1 16 0v1"/><rect x="3" y="13" width="4" height="6" rx="1.5"/><rect x="17" y="13" width="4" height="6" rx="1.5"/><path d="M19 19c0 1.5-2 2.5-5 2.5"/>',
  Browsing: '<circle cx="12" cy="12" r="8.5"/><path d="M3.5 12h17M12 3.5c2.5 2.6 3.5 5.4 3.5 8.5s-1 5.9-3.5 8.5c-2.5-2.6-3.5-5.4-3.5-8.5S9.5 6.1 12 3.5z"/>',
  Data: '<path d="M4 20h16M7 16v-5M12 16V6M17 16v-8"/>',
  Learning: '<path d="M3 8.5L12 4l9 4.5-9 4.5z"/><path d="M7 10.5v4.5c0 1.5 2.2 3 5 3s5-1.5 5-3v-4.5M21 8.5v5"/>',
  Productivity: '<rect x="3.5" y="5" width="17" height="14" rx="2.5"/><path d="M3.5 13h4.5l1.5 2.5h5l1.5-2.5h4.5"/>',
  Writing: '<path d="M14.5 5.5l4 4L9 19H5v-4z"/><path d="M12.5 7.5l4 4"/>',
  Operations: '<path d="M3 12h4l2.5-6 5 12 2.5-6h4"/>',
  Voice: '<rect x="9" y="3.5" width="6" height="11" rx="3"/><path d="M5.5 11.5a6.5 6.5 0 0 0 13 0M12 18v3"/>',
  sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2.5v2M12 19.5v2M4.6 4.6l1.4 1.4M18 18l1.4 1.4M2.5 12h2M19.5 12h2M4.6 19.4L6 18M18 6l1.4-1.4"/>',
  moon: '<path d="M20 14.5A8 8 0 1 1 9.5 4a6.5 6.5 0 0 0 10.5 10.5z"/>',
  play: '<path d="M8 5.5v13l10-6.5z"/>',
  arrow: '<path d="M5 12h14M13 6l6 6-6 6"/>',
  check: '<path d="M5 12.5l4.5 4.5L19 7.5"/>',
  clock: '<circle cx="12" cy="12" r="8.5"/><path d="M12 7.5V12l3 2"/>',
  spark: '<path d="M12 3v4M12 17v4M3 12h4M17 12h4M6 6l2.5 2.5M15.5 15.5L18 18M6 18l2.5-2.5M15.5 8.5L18 6"/>'
};
const icon = (k, cls = "icon") => `<svg class="${cls}" viewBox="0 0 24 24" aria-hidden="true">${IC[k] || IC.spark}</svg>`;
const roman = (n) => ["I", "II", "III", "IV", "V", "VI"][n] || String(n + 1);
const pad = (n) => String(n).padStart(2, "0");

const LOGO = `<svg viewBox="0 0 32 32" aria-hidden="true"><rect width="32" height="32" rx="9" fill="var(--btn)"/><circle cx="16" cy="16" r="7.5" fill="none" stroke="var(--btn-ink)" stroke-width="1.6" stroke-dasharray="36 11.1" transform="rotate(-60 16 16)"/><circle cx="21.9" cy="11.3" r="2.2" fill="var(--btn-ink)"/></svg>`;
function layout({ title, desc = "", body, page = "", scripts = [] }) {
  return `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(title)}</title><meta name="description" content="${esc(desc)}"><meta name="theme-color" content="#fbfbfa">
<link rel="icon" href="assets/favicon.svg" type="image/svg+xml">
<script>(function(){try{var t=localStorage.getItem('ams-theme');if(!t)t=matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light';document.documentElement.dataset.theme=t;var m=localStorage.getItem('ams-mode');if(m)document.documentElement.dataset.mode=m;}catch(e){}})();</script>
<link rel="stylesheet" href="assets/guide.css"></head>
<body data-page="${esc(page)}">
<a class="skip" href="#main">Skip to content</a>
<div class="scroll-bar" aria-hidden="true"></div>
<header class="top">
  <a class="logo" href="index.html">${LOGO}<span>${esc(site.name)}</span></a>
  <nav class="nav" aria-label="Main"><a href="chapters.html"${page === "chapters" ? ' aria-current="page"' : ""}>Learn</a><a href="examples.html"${page === "examples" || page === "example" ? ' aria-current="page"' : ""}>Examples</a><a href="playground.html"${page === "playground" ? ' aria-current="page"' : ""}>Playground</a><a href="prompts.html"${page === "prompts" ? ' aria-current="page"' : ""}>Prompt library</a></nav>
  <div class="top-actions">
    <div class="seg" role="group" aria-label="Explanation depth"><button type="button" class="mode-opt" data-mode="simple" aria-pressed="true">Simple</button><button type="button" class="mode-opt" data-mode="detail" aria-pressed="false">Detailed</button></div>
    <button type="button" class="theme-btn" aria-label="Toggle dark mode">${icon("sun", "icon i-sun")}${icon("moon", "icon i-moon")}</button>
  </div>
</header>
${body}
<footer class="foot"><div class="foot-in">
  <p><strong>${esc(site.name)}</strong> — ${esc(site.tagline)}</p>
  <p><a href="chapters.html">All chapters</a> · <a href="examples.html">Agents in action</a> · <a href="playground.html">Playground</a> · <a href="prompts.html">Prompt library</a> · <a href="../index.html">Go deeper: Agent Academy →</a></p>
  <p class="fine">Content current as of November 2026. Simulations are illustrative recreations of how real agents behave — no real accounts, emails or systems are touched. Your progress is saved only in this browser.</p>
</div></footer>
<script src="assets/guide.js"></script>
${scripts.map((s) => `<script src="${s}"></script>`).join("\n")}
</body></html>`;
}

const chapterCard = (c) => `<a class="ch-card" href="${c.slug}.html" data-slug="${c.slug}"><span class="ch-n">${pad(c.num)}</span><h3>${esc(c.title)}</h3><p>${esc(c.subtitle)}</p><span class="ch-meta">${c.minutes} min${c.widgets.length ? ` · ${c.widgets.length} interactive` : ""}</span><span class="done-badge">${icon("check")} Done</span></a>`;
const exampleCard = (e) => `<a class="ex-card" href="example-${e.slug}.html" data-slug="example-${e.slug}"><span class="ex-icon">${icon(e.category)}</span><span class="ex-cat">${esc(e.category)} · ${esc(e.level)}</span><h3>${esc(e.title)}</h3><p>${esc(e.subtitle)}</p><span class="ex-play">Watch it work ${icon("arrow")}</span></a>`;

function chapterPage(c) {
  const body = `<main id="main" class="page chapter" data-slug="${c.slug}">
<div class="ch-hero reveal"><a class="crumb" href="chapters.html">${esc(c.part.title)}</a><p class="eyebrow">Chapter ${pad(c.num)} <span aria-hidden="true">/</span> ${pad(chapters.length)}</p><h1>${esc(c.title)}</h1><p class="lead">${esc(c.subtitle)}</p><p class="meta">${c.minutes} min read${c.widgets.length ? ` · ${c.widgets.length} interactive demo${c.widgets.length > 1 ? "s" : ""}` : ""}${c.sims.length ? " · animated walkthrough" : ""}</p>
${c.headings.length > 2 ? `<nav class="mini-toc" aria-label="In this chapter">${c.headings.map((h) => `<a href="#${h.id}">${esc(h.text)}</a>`).join("")}</nav>` : ""}</div>
<article class="prose">${c.html}</article>
<section class="finish reveal"><div><h2>Nicely done.</h2><p>Mark this chapter complete to track your progress.</p></div><button type="button" class="btn btn-primary done-btn" data-slug="${c.slug}">Mark as done</button></section>
<nav class="pager">${c.prev ? `<a href="${c.prev.slug}.html"><small>← Previous</small>${esc(c.prev.title)}</a>` : `<a href="index.html"><small>← Home</small>Start page</a>`}${c.next ? `<a class="next" href="${c.next.slug}.html"><small>Next →</small>${esc(c.next.title)}</a>` : `<a class="next" href="examples.html"><small>Next →</small>Agents in action</a>`}</nav>
</main>`;
  return layout({ title: `${c.title} · ${site.name}`, desc: c.subtitle, body, page: "chapter", scripts: c.sims.map((s) => `sims/${s}.js`) });
}

function examplePage(e) {
  const concepts = e.concepts.filter((s) => bySlug.has(s)).map((s) => bySlug.get(s));
  const body = `<main id="main" class="page example" data-slug="example-${e.slug}">
<div class="ex-hero reveal"><a class="crumb" href="examples.html">Agents in action</a><div class="ch-hero-icon">${icon(e.category)}</div><p class="eyebrow">${esc(e.category)} · ${esc(e.level)}</p><h1>${esc(e.title)}</h1><p class="lead">${esc(e.subtitle)}</p>
${concepts.length ? `<p class="concepts">Uses ideas from: ${concepts.map((c) => `<a class="chip" href="${c.slug}.html">${esc(c.title)}</a>`).join(" ")}</p>` : ""}</div>
<article class="prose wide">${e.html}</article>
<nav class="pager">${e.prev ? `<a href="example-${e.prev.slug}.html"><small>← Previous example</small>${esc(e.prev.title)}</a>` : `<a href="examples.html"><small>←</small>All examples</a>`}${e.next ? `<a class="next" href="example-${e.next.slug}.html"><small>Next example →</small>${esc(e.next.title)}</a>` : `<a class="next" href="examples.html"><small>→</small>All examples</a>`}</nav>
</main>`;
  return layout({ title: `${e.title} · ${site.name}`, desc: e.subtitle, body, page: "example", scripts: [...new Set([...e.sims, e.sim])].map((s) => `sims/${s}.js`) });
}

function homePage() {
  const first = chapters[0];
  const body = `<main id="main" class="home">
<section class="hero">
  <div class="hero-copy reveal">
    <p class="eyebrow">A visual guide for beginners</p>
    <h1>AI agents,<br><span class="hl">finally explained.</span></h1>
    <p class="lead">Agents don't just answer. They <em>act</em>: search, write, click and check their own work. See how they think, then put them to work.</p>
    <div class="cta"><a class="btn btn-primary btn-lg start-btn" href="${first ? first.slug + ".html" : "chapters.html"}">Start learning ${icon("arrow")}</a><a class="btn btn-ghost btn-lg" href="examples.html">${icon("play")} Watch agents work</a></div>
    <p class="hero-note">${chapters.length} chapters · ${examples.length} animated examples · ${prompts.length} prompts · no coding needed</p>
  </div>
  <div class="hero-art reveal" aria-hidden="true"><div data-widget="hero-loop"></div></div>
</section>
<section class="band reveal"><h2>Talking <em>vs.</em> doing</h2><p class="band-sub">One request. Two very different helpers.</p><div data-widget="chat-vs-agent"></div></section>
<section class="band reveal"><h2>The learning path</h2><p class="band-sub">Four parts, about ten minutes a chapter.</p>
<div class="parts">${site.parts.map((p, i) => `<div class="part"><div class="part-head"><span class="part-num">${roman(i)}</span><div><h3>${esc(p.title)}</h3><p>${esc(p.blurb)}</p></div><span class="part-prog" data-part="${p.id}"></span></div><div class="ch-grid">${p.items.map(chapterCard).join("")}</div></div>`).join("")}</div></section>
<section class="band reveal"><h2>Agents <em>in action</em></h2><p class="band-sub">Real applications, replayed step by step.</p><div class="ex-grid">${examples.slice(0, 6).map(exampleCard).join("")}</div><p class="center"><a class="btn btn-ghost" href="examples.html">See all ${examples.length} examples ${icon("arrow")}</a></p></section>
<section class="band reveal"><h2>Ready to <em>try it?</em></h2><p class="band-sub">Prompts for study, writing, research and work. Copy, fill in, go.</p><p class="center"><a class="btn btn-primary" href="prompts.html">Open the prompt library ${icon("arrow")}</a></p></section>
</main>`;
  return layout({ title: `${site.name} — a beginner's guide to AI agents`, desc: site.tagline, body, page: "home", scripts: [] });
}

function chaptersPage() {
  const body = `<main id="main" class="page"><div class="ch-hero reveal"><p class="eyebrow">The learning path</p><h1>All chapters</h1><p class="lead">Start at the top, or jump to what you need.</p></div>
${site.parts.map((p, i) => `<section class="part reveal"><div class="part-head"><span class="part-num">${roman(i)}</span><div><h2>${esc(p.title)}</h2><p>${esc(p.blurb)}</p></div><span class="part-prog" data-part="${p.id}"></span></div><div class="ch-grid">${p.items.map(chapterCard).join("")}</div></section>`).join("")}</main>`;
  return layout({ title: `Chapters · ${site.name}`, desc: "All chapters of the guide.", body, page: "chapters" });
}

function examplesPage() {
  const cats = [...new Set(examples.map((e) => e.category))];
  const body = `<main id="main" class="page"><div class="ch-hero reveal"><p class="eyebrow">Agents in action</p><h1>Watch agents <em>work</em></h1><p class="lead">Twelve real applications, replayed step by step: what the agent thinks, which tools it uses, and where a human steps in.</p></div>
<div class="filters">${["All", ...cats].map((c, i) => `<button type="button" class="filter${i ? "" : " on"}" data-cat="${esc(c)}">${esc(c)}</button>`).join("")}</div>
<h2 class="sr-only">All examples</h2><div class="ex-grid">${examples.map((e) => exampleCard(e).replace('class="ex-card"', `class="ex-card" data-cat="${esc(e.category)}"`)).join("")}</div></main>`;
  return layout({ title: `Agents in action · ${site.name}`, desc: "Animated examples of real agent applications.", body, page: "examples" });
}

function promptsPage() {
  const cats = [...new Set(prompts.map((p) => p.category))];
  const body = `<main id="main" class="page"><div class="ch-hero reveal"><p class="eyebrow">Prompt library</p><h1>Ready-to-use <em>prompts</em></h1><p class="lead">Copy, fill in the <mark>[brackets]</mark>, paste into any capable assistant. Each follows the recipe from <a href="great-instructions.html">Giving great instructions</a>.</p></div>
<div class="filters">${["All", ...cats].map((c, i) => `<button type="button" class="filter${i ? "" : " on"}" data-cat="${esc(c)}">${esc(c)}</button>`).join("")}<input type="search" class="prompt-search" placeholder="Search prompts…" aria-label="Search prompts"></div>
<div class="prompt-grid">${prompts.map((p) => `<div class="prompt-card big" data-cat="${esc(p.category)}" data-text="${esc((p.title + " " + p.when + " " + p.prompt).toLowerCase())}"><div class="prompt-head"><span>${esc(p.title)}</span><button type="button" class="copy-btn">Copy</button></div><p class="prompt-when">${esc(p.when || "")}</p><pre class="prompt-text">${esc(String(p.prompt).trim()).replace(/\[([^\]]+)\]/g, "<mark>[$1]</mark>")}</pre></div>`).join("")}</div></main>`;
  return layout({ title: `Prompt library · ${site.name}`, desc: "Copy-and-paste prompts for learning and work.", body, page: "prompts" });
}

const PLAY = [
  ["hero-loop", "The agent loop", "the-agent-loop"], ["chat-vs-agent", "Chatbot vs. agent", "what-is-an-agent"], ["agent-or-not", "Agent or not?", "what-is-an-agent"],
  ["next-word", "Next-word prediction", "the-ai-brain"], ["tokenizer", "Tokens", "the-ai-brain"], ["be-the-agent", "Be the agent", "the-agent-loop"],
  ["toolbox", "Give the agent tools", "tools"], ["context-backpack", "The memory backpack", "memory"], ["plan-tree", "Planning & replanning", "planning"],
  ["team-race", "One agent vs. a team", "agent-teams"], ["prompt-builder", "Build a great instruction", "great-instructions"], ["tutor-modes", "AI tutor techniques", "learn-faster"],
  ["delegation-matrix", "What to delegate", "agents-at-work"], ["spot-the-trap", "Spot the trap", "staying-safe"], ["autonomy-dial", "The autonomy dial", "staying-safe"],
  ["message-flow", "Under the hood", "under-the-hood"], ["mcp-plugs", "Plug-in tools (MCP)", "under-the-hood"], ["error-chain", "Why errors add up", "reliable-agents"],
  ["spot-the-mistake", "Proofread the agent", "reliable-agents"], ["horizon-chart", "How far agents have come", "whats-next"]
];
function playgroundPage() {
  const body = `<main id="main" class="page"><div class="ch-hero reveal"><p class="eyebrow">Playground</p><h1>The <em>playground</em></h1><p class="lead">Every interactive demo in one place, each linked to the chapter that explains it.</p>
<nav class="mini-toc">${PLAY.map(([w, t]) => `<a href="#pg-${w}">${esc(t)}</a>`).join("")}</nav></div>
${PLAY.map(([w, t, ch]) => `<section class="pg reveal" id="pg-${w}"><h2 class="center pg-h">${esc(t)}</h2>${bySlug.has(ch) ? `<p class="center w-note" style="margin:0">From <a href="${ch}.html">${esc(bySlug.get(ch).title)}</a></p>` : ""}<div data-widget="${w}"></div></section>`).join("\n")}</main>`;
  return layout({ title: `Playground · ${site.name}`, desc: "All interactive demos about AI agents.", body, page: "playground" });
}

// ---------- write ----------
fs.rmSync(OUT, { recursive: true, force: true });
fs.mkdirSync(path.join(OUT, "assets"), { recursive: true });
fs.mkdirSync(path.join(OUT, "sims"), { recursive: true });
for (const f of fs.readdirSync(path.join(G, "assets"))) fs.copyFileSync(path.join(G, "assets", f), path.join(OUT, "assets", f));
for (const f of fs.readdirSync(path.join(G, "sims"))) fs.copyFileSync(path.join(G, "sims", f), path.join(OUT, "sims", f));
const data = { chapters: chapters.map((c) => ({ s: c.slug, t: c.title, e: c.emoji, p: c.part.id })), examples: examples.map((e) => ({ s: "example-" + e.slug, t: e.title, e: e.emoji })), parts: site.parts.map((p) => ({ id: p.id, ch: p.items.map((c) => c.slug) })) };
fs.writeFileSync(path.join(OUT, "assets", "site-data.js"), `window.AMS=${JSON.stringify(data)};`);
const w = (f, h) => fs.writeFileSync(path.join(OUT, f), h.replace('<script src="assets/guide.js"></script>', '<script src="assets/site-data.js"></script>\n<script src="assets/guide.js"></script>\n<script src="assets/widgets.js"></script>'));
w("index.html", homePage());
w("chapters.html", chaptersPage());
w("examples.html", examplesPage());
w("prompts.html", promptsPage());
w("playground.html", playgroundPage());
for (const c of chapters) w(`${c.slug}.html`, chapterPage(c));
for (const e of examples) w(`example-${e.slug}.html`, examplePage(e));

const words = [...chapters, ...examples].reduce((a, p) => a + strip(p.html).split(" ").length, 0);
console.log(`Guide: ${chapters.length} chapters, ${examples.length} examples, ${prompts.length} prompts, ${words.toLocaleString()} words → docs/guide/`);
if (warnings.length) { console.log(`${warnings.length} warning(s):`); for (const x of warnings) console.log("  - " + x); }
