---
title: "Teams of agents"
emoji: "🤝"
subtitle: "Why several agents can beat one, how a lead agent splits up the work and merges the results — and why teams cost a lot more."
minutes: 10
---

Imagine a newspaper on a busy evening. One editor can't write every story alone, so she hands them out: one reporter covers the election, another the football, a third the weather. They all work at the same time. Then the editor reads every story, fixes the clashes ("you both said the match was on different days!") and puts the paper together.

Some AI systems work exactly like that newsroom. Instead of one agent doing everything, a **lead agent** splits a big job into parts and hands each part to a **helper agent**. The helpers work in parallel, report back, and the lead combines their work into one result.

> [!KEY] The big idea
> A **team of agents** (often called a **multi-agent system**) is several agents working on one goal, usually with a lead that divides the work and helpers that each handle one piece. Teams can be faster and more thorough — but they use many more tokens, so they're worth it only for the right kind of job.

## Why use more than one agent?

You already know from [Planning](planning.html) that agents break big goals into steps. A team takes that one step further: instead of doing the steps one after another, it does several *at the same time*, each with its own agent. That brings three benefits.

**1. Parallel work — it's faster.** If you need to compare six apps, one agent researches them one by one. Six helpers can research one each, at the same time. Like six friends each grabbing one item in the supermarket instead of one person walking every aisle.

**2. Specialists — each one is focused.** Each helper can be set up for one kind of work, with its own instructions and only the tools it needs. A "fact-checker" agent can be told to be picky and sceptical; a "writer" agent can be told to be clear and friendly. It's easier to be excellent at one thing than at everything at once.

**3. A fresh, uncluttered memory.** This one is less obvious, but it's often the biggest win. Remember from [Memory](memory.html) that an agent's working memory — its context window — fills up as it reads. A single agent researching six apps ends up with a backpack stuffed with web pages, and older details start to fall out. Each helper starts with an **empty backpack**, reads only what its task needs, and sends back a short summary. The lead stays focused on the big picture instead of drowning in details.

> [!ANALOGY] Like a group project done right
> A good group project has one person who splits up the work, gives everyone a clear piece, and stitches it together at the end. A bad group project has four people all rewriting the same introduction. Agent teams succeed or fail for exactly the same reasons: **clear division of work, clear briefs, and someone responsible for the final result.**

## The race: one agent vs. a team

Here's a job that suits a team: comparing six project-management apps. Set the number of helper agents with the slider, then press **▶ Race!** Watch both the finishing time *and* the token count. Try it with 1 helper, then with 3, then with 6.

<div data-widget="team-race"></div>

What did you notice? With three helpers, the team finished roughly twice as fast — but used well over twice as many tokens. Adding more helpers makes it faster still, but the gains shrink: the lead still has to plan at the start and merge at the end, and those steps don't get shorter no matter how many helpers you add. And with only **one** helper, the team was actually *slower* than the solo agent, because it paid for planning and merging without gaining any parallel work. (The numbers in the race are illustrative, but the pattern is real.)

## How a lead agent runs a team

The most common setup is called the **lead and helpers** pattern (engineers often say **orchestrator and workers** — an orchestrator being the conductor who keeps everyone in time). Here's how it usually goes:

<div class="steps-strip">
<div><strong>Plan</strong>The lead breaks the goal into parts that can be done separately.</div>
<div><strong>Brief</strong>Each helper gets a clear task, what to return, and what to avoid.</div>
<div><strong>Work in parallel</strong>Helpers search, read and write on their own.</div>
<div><strong>Report back</strong>Each sends a short summary, not everything it read.</div>
<div><strong>Merge &amp; check</strong>The lead combines the pieces and fixes conflicts.</div>
</div>

The **briefs** matter enormously. A helper starts with an empty memory, so it knows nothing except what the lead tells it. A vague brief like "research competitors" leads to helpers duplicating each other or wandering off. A good brief says exactly which part is theirs, what format to return, and where to stop — just like the instructions *you* give an agent (you'll practise that in [Giving great instructions](great-instructions.html)).

And the **merge** is where the lead earns its keep. Each helper only sees its own piece, so only the lead can notice that two pieces contradict each other. Watch it happen in this short run, where a lead agent plans a product launch with three helpers:

<div class="sim" data-sim="ch-agent-teams"></div>

> [!TRY] Watch the merge step closely
> Around step 7, the lead spots that the timeline and the FAQ disagree about when orders ship. Neither helper could have caught that alone. Also notice Helper A marking a price as **unconfirmed** instead of guessing — a habit you want in every agent.

<div class="detail">

**What a "helper" really is:** technically, a helper (often called a **subagent**) is just another run of a language model with its own instructions, its own tools and its own fresh context. The lead creates one by calling a tool — something like "start a subagent with this task" — and receives the helper's final message back as the tool's result. The helper's full working notes stay in its own context and are thrown away; only its summary reaches the lead. As of 2026, several agent products and developer kits offer this built in — for example, Claude Code can start subagents, and the OpenAI Agents SDK and Google's Agent Development Kit both support multi-agent setups.

</div>

## Handoffs: passing the baton

Not every team works in parallel. Sometimes agents work **in a relay**, each one doing its part and then passing the job — and everything learned so far — to the next specialist. This is called a **handoff**.

Customer service is the classic example. A front-desk agent greets the customer and works out what they need. If it's a refund, it hands off to a billing agent that has access to the payment system. If it's a broken product, it hands off to a technical support agent. Each specialist only gets the tools it needs, which is both tidier and safer: the front-desk agent can't touch payments at all. You can watch a customer-service agent at work in the [support agent example](example-support-agent.html).

The danger in a relay is the same as in the children's game of telephone: details get lost along the way. Good handoffs pass on a clear summary — *who the customer is, what they asked, what's been tried* — so the customer never has to repeat themselves.

> [!EXAMPLE] See teams and specialists at work
> - The [research agent](example-research-agent.html) splits a big question about heat pumps among three helpers — and sends out a fourth when two sources disagree.
> - The [writing team](example-writing-team.html) shows specialist agents sharing one writing job.

## The catch: teams are expensive

Here's the honest trade-off. Every helper reads, thinks and writes on its own — and you pay for every one of those tokens. Three helpers reading ten web pages each means thirty pages of reading, plus the lead's planning, briefing and merging on top. A team can easily cost several times what a single agent would for the same goal.

<div class="detail">

**A real-world data point:** in a 2025 write-up about building its multi-agent research feature, Anthropic reported that agents used roughly 4 times as many tokens as an ordinary chat, and its multi-agent system roughly 15 times as many. It also found the team setup did substantially better than a single agent on its internal research tests — mainly because spreading the work across helpers let the system read and reason over far more material. The lesson they drew: multi-agent systems pay off when the task is valuable enough, and broad enough, to justify the extra cost.

</div>

Speed and thoroughness aren't free. So it's worth asking, before reaching for a team: *is the extra cost buying me something I actually need?*

## When one agent is better

Teams shine on **wide** tasks: lots of separate pieces that don't depend on each other, like researching many companies, checking many documents, or exploring several possible explanations at once.

One agent is usually better when:

| Situation | Why one agent wins |
|---|---|
| ✍️ Editing a single document or email | Every sentence depends on the others; several writers would clash |
| 🔗 Steps that depend on each other | Step 3 needs the result of step 2, so there's nothing to do in parallel |
| 🧩 Everyone needs the same full picture | Splitting it up means each helper misses context the others have |
| 🐣 Small or quick tasks | The planning and merging overhead costs more than it saves |
| 💸 Tight budgets | A team multiplies the token bill |

Teams also bring their own new kinds of mistakes: two helpers doing the same work, helpers making conflicting choices (one picks a blue theme, another a green one), or a lead that merges confidently without checking. More agents means more to coordinate — and more to review.

> [!TIP] A simple rule of thumb
> Start with **one agent**. Reach for a team only when the job naturally splits into several big, independent chunks — and when finishing faster or covering more ground is worth paying more.

```prompt
I need to research [topic, e.g. "five project-management apps for a 10-person team"].
If you can use helper agents (subagents), split the work so each helper covers one [item/angle] independently. Give each helper a clear brief and ask for a short summary with sources.
Then merge the results into one comparison table, point out any places where the helpers' findings disagree, and mark anything you couldn't confirm as "unconfirmed" rather than guessing.
```

## Quick check

```quiz
Q: Which task is the best fit for a team of agents working in parallel?
- [ ] Polishing the wording of one short email
- [x] Researching twelve different suppliers and comparing them
- [ ] Doing a calculation where each step needs the last result
- [ ] Answering a quick question about a single fact
E: Researching many suppliers splits naturally into independent pieces, so helpers can work at the same time. Editing one email or a chain of dependent steps leaves nothing to do in parallel — one agent is better.

Q: Besides speed, why does giving each helper its own fresh context help?
- [ ] Fresh helpers are smarter than the lead agent
- [ ] It means nobody needs to check the final result
- [x] Each helper reads only what its task needs, so no single memory overflows
- [ ] It makes the whole team use fewer tokens in total
E: Each helper starts with an empty "backpack" and returns just a short summary, keeping the lead focused. But it doesn't reduce total tokens — the team as a whole usually uses many more.

Q: In the product-launch run, what job could only the lead agent do?
- [ ] Reading the product specification
- [ ] Searching rival companies' websites
- [ ] Writing the launch-week timeline
- [x] Spotting that the timeline and the FAQ contradicted each other
E: Each helper only saw its own piece. Only the lead, comparing all the pieces side by side, could notice the shipping-date clash — that's why the merge-and-check step matters so much.
```

## What's next

Whether it's one agent or a whole team, everything starts with what *you* ask for. Next: [giving great instructions](great-instructions.html) — the simple recipe that turns a vague request into exactly the result you wanted.
