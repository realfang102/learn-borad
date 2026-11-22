---
title: "The voice agent on the phone"
emoji: "📞"
subtitle: "An AI answers a clinic's phone, rebooks an appointment, and hands off to a human."
category: "Voice"
level: "Beginner"
concepts: [the-agent-loop, tools, staying-safe, agents-at-work]
sim: voice-agent
---

A **voice agent** answers the phone, listens, talks, and uses tools like a calendar mid-conversation, so callers don't wait on hold for simple requests. Voice is harder than text: replies must come in about a second, people interrupt and change their minds, and here Tomás does exactly that while moving his dental cleaning.

<div class="sim" data-sim="voice-agent"></div>

> [!TRY] Say "No, wait"
> At the read-back, click **No, wait**: nothing changes until the caller confirms.

## How it works

<div class="steps-strip">
<div><strong>Greet honestly</strong>Answer fast and say it's an AI.</div>
<div><strong>Verify the caller</strong>Match the number, then ask a question.</div>
<div><strong>Search the calendar</strong>Find a few slots that fit.</div>
<div><strong>Roll with changes</strong>Stop when interrupted, and search again.</div>
<div><strong>Read it back</strong>Repeat every detail; wait for a clear "yes".</div>
<div><strong>Hand off</strong>Pass anything outside its job to a person.</div>
</div>

Behind the voice is the same [agent loop](the-agent-loop.html): listen, decide, then speak or use a tool. It **verified** Tomás first, offered **two options** at a time (long lists are hard to follow by ear), booked nothing until he confirmed, and passed the insurance question to a person with a summary rather than guessing.

<div class="detail">

**The real technology, as of 2026.** The classic build is a **pipeline**: **speech-to-text** turns the voice into words, a language model decides what to say and which tools to call, and **text-to-speech** speaks the reply. Newer **speech-to-speech** models handle audio directly, which can cut delays and pick up on tone; examples include OpenAI's Realtime API and Google's Gemini Live API. Companies such as ElevenLabs, Vapi and Retell offer platforms for phone agents, and telephone services such as Twilio connect them to real numbers.

The hard problems are **latency** (replies under about a second), **turn detection** (knowing the caller has finished, not just paused) and **barge-in** (stopping instantly when interrupted). Rules on recording calls and disclosing AI vary by country and state, so businesses must check what applies.

</div>

## Where this is used today

- **Appointments and reservations:** booking, moving and cancelling, with a calendar as the main tool.
- **After-hours answering:** messages and simple requests when the office is closed.
- **Order and delivery updates:** "Where's my order?" calls, handing off anything unusual.
- **First line, not the only line:** good setups offer a quick route to a person, with a summary.

> [!WARNING] What can go wrong
> - **Mishearing.** Names, dates and numbers slip by ear; reading details back catches most errors.
> - **Answering beyond its job.** Medical, legal or insurance questions need a human.
> - **Weak identity checks.** A phone number alone isn't proof; add a second check.

## Try it yourself

Rehearse a tricky call in an AI assistant's voice mode (most major assistants have one):

```prompt
Let's role-play a phone call so I can practise. You play [the other person, e.g. a receptionist at my bank].
My goal: [what I want, e.g. get a late fee refunded].
Ask me to confirm my details, push back once, and offer an alternative.
Afterwards, give me one thing I did well, one thing to say more clearly, and a better phrase for any moment I hesitated.
```

```prompt
Write a one-page job description for an AI phone assistant for [type of business]. Include: the 5 most common reasons people call, what it may do alone, what it must confirm out loud, what it must hand to a human, and how it introduces itself.
```

## Quick check

```quiz
Q: Why did the agent read the new appointment back before changing it?
- [ ] To fill the awkward silence while the calendar tool was loading
- [x] Speech can be misheard, so a clear "yes" prevents mix-ups
- [ ] Because the calendar tool only accepts details that are spoken aloud
- [ ] So the call recording would be long enough to keep for training
E: Voice agents work by ear, and "eight" or "fifteen" are easily misheard. Waiting for a clear yes catches mistakes before they touch a real booking.

Q: Tomás interrupted with "Oh wait, no". What did the agent do?
- [ ] Finished its sentence and booked Tuesday anyway, as he'd first agreed
- [ ] Ended the call politely and asked him to call back when he'd decided
- [ ] Booked both Tuesday and Friday so he'd have a backup either way
- [x] Stopped talking, dropped Tuesday, and searched for Friday
E: This is barge-in: good voice agents stop speaking the moment the caller does. Nothing was booked yet, so there was nothing to undo; it simply searched again.

Q: Why did the agent hand the insurance question to Maria?
- [x] Coverage depends on his plan, and a wrong guess could cost him money
- [ ] Voice agents are only able to complete one single task during each call
- [ ] The agent had already used up all of the time allowed for one phone call
- [ ] Insurance questions can only ever be answered in writing, never by phone
E: Knowing its limits is a feature, not a failure. Passing along a summary meant Tomás didn't have to repeat himself: a "warm" handoff.
```
