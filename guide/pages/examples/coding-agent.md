---
title: "The coding agent"
emoji: "👩‍💻"
subtitle: "Watch an agent find and fix a real bug in an online shop — reading code, running tests, and asking before it goes live."
category: "Software"
level: "Intermediate"
concepts: [the-agent-loop, tools, staying-safe, reliable-agents]
sim: coding-agent
---

Coding is where agents first became truly useful — and it's a perfect window into how *all* agents work. Code gives an agent something precious: **a way to check its own work**. Most software projects come with **tests**: small programs that check the code does what it should. Tests either pass or fail, so the agent knows whether it's done.

In this example, a shop owner named Maya asks her coding agent to fix a broken discount code. She doesn't explain *how* — just *what's wrong*.

<div class="sim" data-sim="coding-agent"></div>

> [!TRY] Be the human in the loop
> When the agent asks to publish the fix, try clicking **✋ Not yet**. A well-designed agent respects your decision and stops — that's exactly what approval steps are for.

## How it works

<div class="steps-strip">
<div><strong>Reproduce</strong>Run the tests to see the failure with its own eyes.</div>
<div><strong>Investigate</strong>Search the code and read only the relevant file.</div>
<div><strong>Check the rules</strong>Look up how discounts <em>should</em> work instead of guessing.</div>
<div><strong>Small fix</strong>Change as little as possible.</div>
<div><strong>Prove it</strong>Re-run every test — not just the broken one.</div>
<div><strong>Ask, then ship</strong>Get approval before changing the live shop.</div>
</div>

The agent used only a handful of simple tools — **run a command**, **search files**, **read a file**, **edit a file** — but combined them with judgment, in a loop, until the job was done. That's the whole trick.

<div class="detail">

**What's really happening under the hood:** each "Act" step is the language model asking its **harness** (the program wrapped around the model that actually runs tools) to run a tool (for example, a `bash` tool for terminal commands and an `edit` tool that replaces exact lines of text). The harness runs the command in a safe sandbox, sends the output back, and the model decides what to do next. Popular coding agents as of 2026, such as Claude Code, OpenAI's Codex, GitHub Copilot's agent features and Cursor, all follow this same pattern, with permission settings that control which commands can run without asking.

</div>

## Why coding agents work so well

- **Instant feedback.** Tests and error messages tell the agent exactly what's wrong.
- **Everything is text.** Code, errors and docs are all things language models read well.
- **Mistakes are reversible.** Programmers use **version control** (most often a tool called git), which saves every version of the code, so any change can be undone.

> [!WARNING] What can go wrong
> - **"Fixing" the test instead of the bug.** An agent under pressure to make tests pass might edit the test itself. Good setups forbid changing tests without permission.
> - **Overconfident changes.** Large rewrites are harder to review. Ask for small, focused changes.
> - **Running risky commands.** Agents should work in a sandbox and ask before anything destructive.

## Try it yourself

You don't need to be a programmer to try this with a coding agent (such as Claude Code, Codex or Copilot) on a small project:

```prompt
There's a bug: [describe what's wrong in plain words, e.g. "the contact form doesn't send emails"].
Please:
1. Reproduce the problem first (run the app or tests) and show me the error.
2. Find the cause and explain it to me in simple terms before changing anything.
3. Make the smallest fix that solves it.
4. Run all the tests again to prove it works.
5. Don't change any tests, and ask me before deleting anything or publishing.
```

```quiz
Q: Why did the agent run the tests *before* changing any code?
- [ ] To warm up the shop's server so the fix would run faster later
- [x] To see the failure itself, so it can prove the fix later
- [ ] Because running the tests repairs simple bugs automatically
- [ ] To find out which failing tests it could safely delete first
E: Reproducing the problem gives the agent a clear "before" and a way to prove the "after". Tests only *report* problems; they never fix them. And deleting a failing test would hide the bug, not solve it.

Q: After its fix, why did the agent re-run *all* the tests, not just the failing one?
- [ ] Because the two failing tests had been deleted during the fix
- [ ] Because running more tests makes the shop's code run faster
- [x] To check the fix hadn't quietly broken something elsewhere
- [ ] Because the test tool can't run a single test on its own
E: A change in one place can break another, so running the full suite checks for side effects. The tool *can* run just a few tests: the agent did exactly that at the start with `npm test -- discounts`.

Q: What's the main reason the agent asked before publishing?
- [x] Publishing changes the live shop that real customers use
- [ ] It wasn't sure its fix was correct, despite the tests
- [ ] Coding agents aren't technically able to publish code
- [ ] Asking first is simply a polite way to end a conversation
E: Approval steps belong in front of actions with real-world impact. All 24 tests passed, so the agent wasn't unsure. The point is that the human stays in charge of changes that affect customers.
```
