---
title: "The writing team (writer + editor)"
emoji: "✍️"
subtitle: "A writer and an editor agent refine a newsletter while a fact-checker catches an invented statistic."
category: "Writing"
level: "Intermediate"
concepts: [agent-teams, reliable-agents, great-instructions]
sim: writing-team
---

AI first drafts are fluent, but fluent isn't *good*: they ramble, miss the brief, and sometimes include "facts" that were never true. Nadia's tea-shop newsletter goes to a small **team of agents** instead: a **writer** drafts, an **editor** grades against a checklist, and a **fact-checker** verifies every claim.

<div class="sim" data-sim="writing-team"></div>

> [!TRY] Compare the drafts
> Use **Step** to pause on draft 1 and check it against the **Editor's checklist** before the editor does.

## How it works

<div class="steps-strip">
<div><strong>Brief → checklist</strong>Turn the request into pass/fail criteria.</div>
<div><strong>Draft</strong>The writer produces a complete first version.</div>
<div><strong>Critique</strong>The editor grades it item by item.</div>
<div><strong>Revise</strong>The writer fixes exactly what was flagged.</div>
<div><strong>Verify facts</strong>A fact-checker searches for evidence.</div>
<div><strong>Human sign-off</strong>The owner approves before anything is sent.</div>
</div>

One agent generates, another evaluates, and the loop repeats until the work passes: an **evaluator-optimizer** loop, which works because **judging is easier than creating**. The checklist came straight from Nadia's brief, which is why [great instructions](great-instructions.html) matter: your request becomes the test the work must pass.

<div class="detail">

**The real technology, as of 2026.** "Evaluator-optimizer" is one of the common agent workflow patterns in Anthropic's guide *Building effective agents* (December 2024). A model grading another model's output is often called **LLM-as-a-judge**. Developers build these teams with frameworks such as the Claude Agent SDK (which supports subagents), the OpenAI Agents SDK, LangGraph and CrewAI. The three roles might even be the same model with different instructions; separate roles are what make them a team.

The fact-checker relies on **web search** (or a company's own documents), so its claims rest on sources rather than memory. Search results can be wrong too, which is why a human still signs off. See [agent teams](agent-teams.html) and [reliable agents](reliable-agents.html).

</div>

## Why this works

- **Separate roles catch different problems.** The editor caught length, tone and missing details; only the fact-checker, which *searched*, caught the invented survey.
- **A checklist defines "done".** The loop stops when every item passes, not when the writer feels finished.
- **Rounds are cheap.** An extra round takes seconds; two or three usually give noticeably better work.
- **The human sees the change log.** Nadia learns what was fixed, so she can judge how far to trust it.

The "2025 survey" sounded exactly like a real fact: models sometimes produce plausible details with no source, called **hallucination**. Only *looking for evidence* revealed it, and the honest fix was to drop the number and keep the point.

> [!WARNING] What can go wrong
> - **The editor agrees too easily.** Give it a strict checklist and ask it to find at least one problem.
> - **Endless polishing.** Without a finish line, loops keep tweaking. Set a maximum number of rounds.
> - **Fact-checks that "find" a source.** Ask for links and spot-check them yourself.

## Try it yourself

Run a simple version in one chat with any capable AI assistant:

```prompt
Write [type of writing] about [topic] for [audience].
Must include: [key details]. Tone: [tone]. Under [N] words.
Work in three roles and show each step:
1. EDITOR: turn my brief into a 5–7 item pass/fail checklist.
2. WRITER: write draft 1.
3. EDITOR: grade it item by item, with specific fixes.
4. WRITER: revise. Repeat 3–4 at most twice.
5. FACT-CHECKER: mark every claim verified, needs a source, or remove. Never invent sources.
End with the final draft and a short change log.
```

```quiz
Q: Why does splitting the work into a writer and an editor tend to give better results?
- [ ] Two agents always type twice as fast as one agent
- [x] Judging a draft is easier than writing it perfectly
- [ ] The editor knows facts that the writer has never seen
- [ ] The editor is always a bigger, more powerful model
E: Checking "is it under 350 words?" is easier than writing perfect text in one try, and a critic with a clear checklist turns that into specific fixes. The roles can even share one model, so "a more powerful editor" isn't the reason.

Q: Which problem could only the fact-checker catch?
- [ ] The draft was 412 words, over the limit
- [ ] The tasting time was missing from the draft
- [x] The "2025 survey" statistic had no real source
- [ ] There were three calls to action instead of one
E: Length, missing details and tone can be checked by reading. A made-up statistic looks just like a real one; only searching for evidence exposed it.

Q: What did the team do when it couldn't find the survey?
- [ ] Kept the claim, because it sounded believable
- [ ] Kept searching until something similar turned up
- [ ] Asked the writer to come up with a citation
- [x] Removed the number and rewrote the line honestly
E: When a claim can't be backed up, remove it or reword it so it claims no more than you know. Hunting for a "similar" source to fit a belief is how misinformation spreads.
```
