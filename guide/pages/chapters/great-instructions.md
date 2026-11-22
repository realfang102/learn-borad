---
title: "Giving great instructions"
emoji: "🎯"
subtitle: "A simple recipe for telling an agent what you want — so you get the result you pictured, not a generic guess."
minutes: 11
---

Imagine a brilliant new colleague on their very first day. They're quick, hard-working and know a lot about the world — but they know *nothing* about you, your project, your boss or your deadline. If you say "sort out the client thing," they'll do *something*. It just probably won't be what you meant.

That's what working with an AI agent is like, every single time. The agent is capable, but it can't read your mind. The quality of what you get back depends enormously on what you put in. The good news: giving great instructions is a skill anyone can learn, and it mostly comes down to a short recipe.

> [!KEY] The big idea
> An agent only knows what you tell it (plus whatever it can look up). **Great instructions** say what you want, why, what it should know, what to avoid, and what the finished result looks like. Spend one extra minute writing them and you'll save ten minutes of fixing.

## The new-colleague test

Before you send an instruction, ask yourself: *"If I handed this note to a smart new colleague who's never met me, could they do a great job — without coming back with ten questions?"*

If the answer is no, the agent will have the same problem. But unlike the colleague, it often won't ask. It will **fill the gaps with guesses** — reasonable-sounding, generic guesses. That's why a vague request gets a vague, one-size-fits-all answer.

> [!ANALOGY] Like ordering at a café
> "A coffee, please" gets you *a* coffee. "A large oat-milk flat white, extra hot, to take away" gets you *your* coffee. The barista didn't get any better — your order did.

## The recipe: six ingredients

Here are the ingredients of a great instruction. You won't need all six every time, but the more important the task, the more of them you'll want.

| Ingredient | What it answers | Example |
|---|---|---|
| 🎯 **Goal & why** | What do you want, and what's it for? | "…so I feel confident at Friday's interview" |
| 📚 **Context** | What should it know about you or the situation? | "I know Excel and some SQL, but I'm nervous" |
| 📏 **Constraints** | What are the limits and the no-gos? | "I have 2 hours. Don't invent facts." |
| 🧾 **Output format** | What shape should the answer take? | "8 questions, each with a 3–4 sentence answer" |
| ✅ **What 'done' looks like** | How will you both know it's finished? | "Then quiz me one question at a time" |
| 💡 **Examples** | What does "good" look like to you? | "Here's the tone I like: …" |

The **why** is the most underrated ingredient. "Summarize this report" and "Summarize this report *so I can decide whether to read the whole thing before tomorrow's meeting*" lead to very different summaries. Knowing the purpose lets the agent make dozens of small decisions the way you would.

Now try it. Start with the vague request, then click the ingredients one at a time. Watch the instruction grow — and how the likely result changes.

<div data-widget="prompt-builder"></div>

Notice the jump in the middle: once the agent knows your **situation** and your **limits**, the answer stops being generic advice for anyone and starts being about *your* interview. And once it knows the **format** and what **done** looks like, it can deliver something you can use straight away — even an interactive practice session.

<div class="detail">

**Why examples are so powerful:** language models are pattern-continuers at heart (you saw this in [The AI brain](the-ai-brain.html)). Show one or two examples of what you want and the model will match their length, tone and structure far more reliably than if you describe them in words. Engineers call this **few-shot prompting** ("shots" being examples). One caution: models can copy examples *too* closely, reusing the same phrases or topics. If you give examples, say what to copy ("this tone, this length") and vary them a little.

</div>

## Before and after

Here are some everyday instructions, rewritten with the recipe. Copy the improved versions and adapt them.

**Before:** *"Write an email to my team about the new expense process."*

```prompt
Write a short email to my team of 12 about our new expense process, which starts on [date].
Why: people keep submitting receipts the old way and their claims get rejected, which is frustrating for everyone.
Context: the main changes are [1. receipts go through the app, not email; 2. claims over $200 need a manager's approval first].
Tone: friendly and clear, not bossy. Keep it under 150 words, with the changes as a short bulleted list.
Done means: someone who reads only the subject line and the bullets knows exactly what to do differently.
```

**Before:** *"Help me plan a trip to Portugal."*

```prompt
Help me plan a 5-day trip to Portugal in [month] for two adults who love food and walking, but not museums or nightlife.
Budget: about [amount] in total, not counting flights. We'll arrive in Lisbon and don't want to drive.
Please give me a day-by-day plan with one main activity per day, a rough daily cost, and how to get between places by train or bus.
Before you start, ask me up to 3 questions if anything important is missing. Don't book anything.
```

**Before:** *"Make this spreadsheet better."*

```prompt
I've attached a spreadsheet of our 300 customer contacts. I want to use it for a mailing next week.
Please: remove exact duplicates, fix obvious capitalization problems in names, and put every phone number in the same format.
Don't delete any rows that just look odd — list those separately so I can decide.
Work on a copy, not the original. When you're done, tell me how many rows you changed and why, in a short table.
```

See the pattern? Each improved version says **what**, **why**, **with what**, **within what limits**, and **what finished looks like**. None of them use special words or tricks. They're just clear — the way you'd brief a person.

## Give it the right materials

An agent can only work with what it can see. If the answer lives in a document, a spreadsheet or an email thread, the best instruction in the world won't help unless the agent can **read** it.

- **Attach or point to the real thing.** Share the actual report, the meeting notes, the old version of the file. "Use the numbers in the attached budget" beats retyping the numbers from memory.
- **Say which parts matter.** "The figures you need are in the 'Q3' tab" saves it from wading through everything else.
- **Give the access it needs — and no more.** If the agent only needs to *read* your calendar, don't give it permission to delete events. Less access means fewer things can go wrong. You'll see why this matters in [Staying safe](staying-safe.html).
- **Ask it to look things up rather than guess.** "If you're not sure of a fact, search for it and tell me the source" keeps you from getting confident-sounding inventions.

<div class="detail">

**Standing instructions:** if you find yourself repeating the same background every time ("I'm a nurse in a children's ward; always write in British English; keep it short"), most assistants let you save it once. Look for features like custom instructions, project instructions or memory settings. Coding agents often read a special notes file in the project folder — for example `CLAUDE.md` for Claude Code, or `AGENTS.md`, a shared convention many other agents read — so every session starts with the same context. It's the [memory](memory.html) chapter's "notebook" idea, applied to instructions.

</div>

## Let the agent ask you questions

Here's one of the simplest and most powerful tricks: **invite questions.** You often don't realize what you've left out until someone asks. An agent that asks two good questions before starting will usually beat one that charges ahead on guesses.

```prompt
I want you to [describe the task].
Before you start, ask me any questions you need to do this really well — up to 5, most important first. Wait for my answers before doing the work.
```

This works especially well when *you're* not sure what you want yet. The agent's questions help you think it through.

> [!TIP] Ask for the plan, too
> For anything bigger than a quick answer, add: *"Show me your plan first and wait for my OK."* You'll catch a misunderstanding in seconds instead of after the work is done. (You met this idea in [Planning](planning.html).)

## Iterate: it's a conversation, not a vending machine

Your first instruction doesn't have to be perfect. Great results usually come from a few rounds of back-and-forth, just like working with a person.

When the result isn't right, **be specific about what to change** — and why:

- ❌ "That's not good, try again."
- ✅ "Good structure, but it's too formal for my team — make it sound like a friendly message from a colleague, and cut it to half the length."

If you've gone round in circles for a while, it's often faster to **start fresh** with a better first instruction that includes everything you've learned. A long, muddled conversation can confuse an agent just as it would confuse a person.

## Common mistakes (and quick fixes)

| Mistake | What happens | Quick fix |
|---|---|---|
| 🌫️ Too vague | Generic, one-size-fits-all result | Add the goal, the why and your situation |
| 🙈 Hidden context | The agent guesses wrong about key facts | Share the real files; state what you know |
| 📦 No format | A wall of text when you wanted a table (or vice versa) | Say the shape, length and structure |
| 🏁 No finish line | It stops too early, or keeps going too long | Describe what "done" looks like |
| 🧶 Too many jobs at once | Some parts get skipped or done badly | Split it into steps, or number the parts |
| 🚫 Only saying "don't" | It knows what to avoid, but not what to aim for | Say what you *do* want, too |
| 🤐 Never inviting questions | It charges ahead on assumptions | "Ask me what you need first" |

> [!WARNING] Great instructions don't replace checking
> Even a perfect instruction won't make an agent perfect. It can still misread a document, make a calculation slip or state something false with confidence. Clear instructions make good results *much* more likely; reviewing the result is still your job — especially before anything is sent, published or paid.

You'll find lots of ready-made, fill-in-the-blanks instructions on the [prompts page](prompts.html), and you can see well-briefed agents at work in the [research agent](example-research-agent.html) and [data analyst](example-data-analyst.html) examples.

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

Now that you can tell an agent exactly what you want, let's put that skill to one of its best uses: [learning anything faster](learn-faster.html) with an AI tutor — in a way that actually makes things stick.
