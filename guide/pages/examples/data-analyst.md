---
title: "The data analyst agent"
emoji: "📊"
subtitle: "Watch an agent clean up a messy sales spreadsheet, calculate with code, build a chart — and catch a number that's too good to be true."
category: "Data"
level: "Beginner"
concepts: [tools, reliable-agents, agents-at-work, the-agent-loop]
sim: data-analyst
---

Almost every job involves a spreadsheet someone doesn't have time to dig into. Sales exports, survey results, budgets, sign-up lists — the answers are in there, but so are duplicates, typos and half-empty columns. A **data analyst agent** takes the file, tidies it up, does the maths and tells you what matters, in plain words.

In this example, Amara, who manages four cafés, uploads three months of sales and asks which café and product did best. The interesting part isn't the chart — it's everything the agent checks *before* it draws one.

<div class="sim" data-sim="data-analyst"></div>

> [!TRY] Spot the problems first
> When the spreadsheet first appears, pause and look at the nine rows yourself. How many problems can you find? (There are at least five.) Then step on and compare your list with the agent's.

## How it works

<div class="steps-strip">
<div><strong>Look first</strong>Peek at the rows to understand what the data is.</div>
<div><strong>Check quality</strong>Count duplicates, formats, blanks — across every row.</div>
<div><strong>Clean carefully</strong>Fix what's certain; flag what isn't. Keep the original.</div>
<div><strong>Calculate with code</strong>Add columns and totals with a program, not mental maths.</div>
<div><strong>Question outliers</strong>Check surprising numbers against other evidence.</div>
<div><strong>Show and tell</strong>A simple chart plus a few plain-language insights.</div>
</div>

The most important habit is that the agent **doesn't do arithmetic in its head**. Language models are good with words but can slip on long calculations, so the agent writes small programs and runs them — the same way a person would use spreadsheet formulas instead of a calculator. The program counts all 1,248 rows exactly; the agent's job is deciding *what* to count and *what it means*.

The second habit is **suspicion of surprises**. An **outlier** is a value far away from all the others, and it deserves a second look. One entry claimed 940 cold brews sold in a single day — about twenty times a normal day. Taken at face value, it made Riverside the clear winner. The agent checked it against the till's records (only 212 transactions that day, across all products), concluded it was almost certainly a typo, and — crucially — didn't invent a "corrected" number. It left the row flagged and asked Amara.

<div class="detail">

**The real technology (as of 2026):** most major AI assistants can analyze uploaded files by writing and running code in a safe, isolated environment (a *sandbox*). ChatGPT's data analysis feature (first launched as "Code Interpreter"), Claude's ability to run code on files you upload, and Google's Gemini all work this way, usually with the Python programming language and its data libraries. Spreadsheet apps have also added assistants: Microsoft Copilot in Excel (which can also use Python in Excel) and Gemini in Google Sheets.

Because the calculations happen in real code, you can ask to see it — a big advantage for checking. The weak points are elsewhere: misunderstanding what a column means, picking the wrong way to read ambiguous dates, or quietly dropping rows. That's why a good agent reports *what it changed* during cleaning, not just the final answer.

</div>

## Why this works

- **Cleaning first prevents wrong answers.** The six duplicates would have inflated totals, and the seven different spellings of four café names would have split real cafés into several fake ones.
- **Code makes the numbers trustworthy.** Every total can be re-run and checked, like a formula.
- **Reasoning handles the ambiguity.** Whether 03/07 means 3 July or 7 March is a judgment call; the agent used the file's own date range to decide, then verified.
- **Honest insights beat impressive ones.** "Neck and neck, and here's a number to double-check" is more useful to a team than a confident but wrong winner.

This pattern fits many everyday tasks: survey results for a class project, a team's expenses, website sign-ups, or exam scores. See [agents at work](agents-at-work.html) for which tasks to hand over and which to keep, and [making agents reliable](reliable-agents.html) for more checking habits.

> [!WARNING] What can go wrong
> - **Silent "fixes".** An agent might delete outliers, fill blanks with guesses or merge things that shouldn't be merged. Ask it to list every change it made.
> - **Misread columns.** "Units" could mean items, boxes or kilograms. Tell the agent what columns mean when it isn't obvious.
> - **Ambiguous dates and currencies.** Day/month order and decimal commas differ between countries. Check a few converted rows yourself.
> - **Private data.** Sales, salaries and customer lists may be confidential. Only upload files to tools your school or employer has approved.

## Try it yourself

Attach a spreadsheet (CSV or Excel) to an AI assistant that can run code, and paste:

```prompt
I've attached [describe the file, e.g. "our team's expenses for this year"]. Please:
1. Describe what's in it and list any data problems (duplicates, inconsistent formats, blanks, odd values) before analysing anything.
2. Clean it in a copy, and tell me every change you made. Don't guess missing values — flag them.
3. Answer: [your question, e.g. "which category grew the most, month by month?"]. Use code for all calculations.
4. Make one simple chart, and write 3 short insights in plain language.
5. Point out any number that looks suspicious and how you checked it.
```

Then make it double-check its own work:

```prompt
Re-check your analysis: re-run the key totals a different way, confirm the numbers in your chart match the cleaned data, and tell me which of your 3 insights is least certain and why.
```

```quiz
Q: Why did the agent check the data for problems before calculating anything?
- [ ] Checking first makes the final chart look more professional
- [x] Duplicates and name variants would quietly skew the totals
- [ ] Charts can't be drawn at all until a file has zero problems
- [ ] It needed to fix Amara's original file before anyone saw it
E: Messy data gives confident-looking but wrong answers. Cleaning first, in a copy with every change reported, is what makes the results trustworthy. The agent deliberately left Amara's original file untouched.

Q: Why did the agent run small programs instead of adding up the numbers itself?
- [ ] Programs produce nicer-looking charts than a language model
- [ ] The spreadsheet was locked, so only code could open it
- [x] Code calculates exactly, and the totals can be re-run
- [ ] Language models can't read numbers in a spreadsheet at all
E: Language models can read numbers fine, but long arithmetic done "in their head" is error-prone. Code gives exact, repeatable results, like using spreadsheet formulas instead of mental maths.

Q: What did the agent do with the entry showing 940 cold brews in one day?
- [ ] Replaced it with 94, the most likely correct value
- [ ] Kept it in, since data from the till is always right
- [ ] Deleted the row permanently so it couldn't cause trouble
- [x] Flagged it, left it out of the chart and asked Amara
E: The evidence pointed to a typo, but the agent couldn't know the real number (94? 40?), so "correcting" it would have meant inventing data. It kept the row, flagged it, and let Amara decide.
```
