# Authoring guide — "Agents Made Simple"

A **beginner-friendly** website about AI agents (separate from Agent Academy, which is the in-depth course).
Readers: complete beginners — students, office workers, managers, curious people. **No coding knowledge assumed.**
Goal: help them *quickly understand how agents work* and *start using agents to learn more effectively and get
more done at work*. Build: `node guide/build.mjs` → `docs/guide/`. Look at the finished templates first:
`guide/pages/chapters/what-is-an-agent.md`, `guide/pages/examples/coding-agent.md`, `guide/sims/coding-agent.js`.

## Voice & style

- Warm, encouraging, concrete, short sentences. Explain like a great teacher talking to a smart friend.
- **Intuition first**: analogy or demo → plain explanation → (optional) detail. Never open with jargon.
- Define every term in plain words the first time (bold it). Avoid acronyms unless explained.
- Use everyday examples (email, homework, trips, shopping, spreadsheets) more than programming examples.
- Accurate: never invent statistics, products, dates or quotes. Frame fast-changing facts "as of 2026".
- Honest about limits: agents make mistakes; show the habits that keep people in control.
- Chapters: ~1,200–2,000 words. Example pages: ~700–1,200 words + the simulation.

## Page format

Front matter (YAML), then Markdown. Raw HTML blocks are allowed (leave a blank line before and after them).

Chapter front matter:
```yaml
---
title: "Memory: how agents remember"
emoji: "🎒"
subtitle: "One plain-language sentence about what the reader will learn."
minutes: 10
---
```
Example front matter:
```yaml
---
title: "The research agent"
emoji: "🔎"
subtitle: "One sentence."
category: "Research"        # one of: Software, Research, Customer service, Browsing, Data, Learning, Productivity, Writing, Operations, Voice
level: "Intermediate"       # Beginner | Intermediate | Advanced
concepts: [agent-teams, tools]   # chapter slugs from guide/site.json
sim: research-agent         # the guide/sims/<id>.js file to play
---
```

### Building blocks

- `## Heading` sections (the first few become a mini table of contents). No `#` H1.
- **Callouts**: `> [!KEY] Optional title`, `> [!TIP]`, `> [!NOTE]`, `> [!WARNING]`, `> [!TRY]`, `> [!ANALOGY]`, `> [!EXAMPLE]` — then the text on the next `>` lines.
- **Detailed explanations** (hidden unless the reader switches the header toggle to "🤓 Detailed"):
  ```html
  <div class="detail">

  Markdown text here, with **bold**, lists, etc.

  </div>
  ```
  Use 1–4 per page for nuance/technical depth. The main text must make sense without them.
- **Copyable prompts**: a fenced block with language `prompt` renders as a "✨ Prompt you can use" card with a Copy button. Use `[square brackets]` for parts to fill in.
- **Tables** (GitHub Markdown) for comparisons.
- **Quiz** ("Quick check", 3 questions, at the end of each chapter and example):
  ````
  ```quiz
  Q: Question?
  - [ ] wrong option
  - [x] right option (exactly one)
  - [ ] wrong option
  - [ ] wrong option
  E: Explanation shown after answering (say why the tempting wrong answer is wrong).
  ```
  ````
  Make all options similar in length and plausible; the correct one must NOT usually be the longest.
- **Step strip** (numbered cards, great for "How it works"):
  ```html
  <div class="steps-strip">
  <div><strong>Step title</strong>One short sentence.</div>
  <div><strong>Next step</strong>One short sentence.</div>
  </div>
  ```
- **Links** to other pages: `[the agent loop](the-agent-loop.html)`, examples `example-research-agent.html`, `prompts.html`, `examples.html`. Link generously.

### Interactive widgets (place with `<div data-widget="NAME"></div>`, blank lines around)

Each is already implemented in `guide/assets/widgets.js`. Introduce each with a sentence telling the reader what to do, and follow it with a sentence on what they should have noticed.

| Widget | What it does | Assigned chapter |
|---|---|---|
| `hero-loop` | Animated robot cycling Think → Act → Observe | (home) — may also be used in the-agent-loop |
| `chat-vs-agent` | Same request, chatbot vs agent, animated | what-is-an-agent (done) |
| `agent-or-not` | 8-card "agent or not?" sorting game | what-is-an-agent (done) |
| `next-word` | Next-word probabilities + temperature slider + sampling | the-ai-brain |
| `tokenizer` | Type text, see tokens and counts | the-ai-brain |
| `be-the-agent` | Choose-your-own-adventure: reader acts as the agent fixing a slow website (4 loop rounds) | the-agent-loop |
| `toolbox` | Toggle tools on/off, run tasks, see success vs. "I can't" | tools |
| `context-backpack` | Context window as a backpack; overflow forgets; summarize; save to notebook; ask a question | memory |
| `plan-tree` | Goal → animated plan tree → execution with a failure and replanning | planning |
| `team-race` | One agent vs lead + N helpers racing; time vs tokens trade-off | agent-teams |
| `prompt-builder` | Add instruction "ingredients", watch quality meter and likely result improve | great-instructions |
| `tutor-modes` | 6 AI-tutor techniques with animated mini-chats and copyable prompts (topic input) | learn-faster |
| `delegation-matrix` | 8 work tasks: agent does it / agent drafts, I review / I do it myself | agents-at-work |
| `spot-the-trap` | Find hidden prompt-injection text in an email and a web page | staying-safe |
| `autonomy-dial` | Slider of 5 autonomy levels for an email agent; what it may do on its own | staying-safe |
| `message-flow` | Animated packets between app, model and tool, synced with the ~20-line agent loop code | under-the-hood |
| `mcp-plugs` | Connect MCP servers ("USB-C for AI") and watch the tool list grow, with permission prompts | under-the-hood |
| `error-chain` | Per-step success × steps → overall success; toggle "checks its work" | reliable-agents |
| `spot-the-mistake` | Find the wrong math and the invented citation in an agent's report | reliable-agents |
| `horizon-chart` | Animated chart of the growing length of tasks agents can do (METR trend) | whats-next |

### Simulations (the animated agent runs)

Place with `<div class="sim" data-sim="ID"></div>` (blank lines around). The page front matter `sim:` field loads
`guide/sims/<sim>.js` automatically on example pages; a chapter may also embed a sim (name it `ch-<slug>`), which the build
loads automatically when the page contains `data-sim="..."`.

A sim file registers one object:

```js
window.SIMS = window.SIMS || {};
window.SIMS["research-agent"] = {
  title: "Short title shown in the player",
  intro: "HTML shown before playing: the scenario in 1–2 sentences. Ends with: Press <strong>▶ Play</strong>.",
  panes: [                       // 2–6 panes; laid out automatically in a responsive grid
    { id: "chat", type: "chat", title: "Chat" },
    { id: "think", type: "thoughts", title: "Agent's thinking" }
    // add { span: true } to make a pane twice as wide
  ],
  steps: [                       // 12–22 steps tell a complete, realistic story
    { phase: "user", say: "Narration for beginners (supports **bold**).", do: [ /* operations */ ], tokens: 800, t: 2 }
  ]
};
```

`phase` ∈ `user` (the goal arrives), `think`, `act`, `observe`, `human` (a person decides), `done`. It lights up the
loop indicator. `say` is the narration — this is where the teaching happens: explain *why* the agent does each thing.
`tokens` (optional) adds to the token counter; `t` (optional) adds simulated seconds; `wait` (optional) overrides the
seconds before the next step.

**Pane types and their operations** (`{ pane: "<id>", op: "<op>", ... }`):

| Pane type | Operations |
|---|---|
| `chat` | `msg` `{from: "user"|"agent", text}` (agent messages type out) |
| `thoughts` | `think` `{text}` |
| `tools` | `call` `{name, args}` (args: object or string) · `result` `{text, error?: true}` |
| `terminal` | `cmd` `{text}` · `out` `{text, style?: "out"|"err"|"ok"}` |
| `editor` | `open` `{file, code}` · `highlight` `{lines: [n]}` (1-based) · `edit` `{from, to, code}` (replaces lines from..to, shows a red→green diff) |
| `browser` | `go` `{url, title, els: [{text, kind?: "btn"|"input"|"danger"|"text", value?}]}` · `click` `{el: index}` · `type` `{el: index, text}` (animated cursor; several actions in one step play in sequence; typing fills the element's value field if it has one) |
| `sheet` | `set` `{cols: [...], rows: [[...]]}` · `highlight` `{col?: i, row?: i}` · `addcol` `{name, values: [...]}` |
| `chart` | `bars` `{title, unit?, data: [{label, value, hi?: true, text?}]}` (animated bar chart) |
| `doc` | `heading` `{text}` · `para` `{text}` (use `[1]` for citation markers) · `bullets` `{items: [...]}` |
| `inbox` | `list` `{items: [{from, subj, time}]}` · `tag` `{i, label, color?: "red"|"green"|"blue"|"amber"|"purple"}` · `draft` `{to?, text}` |
| `agents` | `spawn` `{agents: [{name, task, lead?: true}]}` · `progress` `{name, pct, status?}` · `done` `{name, result?}` |
| `sources` | `add` `{items: [{title, meta, score?: 0..1}]}` · `pick` `{i: index or [indexes]}` |
| `checklist` | `set` `{items: [...]}` · `mark` `{i, state: "todo"|"doing"|"done"|"fail", text?}` (state defaults to done) |
| `phone` | `line` `{who: "caller"|"agent", text}` (animated waveform) |
| `info` | `set` `{pairs: {Key: "value"}}` (a small status board, e.g. order details) |
| `notes` | `add` `{text}` |
| any pane | `approval` `{title, detail, approve?, deny?, deniedSay}` — pauses the run until the reader clicks Approve/Deny (auto-approves after 8 s while playing). `deniedSay` is the narration if they deny (the run then ends safely). |
| any pane | `clear` — empties the pane |

Rules for great sims: realistic and specific (names, numbers, file names, sources); show at least one moment where the
agent **checks** something, one where it **adapts** (an error, a dead end, a surprising result), and — for anything
with real-world impact — a **human approval** step. Keep each `say` to 1–3 sentences. Use only fictional people,
companies and data (no real persons' private info). Don't present fictional sources as real publications.

### Example page structure

1. Intro (2 short paragraphs): the scenario and why this kind of agent matters.
2. The sim: `<div class="sim" data-sim="ID"></div>`, then a `> [!TRY]` callout suggesting something to do in the player.
3. `## How it works` — a steps-strip summarizing the agent's strategy + a short paragraph; optional `<div class="detail">` on the real-world tech behind it (products/standards as of 2026, accurately).
4. `## Where this is used today` or `## Why this works` — concrete, honest.
5. `> [!WARNING] What can go wrong` — 3–4 bullets.
6. `## Try it yourself` — 1–2 `prompt` blocks the reader can paste into a capable AI assistant/agent today.
7. A 3-question `quiz` (no heading needed, or `## Quick check`).

### Chapter structure

Hook → core idea with an analogy → demo widget(s) → explanation → practical tips → `## Quick check` quiz → `## What's next` (1–2 sentences leading to the next chapter). 2–5 `##` sections plus those. Link to relevant example pages.
