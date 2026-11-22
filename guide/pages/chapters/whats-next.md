---
title: "What's next for agents (and for you)"
emoji: "🔭"
subtitle: "How quickly agents are improving, what's still hard, how work may change — and a simple 7-day plan to start using agents yourself."
minutes: 12
---

A few years ago, the most impressive thing an AI could do was write a decent paragraph. Today, agents fix software bugs, research topics across dozens of sources, clean spreadsheets and handle customer questions — often working on their own for long stretches. Things are moving fast.

In this final chapter, we'll look at how fast, and in which direction. We'll be honest about what's still hard, think about what it means for work, and finish with a practical plan so you can start using agents this week.

> [!KEY] The short version
> Agents can work on their own for **longer and longer** before they need help — and that trend has been remarkably steady. But they still make mistakes, still need clear goals, and still need people to check what matters. The skills that make you good at working *with* agents are worth building now.

## Agents can work on their own for longer and longer

How do you measure progress in agents? One clever answer comes from **METR**, an independent research organization that studies what AI systems can do. Instead of asking "how smart is the AI?", they ask a more practical question: **how long a task can an agent complete on its own?**

Here's how it works. They collect many tasks — mostly software and reasoning tasks — and time how long skilled humans take to do each one. Some take a minute, some take hours. Then they see which tasks the AI agents can complete. An agent's **time horizon** is the length of task (in human time) it succeeds at about **half the time**.

Press **Animate** to see how that time horizon has grown. Note that the bars use a special scale where each step up is many times bigger than the last:

<div data-widget="horizon-chart"></div>

From a few seconds in 2019 to several hours by 2026. METR found that this length has **doubled roughly every seven months** over the long run since 2019, and that the pace appears to have picked up in recent years. A doubling every seven months means about ten times longer every two years or so.

> [!ANALOGY] How far can you hike without a map?
> Think of agents as hikers who can walk a trail alone until they get lost. In 2019, they got lost after a few steps. Now they can hike for hours before needing directions. They haven't just become faster walkers — they've become much better at noticing wrong turns, checking the map and getting back on track. That's the reliability skill from [Making agents reliable](reliable-agents.html), improving over time.

It's important to read this chart carefully:

- **"Half the time" isn't "reliably".** At the edge of their time horizon, agents fail about as often as they succeed. For tasks you need done right nearly every time, the comfortable length is much shorter.
- **Test tasks are tidier than real work.** The tasks have clear instructions and clear success checks. Real jobs involve vague goals, office politics, missing information and shifting plans.
- **Trends can change.** Nobody knows for certain whether this pace will continue, speed up or slow down.

<div class="detail">

**Why "time horizon" is a clever measure:** most AI tests become useless once AIs ace them. Measuring by task length gives one scale that works for both weak and strong systems, and it connects directly to usefulness: an agent that can handle two-hour tasks can take over very different work than one limited to two-minute tasks. METR also reports a stricter version — the task length agents complete 80% of the time — and it is consistently several times shorter than the 50% figure. That gap is a good reminder of why human checking still matters. If you want the latest numbers, look at METR's own published measurements rather than headlines, since they update them as new models appear.

</div>

## What's still hard

For all the progress, as of 2026 some things remain genuinely difficult for agents:

- **Messy, unclear goals.** Agents do best with a clear target. "Sort out the Henderson situation" requires context and judgment they often lack.
- **Knowing what they don't know.** Agents still sometimes guess confidently instead of saying "I'm not sure" or asking.
- **Long tasks without checks.** As you saw with the error chain, long tasks without a way to verify progress still go wrong often.
- **Security.** [Prompt injection](staying-safe.html) has no complete fix yet, so agents with broad access still need careful limits.
- **Taste and relationships.** Knowing what a particular client will love, how a colleague is feeling, or which idea fits your company's culture is still very human work.
- **Accountability.** An agent can't be responsible for a decision. Someone still has to own the outcome.

## How work may change

No one can predict exactly how agents will reshape jobs, and you should be skeptical of anyone who claims to. But some shifts are already visible in teams that use agents heavily.

**From doing to directing.** More of the work becomes *deciding what to do, briefing an agent, and reviewing the result*. In a way, everyone becomes a bit of a manager — of AI helpers instead of (or as well as) people.

**Some skills become more valuable, not less:**

| Skill | Why it matters more with agents |
|---|---|
| ✍️ **Clear communication** | A great brief gets great work; a vague one gets vague work |
| 🧠 **Expertise in your field** | You can only spot an agent's mistake if you know what "right" looks like |
| 🔍 **Checking and judgment** | Reviewing well is the new bottleneck |
| ❤️ **Human connection** | Trust, empathy and persuasion stay firmly human |
| 🌱 **Learning fast** | Tools change every few months; curious people keep up |

**Smaller teams can do bigger things.** A small business with a few well-used agents can do research, support and analysis that once needed a much larger staff. That's exciting for individuals and small organizations — and it's also why thoughtful conversations about fairness, training and jobs matter.

> [!NOTE] Don't skip the learning
> If an agent always writes your reports, you may stop learning how to write good reports — and then you can't judge the agent's work. Use agents to go faster, but keep practicing the core skills of your field. The chapter on [learning faster](learn-faster.html) shows how to use AI to build skills, not replace them.

## Your 7-day plan for getting started

Reading about agents is one thing. Using them is how it really clicks. Here's a gentle plan: about 20–30 minutes a day, with any capable AI assistant or agent you have access to (at work, use your company's approved tool).

| Day | Try this | Helpful chapter |
|---|---|---|
| **1** | Ask an agent to research a question you care about, with sources. Open two of the sources. | [What is an agent?](what-is-an-agent.html) |
| **2** | Learn something new: ask the AI to tutor you with questions instead of just explaining. | [Learning faster](learn-faster.html) |
| **3** | Hand off one repetitive, checkable work task, such as meeting notes or a data cleanup. | [Getting more done at work](agents-at-work.html) |
| **4** | Write a reusable brief for a task you do every week, and save it. | [Giving great instructions](great-instructions.html) |
| **5** | Ask for a report with a "done when" checklist, then spot-check numbers and sources. | [Making agents reliable](reliable-agents.html) |
| **6** | Review what your AI tools can access and do on their own. Turn on approvals where needed. | [Staying safe](staying-safe.html) |
| **7** | Look back: what saved time, what didn't, and what will you keep doing? | (this chapter) |

Here's a prompt to make Day 1 easy:

```prompt
I'd like to understand [a topic you're curious about or need for work].
Please research it using several reliable sources and give me:
1. A plain-language summary (under 250 words).
2. The 3 most important facts, each with a link to where you found it.
3. One thing experts disagree about.
4. What I should read next if I want to go deeper.
If you can't find a good source for something, say so instead of guessing.
```

And one for Day 7, to turn the week into a habit:

```prompt
This week I used AI agents for these tasks: [list them, with a note on how each went].
Help me reflect:
1. Which tasks saved me the most time, and why?
2. Where did I spend too long checking or fixing — and how could a better brief help?
3. Suggest 3 recurring tasks in my work as a [your role] that would be good to delegate next, and one I should keep doing myself.
Keep it practical and short.
```

> [!TRY] Make it stick
> Put a 20-minute "agent practice" slot in your calendar each day this week. Small, regular experiments teach you far more than one big attempt — and you'll quickly develop a feel for what agents are good at.

## Where to go deeper

You've finished the guide — congratulations! Here's where to go next:

- 👀 **[Examples](examples.html)** — watch twelve agents at work, from [customer support](example-support-agent.html) to [incident response](example-incident-responder.html) and a [voice agent](example-voice-agent.html).
- ✨ **[Prompt library](prompts.html)** — ready-to-use prompts for learning, work and everyday tasks.
- 🎓 **[Agent Academy](../index.html)** — our in-depth course for when you want the full technical story, from tool design to evaluation and multi-agent systems.
- 📚 **[All chapters](chapters.html)** — revisit any topic whenever you need a refresher.

## Quick check

```quiz
Q: What does METR's "time horizon" measure?
- [ ] How many hours an agent can run before its computer shuts down
- [x] The length of task (in human time) an agent completes about half the time
- [ ] How far into the future an AI can predict events
- [ ] How long it takes a human to check an agent's work
E: The time horizon is the length of tasks — measured by how long skilled humans take — that an agent succeeds at roughly 50% of the time. It's about task difficulty, not running time.

Q: Why shouldn't you read the chart as "agents can now reliably do any multi-hour task"?
- [ ] Because the chart only measures typing speed
- [ ] Because agents stop improving after 2026
- [x] Because it reflects 50% success on tidy test tasks, not real-world reliability
- [ ] Because the measurements only include human workers
E: The time horizon marks where agents succeed about half the time, on tasks with clear instructions and checks. Messy real work and near-certain success are both much harder. Nobody knows exactly how the trend will continue.

Q: As agents take on more work, which skill is likely to become MORE valuable?
- [ ] Typing quickly
- [ ] Memorizing facts and figures
- [ ] Avoiding AI tools entirely
- [x] Judging whether work is correct
E: Agents can type and recall facts instantly. Knowing what "right" looks like — and catching mistakes — is what makes you effective at directing and reviewing agent work.
```

## What's next

That's the end of the guide — but really, it's the beginning. Pick one thing from your 7-day plan and try it today. Then explore the [examples](examples.html), grab a prompt from the [prompt library](prompts.html), or dive into [Agent Academy](../index.html) when you're ready to go deeper. Happy delegating!
