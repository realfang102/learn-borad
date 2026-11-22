---
title: "Getting more done at work"
emoji: "💼"
subtitle: "Which work tasks to hand to an agent, how to brief it, and how to check its work quickly — without breaking your company's rules."
minutes: 12
---

Picture your Monday to-do list. Answer 30 emails. Turn last week's meeting into notes. Pull numbers into the monthly report. Find out what three competitors charge. Draft a proposal. Somewhere in there is the work you were actually hired to do — the thinking, deciding and talking to people.

An agent can't do your job for you. But it can take a surprising amount of the **legwork** off your plate, so you spend more of your day on the parts that need *you*. This chapter shows you which tasks to hand off, how to hand them off well, and how to stay in charge of the result.

> [!KEY] The golden rule of delegation
> Hand an agent work that is **repetitive** (or full of legwork) and **easy to check**. Keep work that is **high-stakes, personal, or needs someone to be accountable**.

## Which tasks should you hand off?

> [!ANALOGY] Think of a brilliant new colleague
> Imagine a new teammate who is fast, tireless and has read almost everything — but it's their first day. They don't know your clients, your boss's preferences, or which numbers are sensitive. You wouldn't let them sign a contract. You *would* happily ask them to sort a spreadsheet, research a question or draft a first version for you to check.

That's exactly the right attitude toward an agent. Before delegating, ask yourself three quick questions:

1. **Is it repetitive or legwork-heavy?** Reading 40 documents, reformatting 300 rows, checking 12 calendars. Agents shine here.
2. **Can I check the result quickly?** If you can review it in five minutes, delegating saves time. If checking takes as long as doing it, it doesn't.
3. **What happens if it's a bit wrong?** A slightly clumsy summary is fine. A wrong number in a contract is not.

Those questions sort almost every task into one of three buckets. Try it yourself — for each of these eight work tasks, choose what you'd do:

<div data-widget="delegation-matrix"></div>

Did you notice that the middle bucket — **"agent drafts, I review"** — was the most common? That's normal. For most office work the sweet spot isn't "do it all" or "do nothing", it's *let the agent do the first 80%, then you add the judgment*.

## Six everyday ways agents help at work

Here are the jobs where people get the most value from agents as of 2026. Each one follows the same pattern: the agent does the heavy lifting, and you keep the final say.

| Task | What the agent does | What you keep |
|---|---|---|
| 📧 **Email & scheduling** | Sorts your inbox, drafts replies, finds meeting times | Sending anything important |
| 📝 **Meeting notes** | Turns a transcript into decisions and action items | Checking who promised what |
| 🔎 **Research briefs** | Searches many sources, writes a summary with links | Opening the key sources |
| 📊 **Reports & spreadsheets** | Cleans data, calculates, makes charts | Sanity-checking the numbers |
| ✍️ **Document drafting** | Writes first drafts of proposals, policies, posts | Your voice and the final decisions |
| 💬 **Customer replies** | Drafts answers from your help articles | Tone, promises and exceptions |

You can watch several of these happen step by step in the examples: the [inbox assistant](example-inbox-assistant.html), the [meeting assistant](example-meeting-assistant.html), the [research agent](example-research-agent.html), the [data analyst](example-data-analyst.html), the [writing team](example-writing-team.html) and the [support agent](example-support-agent.html).

A good starting point is meeting notes, because it's low-risk and saves real time:

```prompt
Here is the transcript of our [team / project] meeting: [paste transcript].
Please write meeting notes with:
1. A 3-sentence summary of what was discussed.
2. Decisions made (one line each).
3. Action items as a table: who, what, by when. If a deadline or owner wasn't said out loud, write "not stated" — don't guess.
4. Open questions nobody answered.
Keep it under one page.
```

Notice the line *"don't guess"*. Agents try hard to be helpful, and sometimes that means filling gaps with plausible inventions. Telling it what to do when information is missing is one of the most useful habits you can build.

Customer replies follow the same idea: the agent drafts from facts you trust, and you send.

```prompt
Draft a reply to this customer message: [paste message].
Use only the information in our help articles / policy: [paste or attach them].
Tone: warm, clear, no jargon, under 150 words.
If the policy doesn't cover their situation, don't promise anything — write "[NEEDS HUMAN DECISION]" and explain why in one line.
Don't send anything; I'll review and send it myself.
```

## A simple workflow for delegating

Good delegation to an agent looks a lot like good delegation to a person. It has four steps:

<div class="steps-strip">
<div><strong>Brief</strong>Explain the goal, the context, what "done" looks like, and any limits.</div>
<div><strong>Let it work</strong>Give it the files or access it needs, then step back.</div>
<div><strong>Review</strong>Check the parts that matter most, not every comma.</div>
<div><strong>Feedback</strong>Tell it what to fix — and save what worked for next time.</div>
</div>

**1. Brief.** Most disappointing results come from thin briefs. "Write a report on our sales" leaves the agent guessing about audience, length, period and focus. A good brief answers: *What's the goal? Who is it for? What should I use? What does a great result look like? What should you avoid?* You'll find much more on this in [Giving great instructions](great-instructions.html).

```prompt
Goal: [what you want, in one sentence].
Audience: [who will read or use it, and what they care about].
Use: [the files, links or data to work from]. Don't use outside sources unless I say so.
Done looks like: [format, length, sections — or paste an example you liked].
Avoid: [things to leave out, words not to use, people not to contact].
Before you start, ask me up to 3 questions if anything important is unclear.
```

**2. Let it work.** Resist the urge to micromanage. Give the agent what it needs — the spreadsheet, the folder, the notes — and let it do its loop of planning, acting and checking. (You saw how that loop works in [The agent loop](the-agent-loop.html).)

**3. Review.** More on this in the next section — it's where your expertise matters most.

**4. Feedback.** Be specific: "the second paragraph is too formal for this client" beats "make it better". And when you find instructions that work well, **save them**. A brief you reuse every week is worth far more than one you write from scratch every time.

<div class="detail">

**Reusable instructions:** most agent tools in 2026 let you store standing instructions so you don't repeat yourself — for example "projects" or "custom instructions" in chat apps, instruction files in coding agents, or packaged "skills" that bundle instructions with example files. A simple version works anywhere: keep a document of your best briefs and paste the right one at the start. Over a few weeks, this personal "prompt library" becomes one of your most valuable work tools. This guide has a [prompt library](prompts.html) to get you started.

</div>

## How to review agent work efficiently

The point of delegating is to save time, so you can't re-do everything the agent did. The trick is to make the work **easy to review** and then check the **risky parts first**.

**Ask for reviewable output.** Before the agent starts, ask it to put a short summary at the top, link every source, list any assumptions it made, and flag anything it wasn't sure about. Now you know exactly where to look.

**Check the "dangerous details".** Mistakes that cause real trouble tend to hide in a few places:

- 🔢 **Numbers** — totals, percentages, dates, prices
- 👤 **Names** — people, companies, products, job titles
- 💬 **Quotes and sources** — did that person really say that? Does the link say what the agent claims?
- 🤝 **Promises** — anything that commits you or your company to something

**Spot-check, don't proofread.** Pick two or three claims at random and trace them back to the original. If those hold up, your confidence in the rest goes up. If one is wrong, look harder.

> [!TIP] Let the agent review itself first
> Asking an agent to check its own work before handing it over catches a surprising number of mistakes. It's not a replacement for your review — but it makes your review faster.

```prompt
Before you give me the final version, review your own work:
- Re-check every number against the source data and show the calculation for any totals.
- Confirm each quote and fact against the source it came from. Remove anything you can't find.
- List any assumptions you made and anything you're unsure about.
Then give me the corrected version with a short "what I checked" note at the top.
```

You'll learn more verification habits in [Making agents reliable](reliable-agents.html).

## Team norms: privacy, disclosure and company policies

Using agents at work isn't only about you. Your colleagues, customers and company are affected too. A few norms keep everyone safe and comfortable:

**Use approved tools.** Many companies have a list of AI tools they've vetted and set up properly. Stick to those for work data. A personal account on a random app may store or use your data in ways your company never agreed to.

**Protect sensitive information.** Don't paste customer records, health or salary details, passwords, unreleased financial results or confidential contracts into a tool unless your company has explicitly approved that use. When in doubt, remove names and identifying details first.

**Be open about AI help.** If a document, analysis or message was largely written by an agent, say so when it matters — especially for customer-facing content, anything presented as your personal opinion, or work where your team has agreed to disclose it. Trust breaks quickly when people feel misled.

**You own what you send.** "The AI wrote it" is never an excuse. If your name is on it, you're responsible for it being accurate, fair and appropriate.

> [!WARNING] Check before you connect
> Connecting an agent to your work email, files or calendar is powerful — and it means the agent (and anything that tricks it) can see a lot. Read your company's policy first, and give the agent only the access it needs. [Staying safe](staying-safe.html) covers exactly how.

<div class="detail">

**Why company policies differ so much:** business and enterprise plans of the major AI providers typically come with contractual promises — for example, not training models on your data, controls over how long data is kept, and admin settings for what can connect to what. Consumer plans may have different defaults. Regulated industries (healthcare, finance, law, government) often have extra rules about where data can go. That's why "which tool, which account, which data" is a real question, not red tape. If your company has no policy yet, it's worth asking — you probably won't be the only one wondering.

</div>

> [!TRY] Your first delegation this week
> Pick one recurring task you'll do this week that is repetitive and easy to check — a status update, a meeting summary, a data cleanup. Write a proper brief using the template above, review the result with the "dangerous details" checklist, and note how long it took compared to doing it yourself.

## Quick check

```quiz
Q: Which task is the best fit to hand to an agent completely on its own?
- [ ] Deciding which team member should be promoted this year
- [x] Reformatting a contact spreadsheet — working on a copy of the file
- [ ] Writing a personal apology to a client you let down
- [ ] Approving a large purchase that needs a manager's sign-off
E: Reformatting data is repetitive, easy to check and low-risk (especially on a copy). Promotions, personal apologies and large approvals need human judgment and accountability — an agent might help prepare, but shouldn't decide.

Q: You have little time to review a 5-page research brief from an agent. What's the smartest approach?
- [ ] Read every sentence carefully from start to finish
- [ ] Trust it, since agents rarely make mistakes in research
- [x] Check numbers, names and sources first, and spot-check a few claims
- [ ] Ask a second AI whether the brief sounds right
E: Mistakes cluster in "dangerous details" — numbers, names, quotes and sources. Spot-checking those is far faster than proofreading everything, and much safer than blind trust. Another AI's opinion helps, but doesn't replace looking at the sources.

Q: A colleague pastes a customer list with phone numbers into a free AI app they found online. What's the main problem?
- [ ] Free apps always give lower-quality answers
- [ ] The customer list will be too long for the AI to read
- [ ] There's no problem if the app gives a good result
- [x] Personal data went into a tool the company hasn't approved
E: Quality isn't the issue — privacy is. Sensitive data should only go into tools your company has approved for that use, and identifying details are best removed whenever possible.
```

## What's next

Delegating more work to agents means trusting them with more access — your email, your files, maybe your accounts. Next, let's learn how to do that **safely**: spotting tricks, protecting your data and choosing how much freedom to give.
