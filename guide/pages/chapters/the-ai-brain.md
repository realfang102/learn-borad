---
title: "The AI brain inside every agent"
emoji: "🧠"
subtitle: "What a large language model really is, why it's so good with words, and why it still needs tools to get things right."
minutes: 11
---

Type "Happy birthday to…" on your phone and it suggests "you". That little autocomplete is guessing the next word from what you've typed so far.

Now imagine an autocomplete that has read a huge slice of everything people have written — books, articles, manuals, recipes, code, conversations — and has become *astonishingly* good at guessing what comes next. So good that it can finish not just a sentence, but an email, an essay, a plan, or a piece of reasoning.

That's the brain inside every AI agent. It's called a **large language model**, or **LLM** for short: a computer program that has learned the patterns of language from enormous amounts of text, and uses them to write a sensible continuation of whatever you give it.

> [!KEY] The big idea
> A language model does one thing, over and over: **it predicts the next little piece of text.** Everything else — answering questions, writing, planning, choosing which tool to use — is built from that single skill, repeated very quickly.

## A super-powered autocomplete

The best way to understand this is to *be* the model for a moment. Pick a sentence start below, then press **🎲 Pick the next word** a few times. Try sliding the temperature all the way down, then all the way up, and press **Ask 5 times** at each end.

<div data-widget="next-word"></div>

Did you notice? The model doesn't look up "the answer". It gives every possible next word a score, then **picks one** — usually a likely one, but not always the same one. With the temperature low, it almost always picks the favorite. With the temperature high, it takes more chances. That's why asking the same question twice can give you two slightly different answers.

Then it adds the chosen word to the text and does it all again for the next word. And the next. A full paragraph is just this tiny step repeated a few hundred times, very fast.

> [!ANALOGY] Think of it like this
> Imagine someone who has spent years reading in a giant library, but has no phone and no window. Ask them anything and they'll answer fluently from memory — often brilliantly. But they can't check today's news, can't call anyone, and sometimes they'll *misremember* a detail while sounding completely sure. Keep this person in mind; we'll come back to them.

### How does it get so good?

A language model is built in two big stages:

1. **Reading practice (pre-training).** The model is shown a vast amount of text and plays the "guess the next word" game billions of times. Each time it guesses wrong, its internal settings are nudged slightly so it does a bit better next time. Over time it picks up grammar, facts, styles, and even patterns of reasoning — because predicting text well *requires* understanding a lot about the world.
2. **Learning to be helpful (fine-tuning).** A model that only predicts text would happily continue your question with more questions. So it gets a second round of training, with examples of good answers and feedback from people about which responses are helpful, honest and safe. This is what turns a raw text predictor into an assistant you can talk to.

<div class="detail">

**For the curious:** inside, an LLM is a huge network of numbers called **parameters** (often billions of them), arranged in a design called a **transformer**. When it reads your text, every token "looks at" the other tokens to work out what matters — a mechanism called **attention**. The output is a probability for every possible next token, exactly like the bars in the widget above. The second training stage often uses **reinforcement learning from human feedback (RLHF)** or similar methods, where the model is rewarded for responses people (or carefully written guidelines) prefer. Nobody hand-writes the model's knowledge; it emerges from the training.

</div>

## Tokens: how a model sees your words

Here's a small surprise: models don't actually read *words*. They read **tokens** — chunks of text that might be a whole short word, part of a longer word, a space plus a word, or a single punctuation mark or emoji.

Type anything you like into the box below, or try the buttons. Watch how common words stay whole while long or unusual ones get chopped into pieces.

<div data-widget="tokenizer"></div>

A handy rule of thumb: in English, a token is roughly **three-quarters of a word**, so 100 words is about 130 tokens. Long, rare words and emojis use more tokens than you'd expect.

Why should you care? Because tokens are the model's unit of *everything*:

- **Reading limits.** A model can only look at a certain number of tokens at once. This is its short-term memory, and you'll explore it in [Memory](memory.html).
- **Cost and speed.** AI services usually charge, and take time, per token read and written.
- **Odd blind spots.** Because "strawberry" might arrive as a couple of chunks rather than ten letters, models have historically stumbled on tasks like counting letters or reversing words — not because they're "dumb", but because they never saw the individual letters.

## Why it sometimes makes things up

Remember the person in the library with no window? Ask them for the title of a research paper on a niche topic, and they might give you a very convincing one — a believable title, real-sounding authors, a plausible year — that doesn't exist.

AI researchers call this **hallucination**: when a model produces something that sounds right but is false. It happens because the model's job is to write the most *plausible* continuation, not to check facts. Most of the time plausible and true line up. When the model doesn't really know, plausible can win.

Hallucinations are most likely with:

- **Specific details** — exact numbers, quotes, dates, citations, web addresses.
- **Rare or niche topics** the model saw little about during training.
- **Questions that assume something false** ("Why did Einstein win two Nobel Prizes?" — he won one).

> [!WARNING] Confident is not the same as correct
> A model's tone tells you nothing about its accuracy. It sounds just as sure when it's wrong. For anything that matters — a fact in a report, a medical or legal question, a number in a budget — check it, or ask the AI to show its source.

### The calendar problem: knowledge cutoff

There's a second, related limit. A model learns from text collected up to a certain date, called its **knowledge cutoff**. After that, its knowledge is frozen. Ask about yesterday's news, today's weather or this week's prices, and a model on its own can only guess — or tell you it doesn't know.

Modern models are much better than early ones at saying "I'm not sure" and at admitting their cutoff. But the fix that really works isn't a better memory. It's giving the model a way to **look things up** — which is exactly where agents come in.

<div class="detail">

**Why can't they just fix hallucinations?** Model makers have reduced them a lot, by training models to say "I don't know" more often and to stay closer to the information they're given. But because the core skill is *predicting likely text*, some risk remains. The most reliable fix is **grounding**: giving the model real documents or search results to work from, and asking it to quote or cite them. That way you can check the answer against its source. You'll see this in the [research agent](example-research-agent.html) example.

</div>

## It can think step by step

If a language model just predicts one word at a time, how can it solve a tricky problem?

Try this yourself: what's 17 × 24? Most people can't do it in a flash — but give yourself a scrap of paper and it's easy. 17 × 20 = 340, 17 × 4 = 68, total 408. Writing down the in-between steps makes the hard problem simple.

Language models work the same way. When a model writes out its reasoning *before* giving an answer, each step it writes becomes part of the text it reads to predict the next step. In effect, its own notes become its scrap paper. That's why asking "think it through step by step" often improves answers on math, logic and planning.

Many models today (as of 2026) do this automatically. They have a **thinking** or **reasoning** mode where they work through a problem privately — considering options, catching their own mistakes, trying again — before writing the final answer. It takes a bit longer and uses more tokens, but for hard problems the answers are noticeably better.

> [!TIP] Use it in your own prompts
> For anything tricky, ask the AI to slow down. Phrases like *"Think through this step by step before answering"* or *"List the options and their pros and cons, then recommend one"* give the model room to reason. You'll find more techniques in [Great instructions](great-instructions.html).

## Why the brain needs tools

Let's put it all together. A language model is brilliant with language and surprisingly good at reasoning. But on its own, it has four big gaps:

| On its own, a model… | So it might… | The fix |
|---|---|---|
| has knowledge frozen at its cutoff | give outdated information | 🔍 a **web search** tool |
| predicts plausible text, not checked facts | make up a detail | 📄 tools to **read real documents** and cite them |
| can be shaky at exact arithmetic | slip on a calculation | 🧮 a **calculator** or code tool |
| can only produce text | describe what to do, but not do it | 📧 📅 tools to **send, book, save and click** |

That last row is the important one. A model by itself can't send your email, open your spreadsheet or book a table. It can only *write words*. But words can be instructions — "search the web for Tokyo weather" — and if a piece of software is listening, it can carry them out and hand the result back.

That's the whole secret of agents: **the brain decides, the tools do, and the results come back for the brain to read.** You'll see this loop in action in the next chapter.

<div class="detail">

**Different models, different strengths:** as of 2026 there are many capable LLMs — for example Anthropic's Claude, OpenAI's GPT models, Google's Gemini, and open-weight models such as Meta's Llama. Some are large and very capable; others are smaller, faster and cheaper. Agent builders often choose a strong model for planning and a faster one for simple, repetitive steps. The principles in this guide apply to all of them.

</div>

## Practical habits

Knowing how the brain works gives you a few simple habits that make any AI more useful:

- **Give it the facts.** Paste in the document, email or data you're asking about, instead of relying on its memory.
- **Ask for sources.** "Where did that come from?" or "Quote the sentence that supports this" makes hallucinations easy to spot.
- **Let it think.** For hard questions, ask for step-by-step reasoning or turn on a thinking mode.
- **Check what matters.** Numbers, names, dates and anything you'll act on deserve a quick double-check.
- **Prefer tools for live info.** Use an assistant with web search (or an agent) for anything recent.

```prompt
I want to understand [topic]. Please:
1. Explain it simply, as if I'm new to it.
2. Mark anything you're unsure about with "(not certain)".
3. If this depends on recent events or facts after your knowledge cutoff, say so.
4. Suggest 2 reliable kinds of sources where I could double-check the key facts.
```

If you're using AI to study, the [study tutor](example-study-tutor.html) example shows how to turn this "brain" into a patient teacher that quizzes you instead of just giving answers.

## Quick check

```quiz
Q: At its core, what is a large language model doing when it writes an answer?
- [ ] Looking up the answer in a hidden database of facts
- [x] Repeatedly predicting a likely next piece of text
- [ ] Searching the internet and copying the best page
- [ ] Following a long list of rules written by programmers
E: An LLM generates text one token at a time by predicting what's likely to come next. It doesn't consult a fact database or the web unless it's given a tool to do so — which is why it can sound right and still be wrong.

Q: You ask an AI (with no tools) for three research papers on a niche topic. It gives titles, authors and years. What's the wisest next step?
- [ ] Trust them — the AI sounded very confident
- [ ] Ask the same question again to see if it repeats them
- [x] Check that each paper really exists before using it
- [ ] Assume they're fake and ignore everything it said
E: Specific details like citations are where hallucinations are most common, and confidence tells you nothing. Asking again doesn't verify anything. The papers might be real — so check them, rather than trusting or dismissing them blindly.

Q: Why does asking a model to "think step by step" often improve its answers?
- [ ] It makes the model search the web for each step
- [ ] It switches the model to a bigger, smarter version
- [ ] It tells the model to ignore its training data
- [x] The steps it writes become notes it can build on
E: Each reasoning step the model writes becomes part of the text it reads when predicting the next step — like using scrap paper for 17 × 24. No web search or different model is involved.
```

## What's next

You've met the brain: brilliant with words, able to reason, but unable to look things up or act on its own. Next, we'll connect it to the world with **the agent loop** — the simple think → act → observe cycle that turns a talking model into one that gets things done.
