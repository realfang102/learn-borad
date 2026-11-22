// Agent Academy static site builder.
// Reads content/ (curriculum.json, lessons/*.md, glossary.yml, papers.yml, cheatsheet.md)
// and writes a fully static, offline-capable site to docs/.
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { Marked, Renderer } from "marked";
import hljs from "highlight.js";
import yaml from "js-yaml";
import * as T from "./templates.mjs";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const CONTENT = path.join(ROOT, "content");
const OUT = path.join(ROOT, "docs");
const SRC_ASSETS = path.join(ROOT, "src", "assets");

const warnings = [];
const warn = (m) => warnings.push(m);

// ---------- helpers ----------
export const esc = (s = "") =>
  String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

const slugify = (s) =>
  String(s)
    .toLowerCase()
    .replace(/<[^>]+>/g, "")
    .replace(/&[a-z]+;/g, "")
    .replace(/[^\p{L}\p{N}\s-]/gu, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");

const stripHtml = (h) =>
  h
    .replace(/<pre[\s\S]*?<\/pre>/g, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\s+/g, " ")
    .trim();

function parseFrontMatter(raw, file) {
  const m = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/);
  if (!m) {
    warn(`${file}: missing front matter`);
    return { data: {}, body: raw };
  }
  let data = {};
  try {
    data = yaml.load(m[1]) || {};
  } catch (e) {
    warn(`${file}: bad front matter YAML: ${e.message}`);
  }
  return { data, body: m[2] };
}

// ---------- quiz parsing ----------
function parseQuiz(src, inline) {
  const questions = [];
  let cur = null;
  const lines = src.split(/\r?\n/);
  for (const line of lines) {
    const l = line.trimEnd();
    if (/^Q:\s*/.test(l)) {
      cur = { q: l.replace(/^Q:\s*/, ""), options: [], correct: -1, e: "" };
      questions.push(cur);
    } else if (cur && /^-\s*\[( |x|X)\]\s*/.test(l)) {
      const isCorrect = /^-\s*\[(x|X)\]/.test(l);
      if (isCorrect) cur.correct = cur.options.length;
      cur.options.push(l.replace(/^-\s*\[( |x|X)\]\s*/, ""));
    } else if (cur && /^E:\s*/.test(l)) {
      cur.e = l.replace(/^E:\s*/, "");
    } else if (cur && l.trim() && cur.e) {
      cur.e += " " + l.trim();
    } else if (cur && l.trim() && !cur.options.length) {
      cur.q += " " + l.trim();
    }
  }
  // Deterministically shuffle options (seeded by question text) so the correct answer's
  // position carries no signal. Skip questions whose options reference each other.
  for (const q of questions) {
    if (q.correct < 0 || q.options.some((o) => /\b(above|below|both|neither|none of)\b/i.test(o))) continue;
    let seed = 0;
    for (const ch of q.q) seed = (Math.imul(seed, 31) + ch.charCodeAt(0)) | 0;
    const rand = () => ((seed = (Math.imul(seed ^ (seed >>> 15), 2246822507) + 0x6d2b79f5) | 0), (seed >>> 0) / 4294967296);
    const idx = q.options.map((_, i) => i);
    for (let i = idx.length - 1; i > 0; i--) {
      const j = Math.floor(rand() * (i + 1));
      [idx[i], idx[j]] = [idx[j], idx[i]];
    }
    q.options = idx.map((i) => q.options[i]);
    q.correct = idx.indexOf(q.correct);
  }
  return questions
    .filter((q) => {
      if (q.correct < 0 || q.options.length < 2) {
        warn(`quiz question without valid options/answer: ${q.q.slice(0, 60)}`);
        return false;
      }
      return true;
    })
    .map((q) => ({
      q: inline(q.q),
      options: q.options.map((o) => inline(o)),
      correct: q.correct,
      e: inline(q.e),
    }));
}

function quizHtml(questions, id) {
  const qs = questions
    .map(
      (q, i) => `
<div class="quiz-q" data-correct="${q.correct}">
  <div class="quiz-question"><span class="quiz-num">${i + 1}</span><div>${q.q}</div></div>
  <div class="quiz-options" role="group">
    ${q.options
      .map(
        (o, j) =>
          `<button type="button" class="quiz-opt" data-i="${j}"><span class="quiz-letter">${String.fromCharCode(65 + j)}</span><span>${o}</span></button>`
      )
      .join("\n    ")}
  </div>
  <div class="quiz-expl" hidden><strong class="quiz-verdict"></strong> ${q.e}</div>
</div>`
    )
    .join("\n");
  return `<div class="quiz" data-quiz="${esc(id)}" data-total="${questions.length}">
${qs}
<div class="quiz-footer"><div class="quiz-score" aria-live="polite"></div><button type="button" class="btn btn-ghost quiz-reset">Reset quiz</button></div>
</div>`;
}

// ---------- markdown renderer ----------
const CALLOUTS = {
  NOTE: { label: "Note", icon: "ℹ️" },
  TIP: { label: "Tip", icon: "💡" },
  WARNING: { label: "Warning", icon: "⚠️" },
  CAUTION: { label: "Caution", icon: "⚠️" },
  IMPORTANT: { label: "Important", icon: "❗" },
  KEY: { label: "Key idea", icon: "🔑" },
  EXAMPLE: { label: "Example", icon: "🧪" },
};

function makeMarkdown(ctx) {
  const marked = new Marked({ gfm: true });
  const inline = (s) => marked.parseInline(s || "");
  marked.use({
    renderer: {
      heading({ tokens, depth }) {
        const text = this.parser.parseInline(tokens);
        let id = slugify(stripHtml(text)) || `section-${ctx.headings.length}`;
        let n = 2;
        const base = id;
        while (ctx.ids.has(id)) id = `${base}-${n++}`;
        ctx.ids.add(id);
        if (depth === 2 || depth === 3) ctx.headings.push({ depth, text: stripHtml(text), id });
        return `<h${depth} id="${id}"><a class="anchor" href="#${id}" aria-hidden="true">#</a>${text}</h${depth}>\n`;
      },
      code({ text, lang }) {
        const language = (lang || "").trim().split(/\s+/)[0].toLowerCase();
        if (language === "mermaid") {
          ctx.hasMermaid = true;
          return `<figure class="diagram"><pre class="mermaid">${esc(text)}</pre></figure>\n`;
        }
        if (language === "quiz") {
          const qs = parseQuiz(text, inline);
          ctx.quiz.push(...qs);
          return quizHtml(qs, ctx.slug);
        }
        let html;
        if (language && hljs.getLanguage(language)) {
          html = hljs.highlight(text, { language, ignoreIllegals: true }).value;
        } else {
          html = esc(text);
        }
        const label = language || "text";
        const isTrace = label === "text" && /^(Thought|Action|Observation|User|Assistant|Final Answer)\s*:/m.test(text);
        if (isTrace) {
          html = esc(text).replace(
            /^(Thought|Action|Observation|Final Answer|User|Assistant|Plan|Reflection|Result|Step \d+)(\s*\d*\s*:)/gm,
            (m, k, rest) => `<span class="tr-${k.toLowerCase().replace(/[^a-z]/g, "")}">${k}${rest}</span>`
          );
        }
        return `<div class="code-block${isTrace ? " trace" : ""}"><div class="code-head"><span class="code-lang">${esc(
          isTrace ? "agent trace" : label
        )}</span><button type="button" class="copy-btn" aria-label="Copy code">Copy</button></div><pre><code class="hljs language-${esc(
          label
        )}">${html}</code></pre></div>\n`;
      },
      blockquote({ tokens }) {
        const body = this.parser.parse(tokens);
        const m = body.match(/^<p>\[!([A-Z]+)\][ \t]*([^\n<]*)(?:\n|<\/p>)/);
        if (m && CALLOUTS[m[1]]) {
          const kind = m[1];
          const title = m[2].trim() || CALLOUTS[kind].label;
          let rest = body.slice(m[0].length);
          if (m[0].endsWith("\n")) rest = "<p>" + rest;
          rest = rest.replace(/^<p>\s*<\/p>/, "");
          return `<aside class="callout callout-${kind.toLowerCase()}"><div class="callout-title"><span class="callout-icon" aria-hidden="true">${CALLOUTS[kind].icon}</span>${title}</div><div class="callout-body">${rest}</div></aside>\n`;
        }
        return `<blockquote>${body}</blockquote>\n`;
      },
      table(token) {
        // Defer to default renderer, then wrap for horizontal scrolling.
        const html = Renderer.prototype.table.call(this, token);
        return `<div class="table-wrap">${html}</div>\n`;
      },
      link({ href, title, tokens }) {
        const text = this.parser.parseInline(tokens);
        const external = /^https?:\/\//.test(href);
        if (!external && /\.html(#.*)?$/.test(href)) ctx.links.push(href.replace(/#.*$/, ""));
        return `<a href="${esc(href)}"${title ? ` title="${esc(title)}"` : ""}${
          external ? ' target="_blank" rel="noopener"' : ""
        }>${text}</a>`;
      },
    },
  });
  return { marked, inline };
}

function renderMarkdown(md, slug) {
  const ctx = { slug, headings: [], ids: new Set(), hasMermaid: false, quiz: [], links: [] };
  const { marked, inline } = makeMarkdown(ctx);
  const html = marked.parse(md);
  return { html, ...ctx, inline };
}

// ---------- load content ----------
const curriculum = JSON.parse(fs.readFileSync(path.join(CONTENT, "curriculum.json"), "utf8"));
const lessons = [];
const bySlug = new Map();
let order = 0;
for (const mod of curriculum.modules) {
  mod.lessonObjs = [];
  for (const slug of mod.lessons) {
    const file = path.join(CONTENT, "lessons", `${slug}.md`);
    if (!fs.existsSync(file)) {
      warn(`missing lesson file: ${slug}.md`);
      continue;
    }
    const { data, body } = parseFrontMatter(fs.readFileSync(file, "utf8"), `${slug}.md`);
    const r = renderMarkdown(body, slug);
    const words = stripHtml(r.html).split(/\s+/).length;
    const lesson = {
      slug,
      order: ++order,
      module: mod,
      title: data.title || slug,
      description: data.description || "",
      duration: Number(data.duration) || Math.max(5, Math.round(words / 200)),
      level: data.level || "intermediate",
      objectives: data.objectives || [],
      prerequisites: data.prerequisites || [],
      tags: data.tags || [],
      html: r.html,
      headings: r.headings,
      hasMermaid: r.hasMermaid,
      quiz: r.quiz,
      links: r.links,
      words,
      widgets: [...r.html.matchAll(/data-widget="([a-z0-9-]+)"/g)].map((m) => m[1]),
    };
    lessons.push(lesson);
    bySlug.set(slug, lesson);
    mod.lessonObjs.push(lesson);
  }
}
lessons.forEach((l, i) => {
  l.prev = lessons[i - 1] || null;
  l.next = lessons[i + 1] || null;
});

const loadYaml = (name) => {
  const f = path.join(CONTENT, name);
  if (!fs.existsSync(f)) {
    warn(`missing ${name}`);
    return [];
  }
  try {
    return yaml.load(fs.readFileSync(f, "utf8")) || [];
  } catch (e) {
    warn(`${name}: ${e.message}`);
    return [];
  }
};
const glossary = loadYaml("glossary.yml")
  .filter((g) => g && g.term && g.definition)
  .sort((a, b) => a.term.localeCompare(b.term, "en", { sensitivity: "base" }));
const papers = loadYaml("papers.yml").filter((p) => p && p.title);

let cheatsheet = null;
const csFile = path.join(CONTENT, "cheatsheet.md");
if (fs.existsSync(csFile)) {
  const { data, body } = parseFrontMatter(fs.readFileSync(csFile, "utf8"), "cheatsheet.md");
  const r = renderMarkdown(body, "cheatsheet");
  cheatsheet = { ...data, ...r };
}

// ---------- validation ----------
const knownPages = new Set([
  ...curriculum.modules.flatMap((m) => m.lessons.map((s) => `${s}.html`)),
  "index.html", "glossary.html", "papers.html", "cheatsheet.html", "lab.html",
  "paths.html", "flashcards.html", "exam.html", "progress.html", "about.html", "curriculum.html",
]);
for (const l of lessons) {
  for (const href of l.links) if (!knownPages.has(href)) warn(`${l.slug}: broken internal link → ${href}`);
  for (const p of l.prerequisites) if (!curriculum.modules.some((m) => m.lessons.includes(p))) warn(`${l.slug}: unknown prerequisite ${p}`);
  if (!l.quiz.length) warn(`${l.slug}: no quiz`);
}
const allCurriculumSlugs = new Set(curriculum.modules.flatMap((m) => m.lessons));
for (const g of glossary) if (g.lesson && !allCurriculumSlugs.has(g.lesson)) warn(`glossary ${g.term}: unknown lesson ${g.lesson}`);

// ---------- write output ----------
fs.rmSync(OUT, { recursive: true, force: true });
fs.mkdirSync(path.join(OUT, "assets", "vendor"), { recursive: true });
for (const f of fs.readdirSync(SRC_ASSETS)) fs.copyFileSync(path.join(SRC_ASSETS, f), path.join(OUT, "assets", f));
fs.copyFileSync(
  path.join(ROOT, "node_modules", "mermaid", "dist", "mermaid.min.js"),
  path.join(OUT, "assets", "vendor", "mermaid.min.js")
);
fs.writeFileSync(path.join(OUT, ".nojekyll"), "");

// Course data shared with client JS (progress, nav, paths)
const courseData = {
  modules: curriculum.modules.map((m) => ({
    id: m.id,
    title: m.title,
    icon: m.icon,
    lessons: m.lessonObjs.map((l) => l.slug),
  })),
  lessons: Object.fromEntries(
    lessons.map((l) => [l.slug, { t: l.title, m: l.module.id, d: l.duration, q: l.quiz.length, lv: l.level, n: l.order }])
  ),
  paths: curriculum.paths.map((p) => ({ ...p, lessons: p.lessons.filter((s) => bySlug.has(s)) })),
};
fs.writeFileSync(path.join(OUT, "assets", "course-data.js"), `window.COURSE=${JSON.stringify(courseData)};`);

// Search index (lazy-loaded by the client)
const searchIndex = [];
for (const l of lessons) {
  // split rendered html by h2/h3 into sections
  const parts = l.html.split(/(?=<h[23] id=")/);
  for (const part of parts) {
    const hm = part.match(/^<h[23] id="([^"]+)">[\s\S]*?<\/a>([\s\S]*?)<\/h[23]>/);
    const text = stripHtml(part.replace(/^<h[23][\s\S]*?<\/h[23]>/, "")).slice(0, 2500);
    if (!text && !hm) continue;
    searchIndex.push({
      k: "lesson",
      t: l.title,
      s: hm ? stripHtml(hm[2]) : "Introduction",
      u: `${l.slug}.html${hm ? "#" + hm[1] : ""}`,
      x: text,
    });
  }
}
for (const g of glossary)
  searchIndex.push({ k: "term", t: g.term, s: "Glossary", u: `glossary.html#${slugify(g.term)}`, x: g.definition + " " + (g.aliases || []).join(" ") });
for (const p of papers)
  searchIndex.push({ k: "paper", t: p.title, s: `${p.authors || ""} ${p.year || ""}`, u: p.url, x: p.summary || "" });
fs.writeFileSync(path.join(OUT, "assets", "search-index.js"), `window.SEARCH_INDEX=${JSON.stringify(searchIndex)};`);

const site = { curriculum, lessons, bySlug, glossary, papers, cheatsheet, slugify, esc };
const write = (file, html) => fs.writeFileSync(path.join(OUT, file), html);

for (const l of lessons) write(`${l.slug}.html`, T.lessonPage(site, l));
write("index.html", T.homePage(site));
write("curriculum.html", T.curriculumPage(site));
write("paths.html", T.pathsPage(site));
write("glossary.html", T.glossaryPage(site));
write("papers.html", T.papersPage(site));
if (cheatsheet) write("cheatsheet.html", T.cheatsheetPage(site));
write("lab.html", T.labPage(site));
write("flashcards.html", T.flashcardsPage(site));
write("exam.html", T.examPage(site));
write("progress.html", T.progressPage(site));
write("about.html", T.aboutPage(site));

// ---------- report ----------
const totalWords = lessons.reduce((a, l) => a + l.words, 0);
const totalQuiz = lessons.reduce((a, l) => a + l.quiz.length, 0);
console.log(
  `Built ${lessons.length} lessons (${totalWords.toLocaleString()} words, ${totalQuiz} quiz questions), ` +
    `${glossary.length} glossary terms, ${papers.length} papers → docs/`
);
const pos = [0, 0, 0, 0, 0, 0];
for (const l of lessons) for (const q of l.quiz) pos[q.correct]++;
console.log("Correct-answer positions (A..F):", pos.join(" / "));
if (warnings.length) {
  console.log(`\n${warnings.length} warning(s):`);
  for (const w of warnings) console.log("  - " + w);
}
