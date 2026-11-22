---
title: "Tools: giving agents hands"
emoji: "🛠️"
subtitle: "How agents search, calculate, send and click, and why descriptions matter."
minutes: 8
---

Picture a brilliant new colleague on day one, with no laptop or logins yet. Ask them to "send the client the updated price list" and the best they can say is, "Here's what I'd write…"

That's a model without tools. [The AI brain](the-ai-brain.html) only produces text; in [the agent loop](the-agent-loop.html) it asks for actions and a harness carries them out. Those actions are its **tools**.

> [!KEY]
> A **tool** is a specific ability an agent may use, like searching the web or sending an email: the model chooses *when*, the harness does the work.

## What is a tool?

To the agent, a tool is a short menu entry with three parts:

| Part | What it says | Example |
|---|---|---|
| **Name** | A short label | `send_email` |
| **Description** | What it does, and when to use it | "Send an email for the user. Only use after the user has approved the text." |
| **Inputs** | The details it needs | `to`, `subject`, `body` |

That's all the model sees: no code, no server, no logins. It picks `send_email`, fills in the inputs, and the harness does the rest.

> [!ANALOGY]
> In a restaurant you order from the menu and never enter the kitchen. An agent works the same way, so the menu must be clear.

### Try it: give the agent tools

Pick a task with only web search on and press **Run the agent**. Then toggle tools and retry.

<div data-widget="toolbox"></div>

With the right tool, the answer is **grounded in a real result**; without it, the brain guesses or hands the work back. Some tasks **chain tools**, like calendar plus email to book a call with Ana.

## Common tools

As of 2026, the most common:

| Tool | What it lets the agent do | Everyday use |
|---|---|---|
| **Web search & fetch** | Find current information and read web pages | News, prices, opening hours ([example](example-research-agent.html)) |
| **Code / calculator** | Run small programs for exact math or data | Budgets, charts, spreadsheets ([example](example-data-analyst.html)) |
| **Files & documents** | Open, search, create and edit documents | Summarizing a report |
| **Email & messaging** | Read, sort and draft (or send) messages | Clearing an inbox ([example](example-inbox-assistant.html)) |
| **Calendar** | Check availability and create events | Scheduling meetings |
| **Browser & computer use** | Click, type and scroll like a person | Forms, comparing products ([example](example-browser-agent.html)) |
| **Business systems** | Look up orders, customers or tickets | Customer support ([example](example-support-agent.html)) |

**Computer use** means working from screenshots with a mouse and keyboard, so agents can use apps never built for AI. It's slower and more error-prone, so agents prefer a direct tool when one exists.

<div class="detail">

**How does a model "decide" to use a tool?** Models are specially trained for this. The harness includes the tool menu in a structured format. If the model thinks a tool will help, it replies not with ordinary text but with a structured **tool call**: the tool's name plus its inputs, for example `get_forecast` with `place: "Oslo"`. The harness runs the tool and sends the result back as a new message. The model can call one tool, several in a row, or sometimes several at once, then writes its answer from what came back. This is often called **tool use** or **function calling**.

</div>

## Descriptions matter

A **description** is a job briefing; vague ones cause confused choices. Given `search` ("Searches.") and `lookup` ("Looks things up."), which answers "What's the status of order #4471?" No way to tell. Compare:

- `web_search`: "Search the public internet for current information. Don't use for customer data."
- `order_lookup`: "Find a customer order by its order number. Returns status, items and delivery date."

Same model, clearer descriptions, better decisions.

> [!TIP] This applies to you, too
> Say what each source is *for* and when *not* to use it: "Use the HR policy folder for leave questions; never search the web for internal policies." More in [Great instructions](great-instructions.html).

## Look vs. touch

Tools fall into two risk groups:

| Tools that **look** (read-only) | Tools that **touch** (change things) |
|---|---|
| Search the web | Send an email |
| Read a file | Delete or overwrite a file |
| Check a calendar | Create or cancel a meeting |
| Look up an order | Issue a refund or make a payment |
| View a web page | Submit a form or post publicly |

A misused "look" tool gives a weaker answer. A misused "touch" tool does something real, sometimes irreversibly: a misdirected email, a lost file, moved money.

So "look" tools often run freely, while "touch" tools need **permission**, in advance ("create events, but ask before emailing") or in the moment ("Shall I send this?").

> [!WARNING] Fewest tools needed
> If an agent only needs to *read* your inbox, don't let it *send*. This is the **principle of least privilege**; practise it in [Staying safe](staying-safe.html).

## Where tools come from

Tools usually arrive one of three ways:

1. **Built in.** Web search, file reading, a code tool.
2. **Connectors.** Link email, calendar or work apps with a "Connect" button and a sign-in.
3. **Custom tools.** Companies build their own, like an order database.

The **Model Context Protocol (MCP)** is a shared standard, like USB-C for AI: a tool built once as an "MCP server" plugs into many AI apps. Try it in [Under the hood](under-the-hood.html).

<div class="detail">

**A bit more about MCP:** Anthropic introduced the Model Context Protocol as an open standard in November 2024. Through 2025 it was taken up across the industry, including in tools from other major AI companies, and in December 2025 Anthropic donated it to the Agentic AI Foundation, part of the non-profit Linux Foundation, so no single company controls it. An MCP server can offer **tools** (actions), **resources** (things to read, like files or records) and **prompts** (ready-made instructions). The AI app connects, learns the server's tool menu, and adds those tools to what the model can use. Anyone can write an MCP server, so only connect ones you trust: the model reads each tool's description, and a malicious one could try to mislead it.

</div>

## Practical tips

- **Match tools to the job.** Web search for anything recent; code for numbers.
- **Check what's on.** A made-up answer may mean a missing tool.
- **Watch the tool trail.** "Searched: 3 sources" shows a real basis.
- **Grant permissions gradually.** Start read-only; add "touch" permissions once you trust the agent.

```prompt
Before you start: list the tools you have access to right now (for example web search, files, code, email or calendar).
Then, for this task — [describe your task] — tell me which tools you plan to use and why.
Use only read-only actions until I approve; ask me before sending, booking, buying, editing or deleting anything.
```

## Quick check

```quiz
Q: What does an agent actually "see" about a tool when deciding whether to use it?
- [ ] The tool's full program code and the server it runs on
- [ ] A short video showing the tool being used correctly
- [x] Its name, a short description and the inputs it needs
- [ ] Nothing at all, because the harness picks every tool
E: The model chooses tools from a short "menu" entry: name, description and inputs. It never sees the code or the server, and the harness only runs the tool the model asks for; it doesn't choose. That's why clear descriptions lead to better tool choices.

Q: Which of these is a tool that "touches", that is, changes something in the world?
- [ ] Checking tomorrow's calendar for free slots
- [x] Cancelling a meeting on someone's calendar
- [ ] Searching the web for a restaurant's opening hours
- [ ] Reading a PDF report from your documents
E: Cancelling a meeting changes something real and affects other people, so it deserves more care (and often an approval step). The other three only read information.

Q: An agent only needs to summarize your inbox each morning. Which tool permissions should it have?
- [ ] Full access to read, send and delete, just in case
- [x] Read-only access to your inbox, and nothing more
- [ ] Send-only access, so it can email you the summary
- [ ] No access at all, since agents shouldn't touch email
E: Give agents the fewest permissions they need (least privilege). Summarizing only requires reading. Send-only access can't even see the inbox, and extra powers like sending or deleting add risk without helping with this task.
```

## What's next

Brain, loop, hands. But how does an agent keep track of everything, and what happens when there's too much? Next: **Memory**, and the agent's surprisingly small backpack.
