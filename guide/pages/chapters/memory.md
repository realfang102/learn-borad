---
title: "Memory: how agents remember"
emoji: "🎒"
subtitle: "Why agents forget, how they track long tasks, and how to stay in control."
minutes: 9
---

Ever had an AI forget something you said at the start of a long chat? Or open a new chat the next day with no idea who you were?

It isn't careless. Agents remember differently from us, and once you see how, a lot of puzzling behaviour makes sense.

> [!KEY]
> Agents have **short-term memory**, everything the model sees right now, and **long-term memory**, notes and files saved outside it to look up later.

## Short-term memory: the context window

A model doesn't remember your conversation *at all* between replies. Each time, the harness from [the agent loop](the-agent-loop.html) sends the **whole conversation so far**: your messages, its replies, documents and tool results. The model reads it all again from the top.

That is the **context window**: the model's working desk. If something is in it, the model can use it. If not, as far as the model knows, it never happened.

> [!ANALOGY]
> The context window is a **backpack** on a hike. Instructions, conversation, documents and search results must all fit inside. It's big, not bottomless: overpack and something comes out.

Its size is measured in [tokens](the-ai-brain.html). As of 2026, leading models hold hundreds of thousands of tokens, many about a million: several long books. Plenty for a chat, but agents fill it fast. A long web page or big spreadsheet can take thousands of tokens, and an hour-long task might read hundreds of them.

## Try it: pack the backpack

Add the fact **"Sam is allergic to peanuts"** early, then keep packing until it overflows and press **Ask**. Reset and retry with **Summarize old stuff** or **Save the fact to the notebook** first.

<div data-widget="context-backpack"></div>

On overflow, the oldest items fall out first, perhaps Sam's allergy. A summary keeps the fact alive; the notebook survives even an empty backpack. Those are the two main tricks real agents use.

## When the backpack fills

A full context window causes two problems:

1. **Things get dropped.** Depending on the app, the oldest parts get cut, or the agent hits its limit and stops.
2. **Attention thins.** Even before it's full, a detail buried mid-conversation is easier to overlook, like keys in an overstuffed bag.

So agents and their apps manage the backpack actively:

- **Summarizing (compaction).** The agent replaces the long history with a short summary of the goal, key decisions, facts and next steps. Many coding agents and chat apps do this automatically.
- **Keeping only what's needed.** Rather than a whole 300-page manual, a good agent searches it and pulls in just the relevant pages.
- **Handing off work.** A helper agent with a fresh backpack takes a sub-task and returns only the short answer. See [Agent teams](agent-teams.html).

> [!TIP] New topic, new chat
> A wandering conversation is a backpack full of clutter. When you switch topics, **start a new chat**. Need the old context? Ask to "summarize the key points so I can continue in a new chat" and paste that in.

<div class="detail">

**Why not make the backpack infinite?** Context windows have grown enormously, but there are real costs. The model re-reads the whole context every turn, so a bigger context means **slower and more expensive** replies (services usually charge per token read). And research has found models can be less reliable at using information buried deep in a very long context, sometimes called being "lost in the middle". **Prompt caching** makes re-reading the same text cheaper and faster, but keeping the backpack tidy still matters.

</div>

## Long-term memory: the notebook

Short-term memory vanishes when the conversation ends. For anything lasting, agents need **long-term memory**: information stored *outside* the model, read back into the backpack when needed.

| Kind | What it stores | Example |
|---|---|---|
| **Notes the agent writes** | Progress, decisions, lessons | A coding agent's project notes on running tests and what it changed |
| **Saved preferences** | Facts about you and your tastes | "Prefers short answers", "works in a school", "vegetarian" |
| **Files and documents** | Your own material | A project folder of reports and meeting notes |
| **A searchable knowledge base** | Large collections to look things up in | A company's help articles and policies ([example](example-knowledge-base.html)) |

The pattern: **save** what matters, later **look it up** and repack it. The model itself doesn't "learn" from your chats. It's more like someone who keeps an excellent diary and checks it before every meeting.

A [meeting assistant](example-meeting-assistant.html), for example, saves decisions from your weekly call. Next week it asks: "Last time, Priya agreed to send the budget draft. Is that done?" Without long-term memory, every meeting starts from zero.

<div class="detail">

**How agents search a big memory:** for large collections, a common technique is **retrieval-augmented generation (RAG)**. Documents are split into chunks and stored so they're searchable by *meaning*, not just exact words (often using mathematical fingerprints called **embeddings**). When a question arrives, the system finds the most relevant chunks and adds only those to the context window. More recently, agents also simply use ordinary search and file tools to explore a folder of notes, as you would. Either way: fetch what's relevant, don't carry everything.

</div>

## Memory in everyday assistants

As of 2026, many popular assistants offer features like these (names and options vary by app and plan):

- **Memory or personalization.** Remembers facts you share, like your job or projects. Usually you can view, edit, delete or switch it off.
- **Custom instructions.** Standing preferences written once ("I'm a beginner, explain simply, use metric units").
- **Projects or workspaces.** Files and instructions shared across every chat about that project.
- **Temporary or incognito chats.** Not saved to memory, for one-off or sensitive questions.

A [study tutor](example-study-tutor.html) that remembers what you've mastered can pick up where you left off instead of starting over each evening.

## Privacy: you own the notebook

Long-term memory means information about you is **stored**. A few habits help:

- **Check what's remembered** now and then, and delete anything outdated, wrong or too personal.
- **Never share secrets**: passwords, bank details, ID numbers.
- **Protect other people's details** as carefully as your own.
- **Use temporary chats** for sensitive topics.
- **Follow workplace rules**: use your organization's approved tools for work material.
- **Correct wrong memories.** A mistaken "memory" keeps being used until you fix or delete it.

> [!WARNING] Memories shape answers
> Saved memories are quietly added to future chats. An outdated one can skew answers unnoticed. If an assistant keeps assuming something odd, check its memory first.

See and tidy what an assistant knows:

```prompt
Please list everything you currently remember about me or have saved from our past conversations (preferences, facts, projects).
For each item, tell me where it came from if you can.
Then I'll tell you which ones to keep, correct or forget.
```

Hand a long conversation to a fresh chat:

```prompt
We've covered a lot. Write a compact summary I can paste into a new chat so you can continue without losing anything important. Include: my goal, key facts and decisions so far, open questions, and the next steps.
```

## Quick check

```quiz
Q: What is an agent's "context window"?
- [ ] A permanent record of every conversation it has ever had
- [x] Everything the model can see at once, up to a size limit
- [ ] The part of the screen where the AI's answers show up for you
- [ ] A settings page where you choose which tools it may use
E: The context window is short-term memory: the instructions, conversation, documents and tool results the model can see right now. It's limited in size and isn't permanent; that's what long-term memory is for.

Q: Early in a very long task, you told an agent an important fact. Now it's acting as if it never heard it. What's the most likely reason?
- [ ] It decided the fact was false and quietly dropped it
- [ ] The model was retrained partway through the conversation
- [x] The fact was pushed out of its overfull context window
- [ ] Agents ignore anything said before their first tool call
E: As the backpack fills, older material can be dropped or compressed. If the fact wasn't kept in a summary or saved to long-term memory, the model can no longer see it. The model doesn't retrain itself mid-chat, and it isn't secretly judging your facts; it simply can't see that one any more.

Q: Which is the best way for an agent to remember your preferences between separate conversations?
- [ ] Keep one endless chat open so nothing is ever lost
- [ ] Rely on the model learning from each conversation automatically
- [ ] Repeat your preferences at the end of every message
- [x] Save them to long-term memory it can look up next time
E: Separate chats start with an empty backpack, and models don't learn from your chats on the fly. Saved memory (or custom instructions) puts your preferences back into the context when needed. An endless chat just overfills the backpack.
```

## What's next

You know how agents hold onto information. Next, how they decide *what to do* on big goals: **Planning**, breaking a goal into steps and changing course when reality intervenes.
