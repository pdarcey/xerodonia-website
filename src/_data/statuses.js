// Release statuses an app or tool can have. Set `status:` in an app's YAML
// to one of these keys. The label appears on product cards; the key also
// becomes a CSS class (`status--<key>`) and decides which buttons the
// app page shows (see _includes/partials/get-actions.njk).

export default {
  "in-development": { label: "Coming soon" },
  "testflight-soon": { label: "TestFlight soon" },
  testflight: { label: "Beta on TestFlight" },
  "app-store": { label: "On the App Store" },
  "free-download": { label: "Free download" },
  "in-house": { label: "Built in-house" },
};
