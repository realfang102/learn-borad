---
title: "The agent loop"
emoji: "🔁"
subtitle: "The think, act, observe cycle that turns talk into action."
minutes: 12
---

Think about cooking soup without a recipe. Add salt. Taste. Bland, so add more. Taste. Too thick, so add water. Taste. Perfect. Serve.

You didn't plan every move. You took a step, **checked what happened**, and used that to choose the next one, until the soup was right.

That's how an agent works. The [last chapter](the-ai-brain.html) gave you the brain, which can't look anything up or act alone. This one adds the **agent loop**: the cycle that lets it act, see results, and keep going until the goal is reached.

> [!KEY]
> **Think** about the next step → **act** with a tool → **observe** the result → repeat, until the goal is done or a person needs to decide.

## Think, act, observe, repeat

Watch the robot go round.

<div data-widget="hero-loop"></div>

It doesn't guess the weather. It *uses a tool*, *reads* the result, and only then decides what to pack.

<div class="steps-strip">
<div><strong>Think</strong>Look at the goal and what's known. Pick the single best next step.</div>
<div><strong>Act</strong>Do it, usually with a tool: search, read a file, send a message.</div>
<div><strong>Observe</strong>Read what came back. Did it work? Any surprise?</div>
<div><strong>Repeat</strong>Back to Think with the new information, or stop if the goal is reached.</div>
</div>

A chatbot answers once. An agent **feeds each result back into its thinking**, so it knows a little more every turn. That's how it handles tasks whose steps can't be planned in advance.

> [!ANALOGY]
> A GPS works in a loop too. When you miss a turn, it doesn't give up: it **recalculates** from where you are now.

## Watch it plan a weekend

Jordan asks an agent to plan a hiking weekend and book a cabin. It has a weather tool and a cabin tool. Press play and watch the loop indicator.

<div class="sim" data-sim="ch-the-agent-loop"></div>

It **checked** the forecast before acting, **adapted** when storms hit Saturday, **verified** the booking, and **asked** before spending money. Click **Not yet** and it books nothing. Then it **stopped**, because the goal was met.

Every [example page](examples.html) runs on this same loop, from the [coding agent](example-coding-agent.html) to the [research agent](example-research-agent.html).

### Your turn: be the agent

Your user's website is suddenly slow. Each round, choose your next action and see what happens.

<div data-widget="be-the-agent"></div>

The best moves gather facts first, follow the evidence, avoid destructive hunches, ask before risky changes, and stop once answered. Those habits separate a helpful agent from a dangerous one.

## When does the loop stop?

Every agent needs to know when to stop. There are four common reasons:

1. **The goal is reached.** The cabin is booked or the bug is fixed. It reports back.
2. **A person needs to decide.** Something is risky, costly or unclear, so it pauses and asks.
3. **It's stuck.** A tool keeps failing or the information isn't there. A good agent says so honestly.
4. **It hits a limit.** The software usually caps steps, time or spending, so a confused agent can't loop forever.

> [!TIP] Define "done"
> Not "look into flights to Lisbon", but "find the three cheapest direct flights to Lisbon on May 3rd, with times and prices. Don't book anything." More in [Great instructions](great-instructions.html).

## Why checking matters

Most of an agent's reliability comes from the "observe" step.

Picture an agent that's right 95% of the time per step. A 20-step task gives it 20 chances to slip, and one early mistake, like a misread number or the wrong company, can quietly spoil everything after. Small errors **add up**.

The cure is to **check as you go**. Good agents read tool results instead of assuming success, verify key facts from a second source, compare the outcome with the goal (right date, amount, person?), and change course on surprises.

See errors pile up for yourself in [Making agents reliable](reliable-agents.html).

> [!WARNING] "Done!" isn't always done
> Agents sometimes declare success too early. For anything important, check the evidence: the booking confirmation, the sent email, the final spreadsheet.

## The brain and the harness

The model never *touches* anything. It can only write text. The doing happens in ordinary software wrapped around it, called the **harness**.

| The model (the brain) | The harness (the hands and rules) |
|---|---|
| Reads the goal and everything so far | Supplies the goal, history and available tools |
| Decides the next step | Runs the tool the model asked for |
| Writes a tool request, like "get the forecast for Pine Ridge" | Sends the result back to the model |
| Decides when the goal is reached | Enforces limits: steps, budgets, permissions |
| Writes the final answer | Asks a human before risky actions |

Every action goes *through* the harness, so it can log, limit or pause any of them for your approval. That makes agents controllable, and lets the same model power a cautious assistant or a fast, independent one.

<div class="detail">

**What a loop really looks like:** under the hood, the harness runs something like this:

1. Send the model the conversation so far plus descriptions of the available tools.
2. The model replies with either a final answer or a structured **tool call** (a tool name plus its inputs).
3. If it's a tool call, the harness checks permissions, runs the tool, and adds the result to the conversation.
4. Go back to step 1. Stop when the model gives a final answer or a limit is hit.

That's genuinely most of it: a real agent loop fits in about twenty lines of code. Coding, research and browser agents differ mainly in *which tools* they have and *what rules* the harness enforces. Watch the messages flow, line by line, in [Under the hood](under-the-hood.html).

</div>

<div class="detail">

**Each turn re-reads everything.** A model keeps no running memory between turns. Each time round, the harness sends the *whole* story so far: the goal, earlier thoughts, every tool result. That's why long tasks get slower and costlier, and why agents eventually need to summarize or forget, the subject of the [Memory](memory.html) chapter.

</div>

## Putting it to work

When you hand a task to an agent:

- **State the goal and finish line** so it knows when to stop.
- **Say where to pause**: "ask me before you send, buy or delete anything."
- **Ask it to check**: "verify the totals" or "confirm the booking matches."
- **Read the trail.** A quick skim of its steps shows whether it looked things up or guessed.

```prompt
Goal: [what you want done, e.g. "find a dentist near my office who's open Saturdays and takes new patients"].
Done means: [what the finished result looks like, e.g. "a short list of 3 options with address, hours and phone number"].
Work step by step and check each fact you find against the source.
Ask me before you [book, buy, send or delete] anything.
At the end, tell me what you checked and anything you couldn't confirm.
```

## Quick check

```quiz
Q: What makes the agent loop different from a chatbot answering once?
- [ ] It runs on a bigger and more capable language model
- [x] It feeds each result back into its next decision
- [ ] It writes longer replies with much more detail in them
- [ ] It follows the same fixed list of steps every time
E: The heart of the loop is "observe": the agent reads what happened and uses it to choose the next step. A bigger model or longer replies don't add that, and a fixed list of steps is the opposite: a script that can't adapt.

Q: In the weekend-trip run, the forecast showed storms on Saturday. What did the loop let the agent do?
- [ ] Book the Saturday hike anyway, since that was the plan
- [ ] Stop and ask Jordan to plan the weekend themselves
- [ ] Book all three cabins in case the plan changed again
- [x] Move the hike to Sunday, still staying Saturday night
E: Observing a surprising result and changing course is exactly what the loop is for. Sticking to the old plan would be unsafe, while giving up or booking everything ignores what Jordan asked for.

Q: Who actually runs a tool, like booking a cabin, when an agent decides to use it?
- [ ] The language model, which clicks the buttons itself
- [x] The harness, the ordinary software around the model
- [ ] The tool runs by itself whenever the model is thinking
- [ ] Nobody, because tools are only described, never run
E: The model can only write a request. The harness carries it out, sends back the result, and can block or pause actions for approval, which is what keeps agents controllable.
```

## What's next

An agent is only as capable as the actions it can take. Next, open the toolbox: **Tools**, how an agent chooses between them, and why a good description makes all the difference.
