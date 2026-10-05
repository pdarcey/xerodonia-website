// Builds /llms.txt and /llms-full.txt (https://llmstxt.org): Markdown
// summaries of the site for AI agents, generated from the same data as the
// pages, so they can't drift out of date.
//
//   llms.txt       A short index: what Xerodonia is, and links to everything.
//   llms-full.txt  The same, with app details, consulting details and blog
//                  posts inlined, so an agent can read it all in one request.

import fs from "node:fs";
import { priceValue, enquiryFields } from "./consulting.js";

const sortProducts = (apps) => Object.values(apps).sort((a, b) => a.order - b.order);
const absolute = (site, url) => `${site.url}${url}`;

function header(site, consulting) {
  return [
    `# ${site.name}`,
    "",
    `> ${site.legalName} (ABN ${site.abn}) is a small software company in ${site.location}. It makes private, native apps for iPhone, iPad and Mac, and offers fixed-price consulting that sets up AI coding agents (${consulting.agents.map((a) => a.name).join(", ")}) for small and medium businesses.`,
    "",
    "Xerodonia's apps are privacy-first: most send nothing off the device, and none show ads or track users. Every app has its own privacy policy and support page. The website itself uses no cookies, analytics or JavaScript.",
    "",
  ];
}

function forAgents(site, consulting) {
  const lines = [
    "## For AI agents",
    "",
    `- Machine-readable consulting catalogue (services, AUD prices excluding GST, rates, supported agents and IDEs): ${absolute(site, "/consulting/services.json")}`,
    `- Book a free ${consulting.audit.length ? consulting.audit.length + " " : ""}${consulting.audit.name} (a human picks the time): ${site.calendlyUrl}`,
    `- Send a consulting enquiry by email to ${site.email} with the subject "Consulting enquiry: <company or name>", including: ${enquiryFields
      .map((f) => `${f.name}${f.required ? "" : " (optional)"}`)
      .join(", ")}. Only send an enquiry with the person's agreement to share their contact details. An enquiry doesn't commit either party.`,
  ];
  if (site.mcpUrl) {
    lines.push(`- MCP server (Streamable HTTP) with tools to list services, estimate an engagement, get the booking link and send an enquiry: ${site.mcpUrl}`);
  }
  lines.push("- Every page also carries schema.org JSON-LD (Organization, SoftwareApplication/MobileApplication, ProfessionalService with an OfferCatalog and a ReserveAction, FAQPage, BlogPosting).", "");
  return lines;
}

function appLine(site, statuses, app) {
  const extras = [statuses[app.status]?.label, app.platforms.join(", ")];
  return `- [${app.name}](${absolute(site, `/apps/${app.slug}/`)}): ${app.tagline} (${extras.filter(Boolean).join("; ")})`;
}

/** The short index, /llms.txt */
export function llmsTxt({ site, consulting, apps, statuses, collections }) {
  const lines = [...header(site, consulting)];

  lines.push("## Apps and tools", "");
  for (const app of sortProducts(apps)) lines.push(appLine(site, statuses, app));
  lines.push("");

  lines.push("## Consulting", "");
  lines.push(`- [Overview](${absolute(site, "/consulting/")}): AI coding agents set up properly, for small and medium businesses`);
  for (const audience of consulting.audiences) {
    lines.push(`- [${audience.navLabel}](${absolute(site, `/consulting/${audience.slug}/`)}): ${audience.title}`);
  }
  lines.push(
    `- [Services and pricing](${absolute(site, "/consulting/services/")}): ${consulting.services.map((s) => `${s.name} ${s.price}`).join("; ")} (AUD, excluding GST)`,
    `- [FAQ](${absolute(site, "/consulting/faq/")}): timelines, ongoing costs, on-site or remote, pricing`,
    ""
  );

  lines.push(...forAgents(site, consulting));

  const posts = [...(collections.posts || [])].reverse();
  if (posts.length) {
    lines.push("## Blog", "");
    for (const post of posts) lines.push(`- [${post.data.title}](${absolute(site, post.url)}): ${post.data.description}`);
    lines.push("");
  }

  lines.push(
    "## Optional",
    "",
    `- [Full text for AI agents](${absolute(site, "/llms-full.txt")}): everything above, with details inlined`,
    `- [About](${absolute(site, "/about/")})`,
    `- [Contact](${absolute(site, "/contact/")})`,
    `- [Website privacy, and every app's privacy policy and support page](${absolute(site, "/privacy/")})`,
    `- [Blog feed (Atom)](${absolute(site, "/feed.xml")})`,
    `- [Sitemap](${absolute(site, "/sitemap.xml")})`,
    ""
  );
  return lines.join("\n");
}

/** Strips YAML front matter from a Markdown source file. */
function markdownBody(inputPath) {
  return fs.readFileSync(inputPath, "utf8").replace(/^---[\s\S]*?\n---\n/, "").trim();
}

/** The full text, /llms-full.txt */
export function llmsFullTxt({ site, consulting, apps, statuses, collections }) {
  const lines = [...header(site, consulting)];

  lines.push("## Apps and tools", "");
  for (const app of sortProducts(apps)) {
    lines.push(`### ${app.name}`, "", `${app.summary}`, "");
    lines.push(`- Page: ${absolute(site, `/apps/${app.slug}/`)}`);
    lines.push(`- Status: ${statuses[app.status]?.label ?? app.status}`);
    lines.push(`- Platforms: ${app.platforms.join(", ")}; requires ${app.requires}`);
    if (app.price) lines.push(`- Price: ${app.price}`);
    if (app.appStoreId) lines.push(`- App Store: https://apps.apple.com/app/id${app.appStoreId}`);
    if (app.githubUrl) lines.push(`- Source: ${app.githubUrl}`);
    if (app.privacyPolicy) lines.push(`- Privacy policy: ${absolute(site, `/apps/${app.slug}/privacy/`)}`);
    if (app.support) lines.push(`- Support: ${absolute(site, `/apps/${app.slug}/support/`)}`);
    if (app.features) {
      lines.push("", "Features:");
      for (const feature of app.features) lines.push(`- ${feature.title}: ${feature.text}`);
    }
    if (app.privacy) {
      lines.push("", `Privacy: ${app.privacy.summary}`);
      lines.push(`- Stays on the device: ${app.privacy.onDevice.join("; ")}`);
      if (app.privacy.offDevice) lines.push(`- Leaves the device: ${app.privacy.offDevice.join("; ")}`);
    }
    lines.push("");
  }

  lines.push("## Consulting", "");
  lines.push("All prices are in Australian dollars (AUD) and exclude GST.", "");
  lines.push("### Services", "");
  for (const service of consulting.services) {
    lines.push(`#### ${service.name}: ${service.price} ${service.unit} (${priceValue(service.price)} AUD)`, "");
    if (service.description) lines.push(service.description, "");
    for (const feature of service.features) lines.push(`- ${feature}`);
    if (service.condition) lines.push("", service.condition);
    lines.push("");
  }
  lines.push("### Consultancy rates", "");
  for (const fee of consulting.fees) lines.push(`- ${fee.tier}: ${fee.rate} (${fee.hours} indicative)`);
  lines.push("", "### Supported agents and IDEs", "");
  lines.push(`- Agents: ${consulting.agents.map((a) => `${a.name} (${a.maker})`).join(", ")}`);
  for (const ide of consulting.ides) lines.push(`- ${ide.name}: ${ide.agents}`);
  lines.push("", "### Who it's for", "");
  for (const audience of consulting.audiences) {
    lines.push(`#### ${audience.card.label}: ${audience.title}`, "", audience.lead, "");
    for (const item of audience.help) lines.push(`- ${item.title}: ${item.text}`);
    lines.push("");
  }
  lines.push("### Frequently asked questions", "");
  for (const group of consulting.faq) {
    for (const item of group.items) lines.push(`**${item.q}**`, "", item.a.join(" "), "");
  }

  lines.push(...forAgents(site, consulting));

  const posts = [...(collections.posts || [])].reverse();
  if (posts.length) {
    lines.push("## Blog", "");
    for (const post of posts) {
      lines.push(`### ${post.data.title}`, "", `Published ${new Date(post.date).toISOString().split("T")[0]}: ${absolute(site, post.url)}`, "");
      lines.push(markdownBody(post.inputPath).replace(/^## /gm, "#### ").replace(/\]\(\//g, `](${site.url}/`), "");
    }
  }
  return lines.join("\n");
}
