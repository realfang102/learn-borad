---
title: "What's next for agents (and for you)"
emoji: "🔭"
subtitle: "How fast agents are improving, what's still hard, and a 7-day starter plan."
minutes: 9
---

A few years ago, AI's party trick was a decent paragraph. Today agents fix software bugs, research across dozens of sources, clean spreadsheets and answer customers — often alone, for long stretches.

How fast is this moving, what's still hard, and how do you start?

> [!KEY]
> Agents work alone for longer every year — but people still set the goals and check the work.

## Longer and longer on their own

How do you measure agent progress? **METR**, an independent research organization that studies what AI systems can do, asks a practical question: **how long a task can an agent complete on its own?**

They time skilled humans on many tasks — mostly software, cybersecurity and AI research — then see which ones agents complete. An agent's **time horizon** is the task length (in human time) it succeeds at about **half the time**.

Press **Animate**. The chart uses a **log scale**: each step up means many times longer.

<div data-widget="horizon-chart"></div>

From a few seconds in 2019 to several hours by 2026. METR found the horizon **doubled roughly every seven months** since 2019, and the pace appears to have picked up recently. That's about ten times longer every two years or so.

> [!ANALOGY] Hiking without a map
> Agents hike alone until they get lost. In 2019, that took a few steps; now, hours. The gain is in noticing wrong turns and recovering — the skill from [Making agents reliable](reliable-agents.html).

Read the chart carefully:

- **"Half the time" isn't "reliably".** At the edge, agents fail as often as they succeed. For near-certain results, the comfortable length is much shorter.
- **Test tasks are tidier than real work.** They have clear instructions and success checks. Real jobs have vague goals, missing information and shifting plans.
- **Trends can change.** Nobody knows whether this pace will hold, speed up or slow down.

<div class="detail">

**Why "time horizon" is a clever measure:** most AI tests become useless once AIs ace them. Measuring by task length gives one scale that works for both weak and strong systems, and it connects directly to usefulness: an agent that can handle two-hour tasks can take over very different work than one limited to two-minute tasks. METR also reports a stricter version — the task length agents complete 80% of the time — and it is consistently several times shorter (roughly five times, in their first study) than the 50% figure. That gap is a good reminder of why human checking still matters. METR has also checked other kinds of tasks and found similar rising trends, though the actual lengths vary a lot by type of work. For the latest numbers, look at METR's own published measurements rather than headlines, since they update them as new models appear.

</div>

## What's still hard

As of 2026, some things remain genuinely difficult:

- **Messy goals.** "Sort out the Henderson situation" needs context and judgment agents often lack.
- **Knowing what they don't know.** They still sometimes guess confidently instead of asking.
- **Long tasks without checks.** As the error chain showed, unverified long tasks often go wrong.
- **Security.** [Prompt injection](staying-safe.html) has no complete fix, so broad access needs careful limits.
- **Taste and relationships.** What a client will love, how a colleague feels, what fits your culture — still human work.
- **Accountability.** An agent can't own a decision. Someone must.

## How work may change

No one can predict exactly how agents will reshape jobs — be skeptical of anyone who claims to. But teams that use agents heavily already show some shifts.

**From doing to directing.** More work becomes *deciding, briefing and reviewing*. Everyone becomes a bit of a manager — of AI helpers instead of (or as well as) people.

**Some skills grow more valuable:**

| Skill | Why it matters more |
|---|---|
| **Clear communication** | Great brief, great work; vague brief, vague work |
| **Expertise in your field** | You can only spot mistakes if you know what "right" looks like |
| **Checking and judgment** | Reviewing well is the new bottleneck |
| **Human connection** | Trust, empathy and persuasion stay human |
| **Learning fast** | Tools change every few months |

**Smaller teams, bigger things.** A small business with a few well-used agents can do research, support and analysis that once took a larger staff — which is also why fairness, training and jobs deserve thoughtful discussion.

> [!NOTE] Don't skip the learning
> If an agent always writes your reports, you may lose the skill to judge its work. Keep practicing your core skills — [Learning faster](learn-faster.html) shows how.

## Your 7-day plan

About 20–30 minutes a day, with any capable AI assistant or agent (at work, your company's approved tool).

| Day | Try this | Helpful chapter |
|---|---|---|
| **1** | Research a question you care about, with sources. Open two. | [What is an agent?](what-is-an-agent.html) |
| **2** | Get tutored with questions, not just explanations. | [Learning faster](learn-faster.html) |
| **3** | Hand off one repetitive, checkable task, like meeting notes. | [Getting more done at work](agents-at-work.html) |
| **4** | Write and save a reusable brief for a weekly task. | [Giving great instructions](great-instructions.html) |
| **5** | Ask for a report with a "done when" checklist; spot-check it. | [Making agents reliable](reliable-agents.html) |
| **6** | Review what your AI tools can access and do alone. Add approvals. | [Staying safe](staying-safe.html) |
| **7** | Look back: what saved time, what didn't, what will you keep? | (this chapter) |

For Day 1:

```prompt
I'd like to understand [a topic you're curious about or need for work].
Research it using several reliable sources and give me:
1. A plain-language summary under 250 words.
2. The 3 most important facts, each with a source link.
3. One thing experts disagree about.
4. What to read next.
If you can't find a good source, say so instead of guessing.
```

For Day 7, to turn the week into a habit:

```prompt
This week I used AI agents for: [tasks, with how each went].
Help me reflect:
1. Which saved the most time, and why?
2. Where did checking or fixing take too long — would a better brief help?
3. Suggest 3 recurring tasks for a [your role] to delegate next, and one to keep doing myself.
Short and practical.
```

> [!TRY] Make it stick
> Book a daily 20-minute "agent practice" slot this week. Small, regular experiments beat one big attempt.

## Where to go deeper

You've finished the guide — congratulations!

- **[Examples](examples.html)** — twelve agents at work, from [customer support](example-support-agent.html) to [incident response](example-incident-responder.html) and a [voice agent](example-voice-agent.html).
- **[Prompt library](prompts.html)** — ready-to-use prompts for learning, work and everyday tasks.
- **[Agent Academy](../index.html)** — our in-depth course: tool design, evaluation, multi-agent systems.
- **[All chapters](chapters.html)** — revisit any topic.

## Quick check

```quiz
Q: What does METR's "time horizon" measure?
- [x] How long a task, timed on skilled humans, agents finish half the time
- [ ] How many hours in a row an agent can keep working before it stops
- [ ] How far into the future an AI model can accurately predict events
- [ ] How long a skilled human needs to check an agent's finished work
E: The time horizon is the length of tasks, measured by how long skilled humans take, that an agent succeeds at about half the time. It's tempting to read it as how long the agent runs, but it's about how big a task is, not running time.

Q: Why shouldn't you read the chart as "agents can now reliably do any multi-hour task"?
- [ ] Because the times show how long agents took, not how long humans took
- [ ] Because experts agree the trend will stop sometime after 2026
- [x] Because it means 50% success on tidy test tasks, not reliability
- [ ] Because each bar shows only an agent's single luckiest attempt
E: The time horizon marks where agents succeed about half the time, on test tasks with clear instructions and checks. Messy real work and near-certain success are both much harder. The times are human times, and nobody knows for sure how the trend will continue.

Q: As agents take on more work, which skill is likely to become MORE valuable?
- [ ] Typing quickly and accurately
- [ ] Memorizing lots of facts and figures
- [ ] Steering clear of AI tools entirely
- [x] Judging whether work is correct
E: Agents can type and recall facts instantly. Knowing what "right" looks like, and catching mistakes, is what makes you effective at directing and reviewing agent work. Avoiding AI won't protect your skills; using it while keeping your judgment sharp will.
```

## What's next

That's the end of the guide — and really, the beginning. Pick one thing from your 7-day plan and try it today. Then explore the [examples](examples.html), grab a prompt from the [prompt library](prompts.html), or dive into [Agent Academy](../index.html) when you're ready. Happy delegating!
