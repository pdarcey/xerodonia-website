// The locales the site publishes, in one place. Only the default exists today,
// but everything locale-dependent reads from here, because other languages are
// coming (Marketing repo decision, 21 Oct 2026). Screenshot data is keyed by
// locale (src/_data/screenshots/), and pages fall back to the default.
//
// Also read by the Marketing repo's scripts/helpers/import-website.mjs, which
// copies screenshots only for these locales.

/** BCP 47 tag of the site's main locale (HTML lang, dates, prices). */
export const defaultLocale = "en-AU";

/** Every locale the site publishes, the default first. */
export const locales = [defaultLocale];

/** Open Graph form of a locale: en-AU → en_AU. */
export const ogLocale = (locale) => locale.replace("-", "_");
