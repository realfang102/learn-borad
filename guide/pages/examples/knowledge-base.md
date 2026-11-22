---
title: "The company knowledge-base agent"
emoji: "📚"
subtitle: "An agent answers an HR question from company documents, with sources, and admits gaps."
category: "Productivity"
level: "Intermediate"
concepts: [memory, tools, reliable-agents, agents-at-work]
sim: knowledge-base
---

A **knowledge-base agent** searches your company's handbooks and policy pages, then answers in plain words with links to its sources. The model never learned your company's rules, so it **looks things up first**, an approach called **retrieval-augmented generation (RAG)**; watch Jordan ask a two-part question the documents only half answer.

<div class="sim" data-sim="knowledge-base"></div>

> [!TRY] Compare the two searches
> Compare the relevance bars of both searches, and watch what the agent does with weak matches.

## How it works

<div class="steps-strip">
<div><strong>Split the question</strong>Two topics means two separate searches.</div>
<div><strong>Search with permissions</strong>Only documents this person may see.</div>
<div><strong>Read the passages</strong>Check the actual text, not just titles.</div>
<div><strong>Resolve conflicts</strong>When documents disagree, find the current one.</div>
<div><strong>Answer with citations</strong>Say where each fact came from.</div>
<div><strong>Admit gaps</strong>"I don't know, ask HR" beats guessing.</div>
</div>

Search works by **meaning**: passages and question become lists of numbers (**embeddings**), so "carry over" found a section titled "Unused leave", and the **relevance score** shows how close each match is. When two documents disagreed, the agent checked which was current instead of averaging or guessing, because old documents that stay searchable are one of the most common causes of wrong answers.

<div class="detail">

**The real technology, as of 2026.** A typical setup has two parts. First, **indexing**: documents from shared drives, wikis and HR systems are split into short passages ("chunks"), each turned into an embedding and stored in a **vector database**, which quickly finds passages with similar meaning. Most systems add ordinary keyword search (**hybrid search**), because exact terms like policy numbers matter too, and a second model often **re-ranks** the top results.

Second, the **agent**. Early "RAG chatbots" ran one search and answered from whatever came back; agentic versions treat search as a [tool](tools.html) to use several times: splitting questions, rephrasing, reading full sections and checking document details. Products include Microsoft 365 Copilot, Glean, Google's Gemini Enterprise, and the company-knowledge features in ChatGPT and Claude that connect to Google Drive, SharePoint and Slack. All need **permission-aware search**: the agent sees only what the asker may see.

</div>

## Why this works

- **Answers come from your documents,** not the model's memory, so they're specific and less likely to be invented.
- **Citations make checking easy:** one click shows the exact passage.
- **It respects access rules:** a restricted document never appeared in Jordan's results.
- **It improves the knowledge base:** flagging the outdated handbook spares the next person.

> [!WARNING] What can go wrong
> - **Outdated documents.** Old versions that stay searchable get quoted. Someone must own and tidy them.
> - **Filling gaps with guesses.** Low relevance scores should trigger "I don't know", not a plausible answer.
> - **Leaking private information.** Search that ignores permissions exposes salaries and reviews; see [staying safe](staying-safe.html).

## Try it yourself

Attach or paste the documents into a capable AI assistant, then use:

```prompt
Answer using ONLY these documents: [attach, e.g. our team handbook and the 2026 travel policy].
My question: [your question].
- Cite the document and section after each fact.
- If documents disagree, say which looks newer or official, and why.
- If they don't cover part of my question, say "The documents don't cover this". Don't fill gaps from general knowledge.
```

```prompt
Here are my notes on [topic]: [paste notes]. Quiz me with 5 questions answerable from these notes only.
After each answer, tell me if I'm right and quote the line that proves it.
```

## Quick check

```quiz
Q: Why does a knowledge-base agent search documents instead of answering from its training?
- [ ] Searching documents is always faster than answering from memory
- [x] The model was never trained on the company's private policies
- [ ] Company rules forbid AI models from using their training at work
- [ ] Search results are always correct, so they never need checking
E: A language model learns from public text, not your handbook. Retrieval brings in the right passages at question time, so the answer can be specific and cited.

Q: Two documents gave different carry-over rules. What did the agent do?
- [ ] Averaged the two rules and told Jordan it was about 7 days
- [ ] Used whichever document had the higher relevance score
- [x] Checked which one was current and used that one
- [ ] Gave Jordan both rules and let them pick the one they liked
E: The higher-scoring result happened to be right, but relevance measures how well text matches, not whether it's current. Checking status and dates settled it.

Q: The second search only found weak matches. What was the right response?
- [ ] Answer from the travel policy anyway, since it was the closest match
- [x] Say the documents don't cover it and point Jordan to HR
- [ ] Search the public internet for Portugal's remote-work rules instead
- [ ] Keep rephrasing the search over and over until a strong match appears
E: Weak matches signal the answer isn't there. Working abroad involves tax and visa rules, so a guess could cause real problems; "I don't know, ask HR" is the helpful answer.
```
