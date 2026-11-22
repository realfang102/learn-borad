#!/usr/bin/env python3
"""Execute every lesson's Python code through the real Anthropic SDK against a strict local fake API.

Each lesson's blocks run in order in one namespace (as a learner following along would). The fake
server (scripts/fake_api.py) validates every request: model ID, max_tokens, no sampling params,
role order, tool_use/tool_result pairing, no prefill, tool schemas, message-thread protocol, and
streams responses where requested. Only the model's replies are scripted.

Requires: pip install anthropic pydantic   Usage: python3 scripts/run_examples.py [python-with-sdk]
Expected non-bug failures: intentional fragments, optional dependencies, elided example data.
"""
import glob, json, os, subprocess, sys, tempfile, time
from collections import Counter
HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, HERE)
from check_code import blocks

PY = sys.argv[1] if len(sys.argv) > 1 else sys.executable
HARNESS = r'''
import sys, json, signal, builtins
g = {"__name__": "__lesson__"}; out = []
builtins.input = lambda *a, **k: (_ for _ in ()).throw(EOFError("no stdin"))
for line, code in json.load(open(sys.argv[1])):
    signal.signal(signal.SIGALRM, lambda *a: (_ for _ in ()).throw(TimeoutError("block timed out"))); signal.alarm(15)
    try: exec(compile(code, f"block@{line}", "exec"), g); out.append([line, "ok", ""])
    except BaseException as e: out.append([line, type(e).__name__, str(e)[:160]])
    finally: signal.alarm(0)
print(json.dumps(out))
'''

def main():
    port, tmp = 8790, tempfile.mkdtemp()
    log = os.path.join(tmp, "violations.jsonl")
    for f in (log, log + ".all"): open(f, "w").close()
    srv = subprocess.Popen([sys.executable, os.path.join(HERE, "fake_api.py"), str(port), log]); time.sleep(1)
    env = dict(os.environ, ANTHROPIC_BASE_URL=f"http://127.0.0.1:{port}", ANTHROPIC_API_KEY="test-key", NO_PROXY="127.0.0.1,localhost", no_proxy="127.0.0.1,localhost")
    total = ok = 0; fails = Counter(); viol = []
    try:
        for f in sorted(glob.glob(os.path.join(HERE, "..", "content", "lessons", "*.md"))):
            bl = list(blocks(f))
            if not any("client" in c for _, c in bl): continue
            with tempfile.TemporaryDirectory() as d:
                json.dump(bl, open(f"{d}/b.json", "w")); open(f"{d}/h.py", "w").write(HARNESS)
                nv = sum(1 for _ in open(log))
                r = subprocess.run([PY, f"{d}/h.py", f"{d}/b.json"], cwd=d, env=env, capture_output=True, text=True, timeout=300, stdin=subprocess.DEVNULL)
                res = json.loads(r.stdout.strip().splitlines()[-1]) if r.stdout.strip() else [[0, "crash", r.stderr[-200:]]]
                for x in open(log).readlines()[nv:]: viol.append((os.path.basename(f), json.loads(x)["errors"]))
            total += len(res); ok += sum(1 for x in res if x[1] == "ok"); fails.update(x[1] for x in res if x[1] != "ok")
    finally:
        srv.terminate()
    calls = sum(1 for _ in open(log + ".all"))
    print(f"blocks: {total}  ran ok: {ok}  API requests validated: {calls}  protocol violations: {len(viol)}")
    print("other outcomes:", dict(fails))
    for v in viol: print("VIOLATION", *v)
    return 1 if viol else 0

if __name__ == "__main__":
    sys.exit(main())
