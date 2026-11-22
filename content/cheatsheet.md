---
title: "Agent Builder's Cheat Sheet"
description: "Everything essential on one page: patterns, loop code, tool design, context, evals, security, cost."
---

The whole course on one page. Each section links to the lesson that explains it in depth. Model names, prices and feature flags change fast; the principles here don't. Check current docs for exact values as of 2026.

## The agent loop in 25 lines

A manual loop with the Anthropic Python SDK (`pip install anthropic`). In production, consider the SDK's Tool Runner, which handles this loop for you. Details: [the agent loop](the-agent-loop.html), [tool use](tool-use.html), [build an agent from scratch](build-agent-from-scratch.html).

```python
import anthropic
client = anthropic.Anthropic()  # reads ANTHROPIC_API_KEY

def run_agent(task: str, tools: list[dict], run_tool, max_steps: int = 20) -> str:
    messages = [{"role": "user", "content": task}]
    for _ in range(max_steps):                      # hard step budget
        resp = client.messages.create(
            model="claude-opus-5-5", max_tokens=16000,
            system="You are a careful agent. Use tools when they help; verify before finishing.",
            tools=tools, messages=messages,
        )
        messages.append({"role": "assistant", "content": resp.content})
        if resp.stop_reason == "pause_turn":        # server tool paused: re-send as-is to resume
            continue
        if resp.stop_reason != "tool_use":          # end_turn / max_tokens / refusal / stop_sequence
            return "".join(b.text for b in resp.content if b.type == "text")
        results = []
        for block in (b for b in resp.content if b.type == "tool_use"):
            try:
                out, err = str(run_tool(block.name, block.input)), False
            except Exception as e:                  # errors go back to the model, not up the stack
                out, err = f"Error: {e}", True
            results.append({"type": "tool_result", "tool_use_id": block.id, "content": out, "is_error": err})
        messages.append({"role": "user", "content": results})  # ALL results in ONE message
    raise RuntimeError("Step budget exhausted")
```

Current-API rules: no `temperature`/`top_p`/`top_k`, no assistant prefill, thinking via `thinking={"type": "adaptive"}` plus `output_config={"effort": ...}`, and `tool_choice` limited to `auto` or `none`.

## Choosing an architecture

Start with the simplest thing that could work, and add autonomy only when evals show you need it. See [when to use agents](when-to-use-agents.html) and [agent architectures](agent-architectures.html).

| If the task... | Use | Why |
|---|---|---|
| Is one well-defined step | Single LLM call (+ retrieval, examples) | Cheapest, fastest, easiest to evaluate |
| Has fixed, known steps | Workflow ([patterns](workflow-patterns.html)) | Predictable, debuggable, cost-bounded |
| Has an unpredictable path, needs many tool calls, and its result can be checked | Single agent with tools | Flexibility where the path can't be scripted |
| Is broad, parallelizable, larger than one context window, and high-value | Orchestrator + subagents ([multi-agent](multi-agent-systems.html)) | Parallel exploration, context isolation, at roughly an order of magnitude more tokens |
| Involves tightly coupled writes, like editing one codebase | Single agent with shared context; subagents only for read-only research | Parallel writers make conflicting implicit decisions |
| Has irreversible or high-stakes actions | Any of the above + [human approval gates](human-in-the-loop.html) | Errors compound; humans catch the costly ones |

Agent go/no-go: is the task complex enough? Is it valuable enough to pay for the tokens? Are the needed capabilities reliable? How costly is an undetected error?

## Workflow patterns at a glance

| Pattern | Shape | Use when | Example |
|---|---|---|---|
| Prompt chaining | A → gate → B → C | Task splits cleanly into fixed steps | Outline → check → draft → translate |
| Routing | Classify → specialized handler | Inputs fall into distinct categories | Support triage; easy queries to a small model |
| Parallelization: sectioning | Split → run in parallel → merge | Independent subtasks | Guardrail check alongside the main answer |
| Parallelization: voting | Same task N times → aggregate | Need confidence or diverse attempts | Several reviewers flag vulnerabilities |
| Orchestrator-workers | LLM plans subtasks dynamically → workers → synthesize | Subtasks not knowable in advance | Multi-file code change; research |
| Evaluator-optimizer | Generate ↔ critique loop | Clear criteria and iteration helps | Literary translation; search refinement |
| Autonomous agent | Loop: model → tools → observations | Open-ended, many steps, verifiable outcome | Coding agent, computer use |

More: [workflow patterns](workflow-patterns.html).

## Tool design checklist

Details: [designing tools](designing-tools.html), [structured outputs](structured-outputs.html), [MCP and A2A](protocols-mcp-a2a.html).

- [ ] **Few, high-level tools** that match real workflows (`schedule_meeting`, not `list_users` + `list_events` + `create_event`).
- [ ] **Unambiguous names**, namespaced by service or resource (`github_create_issue`, `jira_search`).
- [ ] **Descriptions written like docs for a new hire**: what it does, when to use it (and when not to), formats, limits, an example.
- [ ] **Strict input schema**: typed params, enums over free text, `required` fields, `additionalProperties: false`; consider `strict: true`.
- [ ] **Poka-yoke**: make misuse hard (absolute paths, IDs from previous results, validated ranges).
- [ ] **Token-efficient output**: return meaningful fields and human-readable names rather than raw UUID dumps; paginate, filter and truncate with a clear note.
- [ ] **Helpful errors**: say what was wrong and how to fix it, returned as `is_error: true` results.
- [ ] **Idempotent or guarded side effects**: safe to retry; destructive actions need confirmation.
- [ ] **Few overlapping tools**: if a human can't say which tool to use, neither can the model.
- [ ] **Evaluate tools with realistic multi-step tasks**, then read the transcripts and iterate.

## Prompt and system-prompt checklist

Details: [prompting for agents](prompting-for-agents.html).

- [ ] **Role and goal**: who the agent is, what success looks like, who it serves.
- [ ] **Right altitude**: specific enough to steer, general enough to leave room for judgment. Avoid brittle if-else rule lists and vague platitudes alike.
- [ ] **Context the model can't infer**: domain facts, user situation, why constraints exist.
- [ ] **Tool guidance**: when to use which tool, in what order, what to do with failures.
- [ ] **Boundaries**: what never to do, what needs confirmation, when to stop and ask.
- [ ] **Done criteria**: how to verify the work before finishing.
- [ ] **Output format**: structure, length, and where final answers go; use structured outputs when code consumes them.
- [ ] **Clear sections**: Markdown headers or XML tags separating instructions, context and data.
- [ ] **A few diverse, canonical examples** rather than an exhaustive list of edge cases.
- [ ] **Stable prefix**: static content first and dynamic content (dates, user data) last, to maximize cache hits.
- [ ] **Version-controlled and evaluated**: every prompt change runs the eval suite.

## Context engineering moves

Details: [context engineering](context-engineering.html).

| Problem | Technique |
|---|---|
| Context fills up on long tasks | **Compaction**: summarize history near the limit; keep decisions, open issues, file paths |
| Old tool outputs clutter the window | **Context editing**: clear stale tool results and keep a stub ("result cleared, re-run to view") |
| Too much data to preload | **Just-in-time retrieval**: keep references (paths, IDs, URLs) and load on demand with tools |
| Agent forgets goals mid-task | **Recitation / structured notes**: maintain a to-do or progress file and re-read it |
| Work spans sessions or context resets | **Progress files + git history** as external memory; an initializer step sets them up |
| Subtask exploration pollutes the main thread | **Subagents** with clean contexts that return condensed summaries |
| Hundreds of tools bloat every call | **Tool search / deferred loading**, or tools as code APIs in a sandbox |
| Skills and procedures too long to always include | **Progressive disclosure**: short descriptions in context, full skill files loaded on use |
| Key facts buried in a long context | Put critical instructions at the start or end; **lost in the middle** is real |
| Cost and latency of repeated prefixes | **Prompt caching** with stable, append-only prefixes; never edit earlier turns |
| Model keeps repeating a failed approach | Keep errors in context (don't hide them); vary few-shot examples to avoid ruts |

## Memory types

Details: [memory](memory.html), [RAG and retrieval](rag-and-retrieval.html).

| Type | Holds | Lives in | Example |
|---|---|---|---|
| Working / short-term | Current task state | Context window | The conversation and recent tool results |
| Episodic | Specific past events | Logs, vector store, files | "Last deploy failed on a missing env var" |
| Semantic | Facts and preferences | DB, knowledge base, vector store | "User prefers metric units" |
| Procedural | How to do things | Weights, system prompt, skill files, code | A deploy runbook skill |
| Parametric | Knowledge from training | Model weights | General world knowledge (up to cutoff) |

Memory ops to design: **write** (what is worth saving, and who decides), **retrieve** (recency, relevance, importance), **update/forget** (contradictions, staleness), **scope** (per user, per project, global). Treat stored memory as untrusted input, since it can be poisoned.

## Stop reasons and how to handle them

| `stop_reason` | Meaning | Handle by |
|---|---|---|
| `end_turn` | Model finished naturally | Return the final text; optionally run a verification step |
| `tool_use` | Model wants tools run | Execute **every** `tool_use` block; return all `tool_result`s (matching `tool_use_id`) in **one** user message; loop |
| `max_tokens` | Output hit the `max_tokens` cap | Treat output as truncated; **never run a truncated tool call**; raise `max_tokens`, stream, or ask for shorter output |
| `pause_turn` | A server-side tool loop paused mid-turn | Append the assistant content and re-send **without** a new user message; cap continuations |
| `refusal` | Model declined for safety reasons | Don't execute that turn's tools; inspect `stop_details`; surface it, rephrase, or use a configured fallback, but don't blindly retry |
| `stop_sequence` | A custom stop sequence was generated | Check `resp.stop_sequence` and continue per your protocol |

Also handle API errors separately: 429 rate limits and 5xx/overloaded errors → retry with exponential backoff and jitter; 400s → fix the request, don't retry.

## Evaluation checklist and pass@k / pass^k

Details: [evaluating agents](evaluating-agents.html), [benchmarks](benchmarks.html), [observability](observability.html).

- [ ] Start early with **20–50 real tasks** drawn from actual failures and usage; grow from there.
- [ ] Each task has an unambiguous success criterion that a domain expert would agree with.
- [ ] Prefer **code-based graders** (tests, state checks); use **LLM judges** with rubrics where needed and calibrate them against human labels.
- [ ] **Grade outcomes**, not exact tool sequences; check trajectories for policy violations and waste.
- [ ] Run **multiple trials** per task; report the mean and variance, not one lucky run.
- [ ] Keep separate suites for **capability** (hard, low pass rate) and **regression** (should stay near 100%).
- [ ] Isolate trials: clean environment, no shared state or leaked answers.
- [ ] **Read transcripts** and do error analysis; label failure modes and count them.
- [ ] Track cost, latency, steps and tokens per task alongside success.
- [ ] Run evals in CI on every prompt, tool or model change.

With per-trial success probability *p* and *k* trials:

| Metric | Question it answers | Formula | p = 0.8, k = 3 |
|---|---|---|---|
| pass@k | Does **at least one** of k attempts succeed? | 1 − (1 − p)^k | 0.992 |
| pass^k | Do **all** k attempts succeed? | p^k | 0.512 |

Unbiased estimators from *n* trials with *c* successes: pass@k = 1 − C(n−c, k) / C(n, k); pass^k = C(c, k) / C(n, k). Use pass@k when a human or verifier can pick the best attempt; use **pass^k for customer-facing reliability**.

## Reliability checklist

Details: [reliability](reliability.html), [deployment](deployment.html).

- [ ] **Budgets** on steps, tokens, wall-clock time and dollars per run.
- [ ] **Retries with exponential backoff + jitter** for transient errors; timeouts on every model and tool call.
- [ ] **Idempotent tools** (or idempotency keys) so retries don't double-charge or double-send.
- [ ] **Tool errors returned to the model** as `is_error` results, so it can self-correct.
- [ ] **Validation** of tool inputs and of final outputs (schemas, tests, business rules).
- [ ] **Loop detection**: same call repeated with no progress → nudge, stop or escalate.
- [ ] **Verification step** before declaring done (run tests, re-read requirements).
- [ ] **Checkpointing / durable execution** for long runs; resume rather than restart.
- [ ] **Fallbacks**: alternate model, simpler workflow, or human handoff.
- [ ] **Compounding math**: per-step reliability r over n steps ≈ rⁿ, so shorten chains and add checkpoints.
- [ ] **Full tracing** of every run (inputs, outputs, tool calls, tokens, latency, cost).

## Cost formulas and levers

Details: [cost and latency](cost-and-latency.html).

**Per call**

```text
cost = (uncached_in × P_in + cache_write × P_in × 1.25 + cache_read × P_in × r + out × P_out) / 1,000,000
```

`P_in`/`P_out` are prices per million tokens. Cache writes cost 1.25× base input for the 5-minute TTL (2× for 1-hour). Cache reads (r) cost about 0.1× base input, and some newer models are cheaper still. Output tokens typically cost several times more than input (5× on Claude models).

**Per agent run**: context grows each turn, so input tokens grow roughly quadratically:

```text
total_input ≈ n × S + T × n(n−1)/2
```

Here *n* is the number of model calls, *S* the static prefix (system prompt + tools) and *T* the tokens added per turn. This is why caching and compaction matter.

**Caching example**: a 50K-token prefix reused across 20 calls costs 1,000K input-token-equivalents uncached. Cached, it costs 1.25 × 50K + 19 × 0.1 × 50K = 157.5K, **about 84% less** on that prefix, and time to first token drops too. With a 5-minute TTL, caching pays off from the first reuse (1.25 + 0.1 = 1.35 vs 2.0).

| Lever | Typical effect | Watch out for |
|---|---|---|
| Prompt caching | Large input savings on repeated prefixes | Any change to the prefix invalidates the cache from that point on |
| Smaller model / routing / cascades | Big savings on easy traffic | Quality on the hard tail; needs evals |
| Lower effort / less thinking | Fewer output tokens, lower latency | Accuracy on hard problems |
| Batch API | 50% discount for async work | Results can take up to 24h |
| Compaction & context editing | Caps context growth | Lost details; cache invalidation |
| Concise tool outputs | Fewer input tokens every later turn | Dropping fields the model needs |
| Workflow instead of agent | Fewer calls, predictable spend | Less flexibility |
| Parallel tool calls | Lower latency (not cost) | Rate limits |

Measure **cost per successful task**, not cost per call.

## Security checklist

Details: [agent security](agent-security.html), [guardrails and sandboxing](guardrails-and-sandboxing.html).

- [ ] **Assume prompt injection will succeed** sometimes. Any text the agent reads (web, email, docs, tool output, memory) can carry instructions.
- [ ] **Break the lethal trifecta**: never give one agent all three of private data access, exposure to untrusted content, and an external communication channel. Removing exfiltration paths is usually easiest.
- [ ] **Least privilege**: minimal tools, scoped and short-lived credentials, read-only by default, per-user authorization enforced in the tool, never by the model.
- [ ] **Human confirmation** for irreversible, financial or external-facing actions, showing exactly what will happen.
- [ ] **Egress control**: network allowlists; block rendering of untrusted URLs and images in output (a common exfiltration channel).
- [ ] **Sandbox code execution** (container or microVM, no host secrets, resource limits).
- [ ] **Design patterns over filters**: plan-then-execute, dual LLM / quarantined LLM, CaMeL-style data-flow control. Classifiers and spotlighting help, but they are not guarantees.
- [ ] **Vet MCP servers and tools**: pin versions, review descriptions for hidden instructions, watch for changes after approval.
- [ ] **Treat model output as untrusted** before it reaches shells, SQL, HTML or other agents.
- [ ] **Log and audit** every tool call; alert on anomalies; red-team with injection suites such as AgentDojo.

## Production readiness checklist

Details: [deployment](deployment.html), [observability](observability.html), [human in the loop](human-in-the-loop.html).

- [ ] Clear scope, success metric and **owner**; a simpler non-agent baseline measured for comparison.
- [ ] **Eval suite** passing at agreed thresholds (including pass^k for consistency) and wired into CI.
- [ ] **Tracing and dashboards**: success rate, cost per task, latency (p50/p95), step counts, error and refusal rates.
- [ ] **Budgets, rate-limit handling, timeouts and fallbacks** configured and tested.
- [ ] **Security review** done: trifecta analysis, permissions, sandbox, egress, secrets handling.
- [ ] **Human escalation path** and approval gates for risky actions.
- [ ] **Graceful failure UX**: the agent says what it couldn't do rather than inventing success.
- [ ] **Staged rollout** (internal → beta → GA) with kill switch and the ability to roll back prompts and models.
- [ ] **Online evaluation**: sampled transcript review, user feedback, drift monitoring.
- [ ] **Versioned** prompts, tools, models and configs, so every run is reproducible.
- [ ] Data retention, privacy and compliance requirements reviewed.

## Key numbers to remember

| Number | What it means |
|---|---|
| **0.95²⁰ ≈ 36%** | 20 steps at 95% per-step reliability succeed end-to-end only about a third of the time |
| **0.9⁸ ≈ 43%** | pass^8 for a 90%-reliable agent; consistency is much harder than capability |
| **1 token ≈ 4 characters ≈ ¾ of an English word** | Rule of thumb for estimating token counts (varies by tokenizer and language) |
| **1.25× / 2× / ~0.1×** | Cache write (5-minute TTL) / cache write (1-hour TTL) / cache read, relative to base input price |
| **5 minutes** | Default prompt-cache TTL, refreshed on each hit |
| **50%** | Typical Batch API discount, for asynchronous jobs |
| **~15×** | Tokens used by Anthropic's multi-agent research system relative to chat (agents alone ~4×) |
| **~7 months** | Historical doubling time of METR's 50% task time horizon (2019 to early 2025) |
| **14 modes, 3 categories** | MAST taxonomy of multi-agent failures: specification, inter-agent misalignment, verification |
| **~100:1** | Input-to-output token ratio Manus reports for its agent; input (and caching) dominates agent cost |
| **500** | Human-validated tasks in SWE-bench Verified |
| **Nov 2024 / Apr 2025** | MCP launched (Anthropic) / A2A announced (Google) |
