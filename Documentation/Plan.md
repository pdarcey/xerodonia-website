# xerodonia.com — Rebuild Plan

*Drafted 2026-10-05. Status (end of session, 2026-10-06 afternoon): **Stages 1–5c live; 5d well along.** Upcoming Birthdays has screenshots on all three platforms (iPhone widgets and list, iPad widgets, Mac list, Choose People sheet and details). Blueprint and Clarity have Mac shots. Next: Borderstamp (see "Next session" below).*

## Goals

- The marketing home for Xerodonia's apps, tools and consulting services, plus a blog.
- It also provides the **Privacy Policy and Support URLs** that App Store Connect requires.
- Visitors get only HTML and CSS: **no JavaScript, no trackers, no cookies.**
- Modern and clean, quick to load, and good modern SEO.
- Free hosting at `xerodonia.com`.
- A simple update process, with release notes published automatically where possible.

## What we're starting from

| Item | Source repo | Status | Platforms (from pbxproj) | Notes |
|---|---|---|---|---|
| **Blueprint** | `Apps/Blueprint` | About to enter TestFlight | iPhone, iPad, Mac | Was called "Cockpit". Uses TelemetryDeck and ClarityFeedbackKit, and its privacy manifest declares *Customer Support* and *Other Diagnostic Data*. Reads Contacts, Calendar, Reminders, HealthKit and WeatherKit. An Xcode privacy report PDF already exists. |
| **Borderstamp** | `Apps/Border Apps/Borderstamp` | About to enter TestFlight | iPhone, iPad, Mac | "A digital passport for the real world". Uses location, keeps everything on-device, no servers. Bundle ID is `com.borderstamp.2026.*`. **No privacy manifest found.** |
| **Clarity** | `Apps/Clarity` | Not for sale (showcase) | Mac (GUI + CLI + MCP server) | Has a notarised DMG pipeline (`scripts/build-dmg.sh`) and a `VersionHistory.md`. |
| **Scoreboard** | `Apps/Scoreboard/Scoreboard` | In development, so "Coming soon" | iPhone, iPad | Australian sports scores, widgets and Siri. Uses TelemetryDeck and has a privacy manifest. |
| **Upcoming Birthdays** | `Apps/Upcoming Birthdays` | About to enter TestFlight | iPhone, iPad, Mac | Reads Contacts. **No analytics SDK found in the code**, yet the current site's privacy text says it uses one, so this needs checking. No privacy manifest found. |
| **obfuscate** | `CLI/obfuscate` | v1.0.0, free | macOS 26 CLI | So far it's only distributed by building from source. A DMG will need Developer ID signing and notarisation; Clarity's script can be reused. |
| **AI Consulting** | `Websites/AI Consulting` | Built, never deployed | — | An Eleventy 3 site with 11 pages and 1 blog post. It uses `nav.js` (which would have to go) and is configured for `xerodonia.com.au`, **which doesn't currently resolve**. It isn't a git repository. |

The apps on the current site that aren't in this list (Travel Bingo, Distance Mapper, Slideshow, Swimming Timer, RomanX, Disk Catalogue, Safari Extensions) are **dropped** (confirmed 2026-10-05). Others may be added later, so the site is built to expect more apps.

### Domain and DNS (checked 2026-10-05)
- `xerodonia.com` is registered with Tucows until **2028-02-24**.
- Its nameservers are **Fastmail** (`ns1/ns2.messagingengine.com`).
- **Email is live on Fastmail.** The MX records point to `us1/us2-smtp.messagingengine.com`, and there will also be DKIM and SPF records. **None of these may be touched.**
- The apex and `www` A records currently point to Fastmail's own web hosting (`103.168.172.37/.52`).
- **`borderstamp.com` (DNS at Fastmail) and `borderstamp.app` (DNS at Hover) redirect to `/apps/borderstamp/`** (done 2026-10-06, Clarity #476). Each domain has its own tiny GitHub Pages repo, `pdarcey/borderstamp-com` and `pdarcey/borderstamp-app`, because a Pages site can have only one custom domain. Their `index.html` and `404.html` use a meta refresh plus a canonical link. HTTPS is enforced. Both domains' MX records point to Fastmail; leave them alone.

---

## 1. Deployment plan

### Recommendation: Eleventy and GitHub Pages, with DNS left at Fastmail

**Static site generator: Eleventy 3**, the same tool the AI Consulting site already uses.
- Node runs only on Paul's Mac and on GitHub's build servers. Visitors get plain HTML and CSS with **zero client-side JavaScript**.
- It lets us share the header, footer and layouts, write blog posts in Markdown, keep app details in data files, and generate the sitemap, RSS feed and per-app pages. That removes the copy-paste problem the current site has.
- It also means the consulting site can be ported almost unchanged.

**Hosting: GitHub Pages**, built and deployed by GitHub Actions.
- It's free, HTTPS comes free (Let's Encrypt), and it's served from a CDN. That's plenty for low traffic: a 1 GB site and roughly 100 GB of bandwidth a month (a soft limit).
- ⚠️ The free plan **requires the site repo to be public.** The content is public anyway, but this needs Paul's OK.
- **DNS stays at Fastmail.** In Fastmail → Settings → Domains → xerodonia.com → DNS:
  1. Turn off Fastmail's own website hosting for the domain, which removes the `103.168.172.x` A records.
  2. Add apex A records `185.199.108.153`, `185.199.109.153`, `185.199.110.153` and `185.199.111.153`, plus AAAA records `2606:50c0:8000::153` to `8003::153`.
  3. Add `www` as a CNAME to `pdarcey.github.io`.
  4. Add the TXT record GitHub provides to verify the domain, which stops anyone else claiming it.
  5. **Leave the MX, DKIM, SPF and DMARC records alone.**
- In the repo's Pages settings, set the custom domain to `xerodonia.com` and turn on **Enforce HTTPS**.

**Alternative: Cloudflare Pages.** This keeps the repo private, with unlimited bandwidth and preview URLs for each branch. However, an apex domain on Cloudflare means moving the nameservers to Cloudflare and recreating every Fastmail email record. That's more work and more risk to email, so this is the fallback only if the repo must stay private.

### The update process (day to day)

```
edit Markdown or data file  →  npm run serve (preview at localhost:8080)
                            →  git commit && git push
                            →  GitHub Action builds and deploys (~1 minute)
```
- **New blog post:** add `src/content/blog/<slug>.md` with front matter.
- **App change:** edit `src/_data/apps/<slug>.yaml`.
- **Release notes:** automatic (see §6).

---

## 2. Five designs

All five designs share **the same HTML**. Each one is a different set of CSS design tokens plus its own component styles. That makes it cheap to switch later, and means the designs can be compared side by side on real content.

Rules all five follow:
- **System fonts only**: `-apple-system` / `ui-serif` (New York) / `ui-monospace` (SF Mono). No font downloads.
- Light and dark modes from `prefers-color-scheme`.
- Respects `prefers-reduced-motion`.
- WCAG 2.2 AA contrast.
- Built on the corporate colours **#2f6cf6** (blue) and **#f8b93d** (amber).

| # | Name | Feel | Signature elements | Best for |
|---|---|---|---|---|
| 1 | **Liquid Glass** | Matches Apple's iOS 26 look | Frosted translucent cards (`backdrop-filter`), soft blue-to-violet mesh gradients, large app icons with depth, pill-shaped buttons | Consumer apps (Birthdays, Blueprint, Borderstamp) |
| 2 | **Editorial** | An independent studio's magazine | `ui-serif` headlines, generous white space, each app presented as a long-form feature, the blog given equal weight with apps, pull quotes | Blog and consulting credibility |
| 3 | **Blueprint** | Engineering drawing | Faint grid-paper background, SF Mono labels and "dimension lines", outlined line art, amber annotations on blue | Dev tools (Clarity, obfuscate) and the "slightly techie" consulting brief |
| 4 | **Bento** | Keynote-slide tiles | A CSS-grid mosaic of tiles in different sizes, each app tile in its own icon colour, dark by default, small stat chips ("Mac · iPhone · iPad") | Showing many products at once |
| 5 | **Swiss Minimal** | Fast and calm | Black and white with a single amber accent, very large type, strict grid, hairline rules, the smallest CSS of the five | Fastest pages, ages best |

**How we'd choose:** build each design as a static **mockup of the home page and one app page** using real Blueprint content, in `Design Mockups/1-liquid-glass/` and so on. Paul compares them in Safari, picks one (or mixes elements), and we throw the rest away.

### No-JavaScript patterns (any design)
| Need | Solution without JS |
|---|---|
| Mobile menu | `<details><summary>Menu</summary><nav>…</nav></details>` |
| Screenshot lightbox | `:target` overlays (the current site already does this) or a horizontal `scroll-snap` gallery |
| FAQ / privacy expanders | `<details>` |
| Booking a consult | A plain link to Calendly (no embedded widget) |
| Contact | A `mailto:` link. No form, so no third-party form processor is needed. |
| Site search | A GET form to `duckduckgo.com/?q=site:xerodonia.com+…` (optional) |
| Smart App Banner | `<meta name="apple-itunes-app" content="app-id=…">`. Safari renders it natively. |

---

## 3. Site structure and content

```
/                                  Home: hero, apps, tools, consulting teaser, latest posts
/apps/                             All apps
/apps/<slug>/                      App page: hero, features, screenshots, platforms, get-it
/apps/<slug>/privacy/              ← App Store Connect "Privacy Policy URL"
/apps/<slug>/support/              ← App Store Connect "Support URL" (FAQ + contact)
/apps/<slug>/releases/             Version history (automated, §7)
                                   Tools (e.g. obfuscate) live under /apps/ too, with kind: tool
/consulting/ (+ /for-skeptics/, /for-operators/, /for-innovators/, /services/, /faq/)
/blog/, /blog/<slug>/, /feed.xml   Blog with an Atom feed
/about/, /contact/, /privacy/      Company pages; /privacy/ = the website's own privacy policy
/press/                            Optional press kit (icons, screenshots, boilerplate)
/sitemap.xml, /robots.txt, /404.html, /.well-known/security.txt
```

Each app is described by one data file (`src/_data/apps/blueprint.yaml`), and every page about that app is generated from it:
```yaml
name: Blueprint
slug: blueprint
tagline: What's coming up today?
status: testflight        # coming-soon | testflight | app-store | showcase | free-download
platforms: [iPhone, iPad, Mac]
minimumOS: { iOS: "26", macOS: "26" }
appStoreId: null          # filled in once ASC creates the record
testFlightUrl: null       # public TestFlight link, if any
price: Free
category: Productivity
features: [...]
privacy:
  collects: [Diagnostics (anonymous, TelemetryDeck), Support messages you send]
  onDeviceOnly: [Contacts, Calendar, Reminders, Health, Location]
  thirdParties: [TelemetryDeck]
screenshots: [...]
```

---

## 4. Content and assets: what we need, and what the repos can provide

✅ = can be derived from the repo · ✍️ = Claude drafts it, Paul approves · 📸 = needs creating · ❓ = Paul to supply

| Asset | Blueprint | Borderstamp | Clarity | Scoreboard | Birthdays | obfuscate |
|---|---|---|---|---|---|---|
| Name, tagline, description | ✍️ README + Design Document | ✍️ README + Project Definition | ✍️ Readme (very detailed) | ✍️ Readme | ✍️ Readme | ✍️ Readme |
| Feature list | ✅ Design Document | ✍️ Project Definition | ✅ Readme | ✅ Readme | ✅ Readme | ✅ Readme (options table) |
| Platforms and minimum OS | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| App icon (1024 px plus web sizes) | ✅ export `AppIcon.icon` | ✅ export `Borderstamp.icon` | ✅ `Clarity.png` / `.icon` | ✅ asset catalogue | ✅ export `AppIcon.icon` | 📸 none; needs a glyph |
| Screenshots | 📸 | 📸 | 📸 (some mockup JPGs exist) | 📸 | 📸 | ✅ terminal sample in the Readme (render as styled HTML text, not an image) |
| Privacy facts | ✅ `PrivacyInfo.xcprivacy` + privacy report PDF | ⚠️ no manifest | ✅ code review | ✅ manifest | ⚠️ no manifest; analytics claim unverified | ✅ (none collected) |
| Release history | ✅ git tags | ✅ git tags | ✅ `VersionHistory.md` | ✅ git tags | ✅ git tags | ✅ v1.0.0 tag |
| Download | — | — | ✅ notarised DMG (`build-dmg.sh`) if offered | — | — | 📸 a notarised DMG still needs making |

The icon export can be scripted with Icon Composer's `ictool`, which ships inside Xcode.

**Screenshots:** none exist in any repo. Capture them **once, at App Store sizes** so they serve both App Store Connect and the website:
- iPhone 6.9"
- iPad 13"
- Mac 2880×1800

This can be scripted with `xcrun simctl io booted screenshot` (or UI-test snapshots) against demo data. Eleventy Image then converts them at build time to responsive AVIF/WebP with width and height attributes. That keeps pages light and avoids layout shift.

**Site-wide content:**

| Item | Source |
|---|---|
| Consulting pages | ✅ ported from `AI Consulting/src`. Change `.com.au` to `.com` and replace `nav.js` with `<details>`. |
| Consulting blog post | ✅ ported as-is |
| Company details | ✅ ABN 48 606 760 089, Sydney, corporate colours |
| Contact email | ❓ is `hello@xerodonia.com` set up on Fastmail? |
| Calendly link | ❓ still marked "needs confirmation" in the consulting site's status file |
| Logo / wordmark | ✍️ start from the consulting site's `favicon.svg`. A proper SVG wordmark is ❓/📸. |
| Favicon set | 📸 SVG favicon, `apple-touch-icon.png`, and `favicon.ico` fallback |
| Open Graph images (1200×630) | 📸 one site-wide image and one per app. Generated at build time from a template, or made once by hand. |
| About page | ✍️ needs Paul's input: bio, optional photo |
| Website privacy policy | ✍️ |
| Terms / licence for obfuscate | ✅ `LICENSE` file |

---

## 5. What we need from App Store Connect

**From ASC to the website** (per app, once each app record exists):
- **Apple ID (numeric app ID).** This drives the App Store link (`apps.apple.com/app/id<N>`), the badge, the Smart App Banner meta tag and structured data.
- ~~**A public TestFlight link**~~. **Decided 2026-10-05: TestFlight is invite-only**, so there are no public `testflight.apple.com/join/…` links and `testFlightUrl` stays empty. Pages show "Coming soon" instead.
- Price, category, age rating and availability (for structured data and page copy).
- "What's New" text for each version. This is automated (§6).
- **Official badge artwork** from Apple's Marketing Resources site (SVG, black and white versions). It must be used unmodified.
- *Optional, for richer automation:* an **App Store Connect API key** (Issuer ID, Key ID and a `.p8` file). It would be stored **only** as a GitHub Actions secret and never committed.

**From the website to ASC** (fields that need these URLs):
| ASC field | Requirement | Our URL |
|---|---|---|
| Privacy Policy URL | **Required** for every app | `/apps/<slug>/privacy/` |
| Support URL | **Required** | `/apps/<slug>/support/` |
| Marketing URL | Optional | `/apps/<slug>/` |
| Privacy Policy URL for **TestFlight** external testing | Required before external testers | the same privacy URL |

So the **privacy and support pages should go live before external TestFlight**. That's a good reason to deploy a minimal version of the site early (see the staging plan).

Clarity and obfuscate are distributed **outside** the App Store and don't need ASC. They do need a **Developer ID certificate and notarisation**, or Gatekeeper will block the DMG.

---

## 6. Compliance and best practice

### App Store Review Guidelines
- **5.1.1(i) Privacy policy**: one per app, publicly reachable, and it must say:
  - what data is collected and how
  - what it's used for
  - which third parties receive it and whether they give the same protection (e.g. TelemetryDeck)
  - how long it's kept and how to have it deleted
  - how to contact us

  It must **match the App Privacy "nutrition label"** in ASC and each app's `PrivacyInfo.xcprivacy`. That's three sources that must agree, so the per-app YAML (§3) should be the single source of truth.
- **5.1.3 Health (Blueprint):** the privacy policy must state that HealthKit data is not used for advertising or data mining, isn't shared with third parties, and is never stored in iCloud by Blueprint.
- **Contacts (Birthdays, Blueprint):** state plainly that contacts never leave the device and are never uploaded.
- **Location (Borderstamp):** state that location is processed on the device and that border crossings are stored locally.
- **1.5 Developer Information:** the Support URL must give an easy way to contact us, such as an email address and an FAQ.
- **Accuracy:** pages must not promise features the shipping build lacks.
- **Pre-release apps:** say "Coming soon" or offer a TestFlight link. Don't show the "Download on the App Store" badge until the app is live, unless Apple's pre-order badge applies.

### Apple marketing and trademark guidelines
- Use only the official badges, unmodified, with clear space around them.
- Add a footer notice: *"Apple, the Apple logo, iPhone, iPad and Mac are trademarks of Apple Inc., registered in the U.S. and other countries. App Store is a service mark of Apple Inc."*
- Device frames, if used, must come from **Apple Design Resources**.
- WeatherKit (Blueprint): the in-app attribution is what's required, but screenshots that show weather should still include it.

### Australian and general
- The **Privacy Act 1988 / APPs**: Xerodonia is probably exempt as a small business (under $3M turnover), but following the APPs is best practice and costs nothing.
- **No cookies and no tracking means no cookie banner** (GDPR/ePrivacy). The site privacy policy should still disclose that **GitHub Pages logs visitor IP addresses** for security.
- **Consulting prices:** state whether they include GST. This matters under the Australian Consumer Law's single-price rule if any customers are consumers.
- Show the ABN in the footer. It isn't legally required on a website, but it builds trust.
- Accessibility: **WCAG 2.2 AA**, including semantic landmarks, a skip link, alt text on every image, a visible focus state and correct heading order.

### Modern SEO (no trackers)
- Every page gets a unique `<title>`, a meta description, a canonical URL, Open Graph and Twitter card tags, and `lang="en-AU"`.
- **JSON-LD structured data:**
  - `Organization` and `WebSite` site-wide
  - `SoftwareApplication` / `MobileApplication` per app (operatingSystem, applicationCategory, offers)
  - `BlogPosting` per post
  - `ProfessionalService` for consulting
  - `BreadcrumbList`
- `sitemap.xml`, `robots.txt` and an Atom feed (`feed.xml`), plus per-app release feeds.
- The Smart App Banner meta tag on each live app's pages.
- Core Web Vitals are fast by design: no JS, system fonts, responsive AVIF/WebP images with dimensions, critical CSS inlined, and HTML minified.
- Verify **Google Search Console** and **Bing Webmaster Tools** with **DNS TXT records**. That gives search insights without any tracking code on the site.
- Check every deploy with Lighthouse (targets: Performance ≥ 95; Accessibility, Best Practices and SEO all 100), the W3C validator and a link checker in CI.

---

## 7. Automating release updates

The goal is to publish release notes on the site automatically when a new version ships, with Paul approving each update before it goes live.

### App Store apps: scheduled check of the public iTunes Lookup API (recommended)
`https://itunes.apple.com/lookup?id=<appId>&country=au` returns the live `version`, `releaseNotes`, `currentVersionReleaseDate`, price and screenshot URLs. **No API key and no secrets are needed.**

```
GitHub Action (daily cron + manual trigger)
  → for each app with an appStoreId: call the Lookup API
  → if the version is newer than src/_data/releases/<slug>.json:
      append {version, date, notes} to the file
  → open a PR "Blueprint 1.1 released"  (Paul merges → auto-deploy)
     (never auto-merged: Paul approves every update, decided 2026-10-05)
```
- The Lookup API only returns the *latest* version. That's fine because the history builds up in the repo from the first run onwards. Historical notes can be back-filled by hand once.
- With the optional ASC API key, the same job could also show TestFlight build status and fetch every version's "What's New" text. That's a later improvement.

### Outside the App Store (obfuscate, Clarity): GitHub Releases
- In each tool's repo, a release workflow runs on a `v*` tag. It builds, signs and notarises the DMG, attaches it to a **GitHub Release** whose notes come from a `CHANGELOG.md` section, then sends a `repository_dispatch` event to the site repo.
- The site's workflow fetches the release and records the version, notes and DMG URL.
- The download button on `/tools/obfuscate/` points at the GitHub Release asset. That avoids storing binaries in the site repo and satisfies "download from this site and GitHub" with one file.
- This needs a fine-grained token (stored as a secret in the tool's repo) that can only send dispatch events to the site repo.

### Recommended single source of truth for release notes
Keep a `CHANGELOG.md` in each app repo. Paste each entry into ASC's "What's New" when submitting, and let the website pick up whatever actually shipped through the Lookup API. That way the notes are written once, and the site always matches the App Store.

---

## 8. Staging plan (each stage ends with a pause for Paul to review)

| Stage | Work | Output |
|---|---|---|
| **0** | Paul answers the open questions below | Decisions recorded here |
| **1** ✅ | Build the five design mockups (home + Blueprint page) | Liquid Glass chosen; mockups removed |
| **2** ✅ | Set up Eleventy, layouts, design tokens for the chosen design, data model, CI build. Delete the old flat HTML. | `npm run build` works. Home, /apps/ and 6 app pages are generated from data. Approved 2026-10-05. |
| **3** ✅ | **Minimum viable launch:** home, an app page plus `/privacy/` and `/support/` for the three TestFlight apps, About, the site privacy policy. Deploy to GitHub Pages and switch DNS. | Live site with the URLs ASC and TestFlight need |
| **4** ✅ | Port the consulting pages and the blog (with the CSS-only nav) | `/consulting/`, `/blog/`, feed |
| **5a** ✅ | Remaining app pages (Scoreboard, Clarity, obfuscate); favicon set; Open Graph images | Content complete except screenshots |
| **5b** ✅ | AI-agent layer, static: robots.txt, llms.txt, JSON-LD everywhere, machine-readable services file, build check for scripts | Agents can find, understand and book |
| **5c** ✅ | Consulting MCP server on Cloudflare Workers (new repo) | Agents can query services and send enquiries |
| **5d** 🔶 | Screenshot mode in Blueprint and Clarity; capture script for all apps | **Done:** screenshot modes in Blueprint (461a799, #465) and Clarity (74086dc, #466); Mac screenshots, light and dark, live for both. **To do:** iPhone/iPad for Blueprint; Mac + iPhone/iPad for Birthdays and Borderstamp; iPhone/iPad for Scoreboard; capture script |
| **6** | SEO and compliance pass (JSON-LD now in 5b), Lighthouse/validator/link-check in CI | Audit report |
| **7** | Release automation (Lookup API cron, GitHub Releases dispatch, obfuscate DMG workflow) | Hands-off release notes |
| **8** | Update docs (`CLAUDE.md`, Journal), tidy up Clarity issues | Done |

Stage 2 replaces the current HTML, so Clarity issues **#453, #455, #457 and #459** will become obsolete. #452, #454, #456 and #458 will be handled by the new build. I'll suggest closing them then, but only with Paul's agreement.

---

## 9. Stage 5 in detail (approved 2026-10-05)

Each sub-stage ends with a pause for review. 5a and 5b only touch this repo; 5c is a new repo; 5d changes the Blueprint and Clarity repos.

### 5a: Remaining content and assets
- **Full pages for Scoreboard, Clarity and obfuscate.** Written from each repo's README and docs, like the others. Scoreboard says "Coming soon" with an "Email me" button; Clarity is shown as built in-house; obfuscate gets an install guide, usage and the terminal example.
- **Favicons:** SVG favicon (already there), a 32 px `favicon.ico` fallback, and a 180 px `apple-touch-icon.png`.
- **Open Graph images (1200×630)** so shared links show a proper card: one site-wide, one per app (icon, name and tagline on the Liquid Glass background), plus one for consulting. They're made by a small script using `sharp` (already installed with eleventy-img) and committed as PNGs, so the output doesn't depend on fonts on GitHub's build machines. The base layout then adds `og:image` and switches to `twitter:card = summary_large_image`.

### 5b: AI-agent layer (static, no server)
- **robots.txt:** allow everything (decision: "Allow all"). It explicitly lists the main AI user agents (GPTBot, OAI-SearchBot, ChatGPT-User, ClaudeBot, Claude-User, Claude-SearchBot, PerplexityBot, Perplexity-User, Google-Extended, Applebot-Extended, CCBot) and points to the sitemap and llms.txt.
- **`/llms.txt`** ([llmstxt.org](https://llmstxt.org) format): a Markdown summary of Xerodonia with links to every app, policy, consulting page and post, plus a "For AI agents" section explaining how to book, how to send an enquiry, and the MCP endpoint (once 5c exists). It's generated from the same data files, so it never drifts.
- **`/llms-full.txt`:** the same, with the full consulting details, app details and blog posts inlined, so an agent can read everything in one request.
- **JSON-LD on every page** (decision: data-only `<script type="application/ld+json">` is allowed):
  - `Organization` and `WebSite` site-wide
  - `MobileApplication` / `SoftwareApplication` per app
  - `ProfessionalService` with an `OfferCatalog` (each service as an `Offer` with AUD price, excluding GST) and a `ReserveAction` pointing to Calendly
  - `FAQPage` for the consulting FAQ and app support pages
  - `BlogPosting` and `BreadcrumbList`
- **`/consulting/services.json`:** a machine-readable catalogue of services, prices, fee tiers, agents, IDEs, the booking URL and the enquiry contract. It's generated from `consulting.yaml`, so it's the same data that powers the pages and (in 5c) the MCP server.
- **Build guard:** a post-build check that fails the deploy if any `<script>` other than `application/ld+json` appears, enforcing the no-JS rule.

### 5c: Consulting MCP server (Cloudflare Workers, free tier)
- **New private repo `xerodonia-mcp`,** following `clarity-feedback-relay`'s conventions: TypeScript Worker, `wrangler.jsonc`, KV rate limiting, secrets only via `wrangler secret put`, and vitest with `@cloudflare/vitest-pool-workers`.
- **Remote MCP over Streamable HTTP,** at `https://xerodonia-mcp.<account>.workers.dev/mcp`. A `mcp.xerodonia.com` address would need the DNS zone on Cloudflare, which we decided against (it would move email DNS).
- **Tools:**
  - `list_services`, `get_service`, `get_fees`: read-only, straight from `services.json`. The Worker fetches it from the live site and caches it, so prices are only ever edited in `consulting.yaml`.
  - `estimate_engagement`: given a team's situation (existing agent setup or not, number of agents, wants follow-up support), returns the matching packages and an indicative total, AUD excluding GST. Deterministic arithmetic, no AI.
  - `get_booking_link`: the Calendly link, for a human to choose a time.
  - `send_enquiry`: name, email, company, message and optional preferred times, plus a required `contact_consent: true` confirming the human agreed to share their details. Creates a consulting enquiry for Paul (destination: see questions). The tool **never commits Xerodonia to anything**; it only starts a conversation.
- **Safeguards:**
  - rate limits per IP and per email
  - input length limits
  - no free-text HTML passed through
  - enquiries labelled as agent-submitted
  - a kill switch (an environment variable) that disables `send_enquiry` without redeploying
- **Privacy:** the website privacy policy gains a "Consulting enquiries" section covering what's collected, where it's stored, how long it's kept, and deletion on request.
- **Deploy:** Paul runs `npx wrangler login` once (or uses the existing login); everything else is scripted.

### 5c in detail (approved and built 2026-10-05)

**As built:**
- Endpoint `https://xerodonia-mcp.autumn-glitter-b50d.workers.dev/mcp`; repo `pdarcey/xerodonia-mcp` (private), 29 tests.
- **Changes from the plan:** no `agents` package (MCP SDK 1.32's web-standard transport is enough). The relay is reached through a **service binding**, not its URL, because Worker-to-Worker fetches over workers.dev fail with error 1042. The live end-to-end test filed issue #1 in `pdarcey/consulting-enquiries`.
- **Email:** GitHub doesn't notify you about issues created with your own token, so the Worker emails hello@ itself via Fastmail SMTP (an SMTP-only app password; Reply-To is the enquirer). It's confirmed to arrive almost instantly. Test issues #1 and #2 are closed.


```
AI agent ──MCP (Streamable HTTP)──▶ xerodonia-mcp Worker ──GET──▶ xerodonia.com/consulting/services.json   (read tools)
                                          │
                                          └─ send_enquiry ──POST /v1/feedback──▶ clarity-feedback-relay ──▶ GitHub issue in
                                                             (ingest token)                                   pdarcey/consulting-enquiries
                                                                                                              (label: consulting-enquiry)
                                                                                    ├─▶ Clarity imports it (project linked to the repo)
                                                                                    └─▶ email to Paul (see "Email" below)
```

**Repo:** `pdarcey/xerodonia-mcp` (private), in `Projects/Services/xerodonia-mcp/`, set up like `clarity-feedback-relay`: TypeScript, `wrangler.jsonc`, KV for rate limits, secrets only via `wrangler secret put`, vitest with `@cloudflare/vitest-pool-workers`, and `CLAUDE.md`, `README.md`, `Journal.md` and `Status.md`.

**Dependencies (new, need approval):**
- `@modelcontextprotocol/sdk` (the official MCP SDK)
- `agents` (Cloudflare's; only its stateless `createMcpHandler`, so no Durable Objects are needed)
- `zod` (tool input schemas, which the MCP SDK requires)

**Endpoint:** `https://xerodonia-mcp.<subdomain>.workers.dev/mcp`. Read tools need no authentication. `GET /` returns a short human-readable description, and `/.well-known/mcp.json` describes the server.

**Tools:**

| Tool | What it does |
|---|---|
| `list_services` | Every service with its AUD price (excluding GST), what it includes and conditions. |
| `get_service(id)` | One service in full. |
| `get_rates` | Consultancy rate tiers, supported agents and IDEs. |
| `estimate_engagement(hasExistingSetup, additionalAgents, wantsFollowUp)` | Picks the packages (Initial Setup or Rehabilitate, plus extras) and returns an itemised indicative total in AUD, excluding GST, clearly labelled as "an estimate, not a quote". Plain arithmetic on services.json. |
| `get_booking_link` | The Calendly link for the free 15-minute audit, plus a note that a human should choose the time. |
| `send_enquiry(name, email, message, company?, preferredTimes?, onBehalfOf?, contactConsent)` | Requires `contactConsent: true`. Creates the GitHub issue through the relay, and returns a reference and "we'll reply by email". It never commits Xerodonia to anything. |

**Data source:** the read tools fetch `services.json` from the live site (cached for 10 minutes), so prices are edited only in the website's `consulting.yaml`. If `schemaVersion` isn't 1, the tools fail clearly rather than guessing.

**Safeguards for `send_enquiry`:**
- validated inputs: email format, length limits, plain text only
- rate limits in KV: 3 per IP per hour, 3 per email address per day, and 20 in total per day
- the issue body is clearly marked "Submitted via MCP by an AI agent", and quotes the free text as a code block so nothing in it renders as Markdown or links
- a kill switch, `ENQUIRIES_ENABLED=false`, that returns a polite "please email hello@xerodonia.com" instead

**Relay changes (a live service; I'd do it carefully):**
- add one ingest token for `pdarcey/consulting-enquiries` with the label `consulting-enquiry` to your local `ingest_tokens.json`
- re-upload it with `wrangler secret put INGEST_TOKENS`
- no code change: the relay already supports per-token repos and labels

**New private repo:** `pdarcey/consulting-enquiries` (issues only), plus a Clarity project linked to it so enquiries are imported.

**Email (your "both" decision):** GitHub emails a repo's owner about new issues by default. If you watch the repo with "All activity" and email notifications are on, each enquiry already arrives in your inbox, with no extra code and no extra secret. I'd test that first. If it isn't enough, add a direct Fastmail email via JMAP. That needs a Fastmail API token limited to sending, stored as a Worker secret, and is about 40 lines of code.

**Website updates once it's live:** set `site.mcpUrl` so llms.txt and services.json advertise it; add a "Consulting enquiries" section to `/privacy/` (what's collected, where it's stored, how long it's kept, deletion on request); and add a short "For AI agents" note on `/contact/`.

**Tests:** unit tests for every tool, with services.json and the relay mocked (including rate limits, the kill switch, missing consent and the wrong schema version), plus a live check with the MCP Inspector after deploying.

### 5d: Screenshots
- **Blueprint and Clarity:** a `-ScreenshotMode` launch argument, compiled into DEBUG builds only, that swaps in an in-memory store and stub providers filled with fake data. In Blueprint that covers contacts, events, reminders, health, weather, news, sport and TV. In Clarity it covers projects and issues. Each change is planned and reviewed in its own repo, following that repo's `CLAUDE.md`, with Clarity issues filed in those projects.
- **Upcoming Birthdays:** ~~fake contacts loaded from a `.vcf` file~~ a `-ScreenshotMode` launch argument (twelve fictional Australians with Image Playground portraits), the same pattern as Blueprint and Clarity. Done on all platforms, 2026-10-06.
- **Borderstamp:** a simulated GPS route across real borders (`simctl location`), plus a few geotagged sample photos for the photo-scan feature.
- **Scoreboard:** live public data.
- **`scripts/capture-screenshots.sh`** in this repo: boots dedicated simulators (iPhone 18 Pro Max, iPad Pro 13-inch), sets a clean status bar (`simctl status_bar override`: 9:41, full battery), launches each app with its demo data, and captures App Store-sized PNGs. Mac apps are captured with `screencapture -l` on the app window. The PNGs land in `src/images/apps/<slug>/` and the YAML references them, and the same files can be uploaded to App Store Connect.

### Decided for 5c (2026-10-05)
1. **Enquiries go to both destinations:**
   - as a GitHub issue in a private `consulting-enquiries` repo, via `clarity-feedback-relay` with its own ingest token, so Clarity imports it
   - **and** as an email to hello@
   - To check when building: GitHub already emails watchers about new issues, which may be enough on its own. If not, use Fastmail JMAP with a scoped API token as a Worker secret.
2. **Repo name:** `xerodonia-mcp` (private).

## Decisions (2026-10-05)

1. **Hosting:** the site repo will be **public**. We're going with GitHub Pages, and DNS stays at Fastmail.
2. **Consulting** lives at `xerodonia.com/consulting/`. The `xerodonia.com.au` references in the consulting site were a typo; everything uses `xerodonia.com`.
3. **The public contact address** is `hello@xerodonia.com`.
4. **Old apps are dropped.** The site must be **built to expect more apps** in future. Adding an app should mean adding one data file plus its assets (icon, screenshots), with no template or layout changes. App lists, the sitemap, structured data and the release automation all come from the data files. The "Adding a new app" checklist in `CLAUDE.md` will be rewritten for the new process in Stage 8.

5. **Design:** #1 **Liquid Glass** (2026-10-05). Its tick marks were redrawn as a single SVG so they're centred.
6. **URLs:** tools share the `/apps/<slug>/` scheme (e.g. `/apps/obfuscate/`) instead of having a separate `/tools/` section. That's one listing and one template, and `kind: tool` still styles them differently.

7. **Repo name:** `pdarcey/xerodonia-website` (public), so the repo is never confused with the website itself.
8. **Stage 5 decisions:** screenshots via a DEBUG-only "screenshot mode" in Blueprint and Clarity; robots.txt allows all AI crawlers; agent engagement includes a live MCP server on Cloudflare Workers (free tier); JSON-LD `<script type="application/ld+json">` is allowed, but executable JS is not.

## Next session (written 2026-10-06, afternoon)

1. **Borderstamp screenshot mode** (plan it in that repo first, following its `CLAUDE.md`): sample stamps and trips, DEBUG-only, guarding every write like Upcoming Birthdays' does. Then Mac shots (native), then iPhone and iPad.
2. **Borderstamp in App Store Connect** (Paul, around 2026-10-08): use `/apps/borderstamp/`, `/privacy/` and `/support/` as the Marketing, Privacy Policy and Support URLs. Then fill in `appStoreId` in `borderstamp.yaml` and update its `status`. Clarity #481: replace any hard-coded `borderstamp.com` links in the app.
3. **Blueprint and Scoreboard:** iPhone/iPad shots (Blueprint already has screenshot mode).
4. **Write `scripts/capture-screenshots.sh`** from this session's commands (below), so re-captures are one command.
5. **Clarity #467:** sample-data polish, then re-take Clarity's Dashboard and Project dashboard shots.
6. **Stage 6:** SEO and compliance audit (Lighthouse, W3C validator and link checker in CI).
7. **Stage 7:** release automation, including obfuscate's signed and notarised DMG.
8. **Upcoming Birthdays polish, when Paul chooses:** #479 (large widget a third empty), #480 (iPad list layout; would let the iPad list be shown), #475, and a `.gitignore` for that repo.

**How screenshots were taken this session** (for the capture script):
- **Mac:** launch the Debug build with `-ScreenshotMode` plus `-AppleInterfaceStyle Dark`, or `-NSRequiresAquaSystemAppearance YES` for light; `open` the app again to bring it to the front; `screencapture -x -l <window id>` (keeps the shadow and any attached sheet). Paul opens sheets and pages; the terminal can't send keystrokes.
- **iPhone/iPad:** `simctl boot` (ask Paul first; settles in 4–6 minutes), `xcodebuild … -destination id=<udid> build`, `simctl install`, `simctl status_bar <udid> override --time 9:41 --batteryState charged --batteryLevel 100 …`, `simctl ui <udid> appearance light|dark`, `simctl launch <udid> com.xerodonia.Upcoming-Birthdays -ScreenshotMode`, `simctl io <udid> screenshot`. Terminating the app returns to the Home Screen. Paul arranges Home Screen widgets in DeviceHub; keep third-party widgets (News) out. `simctl shutdown` when done.
- **Checking the page:** headless Chrome needs `--virtual-time-budget=20000` or lazy-loaded screenshots render blank.

**Not pushed, on purpose:** Blueprint `461a799`, Clarity `74086dc` (Paul: don't push). **Uncommitted, Paul's own:** Blueprint `project.pbxproj`; Clarity `CLAUDE.md`, `Journal.md`, `Readme.md`, `Info.plist`; Upcoming Birthdays `Readme.md`, `xcschememanagement.plist`, untracked `CLAUDE.md` and `Journal.md`; the website's `Images/` folder (portrait and screenshot originals).

## Open questions for Paul

5. ~~**Clarity:** showcase only?~~ **Answered 2026-10-05:** showcase only, not for sale and no download. The DMG pipeline was an experiment.
6. ~~**obfuscate:** public repo?~~ **Answered 2026-10-05:** `pdarcey/obfuscate` is now public (history scanned first: only test-fixture keys). The DMG and notarisation come in Stage 7.
7. ~~**TestFlight:** public links or invite-only?~~ **Answered 2026-10-05:** invite-only. No public TestFlight links on the site.
8. ~~**Release PRs:** PR or auto-publish?~~ **Answered 2026-10-05:** a PR that Paul approves. Never auto-merge.
9. ~~**Upcoming Birthdays and Borderstamp privacy:** what do they collect?~~ **Answered 2026-10-05:**
   - **Upcoming Birthdays:** asks for Contacts (all, or specific people). Contact details are used only to show birthdays in the app and, mostly, the widgets. Nothing is stored by the app or sent off the device. The website policy already says this. Manifest: Clarity #462.
   - **Borderstamp:** the website policy is detailed and accurate; generate the manifest from it. Manifest: Clarity #460.
10. ~~**Upcoming Birthdays on Mac (Clarity #474):** build a Mac picker, or drop Mac from v1.0?~~ **Answered 2026-10-06:** build it, so both versions can be marketed. Done the same day (Upcoming Birthdays `064a981`, verified by Paul, #474 closed): a "Choose People" sheet (search by name or nickname, checkboxes, Select All), File › Choose People… (⇧⌘P), and Remove/Delete in the list. With full access and nobody chosen, the app now shows no one instead of everyone, on iOS too. The site's Mac listing and "just the people you choose" stay as they are.
