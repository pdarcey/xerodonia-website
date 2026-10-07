// Checks the Lighthouse results from `lhci collect` (in .lighthouseci/)
// against the Stage 6 targets, using each page's median score over its runs:
//
//   Performance                                 fails below 90, warns below 95
//   Accessibility, Best Practices and SEO       must be 100
//
// Performance on shared CI runners varies by a few points between runs,
// hence the warning band. Run with `npm run check:lighthouse`.

import fs from "node:fs";
import path from "node:path";

const RESULTS_DIR = ".lighthouseci";
const FAIL_BELOW = { performance: 0.9, accessibility: 1, "best-practices": 1, seo: 1 };
const WARN_BELOW = { performance: 0.95 };
const inActions = Boolean(process.env.GITHUB_ACTIONS);

/** The middle value (or the lower middle, for an even count). */
const median = (values) => values.toSorted((a, b) => a - b)[Math.floor((values.length - 1) / 2)];

/** Prints a message, as a GitHub Actions annotation when running in CI. */
function report(level, message) {
  console.log(inActions ? `::${level}::${message}` : `${level.toUpperCase()}: ${message}`);
}

const files = fs.existsSync(RESULTS_DIR)
  ? fs.readdirSync(RESULTS_DIR).filter((name) => name.startsWith("lhr-") && name.endsWith(".json"))
  : [];
if (files.length === 0) {
  report("error", `No Lighthouse results in ${RESULTS_DIR}/. Run \`lhci collect\` first.`);
  process.exit(1);
}

// Group every run's scores by page path (the port changes between runs).
const pages = new Map();
for (const name of files) {
  const result = JSON.parse(fs.readFileSync(path.join(RESULTS_DIR, name), "utf8"));
  const page = new URL(result.finalDisplayedUrl).pathname.replace(/index\.html$/, "");
  const scores = pages.get(page) ?? {};
  for (const [id, category] of Object.entries(result.categories)) {
    (scores[id] ??= []).push(category.score);
  }
  pages.set(page, scores);
}

let failures = 0;
for (const [page, scores] of [...pages].sort()) {
  const medians = Object.fromEntries(Object.entries(scores).map(([id, runs]) => [id, median(runs)]));
  console.log(`${page.padEnd(52)} ${Object.values(medians).map((s) => String(Math.round(s * 100)).padStart(4)).join("")}`);
  for (const [id, score] of Object.entries(medians)) {
    const points = Math.round(score * 100);
    if (score < FAIL_BELOW[id]) {
      failures += 1;
      report("error", `${page}: ${id} is ${points}, below ${FAIL_BELOW[id] * 100}`);
    } else if (score < (WARN_BELOW[id] ?? 0)) {
      report("warning", `${page}: ${id} is ${points}, below the target of ${WARN_BELOW[id] * 100}`);
    }
  }
}
console.log(`${"".padEnd(52)} perf a11y  b-p  seo  (median of ${files.length / pages.size} runs)`);
process.exit(failures ? 1 : 0);
