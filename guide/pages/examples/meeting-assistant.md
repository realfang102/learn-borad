---
title: "The meeting assistant"
emoji: "📝"
subtitle: "Watch an assistant turn a messy meeting transcript into a summary, clear tasks and a follow-up email, and ask when something is unclear."
category: "Productivity"
level: "Beginner"
concepts: [agents-at-work, tools, reliable-agents]
sim: meeting-assistant
---

We've all left a meeting thinking everyone agreed, only to discover a week later that nobody did the thing, or that two people remember the decision differently. Meetings produce decisions and to-dos, but they're buried in an hour of conversation. A **meeting assistant** reads the transcript and turns it into something people can act on: a short summary, a list of who does what by when, and a follow-up email.

In this example, Rosa's marketing team has just discussed their spring catalog. The transcript contains a fuzzy decision ("Let's go with that"), a job with no owner, and a deadline of "sometime next week." Watch how the assistant spots all three, asks Rosa instead of guessing, and recovers when the project tool rejects a name.

<div class="sim" data-sim="meeting-assistant"></div>

> [!TRY] Read the transcript yourself first
> Pause after the transcript appears and try to list the action items yourself. Did you notice that "Let's go with that" could mean two different things? Then compare your list with what the assistant flags.

## How it works

<div class="steps-strip">
<div><strong>Read it all</strong>Go through the whole transcript, including the messy parts.</div>
<div><strong>Separate clear from unclear</strong>List firm facts, and flag anything vague.</div>
<div><strong>Owner + date</strong>Every action item needs both. Mark any that are missing.</div>
<div><strong>Check dependencies</strong>Make sure the deadlines fit together.</div>
<div><strong>Ask, quoting the moment</strong>Short questions with the exact words from the transcript.</div>
<div><strong>Approve, then create</strong>Add tasks to the project tool only after a yes.</div>
</div>

The most valuable thing this assistant does isn't summarizing. Most tools can do that. It's **noticing what's missing**. "Let's go with that" came right after *two* different suggestions, so a careless summary would have picked one and written it down as fact. Everyone would then have read the summary and trusted it. By marking the decision as *unconfirmed* and quoting the exact moment, the assistant made it easy for Rosa to fix in seconds.

It also checked that the dates made sense together. Amara can't write the catalog copy until Tom gets the prices, so Tom's vague "next week" mattered more than it seemed. When the project tool didn't recognize "Amara Osei", the assistant searched for her, confirmed the match by email address, and tried again. It didn't give up, and it didn't assign the task to the wrong person.

<div class="detail">

**The real technology, as of 2026.** Meeting assistants have two parts. First, **speech-to-text** turns the recording into a transcript with speaker labels (telling voices apart is called **diarization**). Then a language model reads the transcript to summarize it and pull out tasks. These features are built into the major video-call apps: Zoom has AI Companion, Microsoft Teams has Copilot recaps, and Google Meet can "take notes for me" with Gemini. Independent note-takers such as Otter.ai, Fireflies.ai and Granola do the same across platforms.

Creating tasks in a project tool (Asana, Jira, Linear, Trello and others) uses that tool's API, often through a connector or an **MCP** server (see [under the hood](under-the-hood.html)). "TaskBoard" in the simulation is fictional. Transcription errors are common with names, jargon, accents and cross-talk, which is one more reason to review the output.

</div>

## Where this is used today

- **Automatic recaps** are now a standard feature of video-call apps. Many teams read the AI summary instead of re-watching recordings.
- **Action-item extraction** saves the "who's doing what?" email that someone used to write by hand, but it works best when someone reviews the list before it's shared.
- **Task creation** in project tools is newer and usually kept behind an approval step, because it assigns work to real people and sends them notifications.
- **Searching past meetings** ("What did we decide about kayaks?") is becoming common too. It's handy, but only as reliable as the original transcripts.

> [!WARNING] What can go wrong
> - **Invented certainty.** A summary can state a decision that was never really made, and people tend to trust the written version over their memory. Ask your assistant to mark anything uncertain.
> - **Mishearing.** Transcripts garble names, numbers and technical terms. "Fifteen" and "fifty" can swap, which matters a lot in a budget meeting.
> - **Privacy and consent.** Recording and transcribing people has legal and ethical rules that vary by place and workplace. Tell everyone the meeting is being recorded, and be careful with sensitive conversations.
> - **Tasks nobody agreed to.** If the assistant assigns a task to someone who only *mentioned* an idea, it creates confusion. Review owners before tasks go out.

## Try it yourself

Paste a transcript (or your own rough notes) into a capable AI assistant:

```prompt
Here's a transcript of a meeting: [paste transcript or notes].
Please produce:
1. A summary in 5 bullet points or fewer: decisions made, open questions, key dates.
2. A table of action items with columns: task, owner, due date, and a quote from the transcript as evidence.
3. A list of anything unclear: decisions that could be read two ways, tasks with no owner, vague dates. Quote the exact words and ask me a question for each.
Don't guess. If something wasn't clearly decided, mark it "unconfirmed".
```

```prompt
Using the confirmed action items above, draft a short, friendly follow-up email to the attendees: [names]. Include the decisions and each person's tasks with dates. Don't send it. Show me the draft.
```

```quiz
Q: What made "Let's go with that" a problem for the assistant?
- [ ] Rosa spoke too quietly for it to be transcribed
- [x] It came right after two different suggestions
- [ ] It was said after the meeting had officially ended
- [ ] Nobody else in the meeting agreed with Rosa
E: Kenji suggested online-only and Amara suggested a smaller section, and then Rosa said "that". Picking one would have been a guess written down as fact, so the assistant quoted the moment and asked.

Q: Why did the assistant care about Tom's "sometime next week"?
- [ ] The transcript showed that Tom is often late
- [ ] TaskBoard refuses to create tasks without a date
- [x] Amara's copy depended on Tom's prices arriving
- [ ] Vague dates make a summary too long to read
E: Checking dependencies is part of making action items useful. If Tom's prices slipped, Amara's Dec 18 deadline was at risk, so a firm date (Dec 4) mattered. TaskBoard never complained about dates; its only error was about a name.

Q: When TaskBoard didn't recognize "Amara Osei", what did the assistant do?
- [ ] It gave the task to Rosa instead, to be safe
- [ ] It stopped and reported the whole job as failed
- [ ] It created a brand-new TaskBoard account for Amara
- [x] It searched for her, matched the email, and retried
E: A good agent investigates errors instead of giving up or improvising. The email address confirmed "Amara O." was the same person, so retrying was safe. Giving the task to someone else would have quietly created a mess.
```
