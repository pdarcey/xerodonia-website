// Post-build guard: the site ships no JavaScript of its own. Two kinds of
// <script> are allowed:
//   - <script type="application/ld+json"> (structured data, never executed),
//     and every one of those must contain valid JSON;
//   - exactly one TelemetryDeck tag per page (anonymous visit counts), matching
//     `site.telemetryDeck` exactly: async, that src and App ID, and no body.

import fs from "node:fs/promises";
import path from "node:path";
import site from "../src/_data/site.js";

/** The attributes of the one external script allowed, as base.njk writes them. */
const telemetryDeckAttrs = `async src="${site.telemetryDeck.src}" data-app-id="${site.telemetryDeck.appId}"`;

/** Recursively lists every .html file under `dir`. */
async function htmlFiles(dir) {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  const nested = await Promise.all(
    entries.map((entry) => {
      const full = path.join(dir, entry.name);
      if (entry.isDirectory()) return htmlFiles(full);
      return entry.name.endsWith(".html") ? [full] : [];
    })
  );
  return nested.flat();
}

/**
 * Throws (failing the build) on any script other than JSON-LD and the
 * TelemetryDeck tag, on a page without exactly one TelemetryDeck tag, on any
 * inline event handler or javascript: URL, or on unparseable JSON-LD.
 * @param {string} outputDir  Eleventy's output directory
 */
export async function checkBuildOutput(outputDir) {
  const problems = [];
  for (const file of await htmlFiles(outputDir)) {
    const html = await fs.readFile(file, "utf8");
    const where = path.relative(outputDir, file);
    let telemetryDeckTags = 0;

    for (const [, attrs, body] of html.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script>/gi)) {
      if (attrs.trim().replace(/\s+/g, " ") === telemetryDeckAttrs && body.trim() === "") {
        telemetryDeckTags += 1;
        continue;
      }
      if (!/type\s*=\s*["']application\/ld\+json["']/i.test(attrs)) {
        problems.push(`${where}: executable <script${attrs}> is not allowed`);
        continue;
      }
      try {
        JSON.parse(body);
      } catch (error) {
        problems.push(`${where}: invalid JSON-LD (${error.message})`);
      }
    }
    if (telemetryDeckTags !== 1) {
      problems.push(`${where}: expected exactly one TelemetryDeck <script>, found ${telemetryDeckTags}`);
    }
    if (/\son[a-z]+\s*=\s*["']/i.test(html.replace(/<script[\s\S]*?<\/script>/gi, ""))) {
      problems.push(`${where}: inline event handler (on…=) found`);
    }
    if (/(href|src)\s*=\s*["']\s*javascript:/i.test(html)) {
      problems.push(`${where}: javascript: URL found`);
    }
  }
  if (problems.length) {
    throw new Error(`Build check failed. The only scripts allowed are JSON-LD and TelemetryDeck:\n  ${problems.join("\n  ")}`);
  }
}
