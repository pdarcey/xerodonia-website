// Post-build guard: the site ships no JavaScript. The only <script> allowed
// is <script type="application/ld+json"> (structured data, never executed),
// and every one of those must contain valid JSON.

import fs from "node:fs/promises";
import path from "node:path";

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
 * Throws (failing the build) on any executable script, inline event handler
 * or javascript: URL, or on unparseable JSON-LD.
 * @param {string} outputDir  Eleventy's output directory
 */
export async function checkBuildOutput(outputDir) {
  const problems = [];
  for (const file of await htmlFiles(outputDir)) {
    const html = await fs.readFile(file, "utf8");
    const where = path.relative(outputDir, file);

    for (const [, attrs, body] of html.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script>/gi)) {
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
    if (/\son[a-z]+\s*=\s*["']/i.test(html.replace(/<script[\s\S]*?<\/script>/gi, ""))) {
      problems.push(`${where}: inline event handler (on…=) found`);
    }
    if (/(href|src)\s*=\s*["']\s*javascript:/i.test(html)) {
      problems.push(`${where}: javascript: URL found`);
    }
  }
  if (problems.length) {
    throw new Error(`Build check failed. The site must not ship JavaScript:\n  ${problems.join("\n  ")}`);
  }
}
