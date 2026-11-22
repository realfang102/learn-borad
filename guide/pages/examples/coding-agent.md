---
title: "The coding agent"
emoji: "👩‍💻"
subtitle: "Watch an agent find and fix a real bug, then ask before it goes live."
category: "Software"
level: "Intermediate"
concepts: [the-agent-loop, tools, staying-safe, reliable-agents]
sim: coding-agent
---

Code comes with **tests**, small programs that pass or fail, so an agent can check its own work. Here, shop owner Maya asks hers to fix a broken discount code: she says *what's* wrong, not *how*.

<div class="sim" data-sim="coding-agent"></div>

> [!TRY] Be the human in the loop
> When asked to publish, click **Not yet** and watch the agent respect it.

## How it works

<div class="steps-strip">
<div><strong>Reproduce</strong>Run the tests to see the failure.</div>
<div><strong>Investigate</strong>Search the code; read only the relevant file.</div>
<div><strong>Check the rules</strong>Look up how discounts <em>should</em> work.</div>
<div><strong>Small fix</strong>Change as little as possible.</div>
<div><strong>Prove it</strong>Re-run every test, not just the broken one.</div>
<div><strong>Ask, then ship</strong>Get approval before changing the live shop.</div>
</div>

Four simple tools (**run**, **search**, **read**, **edit**), used with judgment in a loop until the job is done. That's the whole trick.

<div class="detail">

**Under the hood:** each "Act" step is the model asking its **harness** (the program around the model that actually runs tools) to use a tool, such as `bash` for terminal commands or `edit` to replace exact lines. The harness runs it in a sandbox and returns the output; the model decides what's next. Popular coding agents as of 2026, such as Claude Code, OpenAI's Codex, GitHub Copilot's agent features and Cursor, all follow this pattern, with permission settings for which commands run without asking.

</div>

## Why coding agents work so well

- **Instant feedback.** Tests and errors say exactly what's wrong.
- **Everything is text.** Models read code and errors well.
- **Reversible.** **Version control** (usually git) saves every version, so any change can be undone.

> [!WARNING] What can go wrong
> - **"Fixing" the test instead of the bug.** Forbid changing tests without permission.
> - **Overconfident changes.** Big rewrites are hard to review; ask for small, focused ones.
> - **Risky commands.** Agents should work in a sandbox and ask before anything destructive.

## Try it yourself

No programming needed: try a coding agent (such as Claude Code, Codex or Copilot) on a small project.

```prompt
There's a bug: [what's wrong, e.g. "the contact form doesn't send emails"].
1. Reproduce it first and show me the error.
2. Explain the cause simply before changing anything.
3. Make the smallest fix, then run all the tests.
4. Don't change any tests, and ask me before deleting anything or publishing.
```

```quiz
Q: Why did the agent run the tests *before* changing any code?
- [ ] To warm up the shop's server so the fix would run faster
- [x] To see the failure itself, so it can prove the fix later
- [ ] Because running the tests repairs simple bugs automatically
- [ ] To find out which failing tests it could safely delete
E: Reproducing the problem gives a clear "before" and a way to prove the "after". Tests only *report* problems; they never fix them. Deleting a failing test would hide the bug, not solve it.

Q: After its fix, why did the agent re-run *all* the tests, not just the failing one?
- [ ] Because the two failing tests had been deleted during the fix
- [ ] Because running more tests makes the shop's code run faster
- [x] To check the fix hadn't quietly broken something elsewhere
- [ ] Because the test tool can't run a single test on its own
E: A change in one place can break another, so the full suite checks for side effects. The tool *can* run a few tests: the agent did exactly that at the start with `npm test -- discounts`.

Q: What's the main reason the agent asked before publishing?
- [x] Publishing changes the live shop that real customers use
- [ ] It wasn't sure its fix was correct, despite the tests
- [ ] Coding agents aren't technically able to publish code
- [ ] Asking first is simply a polite way to end a conversation
E: Approval steps belong in front of actions with real-world impact. All 24 tests passed, so the agent wasn't unsure; the point is that the human stays in charge of changes that affect customers.
```
