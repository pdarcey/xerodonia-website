// Builds the schema.org JSON-LD for a page, from the same data files that
// render it. Rendered by base.njk as <script type="application/ld+json">,
// which is data, not executable JavaScript (decision 8 in Plan.md).
//
// Every page gets the Organization and WebSite nodes; templates add more by
// declaring `pageType` in their front matter:
//   app · app-privacy · app-support · consulting · consulting-services ·
//   consulting-faq · consulting-audience · post · blog

import { priceValue } from "./consulting.js";

/** Stable @id helpers, so nodes can reference each other across pages. */
const ids = (site) => ({
  org: `${site.url}/#organization`,
  website: `${site.url}/#website`,
  consulting: `${site.url}/consulting/#service`,
});

function organization(site) {
  return {
    "@type": "Organization",
    "@id": ids(site).org,
    name: site.legalName,
    alternateName: site.name,
    url: `${site.url}/`,
    logo: `${site.url}/apple-touch-icon.png`,
    email: site.email,
    taxID: `ABN ${site.abn}`,
    address: { "@type": "PostalAddress", addressLocality: "Sydney", addressRegion: "NSW", addressCountry: "AU" },
    sameAs: ["https://github.com/pdarcey"],
  };
}

function website(site) {
  return {
    "@type": "WebSite",
    "@id": ids(site).website,
    url: `${site.url}/`,
    name: site.name,
    description: site.description,
    inLanguage: "en-AU",
    publisher: { "@id": ids(site).org },
  };
}

function breadcrumbs(site, trail) {
  return {
    "@type": "BreadcrumbList",
    itemListElement: trail.map(([name, url], index) => ({
      "@type": "ListItem",
      position: index + 1,
      name,
      item: `${site.url}${url}`,
    })),
  };
}

/** An app or tool. iPhone/iPad apps are MobileApplication; the rest SoftwareApplication. */
function application(site, app) {
  const isMobile = app.platforms.some((p) => p === "iPhone" || p === "iPad");
  const node = {
    "@type": isMobile ? "MobileApplication" : "SoftwareApplication",
    "@id": `${site.url}/apps/${app.slug}/#app`,
    name: app.name,
    description: app.summary,
    url: `${site.url}/apps/${app.slug}/`,
    image: `${site.url}/images/og/${app.slug}.jpg`,
    applicationCategory: app.appCategory,
    operatingSystem: app.requires,
    inLanguage: app.languages,
    publisher: { "@id": ids(site).org },
    author: { "@id": ids(site).org },
  };
  if (app.features) node.featureList = app.features.map((f) => f.title);
  if (app.price === "Free") {
    node.isAccessibleForFree = true;
    node.offers = { "@type": "Offer", price: 0, priceCurrency: "AUD" };
  }
  if (app.appStoreId) node.installUrl = `https://apps.apple.com/app/id${app.appStoreId}`;
  if (app.downloadUrl) node.downloadUrl = app.downloadUrl;
  if (app.githubUrl) node.sameAs = [app.githubUrl];
  if (app.privacyPolicy) node.privacyPolicy = `${site.url}/apps/${app.slug}/privacy/`;
  return node;
}

/** Question-and-answer pairs → FAQPage. `answers` may be a string or a list of paragraphs. */
function faqPage(items) {
  return {
    "@type": "FAQPage",
    mainEntity: items.map(({ q, a }) => ({
      "@type": "Question",
      name: q,
      acceptedAnswer: { "@type": "Answer", text: Array.isArray(a) ? a.join(" ") : a },
    })),
  };
}

/** e.g. "$5,000–$30,000 AUD excl. GST", from the cheapest and dearest service. */
function priceRange(services) {
  const values = services.map((service) => priceValue(service.price));
  const format = (n) => `$${n.toLocaleString("en-AU")}`;
  return `${format(Math.min(...values))}–${format(Math.max(...values))} AUD excl. GST`;
}

/** The consulting practice, its priced services, and how to book. */
function consultingService(site, consulting) {
  return {
    "@type": "ProfessionalService",
    "@id": ids(site).consulting,
    name: `${site.name} AI consulting`,
    description:
      "Fixed-price consulting that sets up AI coding agents (Claude Code, Codex, Copilot, Gemini) for small and medium businesses: analysis, implementation, training and documentation.",
    url: `${site.url}/consulting/`,
    image: `${site.url}/images/og/consulting.jpg`,
    email: site.email,
    provider: { "@id": ids(site).org },
    areaServed: [{ "@type": "City", name: "Sydney" }, { "@type": "Place", name: "Worldwide (remote)" }],
    knowsAbout: [...consulting.agents.map((a) => a.name), "AI coding agents", "developer productivity"],
    priceRange: priceRange(consulting.services),
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "AI consulting services",
      itemListElement: consulting.services.map((service) => ({
        "@type": "Offer",
        "@id": `${site.url}/consulting/services/#${service.id}`,
        name: service.name,
        description: [service.description, ...service.features, service.condition].filter(Boolean).join(". "),
        price: priceValue(service.price),
        priceCurrency: "AUD",
        priceSpecification: {
          "@type": "UnitPriceSpecification",
          price: priceValue(service.price),
          priceCurrency: "AUD",
          valueAddedTaxIncluded: false,
          ...(service.unit.startsWith("per agent") ? { unitText: "per agent" } : {}),
        },
        url: `${site.url}/consulting/services/`,
        seller: { "@id": ids(site).org },
      })),
    },
    potentialAction: {
      "@type": "ReserveAction",
      name: `Book a free ${consulting.audit.length ? consulting.audit.length + " " : ""}${consulting.audit.name}`,
      target: {
        "@type": "EntryPoint",
        urlTemplate: site.calendlyUrl,
        actionPlatform: ["https://schema.org/DesktopWebPlatform", "https://schema.org/MobileWebPlatform"],
      },
      result: { "@type": "Reservation", name: consulting.audit.name },
    },
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "sales",
      email: site.email,
      areaServed: "Worldwide",
      availableLanguage: "English",
    },
  };
}

function blogPosting(site, data) {
  return {
    "@type": "BlogPosting",
    headline: data.title,
    description: data.description,
    datePublished: new Date(data.page.date).toISOString(),
    url: `${site.url}${data.page.url}`,
    image: `${site.url}/images/og/default.jpg`,
    inLanguage: "en-AU",
    author: { "@id": ids(site).org },
    publisher: { "@id": ids(site).org },
    isPartOf: { "@id": ids(site).website },
  };
}

/**
 * The full @graph for one page.
 * @param {object} data  Eleventy page data (needs site, consulting, page, and app/title/description as relevant)
 */
export function structuredData(data) {
  const { site, consulting, app } = data;
  const graph = [organization(site), website(site)];

  switch (data.pageType) {
    case "app":
      graph.push(application(site, app), breadcrumbs(site, [["Home", "/"], ["Apps", "/apps/"], [app.name, data.page.url]]));
      break;
    case "app-privacy":
      graph.push(breadcrumbs(site, [["Home", "/"], [app.name, `/apps/${app.slug}/`], ["Privacy policy", data.page.url]]));
      break;
    case "app-support":
      graph.push(
        faqPage(app.support.faq.map(({ q, a }) => ({ q, a }))),
        breadcrumbs(site, [["Home", "/"], [app.name, `/apps/${app.slug}/`], ["Support", data.page.url]])
      );
      break;
    case "consulting":
    case "consulting-services":
    case "consulting-audience":
      graph.push(consultingService(site, consulting));
      break;
    case "consulting-faq":
      graph.push(consultingService(site, consulting), faqPage(consulting.faq.flatMap((group) => group.items)));
      break;
    case "post":
      graph.push(blogPosting(site, data), breadcrumbs(site, [["Home", "/"], ["Blog", "/blog/"], [data.title, data.page.url]]));
      break;
    default:
      break;
  }
  return { "@context": "https://schema.org", "@graph": graph };
}

/**
 * Serialises JSON-LD for embedding in HTML. Escapes "<" so content can never
 * close the <script> element early.
 */
export function toJsonLd(object) {
  return JSON.stringify(object).replace(/</g, "\\u003c");
}
