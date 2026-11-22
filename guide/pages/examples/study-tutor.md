---
title: "The personal study tutor"
emoji: "🎓"
subtitle: "Watch an AI tutor help a student prepare for a biology exam — quizzing, adapting, and refusing to just do the homework."
category: "Learning"
level: "Beginner"
concepts: [learn-faster, memory, planning, great-instructions]
sim: study-tutor
---

Most people use AI to get answers. But if you're trying to *learn* something, getting answers is the wrong goal: the struggle of remembering is what makes things stick. A good **study tutor agent** flips the usual pattern. It asks *you* questions, notices what you get wrong, and changes its plan to fix your weak spots.

In this example, a student named Leo has a biology exam on Friday. He shares his class notes and asks for help. Watch how the tutor finds a mistake hiding in his notes, explains it with an everyday analogy, and politely says no when Leo asks it to do his graded homework.

<div class="sim" data-sim="study-tutor"></div>

> [!TRY] Watch the tracker
> Use **Step ⏭** to go one move at a time and keep an eye on the **Progress tracker**. Notice how each answer changes what the tutor does next: a wrong answer pauses the quiz, and a right one moves things along. At the end, try clicking **✋ No thanks** on the calendar request.

## How it works

<div class="steps-strip">
<div><strong>Read first</strong>Study the student's own notes to see what the class covered.</div>
<div><strong>Diagnose</strong>Ask a few quick questions before teaching anything.</div>
<div><strong>Fix misconceptions</strong>Explain with an analogy, then ask the student to explain it back.</div>
<div><strong>Hint, don't tell</strong>Give a nudge so the student finds the answer.</div>
<div><strong>Adapt the plan</strong>Spend more time on weak topics and less on strong ones.</div>
<div><strong>Space it out</strong>Make flashcards and schedule reviews over several days.</div>
</div>

The tutor uses just a few tools: reading a document, keeping a **memory** of which topics are strong or weak, writing flashcards, and (with permission) adding events to a calendar. What makes it a *tutor* rather than an answer machine is its strategy. It keeps Leo doing the thinking, and it keeps changing its plan based on what it observes. That's [the agent loop](the-agent-loop.html) applied to learning.

Notice the moment it catches the mistake in Leo's notes ("mitosis makes 4 cells"). It doesn't correct the notes right away. It **tests** first, to find out whether the mix-up is only on paper or in Leo's head too. That one question tells it where to spend the session.

<div class="detail">

**The learning science behind it.** Two of the best-supported findings in the psychology of learning drive this tutor. **Retrieval practice** means testing yourself instead of re-reading, and it strengthens memory more than reviewing does. **Spaced repetition** means reviewing material at growing intervals, just before you'd forget it. Flashcard apps such as Anki schedule cards this way automatically. (Recent Anki versions offer an algorithm called FSRS, which predicts when you're likely to forget each card.)

**The products, as of 2026.** The major assistants now have tutoring modes built on these ideas. ChatGPT has *study mode*, Claude has a *learning mode*, and Google's Gemini has *Guided Learning*. Each one is designed to ask guiding questions instead of handing over answers. Khan Academy's Khanmigo is built specifically for students and teachers, and Google's NotebookLM can turn your own notes into quizzes and flashcards. Features change quickly, so check what your tool currently offers. Many schools also have their own rules about AI use.

</div>

## Why this works

- **It starts from what you know.** Reading your notes and quizzing you first means no time is wasted on topics you've already mastered.
- **Mistakes become signals.** Every wrong answer tells the tutor exactly what to teach next, which is something a textbook can't do.
- **You do the work.** Hints, "explain it back" and worked examples keep your brain active. That's the part that builds memory.
- **It never gets tired.** A tutor agent can quiz you at 11 pm the night before as patiently as it did on Monday.

The refusal matters too. When Leo asks the tutor to complete his graded worksheet, it says no and explains why: the worksheet is the exact practice he needs, and handing in work you didn't do may break school rules. Then it offers a deal that still saves him time. A good tutor protects your learning even when you're tired enough to want a shortcut. You can read more about this in [learning faster with AI](learn-faster.html).

> [!WARNING] What can go wrong
> - **Confident mistakes.** AI tutors can explain things wrongly with total confidence. Cross-check key facts with your textbook or teacher, especially formulas, dates and definitions.
> - **The illusion of learning.** Reading a perfect AI explanation *feels* like understanding. If you can't explain it back without looking, you haven't learned it yet.
> - **Drifting from your course.** A tutor might teach a topic differently from how your class does, or include things that aren't on your exam. Share your syllabus and notes so it stays on track.
> - **Crossing honesty lines.** Using AI to write graded work can count as cheating. Know your school's AI policy, and use the tutor to *practise*, not to submit.

## Try it yourself

Paste this into a capable AI assistant (ChatGPT, Claude, Gemini or similar). Attach your notes if you can:

```prompt
I have a [subject] exam on [date] covering [topics]. I can study about [time] per day.
Please act as my tutor, not an answer machine:
1. Read my attached notes and tell me if anything in them looks wrong or missing.
2. Give me a short diagnostic quiz, one question at a time. Wait for my answer each time.
3. When I get something wrong, give me a hint first, and only explain fully if I'm still stuck. Then ask me to explain it back in my own words.
4. Keep a running list of my strong and weak topics.
5. At the end, make a day-by-day study plan and 10 flashcards on my weakest topics, with a spaced review schedule.
Don't do any graded homework for me, even if I ask.
```

```prompt
Quiz me on [topic] using spaced repetition. Start with 5 questions. Bring back the ones I miss later in the session, mixed in with new ones, until I've got each one right twice.
```

```quiz
Q: Why did the tutor quiz Leo *before* explaining mitosis and meiosis?
- [ ] Quizzing is faster than explaining
- [x] To find out whether the mistake in his notes was also in his head
- [ ] Because it couldn't read his notes properly
- [ ] To give him a grade for his teacher
E: The tutor had spotted the error in the notes but didn't know whether Leo actually believed it. One diagnostic question showed the mix-up was real, so it knew exactly what to fix first.

Q: When Leo answered the Punnett square question wrong, what did the tutor do?
- [ ] It gave him the right answer and moved on
- [ ] It skipped genetics because it was too hard
- [x] It gave a hint so he could work out the answer himself
- [ ] It marked the topic as finished
E: A hint ("draw the 2×2 grid") kept Leo doing the thinking. Answers you work out yourself are remembered far better than answers you're handed, and that's why giving the answer straight away, although it's quicker, is less helpful.

Q: Why did the tutor refuse to complete Leo's worksheet?
- [ ] AI tools aren't able to solve genetics problems
- [ ] The worksheet was too long for it to read
- [ ] It wanted Leo to stay up later studying
- [x] It was graded work, and it was exactly the practice Leo needed
E: Doing graded work for a student can break academic honesty rules, and here it would have skipped practice on Leo's weakest topic. The tutor explained this and offered to check his answers instead.
```
