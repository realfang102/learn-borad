---
title: "The data analyst agent"
emoji: "📊"
subtitle: "Watch an agent clean messy sales data, calculate with code and question a suspicious number."
category: "Data"
level: "Beginner"
concepts: [tools, reliable-agents, agents-at-work, the-agent-loop]
sim: data-analyst
---

Every spreadsheet hides duplicates, typos and blanks among its answers. Here, café manager Amara asks a **data analyst agent** which café and product did best, and the interesting part is everything it checks *before* drawing a chart.

<div class="sim" data-sim="data-analyst"></div>

> [!TRY] Spot the problems first
> When the spreadsheet appears, pause and find at least five problems in its nine rows, then compare with the agent.

## How it works

<div class="steps-strip">
<div><strong>Look first</strong>Peek at rows to understand the data.</div>
<div><strong>Check quality</strong>Count duplicates, formats and blanks everywhere.</div>
<div><strong>Clean carefully</strong>Fix what's certain; flag the rest. Keep the original.</div>
<div><strong>Calculate with code</strong>Use a program, not mental maths.</div>
<div><strong>Question outliers</strong>Check surprising numbers against other evidence.</div>
<div><strong>Show and tell</strong>One simple chart, a few plain insights.</div>
</div>

The agent **doesn't do arithmetic in its head**: it writes small programs (like using spreadsheet formulas) and decides *what* to count and *what it means*. It also distrusts surprises: an **outlier** (a value far from the rest) of 940 cold brews in one day didn't fit the till's 212 transactions, so it flagged the row and asked Amara instead of inventing a "corrected" number.

<div class="detail">

**The real technology (as of 2026):** most major AI assistants analyze uploaded files by writing and running code in an isolated *sandbox*: ChatGPT's data analysis feature (first launched as "Code Interpreter"), Claude's ability to run code on uploaded files, and Google's Gemini, usually in Python. Spreadsheet apps have assistants too: Microsoft Copilot in Excel (which can also use Python in Excel) and Gemini in Google Sheets.

Because the maths is real code, you can ask to see it. The weak points are elsewhere: misreading what a column means, misreading ambiguous dates, or quietly dropping rows. That's why a good agent reports *what it changed* while cleaning.

</div>

## Why this works

- **Cleaning first prevents wrong answers.** Six duplicates inflate totals; seven spellings split four cafés.
- **Code makes numbers trustworthy.** Every total can be re-run, like a formula.
- **Reasoning handles ambiguity.** The file's own date range settled what 03/07 meant.
- **Honest beats impressive.** "Neck and neck, check this number" beats a confident wrong winner.

The same pattern fits surveys, team expenses, sign-ups or exam scores. See [agents at work](agents-at-work.html) and [making agents reliable](reliable-agents.html).

> [!WARNING] What can go wrong
> - **Silent "fixes".** Deleted outliers or guessed blanks; ask it to list every change.
> - **Misread columns and dates.** "Units" or "03/07" can mean different things; check a few rows.
> - **Private data.** Only upload files to tools your school or employer has approved.

## Try it yourself

Attach a spreadsheet (CSV or Excel) to an AI assistant that can run code, and paste:

```prompt
I've attached [describe the file]. Please:
1. List any data problems (duplicates, formats, blanks, odd values) before analysing.
2. Clean a copy and tell me every change. Flag missing values; don't guess.
3. Answer: [your question], using code for all calculations.
4. Make one simple chart and 3 plain-language insights. Point out any suspicious number and how you checked it.
```

```quiz
Q: Why did the agent check the data for problems before calculating anything?
- [ ] Checking first makes the final chart look more professional
- [x] Duplicates and name variants would quietly skew the totals
- [ ] Charts can't be drawn at all until a file has zero problems
- [ ] It needed to fix Amara's original file before anyone saw it
E: Messy data gives confident-looking but wrong answers. Cleaning first, in a copy with every change reported, makes results trustworthy. The agent left Amara's original file untouched.

Q: Why did the agent run small programs instead of adding up the numbers itself?
- [ ] Programs produce nicer-looking charts than a language model
- [ ] The spreadsheet was locked, so only code could open it
- [x] Code calculates exactly, and the totals can be re-run
- [ ] Language models can't read numbers in a spreadsheet at all
E: Models read numbers fine, but long arithmetic "in their head" is error-prone. Code gives exact, repeatable results, like spreadsheet formulas instead of mental maths.

Q: What did the agent do with the entry showing 940 cold brews in one day?
- [ ] Replaced it with 94, the most likely correct value
- [ ] Kept it in, since data from the till is always right
- [ ] Deleted the row permanently so it couldn't cause trouble
- [x] Flagged it, left it out of the chart and asked Amara
E: The evidence pointed to a typo, but the real number (94? 40?) was unknown, so "correcting" it would have meant inventing data. It kept the row, flagged it, and let Amara decide.
```
