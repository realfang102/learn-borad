---
title: "What is an AI agent?"
emoji: "🤖"
subtitle: "The difference between an AI that talks and an AI that gets things done — explained in plain language."
minutes: 9
---

You've probably chatted with an AI like Claude or ChatGPT. You ask a question, it writes an answer. Helpful — but *you* still have to do everything with that answer: copy it, check it, click the buttons, send the email.

An **AI agent** is different. You give it a **goal**, and it works toward that goal by itself — searching, reading, clicking, writing, calculating — checking its progress as it goes, until the job is done.

> [!KEY] The one-sentence definition
> An AI agent is an AI that **works in a loop**: it decides what to do, **uses tools** to do it, **looks at what happened**, and repeats until the goal is reached.

## Talking vs. doing

The fastest way to *feel* the difference is to watch both kinds of AI handle the same request. Press play:

<div data-widget="chat-vs-agent"></div>

Notice three things the agent did that the chatbot didn't:

1. **It used tools.** It looked at real calendars instead of guessing.
2. **It looked at the results.** It saw which times were free and used that information.
3. **It decided its own next step.** Nobody told it "now check Sam's calendar" — it worked that out.

> [!ANALOGY] Think of it like this
> A chatbot is like a very knowledgeable friend on the phone: they can tell you *how* to fix your bike. An agent is like a friend who comes over, looks at the bike, fetches the tools, fixes it, and test-rides it to make sure it works.

## The three ingredients of every agent

Every agent — from a coding assistant to a customer-service bot — is built from the same three ingredients:

| Ingredient | What it is | Everyday comparison |
|---|---|---|
| 🧠 **A brain** | A large language model (LLM) that reads, reasons and decides | Your judgment |
| 🛠️ **Tools** | Abilities it can use: web search, email, calendars, files, code, apps | Your hands, phone and computer |
| 🔁 **A loop** | The habit of *think → act → check the result → think again* | How you'd tackle any multi-step chore |

You'll meet each of these in its own chapter: [the AI brain](the-ai-brain.html), [the agent loop](the-agent-loop.html), and [tools](tools.html).

<div class="detail">

**For the curious:** in technical terms, an agent is a language model running inside a piece of software called a **harness**. The harness gives the model a list of tools it's allowed to use, runs any tool the model asks for, and feeds the result back. The model never "touches" anything directly — it *asks*, and the harness *does*. That separation is what makes agents controllable: the harness can block, log or ask a human about any action.

</div>

## Agent or not? Test your instinct

Not everything with "AI" in the name is an agent. Sort these eight helpers:

<div data-widget="agent-or-not"></div>

> [!TIP] A quick test
> Ask: *Does it choose its own next action based on what just happened?* If yes, it's acting like an agent. If it always does the same steps, or only gives one reply, it isn't.

## It's a spectrum, not a switch

In real life, AI tools sit on a range from "just talks" to "works completely on its own":

- **💬 Chat assistant** — answers questions; you do the work.
- **✍️ Copilot** — suggests the next sentence or line of code; you accept or reject.
- **⚙️ Workflow** — follows a fixed recipe you designed, with AI filling in steps.
- **🙋 Supervised agent** — works on its own but asks you before anything risky.
- **🚀 Autonomous agent** — takes a goal and runs with it, sometimes for hours.

More autonomy means more help — but also more trust required. Most of the time the sweet spot is in the middle: let the agent do the legwork, and keep a human in charge of important decisions. You'll practice choosing the right level in [Staying safe](staying-safe.html).

<div class="detail">

**Workflows vs. agents:** engineers draw a useful line here. In a *workflow*, the developer decides the steps in advance ("first summarize, then translate, then email"). In an *agent*, the model decides the steps as it goes. Workflows are more predictable; agents are more flexible. Good builders use the simplest option that works — often a workflow — and reach for a true agent when the steps can't be predicted.

</div>

## What can agents actually do today?

As of 2026, agents are genuinely useful in a growing list of areas. A few you'll see animated later in this guide:

- 👩‍💻 **Coding** — reading a codebase, fixing bugs, running tests ([see it](example-coding-agent.html))
- 🔎 **Research** — searching dozens of sources and writing a cited report ([see it](example-research-agent.html))
- 🎧 **Customer support** — looking up orders and solving problems within policy ([see it](example-support-agent.html))
- 📧 **Personal admin** — sorting email, drafting replies, scheduling meetings ([see it](example-inbox-assistant.html))
- 📊 **Data work** — cleaning spreadsheets and making charts ([see it](example-data-analyst.html))

> [!WARNING] Agents aren't magic
> Agents still make mistakes — sometimes confidently. They can misunderstand a goal, use a tool wrongly, or believe something false they read online. Throughout this guide you'll learn simple habits that keep you in control: clear instructions, checking results, and approving risky actions.

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
E: A step-by-step plan is still just advice: explaining is chatbot behavior. An agent with a file tool would rename the files itself, check that it worked, and report back. (And no task is "too simple" — simple, repetitive jobs are great for agents.)

Q: Why do most people keep a human "in the loop" for some agent actions?
- [ ] Because agents can't use their tools unless a person is watching
- [x] Because agents make mistakes, and some actions are hard to undo
- [ ] Because the law says a person must approve every agent action
- [ ] Because checking each step makes the agent finish much faster
E: Agents can use tools on their own, and no general law requires a human click for everything — approvals actually slow things down a little. People add them because agents are capable but imperfect: you let the agent do the legwork and approve the important, hard-to-undo actions (sending money, deleting things).
```

## What's next

You now know *what* an agent is. Next, let's open the hood and look at the **brain** inside every agent — the language model — and why it sometimes guesses instead of knowing.
