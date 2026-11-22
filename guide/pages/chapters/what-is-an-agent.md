---
title: "What is an AI agent?"
emoji: "🤖"
subtitle: "The difference between an AI that talks and one that gets things done."
minutes: 8
---

You've probably chatted with an AI like Claude or ChatGPT. You ask, it answers, and *you* still do the work.

An **AI agent** takes a **goal** and works toward it by itself, searching, clicking and writing, checking its progress until the job is done.

> [!KEY]
> An AI agent is an AI that **works in a loop**: it decides what to do, **uses tools** to do it, **looks at what happened**, and repeats until the goal is reached.

## Talking vs. doing

Press play: same request, two kinds of AI.

<div data-widget="chat-vs-agent"></div>

The agent **used tools** (real calendars, not guesses), **read the results**, and **chose its own next step**.

> [!ANALOGY]
> A chatbot tells you over the phone *how* to fix your bike. An agent comes over, fixes it, and test-rides it.

## Three ingredients

Every agent is built from the same three parts:

| Ingredient | What it is | Everyday comparison |
|---|---|---|
| **A brain** | A large language model (LLM) that reads, reasons and decides | Your judgment |
| **Tools** | Web search, email, calendars, files, code, apps | Your hands, phone and computer |
| **A loop** | *Think → act → check the result → think again* | How you tackle any multi-step chore |

Each gets its own chapter: [the AI brain](the-ai-brain.html), [the agent loop](the-agent-loop.html) and [tools](tools.html).

<div class="detail">

**For the curious:** technically, an agent is a language model running inside software called a **harness**. The harness gives the model a list of allowed tools, runs any tool the model asks for, and feeds the result back. The model never touches anything directly: it *asks*, and the harness *does*. That separation makes agents controllable, because the harness can block, log or ask a human about any action.

</div>

## Agent or not?

Not everything labelled "AI" is an agent. Sort these eight.

<div data-widget="agent-or-not"></div>

> [!TIP] A quick test
> *Does it choose its next action based on what just happened?* If yes, it's an agent. Fixed steps or a single reply: it isn't.

## A spectrum, not a switch

AI tools range from "just talks" to "works alone":

- **Chat assistant**: answers questions; you do the work.
- **Copilot**: suggests the next sentence or line of code; you accept or reject.
- **Workflow**: follows a fixed recipe you designed, with AI filling in steps.
- **Supervised agent**: works alone, asks before anything risky.
- **Autonomous agent**: takes a goal and runs with it, sometimes for hours.

More autonomy means more help and more trust required. The sweet spot is usually the middle: the agent does the legwork, you make the important calls. Practise choosing in [Staying safe](staying-safe.html).

<div class="detail">

**Workflows vs. agents:** in a *workflow*, the developer fixes the steps in advance ("summarize, then translate, then email"). In an *agent*, the model decides the steps as it goes. Workflows are more predictable; agents are more flexible. Good builders use the simplest option that works, often a workflow, and reach for a true agent when the steps can't be predicted.

</div>

## What agents do today

As of 2026, agents are genuinely useful for:

- **Coding**: fixing bugs, running tests ([see it](example-coding-agent.html))
- **Research**: cited reports from dozens of sources ([see it](example-research-agent.html))
- **Customer support**: solving order problems within policy ([see it](example-support-agent.html))
- **Personal admin**: email, replies, scheduling ([see it](example-inbox-assistant.html))
- **Data work**: cleaning spreadsheets, making charts ([see it](example-data-analyst.html))

> [!WARNING] Not magic
> Agents still make mistakes, sometimes confidently: misread goals, misused tools, false things believed online. This guide teaches the habits that keep you in control: clear instructions, checked results, approved risky actions.

## Quick check

```quiz
Q: What most clearly makes something an AI *agent* rather than a chatbot?
- [ ] It runs on a much bigger, more powerful model than chatbots
- [x] It acts with tools and uses each result to pick its next step
- [ ] It can write longer, more detailed answers to hard questions
- [ ] It remembers your name and preferences between conversations
E: A big model, long answers and memory can all belong to a plain chatbot too. What makes an agent is the loop: it acts (usually with tools), looks at the result, and chooses its next step toward a goal.

Q: Your AI assistant tells you, step by step, how to rename 200 files on your computer. Is it acting as an agent?
- [ ] Yes, because it gave you a clear multi-step plan
- [ ] Yes, because it understood how your computer works
- [x] No, because you still have to do the renaming
- [ ] No, because renaming files is too simple for AI
E: A step-by-step plan is still just advice: explaining is chatbot behavior. An agent with a file tool would rename the files itself, check that it worked, and report back. (And no task is "too simple": simple, repetitive jobs are great for agents.)

Q: Why do most people keep a human "in the loop" for some agent actions?
- [ ] Because agents can't use their tools unless a person is watching
- [x] Because agents make mistakes, and some actions are hard to undo
- [ ] Because the law says a person must approve every agent action
- [ ] Because checking each step makes the agent finish much faster
E: Agents can use tools on their own, and no general law requires a human click for everything; approvals actually slow things down a little. People add them because agents are capable but imperfect: let the agent do the legwork and approve the important, hard-to-undo actions (sending money, deleting things).
```

## What's next

You know *what* an agent is. Next, open the hood and meet the **brain** inside every agent, the language model, and learn why it sometimes guesses instead of knowing.
