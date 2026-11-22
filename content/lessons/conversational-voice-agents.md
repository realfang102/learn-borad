---
title: "Customer-Facing & Voice Agents"
description: "How customer-support and voice agents work: policies, tools, authentication and handoff; τ-bench evaluation; cascaded vs. speech-to-speech voice pipelines, latency, turn-taking, telephony, compliance and metrics."
duration: 30
level: intermediate
objectives:
  - Design a customer-support agent with policies, scoped tools, authentication and human handoff
  - Explain how τ-bench and τ²-bench measure policy adherence with simulated users and pass^k
  - Compare cascaded (VAD, STT, LLM, TTS) and speech-to-speech voice architectures
  - Break down a voice latency budget and apply streaming, endpointing and barge-in techniques
  - Describe telephony basics and compliance requirements such as recording consent and PCI
  - Choose metrics (containment, resolution, CSAT) and test with simulated callers
prerequisites: [the-agent-loop, tool-use]
tags: [customer-support, voice-agents, tau-bench, latency, telephony, compliance]
---

Customer service is where most people will first *talk* to an agent, often without thinking of it that way. A customer types "my package never arrived" into a chat widget, or calls a phone number and hears a natural voice ask for an order number. Behind it, an agent looks up the order, checks the carrier, applies the company's refund policy, issues a replacement, and either resolves the issue or hands off to a human with a summary.

These agents face constraints that internal or developer-facing agents do not. They talk to **untrusted strangers** in real time, represent a **brand**, operate under **policies** with financial and legal consequences, and, for voice, must respond within the rhythm of human conversation, where a pause of over a second already feels awkward. This lesson covers the support-agent half (policy, tools, authentication, handoff and evaluation) and then the voice half (pipelines, latency, turn-taking, telephony, compliance and metrics).

## Anatomy of a Customer-Support Agent

A support agent is the [agent loop](the-agent-loop.html) wrapped in a business process. Its components:

- **Policies and SOPs.** The company's rules: refund windows, exceptions, eligibility, what requires a supervisor. These go into the system prompt or a retrievable knowledge base. Writing policies an agent can follow is real work: human SOPs are full of ambiguity that experienced staff resolve with judgment.
- **Knowledge.** Help-center articles, product docs, past resolutions, usually behind retrieval (see [RAG and retrieval](rag-and-retrieval.html)).
- **Tools.** Read access to the CRM, orders, billing, shipping; write actions such as issuing refunds, changing addresses, rebooking flights, creating tickets.
- **Authentication.** Verifying the person is who they claim to be before revealing or changing account data.
- **Handoff.** A path to a human agent with full context, for cases outside policy, high-risk actions, or a customer who asks for a person.
- **Tone and persona.** Brand voice, empathy, de-escalation, and clarity.

> [!KEY] Policy lives in two places
> Tell the model the policy in its prompt, and **enforce** the policy in code. The prompt shapes conversation; the tool layer guarantees that a refund over the limit, or an action on an unauthenticated account, simply cannot happen. Assume the model will sometimes be persuaded or confused, and make that harmless.

### Tools, permissions and authentication

Design support tools around **least privilege** (see [designing tools](designing-tools.html)):

- Scope every tool to the authenticated customer. `get_order(order_id)` should verify that the order belongs to the session's verified customer ID; the model should never pass a customer ID it heard in conversation.
- Make write tools narrow and policy-aware: `issue_refund(order_id, reason)` that enforces limits server-side, not `update_database(sql)`.
- Gate identity: until verification succeeds (a one-time code, account login, or verified caller ID plus knowledge factors), only expose tools that reveal nothing sensitive.

Here is a compact sketch with the Anthropic SDK's tool runner. The harness holds the session state, so authentication and refund limits are enforced regardless of what the model is talked into.

```python
import anthropic
from anthropic import beta_tool

session = {"customer_id": None, "handoff": None}  # trusted state, owned by the harness
REFUND_LIMIT = 100.00

@beta_tool
def verify_identity(email: str, code: str) -> str:
    """Verify the customer with the one-time code sent to their email.

    Args:
        email: Email address on the account.
        code: Six-digit code the customer received.
    """
    customer_id = auth_service.check_code(email, code)  # your auth backend
    if not customer_id:
        return "Verification failed. Ask the customer to re-check the code."
    session["customer_id"] = customer_id
    return "Verified."

@beta_tool
def issue_refund(order_id: str, amount: float, reason: str) -> str:
    """Refund an order for the verified customer, within policy limits.

    Args:
        order_id: The order to refund.
        amount: Refund amount in USD.
        reason: Short reason, e.g. "item never delivered".
    """
    if session["customer_id"] is None:
        return "Error: customer not verified. Verify identity first."
    order = orders.get(order_id)  # your order service
    if order is None or order.customer_id != session["customer_id"]:
        return "Error: order not found on this account."
    if amount > min(order.total, REFUND_LIMIT):
        return "Error: amount exceeds policy. Offer transfer_to_human for review."
    return refunds.create(order_id, amount, reason)

@beta_tool
def transfer_to_human(summary: str) -> str:
    """Hand the conversation to a human agent with a summary of the case.

    Args:
        summary: What the customer wants, what was verified and what was tried.
    """
    session["handoff"] = summary  # routed to the human queue by the harness
    return "Transfer requested. Tell the customer a specialist will join shortly."

client = anthropic.Anthropic()
runner = client.beta.messages.tool_runner(
    model="claude-sonnet-5-5",  # faster/cheaper tier suits high-volume support
    max_tokens=16000,
    system=open("support_policy.md").read(),  # persona, policies, escalation rules
    tools=[verify_identity, issue_refund, transfer_to_human],
    messages=[{"role": "user", "content": "My order A1234 never showed up. I want my money back."}],
)
for message in runner:
    ...  # stream text to the chat UI; stop when session["handoff"] is set
```

### Handoff to humans

Good escalation is a feature, not a failure. Escalate when:

- The request is outside policy, or policy is ambiguous for this case
- The action is high-risk (large refunds, account closure, legal threats, safety issues)
- The customer is distressed, angry after repeated attempts, or explicitly asks for a human
- The agent is looping or its confidence is low

The handoff must carry **context**: a summary, verification status, what was tried, and the transcript, so the customer never has to repeat themselves. A smooth handoff often scores better on satisfaction than a forced, wrong automated resolution. See [human-in-the-loop](human-in-the-loop.html).

> [!WARNING]
> Companies are accountable for what their agents say. In *Moffatt v. Air Canada* (2024), a Canadian tribunal held the airline liable after its website chatbot gave a customer incorrect information about bereavement fares, rejecting the argument that the chatbot was responsible for its own statements. Ground answers in current policy documents and enforce commitments in tools.

### Conversation design

Correct agents can still converse badly. Principles:

- **One question at a time**, especially in voice. Do not ask for order number, email and reason in one breath.
- **Confirm before consequential actions**: "I'll refund $42.10 to your Visa ending 4417. Shall I go ahead?"
- **Acknowledge, then act.** Brief empathy ("Sorry about the missing package") followed by concrete progress, not paragraphs of apology.
- **Say what you can do**, not only what you cannot. Offer alternatives when policy says no.
- **Repair gracefully.** When the agent misunderstands, recover without blaming the user, and escalate after repeated failures.
- **Stay on task.** Politely decline off-topic requests and resist attempts to make the agent say off-brand things (see [guardrails and sandboxing](guardrails-and-sandboxing.html)).

## Evaluating Support Agents: τ-bench and τ²-bench

How do you test an agent whose job is to follow policy while talking to unpredictable humans? **τ-bench** (Yao et al., Sierra, 2024) introduced a now-standard recipe:

- **Domains** with realistic databases, tools and written policies: retail (returns, exchanges, address changes) and airline (bookings, changes, cancellations, baggage).
- A **simulated user**: an LLM given a persona and a hidden goal ("you want to exchange the blue shoes for size 10, but only if it costs nothing extra") that converses with the agent naturally, revealing information gradually.
- **Outcome-based grading**: after the conversation, the final database state is compared with the expected state. Did the right exchange happen, with nothing else changed? Required information conveyed to the user is checked too.
- **pass^k**: the probability that the agent succeeds on *all* k independent trials of the same task. Where pass@k rewards succeeding at least once, pass^k measures **consistency**, which is what a business with millions of conversations needs.

The original paper found that even strong function-calling agents of 2024 solved under half of the tasks, and that reliability collapsed as k grew: in retail, pass^8 fell below 25%. An agent that handles a refund correctly 70% of the time handles it correctly eight times in a row far less often. (The interactive pass@k vs. pass^k widget in [evaluating agents](evaluating-agents.html) makes this visceral.)

**τ²-bench** (2025) added a **dual-control** setting with a telecom troubleshooting domain: the *user* also has tools and must take actions on their own device ("toggle airplane mode", "check APN settings") under the agent's guidance. Agents performed markedly worse when they had to guide a user through actions rather than act alone, a realistic picture of tech support, where much of the work is coaching a person.

> [!TIP] Build your own τ-bench
> The recipe generalizes: write 50–200 scenarios from real tickets, each with a persona, hidden goal and expected end state; run a simulated customer against your agent; grade the resulting database state and policy compliance; repeat each scenario several times and track pass^k. This catches policy regressions before customers do.

## Voice Agents: Two Architectures

Voice adds a physical constraint: time. Text users tolerate a few seconds; on a call, silence over a second or so feels broken. Studies of conversation across languages (Stivers et al., 2009) found typical gaps between turns of around 200 milliseconds. Agents cannot match that yet, but they must get close enough to feel natural.

### Cascaded pipeline

The classic architecture chains specialized components:

```mermaid
flowchart LR
    A["Caller audio (WebRTC or phone)"] --> V["VAD: is someone speaking?"]
    V --> S["STT: streaming transcription"]
    S --> E["Endpointing: has the user finished?"]
    E --> L["LLM: reasoning and tool calls"]
    L --> T["TTS: streaming speech"]
    T --> O["Audio back to caller"]
    V -. "user speaks over agent" .-> B["Barge-in: stop TTS, flush"]
    B -.-> O
```

- **VAD (voice activity detection)** detects speech versus silence or noise (Silero VAD is a common open-source choice).
- **STT (speech-to-text / ASR)** transcribes audio, ideally streaming partial transcripts as the user speaks.
- **Endpointing / turn detection** decides when the user has finished their turn.
- **LLM** generates the response and calls tools.
- **TTS (text-to-speech)** turns the response into audio, ideally streaming from the first words.

Strengths: you can choose best-in-class components, inspect the text at every stage, use any text LLM with full tool calling, and apply text guardrails and logging. Weaknesses: latency adds up across stages, and paralinguistic information (tone, hesitation, emotion, laughter) is lost in transcription.

### Speech-to-speech (realtime) models

**Speech-to-speech** models take audio in and produce audio out directly, with a single model handling understanding and generation. OpenAI's Realtime API (launched October 2024, with the `gpt-realtime` model in 2025) and Google's Gemini Live API are prominent examples, and research systems such as Kyutai's Moshi explored **full-duplex** models that listen and speak simultaneously.

Strengths: lower latency, more natural prosody, and awareness of tone and interruptions. Weaknesses: less control and observability (you can transcribe, but the model reasons over audio), typically weaker tool-calling and instruction-following than the best text models, fewer choices of voice and vendor, and harder guardrails because there is no text checkpoint before speech.

| | Cascaded (VAD → STT → LLM → TTS) | Speech-to-speech |
|---|---|---|
| Latency | Higher; sum of stages | Lower |
| Naturalness | Good with modern TTS; loses user tone | Best; hears and produces prosody |
| Control and debugging | High; text at every stage | Lower |
| Reasoning and tools | Best available text models | Improving, usually behind text frontier |
| Guardrails | Check text before speaking | Harder; output is already audio |
| Vendor flexibility | Mix and match | Tied to model provider |

As of 2026, many production systems with complex tool use and strict policies remain cascaded or hybrid, while speech-to-speech is growing fastest where naturalness matters most. Both are improving quickly; measure on your own calls.

## The Latency Budget

The key metric is **voice-to-voice latency**: from when the user stops speaking to when they hear the agent's first audio. Practitioners commonly target well under a second. Here is where time goes in a cascaded pipeline, with **illustrative** ranges (your numbers depend on vendors, regions and configuration, so measure them):

| Stage | Illustrative range | Notes |
|---|---|---|
| Endpointing wait | 200–800 ms | Silence threshold before deciding the turn ended; often the biggest single item |
| STT finalization | 100–300 ms | Streaming STT keeps this small |
| LLM time to first token | 200–1,000 ms | Model size, prompt length, thinking effort, cache hits |
| TTS time to first audio | 100–300 ms | Streaming TTS starts on the first sentence fragment |
| Network and telephony | 50–300 ms | Hops between services, regions, phone network |
| Tool calls | 0 to several seconds | Slow backends dominate when present |

Techniques that reduce perceived latency:

- **Stream everything.** STT streams partial transcripts; the LLM streams tokens; TTS starts speaking the first clause while the rest is generated. Never wait for a full response before speaking.
- **Smarter endpointing.** Instead of a fixed silence timeout, use a **semantic turn-detection** model that looks at the transcript ("my order number is..." is clearly unfinished) and audio cues. This lets you use short timeouts when the user is clearly done and long ones mid-thought.
- **Fast models and short prompts.** Use a faster model tier for the conversational loop, low thinking effort, and [prompt caching](cost-and-latency.html) for the long, stable system prompt. Escalate to slower reasoning only when needed.
- **Co-locate services** in the same region as each other and the telephony provider.
- **Fill tool latency.** Say "Let me pull that up" while a slow lookup runs, or start the lookup speculatively when the order number is heard.

## Turn-Taking, Endpointing and Barge-In

Human conversation is full of overlaps, backchannels ("mm-hmm") and interruptions. Voice agents must handle:

- **Endpointing errors.** Too eager, and the agent interrupts a user pausing to find their card. Too slow, and every exchange has dead air. Tune per use case: reading out long numbers needs patience.
- **Barge-in.** When the user starts speaking while the agent is talking, the agent should stop promptly, discard unspoken audio, and listen. The conversation history must record **only what was actually spoken**, not the full generated text, or the model will believe it said things the user never heard.
- **False barge-in.** Coughs, background TV, or backchannels ("uh-huh") should not stop the agent. Echo cancellation keeps the agent from hearing itself.
- **Silence handling.** Prompt gently ("Are you still there?"), then end gracefully.

```text
Agent (speaking): "I can refund the full amount of forty-two dollars and ten cents to the card ending—"
User (interrupts): "No, wait, put it on store credit."
[VAD fires -> TTS stopped -> unspoken audio flushed]
[History records agent turn as: "I can refund the full amount of forty-two dollars and ten cents to the card ending" (truncated)]
Agent: "Sure, store credit instead. That's $42.10 as store credit to your account. Shall I go ahead?"
```

## Telephony Basics

Many voice agents answer phone numbers, which brings in the telephone network:

- **PSTN** (public switched telephone network) is the traditional phone system. Calls reach your software through a provider (such as Twilio, Telnyx or Vonage) over **SIP** (Session Initiation Protocol) trunks, or through the provider's media-streaming APIs that deliver call audio over WebSockets.
- Phone audio is typically **narrowband** (8 kHz, G.711 codec), noticeably worse than app audio, which hurts STT accuracy. Choose STT models tuned for telephony.
- **DTMF** (keypad tones) is still useful for entering numbers privately, such as card details or PINs.
- **Transfers** to human agents use SIP transfer or the contact-center platform's routing, ideally with the summary attached.
- In-app and web voice usually use **WebRTC**, which gives wideband audio, built-in echo cancellation and lower latency.

### Frameworks

You rarely build this plumbing from scratch:

- **LiveKit Agents**: an open-source framework on LiveKit's WebRTC infrastructure, with plugins for STT, LLM, TTS and realtime models, turn detection, and telephony via SIP.
- **Pipecat**: an open-source Python framework (originated at Daily) that models a voice agent as a pipeline of frame processors, with many vendor integrations.
- Hosted platforms (for example Vapi and Retell) trade control for speed of setup.

APIs evolve quickly; check current documentation.

## Persona and Brand Voice

Voice agents *are* the brand on the phone. Decide deliberately:

- **Persona**: name (or none), formality, warmth, humor (usually minimal). Be honest that it is an AI; many jurisdictions require it.
- **Voice selection**: a TTS voice matching the brand and audience, with consistent pronunciation of product names (use pronunciation dictionaries or phonetic hints).
- **Spoken style**: write for the ear. Short sentences, no bullet lists or URLs read aloud, numbers formatted for speech ("forty-two dollars and ten cents"), and confirmations of critical details by reading them back.

## Guardrails and Compliance

Customer-facing agents operate under real regulation. The major areas (not legal advice; consult counsel for your jurisdictions):

- **Recording and transcription consent.** Some US states require all parties to consent to recording; the EU's GDPR governs processing of voice data. Disclose recording at the start of calls.
- **AI disclosure.** Several laws require telling people they are interacting with an AI, for example California's bot-disclosure law in certain contexts and the EU AI Act's transparency obligations. In the US, the FCC ruled in February 2024 that AI-generated voices in robocalls count as "artificial" under the TCPA, so outbound AI calls need prior consent.
- **Payment data (PCI DSS).** Card numbers must not end up in transcripts, LLM prompts, or logs. Use DTMF masking, secure payment handoffs (pause recording and route card entry to a PCI-compliant IVR or payment page) and redaction.
- **Privacy and retention.** Minimize data passed to models, redact PII in logs, set retention periods, and know where data is processed.
- **Content guardrails.** Topic restrictions, refusal of harmful requests, no medical, legal or financial advice beyond policy, and protection against prompt injection and jailbreaks from users (see [agent security](agent-security.html)).
- **Vulnerable customers.** Detect distress, mentions of self-harm, or confusion, and route to humans.

## Testing With Simulated Callers

Manual test calls do not scale. Mature teams use **simulated callers**: LLM-driven personas that call the agent (through the real voice stack, or text-only for fast iteration) with scripted goals and behaviors such as an impatient customer, a heavy accent, background noise, interruptions, a caller who changes their mind, or one who tries to social-engineer a refund. Each simulated call is graded on outcome (correct end state), policy adherence, latency percentiles and conversation quality, often by an [LLM judge](evaluating-agents.html).

Combine this with **production monitoring**: sample real calls for review, track p50 and p95 latency, and alert on spikes in escalations or negative sentiment (see [observability](observability.html)).

## Metrics That Matter

| Metric | What it measures | Watch out for |
|---|---|---|
| **Containment rate** | Share of conversations handled without a human | Can be gamed by making escalation hard; high containment with low resolution is a failure |
| **Resolution rate** (first-contact resolution) | Issues actually solved, ideally without repeat contact | Requires follow-up tracking (did they call back within a week?) |
| **CSAT** | Customer satisfaction from post-interaction surveys | Low response rates and selection bias |
| **Escalation quality** | Whether handoffs carry complete context and happen at the right time | Hard to measure without human review |
| **Average handle time** | Duration of conversations | Shorter is not always better |
| **Policy violation rate** | Actions or statements outside policy | Needs audits and automated checks |
| **Latency (p50/p95)** | Voice-to-voice response time | Tail latency drives perceived quality |

> [!KEY] Optimize for resolution, not deflection
> The trap in support automation is optimizing **containment**, which counts customers who did not reach a human, instead of **resolution**, which counts customers whose problem was solved. Agents that trap customers in loops look great on containment and destroy trust. Make escalation easy and measure outcomes.

Most mature deployments are hybrids: AI handles high-volume routine contacts, and humans handle complex, emotional or high-value ones (see [agent use cases](agent-use-cases.html)).

## Key Takeaways

- Support agents combine **policies, scoped tools, authentication, handoff and tone**. State policy in the prompt and **enforce it in the tool layer**.
- **τ-bench** evaluates policy adherence with simulated users and end-state checks; **pass^k** measures consistency, which drops sharply as k grows. **τ²-bench** adds dual control, where users act too.
- Voice agents use either a **cascaded pipeline** (VAD → STT → LLM → TTS), which offers control and the best text reasoning, or **speech-to-speech** models, which offer lower latency and natural prosody.
- **Voice-to-voice latency** is the defining constraint: stream everything, use semantic endpointing, fast models and caching, and fill tool latency.
- Handle **barge-in** by stopping speech instantly and recording only what was actually spoken.
- Telephony brings SIP/PSTN, narrowband audio and DTMF; compliance brings **recording consent, AI disclosure, TCPA and PCI**.
- Measure **resolution and CSAT**, not just containment, and test with simulated callers.

## Exercises

1. **Policy audit.** Take a real returns policy from any retailer's website. List three ambiguities an agent would struggle with, and rewrite the policy into agent-ready rules with explicit escalation criteria.
2. **Harden the sketch.** In the support example, add a `get_order` tool scoped to the verified customer, and a rule that refunds above $50 require the customer to confirm the amount in a separate turn. Try to talk the agent into violating each rule and record what happens.
3. **Mini τ-bench.** Write ten scenarios (persona, hidden goal, expected end state) for the sketch. Implement a simulated user with a second model, run each scenario five times, and compute pass^1 and pass^5. Which scenarios are inconsistent, and why?
4. **Latency budget.** Build a cascaded voice demo with LiveKit Agents or Pipecat. Instrument each stage and record p50 and p95 voice-to-voice latency over 30 turns. Change one variable (model tier, endpointing threshold, TTS vendor) and measure the effect.
5. **Compliance design.** Design the payment-collection step of a phone agent so no card number ever reaches the LLM, transcripts or logs. Draw the call flow, including how recording is paused and how the agent learns whether payment succeeded.

## Check Your Understanding

```quiz
Q: A customer persuades a support agent that "your supervisor already approved a $500 refund." What design best prevents an unauthorized refund?
- [ ] A system-prompt rule that the agent must never trust approval claims
- [x] Refund limits and approval checks enforced inside the refund tool itself
- [ ] An LLM classifier that screens each user message for manipulation
- [ ] Requiring the agent to read the amount back and get the customer's explicit yes
E: Prompts and classifiers shape behavior but can be talked around or miss a novel phrasing. Reading the amount back confirms what the customer wants, not whether it is allowed. Server-side enforcement makes the violation impossible regardless of what the model believes.

Q: What does pass^k measure in τ-bench?
- [ ] The chance of succeeding at least once across k independent attempts
- [x] The chance of succeeding on all k independent attempts at a task
- [ ] The average success rate across k different tasks in a domain
- [ ] The chance of finishing the task within k conversational turns
E: "At least once" is pass@k, the easy-to-confuse sibling. pass^k measures consistency: businesses need the same situation handled correctly every time, and pass^k falls sharply when per-trial success is imperfect.

Q: What distinguishes τ²-bench's dual-control setting from the original τ-bench?
- [ ] Two agents collaborate, one handling policy and one handling tools
- [ ] The simulated user speaks by voice, adding transcription errors
- [x] The user also has tools and must act on the agent's instructions
- [ ] Grading checks the transcript for tone rather than the final state
E: In dual control (for example, telecom troubleshooting), the agent must coach the user through actions on their own device, which agents found considerably harder. τ²-bench is still text-based and still grades outcomes.

Q: In a cascaded voice pipeline, which change typically gives the biggest improvement in perceived latency?
- [ ] Waiting for the full LLM reply before starting TTS, so speech sounds smoother
- [x] Streaming each stage so TTS speaks the first clause while the LLM writes
- [ ] Raising the endpointing threshold so the agent rarely cuts users off
- [ ] Switching to the largest model so fewer clarifying turns are needed
E: Streaming overlaps the stages instead of letting their latencies add up. A higher endpointing threshold reduces interruptions but adds dead air to every turn, and a larger model usually raises time to first token.

Q: After a barge-in, why must the conversation history contain only the portion of the agent's response that was actually spoken?
- [ ] To save context tokens on long calls with frequent interruptions
- [x] Otherwise the model assumes the user heard details they never heard
- [ ] So the transcript matches the call recording exactly for compliance audits
- [ ] So the TTS engine can resume the sentence where it was cut off
E: The model's view of the conversation must match reality. If it thinks it already read out the refund details, it may skip confirming them. Matching the recording is a side benefit, not the reason, and resuming the old sentence is usually the wrong move after an interruption.

Q: A team reports 85% containment for its new support agent but CSAT has fallen and repeat contacts have risen. What is the most likely explanation?
- [ ] The agent resolves issues too fast, so customers feel rushed
- [x] The agent blocks escalation without actually resolving the issues
- [ ] Customers reaching the agent are a harder mix than before launch
- [ ] CSAT surveys now reach only those customers whose issues were escalated
E: Containment counts conversations that did not reach a human, not problems solved. Rising repeat contacts are the giveaway: customers come back because the issue was never fixed. Measure resolution and make escalation easy.

Q: Which approach keeps card numbers out of an LLM-based phone agent's transcripts and prompts?
- [ ] Prompting the model never to repeat or store any card numbers
- [ ] Redacting card numbers from the transcripts after each call ends
- [x] DTMF or a secure IVR handoff, returning only a success flag
- [ ] A speech-to-speech model, so no text transcript is ever created
E: Post-call redaction is too late: the number already passed through STT and the LLM prompt. A speech-to-speech model still receives the audio. The safe design never lets the data enter the agent's context or logs; the agent only learns whether payment succeeded.
```

## Further Reading

- [τ-bench: A Benchmark for Tool-Agent-User Interaction in Real-World Domains (Yao et al., 2024)](https://arxiv.org/abs/2406.12045) — simulated users, policy documents, end-state grading and pass^k.
- [τ²-Bench: Evaluating Conversational Agents in a Dual-Control Environment (Barres et al., 2025)](https://arxiv.org/abs/2506.07982) — extends τ-bench to settings where users act on their own devices.
- [Universals and cultural variation in turn-taking in conversation (Stivers et al., PNAS 2009)](https://www.pnas.org/doi/10.1073/pnas.0903616106) — the cross-language study behind the roughly 200 ms turn-gap figure.
- [LiveKit Agents documentation](https://docs.livekit.io/agents/) — a production framework for realtime voice agents, including turn detection and telephony.
- [Pipecat (GitHub)](https://github.com/pipecat-ai/pipecat) — open-source pipeline framework for voice and multimodal agents.
- [OpenAI Realtime API guide](https://platform.openai.com/docs/guides/realtime) — speech-to-speech interaction, sessions and turn detection.
- [Building effective agents (Anthropic, 2024)](https://www.anthropic.com/engineering/building-effective-agents) — includes customer support as a canonical agent use case and why tool design matters.
