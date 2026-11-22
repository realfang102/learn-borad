---
title: "The on-call incident responder"
emoji: "🚨"
subtitle: "Watch an agent investigate a 3 a.m. outage — testing ideas one by one, asking before it touches anything, and writing up what happened."
category: "Operations"
level: "Advanced"
concepts: [the-agent-loop, tools, reliable-agents, staying-safe]
sim: incident-responder
---

Every website and app you use is watched around the clock. When something breaks — say, customers suddenly can't pay — an **alert** goes off and an **on-call engineer** gets woken up, sometimes in the middle of the night. Their first half hour is usually detective work: looking at graphs, reading error messages, and asking "what changed?"

That detective work is a great job for an agent. It doesn't get groggy at 3 a.m., it can read thousands of log lines in seconds, and it can have the evidence ready by the time the human logs in. But fixing a live system is risky, so the human stays firmly in charge of every change. In this example, the grocery website of the fictional company Larkspur Grocer starts failing at checkout.

<div class="sim" data-sim="incident-responder"></div>

> [!TRY] Watch the hypotheses
> Press **Step ⏭** and follow the "Agent's thinking" pane. Notice how the agent lists three possible causes and crosses them off one at a time. Then, as Sam, try clicking **✋ Hold off** on the rollback and see what the agent does.

## How it works

<div class="steps-strip">
<div><strong>Triage</strong>Measure how bad it is and when it started.</div>
<div><strong>Hypothesize</strong>List possible causes instead of guessing one.</div>
<div><strong>Test each one</strong>Run a quick check that proves or rules out each idea.</div>
<div><strong>Propose a fix</strong>One small, reversible change, with the evidence.</div>
<div><strong>Wait for a human</strong>The on-call engineer approves or says no.</div>
<div><strong>Verify &amp; record</strong>Confirm recovery, then write a short summary.</div>
</div>

The agent worked like a careful detective. The graph showed a sudden **jump** in errors at 03:05, which hinted that *something changed*. It tested the cheapest idea first (a traffic surge — ruled out), followed the clue in the logs, and then **double-checked** that clue: the logs blamed the database, but the database itself turned out to be healthy. That surprise steered it to the real cause — an automated job had changed one setting from 50 to 5, just one minute before the trouble began.

Two habits matter most here. First, the agent kept **investigating** (reading graphs and logs, which is safe) separate from **changing** things (risky). It could look at anything on its own, but the rollback needed Sam's approval. Second, it didn't stop when the command said "success". It **verified** the fix on the dashboard and with 20 test checkouts. You can read more about these habits in [making agents reliable](reliable-agents.html).

<div class="detail">

**The real technology, as of 2026.** Engineers call this field **incident response**, and the people who keep services running are often called **SREs** (site reliability engineers). Several companies now offer "AI SRE" agents. Monitoring companies such as Datadog, incident-management tools such as PagerDuty and incident.io, and cloud providers such as Microsoft Azure have all released agents that can investigate alerts. Teams also build their own on top of general-purpose agents, connecting them to monitoring and logging systems as tools — often through **MCP** (Model Context Protocol), a standard way to plug tools into an agent. Grafana, for example, publishes an MCP server for its dashboards.

Under the hood, it's the same [agent loop](the-agent-loop.html) as any other agent: the model asks to run a query, reads the result, and decides what to try next. What makes it safe is the setup around the model: **read-only access by default**, a short list of pre-approved fixes (such as "roll back the last config change"), a human approval step before any change, and a log of every command for later review. Most teams start with "investigate and suggest" and only let the agent take action on its own, if ever, for small and easily undone fixes.

</div>

## Where this is used today

- **Faster first look.** Agents gather graphs, logs and recent changes into one summary, so the engineer starts from evidence instead of a blank screen.
- **Runbooks.** Many teams have written step-by-step guides for common problems. Agents can follow them and report each step.
- **Write-ups.** After the incident, agents draft the timeline and summary — a chore engineers are often glad to hand off.
- **Humans still decide.** In most teams, changes to live systems still need a person's approval, especially at night when mistakes are costly.

> [!WARNING] What can go wrong
> - **Confident but wrong.** The first clue can mislead — here, the logs blamed a healthy database. An agent that skips the double-check might "fix" the wrong thing.
> - **Making it worse.** A risky change during an outage can turn a small problem into a big one. Keep fixes small, reversible, and approved.
> - **Too much access.** An agent that can change everything is dangerous if it misunderstands, or if someone tricks it with planted text in a log or ticket (see [staying safe](staying-safe.html)).
> - **Hiding the reasoning.** If the agent doesn't show its evidence, the human can't check it. Always ask "how do you know?"

## Try it yourself

You don't need to run a website to practise this way of thinking. Paste a problem into a capable AI assistant and ask it to investigate like an on-call engineer:

```prompt
Act as a calm, careful incident responder. Here's the problem: [describe what's broken, e.g. "our shared team drive stopped syncing this morning"].
Here's what I know so far: [error messages, when it started, anything that changed recently].

Please:
1. Ask me up to 3 questions if anything important is missing.
2. List 3–4 possible causes, most likely first, and say what evidence supports each.
3. For each cause, suggest one quick, safe check I can do to rule it in or out.
4. Don't suggest anything that deletes data or can't be undone without warning me first.
```

After a problem is solved, use this to write it up:

```prompt
Turn these notes into a short, blame-free incident summary for my team: [paste your notes or chat log].
Use these headings: What happened, Impact, Cause, How we fixed it, How we confirmed it was fixed, Follow-ups.
Keep it under 200 words, use plain language, and mark anything you're unsure about with "(to confirm)".
```

## Quick check

```quiz
Q: Why did the agent list several hypotheses instead of acting on its first idea?
- [ ] Listing more ideas uses more tokens, which makes the agent smarter
- [x] So it could test each one and rule out wrong causes before changing anything
- [ ] Because the alert told it exactly which three causes to check
- [ ] So it could apply three fixes at once and see which one worked
E: Testing hypotheses one at a time is how good investigators avoid jumping to conclusions. Applying several fixes at once is tempting, but it makes things riskier and hides which change actually helped.

Q: The logs blamed the payments database. What did the agent do next?
- [ ] Restarted the database straight away to be safe
- [ ] Reported the database as the cause and stopped
- [x] Checked the database directly — and found it was healthy
- [ ] Asked Sam to read the logs himself
E: The first clue can mislead. By checking the database directly, the agent discovered the real bottleneck was checkout's own connection limit — saving it from "fixing" something that wasn't broken.

Q: The rollback command reported success. Why wasn't the agent finished yet?
- [ ] It still needed to roll back the code deploy as well
- [x] A successful command doesn't prove the problem is gone, so it verified the fix
- [ ] It had to wait for Sam to approve the command a second time
- [ ] The summary has to be written before the error rate can drop
E: "The command worked" and "customers can check out again" are different things. The agent watched the error rate drop and ran 20 test checkouts before calling it resolved.
```
