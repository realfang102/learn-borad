---
title: "Agents on Open-Weight & Local Models"
description: "Run agents on models you host yourself: why teams do it, the open-weight landscape, how tool calling really works inside chat templates, serving stacks, constrained decoding, quantization, VRAM math, hybrid designs, fine-tuning and supply-chain security."
duration: 45
level: intermediate
objectives:
  - Weigh the real benefits of open-weight models for agents against the capability gap and operational burden
  - Explain how a self-hosted model emits tool calls through its chat template and how the server parses them
  - Serve a model behind an OpenAI-compatible endpoint and call it with tools
  - Use constrained decoding and sensible quantization to keep tool calls reliable
  - Estimate GPU memory for weights and KV cache for an agent workload
  - Design hybrid systems in which a frontier model and a local model split the work
  - Evaluate an open model on your own agent tasks and secure the model supply chain
prerequisites: [tool-use, structured-outputs, build-agent-from-scratch, agent-frameworks]
tags: [open-weight, local-models, vllm, ollama, llama-cpp, quantization, tool-calling, self-hosting, hybrid]
---

A hospital wants an agent that reads discharge notes, pulls lab values from an internal database and drafts follow-up tasks. Legal says patient text cannot leave the building. A logistics company wants to classify forty million shipping exceptions a month, and the per-token bill from a frontier API is larger than the team that would review them. A field-service app needs an assistant that works in a basement with no signal. All three end up in the same place: running an agent on a model whose weights they download and serve themselves.

That is a different job from calling a hosted API. You become responsible for things the provider used to hide: the **chat template** that turns messages into tokens, the parser that turns the model's text back into tool calls, the GPU memory budget, quantization, throughput tuning, and the safety behavior of a model you didn't train. Each of these has quietly broken real agents.

This lesson covers when to go open, the late-2026 landscape, how tool calling works under the hood, serving stacks, reliability, memory math, hybrid designs, fine-tuning, evaluation and supply-chain security. It builds on [tool use](tool-use.html), [structured outputs](structured-outputs.html) and [Build an Agent From Scratch](build-agent-from-scratch.html).

> [!WARNING] A fast-moving area
> Model releases, licenses, server flags and parser names change month to month. Everything here was checked as of November 2026. Treat specific model versions and CLI flags as perishable and verify them in current docs; the mechanisms (templates, parsers, KV cache, quantization trade-offs) are the durable part.

## Why Run Agents on Open Models?

First, vocabulary. An **open-weight model** is one whose trained parameters you can download and run. That is not the same as **open source** in the strict sense: most open-weight releases do not include training data or full training code, and many come with licenses that add use restrictions. "Open" in this lesson means "you can run it yourself."

The reasons teams choose this path:

- **Data control and privacy.** Prompts, tool results and documents never leave infrastructure you control, which can be decisive for regulated data or contracts that forbid third-party processors. (Hosted APIs also offer data-residency and zero-retention options; check whether those suffice first.)
- **Cost at scale.** API pricing is per token; your GPUs are a fixed cost you can saturate. For high-volume, narrow steps (classification, extraction, routing), a well-utilized small model can be much cheaper per task. At low or bursty volume the reverse is usually true, because idle GPUs still cost money.
- **Latency and locality.** A small model on a nearby GPU, with no network round trip or shared queue, returns short decisions quickly and predictably, which matters for voice agents and tight inner loops.
- **Customization.** Fine-tune on your tools, change the chat template, constrain decoding with a grammar, inspect logits.
- **Offline and edge.** Laptops, phones, factory floors, ships and air-gapped networks.
- **Control over change.** Hosted models get updated or retired on the provider's schedule; weights on your disk behave the same next year.

And the honest costs:

| Trade-off | What it means in practice |
|---|---|
| **Capability gap on long-horizon tasks** | As of 2026, the best open models are competitive on many short tool-use tasks, but frontier hosted models still generally lead on long, multi-step agentic work such as large refactors or recovering from their own mistakes over dozens of steps. Errors compound, so a modest per-step gap becomes a large task-level gap ([when to use agents](when-to-use-agents.html)). |
| **Operations burden** | You own GPUs, drivers, autoscaling, upgrades, monitoring, and on-call for the inference server. |
| **Integration correctness** | Tool calling depends on templates and parsers you configure. Misconfigurations fail silently. |
| **Safety tuning is your job** | The provider's runtime safety systems are absent. You add guardrails, abuse monitoring and refusal behavior yourself ([guardrails and sandboxing](guardrails-and-sandboxing.html)). |
| **License diligence** | Licenses range from Apache 2.0 and MIT to custom terms with user-count or revenue thresholds and acceptable-use policies. |

> [!KEY] Open models are a deployment choice, not a capability shortcut
> Go open when control, cost at volume, locality or customization is the binding constraint, and only after measuring that a candidate model is good enough on *your* tasks. The most common successful pattern is not "replace the frontier model" but "move the high-volume, narrow or sensitive steps to a model you host."

## The Open-Weight Landscape (Late 2026)

The field moves too fast for a ranking to survive a quarter, so think in families. Each lab releases a range of sizes, usually instruction-tuned variants with tool calling built in, often in both dense and **mixture-of-experts (MoE)** form.

| Family | Developer | Notes as of November 2026 | Typical license (check each release) |
|---|---|---|---|
| **Qwen** | Alibaba | Very wide size range, from phone-sized to large MoE; Qwen3 (2025) and Qwen3.5 (2026) generations; among the most downloaded and fine-tuned bases | Mostly Apache 2.0 |
| **DeepSeek** | DeepSeek | Large MoE models; V3 and R1 (2025) made open reasoning models mainstream; the V4 generation followed in 2026 | Mostly MIT |
| **gpt-oss** | OpenAI | gpt-oss-120b and gpt-oss-20b (August 2025), reasoning MoE models trained for tool use, using the "harmony" response format | Apache 2.0 plus a usage policy |
| **Gemma** | Google DeepMind | Gemma 4 (April 2026) in sizes from on-device to a 31B dense model; the first Gemma generation under Apache 2.0 | Apache 2.0 (Gemma 4); earlier Gemma versions used custom Gemma terms |
| **Mistral** | Mistral AI | Small, medium and large models; the Mistral 3 family | Mostly Apache 2.0; some older models used research or non-production licenses |
| **Llama / Muse** | Meta | Llama 4 (April 2025) was the last Llama-branded release. Meta's 2026 flagship launched closed, but it released Muse Glimmer, a 30B open-weight agentic model, in August 2026 | Llama: custom community license with a large-user clause. Muse Glimmer: Apache 2.0 |
| **Kimi** | Moonshot AI | Large MoE models aimed at agentic coding and tool use | Kimi K2: modified MIT (attribution for very large deployments); later releases use their own terms |
| **GLM** | Zhipu AI (Z.ai) | Strong agentic and coding-oriented MoE models | Mostly MIT; some 2026 releases use custom terms |

Others worth knowing: **MiniMax**, NVIDIA's **Nemotron**, IBM's **Granite**, Microsoft's **Phi**, and Ai2's **OLMo**, which also releases training data and code.

Three things to take from this table:

1. **Licenses differ per release, not per family.** Several labs have shipped one generation under MIT or Apache 2.0 and the next under custom terms with revenue or user thresholds. Legal review attaches to an exact model.
2. **MoE changes the arithmetic.** Memory is set by *total* parameters (all experts must be loaded); per-token speed is closer to a dense model the size of the *active* parameters.
3. **Agentic post-training is what matters.** General chat quality says little about calling tools correctly for 30 steps. Advertised tool-use training is necessary but not sufficient, which is why you [evaluate](#evaluating-before-you-switch).

## How Tool Calling Works Under the Hood

With a hosted API you send a JSON `tools` array and receive structured tool-call blocks, as if the model natively spoke JSON objects. It doesn't: a language model only reads and writes tokens. Self-hosting exposes the two translation layers the provider normally hides.

### Layer 1: the chat template

A **chat template** is a small program (usually Jinja2, shipped in the model's `tokenizer_config.json` or a separate file) that turns messages plus tool definitions into one flat string, with **special tokens** marking roles and boundaries. During post-training the model saw many examples in exactly this format, including tool calls.

Here is an illustrative rendering in the style many models use (ChatML-like role markers, with tool calls wrapped in tags, as in Qwen's templates):

```text
<|im_start|>system
You are a support agent.

# Tools
You may call one or more functions. Signatures:
<tools>
{"name": "get_order_status", "description": "Look up an order", "parameters": {...}}
</tools>
Return calls as: <tool_call>{"name": ..., "arguments": ...}</tool_call><|im_end|>
<|im_start|>user
Where is order A-1042?<|im_end|>
<|im_start|>assistant
<tool_call>
{"name": "get_order_status", "arguments": {"order_id": "A-1042"}}
</tool_call><|im_end|>
<|im_start|>user
<tool_response>
{"status": "shipped", "eta_days": 2}
</tool_response><|im_end|>
<|im_start|>assistant
```

Everything up to the final `assistant` marker is the prompt. The model then generates. If it decides to call a tool, it produces the `<tool_call>` text you see in the middle, token by token, exactly as it learned to.

Different families use different conventions. Llama 3.x emits JSON with its own header tokens; gpt-oss uses the **harmony** format, with separate channels for reasoning ("analysis") and final output; some coding models emit XML-like parameter blocks; others write Python-style calls like `get_order_status(order_id="A-1042")`.

### Layer 2: the tool-call parser

The inference server must turn the generated text back into the structured `tool_calls` field your client expects. That is the **tool-call parser**: model-specific code that recognizes the start marker, extracts the name and arguments, handles multiple calls, and (in streaming mode) does it incrementally. Reasoning models add a **reasoning parser** that separates thinking text from the final answer.

```mermaid
sequenceDiagram
    participant App as Agent app
    participant Srv as Inference server
    participant M as Model weights
    App->>Srv: messages + tools (OpenAI JSON)
    Srv->>Srv: Render chat template to tokens
    Srv->>M: Prompt tokens
    M-->>Srv: Generated text with tool-call markers
    Srv->>Srv: Tool-call parser extracts name and args
    Srv-->>App: tool_calls JSON
    App->>App: Run tool, append result
    App->>Srv: messages + tool result
```

> [!KEY] Template and parser must match the model's training
> The model only calls tools reliably in the exact format it was trained on. The server must render that format going in and parse that format coming out. A mismatch on either side breaks tool use, often without an error.

### How mismatches break agents

These failures are confusing because the server still returns HTTP 200:

- **Wrong or missing template.** A re-upload ships a template without tool support. The model never sees the tools and answers in prose.
- **Wrong parser.** The model emits a perfect `<tool_call>` block, but the parser expects another format, so the call arrives as plain text in `content` and `tool_calls` is empty.
- **Tool results rendered wrong.** The template mislabels `tool` messages, the model doesn't recognize the observation, and it calls the same tool again, looping.
- **Lost reasoning.** Reasoning models expect prior reasoning to be dropped or kept across turns in specific ways; getting it wrong degrades multi-turn tool use.
- **Parallel and streaming edge cases.** A parser handles one call but mangles two in one turn, or breaks on streamed arguments.

Debugging rule: log the **fully rendered prompt** and the **raw generated text** before parsing. If the raw text contains a well-formed call that the client didn't receive, the parser is wrong. If the raw text contains no call at all, look at the template first, then the model.

## Serving Stacks

You rarely load weights yourself in an agent. You run an **inference server** that exposes an **OpenAI-compatible** HTTP API (`/v1/chat/completions` with `tools` and `tool_calls`), so any OpenAI-style client or framework can talk to it by changing the base URL.

```mermaid
flowchart LR
    A["Agent / framework (OpenAI client)"] -->|"HTTP /v1/chat/completions"| B["API layer"]
    B --> C["Chat template render"]
    C --> D["Scheduler (continuous batching)"]
    D --> E["Engine: paged KV cache + prefix cache"]
    E --> F["GPU / CPU weights (quantized)"]
    E --> G["Constrained decoding (grammar)"]
    G --> H["Tool-call and reasoning parsers"]
    H -->|"tool_calls JSON"| A
```

| Server | Best for | Tool-calling notes |
|---|---|---|
| **vLLM** | High-throughput GPU serving in production | `--enable-auto-tool-choice` plus a model-specific `--tool-call-parser` (for example `hermes` for Qwen-style tags, `openai` for gpt-oss, Llama and Mistral parsers); custom templates via `--chat-template` |
| **SGLang** | High-throughput serving, strong prefix reuse for agent and multi-call workloads | `--tool-call-parser` with names such as `qwen`, `llama3`, `deepseekv3`, `kimi_k2`, `gpt-oss`; separate `--reasoning-parser` |
| **llama.cpp** (`llama-server`) | CPU, Apple Silicon, consumer GPUs, GGUF files, edge devices | Start with `--jinja` to use the model's template and enable tool parsing; override with `--chat-template-file`; native handlers for some families and a generic fallback |
| **Ollama** | Developer laptops and simple local deployments | Wraps llama.cpp-style inference with a model registry; OpenAI-compatible API at `http://localhost:11434/v1`; tool support depends on the model's packaged template |
| **LM Studio** | Desktop GUI for trying models | Local OpenAI-compatible server (default port 1234) |
| **TGI** (Hugging Face) | Existing deployments | In maintenance mode since late 2025; Hugging Face points new deployments to engines like vLLM and SGLang |

Commercial options (NVIDIA NIM and Dynamo, TensorRT-LLM, cloud endpoints) wrap similar engines. Hosted inference providers also serve open-weight models: open-model economics and portability without running GPUs, though not the data-control benefit.

### Calling a local server with a tool

Start a server. With vLLM and a Qwen3 model, whose templates use the Hermes-style tags shown earlier:

```bash
# GPU server (vLLM)
vllm serve Qwen/Qwen3-8B --enable-auto-tool-choice --tool-call-parser hermes

# Or on a laptop (Ollama); the OpenAI-compatible API is at localhost:11434/v1
ollama pull qwen3:8b
```

The agent loop is the same shape as any [manual loop](the-agent-loop.html); only the wire format differs (OpenAI-style `tool_calls` and `role: "tool"` messages). APIs and flags evolve, so check the current docs for your server and client.

```python
import json
from openai import OpenAI

# vLLM default port is 8000; for Ollama use http://localhost:11434/v1
client = OpenAI(base_url="http://localhost:8000/v1", api_key="not-needed")
MODEL = "Qwen/Qwen3-8B"  # the name the server registered (Ollama: "qwen3:8b")

def get_order_status(order_id: str) -> dict:
    return {"order_id": order_id, "status": "shipped", "eta_days": 2}  # stub

TOOLS = [{
    "type": "function",
    "function": {
        "name": "get_order_status",
        "description": "Look up the shipping status of one order by its ID, e.g. A-1042.",
        "parameters": {
            "type": "object",
            "properties": {"order_id": {"type": "string"}},
            "required": ["order_id"],
        },
    },
}]

messages = [
    {"role": "system", "content": "You are a support agent. Use tools for facts."},
    {"role": "user", "content": "Where is order A-1042?"},
]

for _ in range(8):  # step limit: small models loop more often
    resp = client.chat.completions.create(
        model=MODEL, messages=messages, tools=TOOLS, tool_choice="auto"
    )
    msg = resp.choices[0].message
    if not msg.tool_calls:
        print(msg.content)
        break
    messages.append(msg.model_dump(exclude_none=True))
    for call in msg.tool_calls:
        try:  # small models produce malformed arguments more often
            result = get_order_status(**json.loads(call.function.arguments))
        except (json.JSONDecodeError, TypeError) as e:
            result = {"error": f"Invalid arguments: {e}. Retry with valid JSON."}
        messages.append(
            {"role": "tool", "tool_call_id": call.id, "content": json.dumps(result)}
        )
```

Because the endpoint is OpenAI-compatible, most frameworks from [Frameworks & SDKs Compared](agent-frameworks.html) can point at it with a base-URL setting. Feature parity is not guaranteed, though: parallel calls, streaming tool arguments and `tool_choice` options vary by server and parser.

## Making Tool Calls Reliable: Constrained Decoding

With `tool_choice="auto"`, the model generates freely; nothing forces valid JSON that matches your schema. Small open models will hand you a trailing comma, a missing field or an invented parameter some fraction of the time.

**Constrained decoding** (guided or grammar-based decoding) fixes syntax at the source. At each step, the engine computes which next tokens a grammar (from a JSON Schema, regex or context-free grammar) allows and masks out all others, so the model *cannot* produce an invalid structure. The main engines:

- **Outlines**: constrained generation with JSON Schema, regex and grammars; usable as a library.
- **XGrammar** and **llguidance**: fast grammar engines that inference servers (vLLM and SGLang among them) use for structured outputs.
- **llama.cpp GBNF**: llama.cpp's grammar format. You can pass a grammar or a JSON Schema, and its tool-calling support can apply a grammar only once the model starts a tool call, so free text stays unconstrained.

Most servers expose this through the OpenAI-style `response_format` with a JSON Schema, and several apply it to tool arguments when a tool is marked strict or a specific tool is required. See [structured outputs](structured-outputs.html) for the general mechanics.

> [!WARNING] Valid is not correct
> A grammar guarantees well-formed JSON with the right fields. It does not guarantee the model chose the right tool, the right order ID, or a sensible plan. Overly tight grammars can also hurt quality, for example by forcing JSON before a reasoning model has finished thinking. Constrain the *structure*; validate the *semantics* in your tool code and return helpful errors the model can recover from.

Tactics that matter more for small models than frontier ones:

- **Fewer, simpler tools** with flat schemas and enums; overlapping tools confuse an 8B model far more ([designing tools](designing-tools.html)).
- **Retry with the error.** Return validation errors as tool results; most models self-correct.
- **Short contexts.** Smaller models degrade faster as context grows ([context engineering](context-engineering.html)).
- **Workflows over autonomy.** A fixed pipeline of small, well-scoped calls beats an open-ended loop ([workflow patterns](workflow-patterns.html)).

## Quantization and Agent Reliability

**Quantization** stores weights (and sometimes activations or the KV cache) in fewer bits than the 16-bit format models are usually trained and released in. It trades a little quality for a lot of memory and speed.

| Format / method | What it is | Typical home |
|---|---|---|
| **BF16 / FP16** | Full 16-bit weights, the reference | Datacenter GPUs |
| **FP8 / INT8** | 8-bit weights (and sometimes activations); usually very close to 16-bit quality | vLLM, SGLang, TensorRT-LLM on recent GPUs |
| **GPTQ** | Post-training 4-bit (or 3/8-bit) weight quantization using approximate second-order information | GPU serving |
| **AWQ** | Activation-aware 4-bit weight quantization that protects the most important weight channels | GPU serving |
| **GGUF** | llama.cpp's single-file model format, with many quantization types (for example `Q8_0`, `Q5_K_M`, `Q4_K_M`) | llama.cpp, Ollama, LM Studio |
| **MXFP4 / NF4** | 4-bit floating-point formats; gpt-oss ships its MoE weights in MXFP4; NF4 is used by QLoRA | Specific models and fine-tuning |

Rules of thumb:

- **8-bit is usually safe.** Quality loss is typically small.
- **4-bit is the popular sweet spot** for fitting a larger model on smaller hardware, with measurable but often acceptable loss for chat.
- **Below 4 bits**, quality drops faster, and small models suffer more than large ones.
- **A bigger model at 4-bit often beats a smaller model at 16-bit** for the same memory, but measure on your tasks.

Why agents are more sensitive than chat: quantization error shows up as slightly noisier token choices. In prose, a different word is harmless; in a tool call, it can be a wrong digit in an ID or a dropped brace, and over 30 steps small error rates compound. Aggregate benchmarks can look nearly identical while long agentic runs succeed less often. Evaluate the quantized artifact you will deploy, and check *who* quantized it: community uploads vary in calibration, template correctness and [provenance](#security-and-the-model-supply-chain).

## Memory Math: Weights and the KV Cache

GPU memory goes to three things: **weights**, the **KV cache**, and working overhead (activations, CUDA graphs, fragmentation). Agents are KV-hungry because they carry long histories of tool results.

**Weights** ≈ parameters × bytes per parameter. 16-bit is 2 bytes, 8-bit is 1, 4-bit is about 0.5 (plus a few percent for scales). For MoE, use *total* parameters.

The **KV cache** stores the attention keys and values for every token in every active sequence so they aren't recomputed each step:

```text
KV bytes per token = 2 (K and V) × layers × KV heads × head dim × bytes per element
KV total           = KV bytes per token × tokens across all concurrent sequences
```

Modern models use **grouped-query attention (GQA)**, where many query heads share a few KV heads, which shrinks this a lot. Read `num_hidden_layers`, `num_key_value_heads` and `head_dim` from the model's `config.json`. (Architectures like DeepSeek's multi-head latent attention compress the cache differently; use the engine's own estimate for those.)

> [!EXAMPLE] A worked VRAM estimate
> Take a 32B-parameter dense model with a typical GQA configuration: 64 layers, 8 KV heads, head dimension 128. You want to serve it on one 48 GB GPU for an agent whose sessions reach 32K tokens.
>
> **Weights at 4-bit:** 32B × ~0.5 bytes ≈ 16 GB, call it about 18 GB with quantization scales and unquantized layers. (At BF16 it would be about 64 GB and would not fit.)
>
> **KV per token at 16-bit:** 2 × 64 × 8 × 128 × 2 bytes = 262,144 bytes ≈ 0.26 MB.
>
> **One 32K-token session:** 32,768 × 0.26 MB ≈ 8.6 GB.
>
> **Budget:** 48 GB − 18 GB weights − ~4 GB overhead ≈ 26 GB for KV, so about **3 concurrent full-length sessions** (26 / 8.6). With an FP8 KV cache, that roughly doubles to 6. At a 128K context, a single session would need about 34 GB of KV at 16-bit and would not fit next to the weights at all.

Two lessons follow. First, **context length, not model size, often sets your concurrency** for agents. Second, advertised maximum context and *affordable* context are different numbers. Servers let you cap the context (`--max-model-len` in vLLM, `-c` in llama.cpp) and set how much GPU memory to pre-allocate; set them deliberately.

## Throughput vs Latency

Two metrics pull against each other:

- **Latency**: time to first token (TTFT) and time per output token for *one* request. This is what a single agent waiting on its next step feels.
- **Throughput**: total tokens per second across *all* requests. This is what your cost per task depends on.

The techniques that matter:

- **Continuous batching.** The scheduler adds and removes sequences at every step instead of waiting for a whole batch. Decoding is limited by memory bandwidth, so serving many sequences at once costs little extra per step, raising throughput dramatically; each request runs a bit slower when the batch is full.
- **Paged KV cache.** vLLM's **PagedAttention** stores the KV cache in fixed-size blocks, like virtual memory pages, removing most fragmentation so more sequences fit.
- **Prefix caching.** Agent calls share long prefixes: the same system prompt and tools, plus all previous steps. Reusing their cached KV cuts TTFT and compute (vLLM's automatic prefix caching, SGLang's RadixAttention). Like API prompt caching ([cost and latency](cost-and-latency.html)), it rewards keeping stable content first.
- **Speculative decoding.** A cheap **draft** (small model, extra heads or n-gram lookup) proposes several tokens; the large model verifies them in one pass and keeps the matching prefix. The output distribution is unchanged; speed improves when drafts are often right. It helps single-request latency most and less on a saturated GPU.
- **Parallelism.** Tensor parallelism splits a model across GPUs; MoE models add expert parallelism; disaggregated serving runs prefill and decode on different GPUs.

For agents, a practical tuning target is **cost per successful task at an acceptable p95 step latency**, not raw tokens per second.

## Hybrid Architectures

The most effective production designs are rarely "all local" or "all frontier." They route each step to the cheapest model that does it well enough.

```mermaid
flowchart TB
    U["Task"] --> R{"Router"}
    R -->|"Hard, open-ended"| F["Frontier model (plans, decides)"]
    R -->|"Simple, high-volume"| L["Local model"]
    R -->|"Contains PII"| P["Local model (redact / extract)"]
    F -->|"Delegates bulk step"| L
    P -->|"Redacted text"| F
    L --> O["Results"]
    F --> O
```

Common patterns:

- **Planner-executor.** The frontier model plans, decides and handles exceptions; a local model executes many cheap, well-specified steps (labeling, extraction, summarizing pages, reformatting).
- **Local filter, frontier finisher.** A local model screens or triages a large input set and escalates only the hard or ambiguous items.
- **Privacy boundary.** A local model reads sensitive documents and extracts only the fields the task needs, or redacts PII, before anything reaches a hosted API.
- **Routing and cascades.** A classifier or a cheap model's confidence decides which model handles a request, with fallback to the frontier model on failure ([workflow patterns](workflow-patterns.html)).

Here is a sketch of the planner-executor pattern. A frontier Claude model drives the agent and has one tool, `bulk_classify`, whose implementation fans a batch of tickets out to a local model with a JSON Schema constraint. The frontier model never reads all ten thousand tickets; it reads the summary and the items the local model flagged.

```python
import json
import anthropic
from openai import OpenAI

claude = anthropic.Anthropic()  # reads ANTHROPIC_API_KEY
local = OpenAI(base_url="http://localhost:8000/v1", api_key="not-needed")
LOCAL_MODEL = "Qwen/Qwen3-8B"

LABEL_SCHEMA = {
    "type": "object",
    "properties": {
        "label": {"type": "string", "enum": ["billing", "bug", "how_to", "other"]},
        "confident": {"type": "boolean"},
    },
    "required": ["label", "confident"],
    "additionalProperties": False,
}

def bulk_classify(ticket_ids: list[str]) -> str:
    counts, unsure = {}, []
    for tid in ticket_ids:
        text = load_ticket(tid)  # your data access; text stays on-prem
        r = local.chat.completions.create(
            model=LOCAL_MODEL,
            messages=[{"role": "user", "content": f"Classify this ticket:\n{text}"}],
            response_format={"type": "json_schema",
                             "json_schema": {"name": "label", "schema": LABEL_SCHEMA}},
        )
        out = json.loads(r.choices[0].message.content)
        counts[out["label"]] = counts.get(out["label"], 0) + 1
        if not out["confident"]:
            unsure.append(tid)
    return json.dumps({"counts": counts, "unsure_ids": unsure[:50]})

TOOLS = [{
    "name": "bulk_classify",
    "description": "Classify many support tickets with a local model. Returns label "
                   "counts and up to 50 IDs the classifier was unsure about.",
    "input_schema": {
        "type": "object",
        "properties": {"ticket_ids": {"type": "array", "items": {"type": "string"}}},
        "required": ["ticket_ids"],
    },
}]

def run(task: str) -> str:
    messages = [{"role": "user", "content": task}]
    while True:
        resp = claude.messages.create(
            model="claude-opus-5-5", max_tokens=16000, tools=TOOLS, messages=messages
        )
        if resp.stop_reason != "tool_use":  # end_turn, max_tokens, refusal...
            return "".join(b.text for b in resp.content if b.type == "text")
        messages.append({"role": "assistant", "content": resp.content})
        results = []
        for block in resp.content:
            if block.type == "tool_use":
                try:
                    out, err = bulk_classify(**block.input), False
                except Exception as e:  # report failures to the model
                    out, err = f"bulk_classify failed: {e}", True
                results.append({"type": "tool_result", "tool_use_id": block.id,
                                "content": out, "is_error": err})
        messages.append({"role": "user", "content": results})
```

`load_ticket` is your own data-access function. A production version would send the local calls concurrently (continuous batching rewards this), add retries, and handle `pause_turn` and `refusal` explicitly as in [Build an Agent From Scratch](build-agent-from-scratch.html). Note the data boundary: ticket text reaches only the local model; only labels and IDs reach the hosted API.

## Fine-Tuning Small Models for Your Tools

Open weights let you train the model on your exact tools. A small fine-tuned model can match or beat a much larger general model on a *narrow*, well-defined task while being faster and cheaper to serve. The usual recipe:

1. **Collect trajectories.** Run your agent with a strong frontier model (the **teacher**) on realistic tasks, logging every prompt, tool call, result and answer.
2. **Filter** to successful trajectories, judged by your graders or humans. Training on failures teaches failures.
3. **Format with the student's chat template**, so training and serving agree.
4. **Train with LoRA.** **LoRA** freezes the base weights and trains small low-rank adapters, so it fits on modest hardware; **QLoRA** does the same over a 4-bit base. Servers such as vLLM can serve several adapters on one base.
5. **Evaluate against the teacher and the base** on held-out tasks with the same harness.

This is **distillation** from the teacher's trajectories. Two cautions: several providers' terms restrict using outputs to build competing models, so check your agreement; and fine-tuning narrows a model, possibly weakening safety behavior, so re-run safety and refusal evals.

For the deeper picture (SFT, preference optimization, reinforcement learning with verifiable rewards, and the open training tooling), see [Training Agentic Models](training-agents.html).

## Evaluating Before You Switch

Public leaderboards tell you which models are worth trying. They do not tell you whether a model will run *your* agent. Before moving any step to an open model, run it through your own eval suite ([evaluating agents](evaluating-agents.html)).

Measure per candidate (model × quantization × server config, since all three change behavior):

- **Task success rate** on real tasks with your existing graders, several runs each; consistency (pass^k) matters.
- **Tool-call validity** (parses, matches schema, names a real tool), with constrained decoding on and off, plus **tool selection** and **argument accuracy** on labeled steps.
- **Recovery**: given an injected tool error, does it retry sensibly or loop?
- **Steps per success**: weaker models often take more steps, eating the cost advantage.
- **Latency** (p50, p95 per step) at expected concurrency, and **cost per successful task** including idle GPUs.
- **Safety behavior**: refusals and prompt-injection resistance, since you no longer inherit the provider's safeguards ([agent security](agent-security.html)).

> [!TIP] Shadow before you switch
> Run the open model in **shadow mode**: send it the same production inputs as the current model, log both outputs, and compare offline. You get a realistic eval set without risking users. Then canary it on a small share of traffic with automatic rollback ([deployment](deployment.html)).

Also test the integration, not just the model: multi-turn conversations with tool results, parallel tool calls, streaming, long contexts near your cap, and non-English inputs. These are where template and parser bugs live.

## Security and the Model Supply Chain

Downloading weights from the internet and running them on your GPUs is a supply-chain decision, just like adding a dependency.

- **Pickle vs safetensors.** Older PyTorch checkpoints (`.bin`, `.pt`) use Python's **pickle** format, which can execute arbitrary code when loaded. **safetensors** stores only tensors and metadata and cannot execute code. Prefer safetensors (or GGUF for llama.cpp) and refuse pickle files from sources you don't fully trust.
- **`trust_remote_code`.** Some repositories ship custom Python modeling code; loading with `trust_remote_code=True` (Transformers, and the equivalent flag in vLLM and others) runs it on your machine. Avoid it for natively supported architectures; otherwise read the code and pin a revision.
- **Provenance.** Popular models attract look-alike re-uploads, and most quantized variants come from third parties. Download from the publisher's official organization or vetted quantizers, pin by commit hash, and mirror approved artifacts internally with checksums.
- **Templates are code too.** A modified Jinja template can silently change how system prompts or tools are presented.
- **Backdoors are possible.** *Sleeper Agents* showed models can be trained to behave normally until a trigger appears, and that standard safety training may not remove this. You cannot fully audit weights, so don't grant a model more authority than untrusted code: sandboxed tools, least privilege, human approval for consequential actions ([guardrails and sandboxing](guardrails-and-sandboxing.html)).
- **The server is an attack surface.** Keep it patched, require authentication, and never expose it directly to the internet.
- **Licenses** are part of compliance: record which one each deployed artifact carries.

> [!WARNING] Local is not automatically private
> Self-hosting keeps data away from a model provider, but your own logs, traces, prompt caches and fine-tuning datasets now hold that sensitive data. Apply the same retention and access controls you would demand of a vendor ([observability](observability.html)).

## Key Takeaways

- Open-weight models are a **deployment choice** for data control, cost at volume, latency, customization or offline use; you accept the ops burden and, on long-horizon tasks, a capability gap that is still real as of 2026.
- **Licenses vary per release**, from Apache 2.0 and MIT to custom terms with user or revenue thresholds; review the exact artifact you deploy.
- Tool calling on open models is **text generation plus parsing**: the chat template renders tools into tokens, the model emits tool-call markers, and the server's parser turns them into JSON. Template or parser mismatches fail silently.
- **Constrained decoding** (Outlines, XGrammar, llguidance, GBNF) guarantees well-formed tool JSON, but not correct choices; validate semantics in code.
- **Quantization** errors compound over agent steps; 8-bit is usually safe, 4-bit is the common trade-off, and you must evaluate the quantized artifact itself.
- **KV cache memory**, driven by context length and concurrency, often limits agent serving more than model size does. Do the arithmetic before buying GPUs.
- The strongest designs are often **hybrid**: a frontier model plans and handles hard cases, local models do bulk, narrow or PII-sensitive steps.
- Treat weights like dependencies: **safetensors over pickle**, avoid `trust_remote_code`, pin revisions, verify provenance, and sandbox the agent anyway.

## Exercises

1. **Serve and call.** Serve a small instruction-tuned model with Ollama or vLLM and run the tool-calling example above. Then restart the server with tool parsing disabled (or the wrong parser) and inspect the response. How would you detect this failure in production?
2. **Do the memory math.** Pick an open model you're interested in, read its `config.json`, and compute the KV bytes per token. How many concurrent 16K-token sessions fit on a 24 GB GPU at 4-bit weights? At 8-bit? Compare with what the server reports at startup.
3. **Measure tool-call validity.** Build a set of 50 prompts that should trigger your tools. For one model, measure the share of valid, schema-conforming calls with and without constrained decoding, and at two quantization levels. Plot success against bits.
4. **Hybrid split.** In an agent you've built, move one high-volume, narrow step to a local model behind a tool, as in the hybrid sketch. Compare cost per successful task and end-to-end success against the all-frontier version.
5. **Design a supply-chain policy.** Write a one-page policy for your team covering where weights may be downloaded from, allowed file formats, `trust_remote_code`, revision pinning, license review, and the evals a model must pass before production. Which items could you enforce automatically in CI?

## Check Your Understanding

```quiz
Q: An agent on a self-hosted model never calls tools; it answers every question in prose. The server returns HTTP 200 and logs no errors. What should you check first?
- [ ] Whether the GPU has enough free memory to hold the tool schemas
- [x] Whether the rendered prompt and raw output use the tool format
- [ ] Whether the model's weights are stored in safetensors format
- [ ] Whether the client library supports streaming responses
E: Tool calling depends on the chat template rendering tools in the format the model was trained on, and a matching parser extracting calls from the output. Logging the rendered prompt and the raw generated text tells you whether the template or the parser is at fault. Memory problems cause errors or evictions, not silent prose.

Q: You serve a 4-bit model with grammar-constrained decoding for tool arguments. What does this guarantee?
- [ ] The model will pick the correct tool for each step
- [ ] Task success matches the unquantized model on agent tasks
- [x] Tool arguments will parse and conform to the schema
- [ ] The model will never call a tool when no tool is needed
E: Constrained decoding masks tokens that would violate the grammar, so the structure is always valid. It says nothing about whether the tool choice, IDs or plan are right, and it does not undo quantization loss. Validate semantics in your tool code.

Q: A model has 64 layers, 8 KV heads and head dimension 128, with a 16-bit KV cache. Roughly how much KV memory does one 32K-token session need?
- [ ] About 0.26 GB, the same as a single token at full precision
- [ ] About 64 GB, since every attention head stores its own cache
- [x] About 8.6 GB, at roughly 0.26 MB per token in total
- [ ] About 2 GB, because grouped-query attention stores only keys
E: 2 (K and V) × 64 layers × 8 KV heads × 128 × 2 bytes = 262,144 bytes per token, times 32,768 tokens ≈ 8.6 GB. GQA shrinks the cache by sharing KV heads among query heads, but both keys and values are still stored.

Q: A team wants to replace its frontier model with an open model to cut costs on a 30-step coding agent. Which evidence should most influence the decision?
- [ ] The open model's rank on a popular public chat leaderboard
- [ ] Single-turn tool-call accuracy on a public function-calling benchmark
- [x] Success and cost per success on their tasks, quantized build
- [ ] The open model's advertised maximum context length and parameter count
E: Long-horizon agent success depends on compounding per-step reliability on your tools and tasks, and the deployed quantization and server config change behavior. Public leaderboards and single-turn benchmarks are useful for shortlisting, not deciding.

Q: Which design best keeps patient records away from a hosted frontier API while still using it for planning?
- [x] A local model redacts fields, and only results reach the frontier model
- [ ] The frontier model reads records directly, under a zero-retention agreement
- [ ] Records are base64-encoded before being sent to the frontier model's context
- [ ] The frontier model is prompted to ignore any personal data it sees in records
E: A privacy boundary enforced by architecture is stronger than one enforced by instructions or encoding. Zero-retention agreements can be valid for some requirements, but they still send the data to a third party, which the requirement here rules out.

Q: Why is prefix caching especially valuable for agent workloads on a self-hosted server?
- [ ] It lets the server skip generating tool-call JSON that it has produced before
- [x] Every step re-sends the same system prompt, tools and prior steps as a prefix
- [ ] It stores each final answer, so repeated user questions skip the model entirely
- [ ] It compresses model weights, freeing GPU memory for more concurrent sessions
E: Agent calls share long, growing prefixes. Reusing their KV cache avoids recomputing them, cutting time to first token and compute. It caches attention state for input tokens, not outputs or answers, and has nothing to do with weight compression.

Q: A popular model's repository asks you to load it with trust_remote_code=True. What is the main risk?
- [ ] The weights may be quantized to fewer bits than the model card claims
- [ ] The license may be changed later without notice to downstream users
- [x] Python code from the repository runs on your machine when you load it
- [ ] The server will send prompts back to the publisher for usage analytics
E: trust_remote_code executes the repository's custom modeling code with your process's privileges. Prefer natively supported architectures, read the code when you must use it, and pin an exact revision so it cannot change under you.
```

## Further Reading

- [vLLM documentation](https://docs.vllm.ai/): serving, tool calling and parsers, structured outputs, quantization and prefix caching for the most widely used open-source inference engine.
- [Efficient Memory Management for LLM Serving with PagedAttention (Kwon et al., 2023)](https://arxiv.org/abs/2309.06180): the paper behind vLLM's paged KV cache, and a clear explanation of why KV memory limits throughput.
- [SGLang: Efficient Execution of Structured Language Model Programs (Zheng et al., 2023)](https://arxiv.org/abs/2312.07104): RadixAttention prefix reuse and fast structured generation.
- [llama.cpp on GitHub](https://github.com/ggml-org/llama.cpp): GGUF, quantization types, `llama-server`, grammars and the function-calling docs.
- [Chat templates (Hugging Face Transformers docs)](https://huggingface.co/docs/transformers/chat_templating): how templates turn messages and tools into tokens, and how to inspect them.
- [How to run gpt-oss with vLLM (OpenAI Cookbook)](https://developers.openai.com/cookbook/articles/gpt-oss/run-vllm): a concrete example of serving an open reasoning model with tool calling.
- [Fast Inference from Transformers via Speculative Decoding (Leviathan et al., 2022)](https://arxiv.org/abs/2211.17192): the core idea of draft-and-verify decoding.
- [AWQ (Lin et al., 2023)](https://arxiv.org/abs/2306.00978) and [GPTQ (Frantar et al., 2022)](https://arxiv.org/abs/2210.17323): the two most common 4-bit weight quantization methods for GPU serving.
- [Safetensors documentation](https://huggingface.co/docs/safetensors): why the format exists and how it avoids pickle's code-execution risk.
- [Sleeper Agents (Hubinger et al., 2024)](https://arxiv.org/abs/2401.05566): evidence that backdoored behavior can persist through safety training, and why provenance matters.
