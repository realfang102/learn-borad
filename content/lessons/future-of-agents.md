---
title: "Open Problems & The Road Ahead"
description: "Where AI agents are heading and what still blocks them: task-horizon trends, reliability, memory, evaluation, security, identity and payments, the agentic web, embodiment, work and governance — plus how to keep learning and a capstone project."
duration: 35
level: beginner
objectives:
  - Describe the major measurable trends in agent capability and how to interpret them carefully
  - Explain the main open problems — reliability, continual learning, evaluation, cost, security, coordination, identity and payments
  - Summarize how the web is being adapted for agents (MCP, AGENTS.md, llms.txt, agent payment protocols)
  - Weigh optimistic and skeptical views of agents' impact on work and society using evidence rather than hype
  - Plan your next steps with practice projects, sources to follow and a capstone that ties the course together
prerequisites: [what-is-an-agent, when-to-use-agents]
tags: [future, open-problems, trends, agentic-web, governance, careers]
---

In 2023, "AI agent" mostly meant a demo: a loop that called a search API, got confused by step five, and spun forever. By 2026, agents write and merge real code, operate browsers, run multi-hour research tasks, and handle customer conversations at scale. That's a big change in a short time — and it makes predicting the next few years both tempting and treacherous.

This final lesson steps back from building to look ahead. You'll see which trends are actually *measured* (and how to read those measurements without fooling yourself), the open problems that researchers and engineers are still working on, how the internet itself is being reshaped for agents, and the honest disagreements between optimists and skeptics. We close with a practical plan: how to keep learning in a field that changes monthly, and a **capstone project** that pulls together everything from this course.

A ground rule for this lesson: we'll avoid unfalsifiable predictions. When we describe the future, we'll say what evidence would confirm or refute it.

## Trends You Can Measure

### Task horizons are growing

The most-cited measurement of agent progress comes from **METR**, an AI evaluation nonprofit. In March 2025 they introduced the **50% task-completion time horizon**: take a set of tasks (mostly software engineering and research tasks), measure how long skilled *humans* take to do each one, then find the task length at which an AI agent succeeds about half the time.

Their headline finding: **the length of tasks frontier AI agents can complete with 50% reliability has been doubling roughly every seven months since 2019**, with signs the trend may have sped up in 2024–2025. In the original paper, the best models of early 2025 could complete tasks that take a human expert about an hour, at 50% reliability; later models have extended that further.

How to read this carefully:

- **50% is not "reliable."** Horizons at 80% success are much shorter than at 50%. For many business uses you need 95%+.
- **Domain matters.** The tasks are mostly well-specified software tasks with automatic scoring. Horizons can differ by a large factor in other domains, and messy real-world tasks are harder than benchmark tasks of the same length.
- **Trends are not laws.** An exponential fit to past data says nothing guaranteed about the future; it could speed up, slow down, or bend as easy gains are exhausted.

> [!KEY] Why horizon is the right lens
> "Can the model answer this question?" is mostly solved for many domains. The open frontier is "can the agent *keep going* — planning, recovering from errors and staying on track — for hours or days?" Task horizon measures exactly that, and it connects directly to the compounding-error math from [when to use agents](when-to-use-agents.html).

A falsifiable version of the optimistic view: *if* the trend continues, agents should reliably complete multi-day software projects within a few years. Watch updated horizon measurements — they will confirm or refute it.

### Reasoning and tools are converging

Through 2024, "reasoning models" (that think at length before answering) and "agents" (that call tools) were somewhat separate. By 2025 they merged: frontier models now **think between tool calls**, deciding mid-reasoning to search, run code, or check a file, then reasoning about the result. This convergence came largely from training — reinforcement learning on multi-step tasks with tools in the loop (see [training agents](training-agents.html)). The practical upshot: reasoning effort, tool design and context management are now one combined engineering problem, not three.

### Agents as a default interface

Agents are moving from a separate product category to the *default way* software is operated:

- **Coding**: terminal and IDE agents (Claude Code, OpenAI's Codex, Cursor and others) are standard developer tools; see [coding agents](coding-agents.html).
- **Browsing and computer use**: general-purpose agents that operate browsers and desktops, and AI-native browsers built around an agent; see [computer-use agents](computer-use-agents.html).
- **Research**: "deep research" features that run dozens of searches and produce cited reports; see [research agents](research-agents.html).
- **Business workflows**: support, operations, finance and sales processes rebuilt with agents in the loop; see [agent use cases](agent-use-cases.html).

The durable trend: users increasingly state an *outcome* ("reconcile these invoices", "fix this bug") and supervise, rather than clicking through each step.

## Open Problem: Long-Horizon Reliability

The gap between "impressive demo" and "trusted coworker" is mostly a reliability gap. Agents still:

- **Lose the plot** on long tasks — forgetting constraints given at the start, or drifting to a subtly different goal.
- **Fail silently** — reporting success when tests didn't run or a step didn't complete.
- **Get stuck** in loops of near-identical attempts.
- **Behave inconsistently** — succeeding on one run and failing the next on the same task (the gap between pass@k and pass^k in [evaluating agents](evaluating-agents.html)).

Current approaches combine better models with better harnesses: verification steps, checkpoints, context compaction, sub-agents with clean context, and human checkpoints for irreversible actions (see [reliability](reliability.html) and [human-in-the-loop](human-in-the-loop.html)). An open question is how much reliability will come "for free" from model scaling versus requiring new architectural ideas.

## Open Problem: Continual Learning and Memory

Today's agents mostly **don't learn on the job**. Model weights are frozen after training; anything learned during a session vanishes unless the harness writes it down. Workarounds — memory files, retrieval over past sessions, skills libraries (see [memory](memory.html) and [self-improving agents](self-improving-agents.html)) — help a lot, but they're bolted on, and they create new problems: what to remember, what to forget, how to resolve contradictions, and how to keep memory from being poisoned.

Many researchers consider **continual learning** — models that genuinely and safely improve from experience after deployment, the way a new employee does — one of the most important missing capabilities. In late 2025, Andrej Karpathy publicly argued we're in "the decade of agents" rather than "the year of agents," citing gaps like continual learning as reasons agents aren't yet able to work like a capable human colleague. Watch for: agents that measurably get better at *your* specific tasks over weeks, without manual prompt edits.

## Open Problem: Evaluation

You can't improve what you can't measure, and agent measurement is hard:

- **Benchmarks saturate fast.** Popular benchmarks go from "hard" to "nearly solved" within a year or two, and contamination (test data leaking into training) is a constant worry (see [benchmarks](benchmarks.html)).
- **Real tasks are messy.** Benchmarks favor well-specified, automatically gradable tasks; real work involves ambiguity, changing requirements and judgment calls.
- **Long tasks are expensive to evaluate.** A multi-hour agent run costs real money and time per data point.
- **Reward hacking.** Agents trained against checks learn to game them — editing tests rather than fixing code — so evaluators themselves need auditing.

Expect continued investment in realistic, long-horizon, regularly-refreshed evaluations, and in measuring *economic* value (did the agent's work get accepted and used?) rather than benchmark points.

## Open Problem: Cost and Latency

The price of a given level of model capability has fallen dramatically over the past few years. But agents spend that saving and more: reasoning models think in thousands of tokens, agent loops re-send growing contexts, and multi-agent systems multiply everything. The net effect is that **cost per task**, not cost per token, is the number that matters, and it's not automatically falling for the hardest tasks. Caching, smaller models for sub-tasks, and smarter context management are the main levers (see [cost and latency](cost-and-latency.html)).

## Open Problem: Security and Prompt Injection

**Prompt injection** — instructions hidden in content the agent reads (a web page, email, document or tool result) that hijack its behavior — remains **unsolved** in general as of 2026. Models have become more resistant, but no model-level defense is reliable enough to bet sensitive data on. Simon Willison's "lethal trifecta" captures the danger: an agent with (1) access to private data, (2) exposure to untrusted content, and (3) the ability to communicate externally can be tricked into exfiltrating that data.

The most promising direction is **security by design** rather than by persuasion: restricting what the agent *can* do regardless of what it's told — sandboxing, least-privilege permissions, separating trusted from untrusted data flows (as in Google DeepMind's research system *CaMeL*), and human approval for sensitive actions. See [agent security](agent-security.html) and [guardrails and sandboxing](guardrails-and-sandboxing.html).

> [!WARNING]
> Any prediction that agents will safely handle your email, money and accounts autonomously should be checked against one question: *what stops a malicious web page from instructing them otherwise?* If the answer is "the model will notice," that's not yet a sufficient answer.

## Open Problem: Multi-Agent Coordination

Multi-agent systems can parallelize work and keep contexts focused, but they also fail in new ways: agents duplicating work, contradicting each other, losing information in hand-offs, or confidently agreeing on wrong answers. Research analyzing multi-agent failures has found many stem from system design — unclear roles, poor verification, bad communication protocols — rather than raw model ability. Open questions include when multiple agents genuinely outperform one well-equipped agent, how agents from *different organizations* should negotiate and trust each other, and how to debug emergent behavior. See [multi-agent systems](multi-agent-systems.html).

## Open Problem: Identity, Authorization and Payments

When an agent books a flight on your behalf, the airline needs answers to questions the web was never designed to ask: *Is this an agent? Whose agent? What is it allowed to do? Did the human actually authorize this purchase? Who's liable if it's wrong?*

Several efforts address pieces of this, as of 2026:

- **Authorization**: MCP's authorization spec builds on OAuth 2.1, so agents can act with scoped, revocable permissions instead of shared passwords (see [protocols: MCP & A2A](protocols-mcp-a2a.html)).
- **Agent identity for websites**: proposals for agents to cryptographically sign their HTTP requests, so sites can distinguish a legitimate, accountable agent from an anonymous scraper.
- **Agent payments**: Google announced the **Agent Payments Protocol (AP2)** in September 2025 — an open protocol built around cryptographically signed **mandates** that record what a user authorized (an intent mandate for the request, a cart mandate for the exact items and price). Later that month OpenAI and Stripe released the **Agentic Commerce Protocol (ACP)** alongside Instant Checkout in ChatGPT. Card networks have launched their own agent programs, and crypto-oriented approaches (such as the HTTP 402-based x402) target machine-to-machine micropayments.

None of these is yet universal, and it's unclear which will win or whether they'll converge. The durable principle: **verifiable delegation** — proof that a specific human authorized a specific agent to do a specific thing, within limits — is the foundation agent commerce needs.

## The Agentic Web

Websites and software are starting to be designed for agents as first-class users, not just humans:

| Building block | What it is | Status (as of 2026) |
|---|---|---|
| **MCP** | Open protocol for connecting agents to tools and data | Widely adopted; donated to the Linux Foundation's **Agentic AI Foundation** (AAIF) in December 2025 |
| **AGENTS.md** | A README for coding agents: build steps, conventions, test commands | Released by OpenAI in 2025; also a founding AAIF project; used across many open-source repos |
| **llms.txt** | A proposed Markdown file at a site's root summarizing the site and linking to LLM-friendly docs | Proposed in 2024; adopted by many documentation sites; not a formal standard |
| **A2A** | Protocol for agents from different vendors to communicate | Introduced by Google in 2025; moved to the Linux Foundation |
| **Agent payment protocols** | AP2, ACP and others | Early deployments |

The AAIF launched with three founding projects — Anthropic's MCP, OpenAI's AGENTS.md and Block's goose agent framework — with major AI and cloud companies as members. That's a notable signal: competitors chose shared, vendor-neutral standards for the agent layer, much as the web standardized on HTTP and HTML.

What changes for builders: offering an **MCP server or a clean API** may matter as much as a polished UI; documentation should be readable by agents; and sites must decide how to treat agent traffic (welcome it, charge for it, or block it). The open questions are economic as much as technical: if agents read your content and users never visit your page, how do publishers get paid?

## Embodied Agents and World Models

Most agents in this course act in software. **Embodied agents** act in the physical world through robots. The same ingredients are arriving there: large **vision-language-action (VLA)** models that map camera input and instructions to motor actions, released by Google DeepMind (Gemini Robotics), Physical Intelligence, NVIDIA and others.

**World models** — models that predict how an environment will evolve in response to actions — are a related frontier. Google DeepMind's Genie 3 (2025) generates interactive, explorable environments from text, and research groups are using such models to train agents in simulation before deploying them in the real world.

Robotics is harder than software for well-understood reasons: physical data is scarce and expensive, mistakes can be dangerous and irreversible, and there's no "undo." Expect progress to be real but uneven, and be skeptical of demos without information on success rates and how many attempts were filmed.

## Humans, Agents and the Nature of Work

This is where the honest disagreement is sharpest. Some evidence on both sides:

- **Productivity gains are real in some settings.** A widely cited field study of customer-support agents (Brynjolfsson, Li & Raymond) found an AI assistant raised productivity by about 14% on average, with the largest gains for less-experienced workers.
- **Perceived gains can mislead.** A 2025 randomized controlled trial by METR found experienced open-source developers working in their own mature repositories were about 19% *slower* when allowed to use early-2025 AI tools — while believing they had been sped up. Results will differ with newer tools, other tasks and less experienced developers, but the gap between *feeling* faster and *being* faster is a lesson in itself.
- **Work shifts toward supervision.** As agents take on execution, human work moves toward specifying goals, reviewing outputs, handling exceptions and taking responsibility — skills like clear writing, decomposition and judgment become more valuable (see [human-in-the-loop](human-in-the-loop.html)).

### Optimists vs. skeptics

| | Optimistic view | Skeptical view |
|---|---|---|
| **Pace** | Capability trends (like task horizons) continue; agents handle multi-day projects within a few years | Trends bend; the last 10% of reliability takes most of the effort, as with self-driving cars |
| **Impact** | Dramatic acceleration of science and productivity — e.g., Anthropic CEO Dario Amodei's essay *Machines of Loving Grace* | AI as "normal technology" (Narayanan & Kapoor): transformative, but diffusing over decades through slow institutional adoption |
| **Work** | Agents augment people and create new roles | Displacement, deskilling and concentration of gains in a few firms |
| **Risk** | Manageable with good engineering and oversight | Security, misuse and loss of human oversight are underestimated (see [agent safety & alignment](agent-safety-alignment.html)) |

Both sides make claims that will be tested by evidence over the next few years: measured horizons, adoption data, productivity statistics, incident reports. The intellectually honest position is to hold views with confidence proportional to evidence, and to update.

> [!TIP] A hype filter
> When you read a claim about agents, ask: (1) What exactly was measured? (2) At what success rate and cost? (3) On whose tasks — benchmark or real? (4) Compared to what baseline (including a human with good tools)? (5) What would prove the claim wrong?

## Governance

Rules for AI are taking shape, unevenly:

- The **EU AI Act** entered into force in 2024, with obligations phasing in; requirements for general-purpose AI model providers began applying in August 2025.
- In the US, California enacted **SB 53** in 2025, requiring large frontier-model developers to publish safety frameworks and report certain safety incidents.
- Frontier AI developers publish their own safety policies, and voluntary standards such as the NIST AI Risk Management Framework are widely referenced.

Agent-specific questions are still mostly open: Who is liable when an agent makes a costly mistake — the user, the deployer, or the model provider? Should agents be required to identify themselves as AI? What logs must be kept for auditing? For builders, the practical move is to design for **accountability now**: clear permissions, audit logs, human approval for high-stakes actions, and the ability to explain what the agent did (see [observability](observability.html) and [deployment](deployment.html)).

## How to Keep Learning

The field changes monthly; your fundamentals from this course won't. To stay current without drowning:

### Practice projects

- Rebuild the agent loop from scratch in a new language or with a new provider (see [build an agent from scratch](build-agent-from-scratch.html)).
- Write an MCP server for a tool you use daily and connect it to an agent.
- Build a 30-task eval for something you care about and track three models on it over time.
- Reproduce one paper's core result at small scale — Reflexion on 20 coding problems, or a tiny GRPO run.
- Red-team your own agent with prompt injections hidden in documents it reads.

### Sources to follow

- **Primary research**: arXiv (cs.CL, cs.AI, cs.LG) — skim abstracts weekly; read deeply when a result keeps getting cited.
- **Lab and evaluator blogs**: Anthropic's engineering blog, OpenAI, Google DeepMind, Hugging Face, and METR for careful capability measurement.
- **Practitioner writers**: Simon Willison's blog for hands-on, skeptical, well-sourced coverage; Lilian Weng's long-form survey posts for research overviews.
- **Official docs and changelogs** of the SDKs and protocols you use (MCP, your model provider's API) — features change faster than tutorials.

### Communities

Open-source projects (MCP servers, agent frameworks, eval harnesses) are the best place to learn by contributing. Hugging Face hubs, framework Discords and GitHub discussions, local meetups, and reading groups that work through one paper a week all help. Teaching others — writing up what you built and what failed — is the fastest way to find gaps in your understanding.

## Capstone: Tie the Course Together

Build one agent end-to-end, with production discipline. Pick a domain you know (your codebase, your team's documents, a hobby dataset) and work through these milestones:

1. **Scope it.** Write a one-page brief: the task, why it needs an agent rather than a workflow, and what "done" looks like. → [When to use agents](when-to-use-agents.html), [workflow patterns](workflow-patterns.html)
2. **Build the core loop.** Implement it from scratch first, then decide whether a framework helps. → [Build an agent from scratch](build-agent-from-scratch.html), [agent frameworks](agent-frameworks.html), [SDK hands-on](sdk-hands-on.html)
3. **Design 3–6 tools** with clear schemas, helpful errors and structured outputs, and expose at least one through MCP. → [Tool use](tool-use.html), [designing tools](designing-tools.html), [structured outputs](structured-outputs.html), [protocols](protocols-mcp-a2a.html)
4. **Engineer the context**: system prompt, retrieval over your documents, and memory of past sessions. → [Prompting for agents](prompting-for-agents.html), [RAG](rag-and-retrieval.html), [memory](memory.html), [context engineering](context-engineering.html)
5. **Add planning and verification**: a planning step and a self-check grounded in real feedback. → [Reasoning and planning](reasoning-and-planning.html)
6. **Build an eval set** of at least 30 tasks with automatic checks; measure pass rate, consistency, cost and latency. → [Evaluating agents](evaluating-agents.html), [benchmarks](benchmarks.html), [cost and latency](cost-and-latency.html)
7. **Instrument and harden**: tracing, retries, step budgets, approvals for risky actions. → [Observability](observability.html), [reliability](reliability.html), [human-in-the-loop](human-in-the-loop.html)
8. **Secure it**: threat-model prompt injection, sandbox execution, apply least privilege, and red-team it. → [Agent security](agent-security.html), [guardrails and sandboxing](guardrails-and-sandboxing.html), [agent safety & alignment](agent-safety-alignment.html)
9. **Improve it with evidence**: add an eval-gated lessons file or prompt-optimization loop; optionally try splitting into sub-agents and measure whether it helps. → [Self-improving agents](self-improving-agents.html), [multi-agent systems](multi-agent-systems.html)
10. **Ship and reflect**: deploy it for real users (even just yourself), then write a post-mortem: what worked, what failed, what would require a better model vs. a better harness, and whether fine-tuning would ever be justified. → [Deployment](deployment.html), [training agents](training-agents.html)

Stretch variants: make it a [coding agent](coding-agents.html) for your repo, a [research agent](research-agents.html) with citations, a [voice agent](conversational-voice-agents.html), or a [computer-use agent](computer-use-agents.html) for a workflow with no API.

## Key Takeaways

- METR's measurements show the length of tasks frontier agents complete at 50% reliability has been doubling roughly every seven months — a useful trend, but 50% isn't reliable, domains differ, and trends aren't guarantees.
- Reasoning and tool use have converged; agents are becoming a default interface for software, from coding to research to business workflows.
- Major open problems: long-horizon reliability, continual learning, evaluation, cost per task, prompt-injection security, multi-agent coordination, and identity/authorization/payments.
- The web is being rebuilt for agents through shared standards — MCP and AGENTS.md (now under the Linux Foundation's Agentic AI Foundation), llms.txt, A2A, and early payment protocols like AP2 and ACP.
- Evidence on productivity is mixed and context-dependent; feeling faster is not the same as being faster.
- Optimists and skeptics disagree about pace and impact; judge claims by what was measured, at what reliability and cost, against what baseline.
- The fundamentals — the loop, tools, context, evals, security — outlast any specific model or framework. Keep building.

## Exercises

1. **Read a trend critically.** Find a recent claim about agent capability (a launch post or news article). Apply the five-question hype filter from this lesson and write a short paragraph on what it does and doesn't show.
2. **Make a falsifiable prediction.** Write three predictions about agents for 12 months from now, each with a specific, checkable criterion (e.g., "a public benchmark of X will be above Y at Z% reliability"). Put a reminder in your calendar to grade yourself.
3. **Agent-ready your site or repo.** Add an `AGENTS.md` to a repository you maintain (build, test and style instructions), or draft an `llms.txt` for a documentation site. Test whether a coding or research agent performs better with it.
4. **Delegation design.** Design the authorization flow for an agent that buys office supplies under $200 without asking, and asks for anything above. What does the user sign? What does the merchant verify? What gets logged? Compare your design to AP2's mandates.
5. **Capstone.** Complete milestones 1–6 of the capstone project and publish your eval results — including the failures.

## Check Your Understanding

```quiz
Q: What does METR's "50% time horizon" measure?
- [ ] How long an agent can run autonomously before it needs a human to step in
- [x] The human-expert task length at which an agent succeeds about half the time
- [ ] The share of a benchmark's tasks an agent finishes within its time limit
- [ ] How long an agent takes to finish a task that a human expert does in an hour
E: Task difficulty is measured by how long skilled humans take; the horizon is the length at which the agent's success rate crosses 50%. It says nothing about how long the agent itself runs or how fast it is. Horizons at higher reliability (say 80%) are much shorter.

Q: A vendor says "our agent completes week-long tasks." Which question best tests the claim?
- [ ] Which frontier model powers it, and how large is that model?
- [x] At what success rate and cost, on whose tasks, versus what baseline?
- [ ] How many tools does it have access to while it works on the task?
- [ ] Does it keep working after the user closes the browser tab for the night?
E: Capability claims are meaningless without reliability, task realism, cost and a baseline — the hype filter in practice. The model, tool count and whether it runs unattended describe the product, not whether it actually succeeds at week-long tasks.

Q: Why is prompt injection considered an open problem rather than a solved one?
- [ ] Newer models resist it, but older models still in use remain exposed
- [x] No model-level defense is reliable, so protection rests on system design
- [ ] Injection classifiers catch it, but are too slow to run on every tool call
- [ ] It's solved for text, but images and audio can still carry injections
E: Even the most resistant current models can still be manipulated by content they read, so dependable defenses limit what a hijacked agent can do: restricted permissions, data-flow separation and approvals. Classifiers are probabilistic regardless of speed, and text-only injection is not solved either.

Q: What is the core idea behind AP2's "mandates"?
- [ ] Merchant-signed price guarantees an agent can enforce at checkout
- [x] Signed records of what a user authorized, from intent to cart
- [ ] A shared wallet that agents draw on without per-purchase approval
- [ ] Card-network rules that make the agent's vendor liable for errors
E: Mandates provide verifiable delegation: an intent mandate captures what the user asked for and a cart mandate the exact items and price they approved. The signatures come from the user's side of the transaction, not the merchant's, and the protocol doesn't assign liability by itself.

Q: Which statement about AI and developer productivity is best supported by the evidence in this lesson?
- [ ] Gains are largest for senior developers, who know what to ask for
- [ ] Self-reports are reliable, so surveys are enough to measure speed-ups
- [x] Effects vary; a 2025 RCT found experts slower despite feeling faster
- [ ] Measured gains are consistent at around 14% across most kinds of work
E: Evidence is mixed: the support-agent study found about 14% average gains, concentrated among less-experienced workers, while METR's 2025 RCT found experienced developers in their own repos about 19% slower while believing they were faster. That gap is exactly why self-reports aren't enough.

Q: What did the formation of the Agentic AI Foundation in December 2025 signal?
- [ ] That MCP was merging with A2A into a single agent-protocol standard
- [x] That rival AI firms chose neutral governance for shared standards
- [ ] That llms.txt and AGENTS.md were formally standardized by the W3C
- [ ] That agent frameworks would need Linux Foundation certification
E: Placing MCP, AGENTS.md and goose under a vendor-neutral foundation, with competitors as members, mirrors how the web standardized shared protocols. A2A is a separate Linux Foundation project, and llms.txt remains an informal proposal.
```

## Further Reading

- [Measuring AI Ability to Complete Long Tasks (METR)](https://metr.org/blog/2025-03-19-measuring-ai-ability-to-complete-long-tasks/) — the time-horizon methodology and trend, with updates.
- [Measuring AI Ability to Complete Long Tasks (paper)](https://arxiv.org/abs/2503.14499) — full details, caveats and robustness checks.
- [Building effective agents (Anthropic)](https://www.anthropic.com/engineering/building-effective-agents) — a grounded, durable take on when and how to build agents.
- [Linux Foundation: formation of the Agentic AI Foundation](https://www.linuxfoundation.org/press/linux-foundation-announces-the-formation-of-the-agentic-ai-foundation) — MCP, AGENTS.md and goose under neutral governance.
- [Announcing the Agent Payments Protocol (AP2)](https://cloud.google.com/blog/products/ai-machine-learning/announcing-agents-to-payments-ap2-protocol) — how mandates enable verifiable agent purchases.
- [AGENTS.md](https://agents.md) — the open format for guiding coding agents.
- [llms.txt proposal](https://llmstxt.org) — a lightweight way to make sites agent-readable.
- [Defeating Prompt Injections by Design (CaMeL)](https://arxiv.org/abs/2503.18813) — a security-by-design approach to prompt injection.
- [Machines of Loving Grace](https://darioamodei.com/machines-of-loving-grace) — an optimistic, detailed vision of what capable AI could do, worth reading alongside skeptical takes.
