// Shared helpers for app data: used by the templates (as a filter), the
// JSON-LD and the llms.txt generators, so each rule lives in one place.

/**
 * The app's App Store URL, or null until it's actually on the App Store.
 *
 * An app's `appStoreId` exists as soon as its App Store Connect record does,
 * long before release, and its apps.apple.com page 404s until then. So the
 * site links it (button, Smart App Banner, JSON-LD, llms.txt) only once
 * `status` is "app-store".
 * @param {{ status?: string, appStoreId?: string | number }} app
 * @returns {string | null}
 */
export function appStoreUrl(app) {
  if (app?.status !== "app-store" || !app.appStoreId) return null;
  return `https://apps.apple.com/app/id${app.appStoreId}`;
}
