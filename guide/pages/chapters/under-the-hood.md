---
title: "A peek under the hood"
emoji: "🔧"
subtitle: "Messages, tool calls, a short loop of code, and the standard that plugs agents in."
minutes: 10
---

Watching an agent work can feel like magic. The surprise: the machinery is **simple**. The model is the clever part; the rest is plumbing — a few dozen lines of code passing notes. If you understand passing notes, you'll understand agents.

> [!KEY]
> The model only writes text; the harness turns that text into action.

## Model, tools, harness

> [!ANALOGY] The genius in the room
> A brilliant consultant sits in a closed room. They can't leave or use a phone — only pass notes under the door. An assistant outside reads each note ("look up tomorrow's weather in Oslo"), does it, and slides the answer back. Eventually a note says: "Here's my final answer."

That's an agent, exactly:

| Part | In the story | In real life |
|---|---|---|
| **The model** | The consultant | A large language model, like Claude, that reads and writes text |
| **The tools** | Phone, files, calculator | Functions it can use: search, send email, run code, read a file |
| **The harness** | The assistant outside | The program that talks to the model, runs tools and keeps the conversation |

The **harness** is where control lives. Every action passes through it, so it can log, block, or pause to ask you. The habits from [Staying safe](staying-safe.html) are rules the harness enforces.

## Messages and tool calls

The harness and model exchange **messages** — a running list of who said what. Each has a **role**: *user* (you, or the harness for you) or *assistant* (the model).

The harness also sends a **tool list**: each tool's name, a plain description and the inputs it needs — *"get_weather — gets current weather for a city. Needs: city name."*

When the model needs a tool, it writes a **tool call** instead of a reply: *"call get_weather with city = Oslo"*. The harness runs the real tool and sends back a **tool result**. The model reads it and decides what's next.

Press **Play** and follow "What should I wear in Oslo?" through the loop.

<div data-widget="message-flow"></div>

The whole loop fits in about 20 lines, and ends when the model replies *without* a tool call. Every agent in this guide, from the [coding agent](example-coding-agent.html) to the [research agent](example-research-agent.html), runs this pattern — just with more tools and laps.

<div class="detail">

**Reading the code line by line:** `messages` starts with your question. Inside `while True:` (repeat forever), the harness calls the model with three things: which model to use, the tool list, and all the messages so far. It appends the model's reply to the conversation. Then it checks `stop_reason` — the model's signal for *why* it stopped writing. If the reason isn't `"tool_use"`, the model is done and the loop `break`s. Otherwise, the harness finds each tool request, runs the real function with the inputs the model chose, and appends a `tool_result` message, tagged with the request's id so the model knows which result answers which call. Then round again.

One more surprise: the model has no memory between calls. **The harness re-sends the entire conversation every time.** That's why long tasks fill up the model's context window, and why the techniques in [Memory](memory.html) matter.

</div>

## The system prompt

Before your first message, the harness adds a **system prompt**: standing instructions that frame the whole conversation — the agent's job description and house rules.

```text
You are the support assistant for Willow & Pine, a small online furniture shop.
Be friendly and brief. Use the order_lookup tool to check orders before answering.
You may offer refunds up to $50. For anything larger, hand over to a human.
Never share one customer's details with another customer.
```

That's how one model becomes a careful coding assistant in one app and a cheerful travel planner in another. Real ones are often much longer.

"Custom instructions" or "project instructions" in chat apps are your personal system prompt — [Giving great instructions](great-instructions.html) applies.

## MCP: "USB-C for AI"

Every AI app wanted every service — email, calendars, files, databases. Ten apps times a hundred services meant a thousand custom connectors.

> [!ANALOGY] Remember drawers full of chargers?
> Every gadget had its own charger. Then USB-C: one plug, any device. **MCP** does the same for AI — one standard way to plug tools into any app that supports it.

**MCP** — the **Model Context Protocol** — is an open standard for connecting AI apps to tools and data. Anthropic introduced it in November 2024. It spread quickly, and in late 2025 it was handed to the newly formed **Agentic AI Foundation**, part of the Linux Foundation, so no single company controls it.

- An **MCP server** is a small plug-in offering tools for one service — say, "search files" and "read document" for a cloud drive.
- An **MCP client** is built into an AI app and can connect to any MCP server.

Write a server once; it works with every app that speaks MCP. Connect some servers and watch the toolbox grow.

<div data-widget="mcp-plugs"></div>

Each server added tools instantly, with no change to the model. Servers that *change* things asked permission first — the harness at work.

> [!WARNING] Only plug in what you trust
> Your agent will trust and use any server you add. Install only from trusted sources, check the tools they add, and remember the [lethal trifecta](staying-safe.html): private files, a browser and a messaging tool on one agent is exactly the risky mix.

<div class="detail">

**Beyond tools:** besides **tools** (actions the model can call), an MCP server can offer **resources** (data the app can read, such as files or database records) and **prompts** (ready-made templates for common tasks). Servers can run on your own computer, talking to the app directly, or remotely over the internet, usually with a proper sign-in so you never paste a password into the AI. As of 2026, MCP is supported by most major AI assistants and coding agents, and there are thousands of servers for popular services.

</div>

## Frameworks and SDKs

Real agents need extras around the 20-line loop: error handling, long conversations, safe tool runs, saved progress, tracing, coordinating several agents. An **SDK** (software development kit) or **agent framework** provides them. As of 2026, popular ones include the **Claude Agent SDK**, the **OpenAI Agents SDK**, Google's **Agent Development Kit**, **LangGraph**, **CrewAI** and Microsoft's **Agent Framework**. Underneath each is the same loop: send messages, receive tool calls, run tools, send results, repeat.

Even if you never code, the loop explains behavior. Stuck? It's circling without progress. Forgetful? The conversation got too long. Asking permission? The harness paused the loop for you.

For the full engineering story — tool design, context, evaluation, multi-agent architectures, real code — see our in-depth course, [Agent Academy](../index.html).

## Quick check

```quiz
Q: In an agent, what actually runs a tool like "send email"?
- [x] The harness, which carries out the model's tool call
- [ ] The AI model itself, which sends the email directly
- [ ] The MCP standard, which sends the email automatically
- [ ] You, by copying the model's text into your email app
E: The model only writes text, including structured tool calls. The harness reads the request and runs the real tool, which is also why it can block the action or ask you first. MCP is just a standard way to plug tools in; it doesn't run anything by itself.

Q: How does the agent loop know when to stop?
- [ ] After exactly ten trips around the loop, every time
- [ ] As soon as any tool sends back an error message
- [x] When the model replies without requesting a tool
- [ ] When the harness decides the answer looks good enough
E: A reply with no tool call means the model has its final answer, so the loop ends. The harness doesn't judge quality; it just checks for a tool request. Errors are results the model can react to, and real harnesses also set a maximum number of steps as a safety limit.

Q: What problem does MCP (the Model Context Protocol) mainly solve?
- [ ] It makes the AI model itself better at reasoning
- [ ] It guarantees agents never misuse the tools they have
- [ ] It lets models remember all your past conversations
- [x] It gives apps one standard plug for tools and data
E: Like USB-C for chargers, MCP replaces many custom connectors with one shared standard: write a server once, and any MCP-compatible app can use it. It doesn't change the model's intelligence or memory, and it doesn't make tools safe: you still choose which servers to trust.
```

## What's next

Every lap of the loop is a chance for a small mistake. Next: [making agents reliable](reliable-agents.html) — and why checking work changes everything.
