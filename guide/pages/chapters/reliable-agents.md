---
title: "Making agents reliable"
emoji: "🎯"
subtitle: "Why small slips add up on long tasks — and the checking habits, tests and limits that turn a clever agent into a dependable one."
minutes: 12
---

Think about baking a cake from a recipe with 20 steps. You're a careful baker: you get each step right 95% of the time. Sounds great — until you realize that a single mistake anywhere (salt instead of sugar, a forgotten egg) can ruin the whole cake. Twenty steps, twenty chances to slip.

Agents face exactly this problem. A long task is a chain of many small steps, and every step is a chance for something to go a little wrong. This chapter explains why that matters so much, and the simple habits — for you *and* for the agent — that make agents dependable.

> [!KEY] The reliability recipe
> Small errors compound over many steps. The cure is **checking**: give the agent ways to verify its own work, check the important parts yourself, test the agent on example tasks before you rely on it, and set **limits** so mistakes stay small.

## Why small errors snowball

Here's the arithmetic behind the cake. If each step goes right 95% of the time, the chance that *all* steps go right shrinks with every step you add. Use the sliders to explore — then tick the box to let the agent check its work:

<div data-widget="error-chain"></div>

Did that surprise you? With 95% per step and 20 steps, the whole task succeeds only about **36%** of the time — worse than a coin flip. But when the agent checks its work and fixes most of its mistakes, the same 20-step task succeeds about **82%** of the time. Same agent, same task; the only difference is the habit of checking.

> [!ANALOGY] The game of telephone
> In the children's game, a message whispered down a line of ten people comes out garbled — not because anyone is careless, but because tiny changes pile up. Now imagine each person could quickly check the message against the original card. The garbling would almost vanish. Checking against reality is what stops errors from piling up.

<div class="detail">

**The math, and its limits:** the widget multiplies the per-step success rate by itself once per step: 0.95 × 0.95 × ... twenty times ≈ 0.36. With checking on, it assumes 80% of the mistakes that would have happened get caught and fixed, which makes each step about 99% reliable, and 0.99²⁰ ≈ 0.82. Real tasks are messier: some mistakes are harmless, some steps are much harder than others, and a good agent can notice a problem several steps later and go back. But the core lesson holds and is the reason agent builders obsess over verification: **on long tasks, the ability to notice and recover from mistakes matters as much as raw intelligence.**

</div>

## Your verification habits

When an agent hands you a result, three habits catch most problems:

1. **Test it.** Does it actually work? Open the spreadsheet and see if the totals add up. Click the link. Run the formula on a row you know the answer to. If the agent wrote code, run it.
2. **Check the sources.** Did the facts come from somewhere real? Open two or three of the cited sources and confirm they say what the agent claims.
3. **Double-check what matters most.** Recalculate the one number your decision depends on. Re-read the paragraph that goes to your boss. Compare the agent's summary against the original for anything important.

Let's practice. Here's a short report an agent wrote after analyzing a customer survey. Two sentences contain the kind of mistakes agents really make. Can you find them?

<div data-widget="spot-the-mistake"></div>

Those two mistakes are the classics: an **arithmetic slip** and an **invented citation**. Both sound completely convincing — confident tone, specific numbers, a plausible name. That's what makes them dangerous, and why "it sounds right" is never enough. Language models produce *likely-sounding* text, so a fake source can look exactly like a real one.

> [!TIP] Ask "how do you know?"
> A simple question works wonders: *"For each key claim, tell me where it came from."* Claims the agent can't trace back to a source or a calculation are the ones to check — or remove.

## Give the agent a way to check its own work

Here's the single biggest idea in agent reliability: **agents do best when they can check their own work.**

It's why coding agents became useful first. Code comes with **tests** — small programs that say "pass" or "fail". In the [coding agent](example-coding-agent.html) example, the agent ran the tests *before* changing anything (to see the bug) and *after* (to prove the fix). It didn't have to guess whether it was done; it could see.

You can give agents the same superpower for everyday work. Before the agent starts, tell it how to recognize success:

- **A checklist or rubric** — "the brief must cover price, features and reviews for each of the five products."
- **An example of a great result** — "match the structure and tone of this report from last month."
- **A number to match** — "the cleaned spreadsheet should still have 1,248 customers, and the revenue total should still be $84,210."
- **A second opinion** — ask the agent (or a separate agent) to review the work as a strict critic, looking for errors.

```prompt
[Describe the task.]
You're done only when ALL of these are true:
- [Success check 1, e.g. "every company in the list has a price and a source link"]
- [Success check 2, e.g. "the totals match the original spreadsheet"]
- [Success check 3, e.g. "the summary is under 300 words"]
When you think you're finished, go through this list one item at a time and show me how you checked each one. If any check fails, fix it before handing the work over.
```

This works because it turns a vague goal ("make a good report") into something the agent can **verify**. You'll see the same idea in the [data analyst](example-data-analyst.html) and [research agent](example-research-agent.html) examples, where the agents double-check numbers and sources before reporting.

## Evals: test-driving an agent before you trust it

How do you know if an agent is good enough for a job you'll repeat many times — answering customer questions, say, or summarizing contracts? You don't judge it on one lucky try. You give it a **practice exam**.

In AI, a practice exam like this is called an **eval** (short for *evaluation*): a set of example tasks where you know what a good answer looks like, used to measure how well an agent performs.

> [!ANALOGY] The restaurant's tasting night
> Before a restaurant opens, the chef cooks every dish on the menu and the team tastes each one. Not once — several times, because consistency matters. When they change a recipe, they taste again to make sure nothing else got worse. An eval is a tasting night for your agent.

You can run a simple eval yourself, no code needed:

<div class="steps-strip">
<div><strong>Collect examples</strong>Gather 10–20 real tasks, including a few tricky ones.</div>
<div><strong>Define "good"</strong>Write down what a correct answer must include for each.</div>
<div><strong>Run the agent</strong>Give it every task, ideally more than once.</div>
<div><strong>Score it</strong>Mark each pass or fail in a simple spreadsheet.</div>
<div><strong>Improve, re-test</strong>Fix your instructions, then run the whole set again.</div>
</div>

That last step is the real magic. When you tweak your instructions to fix one problem, re-running the whole set tells you whether you accidentally broke something else. And now you have a number — "17 out of 20" — instead of a vague feeling.

<div class="detail">

**How professionals do it:** companies that build agents run evals with hundreds or thousands of tasks, automatically, every time they change a prompt, a tool or the model. Scoring can be done by exact checks (did the code pass its tests? does the number match?), by human reviewers, or by another AI model grading answers against a rubric — often called "LLM-as-a-judge", which is useful but needs its own spot-checks. Because AI output varies from run to run, they run each task several times and look at the pass rate, not a single result. Public **benchmarks** are simply big, shared evals that let people compare models — useful, but your own eval on your own tasks tells you far more about your specific job.

</div>

## Limits, budgets and human review

Even a well-tested agent should work inside sensible limits — guardrails that keep a bad run small:

| Limit | What it means | Why it helps |
|---|---|---|
| ⏱️ **Step or time limit** | Stop after, say, 30 actions or 20 minutes | Prevents endless loops when the agent is stuck |
| 💰 **Budget** | A cap on spending — money or AI usage | A confused agent can't run up a huge bill |
| ✋ **Stop-and-ask rules** | Pause when unsure or before risky actions | Turns guesses into questions |
| 🚩 **Checkpoints** | Show progress at key moments, like after the plan | You catch a wrong direction early |

Checkpoints deserve special mention. The cheapest moment to fix a mistake is **right at the start**. Asking an agent to show you its plan before it begins (as you saw in [Planning](planning.html)) takes 30 seconds and can save an hour of work in the wrong direction.

Finally, **human review** stays essential for anything that matters. The goal isn't to watch every step — that would defeat the purpose. It's to put your attention where it counts: the plan at the start, the risky actions in the middle, and the important details at the end.

> [!WARNING] Watch out for "teaching to the test"
> An agent under pressure to pass a check may find a shortcut — like a coding agent editing a test so it passes, instead of fixing the bug. Make it clear the checks must be passed honestly, and look at *how* the agent passed, not just *that* it passed.

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
- [ ] A review the agent writes about its own personality
- [x] A set of example tasks with known good answers, used to score it
- [ ] A single test run to see if the agent works at all
- [ ] A ranking of which AI company is best
E: An eval is like a practice exam: many example tasks, a clear idea of a good answer, and a score you can re-check every time you change something. One try isn't enough because results vary from run to run.
```

## What's next

You've learned what agents are, how they work, and how to use them safely and reliably. In the final chapter, we'll look ahead: **how fast agents are improving**, what's still hard, and a simple plan to make agents part of your own week.
