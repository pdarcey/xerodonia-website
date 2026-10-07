// Eleventy configuration for xerodonia.com.
//
// Node runs only at build time. Visitors receive plain HTML and CSS,
// with no JavaScript.

import path from "node:path";
import yaml from "js-yaml";
import Image from "@11ty/eleventy-img";
import { structuredData, toJsonLd } from "./lib/structured-data.js";
import { checkBuildOutput } from "./lib/build-check.js";
import { appStoreUrl } from "./lib/apps.js";

/** Responsive widths generated for raster images (icons render at 72–176 CSS px). */
const IMAGE_WIDTHS = [128, 256, 384];

/**
 * Renders a responsive `<picture>` (AVIF + WebP) for a raster image, with
 * explicit width and height so the layout doesn't shift. SVGs are passed
 * through as a plain `<img>`.
 *
 * @param {string} src Path relative to `src/`, e.g. "images/apps/blueprint.png".
 * @param {string} alt Alt text. Use "" for decorative images.
 * @param {string} sizes The `sizes` attribute.
 * @param {string} className Optional class for the `<img>`.
 * @param {string} loading "lazy" (default) or "eager" for above-the-fold images.
 * @param {number[]} widths Widths to generate; defaults to icon sizes. Screenshots pass larger ones.
 */
async function imageShortcode(src, alt, sizes = "100vw", className = "", loading = "lazy", widths = IMAGE_WIDTHS) {
  if (alt === undefined) {
    throw new Error(`Missing alt text for image: ${src}`);
  }
  const attributes = { alt, sizes, loading, decoding: "async" };
  if (className) attributes.class = className;

  if (src.endsWith(".svg")) {
    const classAttr = className ? ` class="${className}"` : "";
    return `<img src="/${src}" alt="${alt}"${classAttr} width="256" height="256" loading="${loading}" decoding="async">`;
  }

  const metadata = await Image(path.join("src", src), {
    widths,
    formats: ["avif", "webp"],
    outputDir: "_site/img/",
    urlPath: "/img/",
  });
  return Image.generateHTML(metadata, attributes);
}

/** Escapes a value for use inside an HTML attribute. */
function attr(value) {
  return String(value).replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;");
}

/** `srcset` text for one format's generated images. */
const srcset = (images) => images.map((image) => `${image.url} ${image.width}w`).join(", ");

/**
 * A screenshot with light and dark versions, as one `<picture>`: the dark
 * sources come first behind `(prefers-color-scheme: dark)`, so visitors in
 * dark mode get the dark screenshot automatically, with no JavaScript. Each
 * source carries its own width and height, so neither version shifts the
 * layout even when their sizes differ slightly.
 *
 * @param {string} src Light version, relative to `src/`.
 * @param {string|undefined} darkSrc Dark version; without it, this is a plain responsive image.
 * @param {string} alt Alt text (shared: both versions show the same content).
 * @param {string} sizes The `sizes` attribute.
 * @param {string} className Class for the `<img>`.
 * @param {number[]} widths Widths to generate.
 */
async function themedImageShortcode(src, darkSrc, alt, sizes, className = "", widths = [480, 800, 1200, 1800]) {
  if (alt === undefined) throw new Error(`Missing alt text for image: ${src}`);
  const options = { widths, formats: ["avif", "webp"], outputDir: "_site/img/", urlPath: "/img/" };
  const light = await Image(path.join("src", src), options);
  const dark = darkSrc ? await Image(path.join("src", darkSrc), options) : null;
  const size = (images) => {
    const largest = images.at(-1);
    return `width="${largest.width}" height="${largest.height}"`;
  };
  const sources = [];
  if (dark) {
    for (const format of ["avif", "webp"]) {
      sources.push(
        `<source media="(prefers-color-scheme: dark)" type="image/${format}" srcset="${srcset(dark[format])}" sizes="${attr(sizes)}" ${size(dark[format])}>`
      );
    }
  }
  sources.push(`<source type="image/avif" srcset="${srcset(light.avif)}" sizes="${attr(sizes)}" ${size(light.avif)}>`);
  const fallback = light.webp[0];
  // Landscape shots (e.g. a wide Mac window) are sized by width in CSS, portrait ones by height.
  const largest = light.webp.at(-1);
  const orientation = largest.width > largest.height ? "landscape" : "portrait";
  const classes = [className, className && `${className}--${orientation}`].filter(Boolean).join(" ");
  const classAttr = classes ? ` class="${attr(classes)}"` : "";
  return `<picture>${sources.join("")}<img src="${fallback.url}" srcset="${srcset(light.webp)}" sizes="${attr(sizes)}" alt="${attr(alt)}"${classAttr} ${size(light.webp)} loading="lazy" decoding="async"></picture>`;
}

export default function (eleventyConfig) {
  // App data lives in src/_data/apps/<slug>.yaml
  eleventyConfig.addDataExtension("yaml", (contents) => yaml.load(contents));

  // Static files copied as-is
  eleventyConfig.addPassthroughCopy("src/styles");
  eleventyConfig.addPassthroughCopy("src/images/*.svg");
  eleventyConfig.addPassthroughCopy("src/images/apps/*.svg");
  eleventyConfig.addPassthroughCopy("src/CNAME");
  eleventyConfig.addPassthroughCopy("src/favicon.ico");
  eleventyConfig.addPassthroughCopy("src/apple-touch-icon.png");
  eleventyConfig.addPassthroughCopy("src/images/og/*.jpg");

  eleventyConfig.addAsyncShortcode("image", imageShortcode);
  eleventyConfig.addAsyncShortcode("themedImage", themedImageShortcode);

  /** schema.org JSON-LD for a page (see lib/structured-data.js). Output with | safe. */
  eleventyConfig.addFilter("jsonLd", (data) => toJsonLd(structuredData(data)));

  // Fail the build if any executable <script> sneaks into the output, or any
  // JSON-LD block is invalid JSON. Visitors must never receive JavaScript.
  eleventyConfig.on("eleventy.after", async ({ dir }) => checkBuildOutput(dir.output));

  /** All apps and tools as an array, in display order. */
  eleventyConfig.addFilter("sortProducts", (apps) =>
    Object.values(apps).sort((a, b) => a.order - b.order)
  );

  /** The page URL for an app or tool. */
  eleventyConfig.addFilter("productUrl", (app) => `/apps/${app.slug}/`);

  // The App Store URL, or null until the app's status is "app-store".
  eleventyConfig.addFilter("appStoreUrl", appStoreUrl);

  /** Joins a list for prose: ["a", "b", "c"] → "a, b and c" (Australian style, no Oxford comma). */
  eleventyConfig.addFilter("listToProse", (items = []) =>
    items.length < 2 ? items.join("") : `${items.slice(0, -1).join(", ")} and ${items.at(-1)}`
  );

  /** Long Australian date, e.g. "5 October 2026". YAML dates are UTC midnight, so format in UTC. */
  eleventyConfig.addFilter("longDate", (date) =>
    new Date(date).toLocaleDateString("en-AU", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" })
  );

  /** Full ISO 8601 timestamp, for the Atom feed. */
  eleventyConfig.addFilter("isoDateTime", (date) => new Date(date).toISOString());

  /**
   * Picks consulting services by id, in the order given. Throws on an unknown
   * id so a typo in consulting.yaml fails the build instead of silently
   * dropping a pricing card.
   */
  eleventyConfig.addFilter("pickServices", (services, ids = []) =>
    ids.map((id) => {
      const service = services.find((candidate) => candidate.id === id);
      if (!service) throw new Error(`Unknown consulting service id: ${id}`);
      return service;
    })
  );

  /** Makes root-relative links absolute, for content syndicated in the feed. */
  eleventyConfig.addFilter("absoluteUrls", (html = "", base) =>
    html.replace(/(href|src)="\/(?!\/)/g, `$1="${base}/`)
  );

  /** ISO date (YYYY-MM-DD) for sitemaps and <time datetime>. */
  eleventyConfig.addFilter("isoDate", (date) => new Date(date).toISOString().split("T")[0]);

  return {
    dir: {
      input: "src",
      output: "_site",
      includes: "_includes",
      data: "_data",
    },
    templateFormats: ["njk", "md", "html", "11ty.js"],
    markdownTemplateEngine: "njk",
    htmlTemplateEngine: "njk",
  };
}
