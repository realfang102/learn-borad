---
title: "The personal study tutor"
emoji: "🎓"
subtitle: "Watch an AI tutor quiz a student, adapt its plan and refuse to do his homework."
category: "Learning"
level: "Beginner"
concepts: [learn-faster, memory, planning, great-instructions]
sim: study-tutor
---

To *learn*, answers are the wrong goal: the effort of remembering is what makes things stick. A **study tutor agent** asks *you* questions and adapts to your mistakes, as Leo finds while preparing for Friday's biology exam.

<div class="sim" data-sim="study-tutor"></div>

> [!TRY] Watch the tracker
> Use **Step** and watch the **Progress tracker** change with each answer; at the end, click **No thanks**.

## How it works

<div class="steps-strip">
<div><strong>Read first</strong>Study the student's own notes.</div>
<div><strong>Diagnose</strong>Ask quick questions before teaching.</div>
<div><strong>Fix misconceptions</strong>Explain with an analogy; ask for it back.</div>
<div><strong>Hint, don't tell</strong>Nudge so the student finds the answer.</div>
<div><strong>Adapt the plan</strong>More time on weak topics, less on strong.</div>
<div><strong>Space it out</strong>Flashcards and reviews over several days.</div>
</div>

Its tools are simple (reading a document, a **memory** of strong and weak topics, flashcards, a calendar with permission), but its strategy makes it a tutor: Leo does the thinking, and the plan changes with every answer, [the agent loop](the-agent-loop.html) applied to learning. When it spotted "mitosis makes 4 cells" in his notes, it **tested** before correcting, to learn whether the mix-up was in Leo's head too.

<div class="detail">

**The learning science.** Two of the best-supported findings in the psychology of learning drive this tutor. **Retrieval practice** (testing yourself instead of re-reading) strengthens memory more than reviewing. **Spaced repetition** means reviewing at growing intervals, just before you'd forget. Flashcard apps such as Anki schedule cards this way; recent versions offer an algorithm called FSRS, which predicts when you're likely to forget each card.

**The products, as of 2026.** ChatGPT has *study mode*, Claude has a *learning mode*, and Google's Gemini has *Guided Learning*, each designed to ask guiding questions instead of handing over answers. Khan Academy's Khanmigo is built for students and teachers, and Google's NotebookLM can turn your notes into quizzes and flashcards. Features change quickly, and many schools have their own AI rules.

</div>

## Why this works

- **Starts from what you know.** No time wasted on mastered topics.
- **Mistakes become signals.** Each wrong answer shows what to teach next.
- **You do the work.** Hints and "explain it back" keep your brain active.
- **It never gets tired.** As patient at 11 pm as on Monday.

The refusal matters too: Leo's worksheet was graded and was exactly the practice he needed, so the tutor declined and offered to do question 1 together and check the rest. More in [learning faster with AI](learn-faster.html).

> [!WARNING] What can go wrong
> - **Confident mistakes.** Cross-check key facts, formulas and dates with your textbook or teacher.
> - **The illusion of learning.** If you can't explain it back without looking, you haven't learned it yet.
> - **Crossing honesty lines.** AI-written graded work can count as cheating; know your school's policy.

## Try it yourself

Paste this into a capable AI assistant (ChatGPT, Claude, Gemini or similar), with your notes attached:

```prompt
I have a [subject] exam on [date] covering [topics], with [time] a day to study.
Be my tutor, not an answer machine:
1. Check my notes for anything wrong or missing.
2. Quiz me one question at a time; give hints before full explanations, then ask me to explain back.
3. Track my strong and weak topics, then make a day-by-day plan and 10 spaced-review flashcards.
Don't do any graded homework for me, even if I ask.
```

```prompt
Quiz me on [topic] with spaced repetition: 5 questions to start, bringing back the ones I miss until I've got each right twice.
```

```quiz
Q: Why did the tutor quiz Leo *before* explaining mitosis and meiosis?
- [ ] Quizzing is faster than explaining, so it saves time
- [x] To see if the error in his notes was in his head too
- [ ] It couldn't read his notes properly, so it had to ask
- [ ] To give him a score it could pass on to his teacher
E: The tutor had read the notes and spotted the error, but didn't know whether Leo believed it. One diagnostic question showed the mix-up was real, so it knew what to fix first.

Q: When Leo answered the Punnett square question wrong, what did the tutor do?
- [ ] Gave him the right answer straight away and moved on
- [ ] Skipped genetics for now because it was too hard
- [x] Gave a hint so he could find the answer himself
- [ ] Marked genetics as a strong topic and finished
E: A hint ("draw the 2×2 grid") kept Leo doing the thinking. Handing over the answer is quicker, but answers you work out yourself are remembered far better.

Q: Why did the tutor refuse to complete Leo's worksheet?
- [ ] AI tools can't reliably solve genetics problems
- [ ] The worksheet was too long for it to read in time
- [ ] It wanted Leo to stay up later and study more
- [x] It was graded, and it was the practice he needed
E: It had just walked Leo through a Punnett square, so it could have solved it. But doing graded work can break academic honesty rules and would skip practice on his weakest topic, so it offered to check his answers instead.
```
