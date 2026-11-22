---
title: "The deep research agent"
emoji: "🔎"
subtitle: "Watch a team of agents split a question, untangle a contradiction and write a cited report."
category: "Research"
level: "Intermediate"
concepts: [agent-teams, planning, tools, reliable-agents]
sim: research-agent
---

Some questions cost an evening of twenty open tabs, like Priya's: "Is a heat pump worth it for my house?" A **deep research agent** plans, reads and compares sources for you, then writes a report where every claim is cited.

<div class="sim" data-sim="research-agent"></div>

> [!TRY] Watch the token counter
> Press **Step** and watch **tokens** jump when the helpers start: a team is faster, but costs far more.

## How it works

<div class="steps-strip">
<div><strong>Clarify</strong>Ask what the answer really depends on.</div>
<div><strong>Plan</strong>Split into independent sub-questions.</div>
<div><strong>Fan out</strong>Helpers research each one in parallel.</div>
<div><strong>Judge sources</strong>Prefer independent, recent evidence; skip adverts.</div>
<div><strong>Resolve conflicts</strong>When sources disagree, find out <em>why</em>.</div>
<div><strong>Write and check</strong>Cite every claim, then verify each citation.</div>
</div>

The **lead agent** plans and writes, while each **helper agent** (or *subagent*) researches one focused task and hands back a short summary, keeping the lead's memory uncluttered; see [teams of agents](agent-teams.html). The key moment is the contradiction: rather than pick a side, the agent found the two sources described different machines from different years.

<div class="detail">

**The real technology (as of 2026):** "deep research" is a standard feature of the big AI assistants. Google launched Gemini Deep Research in December 2024; OpenAI (ChatGPT deep research), Perplexity and Anthropic (Claude's Research feature) followed in early 2025. All share one loop: plan, search, read, take notes, repeat, then write a cited report, often over several minutes.

Anthropic has described its own setup: a lead agent starts several subagents that search in parallel and combines their findings, with a separate citation step linking each claim to its source. It also reported the cost you saw on the counter: roughly 15 times more tokens than an ordinary chat. That's why the team approach is saved for genuinely broad questions.

</div>

## Why this works

- **Parallel work.** Three helpers at once beat one working in turn.
- **Fresh eyes.** Each helper starts with a clean, focused memory.
- **Easy checking.** Every sentence points to a source you can verify.
- **Honest wording.** "Likely" and "depends" are accuracy, not weakness.

Ideal for comparing options, getting up to speed on a topic, or a pre-meeting briefing. More ideas in [agents at work](agents-at-work.html) and [learn faster with AI](learn-faster.html).

> [!WARNING] What can go wrong
> - **Mismatched citations.** A real-looking source may not say what's claimed; spot-check the key ones.
> - **Weak sources.** Adverts and old guides sneak in; ask how recent and independent each one is.
> - **False confidence.** A polished report isn't professional advice; use it to ask real experts better questions.

## Try it yourself

Paste this into an assistant with a research or web-search mode (such as ChatGPT, Gemini, Claude or Perplexity):

```prompt
Research report on: [your question]. My situation: [key details].
1. Ask me up to 2 clarifying questions first.
2. Split it into 3–4 sub-questions and research each.
3. Prefer recent, independent sources; give each one's year and type.
4. If sources disagree, explain why. Cite every claim and end with a "bottom line".
```

Then make it check its own work:

```prompt
For each citation, quote the exact sentence from the source that supports it. Flag any claim that isn't directly supported.
```

```quiz
Q: Why did the lead agent send helper agents instead of researching everything itself?
- [ ] Helpers use fewer tokens than one agent working alone
- [x] The sub-questions could be researched in parallel
- [ ] The lead agent wasn't allowed to search the web itself
- [ ] Helper agents check each other, so they can't be wrong
E: The three sub-questions didn't depend on each other, so helpers could work at once, each with a clean, focused memory. It costs *more* tokens, not fewer: the trade-off you saw on the counter.

Q: Two sources disagreed about heat pumps in deep cold. What did the agent do?
- [ ] Used the source with the higher relevance score
- [ ] Left cold weather out of the report entirely
- [x] Found out why they disagreed and explained it
- [ ] Asked Priya which of the two sources she trusted
E: The sources described different machines from different years, so both were right about what they described. A relevance score shows how well a page matches the question, not whether it's correct.

Q: What's the best quick habit when you get a cited research report from an agent?
- [ ] Trust it fully, since every claim has a citation
- [x] Spot-check a few citations, especially key ones
- [ ] Delete every claim that uses the word "likely"
- [ ] Ask for a much longer report with more sources
E: Agents can attach a source to a claim it doesn't support. A quick spot-check of the claims you'll act on catches most problems. Words like "likely" usually signal honesty, not a mistake.
```
