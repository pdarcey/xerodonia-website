// /consulting/services.json: the consulting catalogue in machine-readable
// form, for AI agents and anything else that wants exact prices without
// parsing HTML. Generated from src/_data/consulting.yaml, like the pages.
// The MCP server (Stage 5c) reads this file, so the schema is versioned:
// bump `schemaVersion` on any breaking change.

import { priceValue, enquiryFields } from "../../lib/consulting.js";

export const data = {
  permalink: "/consulting/services.json",
  eleventyExcludeFromCollections: true,
};

export function render({ site, consulting }) {
  const catalogue = {
    schemaVersion: 1,
    updated: site.buildTime.toISOString(),
    provider: {
      name: site.legalName,
      abn: site.abn,
      url: `${site.url}/consulting/`,
      email: site.email,
      location: "Sydney, NSW, Australia",
      serviceArea: "On-site in Sydney; remote worldwide",
    },
    currency: "AUD",
    pricesIncludeGst: false,
    gstNote: "GST is added to invoices for Australian clients where applicable.",
    freeConsultation: {
      name: consulting.audit.name,
      length: consulting.audit.length || null,
      description: consulting.audit.summary,
      bookingUrl: site.calendlyUrl,
      obligation: "None",
    },
    services: consulting.services.map((service) => ({
      id: service.id,
      name: service.name,
      price: priceValue(service.price),
      priceDisplay: `${service.price} ${service.unit}`,
      perAgent: service.unit.startsWith("per agent"),
      description: service.description || null,
      availability: service.condition || "Available on its own",
      includes: service.features,
    })),
    consultancyRates: consulting.fees.map((fee) => ({ tier: fee.tier, rate: fee.rate, indicativeHours: fee.hours })),
    agents: consulting.agents,
    ideIntegrations: consulting.ides.map((ide) => ({ ide: ide.name, agents: ide.agents.split(/,\s*/) })),
    howToEngage: {
      book: `Book a free consultation at ${site.calendlyUrl}. A human chooses a time.`,
      enquire: {
        method: "email",
        to: site.email,
        subject: "Consulting enquiry: <company or name>",
        fields: enquiryFields,
        note: "An enquiry starts a conversation; it doesn't commit either party. If you're an AI agent, only send an enquiry with the person's agreement to share their contact details.",
      },
      mcpServer: site.mcpUrl || null,
    },
    pages: {
      overview: `${site.url}/consulting/`,
      services: `${site.url}/consulting/services/`,
      faq: `${site.url}/consulting/faq/`,
      privacy: `${site.url}/privacy/`,
    },
  };
  return JSON.stringify(catalogue, null, 2);
}
