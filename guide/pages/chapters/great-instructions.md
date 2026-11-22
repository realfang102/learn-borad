---
title: "Giving great instructions"
emoji: "🎯"
subtitle: "A simple recipe for getting the result you pictured, not a generic guess."
minutes: 9
---

Picture a brilliant new colleague on day one. They're quick and well-read, but they know *nothing* about you, your project or your deadline. Say "sort out the client thing" and they'll do *something* — probably not what you meant.

An AI agent is that colleague, every time. It's capable, but it can't read your mind. What you get back depends on what you put in.

> [!KEY]
> One extra minute on the instruction saves ten minutes of fixing.

## The new-colleague test

Before you send an instruction, ask: *"Could a smart new colleague do a great job with this note — without ten follow-up questions?"*

If not, the agent has the same problem. But it often won't ask. It **fills the gaps with guesses** — generic ones. Vague in, vague out.

> [!ANALOGY] Like ordering coffee
> "A coffee, please" gets you *a* coffee. "A large oat-milk flat white, extra hot" gets you *your* coffee. The barista didn't improve — your order did.

## Six ingredients

You won't need all six every time. The more important the task, the more you'll want.

| Ingredient | What it answers | Example |
|---|---|---|
| **Goal & why** | What do you want, and what's it for? | "…so I feel confident at Friday's interview" |
| **Context** | What should it know about you? | "I know Excel and some SQL, but I'm nervous" |
| **Constraints** | What are the limits and no-gos? | "I have 2 hours. Don't invent facts." |
| **Output format** | What shape should the answer take? | "8 questions, each with a 3–4 sentence answer" |
| **What 'done' looks like** | How will you know it's finished? | "Then quiz me one question at a time" |
| **Examples** | What does "good" look like? | "Here's the tone I like: …" |

The **why** is the most underrated. "Summarize this report" and "Summarize this report *so I can decide whether to read it before tomorrow's meeting*" produce very different summaries. Purpose lets the agent make dozens of small choices the way you would.

Start with the vague request, then add ingredients one at a time.

<div data-widget="prompt-builder"></div>

Notice the jump in the middle: with your **situation** and **limits**, generic advice becomes advice about *your* interview. Add **format** and **done**, and you get something usable straight away.

<div class="detail">

**Why examples are so powerful:** language models are pattern-continuers at heart (see [The AI brain](the-ai-brain.html)). Show one or two examples and the model will match their length, tone and structure far more reliably than a description would. Engineers call this **few-shot prompting** ("shots" being examples). One caution: models can copy examples *too* closely, reusing phrases or topics. Say what to copy ("this tone, this length") and vary your examples a little.

</div>

## Before and after

Everyday instructions, rewritten with the recipe. Copy and adapt.

**Before:** *"Write an email to my team about the new expense process."*

```prompt
Write a short email to my team of 12 about our new expense process, starting [date].
Why: people keep submitting receipts the old way and their claims get rejected.
Changes: [1. receipts go through the app, not email; 2. claims over $200 need a manager's approval first].
Tone: friendly, not bossy. Under 150 words, changes as bullets.
Done means: reading only the subject line and bullets tells people what to do differently.
```

**Before:** *"Help me plan a trip to Portugal."*

```prompt
Plan a 5-day trip to Portugal in [month] for two adults who love food and walking, not museums or nightlife.
Budget: about [amount], excluding flights. We arrive in Lisbon and won't drive.
Give a day-by-day plan: one main activity per day, rough daily cost, train or bus connections.
Ask me up to 3 questions first if anything important is missing. Don't book anything.
```

**Before:** *"Make this spreadsheet better."*

```prompt
Attached: our 300 customer contacts, for a mailing next week.
Remove exact duplicates, fix capitalization in names, and put all phone numbers in one format.
Don't delete rows that just look odd — list them separately so I can decide.
Work on a copy. When done, show what you changed and why in a short table.
```

Each one says **what**, **why**, **with what**, **within what limits** and **what finished looks like**. No tricks — just a clear brief, the way you'd give a person.

## Give it the right materials

An agent can only work with what it can see. If the answer lives in a document or email thread, the agent must be able to **read** it.

- **Attach the real thing.** "Use the numbers in the attached budget" beats retyping them from memory.
- **Say which parts matter.** "The figures are in the 'Q3' tab."
- **Give the access it needs — no more.** If it only needs to *read* your calendar, don't let it delete events. More in [Staying safe](staying-safe.html).
- **Ask it to look things up, not guess.** "If unsure of a fact, search and cite the source."

<div class="detail">

**Standing instructions:** if you keep repeating the same background ("I'm a nurse in a children's ward; always write in British English; keep it short"), most assistants let you save it once — look for custom instructions, project instructions or memory settings. Coding agents often read a notes file in the project folder — for example `CLAUDE.md` for Claude Code, or `AGENTS.md`, a shared convention many other agents read — so every session starts with the same context. It's the [memory](memory.html) chapter's "notebook" idea, applied to instructions.

</div>

## Ask, plan, iterate

The simplest trick: **invite questions.** You rarely notice what you left out until someone asks.

```prompt
I want you to [describe the task].
Before you start, ask me up to 5 questions, most important first. Wait for my answers.
```

This helps most when *you're* unsure what you want — the questions help you think.

> [!TIP] Ask for the plan, too
> For anything bigger than a quick answer, add: *"Show me your plan first and wait for my OK."* You'll catch misunderstandings in seconds. (See [Planning](planning.html).)

Your first instruction needn't be perfect. When a result misses, **say what to change, and why**:

- **Weak:** "That's not good, try again."
- **Strong:** "Good structure, but too formal — make it a friendly note from a colleague, half the length."

Going in circles? **Start fresh** with a better first instruction that includes what you've learned. Long, muddled threads confuse agents, just as they confuse people.

## Common mistakes

| Mistake | What happens | Quick fix |
|---|---|---|
| Too vague | Generic result | Add the goal, the why, your situation |
| Hidden context | Wrong guesses about key facts | Share the real files |
| No format | A wall of text when you wanted a table | Say the shape and length |
| No finish line | Stops too early, or runs too long | Describe "done" |
| Too many jobs at once | Parts get skipped | Split into steps or number them |
| Only saying "don't" | Knows what to avoid, not what to aim for | Say what you *do* want |
| Never inviting questions | Charges ahead on assumptions | "Ask me what you need first" |

> [!WARNING] Still check the result
> Clear instructions make good results *much* more likely, not certain. Agents can still misread, miscalculate or state falsehoods confidently. Review before anything is sent, published or paid.

Find fill-in-the-blanks instructions on the [prompts page](prompts.html), and see well-briefed agents in the [research agent](example-research-agent.html) and [data analyst](example-data-analyst.html) examples.

## Quick check

```quiz
Q: Which addition would most improve the instruction "Summarize this report"?
- [ ] "Please do a really, really good job on this one for me"
- [x] "…so I can decide if I need to read it all"
- [ ] "You are the world's best summarizer"
- [ ] "Use all of your intelligence and think very hard"
E: Telling the agent *why* you want the summary lets it decide what to keep, how long to make it and what to highlight. Flattery and "try harder" add no information it can use.

Q: You want an agent to tidy a spreadsheet. Which instruction best protects you from mistakes?
- [ ] "Clean this whole thing up however you think is best"
- [ ] "Delete any rows or cells that look wrong to you"
- [ ] "Be extremely careful and please don't make mistakes"
- [x] "Work on a copy; list odd rows, don't delete"
E: Working on a copy and flagging uncertain rows means nothing is lost if the agent misjudges something. "Be careful" sounds nice but gives the agent no concrete rule to follow.

Q: The agent's draft is close but not right. What's the most useful reply?
- [ ] "No, that's not it. Try again."
- [ ] "That's terrible, start over completely from scratch"
- [x] "Same structure, but friendlier and half as long"
- [ ] "Make it better, please, it's not quite there yet"
E: Specific feedback — what to keep, what to change and how — gives the agent something to act on. "Try again" or "make it better" leaves it guessing just as much as before.
```

## What's next

Now put that skill to one of its best uses: [learning anything faster](learn-faster.html) with an AI tutor that makes things stick.
