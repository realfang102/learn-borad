---
title: "The deep research agent"
emoji: "🔎"
subtitle: "Watch a lead agent split a real-life question, send out helper agents, untangle a contradiction and write a report with sources."
category: "Research"
level: "Intermediate"
concepts: [agent-teams, planning, tools, reliable-agents]
sim: research-agent
---

Some questions can't be answered with one search. "Is a heat pump worth it for my house?" depends on the weather, the building, energy prices and money available to help pay for it — and the web is full of advice that is outdated, one-sided or selling something. Normally you'd open twenty tabs and lose an evening.

A **deep research agent** does that evening for you. It plans what it needs to find out, reads many sources, compares them, and writes a report where every claim points back to where it came from. In this example, a homeowner named Priya asks exactly that question, and a small *team* of agents goes to work.

<div class="sim" data-sim="research-agent"></div>

> [!TRY] Watch the token counter
> Press **Step ⏭** one move at a time and keep an eye on the 🔤 tokens number. See how it jumps when the helpers start searching? That's the price of a research *team*: faster and more thorough, but much more computing than a single chat.

## How it works

<div class="steps-strip">
<div><strong>Clarify</strong>Ask the one or two questions the answer really depends on.</div>
<div><strong>Plan</strong>Split the big question into smaller, independent sub-questions.</div>
<div><strong>Fan out</strong>Send helper agents to research each sub-question at the same time.</div>
<div><strong>Judge sources</strong>Prefer independent, recent evidence; skip adverts.</div>
<div><strong>Resolve conflicts</strong>When sources disagree, find out <em>why</em> before writing.</div>
<div><strong>Write and check</strong>Cite every claim, then verify each citation.</div>
</div>

The clever part is the **lead agent** — the "manager" that plans the work and writes the final report. It doesn't read every web page itself. Each **helper agent** (sometimes called a *subagent*) gets one focused task, does its own searching and reading, and hands back a short summary. That keeps the lead agent's memory uncluttered, so it can think clearly about the big picture. You can read more about this pattern in [teams of agents](agent-teams.html).

The most important moment in the run is the **contradiction**. One source said heat pumps "lose most of their power below -10 °C"; another said modern models heat well at -25 °C. Instead of picking one, the lead agent sent a fact-checker to compare them — and discovered they were describing different machines from different years. Good research isn't collecting quotes; it's noticing when things don't fit.

<div class="detail">

**The real technology (as of 2026):** "deep research" is now a standard feature of the big AI assistants. Google launched Gemini Deep Research in December 2024; OpenAI (ChatGPT deep research), Perplexity and Anthropic (Claude's Research feature) followed in early 2025. They differ in the details, but share the same loop: plan, search, read, take notes, repeat, then write a cited report — often taking several minutes per question.

Anthropic has described its own setup publicly: a lead agent plans the research and starts several subagents that search in parallel, then combines their findings, with a separate citation step that links each claim to the source it came from. It also reported the downside you saw in the token counter — its multi-agent research used roughly 15 times more tokens than an ordinary chat. That's why these tools save the team approach for questions that are genuinely broad.

</div>

## Why this works

- **Parallel work.** Three helpers researching at once finish much sooner than one agent doing everything in turn.
- **Fresh eyes for each sub-question.** Each helper starts with a clean memory, so it isn't distracted by everything else the team has read.
- **Citations make checking easy.** Because each sentence points to a source, you (and the agent) can verify any claim in seconds.
- **Honest wording.** A good report says "likely" and "depends" when the evidence does. That's not weakness — it's accuracy.

It's ideal for decisions like this one: comparing products or options, getting up to speed on a new topic for school or work, or preparing a briefing before a meeting. See [agents at work](agents-at-work.html) and [learn faster with AI](learn-faster.html) for more ideas.

> [!WARNING] What can go wrong
> - **Invented or mismatched citations.** An agent can attach a real-looking source to a claim the source doesn't make. Spot-check two or three citations, especially for the claims you'll act on.
> - **Trusting weak sources.** Adverts, old guides and copied content can sneak in. Ask the agent to say how recent and how independent each source is.
> - **Answering a different question.** Without clarifying, the agent might research heat pumps in general instead of *your* house in *your* climate.
> - **False confidence.** A polished report still isn't professional advice. For big money decisions, use it to ask better questions of real experts — like installers giving quotes.

## Try it yourself

Paste this into an AI assistant with a research or web-search mode (such as ChatGPT, Gemini, Claude or Perplexity):

```prompt
I want a short research report on: [your question, e.g. "Should I buy an electric car if I can't charge at home?"].
My situation: [a few key details: where you live, budget, what matters most].
Please:
1. Ask me up to 2 clarifying questions first if the answer depends on details I haven't given.
2. Break the question into 3–4 sub-questions and research each one.
3. Prefer recent, independent sources; tell me the year and type of each source.
4. If sources disagree, explain why instead of picking one.
5. Cite every claim with a numbered source, and end with a clear "bottom line" plus what I should check myself.
```

When the report arrives, follow up with this to make the agent check its own work:

```prompt
Go through your report claim by claim. For each citation, quote the exact sentence from the source that supports it. Flag any claim that isn't directly supported, and tell me which parts are most uncertain.
```

```quiz
Q: Why did the lead agent send helper agents instead of researching everything itself?
- [ ] Helpers use fewer tokens than one agent working alone
- [x] The sub-questions could be researched in parallel
- [ ] The lead agent wasn't allowed to search the web itself
- [ ] Helper agents check each other, so they can't be wrong
E: The three sub-questions didn't depend on each other, so helpers could work at the same time, each with a clean, focused memory. It actually costs *more* tokens, not fewer: that's the trade-off you saw on the counter.

Q: Two sources disagreed about heat pumps in deep cold. What did the agent do?
- [ ] Used the source with the higher relevance score
- [ ] Left cold weather out of the report entirely
- [x] Found out why they disagreed and explained it
- [ ] Asked Priya which of the two sources she trusted
E: The sources described different kinds of machines from different years, so both were right about what they described. A relevance score only says how well a page matches the question, not whether it's correct, so "pick the higher score" wouldn't have settled it.

Q: What's the best quick habit when you get a cited research report from an agent?
- [ ] Trust it fully, since every claim has a citation
- [x] Spot-check a few citations, especially key ones
- [ ] Delete every claim that uses the word "likely"
- [ ] Ask for a much longer report with more sources
E: Citations make checking easy, but agents can still attach a source to a claim it doesn't support. A two-minute spot-check of the claims you'll act on catches most problems. Words like "likely" are usually a sign of honesty, not a mistake.
```
