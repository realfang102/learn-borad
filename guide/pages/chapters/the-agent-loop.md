---
title: "The agent loop"
emoji: "🔁"
subtitle: "The simple think → act → observe cycle that turns a talking AI into one that gets things done."
minutes: 11
---

Think about how you cook a pot of soup without a recipe. You add some salt. You taste. A bit bland — add more. Taste again. Too thick — add water. Taste again. Perfect. Serve.

You didn't plan every move in advance. You took a step, **checked what happened**, and used that to decide the next step. You kept going until the soup was right, and then you stopped.

That's exactly how an AI agent works. In the [last chapter](the-ai-brain.html) you met the brain: a language model that's great with words but can't look anything up or do anything on its own. This chapter adds the missing piece — the **agent loop**, the repeating cycle that lets that brain take actions, see the results, and keep going until a goal is reached.

> [!KEY] The agent loop in one line
> **Think** about what to do next → **act** by using a tool → **observe** the result → repeat, until the goal is done or a person needs to decide.

## Think, act, observe, repeat

Here's the loop in motion. Watch the little robot go round:

<div data-widget="hero-loop"></div>

Notice that the robot doesn't guess the weather. It *uses a tool* to find out, *reads* the result, and only then decides what to pack. Each step of the loop has a clear job:

<div class="steps-strip">
<div><strong>🧠 Think</strong>Look at the goal and everything learned so far. Decide the single best next step.</div>
<div><strong>🛠️ Act</strong>Do that step, usually by using a tool: search, read a file, send a message.</div>
<div><strong>👀 Observe</strong>Read what came back. Did it work? Was there a surprise?</div>
<div><strong>🔁 Repeat</strong>Go back to Think with the new information — or stop if the goal is reached.</div>
</div>

The magic is in that last step. A chatbot answers once and is done. An agent **feeds the results of its actions back into its own thinking**, so every turn of the loop it knows a little more. That's how it can handle tasks where the steps can't be planned in advance.

> [!ANALOGY] Think of it like this
> A GPS navigator works in a loop too. It plans a route, watches where your car actually is, and when you miss a turn or hit traffic, it doesn't give up — it **recalculates** from where you are now. Agents do the same thing with goals.

## Watch the loop plan a weekend

Let's see a complete run. Jordan asks an agent to plan a hiking weekend and book a cabin. The agent has two tools: one that checks the weather and one that searches and books cabins. Press play and keep an eye on the loop indicator as it lights up.

<div class="sim" data-sim="ch-the-agent-loop"></div>

A few things worth noticing:

- **It checked before it acted.** The agent looked at the forecast *before* choosing a day or booking anything.
- **It adapted to a surprise.** Storms on Saturday changed the plan. A rigid script would have booked a Saturday hike anyway.
- **It checked its own work.** After booking, it read the confirmation and compared it with what Jordan asked for.
- **It asked before spending money.** And if you clicked **✋ Not yet**, it stopped without booking anything.
- **It stopped when the goal was met.** No endless extra searching.

For more complete runs, every [example page](examples.html) is built around this same loop — from the [coding agent](example-coding-agent.html) fixing a bug to the [research agent](example-research-agent.html) writing a cited report.

## Your turn: be the agent

Reading about the loop is one thing. Running it yourself is better. In this game, *you* are the agent. Your user's website has suddenly become slow. Each round, choose your next action, then observe what happens.

<div data-widget="be-the-agent"></div>

Did you notice which choices worked best? Gathering facts before acting. Following the evidence one step at a time. Avoiding destructive moves on a hunch. Asking a human before a risky change. And stopping once the question was answered. These aren't just game rules — they're the habits that separate a helpful agent from a dangerous one.

## When does the loop stop?

A loop that never ends would be a problem, so every agent needs to know when to stop. In practice, there are four common reasons:

1. **The goal is reached.** The cabin is booked, the bug is fixed, the report is written. The agent reports back and ends.
2. **A person needs to decide.** Something is risky, costly or unclear, so the agent pauses and asks. "Shall I book it?" "Which of these two options do you prefer?"
3. **It's stuck.** A tool keeps failing, or the information simply isn't available. A good agent says so honestly instead of pretending it succeeded.
4. **It hits a limit.** The software running the agent usually sets a maximum number of steps, a time limit or a spending budget, so a confused agent can't loop forever.

> [!TIP] Tell your agent what "done" looks like
> Agents stop more sensibly when they know the finish line. Instead of "look into flights to Lisbon", try "find the three cheapest direct flights to Lisbon on May 3rd and list them with times and prices — don't book anything." You'll learn more of these tricks in [Great instructions](great-instructions.html).

## Why checking results matters so much

The "observe" step is easy to overlook, but it's where most of an agent's reliability comes from.

Imagine an agent that's right 95% of the time on each step. Sounds great! But a task with 20 steps gives it 20 chances to slip, and one wrong step early on — a misread number, a search that returned the wrong company — can quietly spoil everything that follows. Small errors **add up** over a long task.

The cure is the same one you'd use: **check as you go.** Good agents:

- **Read tool results carefully** instead of assuming an action worked.
- **Verify important facts** from a second source, or by re-running a test.
- **Compare the outcome with the goal** before declaring victory: right date? right amount? right person?
- **Notice surprises** — an error message, an empty search, an unexpected number — and change course.

You'll explore this in depth, with a hands-on demo of how errors pile up, in [Making agents reliable](reliable-agents.html).

> [!WARNING] "Done!" doesn't always mean done
> Agents sometimes report success too early, or describe a result they didn't actually check. For anything important, glance at the evidence yourself: open the booking confirmation, look at the sent email, skim the final spreadsheet.

## The brain and the harness: who does what?

Here's something that surprises many people: the language model never actually *touches* anything. It doesn't click buttons, send emails or book cabins. It can only write text.

So who does the doing? A piece of ordinary software wrapped around the model, called the **harness**. You can think of the model and the harness as a team:

| The model (the brain) 🧠 | The harness (the hands and rules) 🛠️ |
|---|---|
| Reads the goal and everything so far | Gives the model the goal, the history and a list of available tools |
| Decides the next step | Actually runs the tool the model asked for |
| Writes a tool request, like "get the forecast for Pine Ridge" | Sends the tool's result back to the model |
| Decides when the goal is reached | Enforces limits: step counts, budgets, permissions |
| Writes the final answer | Asks a human for approval before risky actions |

> [!ANALOGY] Think of it like this
> Picture a brilliant expert on a phone call with an assistant sitting at a desk. The expert can't see the desk or touch anything — they can only talk. "Please look up the weather." The assistant does it and reads back the answer. "Great, now search for cabins under $150." The expert supplies the judgment; the assistant supplies the hands — and the assistant can refuse anything that breaks the office rules.

This split is one of the most important ideas in the whole guide. Because every action goes *through* the harness, the harness can log it, limit it, or pause it for your approval. That's what makes agents controllable — and it's why the same model can power a cautious assistant that asks before everything or a fast one that works on its own, depending on how its harness is set up.

<div class="detail">

**What a loop really looks like:** under the hood, the harness runs something like this:

1. Send the model the conversation so far plus descriptions of the available tools.
2. The model replies with either a final answer or a structured **tool call** (a tool name plus its inputs).
3. If it's a tool call, the harness checks permissions, runs the tool, and adds the result to the conversation.
4. Go back to step 1. Stop when the model gives a final answer or a limit is hit.

That's genuinely most of it — a real agent loop can be written in about twenty lines of code. Coding agents, research agents and browser agents all differ mainly in *which tools* they have and *what rules* the harness enforces. You can watch the messages flow, line by line, in [Under the hood](under-the-hood.html).

</div>

<div class="detail">

**Each turn re-reads everything.** A language model doesn't keep a running memory between turns of the loop. Each time round, the harness sends it the *whole* story so far — the goal, its earlier thoughts, every tool result. That's why long tasks get slower and more expensive as they go, and why agents eventually need ways to summarize or forget. That's the subject of the [Memory](memory.html) chapter.

</div>

## Putting the loop to work

You don't need to build anything to benefit from understanding the loop. Whenever you hand a task to an agent:

- **State the goal and the finish line** so it knows when to stop.
- **Say where it should pause** — "ask me before you send, buy or delete anything."
- **Ask it to check its work** — "verify the totals" or "confirm the booking details match."
- **Read the trail.** Many agent apps show each step they took. A quick skim tells you whether it really looked things up or just guessed.

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
- [ ] The agent uses a bigger language model
- [x] It feeds the results of its actions back into its next decision
- [ ] The agent writes longer and more detailed replies
- [ ] It always follows the same fixed list of steps
E: The heart of the loop is "observe": the agent reads what happened and uses it to choose the next step. A bigger model or a fixed script doesn't give you that ability to adapt.

Q: In the weekend-trip run, the forecast showed storms on Saturday. What did the loop let the agent do?
- [ ] Ignore the forecast and book the Saturday hike as planned
- [ ] Give up and ask Jordan to plan the weekend instead
- [ ] Book every cabin, just in case the plan changed
- [x] Move the hike to Sunday and keep the Saturday-night cabin
E: Observing a surprising result and changing course is exactly what the loop is for. Ignoring it would be unsafe, and giving up or over-booking ignores the goal.

Q: Who actually runs a tool, like booking a cabin, when an agent decides to use it?
- [ ] The language model, which clicks the buttons itself
- [x] The harness: the software around the model
- [ ] The tool runs automatically whenever the model is thinking
- [ ] Nobody — tools are only described, never run
E: The model can only write a request. The harness carries it out, sends back the result, and can block or pause actions for approval — which is what keeps agents controllable.
```

## What's next

You've seen the loop that drives every agent. But an agent is only as capable as the actions it can take. Next, we'll open the toolbox: **Tools** — what they are, how an agent chooses between them, and why a good description makes all the difference.
