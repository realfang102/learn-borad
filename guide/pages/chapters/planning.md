---
title: "Planning: breaking big goals into steps"
emoji: "🗺️"
subtitle: "How agents turn a fuzzy goal into steps, and adapt when things break."
minutes: 8
---

Think of the last big thing you organized: a party, a move, a group trip. You wrote a list: *pick a date, book the place, invite people, order food.* When the restaurant was full, you crossed it out and wrote a new line.

That's planning, and capable agents do it too. Asked to "organize our team offsite", an agent doesn't start clicking. It breaks the goal into steps and works through them, adjusting as it learns.

> [!KEY]
> **Planning** turns one large goal into small, doable steps, and keeps updating the list as you go.

## Why small steps

"Write a report on e-bikes" doesn't say what to do *right now*. "Search for recent sales data" does. Chopping a big job into bite-sized ones is called **decomposition**.

Small steps are easier to do, check and fix. That matters for an agent, which works one [loop](the-agent-loop.html) at a time. Without a plan it wanders: wrong order, forgotten parts, victory declared too early.

> [!ANALOGY]
> A navigation app plans the whole route, guides you one turn at a time, and **reroutes** around a closed road. A good agent plans the same way.

## Watch it plan (and replan)

Pick a goal, press **Make a plan**, then **Run the plan**. Something will go wrong.

<div data-widget="plan-tree"></div>

When a step failed, the agent neither stopped nor pretended. It marked the failure, added a **new step** to work around it, and carried on. A good plan bends instead of breaks.

## The to-do list

Many agents keep a literal to-do list. The [coding agent example](example-coding-agent.html) shows one: *Reproduce the bug, Find the discount code, Fix it, Run all tests, Explain the fix*, each ticked off in turn.

A written list:

1. **Keeps the goal in view** on a long job. Working memory is limited ([Memory](memory.html)), and a short list is a cheap way to hold what matters.
2. **Shows you progress**: what's done and what's next.
3. **Stops "done too soon."** Unticked items mean unfinished work, however confident the agent feels.

<div class="detail">

**How this works in real tools:** as of 2026, several coding and research agents (Claude Code is one example) give the model a dedicated "to-do" tool. The model calls it to write or update its task list, and the app shows that list to you. Other agents simply keep a plan in a notes file they can re-read. Either way, the list lives *outside* the model's head, so it survives when older parts of the conversation are summarized or forgotten.

</div>

## Plan first, or as you go?

Two broad styles, and good agents mix them:

| Style | How it works | Best when… | Everyday example |
|---|---|---|---|
| **Plan, then act** | Write the full plan, then follow it | Steps are fairly predictable | Following a recipe |
| **Step by step** | Decide the next step, see the result, decide again | Steps depend on what happens | Exploring a new city |

Most agents sketch a rough plan, start, and **replan** when something changes the picture: a site is down, a file is missing, a test fails, sources disagree.

> [!TIP] See the plan first
> For bigger tasks, add: *"Before you start, show me your plan and wait for my OK."* You'll catch misunderstandings in ten seconds, not ten minutes. Many agents offer a "plan mode" for exactly this.

<div class="detail">

**The names engineers use:** the "step by step" style is often called **ReAct** (*reason + act*), from a 2022 research paper in which a model alternated between writing a thought and taking an action. "Plan, then act" is often called **plan-and-execute**. Plan-and-execute can be cheaper and more predictable because the expensive thinking happens once; ReAct handles surprises better. Modern agents usually blend the two: a plan revised after each observation.

</div>

## Checking its own work

Good planning includes pausing to ask, *"Did that work? Am I on track?"* This is **reflection**, or **self-checking**:

- **After each step:** "These results are from 2019, too old. Search again."
- **Before finishing:** "Did I answer all three questions and cite every number?"
- **Against the real world:** run the tests, reopen the saved file, reread the email before sending.

That last kind is strongest. Rereading your own answer misses your blind spots, like proofreading your own essay. An outside signal, such as a test, a calculator or the actual web page, is hard to fool. That's why tests make coding agents reliable bug-fixers. More in [Making agents reliable](reliable-agents.html).

<div class="steps-strip">
<div><strong>Plan</strong>Break the goal into small, checkable steps.</div>
<div><strong>Do one step</strong>Act with a tool.</div>
<div><strong>Check</strong>Look at the real result.</div>
<div><strong>Update</strong>Tick it off, or add a step to fix the problem.</div>
<div><strong>Final review</strong>Does the result match the goal?</div>
</div>

### A note on "thinking" models

Some apps have a "thinking" or "reasoning" mode: the model works through a problem in a private scratchpad before answering, like rough working in an exam.

For agents, that time helps most with planning: weighing options, spotting dependent steps, finding gaps. It costs time and money, so save it for tricky, many-step tasks, not "what's the capital of France?"

<div class="detail">

**What's going on inside:** a "thinking" model generates extra text, often called reasoning or thinking tokens, before its final reply. Nothing magical: it's the same next-word prediction from [The AI brain](the-ai-brain.html), given room to work step by step. Models are trained to make this scratchpad useful, and many products let you set a "thinking budget". One honest caveat: researchers have found the visible reasoning doesn't always perfectly reflect *why* the model reached its answer, so judge the agent by its results, not only its notes.

</div>

## Helping an agent plan

Planning is the agent's job, but you can make it better:

- **Describe the finish line.** "A one-page summary with three options and prices" gives it a target. (See [Giving great instructions](great-instructions.html).)
- **Flag known traps.** "The venue must be step-free" saves planning around a wrong guess.
- **Review the plan for big jobs.** Thirty seconds is the cheapest quality check there is.
- **Welcome replanning.** "The first approach failed, so I'm trying X" is good work. An agent that never reports a problem on a messy task deserves *more* suspicion.

> [!TRY]
> Watch the [research agent](example-research-agent.html) split a big question and adapt when sources disagree, or the [incident responder](example-incident-responder.html) test a theory and change course when evidence points elsewhere.

```prompt
I need to [describe your big goal, e.g. "organize a one-day workshop for 25 people next month"].
Before doing anything:
1. Break this into a step-by-step plan with no more than 8 main steps.
2. For each step, say how you'll know it's done.
3. Flag any step where you need information or a decision from me.
Then wait for my OK before starting. If a step fails while you're working, tell me what happened and how you're changing the plan.
```

## Quick check

```quiz
Q: Why do agents break a big goal into smaller steps before acting?
- [ ] Models can only read a few short sentences at a time
- [x] Small steps are easier to do, check and fix along the way
- [ ] Splitting the work makes the final answer longer and richer
- [ ] With a detailed plan, the agent never has to change course
E: Decomposition turns a vague goal into concrete, checkable steps. It doesn't lock the plan in place: good agents replan whenever a step fails or they learn something new. And models can read very long texts; the problem is knowing what to do *next*.

Q: In the planning playground, a step failed (for example, the venue was fully booked). What did the agent do?
- [ ] It told the user the goal was now impossible
- [ ] It quietly skipped the step and pretended it worked
- [x] It marked the failure and added a workaround step
- [ ] It started the whole plan again from the very beginning
E: That's replanning: notice the failure honestly, adapt the plan with a new step, and keep going with everything else. Restarting from scratch would waste all the work already done.

Q: Which kind of self-check is hardest for an agent to fool itself with?
- [ ] Re-reading its own answer and deciding it looks fine
- [ ] Asking itself how confident it feels about the result
- [ ] Writing out a longer explanation of its own reasoning
- [x] Comparing against an outside result, like a test
E: Re-reading your own work, or explaining it at greater length, misses your own blind spots, and feeling confident proves nothing. An outside check (a test that passes or fails, a calculator, the actual source) tells the agent the truth even when it's confident and wrong.
```

## What's next

Some jobs are so big, or have so many separate parts, that it helps to split them among **several agents at once**. Next: [teams of agents](agent-teams.html), and why they're faster but costlier.
