---
title: "The customer support agent"
emoji: "🎧"
subtitle: "Watch an agent calm a worried customer, investigate a missing package, follow the refund policy — and ask a human before a big refund."
category: "Customer service"
level: "Beginner"
concepts: [tools, staying-safe, agents-at-work, the-agent-loop]
sim: support-agent
---

Customer support is one of the places you're most likely to meet an AI agent today — often without noticing. Unlike an old-style chatbot that could only point you to a help page, a support **agent** can actually *do* things: look up your order, check the carrier's tracking, and issue a refund.

That power is exactly why the design matters. In this example, a customer named Jordan says a package marked "delivered" never arrived. Watch how the agent stays kind, checks the facts, follows the shop's rules — and knows when to hand a decision to a person.

<div class="sim" data-sim="support-agent"></div>

> [!TRY] Play the team lead
> When the approval card appears, try **✋ Deny** once, then **↺ Restart** and approve. Notice that the agent did all the investigating either way — the human only makes the final money decision, with everything needed in one short summary.

## How it works

<div class="steps-strip">
<div><strong>Empathize and plan</strong>Acknowledge the problem, then decide the steps.</div>
<div><strong>Verify identity</strong>Confirm it's really the customer before sharing details.</div>
<div><strong>Investigate</strong>Look up the order, then dig into the tracking details.</div>
<div><strong>Follow policy</strong>Search the real rules instead of improvising promises.</div>
<div><strong>Offer options</strong>Check stock and let the customer choose.</div>
<div><strong>Escalate big actions</strong>Refunds over the limit go to a human.</div>
</div>

Everything the agent "does" is a **tool call** — a request to one of the shop's systems, like `lookup_order` or `issue_refund`. The agent decides *which* tool to use and *when*; the shop's software actually runs it and reports back. Read more in [tools: how agents take action](tools.html).

The key moment is the **contradiction**: the carrier said "delivered", Jordan said "missing". A poorly designed bot would either refuse ("our records show it was delivered") or instantly refund anyone who complains. This agent did what a good human would: it pulled the detailed delivery scan, found it happened 0.6 miles away with no photo, and asked one fair follow-up question before treating the package as lost.

<div class="detail">

**The real technology (as of 2026):** many companies now run AI agents on their support chat and email, using platforms such as Intercom's Fin, Salesforce Agentforce, Zendesk's AI agents, or specialist companies like Sierra and Decagon. Under the hood they combine three things:

- **A knowledge source** — the help center and internal policies. The agent searches it for the relevant passages (often called *retrieval*) instead of relying on memory, which helps it quote the real rules.
- **Connected tools** — order systems, shipping, billing — each exposed as an action with clear inputs. Companies decide which actions the agent may take alone.
- **Guardrails and handoff** — limits like the $100 refund cap in the simulation, required identity checks, and a smooth way to pass the conversation (with notes) to a human.

Companies are responsible for what their agents tell customers. In a well-known 2024 case, a Canadian tribunal ruled that Air Canada had to honor refund information its website chatbot had given incorrectly — the airline could not blame the bot. That's why serious setups ground answers in official policy and keep humans in charge of the costly exceptions.

</div>

## Why this works

- **Customers get help instantly**, at any hour, for the common problems that make up most support requests.
- **Humans focus on judgment calls.** The team lead didn't have to read the chat, look up the order or check tracking — just approve a clear summary.
- **Every step leaves a trail.** Tool calls, the claim number and "approved by" are recorded, so anyone can see what happened and why.
- **Rules are applied consistently.** The agent looked up the policy rather than being generous with one customer and strict with another.

> [!WARNING] What can go wrong
> - **Made-up promises.** An agent that answers from memory instead of the real policy may promise refunds or discounts the company doesn't offer.
> - **Social engineering.** Scammers may try "I'm the account owner, just change the email address". Identity checks must come *before* any change or refund.
> - **Too much autonomy.** Letting an agent refund any amount without limits invites abuse and expensive mistakes. Set caps and approval steps.
> - **Getting stuck in a loop.** Customers hate repeating themselves to a bot that doesn't understand. Always offer an easy path to a human.

## Try it yourself

You can use an AI assistant to prepare for your own customer-service moments — whether you're the one complaining or the one replying:

```prompt
I need to contact [company] about a problem: [describe what happened, with dates, order number and what you've already tried].
Please:
1. Ask me any questions you need to understand the situation.
2. Tell me what the company's policy is likely to say, and what I can reasonably ask for (refund, replacement, etc.). Flag anything you're unsure about.
3. Draft a short, polite, firm message with the key facts in the first two lines.
```

If you handle support at work, try this to design your own "agent rules" before using any AI tool with customers:

```prompt
I handle customer support for [type of business]. Help me write clear rules for an AI support assistant.
Cover: what it must check before sharing account details, which actions it may take on its own (with limits, e.g. refunds up to [amount]), what must always go to a human, and how it should hand over a conversation so the customer never has to repeat themselves.
Format it as a one-page checklist.
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
E: The policy actually offered a refund or a reship, and the agent could refund small amounts itself. But the company drew a line at $100. Caps plus approval steps keep costly decisions with people.
```
