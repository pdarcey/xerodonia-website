// Post-build guard: the site ships no JavaScript of its own. Two kinds of
// <script> are allowed:
//   - <script type="application/ld+json"> (structured data, never executed),
//     and every one of those must contain valid JSON;
//   - exactly one TelemetryDeck tag per page (anonymous visit counts), matching
//     `site.telemetryDeck` exactly: async, that src and App ID, and no body.
// It also fails on a straight quote or apostrophe in any page's visible prose
// (text, alt and similar attributes, and description meta tags): copy uses
// typographic ones (Paul, 12 Nov 2026).

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

/** Attributes whose values are prose that people (or screen readers) read. */
const proseAttributes = ["alt", "title", "aria-label", "placeholder"];

/** Meta tags whose `content` is prose (search results and link previews). */
const proseMeta = /<meta\s+(?:name|property)="(?:description|og:title|og:description|og:image:alt|twitter:title|twitter:description)"\s+content="([^"]*)"/gi;

/** A straight quote, written as itself or as the entities Nunjucks escapes it to. */
const straightQuote = /'|"|&#39;|&#x27;|&quot;|&apos;/;

/**
 * Lists straight quotes in a page's visible prose: text between tags, prose
 * attributes and prose meta tags. Code, preformatted text, scripts and styles
 * are skipped, because quotes there are syntax. Copy uses typographic quotes
 * and apostrophes (’ ‘ “ ”).
 * @param {string} html  One built page
 * @returns {string[]}   A short excerpt around each straight quote
 */
export function straightQuotesInProse(html) {
  const visible = html.replace(/<(script|style|pre|code|svg)\b[\s\S]*?<\/\1>/gi, "");
  const found = [];
  const note = (text) => {
    const match = text.match(straightQuote);
    if (match) {
      const at = match.index;
      found.push(text.slice(Math.max(0, at - 30), at + 30).replace(/\s+/g, " ").trim());
    }
  };
  for (const [, text] of visible.matchAll(/>([^<]+)</g)) note(text);
  for (const attribute of proseAttributes) {
    for (const [, value] of visible.matchAll(new RegExp(`\\s${attribute}="([^"]*)"`, "gi"))) note(value);
  }
  for (const [, value] of html.matchAll(proseMeta)) note(value);
  return found;
}

/**
 * Throws (failing the build) on any script other than JSON-LD and the
 * TelemetryDeck tag, on a page without exactly one TelemetryDeck tag, on any
 * inline event handler or javascript: URL, or on unparseable JSON-LD.
 * @param {string} outputDir  Eleventy's output directory
 */
export async function checkBuildOutput(outputDir) {
  const problems = [];
  const quoteProblems = [];
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
    for (const excerpt of straightQuotesInProse(html)) {
      quoteProblems.push(`${where}: …${excerpt}…`);
    }
  }
  if (problems.length) {
    throw new Error(`Build check failed. The only scripts allowed are JSON-LD and TelemetryDeck:\n  ${problems.join("\n  ")}`);
  }
  if (quoteProblems.length) {
    throw new Error(`Build check failed. Copy uses typographic quotes and apostrophes (’ ‘ “ ”), not straight ones:\n  ${quoteProblems.join("\n  ")}`);
  }
}
