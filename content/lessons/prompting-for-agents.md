---
title: "Prompt Engineering for Agents"
description: "How to write system prompts that make agents act well over hundreds of steps: structure, altitude, autonomy, long-horizon state, and testing prompts like code."
duration: 40
level: intermediate
objectives:
  - Write a complete agent system prompt covering role, context, tools strategy, constraints, ask-vs-act policy and communication format
  - Pitch instructions at the right altitude and explain the reasons behind constraints
  - Use XML tags, examples and long-horizon scaffolds (progress files, todo lists) without over-constraining a capable model
  - Recognize dated prompting patterns that degrade modern models and remove them safely
  - Version, test and iterate on prompts against an eval suite, including with meta-prompting
prerequisites: [the-agent-loop, llm-fundamentals]
tags: [prompting, system-prompts, agents, evals, long-horizon]
---

Give the same model the same tools and the same bug report, and swap only the system prompt. With the first prompt, the agent reads one file, guesses at a fix, sees a failing test and asks you what to do. With the second, it reproduces the bug, reads the surrounding code, fixes the root cause, runs the full test suite, notices it broke an unrelated snapshot test, fixes that too, and reports back in three sentences. Nothing about the model changed. What changed was the **system prompt**: the standing instructions that frame every step the agent takes.

Prompting a chatbot is about getting one good answer. Prompting an **agent** is closer to writing a job description, an onboarding document and an operating manual at once, for a colleague who will read it once and then work alone for hundreds of steps, with nobody to ask. Mistakes compound: a vague instruction that produces a slightly-off chat answer can produce a deleted directory or a refund the business never authorized when an agent acts on it.

This lesson covers what goes into an agent prompt, how specific to be, how to steer autonomy and persistence, how to prompt for tasks that outlive a single context window, and how to treat prompts as versioned, tested code. It ends with two complete, annotated system prompts: one for a customer-support agent and one for a coding agent.

## Why Agent Prompts Are Different

| | Chat prompt | Agent system prompt |
|---|---|---|
| Lifetime | One exchange | Read on every step of a long run |
| Output | Text a human reads | Actions with side effects, plus text |
| Feedback | Human reviews each answer | Agent reviews its own tool results |
| Ambiguity | Model can ask, cheaply | Asking may block an unattended run |
| Failure cost | A bad paragraph | Compounding errors across steps (see [when to use agents](when-to-use-agents.html)) |

A useful mental model, which Anthropic's own prompting guidance uses, is a **brilliant new hire with zero context**. They are fast, knowledgeable and eager, but they don't know your customers, your codebase's conventions, which actions are reversible, or what "done" means here. Anything that lives only in your head, they will fill with safe, generic defaults. A practical test: hand your prompt to a smart colleague who has never seen the project. If they would have to ask questions before starting, the agent will too — or worse, it will guess.

> [!KEY] The big idea
> A system prompt's job is to transfer the context only you have: the goal, the audience, the environment, the quality bar, the constraints and *why* they exist. The model already knows how to be helpful, thorough and careful. It does not know your situation.

## Anatomy of an Agent System Prompt

Most strong agent prompts contain the same handful of parts. Not every agent needs every part, and the order is flexible, but checking a draft against this list catches most gaps.

| Part | Answers | Example line |
|---|---|---|
| **Role & goal** | Who are you, what outcome matters? | "You resolve order issues for Trailhead Gear customers by chat." |
| **Context** | Who are the users? What environment, data, date? | "Customers are mostly hikers ordering online; many write from their phones." |
| **Tool strategy** | How do the tools fit together for this job? | "Look up the order before discussing it; never rely on what the customer says the order contains." |
| **Constraints & policy** | What's off-limits, and why? | "Refunds over $200 need a human, because finance audits those individually." |
| **Ask vs act** | When to proceed, when to check in? | "Proceed with reversible steps; confirm before anything that charges or cancels." |
| **Communication** | Tone, format, length, what to report | "Lead with the outcome. Plain text, no markdown — the chat widget doesn't render it." |
| **Done criteria** | When is the task finished? | "Done means the customer's issue is resolved or handed off with a summary." |

Here is how those parts sit in the full input the model sees on every step. The system prompt is only one layer; tool descriptions, the conversation and tool results all compete for the model's attention.

```mermaid
flowchart TD
    S["System prompt: role, context, policy"] --> M["Model (each step)"]
    T["Tool definitions: contracts"] --> M
    U["User request"] --> M
    R["Tool results so far"] --> M
    M --> A["Next action or final answer"]
    A -->|"tool call"| R
```

### Explain the why

The single highest-leverage habit is attaching a reason to each constraint. Compare:

- "NEVER use ellipses."
- "Your reply will be read aloud by a text-to-speech engine, so never use ellipses — it can't pronounce them."

The second version lets the model **generalize**: it will also avoid emoji, tables and URLs that a speech engine would mangle, none of which you listed. A bare rule covers the cases you thought of; a rule with its reason covers the ones you didn't, and helps the model weigh conflicting rules sensibly.

### Find the right altitude

Instructions can fail in two opposite directions, a framing Anthropic's context-engineering guidance calls finding the **right altitude**:

- **Too low (over-specified):** hardcoded if-then logic, scripts of exact steps, enumerations of every edge case. It's brittle — the world presents a case you didn't script and the agent either follows the script into a wall or freezes.
- **Too high (vague):** "Be helpful and handle customer issues well." It assumes shared context the model doesn't have, so the model fills the gap with generic behavior.

| Altitude | Instruction for handling a late delivery |
|---|---|
| Too low | "STEP 1: Say sorry. STEP 2: Call get_order. STEP 3: If days_late > 5, offer 15% coupon. STEP 4: …" |
| Too high | "Handle delivery problems appropriately." |
| Right | "Late deliveries are our most common complaint and the moment customers are most likely to churn. Check the carrier status first so you're working from facts. You may offer a goodwill credit of up to 15% of the order; use it when we caused the delay, not for weather or carrier issues the customer was already warned about." |

The right-altitude version states the goal (retain the customer), the facts to gather, the bounds of authority, and the principle for using it. It leaves the conversation itself to the model.

> [!TIP] Rule of thumb
> Match specificity to fragility. Use prose heuristics where many paths are fine (how to talk to a customer). Use exact, step-by-step instructions only where exactly one sequence is safe (a database migration, an authentication flow, a compliance disclosure).

## Structure: XML Tags and Sections

Long agent prompts mix instructions, reference material, policies and examples. Delimiting them helps the model keep track of what is what. **XML tags** such as `<role>`, `<policies>` or `<customer_record>` are a common, well-supported convention, particularly with Claude models; the two complete prompts at the end of this lesson use them throughout.

Tags make boundaries unambiguous, let you refer to sections by name, and keep injected data (a retrieved document, a customer record) separate from instructions. Markdown headings work too; consistency and descriptive names matter more than the syntax.

A few structural guidelines that hold up across models:

- **Put long reference material before the instructions that use it**, and the specific task or question near the end. Models attend well to the end of a long context.
- **Use prose for behavior, structure for reference data.** A wall of bullets flattens priorities and separates rules from their reasons; tables and lists are great for catalogs, price limits and status codes.
- **Tags are not a security boundary.** Wrapping untrusted text in `<customer_email>` helps the model treat it as data, but a determined prompt injection can still work. Defend with permissions and sandboxing, not formatting (see [agent security](agent-security.html)).

## Examples and Few-Shot Prompting

Examples are the strongest signal in a prompt. Models match their length, tone, structure and even their specific values. That makes them powerful for pinning a format — and dangerous for agents.

Common failure modes when you add examples to an agent prompt:

1. **Trajectory copying.** Show one example where the agent calls `search_orders` then `get_order` then `issue_refund`, and the agent starts following that exact sequence even when the customer only wanted tracking info.
2. **Value leakage.** The example uses order `#A-10293`; a confused agent later looks up `#A-10293` for a real customer.
3. **Length and tone anchoring.** One terse gold answer makes every answer terse, including ones that needed detail.
4. **Frozen behavior.** Examples written to correct an older model's habits lock those corrections in long after the new model stopped needing them.

What works better:

- Use **several deliberately varied** examples rather than one, and label them as illustrative ("These show the tone we want; the specifics will differ").
- Prefer a handful of **diverse, canonical** examples to an exhaustive list of edge cases. A laundry list teaches the model to pattern-match against your list; a few good examples teach it the principle.
- Use examples mainly for things that are genuinely **format-sensitive** (a ticket summary a downstream parser reads, a commit message convention). For judgment the model already has, describe the goal instead.
- If you need guaranteed structure, use [structured outputs](structured-outputs.html) instead of trying to coax it via examples.

## Steering Autonomy, Persistence and Initiative

Every agent prompt implicitly answers a question: **when should the agent act on its own, and when should it stop and check in?** Get it wrong in one direction and the agent nags the user for permission to read a file; in the other, it emails a customer a draft you never approved.

### When to ask vs act

Write the policy in terms of properties of actions, not a list of specific actions, so it generalizes:

- **Reversibility.** Reading, searching and drafting are freely reversible. Sending, deleting, paying and deploying are not.
- **Blast radius.** Who else is affected if this is wrong? A local file vs a shared production database.
- **Ambiguity.** Is the user's intent clear, or are there two reasonable interpretations with different outcomes?
- **Who is watching.** In an interactive session, a quick question is cheap. In an unattended pipeline, a question blocks the run until someone notices.

A compact version you can adapt:

```text
<autonomy>
You are working unattended; nobody will see questions until the run ends.
For reversible steps that follow from the request (reading, searching,
editing files in the working tree, running tests), proceed without asking.
Stop and report instead of acting when a step is destructive or hard to
undo (deleting data, force-pushing, sending messages to people), or when
the request has two plausible readings that lead to different results.
When you stop, say exactly what you need decided.
</autonomy>
```

Pair autonomy with **scope**: capable agents sometimes "help" by refactoring code or adding features nobody asked for. A line like "Do what was asked. If you see a worthwhile improvement outside that scope, mention it at the end rather than doing it" keeps initiative pointed in the right direction. The deeper design question of where humans belong in the loop is covered in [human-in-the-loop](human-in-the-loop.html).

### Persistence

Earlier models often quit early, ending a turn with "I'll now run the tests" without running them. Prompting guides from that era recommended explicit reminders; OpenAI's GPT-4.1 guide, for example, suggested telling agents to keep going until the query is fully resolved, use tools rather than guess, and plan between calls.

Current frontier models are much more proactive by default, and that changes the advice:

- **Generic pressure is now counterproductive.** "Be thorough. Do NOT stop early. NEVER be lazy." tends to produce over-verification, over-long runs and anxious, hedging output. Remove such lines first and re-test.
- **Specific operating facts still help.** "You are running in a CI job; nobody can answer questions" is information, not pressure, and it legitimately changes the right behavior.
- **A definition of done helps most.** "The task is complete when the new endpoint is implemented, its tests pass and the full suite passes" gives the agent a clear stopping criterion in both directions: don't stop before, don't keep polishing after.

If a specific model still stops early in your harness (some do at low effort settings or deep into long runs), add a targeted fix and verify it on your evals. For example: "Before ending your turn, check whether your last paragraph is a plan or a promise about work you haven't done. If it is, do that work now."

> [!WARNING] Pressure language over-triggers modern models
> ALL-CAPS "CRITICAL" and "MUST" were tuned for older models that under-followed instructions. Current models are highly responsive to the system prompt, so the same emphasis now causes over-application — a tool marked "you MUST use this" gets called when it's useless. When several instructions are all "critical," the marker carries no information. State the constraint plainly, with its reason.

## Planning, Reflection and Verification

There is a long tradition of prompts that elicit reasoning: "think step by step," `<scratchpad>` tags, "plan before you act," "reflect on the tool result before continuing." These techniques were important when models only reasoned if you made room for it in the visible output. (The research behind them, from chain-of-thought to ReAct and Reflexion, is covered in [reasoning and planning](reasoning-and-planning.html).)

With models that have native, trained-in reasoning — **extended or adaptive thinking**, including thinking interleaved between tool calls — much of that prose is redundant. Worse, it can cause over-planning on easy steps. The modern division of labor:

| Want | Old approach | Modern approach |
|---|---|---|
| More/less deliberation | "Think step by step" / "don't overthink" | Configure it: e.g., `thinking={"type": "adaptive"}` plus `output_config={"effort": "high"}` |
| See the reasoning | Ask for reasoning in the output | Read the thinking blocks the API returns, or ask for a brief explanation of the answer |
| A plan a human can review | — | Ask for a plan *as a deliverable* (a "plan mode"), then execute after approval |
| Self-checking | "Reflect on your answer" | Say *how* to verify: run the tests, re-read the spec, diff against the requirements |

The last row is where prompts still add real value. The model knows how to double-check; it doesn't know that in your repository `make check` runs the linters and type checker, or that support answers must cite a policy section. **Tell it how success is verified, not that it should be careful.**

## Prompting for Long-Horizon Tasks

Some tasks take hours and outlive a single context window: migrating a codebase, building an app feature by feature. Each new context window (after compaction, a crash or a restart) begins with partial amnesia, so prompting for these tasks is largely about making the agent **leave itself good notes**. The mechanics of compaction and context budgets belong to [context engineering](context-engineering.html) and [memory](memory.html); here we focus on what to put in the prompt.

Three scaffolds recur:

1. **A todo list.** For multi-step work within a session, ask the agent to maintain an explicit checklist (many coding agents expose a dedicated todo tool for this). It keeps the plan visible to the agent and the user, and makes skipped steps obvious.
2. **A progress file.** A plain-text file (for example `PROGRESS.md`) the agent updates at milestones: what's done, what's in flight, what's broken, what's next. A fresh session reads it first.
3. **Structured state plus checkpoints.** A machine-readable list of requirements with a pass/fail status (JSON works well because the model is less inclined to rewrite it casually than prose), and version-control commits at each working milestone so the agent can bisect or revert.

Anthropic's write-up on harnesses for long-running agents describes this pattern: a first session sets up the environment, a feature list and a progress log; each later session reads the log and recent commits, completes and verifies one item, commits, and updates the log.

A prompt section for this might read:

```text
<long_running_work>
This task will span multiple sessions, and your context may be reset.
At the start of each session: read PROGRESS.md and `git log --oneline -20`
to see where things stand, then run the test suite before changing anything.
Work on one item from features.json at a time. Mark an item passing only
after you have verified it end to end, never by editing the test.
At each milestone, commit with a descriptive message and update PROGRESS.md
with: what you finished, what you tried that didn't work, and the next step.
Write notes for a capable engineer who has never seen this session.
</long_running_work>
```

And the resulting file, a few sessions in:

```text
PROGRESS.md
DONE:        Auth signup/login/logout (features 1-4), verified via Playwright
IN PROGRESS: Feature 5 (password reset): email sends; expiry not enforced yet
DEAD ENDS:   Tried storing tokens in Redis; test env has no Redis. Using a
             Postgres table instead.
NEXT:        Enforce 30-min expiry in reset_password(); test expired token
```

Notice the dead-ends entry. Without it, a fresh session will cheerfully rediscover and retry the Redis approach.

## Tools in the Prompt vs Tool Descriptions

Agents get instructions from two places: the system prompt and each tool's definition. Deciding what goes where avoids duplication and contradictions.

| Belongs in the **tool description** | Belongs in the **system prompt** |
|---|---|
| What the tool does and doesn't return | The task's goal and domain context |
| When to use it, and when not to | Strategy that spans tools ("verify facts from records, not from the customer's message") |
| What each parameter means, valid formats, limits | Policies: authority limits, escalation rules, compliance |
| Error behavior, pagination, side effects | Ask-vs-act policy, communication style, done criteria |

Two guidelines follow from this split:

- **Keep the tool contract in the tool.** If the fact that `search_orders` only covers the last 18 months lives in the system prompt, it gets lost when someone reuses the tool in another agent. Tool descriptions are prompts too, and the next lesson, [designing tools](designing-tools.html), is about writing them well.
- **Avoid hard-coding tool names in the system prompt where you can.** Toolsets change: tools get renamed, disabled or loaded on demand, and "always call `lookup_customer_v2` first" dangles when that tool is gone. Describe the strategy ("identify the customer before discussing their account") and let the descriptions handle the mapping.

## Avoiding Over-Prescription

Prompts accumulate. Each incident adds a line — a booster here, a prohibition there — and nobody removes the lines when the model that needed them is retired. With modern, highly steerable models, that accumulated text isn't just wasted tokens; specific outdated instructions actively degrade behavior.

Patterns worth auditing for:

| Pattern | Why it hurts now | Better |
|---|---|---|
| `CRITICAL: You MUST…` scattered throughout | Over-triggering; anxious, hedged output | Plain statement with a reason |
| `STEP 1… STEP 2…` for judgment tasks | The model's own plan usually beats a script; scripts break on unscripted cases | Goal, constraints, how to verify |
| Long "Do not X / Never Y / Avoid Z" lists | Naming an unlikely failure can anchor the model toward it | State the desired behavior positively; keep prohibitions that encode real policy |
| "Think step by step" / scratchpad tags | Redundant with native thinking; causes over-planning | Thinking/effort configuration |
| Hard word caps ("at most 50 words") | Starves reasoning and detail where needed | "Answer only what was asked; lead with the outcome" |
| "Only use tools when strictly necessary" | Followed literally — the agent answers from memory instead of checking | Say *when* to check a source |
| "You are a helpful assistant" as the only context | Identity substitutes for real context | One-line role plus audience, product and quality bar |

The discriminator for keeping a line is **provenance**: which failure, on which model, does this prevent, and does it still reproduce? A prohibition encoding a real business constraint ("never promise delivery dates; carriers don't guarantee them") stays forever. A prohibition against a habit of a model you no longer use goes. And note the asymmetry: context is never cruft. Cutting audience, environment and reasons to make a prompt "shorter" deletes exactly the highest-value words.

> [!NOTE]
> This works in both directions. Moving to a new model sometimes means *adding* guidance for its particular tendencies. The goal is fit, not brevity.

## Testing, Versioning and Meta-Prompting

A system prompt is code. It determines production behavior, it has bugs, and changes to it cause regressions. Treat it accordingly.

**Version it.** Keep prompts in files under version control, and record which model each version was tuned for — moving to a new model is a prompt change too. Keep the system prompt stable within a session: it's the front of the cache prefix, so editing it mid-run invalidates [prompt caching](cost-and-latency.html); dynamic values like timestamps belong later in the context.

**Test it against evals.** Build a set of representative tasks — common cases, hard cases, and every incident that prompted a prompt change — and run every prompt revision against them (see [evaluating agents](evaluating-agents.html)). Agent runs are stochastic, so look at pass rates over several trials, not a single run.

**Read transcripts.** Aggregate scores tell you *that* something regressed; transcripts tell you *why*. Most prompt fixes come from noticing a specific misunderstanding in a trace.

```mermaid
flowchart LR
    A["Draft prompt"] --> B["Run eval suite (several trials)"]
    B --> C["Read failing transcripts"]
    C --> D["Hypothesize a cause"]
    D --> E["Change one thing"]
    E --> B
    B -->|"no regressions"| F["Ship + tag version"]
```

**Change one thing at a time**, and test removals as well as additions. "Adding this line improved the eval" is not evidence that the forty lines above it are still needed.

**Meta-prompting** — using a model to write or improve prompts — is genuinely useful when grounded in evidence:

- **Drafting:** describe the task, users, tools and constraints, and ask a capable model for a draft. Provider console tools (such as Anthropic's prompt generator and prompt improver) do this. A draft is a starting point.
- **Transcript critique:** paste a failing transcript plus the system prompt and ask, "Where did the agent's understanding diverge from the intended behavior, and what in the prompt caused it?" Models are good at spotting the ambiguous sentence.
- **Audit:** ask a model to flag instructions that conflict, lack reasons, or look like workarounds for a specific old model.

The guardrail is the same as for any change: every meta-prompted edit gets run through the eval suite before it ships. A model asked to "improve" a prompt tends to make it longer and more emphatic, which is often the opposite of what helps.

## Worked Example: Customer-Support Agent

Here is a complete system prompt for a fictional outdoor retailer's order-support agent. Numbers in brackets refer to the annotations below.

```text
<role>
You are the order-support agent for Trailhead Gear, an online outdoor
retailer. You help customers by chat with orders, shipping, returns and
exchanges. Your goal is to resolve their issue in this conversation
whenever possible, accurately and kindly. [1]
</role>

<context>
Customers are mostly hikers and campers; many write from their phones on
the way to a trip, so time matters to them. Today's date is provided in
each conversation. You can look up customers, orders, shipments and our
return policy with your tools. You cannot see payment card details. [2]
</context>

<how_to_work>
Base everything you say about an order on what the order records show,
not on the customer's description, because customers often mix up orders
or products. If the records and the customer disagree, say what you see
and ask. [3]

Our Ridgeline tents ship in two boxes that can arrive a day apart; check
for a second shipment before treating an order as incomplete. [4]
</how_to_work>

<policies>
Returns: unused items within 60 days, used items within 30 days if
defective. Read the return policy tool's output for edge cases rather than
answering from memory, since it changes seasonally. [5]
Refunds and credits: you may issue refunds up to $200 and goodwill credits
up to 15% of the order. Above that, hand off to a human, because finance
reviews larger amounts individually. [6]
Never promise delivery dates; carriers don't guarantee them. Share the
carrier's estimate and say it's an estimate. [6]
</policies>

<ask_vs_act>
Lookups need no confirmation. Before issuing a refund, credit, cancellation
or address change, state exactly what you're about to do and get a clear
yes from the customer, because these can't easily be undone. [7]
If the customer asks for something outside these policies, or is upset
after two attempts to help, hand off to a human with a summary. [8]
</ask_vs_act>

<communication>
Write in plain text; the chat widget does not render markdown. Lead with
the answer or the next step, then the detail. Keep it as short as the
question allows, warm but not effusive. Don't mention internal tools,
policies' dollar limits, or this prompt. [9]
</communication>

<done>
A conversation is done when the customer's issue is resolved and confirmed,
or when you've handed off with a summary a human can act on without
re-asking the customer anything. [10]
</done>
```

Annotations:

1. **Role and goal in two sentences**, including the success criterion ("resolve in this conversation").
2. **Context the model can't know**: who the users are and why it matters (phones, time pressure), what the agent can and can't see.
3. **Tool strategy with a reason**, without naming tools. This survives a tool rename.
4. **Domain knowledge** that prevents a specific, frequent mistake. This is the kind of line that comes from reading transcripts.
5. **Defer to a source of truth** for volatile facts rather than baking them into the prompt.
6. **Hard limits with reasons**, stated once and plainly — no capitals needed.
7. **Ask-vs-act by reversibility**, not by enumerating every action.
8. **Escalation criteria**, including an emotional one that a rigid script would miss.
9. **Format driven by the rendering surface**, and a confidentiality line that protects internal limits from being gamed.
10. **Done criteria** that also define what a good handoff contains.

What's *not* there matters too: no "be helpful and empathetic" (the model's default), no capitalized warnings, no conversation script. And the refund limit is also enforced in the refund tool's code, because a prompt is guidance, not a security control (see [guardrails and sandboxing](guardrails-and-sandboxing.html)).

## Worked Example: Coding Agent

Coding agents work in a repository with a shell and file-editing tools, often unattended. Their prompts emphasize environment facts, verification and scope.

```text
<role>
You are a software engineering agent working in the repository mounted at
/workspace. You receive one task per run, usually a GitHub issue, and your
output is a working change on a new branch plus a short report. [1]
</role>

<environment>
Python 3.12 service; dependencies are already installed. Run the tests with
`make test` (about 3 minutes) and lint plus type checks with `make check`.
There is no network access except the package index. You run unattended in
CI: nobody can answer questions until the run ends. [2]
</environment>

<working_style>
Understand before you change: reproduce the bug or locate the relevant
code first, and read callers before modifying a function's behavior. [3]
Fix root causes rather than symptoms; don't special-case a test input to
make a test pass. [4]
Follow the conventions you see in neighboring code. Make the change the
task needs and nothing more; note any unrelated problems you spot in your
report rather than fixing them, because unrelated diffs slow down review. [5]
</working_style>

<verification>
The task is done when `make check` passes and `make test` passes, including
any new tests you add for the behavior you changed. If a test fails for a
reason you believe is unrelated to your change, verify that by running it
on the base branch, and mention it in your report. [6]
</verification>

<safety>
Work only inside /workspace. Don't modify CI configuration, lock files or
migrations unless the task requires it, since those affect other teams.
Never force-push or rewrite history. If the task can't be done without a
destructive or out-of-scope change, stop and explain what decision is
needed. [7]
</safety>

<long_tasks>
If the work is large, keep a checklist in your todo tool and commit at
each working milestone, so progress survives if the run is interrupted. [8]
</long_tasks>

<report>
Finish with a report of at most a few short paragraphs: what you changed
and why, how you verified it, and anything the reviewer should look at
closely. Lead with the outcome. [9]
</report>
```

Annotations:

1. **Role, input and deliverable** — the agent knows what it receives and what "output" means.
2. **Environment facts**: exact commands, timings, network limits, and the crucial fact that the run is unattended (which changes the ask-vs-act calculus without any pressure language).
3. **Working style as principles**, not a numbered script.
4. **A prohibition with a real reason** — special-casing tests is a known failure mode of coding agents optimizing for green checks.
5. **Scope control** with the reason (review cost), and a positive outlet for the agent's observations.
6. **Verifiable done criteria**, plus how to handle the ambiguous case of a pre-existing failure.
7. **Safety bounds by blast radius**, backed in practice by sandbox permissions (see [coding agents](coding-agents.html)).
8. **Long-horizon scaffold** sized to the task.
9. **Communication**: what the reviewer needs, outcome first.

Loading a versioned prompt and running it is straightforward. Keep the prompt in a file, tag the version, and mark it cacheable since it's identical across runs:

```python
from pathlib import Path
import anthropic

client = anthropic.Anthropic()  # reads ANTHROPIC_API_KEY
PROMPT_VERSION = "coding-agent/v14"  # tag this in your eval results too
system_prompt = Path(f"prompts/{PROMPT_VERSION}.txt").read_text()
issue_text = Path("issue.md").read_text()  # this run's task

response = client.messages.create(
    model="claude-opus-5-5",
    max_tokens=16000,
    thinking={"type": "adaptive"},         # depth via effort, not prose
    output_config={"effort": "high"},
    system=[{
        "type": "text",
        "text": system_prompt,
        "cache_control": {"type": "ephemeral"},  # stable prefix -> cache hits
    }],
    tools=tools,  # bash / file-editing tools defined elsewhere
    messages=[{"role": "user", "content": issue_text}],
)
```

The tool loop around this call is covered in [tool use](tool-use.html) and [building an agent from scratch](build-agent-from-scratch.html).

## Key Takeaways

- An agent's system prompt transfers the context only you have — goal, audience, environment, quality bar, constraints and their reasons. The model already knows how to be helpful.
- Attach a reason to every constraint; reasons let the model generalize to cases you didn't list and resolve conflicts sensibly.
- Write at the right altitude: principles and goals for judgment work, exact steps only where a single sequence is safe.
- Define ask-vs-act by reversibility, blast radius and ambiguity, and give a clear definition of done instead of generic pressure to "be thorough."
- With modern models, remove dated scaffolding (capitalized warnings, "think step by step," step scripts, word caps) and use API features like thinking and effort for what prose used to do.
- For long-horizon work, have the agent maintain todo lists, progress files, structured state and commits so a fresh context can resume.
- Keep tool contracts in tool descriptions and cross-tool strategy in the system prompt; avoid hard-coding tool names.
- Version prompts, tie them to a model, test every change against an eval suite over multiple trials, and read the transcripts.

## Exercises

1. **Add the why.** Take three bare rules from a prompt you've written or seen ("Always respond in English", "Never mention competitors", "Keep answers short") and rewrite each with its real reason. For each, name one case the rewritten version would handle that the bare rule wouldn't.
2. **Altitude ladder.** Write the "too low," "too high" and "right altitude" versions of an instruction for a research agent deciding when it has gathered enough sources. Explain what failure each wrong version would produce.
3. **Audit a prompt.** Find an open-source agent's system prompt (many coding agents publish theirs). List every instruction that is pressure language, a step script for a judgment task, or a prohibition with no reason. For each, propose a rewrite or a deletion and say what you would test to justify it.
4. **Build a prompt eval.** Write five test tasks for the customer-support agent above, including one that should trigger a handoff and one where the customer misremembers their order. Run the prompt against them with a real model three times each, then make one prompt change and measure whether the pass rate moved.
5. **Long-horizon scaffold.** Give a coding agent a task too large for one session (e.g., "add type hints to every module in this package"). Add the `<long_running_work>` section from this lesson, deliberately restart the session halfway, and evaluate how well the progress file let it resume. What did the notes miss?

## Check Your Understanding

```quiz
Q: A prompt says "NEVER use markdown." The agent's replies go to an SMS gateway. What is the best improvement?
- [ ] Repeat the rule in capitals at both the start and end of the prompt
- [x] Say replies go out as SMS, which shows markdown symbols literally
- [ ] Add three short examples of good plain-text replies after the rule
- [ ] Use structured output with a schema that has no markdown fields
E: Giving the reason lets the model generalize (it will also avoid tables, long URLs and other things that render badly as SMS) and weigh the rule sensibly. Examples help pin a format but don't explain it, and a JSON schema constrains shape, not whether the text inside contains markdown. Repetition and capitals add emphasis without information.

Q: Which instruction is pitched at the right altitude for a support agent handling refund requests?
- [ ] "Handle refund requests appropriately and in line with company policy."
- [ ] "STEP 1: apologize. STEP 2: look up order. STEP 3: if < $50, refund; else..."
- [x] "Refund up to $200 yourself; finance reviews more. Check the order first."
- [ ] "CRITICAL: You MUST always follow the refund policy, with no exceptions."
E: The right altitude states the goal, the bounds of authority and the reasons, and leaves the conversation to the model. The first is too vague, the second is a brittle script that breaks on unscripted cases, and the fourth adds pressure without information.

Q: Your agent prompt includes one detailed example trajectory: search_orders, then get_order, then issue_refund. What risk does this create?
- [ ] Little risk: a single worked example reliably improves tool-calling accuracy
- [x] The agent may copy the sequence, issuing refunds to people who only asked
- [ ] The model may treat the example's tool names as the only tools allowed
- [ ] The long example pushes the real instructions out of the model's view
E: Examples are the strongest signal in a prompt, and agents tend to imitate trajectories, even calling issue_refund when the customer only wanted tracking info. Use several varied examples labeled as illustrative, or describe the strategy instead. One example of moderate length doesn't crowd out the rest of the prompt.

Q: An agent runs unattended in CI and keeps ending its run with "Should I also update the tests?" What is the most effective prompt fix?
- [ ] Add "Be thorough. Do NOT stop early or ask questions." in capitals
- [ ] Add "think step by step before you end your turn" to the prompt
- [x] Say nobody can answer in CI, and define done as including tests
- [ ] Give it a list of questions it's allowed to ask and all others banned
E: The agent lacks operating facts and a definition of done. Telling it the situation and what completion means changes the right behavior directly. Generic pressure language tends to cause other problems such as over-verification, and a whitelist of questions doesn't tell it what to do instead.

Q: With a model that supports adaptive thinking, how should you get more careful reasoning on a hard agent task?
- [ ] Add "think step by step" and require a <scratchpad> section first
- [x] Raise the effort setting and tell it how its work will be verified
- [ ] Add a required "reasoning" field to the JSON output it produces
- [ ] Lower max_tokens so that the model is pushed to be more focused and direct
E: Native thinking is controlled by configuration (thinking and effort), which is more reliable than prose. A reasoning field in the output duplicates what thinking blocks already provide and on some current Claude models can even trigger a refusal for reasoning extraction. What prompts still add is task-specific knowledge such as how to verify success.

Q: Where should the fact "search_orders only covers orders from the last 18 months" live?
- [x] In the search_orders tool description, as part of its contract
- [ ] In the system prompt's policy section, so it's seen on every step
- [ ] In the tool's error message, returned when old orders are missing
- [ ] In a few-shot example showing a search for an older order failing
E: Limits on what a tool returns are part of the tool's contract. Keeping them in the description means the model knows before calling, and the fact travels with the tool to any agent that uses it. An error message helps too, but the model only sees it after a wasted call (and an empty result may not look like an error at all).

Q: For a multi-session coding task, why include a "Dead ends" section in the agent's progress file?
- [ ] It lets the reviewer see how hard the task was before approving it
- [x] A fresh context has no memory of failed tries and would retry them
- [ ] It gives the model negative examples, which improves later outputs
- [ ] It keeps git history clean, since failed experiments are never committed
E: Progress files are the agent's memory across context resets. Recording what didn't work, and why, prevents a new session from repeating the same expensive mistakes. Reviewers may find it useful, but that's a side benefit, not the reason.

Q: A teammate's meta-prompting tool rewrote your system prompt and it "looks much better." What should happen before shipping it?
- [ ] Have a second model review the new prompt and confirm it improved
- [ ] Ship it to 5% of traffic and watch user complaints for a week
- [x] Run both versions on your eval suite over several trials, and compare
- [ ] Diff the two versions and check that no existing rule was dropped or changed
E: A prompt is code; every change needs regression testing on realistic tasks before it reaches users. A model's opinion or a text diff can't tell you how behavior changed, and complaint rates are a slow, noisy signal. Model-improved prompts often become longer and more emphatic, which can degrade behavior on capable models.
```

## Further Reading

- [Anthropic: Prompt engineering overview](https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/overview) — official guide to clarity, examples, XML tags and model-specific best practices.
- [Anthropic: Effective context engineering for AI agents](https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents) — source of the "right altitude" framing and advice on canonical examples.
- [Anthropic: Effective harnesses for long-running agents](https://www.anthropic.com/engineering/effective-harnesses-for-long-running-agents) — progress files, feature lists and incremental sessions for multi-context-window work.
- [Anthropic: Building effective agents](https://www.anthropic.com/engineering/building-effective-agents) — when to use agents vs workflows, and why prompting the tool interface matters as much as the main prompt.
- [Anthropic: Claude Code best practices](https://www.anthropic.com/engineering/claude-code-best-practices) — practical prompting for a production coding agent, including project instruction files.
- [OpenAI: GPT-4.1 prompting guide](https://cookbook.openai.com/examples/gpt4-1_prompting_guide) — a vendor's view of agentic reminders (persistence, tool use, planning); useful for comparing how advice shifts across model generations.
- [Wei et al., Chain-of-Thought Prompting Elicits Reasoning in Large Language Models](https://arxiv.org/abs/2201.11903) — the paper that introduced chain-of-thought prompting (the zero-shot "Let's think step by step" phrasing came from Kojima et al. later in 2022); useful history for understanding why native thinking replaced it.
