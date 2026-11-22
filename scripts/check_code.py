#!/usr/bin/env python3
"""Check every Python code block in the course content.

1. Syntax: each ```python block (including ones indented inside list items) must compile.
   Fragments that only make sense inside a function (top-level `return`/`await`/`yield`)
   are retried wrapped in an async function.
2. Claude API lint: flags patterns that current Claude models reject or that the course
   considers stale (sampling params, budget_tokens, forced tool_choice, unknown model IDs,
   messages.create without max_tokens).

Usage: python3 scripts/check_code.py [files...]   (default: all content Markdown)
Exit code 1 if any problem is found.
"""
import ast
import glob
import re
import sys
import textwrap

CURRENT_MODELS = {"claude-opus-5-5", "claude-sonnet-5-5", "claude-haiku-5-5", "claude-fable-5-2"}
# Older IDs that may legitimately appear (e.g., fallback or migration examples).
KNOWN_OLDER = {"claude-opus-5", "claude-sonnet-5", "claude-fable-5-1", "claude-opus-4-8", "claude-opus-4-7",
               "claude-opus-4-6", "claude-sonnet-4-6", "claude-haiku-4-5", "claude-mythos-5-2"}

FENCE = re.compile(r"^(?P<indent>[ \t]*)```(?P<lang>[A-Za-z0-9_+-]*)[^\n]*\n(?P<body>.*?)^(?P=indent)```[ \t]*$", re.M | re.S)

LINT = [
    (re.compile(r"\b(temperature|top_p|top_k)\s*="), "sampling parameter (rejected by current Claude models)"),
    (re.compile(r"[\"'](temperature|top_p|top_k)[\"']\s*:"), "sampling parameter (rejected by current Claude models)"),
    (re.compile(r"budget_tokens"), "budget_tokens (use adaptive thinking + effort)"),
    (re.compile(r"[\"']type[\"']\s*:\s*[\"']enabled[\"']"), "thinking type 'enabled' (use 'adaptive')"),
    (re.compile(r"tool_choice\s*=\s*\{\s*[\"']type[\"']\s*:\s*[\"'](any|tool)[\"']"), "forced tool_choice (rejected by current Claude models)"),
    (re.compile(r"output_format\s*=\s*\{"), "raw output_format dict (use output_config={'format': ...} or parse(output_format=Model))"),
]


def blocks(path):
    text = open(path, encoding="utf-8").read()
    for m in FENCE.finditer(text):
        if m.group("lang").lower() not in ("python", "py"):
            continue
        line = text.count("\n", 0, m.start()) + 1
        yield line, textwrap.dedent(m.group("body"))


def compiles(code):
    try:
        ast.parse(code)
        return None
    except SyntaxError as e:
        first = e
    wrapped = "async def __snippet__():\n" + textwrap.indent(code, "    ") + "\n    pass\n"
    try:
        ast.parse(wrapped)
        return None
    except SyntaxError:
        return f"{first.msg} (line {first.lineno})"


def create_calls_missing_max_tokens(code):
    out = []
    for m in re.finditer(r"\.messages\.(create|stream|parse)\(", code):
        depth, i = 1, m.end()
        while i < len(code) and depth:
            depth += {"(": 1, ")": -1}.get(code[i], 0)
            i += 1
        call = code[m.end():i]
        if "max_tokens" not in call and "**" not in call and call.strip(" )\n") != "...":
            out.append(code.count("\n", 0, m.start()) + 1)
    return out


def main(files):
    problems, n_blocks, models_seen = 0, 0, {}
    for path in files:
        for line, code in blocks(path):
            n_blocks += 1
            where = f"{path}:{line}"
            err = compiles(code)
            if err:
                problems += 1
                print(f"SYNTAX  {where}: {err}")
            for rx, why in LINT:
                for m in rx.finditer(code):
                    ctx = code[max(0, m.start() - 60): m.end() + 20]
                    if "# noqa" in code[m.start(): code.find("\n", m.start())]:
                        continue
                    if re.match(r"[\"'](temperature|top_p|top_k)[\"']\s*:\s*\{\s*[\"']type", code[m.start():]):
                        continue  # a JSON-schema property named top_k etc., not a sampling parameter
                    problems += 1
                    print(f"API     {where}+{code.count(chr(10), 0, m.start())}: {why}: …{ctx.strip()[:90]}…")
            for mid in re.findall(r"[\"'](claude-[a-z0-9-]+)[\"']", code):
                models_seen[mid] = models_seen.get(mid, 0) + 1
                if mid not in CURRENT_MODELS | KNOWN_OLDER:
                    problems += 1
                    print(f"MODEL   {where}: unknown model id {mid!r}")
            for off in create_calls_missing_max_tokens(code):
                problems += 1
                print(f"API     {where}+{off}: messages call without max_tokens")
    print(f"\nChecked {n_blocks} Python blocks in {len(files)} files: {problems} problem(s).")
    print("Model IDs used:", ", ".join(f"{k}×{v}" for k, v in sorted(models_seen.items(), key=lambda x: -x[1])))
    return 1 if problems else 0


if __name__ == "__main__":
    args = sys.argv[1:] or sorted(glob.glob("content/lessons/*.md")) + ["content/cheatsheet.md", "content/projects.md"]
    sys.exit(main(args))
