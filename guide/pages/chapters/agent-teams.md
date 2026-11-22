---
title: "Teams of agents"
emoji: "🤝"
subtitle: "Why several agents can beat one, and why teams cost more."
minutes: 10
---

Picture a newsroom at deadline. The editor hands out stories, reporters write at the same time, and the editor fixes clashes ("you have the match on different days!") and assembles the paper.

Some AI systems work just like that. A **lead agent** splits a big job into parts, hands each to a **helper agent**, and combines what comes back.

> [!KEY]
> A **team of agents** (a **multi-agent system**) is several agents sharing one goal: a lead divides the work, helpers each handle a piece.

Teams can be faster and more thorough, but they use many more tokens, so they suit only the right jobs.

## Why more than one?

[Planning](planning.html) breaks a goal into steps. A team does several *at once*, one agent each:

- **Parallel work.** Six helpers research six apps at once, like six friends each grabbing one item in the supermarket.
- **Specialists.** Each helper gets its own instructions and only the tools it needs: a sceptical fact-checker, a friendly writer.
- **A fresh memory.** Often the biggest win. One agent researching six apps stuffs its [context window](memory.html) with pages until details fall out. Each helper starts with an **empty backpack** and returns a short summary, so the lead stays on the big picture.

> [!ANALOGY]
> A good group project has one person who splits the work and stitches it together; a bad one has four people rewriting the introduction. Agent teams need the same: **clear division, clear briefs, one owner of the result.**

## The race: one vs. a team

Set the number of helpers and press **Race!** Watch time *and* tokens with 1, 3 and 6 helpers.

<div data-widget="team-race"></div>

Three helpers finished about twice as fast but used well over twice the tokens. More helpers give shrinking gains, because planning and merging don't get shorter. One helper was *slower* than solo: all overhead, no parallel work. (Illustrative numbers, real pattern.)

## How a lead runs a team

The common setup is **lead and helpers** (engineers say **orchestrator and workers**, the orchestrator being the conductor keeping everyone in time):

<div class="steps-strip">
<div><strong>Plan</strong>Split the goal into parts that can be done separately.</div>
<div><strong>Brief</strong>Give each helper a clear task, what to return, what to avoid.</div>
<div><strong>Work in parallel</strong>Helpers search, read and write on their own.</div>
<div><strong>Report back</strong>Each sends a short summary, not everything it read.</div>
<div><strong>Merge &amp; check</strong>The lead combines the pieces and fixes conflicts.</div>
</div>

**Briefs** matter enormously: a helper knows only what the lead tells it. "Research competitors" invites duplication; a good brief names the piece, the format and where to stop. (See [Giving great instructions](great-instructions.html).)

The **merge** is where the lead earns its keep: only it sees every piece, so only it can catch contradictions. Watch a lead plan a product launch with three helpers.

<div class="sim" data-sim="ch-agent-teams"></div>

> [!TRY] Watch the merge
> Around step 7, the lead spots that the timeline and FAQ disagree on shipping. Neither helper could have caught that. Notice too Helper A marking a price **unconfirmed** instead of guessing.

<div class="detail">

**What a "helper" really is:** technically, a helper (often called a **subagent**) is just another run of a language model with its own instructions, tools and fresh context. The lead creates one by calling a tool, something like "start a subagent with this task", and receives the helper's final message as the tool's result. The helper's working notes stay in its own context and are thrown away; only its summary reaches the lead. As of 2026, several agent products and developer kits offer this built in: for example, Claude Code can start subagents, and the OpenAI Agents SDK and Google's Agent Development Kit both support multi-agent setups.

</div>

### Handoffs: passing the baton

Some teams work **in a relay**: each agent does its part, then passes the job and everything learned to the next specialist. This is a **handoff**.

In customer service, a front-desk agent hands refunds to a billing agent with payment access, and broken products to technical support. Each gets only the tools it needs, so the front desk can't touch payments. See the [support agent example](example-support-agent.html).

The risk is a game of telephone. Good handoffs pass a clear summary (*who, what they asked, what's been tried*) so the customer never repeats themselves.

More teams at work: the [research agent](example-research-agent.html) splits a heat-pump question among three helpers and sends a fourth when sources disagree; the [writing team](example-writing-team.html) shares one writing job among specialists.

## The catch: cost

Every helper reads, thinks and writes, and you pay for every token. Three helpers reading ten pages each is thirty pages, plus the lead's planning, briefing and merging. A team can easily cost several times what one agent would.

<div class="detail">

**A real-world data point:** in a 2025 write-up about building its multi-agent research feature, Anthropic reported that agents used roughly 4 times as many tokens as an ordinary chat, and its multi-agent system roughly 15 times as many. It also found the team setup did substantially better than a single agent on its internal research tests, mainly because spreading the work across helpers let the system read and reason over far more material. Their lesson: multi-agent systems pay off when the task is valuable enough, and broad enough, to justify the extra cost.

</div>

So before reaching for a team, ask: *is the extra cost buying something I need?*

## When one agent is better

Teams shine on **wide** tasks: many independent pieces, like researching many companies, checking many documents, or exploring several explanations at once. One agent usually wins otherwise:

| Situation | Why one agent wins |
|---|---|
| Editing one document or email | Every sentence depends on the others; writers would clash |
| Dependent steps | Step 3 needs step 2's result, so nothing runs in parallel |
| Everyone needs the full picture | Each helper would miss context the others have |
| Small or quick tasks | Planning and merging cost more than they save |
| Tight budgets | A team multiplies the token bill |

Teams also bring new mistakes: duplicated work, conflicting choices (blue theme vs. green), a lead that merges without checking.

> [!TIP] Rule of thumb
> Start with **one agent**. Use a team only when the job splits into big, independent chunks, and speed or coverage is worth paying more.

```prompt
I need to research [topic, e.g. "five project-management apps for a 10-person team"].
If you can use helper agents (subagents), split the work so each helper covers one [item/angle] independently. Give each helper a clear brief and ask for a short summary with sources.
Then merge the results into one comparison table, point out any places where the helpers' findings disagree, and mark anything you couldn't confirm as "unconfirmed" rather than guessing.
```

## Quick check

```quiz
Q: Which task is the best fit for a team of agents working in parallel?
- [ ] Polishing the wording of one short, important email
- [x] Researching and comparing twelve different suppliers
- [ ] Doing a calculation where each step needs the last result
- [ ] Answering a quick question about one fact
E: Researching many suppliers splits naturally into independent pieces, so helpers can work at the same time. Editing one email or a chain of dependent steps leaves nothing to do in parallel, so one agent is better.

Q: Besides speed, why does giving each helper its own fresh context help?
- [ ] Fresh helpers are always smarter than the lead agent is
- [ ] It means that nobody needs to check the final result
- [x] No single agent's memory gets stuffed full of pages
- [ ] It makes the whole team use far fewer tokens in total
E: Each helper starts with an empty "backpack" and returns just a short summary, keeping the lead focused. But it doesn't reduce total tokens: the team as a whole usually uses many more.

Q: In the product-launch run, what job could only the lead agent do?
- [ ] Reading the twelve-page product specification
- [ ] Searching rival companies' websites for prices
- [ ] Writing the first draft of the launch-week timeline
- [x] Noticing that the timeline and the FAQ disagreed
E: Each helper only saw its own piece. Only the lead, comparing all the pieces side by side, could notice the shipping-date clash. That's why the merge-and-check step matters so much.
```

## What's next

One agent or a team, everything starts with what *you* ask for. Next: [giving great instructions](great-instructions.html), the simple recipe that turns a vague request into exactly what you wanted.
