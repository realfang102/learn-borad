---
title: "The voice agent on the phone"
emoji: "📞"
subtitle: "Listen in as an AI agent answers a dental clinic's phone, rebooks an appointment, copes with a change of mind, and hands off to a human."
category: "Voice"
level: "Beginner"
concepts: [the-agent-loop, tools, staying-safe, agents-at-work]
sim: voice-agent
---

Most agents you'll meet work in text: you type, they type back. A **voice agent** does the same job out loud — it answers the phone, listens, talks, and uses tools like a calendar while the conversation is happening. Clinics, restaurants, hotels and delivery companies increasingly use them so callers don't wait on hold for simple requests like "Can I move my appointment?"

Voice is harder than text in a few surprising ways. The agent has to respond in about a second or the silence feels awkward. People interrupt, say "um", and change their minds mid-sentence. And because the agent works by ear, a misheard "fifteen" for "fifty" can cause real mix-ups. In this example, Tomás calls the fictional Maple Street Dental to move his cleaning — and changes his mind halfway through.

<div class="sim" data-sim="voice-agent"></div>

> [!TRY] Say "No, wait"
> When the agent reads the new appointment back, try clicking **✋ No, wait**. Notice that nothing has been changed yet — the agent only moves a booking *after* the caller confirms.

## How it works

<div class="steps-strip">
<div><strong>Greet honestly</strong>Answer fast and say it's an AI assistant.</div>
<div><strong>Verify the caller</strong>Match the phone number, then ask a quick question.</div>
<div><strong>Search the calendar</strong>Find a few slots that fit what the caller wants.</div>
<div><strong>Roll with changes</strong>Stop talking when interrupted, and search again.</div>
<div><strong>Read it back</strong>Repeat every detail and wait for a clear "yes".</div>
<div><strong>Hand off</strong>Pass anything outside its job to a person, with a summary.</div>
</div>

Behind the friendly voice, this is the same [agent loop](the-agent-loop.html) as every other agent: listen (observe), decide what to do (think), use a tool or speak (act). The tools here are simple — find a patient, search open slots, reschedule, transfer the call — but the agent uses them with good judgment. It **verified** Tomás before discussing his appointment, offered just **two options** at a time (long lists are hard to follow by ear), and **didn't book anything** until he confirmed the read-back.

Notice the handoff, too. When Tomás asked about insurance, the agent didn't guess. Coverage depends on his exact plan, and a wrong answer could cost him money. So it transferred him to a person and passed along a summary, so he didn't have to repeat himself. Knowing when to hand off is one of the most important skills a voice agent can have.

<div class="detail">

**The real technology, as of 2026.** Voice agents are usually built in one of two ways. The classic way is a **pipeline** of three steps: **speech-to-text** turns the caller's voice into words, a language model decides what to say and which tools to call, and **text-to-speech** turns the reply back into a natural-sounding voice. The newer way uses **speech-to-speech** models that listen to and produce audio directly, which can cut delays and pick up on tone. Examples include OpenAI's Realtime API and Google's Gemini Live API. Companies such as ElevenLabs, Vapi and Retell offer platforms for building phone agents, and telephone services such as Twilio connect them to real phone numbers.

The hard engineering problems are **latency** (keeping replies under about a second), **turn detection** (knowing when the caller has actually finished, not just paused), and **barge-in** (stopping instantly when the caller interrupts). There are legal questions too: rules about recording calls and telling people they're talking to an AI vary by country and state, so businesses need to check what applies to them.

</div>

## Where this is used today

- **Appointments and reservations.** Booking, moving and cancelling — clear, repetitive tasks with a calendar as the main tool.
- **After-hours answering.** Taking messages or handling simple requests when the office is closed.
- **Order and delivery updates.** "Where's my order?" calls, with a lookup tool and a handoff for anything unusual.
- **First line, not the only line.** Good setups always offer a quick way to reach a person — and send the person a summary.

> [!WARNING] What can go wrong
> - **Mishearing.** Names, dates and numbers are easy to get wrong by ear. Reading details back before acting catches most of these errors.
> - **Answering beyond its job.** Medical, legal or insurance questions need a human. An agent that guesses can cause real harm.
> - **Weak identity checks.** A phone number alone isn't proof. Without a second check, the agent could reveal private information to the wrong person.
> - **Trapping callers.** If people can't easily reach a human, they get frustrated fast. Always offer a way out.

## Try it yourself

You can practise a tricky phone call with an AI assistant's voice mode (most major assistants have one). Use this prompt to rehearse:

```prompt
Let's role-play a phone call so I can practise. You play [the other person, e.g. a receptionist at my bank / a landlord / a customer service agent at an airline].
My goal for the call: [what I want to achieve, e.g. get a late fee refunded].
Make it realistic: ask me to confirm my details, push back once, and offer an alternative.
After the call, give me feedback: one thing I did well, one thing to say more clearly, and a better phrase for any moment I hesitated.
```

If you're thinking about a voice agent for a small business, start by writing down what it should and shouldn't do:

```prompt
Help me write a simple job description for an AI phone assistant for [type of business, e.g. a hair salon].
Include: (1) the 5 most common reasons people call us: [list them if you know], (2) what the assistant may do on its own,
(3) what it must always confirm out loud before acting, (4) what it must hand to a human, and (5) how it should introduce itself.
Keep it to one page in plain language.
```

## Quick check

```quiz
Q: Why did the agent read the new appointment back before changing it?
- [ ] To fill the silence while the calendar loaded
- [x] Speech can be misheard, so a confirmed "yes" prevents mix-ups
- [ ] Because the calendar tool needs the details spoken aloud
- [ ] So the call recording would be longer
E: Voice agents work by ear, and "eight" or "fifteen" can easily be misheard. Repeating the details and waiting for a clear yes catches mistakes before they affect a real booking.

Q: Tomás interrupted with "Oh wait — no". What did the agent do?
- [ ] Finished its sentence and booked Tuesday anyway
- [ ] Ended the call and asked him to call back later
- [ ] Booked both Tuesday and Friday to be safe
- [x] Stopped talking, dropped Tuesday, and searched for Friday
E: This is called barge-in: good voice agents stop speaking the moment the caller does. Because nothing was booked yet, there was nothing to undo — it simply searched again.

Q: Why did the agent hand the insurance question to Maria?
- [x] Coverage depends on his exact plan, and a guess could cost him money
- [ ] Voice agents can only ever do one task per call
- [ ] The agent had already run out of time for the call
- [ ] Insurance questions can only be asked in writing
E: Knowing its limits is a feature, not a failure. The agent passed along a summary so Tomás didn't have to repeat himself — a "warm" handoff.
```
