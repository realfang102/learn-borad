# Content Guide — Agent Academy

This is the style and format contract for every lesson on the site. The site is a static,
self-paced course called **Agent Academy** that teaches *everything* about AI agents —
from first principles to production engineering and frontier research. The audience ranges
from curious newcomers to senior engineers and researchers, so every lesson should be
**layered**: an intuitive explanation first, then precise technical depth, then practice.

Lessons live in `content/lessons/<slug>.md`. Order and grouping come from
`content/curriculum.json` (do not edit that file). The build (`npm run build`) turns lessons into
HTML pages in `docs/`.

---

## 1. File format

Every lesson starts with YAML front matter:

```yaml
---
title: "Tool Use & Function Calling"
description: "How LLMs call external functions: schemas, the request/response cycle, parallel calls and error handling."
duration: 35            # honest reading time in minutes (≈ words / 200, plus time for code/quiz)
level: beginner         # beginner | intermediate | advanced
objectives:
  - Explain how a model "calls" a function it cannot execute itself
  - Write a JSON Schema tool definition
  - Implement the tool-use loop and handle tool errors
prerequisites: [the-agent-loop]   # slugs of earlier lessons (may be empty [])
tags: [tools, function-calling, json-schema]
---
```

Then the body in GitHub-flavored Markdown. **Do not** include an H1 (`#`) — the title is
rendered from front matter. Start with 1–3 short paragraphs that hook the reader and say what
they'll learn and why it matters.

## 2. Structure of a lesson

1. **Hook / intro** (no heading) — why this matters, a concrete motivating example.
2. **Core sections** — `##` for sections, `###` for subsections (both appear in the on-page
   table of contents, so keep headings short and descriptive). Typically 5–10 `##` sections.
3. `## Key Takeaways` — 5–8 crisp bullets.
4. `## Exercises` — 3–5 hands-on or thought exercises, graded from easy to hard. Coding
   exercises should be concrete ("Add a `max_steps` guard to the loop above and…").
5. `## Check Your Understanding` — a quiz block (format below), 5–8 questions.
6. `## Further Reading` — 4–10 high-quality links (papers, official docs, seminal blog posts),
   each with a one-line note on why it's worth reading.

Target length: **2,500–4,500 words** of real substance per lesson. Depth beats breadth, but a
lesson must be comprehensive for its topic — if a practitioner would expect to find it, include it.

## 3. Writing style

- Clear, direct, warm, expert. Explain like a great senior engineer mentoring a sharp colleague.
- Lead with intuition, then formalize. Use analogies sparingly and drop them when precision matters.
- Use **concrete examples** constantly: realistic tasks, actual traces, real numbers.
- Define every term on first use (bold the term). Don't assume jargon.
- Prefer short paragraphs, bullet lists for enumerations, and tables for comparisons.
- Be honest about trade-offs, limitations, open problems and hype. Say "it depends" only
  if you then say *on what*.
- Vendor-neutral in concepts. Mention products and companies when they're the canonical example
  (e.g., "Claude Code", "OpenAI's Operator", "LangGraph"), but teach the underlying ideas.
- **Accuracy is paramount.** Never invent statistics, benchmark scores, dates, quotes, paper
  titles or URLs. If unsure of an exact number, describe the trend qualitatively. Only link to
  URLs you are confident exist (arXiv abs pages, official docs root pages, well-known blog posts).
  You may use WebSearch (load it with ToolSearch `select:WebSearch`) to verify a fact you're
  unsure about — keep it to a handful of searches per lesson.
- Today's date is **November 2026**. The field moves fast: where things are fast-changing
  (model names, product features, leaderboard numbers), frame them "as of 2026" and teach the
  durable principle alongside.

## 4. Code examples

- Default language: **Python 3.11+**. Use TypeScript where it's the natural fit (e.g., some SDKs).
- Code must be correct and runnable in principle — real imports, no pseudo-APIs presented as real.
  If something is illustrative pseudocode, label it (` ```python title="pseudocode" ` is not supported;
  just say "In pseudocode:" before the block).
- When calling an LLM, the canonical examples use the **Anthropic Python SDK** (`pip install anthropic`).
  Current, correct conventions (the API changed in 2025–2026; older patterns now error):
  - Model ID: `"claude-opus-5-5"` (current default). Others: `"claude-sonnet-5-5"` (faster/cheaper),
    `"claude-haiku-5-5"` (cheapest), `"claude-fable-5-2"` (most capable). Never add date suffixes.
  - `client = anthropic.Anthropic()` reads `ANTHROPIC_API_KEY` from the environment.
  - `client.messages.create(model=..., max_tokens=16000, system=..., tools=[...], messages=[...])`
  - **Do not pass `temperature`, `top_p` or `top_k`** (rejected by current models).
  - **No assistant-message prefill** (rejected). Use structured outputs instead.
  - Thinking: `thinking={"type": "adaptive"}`; depth via `output_config={"effort": "low"|"medium"|"high"|"xhigh"|"max"}`.
    Never use `budget_tokens`.
  - `tool_choice` may be `{"type": "auto"}` or `{"type": "none"}`; forced `any`/`tool` is rejected on
    current models — steer with instructions or `strict: true` tools instead.
  - Tools: `{"name": ..., "description": ..., "input_schema": {JSON Schema}}`; optional `"strict": True`
    (requires `additionalProperties: false` and `required`).
  - Manual agent loop: loop while `response.stop_reason == "tool_use"`; append
    `{"role": "assistant", "content": response.content}`; run each `tool_use` block; send **all**
    results back in **one** user message as `{"type": "tool_result", "tool_use_id": block.id, "content": "...", "is_error": bool}`.
    Handle `"end_turn"`, `"max_tokens"`, `"pause_turn"`, `"refusal"` stop reasons.
  - Tool Runner (SDK helper, beta): `from anthropic import beta_tool`, decorate functions with
    `@beta_tool`, then `runner = client.beta.messages.tool_runner(model=..., max_tokens=..., tools=[fn], messages=[...])`
    and `for message in runner: ...` (or `runner.until_done()`).
  - Structured outputs: `client.messages.parse(..., output_format=PydanticModel)` or
    `output_config={"format": {"type": "json_schema", "schema": {...}}}` on `messages.create`.
  - Prompt caching: `cache_control={"type": "ephemeral"}` on a block, or top-level automatic caching.
    Verify with `response.usage.cache_read_input_tokens`.
  - Server tools: web search `{"type": "web_search_20260209", "name": "web_search"}`, web fetch
    `{"type": "web_fetch_20260209", "name": "web_fetch"}`, code execution `{"type": "code_execution_20260521", "name": "code_execution"}`.
  - Full reference (read the relevant parts before writing SDK-specific code):
    `/tmp/claude-0/bundled-skills/2.1.330/fb687575d857af95c653a4c0e1aecfce/claude-api/` —
    `python/claude-api/README.md`, `python/claude-api/tool-use.md`, `shared/tool-use-concepts.md`,
    `shared/agent-design.md`, `shared/prompt-caching.md`.
- For **other** SDKs/frameworks (OpenAI, LangGraph, CrewAI, etc.) keep examples minimal and close to
  their documented quick-start shapes, and add a note that APIs evolve — check current docs.
- Keep code blocks focused (typically 10–60 lines). Comment the non-obvious lines.
- Always tag fenced blocks with a language: `python`, `typescript`, `bash`, `json`, `yaml`, `text`.

## 5. Special blocks

**Callouts** (GitHub-style alerts). Optional custom title after the marker:

```markdown
> [!NOTE]
> Supplementary detail.

> [!TIP] Rule of thumb
> Practical advice.

> [!WARNING]
> A pitfall or risk.

> [!KEY] The big idea
> The single most important insight of a section. Use 1–3 per lesson.

> [!EXAMPLE] A worked example
> A concrete scenario or trace.
```

**Diagrams** — use Mermaid in a ` ```mermaid ` fenced block (flowchart, sequenceDiagram, stateDiagram-v2).
Use 1–4 per lesson where a picture genuinely clarifies a mechanism. Keep labels short; quote labels
containing punctuation: `A["Model decides (tool call)"]`. Avoid styling directives (the site themes them).

**Agent traces** — show step-by-step agent behavior in a ` ```text ` block, e.g.:

```text
Thought: I need the current weather before recommending clothes.
Action: get_weather({"city": "Oslo"})
Observation: {"temp_c": -3, "conditions": "snow"}
Thought: It's cold and snowing…
```

**Interactive widgets** — some lessons host an interactive widget. Insert the placeholder exactly
as given (on its own line, blank lines around it) at the point where it best supports the text,
and introduce it with a sentence like "Try it yourself:". Assigned widgets:

| Lesson | Placeholder |
|---|---|
| what-is-an-agent | `<div class="widget" data-widget="autonomy-spectrum"></div>` |
| the-agent-loop | `<div class="widget" data-widget="agent-loop"></div>` |
| when-to-use-agents | `<div class="widget" data-widget="compounding-errors"></div>` |
| tool-use | `<div class="widget" data-widget="tool-call-anatomy"></div>` |
| context-engineering | `<div class="widget" data-widget="context-window"></div>` |
| workflow-patterns | `<div class="widget" data-widget="pattern-explorer"></div>` |
| evaluating-agents | `<div class="widget" data-widget="pass-at-k"></div>` |
| cost-and-latency | `<div class="widget" data-widget="cost-calculator"></div>` |
| agent-security | `<div class="widget" data-widget="prompt-injection"></div>` |

**Quiz** — a ` ```quiz ` fenced block. Each question starts with `Q:`; options are `- [ ]` (wrong)
or `- [x]` (correct; exactly one per question); `E:` gives the explanation shown after answering.
Separate questions with a blank line. Write questions that test understanding and application,
not trivia; make distractors plausible.

````markdown
```quiz
Q: Why does an agent loop need a maximum-step limit?
- [ ] The API rejects conversations longer than 10 turns
- [x] The model may never emit a final answer, so the harness must bound cost and time
- [ ] It improves the model's reasoning quality
- [ ] Tool results expire after a few steps
E: Nothing guarantees the model converges. A step (or token/time/cost) budget is the harness's safety net against infinite loops and runaway spend.

Q: ...
```
````

**Exercise solutions** — immediately after the `## Exercises` list, add one collapsible block with a hint
and a solution sketch per exercise, numbered to match. Leave blank lines inside so Markdown renders:

```markdown
<details class="solutions">
<summary>Hints and solution sketches</summary>

1. **Hint:** … **Sketch:** …
2. **Hint:** … **Sketch:** … (short code allowed)

</details>
```

**Cross-links** to other lessons: `[the agent loop](the-agent-loop.html)` (slug + `.html`).
Link generously to related lessons using slugs from `content/curriculum.json`.

## 6. Quality bar checklist

- [ ] Front matter complete and valid YAML (quote strings containing `:`)
- [ ] No H1; sections use `##`/`###`
- [ ] Intuition → depth → practice
- [ ] At least one diagram or trace where a mechanism is described
- [ ] Code is correct for current APIs (see §4)
- [ ] Key Takeaways, Exercises, Check Your Understanding (5–8 Qs), Further Reading present
- [ ] No fabricated facts, numbers or links
- [ ] Cross-links to related lessons
