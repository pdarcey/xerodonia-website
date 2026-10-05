// Eleventy configuration for xerodonia.com.
//
// Node runs only at build time. Visitors receive plain HTML and CSS,
// with no JavaScript.

import path from "node:path";
import yaml from "js-yaml";
import Image from "@11ty/eleventy-img";

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
 */
async function imageShortcode(src, alt, sizes = "100vw", className = "", loading = "lazy") {
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
    widths: IMAGE_WIDTHS,
    formats: ["avif", "webp"],
    outputDir: "_site/img/",
    urlPath: "/img/",
  });
  return Image.generateHTML(metadata, attributes);
}

export default function (eleventyConfig) {
  // App data lives in src/_data/apps/<slug>.yaml
  eleventyConfig.addDataExtension("yaml", (contents) => yaml.load(contents));

  // Static files copied as-is
  eleventyConfig.addPassthroughCopy("src/styles");
  eleventyConfig.addPassthroughCopy("src/images/*.svg");
  eleventyConfig.addPassthroughCopy("src/images/apps/*.svg");
  eleventyConfig.addPassthroughCopy("src/CNAME");

  eleventyConfig.addAsyncShortcode("image", imageShortcode);

  /** All apps and tools as an array, in display order. */
  eleventyConfig.addFilter("sortProducts", (apps) =>
    Object.values(apps).sort((a, b) => a.order - b.order)
  );

  /** The page URL for an app or tool. */
  eleventyConfig.addFilter("productUrl", (app) => `/apps/${app.slug}/`);

  /** Joins a list for prose: ["a", "b", "c"] → "a, b and c" (Australian style, no Oxford comma). */
  eleventyConfig.addFilter("listToProse", (items = []) =>
    items.length < 2 ? items.join("") : `${items.slice(0, -1).join(", ")} and ${items.at(-1)}`
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
    templateFormats: ["njk", "md", "html"],
    markdownTemplateEngine: "njk",
    htmlTemplateEngine: "njk",
  };
}
