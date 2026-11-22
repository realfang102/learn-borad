#!/usr/bin/env python3
"""A strict fake of the Claude Messages API for exercising course examples through the real SDK.

Validates every request against the protocol rules the course teaches and returns scripted
responses: a tool_use for the first custom tool on the first turn that offers tools, then end_turn.
Violations are appended to violations.jsonl and returned as 400 errors (like the real API).
"""
import json, sys, uuid, itertools
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer

MODELS = {"claude-opus-5-5", "claude-sonnet-5-5", "claude-haiku-5-5", "claude-fable-5-2"}
LOG = sys.argv[2] if len(sys.argv) > 2 else "violations.jsonl"
counter = itertools.count()


def example(schema, depth=0):
    if not isinstance(schema, dict) or depth > 6:
        return "x"
    if "enum" in schema:
        return schema["enum"][0]
    if "const" in schema:
        return schema["const"]
    for k in ("anyOf", "oneOf", "allOf"):
        if k in schema:
            return example(schema[k][0], depth + 1)
    if "$ref" in schema:
        return "x"
    t = schema.get("type")
    if isinstance(t, list):
        t = [x for x in t if x != "null"][0] if [x for x in t if x != "null"] else "null"
    if t == "object" or "properties" in schema:
        props = schema.get("properties", {})
        return {k: example(v, depth + 1) for k, v in props.items()}
    if t == "array":
        n = max(1, schema.get("minItems", 1))
        return [example(schema.get("items", {}), depth + 1) for _ in range(n)]
    if t == "integer":
        return max(1, schema.get("minimum", 1))
    if t == "number":
        return float(max(1, schema.get("minimum", 1)))
    if t == "boolean":
        return False
    if t == "null":
        return None
    return "example"


def validate(body):
    errs = []
    if body.get("model") not in MODELS:
        errs.append(f"unknown model {body.get('model')!r}")
    if not isinstance(body.get("max_tokens"), int):
        errs.append("max_tokens missing")
    for p in ("temperature", "top_p", "top_k"):
        if p in body:
            errs.append(f"{p} is not accepted")
    th = body.get("thinking")
    if th and th.get("type") not in ("adaptive",):
        errs.append(f"thinking type {th.get('type')!r}")
    tc = body.get("tool_choice")
    if tc and tc.get("type") in ("any", "tool"):
        errs.append("forced tool_choice")
    for t in body.get("tools", []) or []:
        if "type" in t and "input_schema" not in t:
            continue  # server / Anthropic-defined tool
        if not t.get("name") or not isinstance(t.get("input_schema"), dict):
            errs.append(f"bad tool definition {t.get('name')!r}")
    msgs = body.get("messages", [])
    if not msgs:
        errs.append("no messages")
    roles = [m.get("role") for m in msgs if m.get("role") != "system"]
    if roles and roles[0] != "user":
        errs.append("first message is not user")
    if roles and roles[-1] == "assistant":
        errs.append("ends with assistant message (prefill is rejected)")
    pending = None
    for i, m in enumerate(msgs):
        content = m.get("content")
        blocks = content if isinstance(content, list) else []
        if m.get("role") == "assistant":
            ids = [b.get("id") for b in blocks if isinstance(b, dict) and b.get("type") == "tool_use"]
            pending = set(ids) if ids else None
        elif m.get("role") == "user":
            res = [b for b in blocks if isinstance(b, dict) and b.get("type") == "tool_result"]
            if pending:
                got = {b.get("tool_use_id") for b in res}
                if got != pending:
                    errs.append(f"message {i}: tool_result ids {sorted(got)} != tool_use ids {sorted(pending)}")
                kinds = [b.get("type") for b in blocks if isinstance(b, dict)]
                if "tool_result" in kinds and any(k != "tool_result" for k in kinds[: len(res)]):
                    errs.append(f"message {i}: tool_result blocks must come first")
            elif res:
                errs.append(f"message {i}: tool_result without preceding tool_use")
            pending = None
    return errs


def respond(body):
    n = next(counter)
    usage = {"input_tokens": 1000, "output_tokens": 50, "cache_read_input_tokens": 0, "cache_creation_input_tokens": 0}
    msgs = body.get("messages", [])
    had_results = any(isinstance(m.get("content"), list) and any(isinstance(b, dict) and b.get("type") == "tool_result" for b in m["content"]) for m in msgs)
    custom = [t for t in (body.get("tools") or []) if "input_schema" in t]
    base = {"id": f"msg_{n}_{uuid.uuid4().hex[:8]}", "type": "message", "role": "assistant", "model": body.get("model"), "stop_sequence": None, "usage": usage, "stop_details": None}
    fmt = ((body.get("output_config") or {}).get("format") or {})
    if fmt.get("type") == "json_schema":
        return {**base, "stop_reason": "end_turn", "content": [{"type": "text", "text": json.dumps(example(fmt.get("schema", {})))}]}
    if custom and not had_results:
        t = custom[0]
        return {**base, "stop_reason": "tool_use", "content": [
            {"type": "text", "text": "Let me use a tool."},
            {"type": "tool_use", "id": f"toolu_{uuid.uuid4().hex[:12]}", "name": t["name"], "input": example(t["input_schema"])}]}
    return {**base, "stop_reason": "end_turn", "content": [{"type": "text", "text": "Done. (fake API final answer)"}]}


THREADS = {}


def sse(resp):
    out = []
    ev = lambda t, d: out.append(f"event: {t}\ndata: {json.dumps({'type': t, **d})}\n\n")
    start = {k: v for k, v in resp.items() if k not in ("content", "stop_reason")}
    ev("message_start", {"message": {**start, "content": [], "stop_reason": None}})
    for i, b in enumerate(resp["content"]):
        if b["type"] == "text":
            ev("content_block_start", {"index": i, "content_block": {"type": "text", "text": ""}})
            ev("content_block_delta", {"index": i, "delta": {"type": "text_delta", "text": b["text"]}})
        else:
            ev("content_block_start", {"index": i, "content_block": {**b, "input": {}}})
            ev("content_block_delta", {"index": i, "delta": {"type": "input_json_delta", "partial_json": json.dumps(b["input"])}})
        ev("content_block_stop", {"index": i})
    ev("message_delta", {"delta": {"stop_reason": resp["stop_reason"], "stop_sequence": None}, "usage": {"output_tokens": 50}})
    ev("message_stop", {})
    return "".join(out).encode()


class H(BaseHTTPRequestHandler):
    def log_message(self, *a):
        pass

    def do_POST(self):
        body = json.loads(self.rfile.read(int(self.headers.get("content-length", 0))) or b"{}")
        path = self.path.split("?")[0]
        if path.endswith("/messages/count_tokens"):
            self._send(200, {"input_tokens": 1234})
            return
        th = body.get("thread") or {}
        tid = bool(th)
        if th.get("type") == "continue":  # Message Threads beta: history kept server-side
            prev = THREADS.pop(th.get("previous_message_id"), None)
            if prev is None:
                self._send(404, {"type": "error", "error": {"type": "not_found_error", "message": "thread_not_found", "details": {"error_code": "thread_not_found"}}})
                return
            if "system" in body or "tools" in body:
                with open(LOG, "a") as f:
                    f.write(json.dumps({"errors": ["thread continue must not resend system/tools"]}) + "\n")
            body = {**body, "messages": prev["messages"] + body.get("messages", []), "tools": prev.get("tools"), "system": prev.get("system")}
        if not path.endswith("/messages"):
            self._send(404, {"type": "error", "error": {"type": "not_found_error", "message": self.path}})
            return
        with open(LOG + ".all", "a") as f:
            f.write("1\n")
        errs = validate(body)
        if errs:
            with open(LOG, "a") as f:
                f.write(json.dumps({"caller": self.headers.get("x-snippet", "?"), "errors": errs}) + "\n")
            self._send(400, {"type": "error", "error": {"type": "invalid_request_error", "message": "; ".join(errs)}})
            return
        resp = respond(body)
        if tid:
            THREADS[resp["id"]] = {"messages": body["messages"] + [{"role": "assistant", "content": resp["content"]}], "tools": body.get("tools"), "system": body.get("system")}
        if body.get("stream"):
            data = sse(resp)
            self.send_response(200)
            self.send_header("content-type", "text/event-stream")
            self.send_header("content-length", str(len(data)))
            self.end_headers()
            self.wfile.write(data)
            return
        self._send(200, resp)

    def _send(self, code, obj):
        data = json.dumps(obj).encode()
        self.send_response(code)
        self.send_header("content-type", "application/json")
        self.send_header("request-id", "req_fake")
        self.send_header("content-length", str(len(data)))
        self.end_headers()
        self.wfile.write(data)


if __name__ == "__main__":
    ThreadingHTTPServer(("127.0.0.1", int(sys.argv[1])), H).serve_forever()
