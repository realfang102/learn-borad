---
title: "The writing team (writer + editor)"
emoji: "✍️"
subtitle: "Watch a writer agent and an editor agent improve a newsletter in rounds, while a fact-checker catches an invented statistic."
category: "Writing"
level: "Intermediate"
concepts: [agent-teams, reliable-agents, great-instructions]
sim: writing-team
---

Ask an AI to write something and you'll get a fluent first draft in seconds. Fluent, though, isn't the same as *good*. First drafts ramble, miss details from the brief, slip into a salesy tone, and sometimes include "facts" that were never true. Human writers deal with this by working with an editor. AI can work the same way.

In this example, Nadia runs a small tea shop and needs her December newsletter. Her setup uses a small **team of agents**: a **writer** that drafts, an **editor** that grades each draft against a checklist, and a **fact-checker** that verifies every claim. Watch the draft improve over two rounds, and look for the moment the fact-checker discovers the writer made up a statistic.

<div class="sim" data-sim="writing-team"></div>

> [!TRY] Compare the drafts
> Use **Step ⏭** and pause on draft 1. Before the editor speaks, see how many problems you can find by checking it against the **Editor's checklist**. Then watch whether the editor catches the same ones and whether it catches the one problem a checklist alone can't.

## How it works

<div class="steps-strip">
<div><strong>Brief → checklist</strong>Turn the request into clear pass/fail criteria.</div>
<div><strong>Draft</strong>The writer produces a complete first version.</div>
<div><strong>Critique</strong>The editor grades it item by item with specific notes.</div>
<div><strong>Revise</strong>The writer fixes exactly what was flagged.</div>
<div><strong>Verify facts</strong>A fact-checker searches for evidence for each claim.</div>
<div><strong>Human sign-off</strong>The owner approves before anything is sent.</div>
</div>

This pattern, where one agent generates and another evaluates and the loop repeats until the work passes, is often called an **evaluator-optimizer** loop. It works for the same reason human editing works: **judging is easier than creating**. It's hard to write a perfect paragraph in one go, but it's easy to check "is this under 350 words?" or "does it mention the event time?" A separate editor also has no attachment to the draft, so it's more willing to say "cut this."

The checklist is what makes the critique useful. Vague feedback ("make it better") leads to random changes. Specific feedback ("add the time: 2–4 pm"; "keep ONE call to action") leads to targeted fixes. And notice that the checklist came straight from Nadia's brief. That's why [great instructions](great-instructions.html) matter so much. Your request becomes the test the work has to pass.

<div class="detail">

**The real technology, as of 2026.** "Evaluator-optimizer" is one of the common agent workflow patterns described in Anthropic's guide *Building effective agents* (December 2024). The general idea of a model grading another model's output is often called **LLM-as-a-judge**. Developers build these teams with frameworks such as the Claude Agent SDK (which supports subagents), the OpenAI Agents SDK, LangGraph and CrewAI. The writer, editor and fact-checker might even be the same underlying model with different instructions. What makes them a team is their separate roles.

The fact-checker relies on **web search** (or a company's own documents), so its claims are grounded in sources rather than memory. This helps a lot, but it isn't perfect: search results can be wrong too, which is why a human still signs off. See [agent teams](agent-teams.html) and [reliable agents](reliable-agents.html).

</div>

## Why this works

- **Separate roles catch different problems.** The editor caught length, tone and missing details. Only the fact-checker, which actually *searched*, could catch the invented survey.
- **A checklist makes "done" clear.** The loop stops when every item passes, not when the writer feels finished.
- **Rounds are cheap.** Two extra rounds take an AI team seconds. Repeat the loop a few times and you get noticeably better work.
- **The human sees the change log.** Nadia learns what was fixed, including the fake statistic, so she can judge how much to trust the result.

The invented statistic deserves a closer look. "A 2025 survey found 8 in 10 tea drinkers brew green tea too hot" sounds exactly like a real fact, and that's the danger. Language models sometimes produce plausible details that have no source, which is called **hallucination**. The editor checked it against the checklist and couldn't tell it was false. Only *looking for evidence* revealed it. The fix was simple and honest: drop the number and keep the useful point.

> [!WARNING] What can go wrong
> - **The editor agrees too easily.** An AI critic can be too generous, especially if it's the same model judging its own style. Give it a strict checklist and ask it to find at least one problem.
> - **Endless polishing.** Without a clear finish line, loops can keep making tiny changes (or make things worse). Set a maximum number of rounds.
> - **Fact-checks that "find" a source.** A weak checker might cite something that doesn't really support the claim. Ask for links and spot-check them yourself.
> - **Everything sounds the same.** AI-polished writing can lose your voice. Give the team samples of your own writing to match.

## Try it yourself

You can run a simple version of this in one chat with any capable AI assistant:

```prompt
I need [type of writing, e.g. a newsletter] about [topic] for [audience].
Must include: [key details, e.g. event date and time]. Tone: [tone]. Length: under [N] words.
Work in three roles, and show each step:
1. EDITOR: turn my brief into a pass/fail checklist (5–7 items).
2. WRITER: write draft 1.
3. EDITOR: grade draft 1 against the checklist, item by item, with specific fixes.
4. WRITER: revise. Repeat steps 3–4 at most twice.
5. FACT-CHECKER: list every factual claim (numbers, dates, studies). Mark each as verified, needs a source, or remove. Never invent sources.
Finish with the final draft and a short change log.
```

```quiz
Q: Why does splitting the work into a writer and an editor tend to give better results?
- [ ] Two agents always type twice as fast as one
- [x] Checking work against criteria is easier than writing it perfectly at once
- [ ] The editor knows facts the writer doesn't
- [ ] Editors are always a more powerful AI model
E: Judging ("is it under 350 words? is the time included?") is easier than creating perfect text in one try. A separate critic with a clear checklist turns that into specific fixes. The roles can even use the same model.

Q: Which problem could only the fact-checker catch?
- [ ] The draft was 412 words, over the limit
- [ ] The tasting time was missing
- [x] The "2025 survey" statistic had no real source
- [ ] There were three calls to action instead of one
E: Length, missing details and tone can all be checked by reading. A made-up statistic looks just like a real one, so only searching for evidence revealed it was invented.

Q: What did the team do when it couldn't find the survey?
- [ ] It kept the claim because it sounded believable
- [ ] It searched until something similar turned up
- [ ] It asked the writer to invent a citation
- [x] It removed the number and rewrote the line honestly
E: When a claim can't be backed up, the honest fixes are to remove it or reword it so it doesn't claim more than you know. Hunting for a "similar" source to fit a claim you already believe is how misinformation spreads.
```
