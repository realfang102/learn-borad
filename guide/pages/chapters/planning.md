---
title: "Planning: breaking big goals into steps"
emoji: "🗺️"
subtitle: "How agents turn one big, fuzzy goal into small steps, keep a to-do list, check their work, and change course when something goes wrong."
minutes: 10
---

Think about the last time you organized something big: a birthday party, a move to a new flat, a group trip. You didn't do it all in one go. You probably grabbed a piece of paper (or your phone) and wrote a list: *pick a date, book the place, invite people, order food.* Then you worked through it — and when the restaurant you wanted was full, you crossed that line out and wrote a new one.

That's planning, and it's exactly what capable agents do. Give an agent a big goal like "organize our team offsite" and it doesn't jump straight into clicking buttons. It first breaks the goal into smaller steps, then works through them one at a time, adjusting as it learns more.

> [!KEY] The big idea
> **Planning** means turning one large goal into a list of small, doable steps — and updating that list as you go. Small steps are easier to do, easier to check, and easier to fix when they go wrong.

## Why big goals need small steps

A big goal is vague. "Write a report on e-bikes" doesn't tell you what to do *right now*. But "search for recent sales data" does. Breaking a goal into pieces is called **decomposition** — a fancy word for "chopping a big job into bite-sized ones."

This matters even more for an agent than for you. As you saw in [the agent loop](the-agent-loop.html), an agent works one step at a time: think, act, look at the result, repeat. If it doesn't know what the steps are, it can wander — doing things in the wrong order, forgetting a part of the job, or declaring victory too early. A plan keeps it on track.

> [!ANALOGY] Like a satellite navigation app
> When you type a destination into a navigation app, it first works out the whole route: *turn left, motorway for 20 km, exit 14…* Then it guides you one turn at a time. And if there's a road closure, it doesn't give up — it **reroutes**. A good agent plans the same way: a route first, one turn at a time, and a new route when the road is blocked.

## Watch an agent plan (and replan)

Pick a goal below, press **🧠 Make a plan** to watch the agent break it down, then press **▶ Run the plan** to watch it work through the steps. Keep an eye out — something is going to go wrong.

<div data-widget="plan-tree"></div>

Did you notice what happened when a step failed? The agent didn't stop, and it didn't pretend everything was fine. It marked the step as failed, added a **new step** to work around the problem (like reserving the second-choice venue), and carried on with the rest of the plan. That's the heart of good planning: not a perfect plan, but a plan that bends instead of breaks.

## The to-do list agents keep

Many agents literally keep a to-do list while they work, just like you would. If you watched the [coding agent example](example-coding-agent.html), you saw one: *Reproduce the bug, Find the discount code, Fix it, Run all tests, Explain the fix.* Each item got ticked off as the agent finished it.

Why bother writing it down? Three reasons:

1. **It helps the agent remember.** On a long job, an agent can read and do a lot. A written list keeps the goal in view, so it doesn't lose the thread halfway through. (You'll recall from [Memory](memory.html) that an agent's working memory is limited — a short list is a cheap way to hold on to what matters.)
2. **It shows you what's happening.** You can glance at the list and see where the agent is, what's done and what's next — instead of guessing.
3. **It stops "done too soon."** If two items are still unticked, the job isn't finished, no matter how confident the agent feels.

<div class="detail">

**How this works in real tools:** as of 2026, several coding and research agents (Claude Code is one example) give the model a dedicated "to-do" tool. The model calls it to write or update its task list, and the app shows that list to you. Other agents simply keep a plan in a notes file they can re-read. Either way, the list lives *outside* the model's head, so it survives even when older parts of the conversation are summarized or forgotten.

</div>

## Plan first, or plan as you go?

There are two broad styles, and good agents mix them:

| Style | How it works | Best when… | Everyday example |
|---|---|---|---|
| 🗺️ **Plan, then act** | Write the full plan up front, then follow it | The steps are fairly predictable | Following a recipe |
| 🧭 **Step by step** | Decide only the next step, look at the result, decide again | You can't know the steps until you see what happens | Exploring a new city |

In practice, most agents do a bit of both: they sketch a rough plan, start working, and **replan** whenever they learn something that changes the picture. A website is down, a file is missing, a test fails, a source contradicts another — each of these is a signal to stop, think, and update the list.

> [!TIP] Ask to see the plan first
> For any bigger task, try adding: *"Before you start, show me your plan and wait for my OK."* You'll catch misunderstandings in ten seconds instead of after ten minutes of wasted work — and you can add steps the agent didn't think of. Many agents also offer a dedicated "plan mode" that does exactly this.

<div class="detail">

**The names engineers use:** the "step by step" style is often called **ReAct** (short for *reason + act*), from a 2022 research paper that had a model alternate between writing a thought and taking an action. The "plan, then act" style is often called **plan-and-execute**. Plan-and-execute can be cheaper and more predictable because the expensive thinking happens once; ReAct handles surprises better. Modern agents usually blend the two: a plan that gets revised after each observation.

</div>

## Checking its own work

Planning isn't only about *what to do next*. It's also about pausing to ask: *"Did that actually work? Am I still on track?"* This habit is called **reflection** or **self-checking**.

A careful agent checks in a few ways:

- **After each step:** "The search returned results from 2019 — that's too old. I'll search again for recent data."
- **Before finishing:** "Does my report answer all three questions the user asked? Did I cite a source for every number?"
- **Against the real world, whenever possible:** running the tests, re-opening the file it just saved, or re-reading the email before sending.

That last kind of check is the strongest. An agent re-reading its own answer and thinking "looks good to me" can miss its own mistakes — just like proofreading your own essay. A check that uses an outside signal (a test that passes or fails, a calculator, the actual web page) is much harder to fool. That's why coding agents are so reliable at fixing bugs: the tests tell them the truth. You'll dig deeper into this in [Making agents reliable](reliable-agents.html).

<div class="steps-strip">
<div><strong>Plan</strong>Break the goal into small, checkable steps.</div>
<div><strong>Do one step</strong>Act with a tool.</div>
<div><strong>Check</strong>Did it work? Look at the real result.</div>
<div><strong>Update</strong>Tick it off — or add a new step to fix the problem.</div>
<div><strong>Final review</strong>Does the result match the original goal?</div>
</div>

## A word about "thinking" models

You may have seen AI apps with a "thinking" or "reasoning" mode, where the AI pauses before answering and you can sometimes peek at its notes. These are models trained to work through a problem in a private scratchpad before giving their answer — a bit like doing rough working on scrap paper before writing the final answer in an exam.

For agents, this extra thinking time helps most with planning: weighing options, spotting steps that depend on each other, and noticing when a plan has a gap. It costs more time and money, so it's most worth it for tricky, many-step tasks — not for "what's the capital of France?"

<div class="detail">

**What's going on inside:** a "thinking" model generates extra text — often called reasoning or thinking tokens — before its final reply. Nothing magical happens: it's the same next-word prediction you met in [The AI brain](the-ai-brain.html), just given room to work things out step by step. Models are specifically trained to make this scratchpad useful, and many products let you set a "thinking budget" (how much it may think). One honest caveat: the visible reasoning is a helpful window, but researchers have found it doesn't always perfectly reflect *why* the model reached its answer — so judge the agent by its results, not only by its notes.

</div>

## Helping an agent plan well

You don't need to plan for the agent — that's its job — but you can make its planning much better:

- **Describe the finish line.** "Done means a one-page summary with three options and prices" gives the agent something to plan *toward*. (More on this in [Giving great instructions](great-instructions.html).)
- **Mention what you already know is tricky.** "The venue must be step-free" or "our sales data is in the second tab" saves the agent from planning around a wrong guess.
- **Review the plan for big jobs.** A thirty-second look at the plan is the cheapest quality check there is.
- **Expect replanning — and welcome it.** An agent that says "the first approach didn't work, so I'm trying X" is doing its job well. An agent that never reports a problem on a messy task should make you *more* suspicious, not less.

> [!TRY] See planning in action
> Watch the [research agent](example-research-agent.html) plan its searches and drop weak sources, or the [incident responder](example-incident-responder.html) form a theory, test it, and change course when the evidence points elsewhere.

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
- [ ] Because language models can only read short sentences
- [x] Small steps are easier to do, check and fix, and they keep the agent on track
- [ ] Because it makes the agent's final answer longer and more detailed
- [ ] So the agent never has to change its plan later
E: Decomposition turns a vague goal into concrete, checkable steps. It doesn't mean the plan never changes — good agents replan whenever a step fails or they learn something new.

Q: In the planning playground, a step failed (for example, the venue was fully booked). What did the agent do?
- [ ] It stopped and told the user the goal was impossible
- [ ] It skipped the step and pretended it had succeeded
- [x] It marked the failure and added a new step to work around it
- [ ] It started the whole plan again from the very beginning
E: That's replanning: notice the failure honestly, adapt the plan with a new step, and keep going with everything else. Restarting from scratch would waste all the work already done.

Q: Which kind of self-check is hardest for an agent to fool itself with?
- [ ] Re-reading its own answer and deciding it looks fine
- [ ] Asking itself whether it feels confident
- [ ] Writing a longer explanation of its reasoning
- [x] Checking against an outside signal, like a test result or the real web page
E: Re-reading your own work misses your own blind spots. An outside check — a test that passes or fails, a calculator, the actual source — tells the agent the truth even when it's confident and wrong.
```

## What's next

One agent with a good plan can do a lot. But some jobs are so big — or have so many separate parts — that it helps to split them among **several agents working at once**. Next: [teams of agents](agent-teams.html), and why they're faster but more expensive.
