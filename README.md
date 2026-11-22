# Agent Academy

**A free, comprehensive, interactive course on AI agents** — from the first principles of the
agent loop to tools, memory, retrieval, context engineering, multi-agent systems, MCP/A2A,
evaluation, observability, reliability, cost, security, alignment and training agentic models.

- **40 in-depth lessons** in 8 modules, each with objectives, diagrams, runnable code, exercises,
  a quiz with explanations, and curated further reading
- **9 interactive simulations** (agent loop stepper, context-window simulator, prompt-injection
  sandbox, cost calculator, pass@k vs pass^k, workflow pattern explorer, and more)
- **12 graded hands-on projects**, from a first tool call to a red-teamed, evaluated production agent
- **4 learning paths** (Newcomer, Builder, Researcher, Leader)
- **Glossary tooltips** inline in every lesson, and a one-page **course review** of every lesson's key takeaways
- **Glossary** of 240+ terms, **spaced-repetition flashcards**, a randomized **practice exam**,
  a **reading list** of ~100 papers and guides, and a printable **cheat sheet**
- Progress tracking, notes, quiz scores and export/import — all stored locally in the browser
- Full-text search (`⌘K` / `Ctrl K` / `/`), dark mode, mobile-friendly, works offline,
  zero runtime dependencies

## Quick start

```bash
npm install
npm run build      # content/ → docs/
npm run serve      # http://localhost:8080
```

You can also just open `docs/index.html` directly in a browser — every page works from `file://`.

## Project layout

```
content/
  curriculum.json     # modules, lesson order, learning paths
  lessons/*.md        # one Markdown file per lesson (front matter + body)
  glossary.yml        # glossary terms (also drive the flashcards)
  papers.yml          # reading list
  cheatsheet.md       # one-page reference
  projects.md         # hands-on projects
scripts/
  build.mjs           # Markdown → HTML, search index, glossary tooltips, validation
  templates.mjs       # page templates
  quiz-stats.mjs      # flags quiz giveaways (correct answer = longest option)
  qa.cjs              # browser QA: JS errors, diagram failures, mobile overflow (needs Playwright)
src/assets/
  styles.css          # all styles (light + dark themes)
  app.js              # progress, quizzes, search, flashcards, exam, dashboard
  widgets.js          # interactive simulations
docs/                 # generated site (committed so GitHub Pages can serve it)
CONTENT_GUIDE.md      # format and style contract for writing lessons
```

## Writing content

See [CONTENT_GUIDE.md](CONTENT_GUIDE.md). Lessons support GitHub-style callouts
(`> [!TIP]`, `> [!KEY]`, …), Mermaid diagrams, agent-trace blocks, interactive widget
placeholders and a simple quiz syntax. The build validates internal links, prerequisites and
quizzes and prints warnings.

## Deploying

The site is fully static. To publish with GitHub Pages, set **Settings → Pages → Source** to
"Deploy from a branch", choose your branch and the `/docs` folder. Any static host works too.
