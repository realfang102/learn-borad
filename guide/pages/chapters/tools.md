---
title: "Tools: giving agents hands"
emoji: "🛠️"
subtitle: "How agents search, calculate, send and click — and why the way a tool is described matters as much as the tool itself."
minutes: 10
---

Picture a brilliant new colleague on their first day. They know a lot and they're eager to help. But nobody has given them a laptop, a login, or access to the shared drive yet. Ask them to "send the client the updated price list" and the best they can do is say, "Happy to — but I can't get into anything yet. Here's what I'd write…"

That's a language model without tools. In [the AI brain](the-ai-brain.html) you saw that a model can only produce text. In [the agent loop](the-agent-loop.html) you saw it ask for actions, and a harness carry them out. The actions it can ask for are its **tools** — and they decide what an agent can actually do in the world.

> [!KEY] The big idea
> A **tool** is a specific ability an agent is allowed to use — like searching the web, reading a file or sending an email. The model chooses *when* and *how* to use each one; the harness does the actual work and hands back the result.

## What is a tool, exactly?

From the agent's point of view, a tool is surprisingly simple. It's a short entry on a menu with three parts:

| Part | What it says | Example |
|---|---|---|
| **Name** | A short label | `send_email` |
| **Description** | What it does, and when to use it, in plain words | "Send an email for the user. Only use after the user has approved the text." |
| **Inputs** | The details it needs to work | `to`, `subject`, `body` |

That's all the model sees. It never sees the code behind the tool, the email server, or the login details. It reads the menu, decides "I need `send_email` now", and writes a request filling in the inputs. The harness takes it from there.

> [!ANALOGY] Think of it like this
> Ordering in a restaurant, you read a menu: a dish name, a short description, maybe some options ("rare, medium or well done?"). You don't go into the kitchen. You just order clearly, and the food comes back. An agent's tools work the same way — the menu is all it knows, so the menu had better be clear.

## Try it: give the agent tools

In this playground, you decide which tools the agent gets. Start with only web search switched on, pick a task, and press **▶ Run the agent**. Then switch tools on or off and try again. Click a tool to read its description.

<div data-widget="toolbox"></div>

Did you notice? With the right tool, the agent's answer is **grounded in a real result** — the actual weather, the exact sum, a real calendar slot. Without it, the very same brain can only guess from memory or hand the work back to you. Some tasks also needed **more than one tool**: booking a call and emailing Ana required both the calendar and email. Agents often chain several tools together in one task.

## The tools agents use most

As of 2026, these are the tools you'll meet most often in AI assistants and agents:

| Tool | What it lets the agent do | Everyday use |
|---|---|---|
| 🔍 **Web search & fetch** | Find current information and read web pages | News, prices, opening hours, research ([example](example-research-agent.html)) |
| 🧮 **Code / calculator** | Run small programs to do exact math or analyze data | Budgets, charts, cleaning a spreadsheet ([example](example-data-analyst.html)) |
| 📁 **Files & documents** | Open, search, create and edit documents | Summarizing a report, drafting a slide outline |
| ✉️ **Email & messaging** | Read, sort and draft (or send) messages | Clearing an inbox ([example](example-inbox-assistant.html)) |
| 📅 **Calendar** | Check availability and create events | Scheduling meetings |
| 🌐 **Browser & computer use** | Click, type and scroll in websites and apps, like a person would | Filling in forms, comparing products ([example](example-browser-agent.html)) |
| 🗂️ **Business systems** | Look up orders, customers or tickets in a company's software | Customer support ([example](example-support-agent.html)) |

The last two rows are worth a moment. A **browser** or **computer-use** tool lets an agent look at a screen (through screenshots) and operate a mouse and keyboard. That means it can use websites and apps that were never built for AI. It's powerful and flexible — but slower and more error-prone than a tool built for the job, so agents usually prefer a direct tool when one exists.

<div class="detail">

**How does a model "decide" to use a tool?** Models are specially trained for this. When the harness sends a request, it includes the tool menu in a structured format. If the model thinks a tool will help, it replies not with ordinary text but with a structured **tool call**: the tool's name plus its inputs, for example `get_forecast` with `place: "Oslo"`. The harness spots this, runs the tool, and sends the result back as a new message. The model can call one tool, several in a row, or sometimes several at once — then it writes its answer using what came back. This ability is often called **tool use** or **function calling**.

</div>

## Why descriptions matter so much

Because the agent only knows what the menu tells it, a tool's **description** is like a job briefing. A vague briefing leads to confused choices.

Imagine an agent with two tools:

- `search` — "Searches."
- `lookup` — "Looks things up."

Asked "What's the status of order #4471?", which should it use? There's no way to tell! Now compare:

- `web_search` — "Search the public internet for current information. Don't use for customer data."
- `order_lookup` — "Find a customer order by its order number. Returns status, items and delivery date."

Now the choice is obvious. The same model, with clearer descriptions, makes better decisions.

> [!TIP] This applies to you, too
> When you connect an assistant to your own tools or write instructions for one, be specific: what each tool or source is *for*, when to use it, and when *not* to. "Use the HR policy folder for questions about leave; never search the web for internal policies" saves a lot of wrong turns. More on this in [Great instructions](great-instructions.html).

## Tools that look vs. tools that touch

Not all tools carry the same risk. A really useful way to sort them is into two groups:

| 👀 Tools that **look** (read-only) | ✋ Tools that **touch** (change things) |
|---|---|
| Search the web | Send an email |
| Read a file | Delete or overwrite a file |
| Check a calendar | Create or cancel a meeting |
| Look up an order | Issue a refund or make a payment |
| View a web page | Submit a form or post publicly |

If a "look" tool is used wrongly, you usually just get a less helpful answer. If a "touch" tool is used wrongly, something real happens: an email goes to the wrong person, a file disappears, money moves. Some of those can't be undone.

That's why well-designed agents treat the two groups differently. Read-only tools often run freely. Tools that change things typically need **permission** — either set up in advance ("you may create calendar events, but ask before sending email") or asked for in the moment ("Shall I send this?"). You saw this in the weekend-trip run, when the agent paused before booking.

> [!WARNING] Give agents the fewest tools they need
> Every tool is a new way to help — and a new way to go wrong. If an agent only needs to *read* your inbox to summarize it, don't give it permission to *send*. Security people call this the **principle of least privilege**, and it's one of the simplest ways to stay safe. You'll practice it in [Staying safe](staying-safe.html).

## Where do tools come from?

You rarely have to think about building tools yourself. They usually arrive in one of three ways:

1. **Built in.** Many AI assistants come with web search, file reading and a code tool already switched on.
2. **Connectors.** Apps let you link your email, calendar, documents or work software, often with a simple "Connect" button and a sign-in.
3. **Custom tools.** Companies build tools for their own systems — an order database, an internal wiki — so their agents can use them.

To make connecting easier, the industry has been adopting a shared standard called the **Model Context Protocol (MCP)**. You can think of it like USB-C for AI: a tool built once as an "MCP server" can plug into many different AI apps and agents. You'll see how it works, and plug some in yourself, in [Under the hood](under-the-hood.html).

<div class="detail">

**A bit more about MCP:** Anthropic introduced the Model Context Protocol as an open standard in late 2024, and through 2025 it was taken up across the industry, including in tools from other major AI companies. An MCP server can offer **tools** (actions), **resources** (things to read, like files or records) and **prompts** (ready-made instructions). The AI app connects to the server, learns its tool menu, and adds those tools to what the model can use. Because anyone can write an MCP server, it's also important to only connect ones you trust — a tool's description is read by the model, so a malicious one could try to mislead it.

</div>

## Practical tips

- **Pick assistants with the right tools for the job.** For anything recent, choose one with web search. For numbers, one that can run code.
- **Check which tools are switched on.** Most apps show connected tools or a settings page. If an answer seems made up, it may simply have lacked the tool to check.
- **Watch the tool trail.** Many agents show each tool call. "Searched: 3 sources" or "Ran code" tells you the answer came from somewhere real.
- **Grant permissions gradually.** Start with read-only access. Add "touch" permissions once you trust how the agent behaves.

```prompt
Before you start: list the tools you have access to right now (for example web search, files, code, email or calendar).
Then, for this task — [describe your task] — tell me which tools you plan to use and why.
Use only read-only actions until I approve; ask me before sending, booking, buying, editing or deleting anything.
```

## Quick check

```quiz
Q: What does an agent actually "see" about a tool when deciding whether to use it?
- [ ] The tool's full program code and server
- [ ] A video demonstration of the tool in action
- [x] Its name, a short description and the inputs it needs
- [ ] Nothing — the harness picks tools for it
E: The model chooses tools from a short "menu" entry: name, description and inputs. It never sees the code. That's why clear descriptions lead to better tool choices.

Q: Which of these is a tool that "touches" — that is, changes something in the world?
- [ ] Checking tomorrow's calendar for free slots
- [x] Cancelling a meeting on someone's calendar
- [ ] Searching the web for a restaurant's opening hours
- [ ] Reading a PDF report from your documents
E: Cancelling a meeting changes something real and affects other people, so it deserves more care (and often an approval step). The other three only read information.

Q: An agent only needs to summarize your inbox each morning. Which tool permissions should it have?
- [ ] Read, send and delete emails, so it's ready for anything
- [x] Read-only access to your inbox
- [ ] Send-only access, so it can email you the summary
- [ ] No access — agents shouldn't touch email at all
E: Give agents the fewest permissions they need (least privilege). Summarizing only requires reading. Extra powers like sending or deleting add risk without helping with this task.
```

## What's next

You've given the agent a brain, a loop and a set of hands. But how does it keep track of everything it has read and done — and what happens when there's too much to hold at once? Next up: **Memory**, and the agent's surprisingly small backpack.
