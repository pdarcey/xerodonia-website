// Site-wide settings, available in every template as `site`.

export default {
  name: "Xerodonia",
  legalName: "Xerodonia Pty Ltd",
  abn: "48 606 760 089",
  url: "https://xerodonia.com",
  email: "hello@xerodonia.com",
  location: "Sydney, Australia",
  locale: "en_AU",
  description:
    "Xerodonia makes small, private, carefully built apps for iPhone, iPad and Mac, and helps businesses put AI coding agents to work.",
  // TODO: confirm. Marked "needs confirmation" in the old consulting site.
  calendlyUrl: "https://calendly.com/calendly-xerodonia/10-15_minute_call",
  // The consulting MCP server's endpoint, once it's deployed (Stage 5c).
  // While empty, services.json and llms.txt simply don't mention it.
  mcpUrl: "",
  currentYear: new Date().getFullYear(),
  buildTime: new Date(),
};
