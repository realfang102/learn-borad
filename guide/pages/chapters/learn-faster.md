---
title: "Learn anything faster with an AI tutor"
emoji: "🎓"
subtitle: "Study techniques that research actually supports — and how to use AI and agents to do each one, without letting the AI do your thinking for you."
minutes: 11
---

Picture the night before an exam. You read your notes again. You highlight the important bits in yellow. You read them once more. It all looks so familiar now — you must know it, right?

Then the exam starts and your mind goes blank.

That's not a personal failing. It's one of the best-known findings in the science of learning: **the study methods that *feel* most productive are often not the ones that work best**. Rereading makes material feel familiar, and familiarity is easy to mistake for knowing. The methods that really work tend to feel harder — and that's exactly where an AI tutor can help.

> [!KEY] The big idea
> You learn by **making your brain work**: pulling ideas out of memory, explaining them, and practising at spaced intervals. AI is a fantastic partner for this — it can quiz you, question you and plan your reviews — **as long as you do the thinking, not the AI.**

## What actually works

Psychologists have studied learning for more than a century. A widely cited 2013 review by John Dunlosky and colleagues looked at ten popular study techniques and rated how well the evidence supported each. **Practice testing** and **spacing out your study** came out on top. Highlighting and rereading — the night-before-the-exam favourites — were rated low.

Here are five techniques with solid research behind them, and how AI can help with each:

| Technique | What it means | How AI helps |
|---|---|---|
| 🧠 **Active recall** | Pulling an answer *out* of your memory, instead of reading it again | Quizzes you, one question at a time |
| 🗓️ **Spaced repetition** | Reviewing at growing gaps: tomorrow, in 3 days, next week… | Makes flashcards and a review schedule |
| 🗣️ **Explaining in your own words** | Teaching an idea to find the gaps in your understanding | Plays a curious student who spots the holes |
| 🧩 **Worked examples** | Studying a fully solved problem step by step before trying your own | Shows solutions, then gradually hands over the steps |
| 🔀 **Interleaving** | Mixing different types of problems instead of doing them in blocks | Builds mixed practice sets |

A quick honest note: these aren't magic, and the evidence is stronger for some than others. Active recall and spacing are among the most consistently supported findings in learning research. Interleaving has strong results especially for maths and for learning to tell similar things apart. Worked examples help most when you're a **beginner** — as you get better, solving problems yourself becomes more useful than studying solutions.

<div class="detail">

**Why "harder" works better:** psychologist Robert Bjork calls these **desirable difficulties**. Struggling a little to recall an answer strengthens the memory more than easily re-reading it. In a well-known 2006 experiment, Henry Roediger and Jeffrey Karpicke found that students who practised recalling a text remembered noticeably more a week later than students who spent the same time re-reading it — even though the re-readers felt *more* confident. Spacing works partly because you've started to forget, so each review takes effort. The catch: because these methods feel harder, people often wrongly believe they're working less well.

</div>

## Six ways to use an AI tutor

Type any topic you're learning into the box below, then click through the six modes. Watch how each mini-conversation goes, and notice that the best ones make **you** do the work. Each comes with a prompt you can copy.

<div data-widget="tutor-modes"></div>

Did you spot the difference? In "Explain like I'm 5" and "Real-world examples" the AI does most of the talking — great for a first look at a topic. But in "Socratic tutor", "Quiz me" and "Feynman check", *you* answer, explain and get corrected. Those are the modes that build lasting memory.

> [!ANALOGY] A gym, not a taxi
> You wouldn't ask a personal trainer to lift the weights for you. Use an AI tutor the same way: as a coach who sets the exercises, spots your form and cheers you on — not as a taxi that carries you to the answer.

## Your AI study toolkit

Here are prompts for each technique. Paste them into a capable AI assistant and fill in the brackets.

**Active recall — get quizzed, don't reread.** After a lecture or chapter, close your notes and let the AI question you.

```prompt
I just studied [topic / chapter]. Here are my notes: [paste notes].
Quiz me on them, one question at a time. Mix quick facts with "why" and "how" questions.
Wait for my answer before continuing. If I'm wrong, give me a hint first and let me try again before explaining.
At the end, list the 3 things I should review.
```

**Spaced repetition — flashcards plus a schedule.** AI is great at turning notes into flashcards. The spacing itself is best handled by a flashcard app (Anki is a popular free one) that decides when each card is due — or by an agent that can put review sessions in your calendar.

```prompt
Turn these notes into 20 flashcards: [paste notes].
Rules: one idea per card, the question on the front, a short answer (under 20 words) on the back. Include a few "why" cards, not just definitions.
Format each card on one line as: question;answer — so I can import them into a flashcard app.
Then suggest a review schedule for the next 3 weeks with growing gaps between sessions.
```

**Explain it in your own words.** This is often called the **Feynman technique**, popularly named after the physicist Richard Feynman, who was famous for explaining hard ideas simply. If you can't explain something plainly, you've found a gap.

```prompt
I'm going to explain [topic] in my own words, as if to a curious 12-year-old.
Act as that student: ask me about anything vague, point out anything wrong or missing, and make me define any jargon.
Don't give me the correct explanation until I've had two tries. Then show me a clear version and highlight what I missed.
```

**Worked examples, then fade them out.** Ask for a full solution, then for problems where more and more of the steps are left to you.

```prompt
I'm learning [skill, e.g. "calculating percentages for discounts and tax"]. I'm a beginner.
1. Show me one fully worked example, explaining why each step is done.
2. Then give me a similar problem with the last step left for me.
3. Then one with the last two steps left for me, and so on, until I solve one completely on my own.
Check each of my answers before moving on.
```

**Interleaving — mix it up.** Instead of 20 problems of the same type, ask for a shuffled set, so you practise *choosing* the right method — which is what a real exam asks of you.

```prompt
Give me 12 mixed practice problems on [topics, e.g. "fractions, percentages and ratios"], shuffled so I can't tell the type from the order.
For each one, first ask me which method I'd use and why, then let me solve it. Tell me if I picked the wrong method before I start calculating.
```

To see a full tutoring session — diagnosing gaps, fixing a misunderstanding, building spaced flashcards — watch the [study tutor example](example-study-tutor.html).

## Learning a whole new field

Sometimes you're not studying for a test — you've just been handed a new area at work, or you're curious about something big, like how the electricity grid works. Here, a **research agent** (an agent that searches and reads many sources for you, like the one in the [research agent example](example-research-agent.html)) can build you a map of the territory.

```prompt
I'm new to [field, e.g. "supply-chain management"] and need a solid working understanding within [time].
Please research it and give me:
1. A one-page map of the field: the main ideas and how they connect.
2. The 15 key terms, each explained in one plain sentence.
3. 5 well-regarded beginner resources (books, courses or articles), with links, and why each is useful.
4. The common misconceptions beginners have.
Cite your sources, and tell me where experts disagree.
```

Then turn that map into a study plan with the techniques above — the "Study plan" mode in the playground is a good start.

## Check the facts

AI tutors are patient and always available, but they're not always right. As you learned in [The AI brain](the-ai-brain.html), a language model can state something false with complete confidence — a wrong date, a garbled formula, or a source that doesn't exist. When you're a beginner, you're the person *least* able to notice.

So build a few habits:

- **Anchor to a trusted source.** Give the AI your textbook chapter, class notes or official materials, and ask it to stick to them. (The study tutor in the example reads the student's own notes first.)
- **Ask for sources — then open them.** A link you've actually clicked is worth ten that you haven't.
- **Cross-check what matters.** Before an exam or a work decision, verify key facts in your course materials or with a teacher or expert.
- **Notice when it disagrees with your class.** Sometimes the AI is wrong; sometimes your course uses a simplified version. Ask your teacher.

> [!WARNING] Don't let it do the thinking for you
> It's tempting to ask the AI for the answer, read it, nod, and move on. That feels like learning but mostly isn't — you've practised *reading* an answer, not *producing* one. At least one field study with high-school maths students found that those given a general chatbot during practice did better in practice but worse on a later test taken without it, while a version designed to give hints instead of answers largely avoided that drop. Ask for hints, not answers. Try first, then check. And for graded work, follow your school's or employer's rules on AI use.

<div class="detail">

**A myth to skip:** you may have heard that you learn best in your personal "learning style" — visual, auditory or hands-on — and that teaching should match it. It's a hugely popular idea, but studies that tested it properly haven't found that matching teaching to a preferred style improves learning. It's fine to use what you enjoy, but your time is better spent on the techniques above: recall, spacing, explaining and mixed practice, which help pretty much everyone.

</div>

> [!TRY] A 10-minute experiment
> Pick something you read this week. Instead of rereading it, ask an AI to quiz you on it with five questions, without looking at your notes. Most people are surprised by how much they *thought* they knew — and how much better it sticks after the quiz.

## Quick check

```quiz
Q: The night before an exam, which study method is research most likely to support?
- [ ] Rereading your notes several times until they feel familiar
- [ ] Highlighting the key sentences in bright colours
- [x] Answering practice questions from memory, notes closed
- [ ] Copying all of your notes out again neatly by hand
E: Practice testing (active recall) is one of the best-supported techniques. Rereading and highlighting feel productive because the material becomes familiar — but familiar isn't the same as being able to recall it.

Q: Which way of using an AI tutor builds the most lasting understanding?
- [ ] Asking it for model answers and reading them carefully
- [x] Explaining it yourself while the AI probes gaps
- [ ] Having it summarize each chapter for you
- [ ] Asking it to rewrite your notes so they're clearer
E: Explaining in your own words forces you to produce the idea, which reveals and fixes gaps. Reading answers or summaries is useful for a first look, but on its own it's mostly passive.

Q: Your AI tutor confidently tells you a date that differs from your textbook. What should you do?
- [ ] Trust the AI, because it has read more than your textbook
- [ ] Trust whichever answer sounds more detailed
- [ ] Ignore the difference, since dates rarely matter much
- [x] Check a trusted source or ask your teacher first
E: AI can state wrong facts with confidence, and as a learner you're not yet in a position to tell. Checking a trusted source — or asking your teacher — settles it.
```

## What's next

You've seen how agents can help you *learn*. Next, let's look at how they can help you *work*: [getting more done at work](agents-at-work.html) — which tasks to hand to an agent, which to review, and which to keep for yourself.
