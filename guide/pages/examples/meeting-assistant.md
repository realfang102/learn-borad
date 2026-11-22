---
title: "The meeting assistant"
emoji: "📝"
subtitle: "An assistant turns a messy transcript into a summary, clear tasks and a follow-up email."
category: "Productivity"
level: "Beginner"
concepts: [agents-at-work, tools, reliable-agents]
sim: meeting-assistant
---

A **meeting assistant** turns an hour of talk into something people can act on: a summary, who does what by when, and a follow-up email. Rosa's transcript hides a fuzzy decision, a job with no owner and a vague deadline; watch the assistant catch all three.

<div class="sim" data-sim="meeting-assistant"></div>

> [!TRY] Spot the gaps first
> Pause on the transcript, list the action items yourself, then compare with what the assistant flags.

## How it works

<div class="steps-strip">
<div><strong>Read it all</strong>The whole transcript, messy parts included.</div>
<div><strong>Separate clear from unclear</strong>List firm facts; flag anything vague.</div>
<div><strong>Owner + date</strong>Every action item needs both.</div>
<div><strong>Check dependencies</strong>Make sure the deadlines fit together.</div>
<div><strong>Ask, quoting the moment</strong>Short questions using the transcript's exact words.</div>
<div><strong>Approve, then create</strong>Add tasks to the project tool after yes.</div>
</div>

The real skill isn't summarizing but **noticing what's missing**: "Let's go with that" followed *two* suggestions, so the assistant marked it *unconfirmed* and quoted the moment instead of guessing. When the project tool didn't recognize "Amara Osei", it searched, matched her email address and retried, rather than giving up or picking the wrong person.

<div class="detail">

**The real technology, as of 2026.** Meeting assistants have two parts. **Speech-to-text** turns the recording into a transcript with speaker labels (telling voices apart is called **diarization**); then a language model summarizes it and pulls out tasks. These features are built into the major video-call apps: Zoom has AI Companion, Microsoft Teams has Copilot recaps, and Google Meet can "take notes for me" with Gemini. Independent note-takers such as Otter.ai, Fireflies.ai and Granola work across platforms.

Creating tasks in a project tool (Asana, Jira, Linear, Trello and others) uses that tool's API, often through a connector or an **MCP** server (see [under the hood](under-the-hood.html)). "TaskBoard" in the simulation is fictional. Transcripts often garble names, jargon, accents and cross-talk, one more reason to review the output.

</div>

## Where this is used today

- **Automatic recaps:** standard in video-call apps; many teams read the summary instead of re-watching.
- **Action-item extraction:** replaces the hand-written "who's doing what?" email; best reviewed before sharing.
- **Task creation:** newer, and usually behind approval, since it assigns work and notifies people.
- **Searching past meetings:** handy, but only as reliable as the original transcripts.

> [!WARNING] What can go wrong
> - **Invented certainty.** A summary can state a decision nobody made. Ask it to mark anything uncertain.
> - **Mishearing.** Transcripts garble names and numbers; "fifteen" and "fifty" can swap.
> - **Privacy and consent.** Recording rules vary by place. Tell everyone, and take care with sensitive talks.

## Try it yourself

Paste a transcript (or your rough notes) into a capable AI assistant:

```prompt
Here's a meeting transcript: [paste transcript or notes].
1. Summarize in 5 bullets or fewer: decisions, open questions, key dates.
2. Make a table of action items: task, owner, due date, and a quote as evidence.
3. List anything unclear (two-way decisions, no owner, vague dates). Quote the words and ask me about each.
4. Then draft a short follow-up email to [names]. Don't send it.
Don't guess. If something wasn't clearly decided, mark it "unconfirmed".
```

```quiz
Q: What made "Let's go with that" a problem for the assistant?
- [ ] Rosa spoke too quietly for it to be transcribed
- [x] It came right after two different suggestions
- [ ] It was said after the meeting had officially ended
- [ ] Nobody else in the meeting agreed with Rosa
E: Kenji suggested online-only and Amara a smaller section; then Rosa said "that". Picking one would have been a guess written down as fact, so the assistant quoted the moment and asked.

Q: Why did the assistant care about Tom's "sometime next week"?
- [ ] The transcript showed that Tom is often late
- [ ] TaskBoard refuses to create tasks without a date
- [x] Amara's copy depended on Tom's prices arriving
- [ ] Vague dates make a summary too long to read
E: If Tom's prices slipped, Amara's Dec 18 deadline was at risk, so a firm date (Dec 4) mattered. TaskBoard never complained about dates; its only error was about a name.

Q: When TaskBoard didn't recognize "Amara Osei", what did the assistant do?
- [ ] It gave the task to Rosa instead, to be safe
- [ ] It stopped and reported the whole job as failed
- [ ] It created a brand-new TaskBoard account for Amara
- [x] It searched for her, matched the email, and retried
E: A good agent investigates errors instead of giving up or improvising. The matching email confirmed "Amara O." was the same person, so retrying was safe.
```
