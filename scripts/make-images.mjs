// Generates the site's favicon fallbacks and Open Graph (link-preview) images.
//
//   npm run images
//
// Output is committed. Run it on a Mac after changing an app's name, tagline
// or icon, or adding an app. Text is rendered with the Mac's system font,
// so results would differ on GitHub's Linux build machines; that's why
// this isn't part of the build.

import fs from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";
import yaml from "js-yaml";

const ROOT = path.resolve(import.meta.dirname, "..");
const SRC = path.join(ROOT, "src");
const OG_DIR = path.join(SRC, "images", "og");
const MARK = path.join(SRC, "images", "xerodonia-mark.svg");
const WIDTH = 1200;
const HEIGHT = 630;
const FONT = "'.SF NS', 'SF Pro Display', 'Helvetica Neue', Arial, sans-serif";

/** Escapes text for use inside SVG markup. */
function escapeXml(text) {
  return String(text).replace(/[<>&'"]/g, (c) => ({ "<": "&lt;", ">": "&gt;", "&": "&amp;", "'": "&apos;", '"': "&quot;" })[c]);
}

/** Greedy word wrap, measured in characters (good enough for a headline font). */
function wrap(text, maxChars, maxLines) {
  const lines = [];
  let line = "";
  for (const word of String(text).split(/\s+/)) {
    if ((line + " " + word).trim().length > maxChars && line) {
      lines.push(line);
      line = word;
    } else {
      line = (line + " " + word).trim();
    }
  }
  if (line) lines.push(line);
  if (lines.length > maxLines) {
    lines.length = maxLines;
    lines[maxLines - 1] = lines[maxLines - 1].replace(/[\s,.;:]*\S*$/, "") + "…";
  }
  return lines;
}

/** Base-64 data URI for an image file, resized to `size` px square. */
async function dataUri(file, size) {
  const png = await sharp(file).resize(size, size).png().toBuffer();
  return `data:image/png;base64,${png.toString("base64")}`;
}

/**
 * Builds one 1200×630 card: the Liquid Glass background, the Xerodonia mark,
 * a title, a subtitle and an optional icon on the right.
 */
async function card({ file, eyebrow, title, subtitle, icon, accent = "#2f6cf6" }) {
  const hasIcon = Boolean(icon);
  const titleLines = wrap(title, hasIcon ? 18 : 24, 2);
  const subtitleLines = wrap(subtitle, hasIcon ? 44 : 58, 3);
  const titleSize = titleLines.length > 1 ? 72 : 84;
  // One-line titles sit lower, so the eyebrow clears the logo row.
  const titleTop = titleLines.length > 1 ? 262 : 300;
  const subtitleTop = titleTop + titleLines.length * (titleSize * 1.08) + 22;

  const markUri = await dataUri(MARK, 64);
  const iconUri = hasIcon ? await dataUri(icon, 320) : "";

  const svg = `
  <svg xmlns="http://www.w3.org/2000/svg" width="${WIDTH}" height="${HEIGHT}">
    <defs>
      <radialGradient id="g1" cx="10%" cy="0%" r="70%"><stop offset="0" stop-color="${accent}" stop-opacity=".40"/><stop offset="1" stop-color="${accent}" stop-opacity="0"/></radialGradient>
      <radialGradient id="g2" cx="95%" cy="15%" r="60%"><stop offset="0" stop-color="#8b5cf6" stop-opacity=".28"/><stop offset="1" stop-color="#8b5cf6" stop-opacity="0"/></radialGradient>
      <radialGradient id="g3" cx="50%" cy="110%" r="60%"><stop offset="0" stop-color="#f8b93d" stop-opacity=".30"/><stop offset="1" stop-color="#f8b93d" stop-opacity="0"/></radialGradient>
      <filter id="shadow" x="-30%" y="-30%" width="160%" height="160%"><feDropShadow dx="0" dy="24" stdDeviation="28" flood-color="${accent}" flood-opacity=".45"/></filter>
      <clipPath id="squircle"><rect x="0" y="0" width="320" height="320" rx="72"/></clipPath>
    </defs>
    <rect width="100%" height="100%" fill="#eef2fb"/>
    <rect width="100%" height="100%" fill="url(#g1)"/>
    <rect width="100%" height="100%" fill="url(#g2)"/>
    <rect width="100%" height="100%" fill="url(#g3)"/>
    <image href="${markUri}" x="80" y="72" width="56" height="56"/>
    <text x="152" y="113" font-family="${FONT}" font-size="34" font-weight="700" fill="#0b1222">Xerodonia</text>
    ${eyebrow ? `<text x="80" y="${titleTop - titleSize - 4}" font-family="${FONT}" font-size="26" font-weight="600" fill="#4a5568">${escapeXml(eyebrow)}</text>` : ""}
    ${titleLines.map((line, i) => `<text x="80" y="${titleTop + i * titleSize * 1.08}" font-family="${FONT}" font-size="${titleSize}" font-weight="800" letter-spacing="-2" fill="#0b1222">${escapeXml(line)}</text>`).join("")}
    ${subtitleLines.map((line, i) => `<text x="80" y="${subtitleTop + i * 40}" font-family="${FONT}" font-size="30" fill="#4a5568">${escapeXml(line)}</text>`).join("")}
    ${hasIcon ? `<g transform="translate(800 155)" filter="url(#shadow)"><g clip-path="url(#squircle)"><image href="${iconUri}" width="320" height="320"/></g></g>` : ""}
    <text x="80" y="${HEIGHT - 60}" font-family="${FONT}" font-size="24" font-weight="600" fill="#1d55d6">xerodonia.com</text>
  </svg>`;
  // JPEG: smooth gradients compress far better than as PNG (~60 KB vs ~250 KB).
  await sharp(Buffer.from(svg)).jpeg({ quality: 86, mozjpeg: true }).toFile(path.join(OG_DIR, file));
  console.log(`Wrote src/images/og/${file}`);
}

/** Wraps a PNG in an ICO container (PNG-in-ICO is valid in every browser that still asks for /favicon.ico). */
function pngToIco(png, size) {
  const header = Buffer.alloc(22);
  header.writeUInt16LE(0, 0); // reserved
  header.writeUInt16LE(1, 2); // type: icon
  header.writeUInt16LE(1, 4); // one image
  header.writeUInt8(size, 6); // width
  header.writeUInt8(size, 7); // height
  header.writeUInt8(0, 8); // palette colours
  header.writeUInt8(0, 9); // reserved
  header.writeUInt16LE(1, 10); // colour planes
  header.writeUInt16LE(32, 12); // bits per pixel
  header.writeUInt32LE(png.length, 14); // image size
  header.writeUInt32LE(22, 18); // image offset
  return Buffer.concat([header, png]);
}

async function favicons() {
  const png32 = await sharp(MARK).resize(32, 32).png().toBuffer();
  await fs.writeFile(path.join(SRC, "favicon.ico"), pngToIco(png32, 32));
  // Apple touch icons get no transparency (iOS fills it black), so flatten onto the brand blue.
  await sharp(MARK).resize(180, 180).flatten({ background: "#2f6cf6" }).png().toFile(path.join(SRC, "apple-touch-icon.png"));
  console.log("Wrote src/favicon.ico and src/apple-touch-icon.png");
}

async function main() {
  await fs.mkdir(OG_DIR, { recursive: true });
  await favicons();

  await card({
    file: "default.jpg",
    eyebrow: "Independent Apple developer · Sydney",
    title: "Thoughtful apps for iPhone, iPad and Mac",
    subtitle: "Small, private, carefully built apps, and practical AI consulting.",
  });

  await card({
    file: "consulting.jpg",
    eyebrow: "AI consulting · Sydney and worldwide",
    title: "AI coding agents, set up properly",
    subtitle: "Claude Code, Codex, Copilot and Gemini: analysis, setup, training and documentation, at a fixed price.",
  });

  const appsDir = path.join(SRC, "_data", "apps");
  for (const name of await fs.readdir(appsDir)) {
    if (!name.endsWith(".yaml")) continue;
    const app = yaml.load(await fs.readFile(path.join(appsDir, name), "utf8"));
    await card({
      file: `${app.slug}.jpg`,
      eyebrow: app.category,
      title: app.name,
      subtitle: app.tagline,
      icon: path.join(SRC, app.icon),
      accent: app.accent,
    });
  }
}

await main();
