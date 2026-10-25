// Site-wide settings, available in every template as `site`.

import { defaultLocale, locales, ogLocale } from "../../lib/locales.js";

export default {
  name: "Xerodonia",
  legalName: "Xerodonia Pty Ltd",
  abn: "48 606 760 089",
  url: "https://xerodonia.com",
  email: "hello@xerodonia.com",
  location: "Sydney, Australia",
  // See lib/locales.js. `locale` is the Open Graph form (en_AU).
  defaultLocale,
  locales,
  locale: ogLocale(defaultLocale),
  // Where the press kits live: one GitHub release per product, tagged
  // press-<slug>, uploaded by the Marketing repo's update-website.sh.
  pressUrl: "https://github.com/pdarcey/xerodonia-website/releases/download",
  description:
    "Xerodonia makes small, private, carefully built apps for iPhone, iPad and Mac, and helps businesses put AI coding agents to work.",
  // TODO: confirm. Marked "needs confirmation" in the old consulting site.
  calendlyUrl: "https://calendly.com/calendly-xerodonia/10-15_minute_call",
  // The consulting MCP server's endpoint, once it's deployed (Stage 5c).
  // While empty, services.json and llms.txt simply don't mention it.
  mcpUrl: "https://xerodonia-mcp.autumn-glitter-b50d.workers.dev/mcp",
  // TelemetryDeck: anonymous visit counts, and the only script visitors get.
  // lib/build-check.js allows exactly this tag, and requires it on every page.
  telemetryDeck: {
    appId: "2B6D0C9E-C459-4538-A3D8-1E30ADE7116D",
    src: "https://cdn.telemetrydeck.com/websdk/telemetrydeck.min.js",
  },
  currentYear: new Date().getFullYear(),
  buildTime: new Date(),
};
