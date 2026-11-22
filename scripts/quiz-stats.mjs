// Quiz quality report: flags questions whose correct option is the longest (a giveaway)
// or whose option lengths vary a lot. Usage: node scripts/quiz-stats.mjs [lesson.md ...]
import fs from "node:fs";
import path from "node:path";
const dir = "content/lessons";
const files = process.argv.slice(2).length ? process.argv.slice(2) : fs.readdirSync(dir).map((f) => path.join(dir, f));
let total = 0, longest = 0;
for (const f of files) {
  const t = fs.readFileSync(f, "utf8");
  const rows = [];
  for (const block of t.match(/```quiz[\s\S]*?```/g) || []) {
    for (const q of block.split(/\nQ:/).slice(1)) {
      const opts = [...q.matchAll(/^- \[( |x|X)\] (.*)$/gm)];
      const c = opts.findIndex((o) => /x/i.test(o[1]));
      const lens = opts.map((o) => o[2].length);
      const isLongest = lens[c] === Math.max(...lens);
      const others = lens.filter((_, i) => i !== c);
      const ratio = lens[c] / (others.reduce((a, b) => a + b, 0) / others.length);
      total++; if (isLongest) longest++;
      rows.push(`${isLongest ? "LONGEST" : "ok     "} ratio=${ratio.toFixed(2)} lens=[${lens.join(",")}] correct=${"ABCDEF"[c]}  ${q.split("\n")[0].trim().slice(0, 70)}`);
    }
  }
  if (process.argv.slice(2).length) console.log(`\n${f}\n  ` + rows.join("\n  "));
}
console.log(`\nCorrect option is the longest in ${longest}/${total} questions (${Math.round((100 * longest) / total)}%). Target: ≤ 35%, ratio ≈ 0.8–1.2.`);
