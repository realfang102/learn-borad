---
title: "The AI brain inside every agent"
emoji: "🧠"
subtitle: "What a language model really is, and why it still needs tools."
minutes: 11
---

Type "Happy birthday to…" on your phone and it suggests "you". Autocomplete guesses the next word.

Now imagine an autocomplete that has read a huge slice of everything people have written. It can finish not just a sentence but an email, a plan or a piece of reasoning.

That's the brain inside every agent: a **large language model**, or **LLM**, which has learned the patterns of language from enormous amounts of text.

> [!KEY]
> A language model does one thing, over and over: **it predicts the next little piece of text.**

Answering, planning and choosing tools are all built from that single skill.

## A super-powered autocomplete

Pick a sentence start and press **Pick the next word**. Then try **Ask 5 times** at each end of the temperature slider.

<div data-widget="next-word"></div>

No answer is looked up. Every next word gets a score and one is **picked**: low temperature takes the favourite, high takes chances. That's why the same question can get different answers. A paragraph is this step repeated a few hundred times.

> [!ANALOGY]
> Picture someone who has spent years in a giant library with no phone and no window. They answer brilliantly from memory, but can't check today's news, and sometimes *misremember* while sounding completely sure.

### How does it get so good?

A model is built in two stages:

1. **Reading practice (pre-training).** It plays "guess the next word" billions of times on a vast amount of text. Each wrong guess nudges its internal settings slightly. Predicting text well *requires* knowing a lot, so it picks up grammar, facts, styles and patterns of reasoning.
2. **Learning to be helpful (fine-tuning).** A raw predictor would happily answer your question with more questions. A second round of training, with good example answers and people's feedback on what is helpful, honest and safe, turns it into an assistant.

<div class="detail">

**For the curious:** inside, an LLM is a huge network of numbers called **parameters** (often billions), arranged in a design called a **transformer**. As it reads, every token "looks at" the others to work out what matters, a mechanism called **attention**. The output is a probability for every possible next token, like the bars in the widget above. The second training stage often uses **reinforcement learning from human feedback (RLHF)** or similar methods, rewarding responses that people (or carefully written guidelines) prefer. Nobody hand-writes the model's knowledge; it emerges from training.

</div>

## Tokens: how a model reads

Models don't read *words*. They read **tokens**: chunks that might be a short word, part of a longer word, a space plus a word, or a single punctuation mark or emoji.

Type anything below, or try the buttons.

<div data-widget="tokenizer"></div>

Common words stay whole; long or rare ones get chopped up. In English, a token is roughly **three-quarters of a word**, so 100 words is about 130 tokens.

Tokens are the model's unit of everything:

- **Reading limits.** A model sees only so many tokens at once: its short-term memory, covered in [Memory](memory.html).
- **Cost and speed.** Services usually charge, and take time, per token read and written.
- **Odd blind spots.** "Strawberry" may arrive as a couple of chunks, not ten letters, so models have historically stumbled at counting letters or reversing words.

## Why it makes things up

Ask the library-dweller for a niche research paper and you may get a convincing title, authors and year, for a paper that doesn't exist.

This is **hallucination**: output that sounds right but is false. The model writes the most *plausible* continuation, not checked facts. When it doesn't know, plausible can beat true.

It's most likely with:

- **Specific details**: numbers, quotes, dates, citations, web addresses.
- **Rare or niche topics** the model saw little of in training.
- **False assumptions** ("Why did Einstein win two Nobel Prizes?" He won one.)

> [!WARNING] Confident is not correct
> A model sounds just as sure when it's wrong. For anything that matters, check it or ask for the source.

### The knowledge cutoff

A model's knowledge is frozen at its **knowledge cutoff**, the date its training text was collected. On its own, it can only guess about yesterday's news, or say it doesn't know. The real fix is a way to **look things up**, which is where agents come in.

<div class="detail">

**Why not just fix hallucinations?** Model makers have reduced them a lot by training models to say "I don't know" more often and to stay closer to the information they're given. But because the core skill is *predicting likely text*, some risk remains. The most reliable fix is **grounding**: give the model real documents or search results and ask it to quote or cite them, so you can check the answer against its source. You'll see this in the [research agent](example-research-agent.html) example.

</div>

## Thinking step by step

Try 17 × 24 in your head. Hard. On scrap paper it's easy: 17 × 20 = 340, 17 × 4 = 68, total 408.

Models work the same way. Reasoning written *before* the answer becomes text the model builds on: its own scrap paper. That's why "think it through step by step" helps with math, logic and planning.

As of 2026, many models do this automatically in a **thinking** or **reasoning** mode. It's slower and uses more tokens, but hard answers get noticeably better.

> [!TIP] Use it in your prompts
> For anything tricky, try *"Think through this step by step before answering"* or *"List the options with pros and cons, then recommend one."* More in [Great instructions](great-instructions.html).

## Why the brain needs tools

On its own, a model has four big gaps:

| On its own, a model… | So it might… | The fix |
|---|---|---|
| has knowledge frozen at its cutoff | give outdated information | a **web search** tool |
| predicts plausible text, not checked facts | make up a detail | tools to **read real documents** and cite them |
| can be shaky at exact arithmetic | slip on a calculation | a **calculator** or code tool |
| can only produce text | describe what to do, not do it | tools to **send, book, save and click** |

The last row matters most. A model can only *write words*, but words can be instructions ("search the web for Tokyo weather") that listening software carries out.

That's the secret of agents: **the brain decides, the tools do, and the results come back for the brain to read.**

<div class="detail">

**Different models, different strengths:** as of 2026 there are many capable LLMs, for example Anthropic's Claude, OpenAI's GPT models, Google's Gemini, and open-weight models such as Meta's Llama. Some are large and very capable; others are smaller, faster and cheaper. Builders often pick a strong model for planning and a faster one for simple, repetitive steps. The principles in this guide apply to all of them.

</div>

## Practical habits

- **Give it the facts.** Paste in the document or data rather than relying on memory.
- **Ask for sources.** "Quote the supporting sentence" exposes hallucinations.
- **Let it think.** Ask for step-by-step reasoning on hard questions.
- **Check what matters.** Numbers, names, dates and anything you'll act on.
- **Use tools for live info.** Web search, or an agent, for anything recent.

```prompt
I want to understand [topic]. Please:
1. Explain it simply, as if I'm new to it.
2. Mark anything you're unsure about with "(not certain)".
3. If this depends on recent events or facts after your knowledge cutoff, say so.
4. Suggest 2 reliable kinds of sources where I could double-check the key facts.
```

Studying? The [study tutor](example-study-tutor.html) turns this brain into a patient teacher that quizzes you.

## Quick check

```quiz
Q: At its core, what is a large language model doing when it writes an answer?
- [ ] Looking up the answer in a hidden database of facts
- [x] Repeatedly predicting a likely next piece of text
- [ ] Searching the internet and copying the best page
- [ ] Following a long list of rules written by programmers
E: An LLM generates text one token at a time by predicting what's likely to come next. It doesn't consult a fact database or the web unless it's given a tool to do so, which is why it can sound right and still be wrong.

Q: You ask an AI (with no tools) for three research papers on a niche topic. It gives titles, authors and years. What's the wisest next step?
- [ ] Trust them, because the AI sounded very confident
- [ ] Ask the same question again to see if it repeats them
- [x] Check that each paper really exists before using it
- [ ] Assume they're fake and ignore everything it said
E: Specific details like citations are where hallucinations are most common, and confidence tells you nothing. Asking again doesn't verify anything. The papers might be real, so check them rather than trusting or dismissing them blindly.

Q: Why does asking a model to "think step by step" often improve its answers?
- [ ] It makes the model search the web for each step
- [ ] It switches the model to a bigger, smarter version
- [ ] It tells the model to ignore its training data
- [x] The steps it writes become notes it can build on
E: Each reasoning step the model writes becomes part of the text it reads when predicting the next step, like using scrap paper for 17 × 24. No web search or different model is involved.
```

## What's next

The brain is brilliant with words but can't look things up or act alone. Next, **the agent loop**: the simple think → act → observe cycle that turns a talking model into one that gets things done.
