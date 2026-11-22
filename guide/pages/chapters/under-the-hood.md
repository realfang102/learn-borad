---
title: "A peek under the hood"
emoji: "🔧"
subtitle: "What really happens inside an agent — messages, tool calls, a surprisingly short loop of code, and the 'USB-C' standard that plugs agents into your apps."
minutes: 13
---

When you watch an agent search the web, edit a file and write a report, it can feel like magic. Here's a secret that surprises almost everyone: the machinery that makes it work is **simple**. The clever part is the AI model. Everything around it is mostly plumbing — a few dozen lines of code passing notes back and forth.

You don't need to be a programmer to follow this chapter. If you understand passing notes, you'll understand how agents work.

> [!KEY] The big idea
> The AI model never *does* anything directly. It only writes text — including structured requests like "please run this tool". A regular program called the **harness** carries out those requests and reports back. Repeat until done: that's an agent.

## Three parts: the model, the tools and the harness

> [!ANALOGY] The genius in the room
> Imagine a brilliant consultant sitting in a closed room. They can't leave, can't use a phone, can't open a drawer. They can only pass notes under the door. Outside sits an assistant who reads each note — "please look up tomorrow's weather in Oslo" — does it, and slides the answer back in. The consultant reads it, thinks, and passes the next note. Eventually the note says: "Here's my final answer."

That's an agent, exactly:

| Part | In the story | In real life |
|---|---|---|
| 🧠 **The model** | The consultant | A large language model, like Claude, that reads and writes text |
| 🛠️ **The tools** | Phone, files, calculator | Functions the agent can use: search, send email, run code, read a file |
| 🧑‍💻 **The harness** | The assistant outside the door | The app or program that talks to the model, runs tools and keeps the conversation |

The **harness** is the part people rarely hear about, but it's where control lives. Because every action passes through it, the harness can log actions, block them, or stop and ask you for permission. All the safety habits from [Staying safe](staying-safe.html) are, at bottom, rules the harness enforces.

## Messages and tool calls

The "notes under the door" have a specific shape. The harness and the model exchange **messages** — a running list of who said what. Each message has a **role**: the *user* (you, or the harness speaking for you) or the *assistant* (the model).

Along with the messages, the harness sends a **tool list**: for each tool, a name, a plain-language description of what it does, and what information it needs. For example: *"get_weather — gets current weather for a city. Needs: city name."*

When the model decides it needs a tool, it doesn't write a normal reply. It writes a **tool call**: a small, structured request like *"call get_weather with city = Oslo"*. The harness spots this, runs the real tool, and sends back a **tool result** as a new message. The model reads it and decides what to do next.

Press **Play** to follow one question — "What should I wear in Oslo?" — through the whole process. Watch the packets move between the boxes, and the highlighted line in the code on the right:

<div data-widget="message-flow"></div>

That's it — the whole agent loop in about 20 lines. Notice how the loop ends: when the model replies *without* asking for a tool, the harness knows it's the final answer and stops. Every agent you've met in this guide, from the [coding agent](example-coding-agent.html) to the [research agent](example-research-agent.html), runs on this same pattern — just with more tools and many more trips around the loop.

<div class="detail">

**Reading the code line by line:** `messages` starts with your question. Inside `while True:` (repeat forever), the harness calls the model with three things: which model to use, the tool list, and all the messages so far. It appends the model's reply to the conversation. Then it checks `stop_reason` — the model's signal for *why* it stopped writing. If the reason isn't `"tool_use"`, the model is done and the loop `break`s. Otherwise, the harness finds each tool request, runs the real function with the inputs the model chose, and appends a `tool_result` message, tagged with the request's id so the model knows which result answers which call. Then round again.

One more surprise: the model has no memory between calls. **The harness re-sends the entire conversation every time.** That's why long tasks fill up the model's context window, and why the techniques in [Memory](memory.html) matter.

</div>

## The system prompt: the agent's job description

Before your first message, the harness quietly adds one more thing: a **system prompt**. It's a set of standing instructions that frames the whole conversation — the agent's job description and house rules, all in one.

A simple system prompt for a support agent might read:

```text
You are the support assistant for Willow & Pine, a small online furniture shop.
Be friendly and brief. Use the order_lookup tool to check orders before answering.
You may offer refunds up to $50. For anything larger, hand over to a human.
Never share one customer's details with another customer.
```

The system prompt is why the same model can behave like a careful coding assistant in one app and a cheerful travel planner in another. Real ones are often much longer, with detailed guidance on tone, tools, safety and when to ask for help.

You have your own version of this power. The "custom instructions" or "project instructions" in chat apps work much like a personal system prompt. Everything you learned in [Giving great instructions](great-instructions.html) applies.

## MCP: "USB-C for AI"

Here's a problem early agent builders hit. Every AI app wanted to connect to every service — email, calendars, files, databases, project trackers. That meant custom wiring for each combination: ten apps times a hundred services is a thousand separate connectors.

> [!ANALOGY] Remember drawers full of chargers?
> Every phone and gadget used to have its own charger. Then USB-C arrived: one standard plug, and suddenly any cable works with any device. **MCP** does the same for AI: one standard way to plug tools into any AI app that supports it.

**MCP** stands for **Model Context Protocol** — an open standard for connecting AI apps to tools and data. Anthropic introduced it in November 2024. It was quickly adopted across the industry, and in late 2025 it was handed to the newly formed **Agentic AI Foundation**, part of the Linux Foundation, so that no single company controls it.

It has two sides:

- An **MCP server** is a small plug-in that offers tools for one service — say, "search files" and "read document" for a cloud drive.
- An **MCP client** is built into an AI app — a chat assistant, a coding agent, a desktop app — and can connect to any MCP server.

Write a server once, and it works with every app that speaks MCP. Try connecting some servers and watch your agent's toolbox grow:

<div data-widget="mcp-plugs"></div>

Did you notice two things? First, each new server instantly added tools — the agent "learned" a new skill without any change to the model. Second, connecting servers that can *change* things (post messages, create events) asked for your permission first, and those tools were marked "can change things". That's the harness doing its job.

> [!WARNING] Only plug in what you trust
> An MCP server is software that your agent will trust and use. Install servers only from sources you trust, check what tools they add, and keep the [lethal trifecta](staying-safe.html) in mind: connecting your private files, a web browser and a messaging tool to the same agent is exactly the risky combination.

<div class="detail">

**Beyond tools:** besides **tools** (actions the model can call), an MCP server can also offer **resources** (data the app can read, such as files or database records) and **prompts** (ready-made templates for common tasks). Servers can run on your own computer, talking to the app directly, or remotely over the internet, usually with a proper sign-in so you never paste a password into the AI. As of 2026, MCP is supported by most major AI assistants and coding agents, and there are thousands of servers for popular services.

</div>

## Frameworks and SDKs: building blocks for builders

If the core loop is only 20 lines, why do developers use special toolkits? Because real agents need lots of extras: handling errors, managing long conversations, running tools safely, saving progress, tracing what happened, and coordinating several agents.

An **SDK** (software development kit) or **agent framework** is a ready-made toolkit that provides these extras. As of 2026, popular ones include the **Claude Agent SDK**, the **OpenAI Agents SDK**, Google's **Agent Development Kit**, **LangGraph**, **CrewAI** and Microsoft's **Agent Framework**. They differ in style and features, but underneath every one of them is the same loop you just watched: send messages, receive tool calls, run tools, send results, repeat.

> [!TIP] Why this matters even if you never code
> Knowing the loop helps you understand agent behavior. When an agent "gets stuck", it's going round the loop without making progress. When it forgets something, the conversation got too long. When it asks permission, the harness paused the loop for you. You can now reason about *why* an agent does what it does.

## Want to go deeper?

This guide gives you the intuition. If you want the full engineering story — tool design, context management, evaluation, multi-agent architectures and real code — head to our in-depth course, [Agent Academy](../index.html). It's written for people who want to build agents themselves.

## Quick check

```quiz
Q: In an agent, what actually runs a tool like "send email"?
- [ ] The AI model sends the email itself
- [x] The harness, after the model asks for it in a tool call
- [ ] The MCP standard sends it automatically
- [ ] The user has to send it manually every time
E: The model only writes text, including structured tool calls. The harness reads the request and runs the real tool — which is also why the harness can block it or ask you first.

Q: How does the agent loop know when to stop?
- [ ] After exactly ten trips around the loop
- [ ] When the tool returns an error message
- [x] When the model replies without asking for any tool
- [ ] When the user closes the app window
E: A reply with no tool call means the model has its final answer, so the loop ends. Errors are just results the model can react to — and real harnesses also set a maximum number of steps as a safety limit.

Q: What problem does MCP (the Model Context Protocol) mainly solve?
- [ ] It makes AI models smarter at reasoning
- [ ] It stops agents from ever making mistakes
- [ ] It lets models remember past conversations
- [x] It gives apps one standard way to plug in tools and data
E: Like USB-C for chargers, MCP replaces many custom connectors with one shared standard: write a server once, and any MCP-compatible app can use it. It doesn't change the model's intelligence or memory.
```

## What's next

Now you know how agents work inside, you can see why they sometimes go wrong: every trip around the loop is a chance for a small mistake. Next, we'll look at how to make agents **reliable** — and why checking work changes everything.
