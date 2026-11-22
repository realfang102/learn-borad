#!/usr/bin/env python3
"""Verify arXiv citations against arXiv itself (needs network access to arxiv.org).

- Reading list (content/papers.yml): each arXiv URL must resolve and its real title must match ours.
- Lessons: every arXiv link must resolve to a real paper.
Usage: python3 scripts/check_citations.py      Exit code 1 on any mismatch or dead ID.
"""
import concurrent.futures as cf
import difflib
import glob
import html
import os
import re
import sys
import urllib.request

ROOT = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..")
ARXIV = re.compile(r"arxiv\.org/(?:abs|pdf)/(\d{4}\.\d{4,5})")


def title_of(aid):
    req = urllib.request.Request(f"https://arxiv.org/abs/{aid}", headers={"User-Agent": "citation-check"})
    try:
        page = urllib.request.urlopen(req, timeout=30).read().decode("utf-8", "replace")
    except Exception:
        return None
    m = re.search(r'<meta name="citation_title" content="([^"]+)"', page)
    return html.unescape(m.group(1)) if m else None


def norm(s):
    return re.sub(r"[^a-z0-9 ]", "", s.lower())


def main():
    papers = []
    current = {}
    for line in open(os.path.join(ROOT, "content", "papers.yml"), encoding="utf-8"):
        if line.startswith("- title:"):
            current = {"title": line.split(":", 1)[1].strip().strip('"')}
        elif line.strip().startswith("url:") and current:
            m = ARXIV.search(line)
            if m:
                papers.append((m.group(1), current["title"]))
    lesson_ids = set()
    for f in glob.glob(os.path.join(ROOT, "content", "lessons", "*.md")):
        lesson_ids.update(ARXIV.findall(open(f, encoding="utf-8").read()))
    ids = sorted({a for a, _ in papers} | lesson_ids)
    with cf.ThreadPoolExecutor(6) as ex:
        titles = dict(zip(ids, ex.map(title_of, ids)))
    problems = 0
    for aid, ours in papers:
        real = titles.get(aid)
        if not real or difflib.SequenceMatcher(None, norm(ours), norm(real)).ratio() < 0.85:
            problems += 1
            print(f"READING LIST {aid}: ours={ours!r} arXiv={real!r}")
    for aid in sorted(lesson_ids):
        if not titles.get(aid):
            problems += 1
            print(f"LESSON LINK {aid}: does not resolve")
    print(f"{len(papers)} reading-list arXiv entries, {len(lesson_ids)} arXiv IDs in lessons: {problems} problem(s)")
    return 1 if problems else 0


if __name__ == "__main__":
    sys.exit(main())
