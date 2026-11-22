---
title: "Getting more done at work"
emoji: "💼"
subtitle: "What to hand an agent, how to brief it, and how to check its work."
minutes: 10
---

Picture your Monday list. Thirty emails. Meeting notes. The monthly report. Competitor prices. Somewhere in there is the work you were hired for — thinking, deciding, talking to people.

An agent can't do your job. It can take the **legwork**, so more of your day goes to what needs *you*.

> [!KEY]
> Delegate what's repetitive and easy to check; keep what's high-stakes or personal.

## What to hand off

> [!ANALOGY] A brilliant new colleague
> Fast, tireless, well-read — but it's their first day. They don't know your clients or which numbers are sensitive. You wouldn't let them sign a contract. You *would* ask them to sort a spreadsheet or draft a first version.

Before delegating, ask three questions:

1. **Is it repetitive or legwork-heavy?** Reading 40 documents, reformatting 300 rows, checking 12 calendars. Agents shine here.
2. **Can I check it quickly?** If review takes five minutes, delegating pays. If checking takes as long as doing, it doesn't.
3. **What if it's a bit wrong?** A clumsy summary is fine. A wrong number in a contract is not.

Sort these eight tasks into the three buckets.

<div data-widget="delegation-matrix"></div>

The middle bucket — **"agent drafts, I review"** — wins most often. For most office work, the agent does the first 80%; you add the judgment.

## Six everyday uses

Where people get the most value as of 2026. The agent does the heavy lifting; you keep the final say.

| Task | What the agent does | What you keep |
|---|---|---|
| **Email & scheduling** | Sorts the inbox, drafts replies, finds times | Sending anything important |
| **Meeting notes** | Turns a transcript into decisions and actions | Checking who promised what |
| **Research briefs** | Searches sources, summarizes with links | Opening the key sources |
| **Reports & spreadsheets** | Cleans data, calculates, makes charts | Sanity-checking the numbers |
| **Document drafting** | First drafts of proposals, policies, posts | Your voice and final decisions |
| **Customer replies** | Drafts answers from your help articles | Tone, promises and exceptions |

Watch them step by step: the [inbox assistant](example-inbox-assistant.html), [meeting assistant](example-meeting-assistant.html), [research agent](example-research-agent.html), [data analyst](example-data-analyst.html), [writing team](example-writing-team.html) and [support agent](example-support-agent.html).

Meeting notes are a good first try — low-risk, real time saved:

```prompt
Here is the transcript of our [team / project] meeting: [paste transcript].
Write notes with:
1. A 3-sentence summary.
2. Decisions made, one line each.
3. Action items as a table: who, what, by when. If an owner or deadline wasn't said, write "not stated" — don't guess.
4. Open questions.
Under one page.
```

Note the *"don't guess"*. Eager agents fill gaps with plausible inventions; saying what to do when information is missing is a habit worth building.

Customer replies work the same way: the agent drafts from trusted facts; you send.

```prompt
Draft a reply to this customer message: [paste message].
Use only our help articles / policy: [paste or attach them].
Warm, clear, no jargon, under 150 words.
If the policy doesn't cover it, promise nothing — write "[NEEDS HUMAN DECISION]" and say why in one line.
Don't send; I'll review and send it.
```

## A simple delegation workflow

Delegating to an agent looks a lot like delegating to a person.

<div class="steps-strip">
<div><strong>Brief</strong>Goal, context, limits, and what "done" looks like.</div>
<div><strong>Let it work</strong>Give it the files or access, then step back.</div>
<div><strong>Review</strong>Check what matters most, not every comma.</div>
<div><strong>Feedback</strong>Say what to fix — and save what worked.</div>
</div>

**1. Brief.** Most disappointing results come from thin briefs. "Write a report on our sales" leaves audience, length, period and focus to guesswork. More in [Giving great instructions](great-instructions.html).

```prompt
Goal: [what you want, in one sentence].
Audience: [who will use it, and what they care about].
Use: [files, links or data]. No outside sources unless I say so.
Done looks like: [format, length, sections — or an example you liked].
Avoid: [things to leave out, people not to contact].
Ask me up to 3 questions first if anything important is unclear.
```

**2. Let it work.** Don't micromanage — let it plan, act and check: the [agent loop](the-agent-loop.html) in action.

**3. Review.** Where your expertise matters most — see below.

**4. Feedback.** "The second paragraph is too formal for this client" beats "make it better". When a brief works, **save it** and reuse it.

<div class="detail">

**Reusable instructions:** most agent tools in 2026 let you store standing instructions — "projects" or "custom instructions" in chat apps, instruction files in coding agents, or packaged "skills" that bundle instructions with example files. A simple version works anywhere: keep a document of your best briefs and paste the right one at the start. Over a few weeks, this personal "prompt library" becomes one of your most valuable work tools. This guide has a [prompt library](prompts.html) to get you started.

</div>

## Reviewing efficiently

You can't redo everything — that defeats the point. Make the work **easy to review**, then check the **risky parts first**.

**Ask for reviewable output:** a summary at the top, every source linked, assumptions listed, doubts flagged. Now you know where to look.

**Check the dangerous details.** Real trouble hides in a few places:

- **Numbers** — totals, percentages, dates, prices
- **Names** — people, companies, products, job titles
- **Quotes and sources** — did they really say it? Does the link say what's claimed?
- **Promises** — anything that commits you or your company

**Spot-check, don't proofread.** Trace two or three random claims to the original. If they hold, trust rises. If one fails, look harder.

Asking the agent to check itself first catches a surprising number of mistakes. It won't replace your review, but it speeds it up.

```prompt
Before the final version, review your own work:
- Re-check every number against the source; show the calculation for totals.
- Confirm each quote and fact against its source. Remove anything you can't find.
- List your assumptions and anything you're unsure about.
Then give the corrected version with a short "what I checked" note on top.
```

More verification habits in [Making agents reliable](reliable-agents.html).

## Team norms

Your colleagues, customers and company are affected too.

**Use approved tools.** Many companies vet AI tools and set them up properly. Stick to those for work data — a personal account on a random app may store or use it in ways your company never agreed to.

**Protect sensitive information.** No customer records, health or salary details, passwords, unreleased financials or confidential contracts unless your company explicitly approves. When in doubt, strip names and identifying details.

**Be open about AI help.** If an agent largely wrote it, say so when it matters — customer-facing content, anything presented as your opinion, or where your team agreed to disclose. Trust breaks fast.

**You own what you send.** "The AI wrote it" is never an excuse. Your name, your responsibility.

> [!WARNING] Check before you connect
> Connecting an agent to your email, files or calendar means it — and anything that tricks it — can see a lot. Read your company's policy and grant only the access needed. [Staying safe](staying-safe.html) shows how.

<div class="detail">

**Why company policies differ so much:** business and enterprise plans of the major AI providers typically come with contractual promises — for example, not training models on your data, controls over how long data is kept, and admin settings for what can connect to what. Consumer plans may have different defaults. Regulated industries (healthcare, finance, law, government) often have extra rules about where data can go. That's why "which tool, which account, which data" is a real question, not red tape. If your company has no policy yet, ask — you probably won't be the only one wondering.

</div>

> [!TRY] Your first delegation
> Pick one repetitive, easy-to-check task this week — a status update, meeting summary or data cleanup. Brief it with the template, review with the dangerous-details list, and compare the time to doing it yourself.

## Quick check

```quiz
Q: Which task is the best fit to hand to an agent completely on its own?
- [x] Reformatting a contact spreadsheet, working on a copy
- [ ] Choosing which team member should be promoted this year
- [ ] Writing a heartfelt apology to a client you let down
- [ ] Approving a large purchase that needs a manager's sign-off
E: Reformatting data is repetitive, easy to check and low-risk, especially on a copy. The apology is tempting because agents write well, but it's personal: your own words matter. Promotions and big approvals need a person who is accountable; an agent can help prepare, not decide.

Q: You have little time to review a 5-page research brief from an agent. What's the smartest approach?
- [ ] Read every sentence carefully, from the first to the last
- [ ] Trust it, since agents rarely make mistakes in research
- [x] Check numbers, names and sources, then spot-check claims
- [ ] Ask a second AI app whether the whole brief sounds right
E: Mistakes cluster in "dangerous details": numbers, names, quotes and sources. Checking those is far faster than proofreading every sentence, and much safer than blind trust. A second AI can help, but it can be fooled in the same ways, so it doesn't replace opening the sources yourself.

Q: A colleague pastes a customer list with phone numbers into a free AI app they found online. What's the main problem?
- [ ] Free apps always give lower-quality answers than paid ones
- [ ] The list is probably too long for the AI to read in one go
- [ ] Nothing, as long as the app gives back a useful result
- [x] Customers' data went into a tool the company hasn't approved
E: Quality isn't the issue; privacy is. Even a perfect result doesn't undo sharing customers' personal details with an app that may store them or use them for training. Sensitive data should only go into tools your company has approved, with identifying details removed where possible.
```

## What's next

More delegation means more access — your email, files, maybe accounts. Next, [Staying safe with agents](staying-safe.html): spotting tricks, protecting data and choosing how much freedom to give.
