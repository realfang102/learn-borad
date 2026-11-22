---
title: "Making agents reliable"
emoji: "🎯"
subtitle: "Why small slips add up, and the checks that make agents dependable."
minutes: 10
---

Picture a 20-step cake recipe. You're careful: each step goes right 95% of the time. But one slip anywhere — salt for sugar, a forgotten egg — ruins the cake. Twenty steps, twenty chances.

Agents face the same problem. A long task is a chain of small steps, and each is a chance to go slightly wrong.

> [!KEY]
> Small errors compound; checking is the cure.

## Why small errors snowball

If each step is 95% right, the chance that *all* go right shrinks with every step. Move the sliders, then tick the box to let the agent check its work.

<div data-widget="error-chain"></div>

At 95% per step, a 20-step task succeeds only about **36%** of the time — worse than a coin flip. With checking, it's about **82%**. Same agent, same task; only the habit changed.

> [!ANALOGY] The game of telephone
> A message whispered down ten people comes out garbled — not from carelessness, but because tiny changes pile up. Let each person check against the original card, and the garbling almost vanishes.

<div class="detail">

**The math, and its limits:** the widget multiplies the per-step success rate by itself once per step: 0.95 × 0.95 × ... twenty times ≈ 0.36. With checking on, it assumes 80% of the mistakes that would have happened get caught and fixed, which makes each step about 99% reliable, and 0.99²⁰ ≈ 0.82. Real tasks are messier: some mistakes are harmless, some steps are much harder than others, and a good agent can notice a problem several steps later and go back. But the core lesson holds, and it's why agent builders obsess over verification: **on long tasks, the ability to notice and recover from mistakes matters as much as raw intelligence.**

</div>

## Your verification habits

Three habits catch most problems:

1. **Test it.** Do the totals add up? Does the link open? Try the formula on a row you know. If it's code, run it.
2. **Check the sources.** Open two or three citations and confirm they say what's claimed.
3. **Double-check what matters most.** Recalculate the number your decision rests on. Reread what goes to your boss.

This agent's survey report hides two typical mistakes. Find them.

<div data-widget="spot-the-mistake"></div>

The classics: an **arithmetic slip** and an **invented citation**. Both sound convincing — confident tone, specific numbers, a plausible name. Models produce *likely-sounding* text, so a fake source can look exactly like a real one. "It sounds right" is never enough.

Ask *"For each key claim, tell me where it came from."* Anything it can't trace to a source or calculation — check it or cut it.

## Let the agent check itself

The biggest idea in reliability: **agents do best when they can check their own work.**

That's why coding agents became useful first. Code has **tests** — small programs that say "pass" or "fail". The [coding agent](example-coding-agent.html) ran tests *before* changing anything (to see the bug) and *after* (to prove the fix). It didn't guess; it saw.

Give everyday tasks the same superpower. Tell the agent how to recognize success:

- **A checklist or rubric** — "cover price, features and reviews for all five products."
- **An example** — "match the structure and tone of last month's report."
- **A number to match** — "still 1,248 customers, revenue total still $84,210."
- **A second opinion** — the agent (or another one) reviews the work as a strict critic.

```prompt
[Describe the task.]
You're done only when ALL of these are true:
- [Check 1, e.g. "every company has a price and a source link"]
- [Check 2, e.g. "totals match the original spreadsheet"]
- [Check 3, e.g. "summary under 300 words"]
Before handing over, go through each check, show how you verified it, and fix any that fail.
```

A vague goal becomes something the agent can **verify**. The [data analyst](example-data-analyst.html) and [research agent](example-research-agent.html) examples double-check numbers and sources the same way.

## Evals: test-drive before you trust

Will an agent handle a job you'll repeat — customer questions, contract summaries? Don't judge one lucky try. Give it a **practice exam**: an **eval** (short for *evaluation*), a set of example tasks with known good answers.

> [!ANALOGY] Tasting night
> Before opening, a restaurant team tastes every dish — several times, because consistency matters. Change a recipe, taste again. An eval is tasting night for your agent.

Run one yourself, no code needed:

<div class="steps-strip">
<div><strong>Collect examples</strong>10–20 real tasks, a few of them tricky.</div>
<div><strong>Define "good"</strong>What each correct answer must include.</div>
<div><strong>Run the agent</strong>Every task, ideally more than once.</div>
<div><strong>Score it</strong>Pass or fail, in a simple spreadsheet.</div>
<div><strong>Improve, re-test</strong>Fix your instructions; rerun the whole set.</div>
</div>

The last step is the magic. Rerunning everything shows whether a fix broke something else. And you get a number — "17 out of 20" — instead of a feeling.

<div class="detail">

**How professionals do it:** companies that build agents run evals with hundreds or thousands of tasks, automatically, every time they change a prompt, a tool or the model. Scoring can be done by exact checks (did the code pass its tests? does the number match?), by human reviewers, or by another AI model grading answers against a rubric — often called "LLM-as-a-judge", which is useful but needs its own spot-checks. Because AI output varies from run to run, they run each task several times and look at the pass rate, not a single result. Public **benchmarks** are big, shared evals that let people compare models — useful, but your own eval on your own tasks tells you far more about your specific job.

</div>

## Limits and human review

Even a well-tested agent needs guardrails that keep a bad run small:

| Limit | What it means | Why it helps |
|---|---|---|
| **Step or time limit** | Stop after, say, 30 actions or 20 minutes | No endless loops when stuck |
| **Budget** | A cap on money or AI usage | No huge bill from a confused agent |
| **Stop-and-ask rules** | Pause when unsure or before risky actions | Guesses become questions |
| **Checkpoints** | Show progress at key moments, like the plan | Catch a wrong direction early |

The cheapest moment to fix a mistake is **the start**. Reviewing the plan first (see [Planning](planning.html)) takes 30 seconds and can save an hour.

**Human review** stays essential for anything that matters — not every step, but where it counts: the plan, the risky actions, the important details.

> [!WARNING] "Teaching to the test"
> Under pressure to pass, an agent may cheat — like editing a test instead of fixing the bug. Say checks must be passed honestly, and look at *how* it passed, not just *that* it did.

## Quick check

```quiz
Q: An agent gets each step right 95% of the time. Why might it still fail a 20-step task most of the time?
- [ ] Agents get tired and make more mistakes as they go
- [x] Small chances of error multiply across many steps
- [ ] 95% accuracy only applies to short tasks
- [ ] The agent forgets the goal after ten steps
E: 0.95 multiplied by itself 20 times is about 0.36. It's not tiredness — each step simply adds another chance for something to go wrong, which is why checking and fixing mistakes along the way matters so much.

Q: What's the best way to help an agent check its own work on a report?
- [ ] Ask it to write the report more slowly
- [ ] Tell it that mistakes are not allowed
- [ ] Use a longer, more detailed prompt about quality
- [x] Give it a clear checklist of what "done" means
E: Concrete success criteria turn a vague goal into something the agent can verify, item by item. Telling it "no mistakes" or simply writing more words doesn't give it anything to check against.

Q: What is an "eval" for an agent?
- [x] A practice exam of sample tasks with known good answers
- [ ] A report the agent writes about how well it thinks it did
- [ ] A single trial run to check that the agent works at all
- [ ] A public leaderboard ranking which AI company is best
E: An eval is like a practice exam: many sample tasks, a clear idea of a good answer, and a score you can re-check every time you change something. A single trial run isn't enough because results vary from run to run, and public leaderboards don't test your specific job.
```

## What's next

You know what agents are, how they work, and how to use them safely and reliably. The [final chapter](whats-next.html) looks ahead: how fast agents improve, what's still hard, and a plan for your own week.
