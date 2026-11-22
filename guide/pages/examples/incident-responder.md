---
title: "The on-call incident responder"
emoji: "🚨"
subtitle: "An agent investigates a 3 a.m. outage, tests each idea, and asks before changing anything."
category: "Operations"
level: "Advanced"
concepts: [the-agent-loop, tools, reliable-agents, staying-safe]
sim: incident-responder
---

When a website breaks at night, an **alert** wakes an **on-call engineer**, whose first half hour is detective work: graphs, error messages, "what changed?" An agent can have the evidence ready before the human logs in, while the human stays in charge of every change; here, checkout fails at the fictional Larkspur Grocer.

<div class="sim" data-sim="incident-responder"></div>

> [!TRY] Watch the hypotheses
> Press **Step** to see the agent cross off causes one by one; then, as Sam, try **Hold off** on the rollback.

## How it works

<div class="steps-strip">
<div><strong>Triage</strong>Measure how bad it is, and since when.</div>
<div><strong>Hypothesize</strong>List possible causes instead of guessing one.</div>
<div><strong>Test each one</strong>A quick check proves or rules out each.</div>
<div><strong>Propose a fix</strong>One small, reversible change, with evidence.</div>
<div><strong>Wait for a human</strong>The on-call engineer approves or says no.</div>
<div><strong>Verify &amp; record</strong>Confirm recovery, then write a short summary.</div>
</div>

The logs blamed the database, but the agent **double-checked**, found it healthy, and traced the real cause: an automated job had cut a setting from 50 to 5 a minute before the errors began. It investigated freely, but the **rollback** (restoring the previous setting) waited for Sam's approval, and "success" only counted once the dashboard and 20 test checkouts confirmed it ([making agents reliable](reliable-agents.html)).

<div class="detail">

**The real technology, as of 2026.** This field is **incident response**, and the people who keep services running are often called **SREs** (site reliability engineers). Several companies now offer "AI SRE" agents: monitoring companies such as Datadog, incident-management tools such as PagerDuty and incident.io, and cloud providers such as Microsoft Azure have all released agents that investigate alerts. Teams also build their own, connecting general-purpose agents to monitoring and logging tools, often through **MCP** (Model Context Protocol), a standard way to plug tools into an agent. Grafana, for example, publishes an MCP server for its dashboards.

Under the hood it's the same [agent loop](the-agent-loop.html) as any agent: run a query, read the result, decide what next. Safety comes from the setup around the model: **read-only access by default**, a short list of pre-approved fixes, human approval before any change, and a log of every command. Most teams start with "investigate and suggest", and allow autonomous action, if ever, only for small, easily undone fixes.

</div>

## Where this is used today

- **Faster first look:** graphs, logs and recent changes in one summary, so engineers start from evidence.
- **Runbooks:** agents follow a team's step-by-step guides for common problems and report each step.
- **Write-ups:** agents draft the timeline and summary, a chore engineers gladly hand off.
- **Humans still decide:** most teams require approval for live changes, especially at night.

> [!WARNING] What can go wrong
> - **Confident but wrong.** The first clue can mislead; skip the double-check and you "fix" the wrong thing.
> - **Making it worse.** A risky change mid-outage can grow the problem. Keep fixes small, reversible, approved.
> - **Too much access.** Planted text in a log or ticket can trick an agent (see [staying safe](staying-safe.html)).

## Try it yourself

No website needed. Ask a capable AI assistant to investigate any problem like an on-call engineer:

```prompt
Act as a calm, careful incident responder. The problem: [what's broken, e.g. "our team drive stopped syncing this morning"].
What I know: [error messages, when it started, recent changes].
1. Ask me up to 3 questions if anything important is missing.
2. List 3–4 possible causes, most likely first, with supporting evidence.
3. For each, suggest one quick, safe check to rule it in or out.
4. Warn me before suggesting anything that deletes data or can't be undone.
```

```prompt
Turn these notes into a short, blame-free incident summary: [paste notes].
Headings: What happened, Impact, Cause, Fix, How we confirmed it, Follow-ups.
Under 200 words, plain language; mark anything uncertain "(to confirm)".
```

## Quick check

```quiz
Q: Why did the agent list several hypotheses instead of acting on its first idea?
- [ ] Listing more ideas burns more tokens, and more tokens always make an agent smarter
- [x] So it could test each one and rule out wrong causes before changing anything
- [ ] Because the alert message told it exactly which three causes it had to check
- [ ] So it could apply all three fixes at once and keep whichever one happened to work
E: Testing hypotheses one at a time avoids jumping to conclusions. Applying several fixes at once is riskier and hides which change actually helped.

Q: The logs blamed the payments database. What did the agent do next?
- [ ] Restarted the database straight away, just to be on the safe side
- [ ] Reported the database as the cause to Sam and stopped investigating
- [x] Checked the database directly, and found it was healthy
- [ ] Asked Sam to wake up and read through all the logs himself
E: The first clue can mislead. Checking directly showed the real bottleneck was checkout's own connection limit, so the agent didn't "fix" something that wasn't broken.

Q: The rollback command reported success. Why wasn't the agent finished yet?
- [ ] It still needed to roll back yesterday's code deploy as well, just in case
- [x] A successful command doesn't prove the fix worked, so it checked
- [ ] It had to wait for Sam to approve the very same command a second time
- [ ] The incident summary has to be written before the error rate can drop
E: "The command worked" and "customers can check out" are different things. The agent watched errors drop and ran 20 test checkouts before calling it resolved.
```
