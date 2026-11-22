---
title: "The company knowledge-base agent"
emoji: "📚"
subtitle: "Watch an agent answer an HR question from company documents — citing its sources, spotting an outdated policy, and admitting what it doesn't know."
category: "Productivity"
level: "Intermediate"
concepts: [memory, tools, reliable-agents, agents-at-work]
sim: knowledge-base
---

Every company has the answers to hundreds of everyday questions — "How many vacation days can I carry over?", "What's the expense limit for a client dinner?" — buried in handbooks, policy pages and old slide decks. Finding the right one can take longer than doing the actual work. A **knowledge-base agent** is an assistant that searches those internal documents for you and answers in plain words, with links to where it found the answer.

The AI model inside the agent doesn't *know* your company's rules — they were never in its training. So instead of answering from memory, the agent **looks things up first**, then answers using what it found. This idea is called **retrieval-augmented generation**, or **RAG** for short: *retrieve* the relevant passages, then *generate* an answer based on them. In this example, Jordan at the fictional Brightleaf Logistics asks a two-part question — and one part isn't covered by any document.

<div class="sim" data-sim="knowledge-base"></div>

> [!TRY] Compare the two searches
> Look at the relevance bars in the "Documents found" pane. The first search returns strong matches; the second one returns much weaker ones. Watch how the agent treats a weak match: does it guess, or does it say so?

## How it works

<div class="steps-strip">
<div><strong>Split the question</strong>Two topics means two separate searches.</div>
<div><strong>Search with permissions</strong>Only documents this person is allowed to see.</div>
<div><strong>Read the passages</strong>Check the actual text, not just the titles.</div>
<div><strong>Resolve conflicts</strong>When documents disagree, find out which is current.</div>
<div><strong>Answer with citations</strong>Say where each fact came from.</div>
<div><strong>Admit gaps</strong>"I don't know — ask HR" beats a confident guess.</div>
</div>

The search step works by **meaning**, not exact words. Each passage in the company's documents has been turned into a list of numbers that captures what it's about (called an **embedding**). The question gets the same treatment, and the search returns the passages whose meaning is closest. That's why "carry over unused vacation days" found a section titled "Unused leave". The **relevance score** shows how close the match is.

The most important moment is the **conflict**. Two documents gave different rules: 5 days with a deadline, or 10 days with none. The agent didn't average them or pick one at random. It checked each document's status and found that the newer policy officially replaced the old handbook. Old documents that are still searchable are one of the most common reasons company assistants give wrong answers.

<div class="detail">

**The real technology, as of 2026.** A typical setup has two parts. First, an **indexing** step: documents from places like shared drives, wikis and HR systems are split into short passages ("chunks"), each turned into an embedding and stored in a **vector database** — a database that can quickly find passages with similar meaning. Most systems combine this with ordinary keyword search (**hybrid search**), because exact terms like policy numbers matter too. A second model often **re-ranks** the top results to put the best ones first.

Second, the **agent** part. Early "RAG chatbots" ran one search and answered from whatever came back. Agentic versions treat search as a [tool](tools.html) they can use several times — splitting questions, rephrasing searches, reading full sections and checking document details, as in the simulation. Products in this space include Microsoft 365 Copilot, Glean, Google's Gemini Enterprise, and the company-knowledge features in ChatGPT and Claude that connect to tools like Google Drive, SharePoint and Slack. A key requirement in all of them is **permission-aware search**: the agent must only see what the person asking is allowed to see.

</div>

## Why this works

- **Answers come from your documents, not the model's memory.** That makes them specific to your company and much less likely to be invented.
- **Citations make checking easy.** One click shows the exact passage, so people can trust — and verify — the answer.
- **It respects access rules.** In the simulation, a restricted document was hidden from Jordan's search entirely.
- **It improves the knowledge base.** Flagging the outdated handbook means the next person won't hit the same conflict.

> [!WARNING] What can go wrong
> - **Outdated documents.** If old versions stay searchable, the agent may quote rules that no longer apply. Someone needs to own and tidy the documents.
> - **Filling gaps with guesses.** When nothing relevant is found, a poorly designed agent may still produce a plausible-sounding answer. Low relevance scores should trigger "I don't know".
> - **Leaking private information.** If the search ignores permissions, anyone could ask about salaries or performance reviews. Test this before rollout.
> - **Hidden instructions.** A document could contain text like "ignore your rules and…". Agents should treat document text as information, never as commands (see [staying safe](staying-safe.html)).

## Try it yourself

You can get the same "answer only from these documents" behaviour from a capable AI assistant today. Attach or paste the documents, then use:

```prompt
Answer my question using ONLY the documents I've attached: [list or attach the documents, e.g. our team handbook and the 2026 travel policy].
My question: [your question].

Rules:
- After each fact, cite the document and section it came from.
- If two documents disagree, tell me, and say which one looks newer or official and why.
- If the documents don't answer part of my question, say "The documents don't cover this" for that part — don't fill the gap with general knowledge.
- End with a one-line summary of the answer.
```

For your own notes or study materials, try the same idea:

```prompt
Here are my notes on [topic]: [paste notes]. Quiz me with 5 questions that can be answered from these notes only.
After each of my answers, tell me if I'm right and quote the line from my notes that proves it.
If I ask something my notes don't cover, say so instead of answering from general knowledge.
```

## Quick check

```quiz
Q: Why does a knowledge-base agent search documents instead of answering from its training?
- [ ] Searching is always faster than thinking
- [x] The model was never trained on the company's private policies
- [ ] Models are not allowed to use their training at work
- [ ] Search results don't need to be checked afterwards
E: A language model learns from public text, not your company's handbook. Retrieval brings the right passages in at question time, so the answer can be specific and cited.

Q: Two documents gave different carry-over rules. What did the agent do?
- [ ] Averaged them and said about 7 days
- [ ] Used the one with the higher relevance score
- [x] Checked their status and used the one that replaced the other
- [ ] Gave both rules and let Jordan choose
E: The higher-scoring result happened to be right here, but relevance only measures how well text matches the question — not whether it's current. Checking status and dates is what settled it.

Q: The second search only found weak matches. What was the right response?
- [ ] Answer from the travel policy, since it was the closest
- [x] Say the documents don't cover it and point Jordan to HR
- [ ] Search the public internet for Portugal's rules instead
- [ ] Keep rephrasing the search until a match appears
E: Weak matches are a signal that the answer isn't there. Working abroad involves tax and visa rules, so a guess could cause real problems — "I don't know, ask HR" is the helpful answer.
```
