---
title: "The customer support agent"
emoji: "🎧"
subtitle: "Watch an agent investigate a missing package, follow policy, and ask before a big refund."
category: "Customer service"
level: "Beginner"
concepts: [tools, staying-safe, agents-at-work, the-agent-loop]
sim: support-agent
---

Unlike an old-style chatbot, a support **agent** can actually *do* things: look up orders, check tracking, issue refunds. Here, Jordan's package says "delivered" but never arrived; watch the agent stay kind, check the facts and know when to hand a decision to a person.

<div class="sim" data-sim="support-agent"></div>

> [!TRY] Play the team lead
> At the approval card, click **Deny**, then **Restart** and approve: the agent does the same investigating either way.

## How it works

<div class="steps-strip">
<div><strong>Empathize and plan</strong>Acknowledge the problem, then plan the steps.</div>
<div><strong>Verify identity</strong>Confirm it's really the customer first.</div>
<div><strong>Investigate</strong>Look up the order, then the tracking details.</div>
<div><strong>Follow policy</strong>Search the real rules; never improvise promises.</div>
<div><strong>Offer options</strong>Check stock and let the customer choose.</div>
<div><strong>Escalate big actions</strong>Refunds over the limit go to a human.</div>
</div>

Every action is a **tool call** to one of the shop's systems, like `lookup_order` or `issue_refund`; the agent chooses which and when ([tools: how agents take action](tools.html)). Faced with "delivered" versus "missing", it neither refused nor refunded blindly: it pulled the detailed scan (0.6 miles away, no photo) and asked one fair follow-up question.

<div class="detail">

**The real technology (as of 2026):** many companies run AI agents on support chat and email, using platforms such as Intercom's Fin, Salesforce Agentforce, Zendesk's AI agents, or specialists like Sierra and Decagon. They combine three things:

- **A knowledge source**: the help center and internal policies, which the agent searches (*retrieval*) so it quotes the real rules.
- **Connected tools**: order, shipping and billing systems, each an action with clear inputs. Companies decide which actions the agent may take alone.
- **Guardrails and handoff**: limits like the $100 refund cap in the simulation, identity checks, and a smooth handover (with notes) to a human.

Companies are responsible for what their agents say. In a well-known 2024 case, a Canadian tribunal ruled that Air Canada had to honor refund information its website chatbot had given incorrectly. That's why serious setups ground answers in official policy and keep humans in charge of costly exceptions.

</div>

## Why this works

- **Instant help**, at any hour, for the most common problems.
- **Humans focus on judgment.** The team lead just approved a clear summary.
- **A full trail.** Tool calls, claim number and "approved by" are all recorded.
- **Consistent rules.** It looked up the policy instead of improvising.

> [!WARNING] What can go wrong
> - **Made-up promises.** Answering from memory, not policy, can promise refunds that don't exist.
> - **Social engineering.** Scammers pose as customers; identity checks must come before any change or refund.
> - **Too much autonomy.** Unlimited refunds invite abuse; set caps, approvals and an easy path to a human.

## Try it yourself

Use an AI assistant to prepare for your own customer-service moments:

```prompt
I need to contact [company] about: [what happened, with dates and order number].
1. Ask me any questions you need.
2. Tell me what their policy likely says and what I can reasonably ask for. Flag anything you're unsure about.
3. Draft a short, polite, firm message with the key facts first.
```

If you handle support at work, write your agent's rules first:

```prompt
Help me write rules for an AI support assistant at my [type of business]: what it must check before sharing account details, what it may do alone (e.g. refunds up to [amount]), what always goes to a human, and how it hands over so customers never repeat themselves. Format: a one-page checklist.
```

```quiz
Q: Why did the agent ask for Jordan's email and postcode before looking up the order?
- [ ] To sign Jordan up for the shop's email newsletter
- [x] To check it was really Jordan before sharing details
- [ ] Because the order number Jordan gave had a typo in it
- [ ] Because the order tool only searches by postcode
E: Identity checks protect customers from scammers pretending to be them. They must come before any account details are shared or any refund is made.

Q: Tracking said "delivered" but Jordan said the package was missing. What did the agent do?
- [ ] Told Jordan the records proved it was delivered
- [ ] Refunded straight away without checking anything
- [x] Checked the detailed scan: it was 0.6 miles away
- [ ] Asked Jordan to contact the carrier personally
E: When two sources disagree, a good agent looks for more evidence. The detailed scan supported Jordan's story, without accusing anyone or giving money away blindly.

Q: Why did a human approve the refund instead of the agent doing it alone?
- [ ] The agent didn't know how to issue a refund
- [ ] Customers prefer a person to handle refunds
- [ ] The policy said lost parcels are never refunded
- [x] $164 was over the agent's $100 refund limit
E: The policy offered a refund or a reship, and the agent could refund small amounts itself, but the company drew the line at $100. Caps plus approvals keep costly decisions with people.
```
