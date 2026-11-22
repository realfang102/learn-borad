---
title: "Memory: how agents remember"
emoji: "🎒"
subtitle: "Why an agent can forget something you said an hour ago, how it keeps track of long tasks, and how to stay in control of what it remembers."
minutes: 11
---

Have you ever had a long chat with an AI assistant, and near the end it seemed to forget something you told it at the start? Or opened a new chat the next day, and it had no idea who you were?

It's not being careless. It comes down to how agents remember — which works quite differently from how *we* remember. Once you see it, a lot of puzzling AI behavior suddenly makes sense, and you'll know exactly how to work with it.

> [!KEY] The big idea
> Agents have two kinds of memory. **Short-term memory** is everything the model can see *right now*, and it has a size limit. **Long-term memory** is information saved somewhere outside the model — notes, files, saved preferences — that the agent can look up later.

## Short-term memory: the context window

Here's a fact that surprises most people: a language model doesn't remember your conversation *at all* between replies. Every time it answers, the software around it (the harness you met in [the agent loop](the-agent-loop.html)) sends it the **whole conversation so far** — your messages, its replies, any documents and every tool result — and the model reads it all again from the top.

Everything the model can see in that moment is called its **context window**. It's the model's short-term memory, its working desk. If something is in the context window, the model can use it. If it isn't, then as far as the model is concerned, it never happened.

> [!ANALOGY] Think of it like this
> The context window is like a **backpack** the agent carries on a hike. Everything it needs for the current trip must fit inside: your instructions, the conversation, the documents it's reading, the results of its searches. The backpack is big — but not bottomless. Pack too much and something has to come out.

The size of the backpack is measured in [tokens](the-ai-brain.html), those word-pieces you met earlier. As of 2026, leading models have context windows of hundreds of thousands of tokens, and many now reach about a million — enough for several long books. That sounds like plenty, and for a normal chat it is. But agents fill it surprisingly fast: a long web page, a big spreadsheet or a lengthy tool result can each take thousands of tokens, and an agent working for an hour might read hundreds of them.

## Try it: pack the backpack

In this playground, the agent's context window is a backpack with room for 12 units. Add chat messages, a long document and some tool results. Make sure to add the important fact — **"Sam is allergic to peanuts"** — early on, then keep adding things until the backpack overflows. Now press **❓ Ask** and see what happens.

Then reset and try again, this time using **🗜️ Summarize old stuff** or **📓 Save the fact to the notebook** before the backpack fills up.

<div data-widget="context-backpack"></div>

Did you see it? When the backpack overflowed, the oldest things fell out first — including, quite possibly, Sam's allergy. Once it was gone, the agent simply couldn't answer. But if you summarized first, the important fact survived in the short summary. And if you saved it to the notebook, the agent could look it up even after the backpack was emptied.

Those two buttons are the two main tricks real agents use.

## When the backpack fills up

A full context window causes two kinds of trouble:

1. **Things get dropped.** Depending on the app, the oldest parts of the conversation may be cut off, or the agent may hit its limit and stop. Either way, information is lost.
2. **Attention gets thinner.** Even before it's full, a very crowded context makes it harder for the model to notice what matters. Like finding your keys in an overstuffed bag, an important detail buried in the middle of a huge conversation is easier to overlook.

So agents — and the apps they run in — manage the backpack actively:

- **Summarizing (compaction).** When the context gets long, the agent writes a short summary of what's happened so far — the goal, key decisions, important facts, what's left to do — and continues with that summary in place of the full history. Many coding agents and chat apps now do this automatically; it's often called **compaction**.
- **Keeping only what's needed.** Instead of pasting a whole 300-page manual into the backpack, a good agent searches it and pulls in just the relevant pages.
- **Handing off work.** Some agents send a sub-task to a helper agent with its own fresh backpack, and get back only the short answer. You'll see this in [Agent teams](agent-teams.html).

> [!TIP] Start fresh when you switch topics
> In everyday chat, a long conversation that wanders across many topics is a backpack full of clutter. When you move to something new, **start a new chat**. If the old conversation has something important, ask the AI to "summarize the key points so I can continue in a new chat", then paste that summary in. You'll often get sharper answers.

<div class="detail">

**Why not just make the backpack infinite?** Context windows have grown enormously, but there are real costs. The model re-reads the whole context on every turn of the loop, so a bigger context means **slower and more expensive** replies (services usually charge per token read). And research has found that models can be less reliable at using information buried deep in a very long context — sometimes described as being "lost in the middle". Features like **prompt caching** make re-reading the same text cheaper and faster, but good context management — keeping the backpack tidy — still matters.

</div>

## Long-term memory: the notebook

Short-term memory disappears when the conversation ends. For anything that should last, agents need **long-term memory**: information stored *outside* the model, which it can read back into its backpack when needed.

Long-term memory comes in a few everyday shapes:

| Kind | What it stores | Example |
|---|---|---|
| 📓 **Notes the agent writes** | Progress, decisions, lessons learned | A coding agent keeps a project notes file listing how to run the tests and what it changed |
| ⭐ **Saved preferences** | Facts about you and how you like things | "Prefers short answers", "works in a school", "vegetarian" |
| 📁 **Files and documents** | Your own material | A project folder of reports and meeting notes |
| 🔍 **A searchable knowledge base** | Large collections the agent looks things up in | A company's help articles and policies ([example](example-knowledge-base.html)) |

The pattern is always the same: **save** something important, and later **look it up** and put it back into the backpack. The model itself doesn't change or "learn" from your conversation. It's more like a person who keeps an excellent diary and checks it before every meeting.

> [!EXAMPLE] Long-term memory at work
> A [meeting assistant](example-meeting-assistant.html) listens to your weekly team call and saves the decisions and action items. Next week, before the call, it reads last week's notes and reminds everyone: "Last time, Priya agreed to send the budget draft — is that done?" Without long-term memory, every meeting would start from zero.

<div class="detail">

**How agents search a big memory:** for large collections, a common technique is **retrieval-augmented generation (RAG)**. Documents are split into chunks and stored in a way that makes them searchable by *meaning*, not just exact words (often using mathematical fingerprints called **embeddings**). When a question comes in, the system finds the most relevant chunks and adds only those to the context window. More recently, agents also simply use ordinary search and file tools to explore a folder of notes themselves, just as you would. Either way, the principle is the same: fetch what's relevant, don't carry everything.

</div>

## Memory in the assistants you use

You've probably already met long-term memory, even if it wasn't called that. As of 2026, many popular AI assistants offer features like these (the exact names and options vary between apps and plans):

- **Memory or personalization.** The assistant can remember facts you share — your job, your preferences, ongoing projects — and use them in future chats. Usually you can view, edit or delete what it remembers, or switch it off.
- **Custom instructions.** A place to write standing preferences once ("I'm a beginner, explain simply, use metric units") so you don't repeat them in every chat.
- **Projects or workspaces.** A shared space with your files and instructions, so every chat about that project starts with the right background.
- **Temporary or incognito chats.** Conversations that aren't saved to memory, for one-off or sensitive questions.

These features are genuinely handy. A [study tutor](example-study-tutor.html) that remembers which topics you've mastered and which ones you struggle with can pick up right where you left off, instead of starting over every evening.

## Privacy: you're in charge of the notebook

Long-term memory means information about you is being **stored**. That's useful, but it's worth being thoughtful about. A few simple habits go a long way:

- **Check what's remembered.** Open your assistant's memory or personalization settings now and then. Delete anything outdated, wrong or more personal than you'd like.
- **Never share secrets.** Passwords, bank details, ID numbers and similar information don't belong in an AI chat — remembered or not.
- **Think twice about other people's information.** Colleagues', clients' or friends' personal details deserve the same care as your own.
- **Use temporary chats for sensitive topics** you don't want saved.
- **Follow your workplace's rules.** Many organizations have approved AI tools with specific data settings. Use those for work material rather than a personal account.
- **Remember that memory can be wrong.** If the assistant "remembers" something incorrect about you, it will keep using it until you correct or delete it.

> [!WARNING] Saved memories shape future answers
> Whatever ends up in long-term memory gets quietly added to future conversations. That's great when it's accurate and relevant, but an outdated or mistaken memory can skew answers without you noticing. If an assistant keeps assuming something odd, check its memory first.

Here's a prompt you can use to see what an assistant knows and tidy it up:

```prompt
Please list everything you currently remember about me or have saved from our past conversations (preferences, facts, projects).
For each item, tell me where it came from if you can.
Then I'll tell you which ones to keep, correct or forget.
```

And one for handing a long conversation over to a fresh chat:

```prompt
We've covered a lot. Write a compact summary I can paste into a new chat so you can continue without losing anything important. Include: my goal, key facts and decisions so far, open questions, and the next steps.
```

## Quick check

```quiz
Q: What is an agent's "context window"?
- [ ] A permanent record of every conversation it has ever had
- [x] Everything the model can see at once while it works, up to a limit
- [ ] The part of the screen where the AI's answer appears
- [ ] A settings page for choosing which tools are allowed
E: The context window is short-term memory: the instructions, conversation, documents and tool results the model can see right now. It's limited in size, and it isn't permanent — that's what long-term memory is for.

Q: Early in a very long task, you told an agent an important fact. Now it's acting as if it never heard it. What's the most likely reason?
- [ ] The agent decided the fact wasn't true
- [ ] The model was retrained during the conversation
- [x] The fact dropped out of its context window as it filled up
- [ ] Agents ignore anything said before the first tool call
E: As the backpack fills, older material can be dropped or compressed. If the fact wasn't kept in a summary or saved to long-term memory, the model can no longer see it. The model doesn't retrain itself mid-chat.

Q: Which is the best way for an agent to remember your preferences between separate conversations?
- [ ] Keep one endless chat open so nothing is ever lost
- [ ] Rely on the model learning from each conversation automatically
- [ ] Repeat your preferences at the end of every message
- [x] Save them to long-term memory it can look up next time
E: Separate chats start with an empty backpack, and models don't learn from your chats on the fly. Saved memory (or custom instructions) puts your preferences back into the context when needed. An endless chat just overfills the backpack.
```

## What's next

You now know how agents hold onto information, both for the task at hand and over time. Next, we'll look at how they use it to work out *what to do* on big, multi-step goals: **Planning** — breaking a goal into steps, and changing the plan when reality gets in the way.
