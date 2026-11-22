---
title: "Hands-On Projects"
description: "Twelve graded builds, from your first tool call to a secured, evaluated multi-agent system. Reading teaches you the ideas; building teaches you the craft."
---

You can read every lesson in this course and still not *know* how to build agents. The knowledge that
matters most — how a model actually behaves with your tools, where loops go wrong, what a good trace
looks like, how much a run really costs — only comes from building. These projects are sequenced so
each one adds a few new skills on top of the last. Do them in order if you're new; pick and choose if
you're not.

Every project lists the **skills** it practices, the **lessons** it draws on, **milestones** to work
through, **done-when** criteria so you know you've finished, and **stretch goals** for going further.

> [!TIP] How to get the most out of these
> - **Keep a build log.** For every project, write down what surprised you. Those notes are the real curriculum.
> - **Read your traces.** Print every model call and tool result while you develop. Most bugs are obvious once you look.
> - **Start with the strongest model, then optimize.** Get it working first; make it cheap and fast second.
> - **Write 5–10 test tasks before you start tuning.** Even a tiny eval set beats vibes.

## Level 1 — Foundations

### Project 1: Your first tool-using agent

**Build** a command-line assistant that can answer questions using two tools: a calculator and a
weather lookup (use a free weather API, or a stub that returns canned data).

- **Skills:** tool definitions, the tool-use cycle, parsing `tool_use` blocks, returning `tool_result`s
- **Lessons:** [Tool Use & Function Calling](tool-use.html), [The Agent Loop](the-agent-loop.html)

**Milestones**
1. Make a single API call and print the response.
2. Add the calculator tool. Ask "What is 17.5% of 2,340?" and handle the `tool_use` response by hand.
3. Wrap it in a loop that continues while `stop_reason == "tool_use"`.
4. Add the weather tool. Ask a question that needs *both* tools ("Is it warmer in Lisbon than Oslo, and by how many degrees?").
5. Return tool errors with `is_error: true` (e.g., unknown city) and watch the model recover.

**Done when:** the agent answers multi-tool questions correctly, handles a failing tool gracefully,
and never crashes on unexpected `stop_reason` values.

**Stretch:** print a token and cost summary after each answer; add parallel tool calls and confirm
you send all results back in a single message.

### Project 2: The loop, hardened

**Build** a reusable `run_agent(task, tools)` function you'll use for every later project.

- **Skills:** stop conditions, budgets, loop detection, error handling, retries, tracing
- **Lessons:** [The Agent Loop](the-agent-loop.html), [Reliability & Durable Execution](reliability.html), [Observability & Debugging](observability.html)

**Milestones**
1. Add a maximum-steps guard and a token budget; return a clear "budget exhausted" result.
2. Retry rate-limit and overload errors with exponential backoff and jitter; don't retry 400s.
3. Detect repetition (the same tool called with the same arguments three times) and inject a nudge.
4. Write every step as a JSON line to a trace file: model input size, output, tool calls, results, latency, tokens.
5. Write a tiny script that pretty-prints a trace file.

**Done when:** you can kill your network mid-run and the agent fails cleanly; a looping task stops on
its own; every run leaves a readable trace.

**Stretch:** make runs resumable from a checkpoint file without re-executing completed side effects.

## Level 2 — Useful agents

### Project 3: Research assistant with citations

**Build** an agent that answers research questions using web search and page fetching, and cites
every claim.

- **Skills:** server-side tools, source triangulation, citation discipline, report structure
- **Lessons:** [Deep Research Agents](research-agents.html), [Retrieval & Agentic RAG](rag-and-retrieval.html), [Prompt Engineering for Agents](prompting-for-agents.html)

**Milestones**
1. Use the web search server tool to answer a factual question; print the sources it used.
2. Write a system prompt that requires a citation for every factual sentence and forbids uncited claims.
3. Add a "plan first" step: the agent lists 3–6 sub-questions before searching.
4. Add a verification pass: a second call checks each claim against its cited source and flags mismatches.

**Done when:** on 10 questions you've written answers for, ≥ 8 reports are correct and every
citation actually supports its claim (check by hand — this is your first eval).

**Stretch:** handle conflicting sources explicitly ("Source A says X; Source B says Y because…").

### Project 4: Ask-your-codebase agent

**Build** an agent that answers questions about a real repository using only `list_files`, `grep` and
`read_file` tools — no vector database.

- **Skills:** agentic search, tool design (pagination, truncation, helpful errors), context management
- **Lessons:** [Designing Great Tools](designing-tools.html), [Context Engineering](context-engineering.html), [Coding Agents](coding-agents.html)

**Milestones**
1. Implement the three tools with path sandboxing and output truncation ("…412 more lines; use offset=").
2. Ask "Where is authentication handled, and what happens when a token expires?" on a repo you know.
3. Improve tool descriptions and error messages based on what you see in traces. Re-run and compare.
4. Add a `find_symbol` tool and measure whether it reduces steps per question.

**Done when:** it answers 8/10 of your questions about the repo correctly with file and line references.

**Stretch:** compare against an embeddings-based retrieval version on the same questions — cost,
latency and accuracy.

### Project 5: A coding agent that fixes failing tests

**Build** an agent that, given a repo and a failing test, edits code until the tests pass — inside a
container.

- **Skills:** edit tools (exact string replace), running commands safely, the verify loop, sandboxing
- **Lessons:** [Build an Agent From Scratch](build-agent-from-scratch.html), [Coding Agents](coding-agents.html), [Guardrails, Permissions & Sandboxing](guardrails-and-sandboxing.html)

**Milestones**
1. Run all commands in a Docker container with no network and the repo mounted.
2. Implement `read_file`, `edit_file` (old/new string replace, fail if not unique) and `run_command` (timeout, output truncation).
3. Prompt the agent to reproduce the failure first, then fix, then run the *full* test suite.
4. Forbid edits to test files and enforce it in the tool, not just the prompt.

**Done when:** it fixes 5 seeded bugs of varying difficulty without touching tests, and you've read
every trace.

**Stretch:** add a human approval gate that shows a diff before each edit; run two agents in parallel
in separate git worktrees.

### Project 6: Your own MCP server

**Build** an MCP server that exposes a data source you care about (notes, a SQLite database, a
calendar export, an internal API) and use it from an MCP-capable client.

- **Skills:** MCP primitives (tools, resources, prompts), transports, tool design for unknown clients
- **Lessons:** [Protocols: MCP, A2A & Interoperability](protocols-mcp-a2a.html), [Designing Great Tools](designing-tools.html)

**Milestones**
1. Expose one read-only tool and one resource over stdio; connect it to a desktop or CLI client.
2. Add a write tool and require confirmation for it in the client.
3. Write tool descriptions as if for a stranger — then test them by asking an agent to use the server cold.

**Done when:** a fresh agent session can accomplish three realistic tasks with your server with no
extra instructions.

**Stretch:** serve it over Streamable HTTP with authentication; audit it against the security risks in
the lesson (over-broad permissions, injection via returned data).

## Level 3 — Production skills

### Project 7: Customer-support agent with a real eval

**Build** a support agent for a fictional store with tools (`lookup_order`, `issue_refund`,
`update_address`) and a written policy (refund window, identity checks, escalation rules).

- **Skills:** policy-following prompts, approval gates, simulated users, pass^k evaluation
- **Lessons:** [Customer-Facing & Voice Agents](conversational-voice-agents.html), [Evaluating Agents](evaluating-agents.html), [Human-in-the-Loop & Agent UX](human-in-the-loop.html)

**Milestones**
1. Write the policy and 20 test scenarios, each with an expected end state in a mock database.
2. Build a simulated customer (a second model with a persona and a hidden goal).
3. Grade by checking the final database state, not the transcript wording.
4. Run each scenario 4 times and report pass@1 and pass^4.

**Done when:** you have a reproducible eval run that prints a score table, and you've improved pass^4
at least once by changing a prompt or tool — with evidence.

**Stretch:** add an LLM-judge rubric for tone and calibrate it against 30 of your own ratings.

### Project 8: Multi-agent research system

**Build** an orchestrator that splits a broad research question into parallel sub-investigations run
by subagents with isolated contexts, then synthesizes a cited report.

- **Skills:** delegation prompts, parallelism, context isolation, synthesis, cost accounting
- **Lessons:** [Multi-Agent Systems](multi-agent-systems.html), [Workflow Patterns](workflow-patterns.html), [Cost & Latency Optimization](cost-and-latency.html)

**Milestones**
1. Have the lead agent produce a plan of 3–5 subtasks, each with an objective, output format and boundaries.
2. Run subagents concurrently; each returns a compact summary with sources.
3. Compare quality, latency and total tokens against your single-agent research assistant from Project 3.

**Done when:** you can state, with numbers from your own runs, when the multi-agent version is worth
its extra cost and when it isn't.

**Stretch:** use a cheaper model for subagents and measure the quality impact.

### Project 9: Observability and cost dashboard

**Build** tracing and a simple dashboard for one of your earlier agents.

- **Skills:** spans and traces, key metrics, prompt caching, cost per task
- **Lessons:** [Observability & Debugging](observability.html), [Cost & Latency Optimization](cost-and-latency.html), [Deploying & Operating Agents](deployment.html)

**Milestones**
1. Emit spans for every model call and tool call (OpenTelemetry or JSONL).
2. Build a page or notebook showing task success, steps per task, tool error rate, p95 latency and cost per *completed* task.
3. Turn on prompt caching for the system prompt and tools; verify cache hits in the usage fields and measure the savings.

**Done when:** you can answer "what does one successful task cost, and where does the time go?" from
your dashboard alone.

**Stretch:** add an alert when cost per task or tool error rate jumps above a threshold.

## Level 4 — Mastery

### Project 10: Red-team your own agent

**Build** a prompt-injection test suite against your research assistant or support agent, then
defend it.

- **Skills:** threat modeling, indirect injection, the lethal trifecta, layered defenses
- **Lessons:** [Agent Security & Prompt Injection](agent-security.html), [Guardrails, Permissions & Sandboxing](guardrails-and-sandboxing.html)

**Milestones**
1. Map your agent's trust boundaries: which inputs are untrusted, which tools touch private data, which can send data out.
2. Write 15 attacks (hidden text in pages, malicious tool outputs, poisoned documents) with a measurable "attack succeeded" condition.
3. Measure the attack success rate. Then add defenses one at a time — least privilege, egress limits, confirmations, a quarantined reader — and re-measure.

**Done when:** you have a before/after table and can explain which defense removed which class of
attack, and which attacks remain possible.

**Stretch:** implement the dual-LLM or plan-then-execute pattern and compare usefulness, not just safety.

### Project 11: Long-running agent with memory

**Build** an agent that works on a multi-session project (e.g., a personal reading tracker or a
small app) and picks up where it left off.

- **Skills:** progress files, structured notes, compaction, memory hygiene
- **Lessons:** [Memory Systems](memory.html), [Context Engineering](context-engineering.html), [Self-Improving & Open-Ended Agents](self-improving-agents.html)

**Milestones**
1. Give the agent a `notes/` directory and instructions to maintain a progress file and a lessons-learned file.
2. Run five separate sessions on the same project; inspect what it chose to remember.
3. Add a consolidation step that prunes stale or contradictory notes.

**Done when:** session five starts productive work within its first few actions, guided by its own notes.

**Stretch:** inject a false "memory" and see whether the agent detects and corrects it.

### Project 12: Capstone — ship it

**Build** one agent that solves a real problem for you or someone you know, and take it all the way
to production quality.

- **Lessons:** all of them — especially [Agents vs. Workflows](when-to-use-agents.html) before you start.

**Checklist**
- [ ] Justified the agent (vs. a workflow) using the decision criteria
- [ ] An eval set of at least 30 tasks, run before every change
- [ ] Tracing, cost per task, and a budget per run
- [ ] Least-privilege tools, sandboxed execution, confirmations for irreversible actions
- [ ] A written threat model and an injection test suite
- [ ] Retries, timeouts and graceful failure messages
- [ ] Pinned model ID and versioned prompts
- [ ] A one-page write-up: what works, what doesn't, what it costs, what you'd do next

**Done when:** someone other than you uses it for a week, and you've fixed what they found.

## Where to share and get feedback

Write up what you build. A short post with a trace, a number and a lesson learned ("caching cut our cost
per task by 70%"; "the model kept editing tests until we enforced it in the tool") is valuable to others
and clarifies your own thinking. When you're ready, revisit the [practice exam](exam.html) and the
[course review](review.html) — you'll be surprised how differently the material reads once you've
built things.
