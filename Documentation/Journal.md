# The Xerodonia Website Journal

## The Big Picture

Think of xerodonia.com as Xerodonia's shopfront, with a few rooms out the back. The front window shows the apps and tools: Blueprint, Borderstamp, Upcoming Birthdays, Scoreboard, Clarity and obfuscate. Someone hears about one, searches for it and lands here. They see what it does, look at a few screenshots, read a privacy policy that tells them nothing creepy is going on, and (once the app is live) click through to the App Store.

Out the back there's a consulting office (AI coding-agent consulting, with prices, an FAQ and a page for each kind of client), a blog with an Atom feed, and a counter for robots. AI agents get structured data, `llms.txt` and a machine-readable price list, and there's a live MCP server they can use to make an enquiry.

It also does a less glamorous job that matters a lot: Apple wants a **Privacy Policy URL and a Support URL for every app** on the App Store. Those pages live here, at `/apps/<slug>/privacy/` and `/apps/<slug>/support/`.

The ground rule for visitors is strict: **no JavaScript, no trackers, no cookies.** You get HTML, one stylesheet and images, and that's it.

## Architecture Deep Dive

The site is a **static site built by Eleventy**. Picture a print shop. The YAML data files are the copy, the Nunjucks templates are the printing plates, and Eleventy is the press. You run the press (`npm run build`) and out come finished HTML pages in `_site/`. Node only ever runs in the print shop, on Paul's Mac or on GitHub's build server. Visitors get the printed pages, never the machinery.

A few ideas hold it together:

- **One data file per app is the single source of truth.** `src/_data/apps/blueprint.yaml` drives Blueprint's card on the home page, its listing on `/apps/`, its app page, its privacy policy, its support page, its JSON-LD, its line in `llms.txt` and its sitemap entry. Change a tagline once and it changes everywhere. Adding the next app means one YAML file and one icon, with no template changes.
- **Status drives the buttons.** Each app has a `status` (`in-development`, `testflight-soon`, `testflight`, `app-store`, `free-download`, `in-house`). The `get-actions` partial reads it and chooses the right buttons, so an app never shows a "Download" button it can't honour. Things that can't be clicked are `<span>`s styled as static buttons, never fake links.
- **Consulting works the same way.** Every price, service and FAQ lives in `consulting.yaml`. Each audience page just lists the service ids it wants, and an unknown id fails the build instead of quietly dropping a price card.
- **The machine-readable layer is generated, not written.** JSON-LD, `llms.txt`, `llms-full.txt` and `/consulting/services.json` are all built from the same data as the pages, so the robots can never be told something different from the humans.
- **A bouncer at the door.** After every build, `lib/build-check.js` scans the output and fails the deploy if it finds any executable `<script>`, any `onclick=`-style handler, any `javascript:` URL or any JSON-LD that doesn't parse. JSON-LD is the only `<script>` allowed, because browsers never run it.
- **Deployment is a conveyor belt.** Push to `main`, and a GitHub Action builds the site and publishes it to GitHub Pages in about a minute. DNS stays at Fastmail, which also handles email, so the mail records are never touched.

The things that usually need JavaScript are done with plain HTML and CSS. The nav wraps instead of hiding behind a hamburger, whole cards are clickable with a stretched `::after` link, screenshots sit in a scroll-snap strip, dark-mode screenshots come from `<picture>` and `prefers-color-scheme`, and the contact form is a `mailto:` link.

## The Codebase Map

```
eleventy.config.js        the press settings: plugins, filters, image shortcodes
src/_data/                the copy
  apps/<slug>.yaml          one per app or tool (blueprint.yaml documents every field)
  consulting.yaml           every consulting fact
  site.js, statuses.js      site-wide settings; the allowed app statuses
src/_includes/            the plates: base layout, header, footer, cards, buttons
src/apps/                 /apps/, one page per app, plus privacy and support pages
src/consulting/           overview, services, FAQ, one page per audience, services.json
src/blog/                 posts in Markdown (blog.njk, the index, sits outside on purpose)
src/styles/site.css       the one stylesheet: structure first, then the Liquid Glass theme
src/images/               1024 px app icons, screenshots, link-preview cards
lib/                      JSON-LD, llms.txt, shared consulting helpers, the build check
scripts/make-images.mjs   favicons and link-preview cards (run on a Mac, output committed)
Documentation/            Plan.md (roadmap), Status.md (snapshot), this journal
```

If you know an app's slug, you know where everything about it lives: `src/_data/apps/<slug>.yaml`, `src/images/apps/<slug>.png`, and the URLs `/apps/<slug>/`, `/apps/<slug>/privacy/` and `/apps/<slug>/support/`.

## Tech Stack & Why

- **Eleventy 3**: it's a static-site generator that adds nothing to the page. It shares layouts, turns data into pages and writes the sitemap and feed, then gets out of the way. The old consulting site already used it, so porting was easy.
- **Nunjucks templates and YAML data**: YAML is easy for a person to edit and diff, and Nunjucks is plenty for templates that mostly loop over data. (Watch out for its one big trap: async shortcodes need `asyncEach`, not `for`.)
- **@11ty/eleventy-img**: turns 1 MB PNGs into 40 KB AVIF and WebP at build time, with width and height set so nothing jumps while the page loads.
- **One hand-written stylesheet**: the Liquid Glass design is a few hundred lines of modern CSS (`color-mix`, `backdrop-filter`, container-friendly grids). A CSS framework would weigh more than the whole site.
- **System fonts**: the apps are Apple-platform apps, so the site uses SF and New York. They look native on Apple devices and cost nothing to download.
- **GitHub Pages and GitHub Actions**: free hosting with HTTPS, served from a CDN, and deployment is just a push. The catch is that the repo has to be public, which is fine because the content is public anyway.
- **sharp (through `npm run images`)**: renders the link-preview cards and favicons. It runs on the Mac rather than in CI, because SVG text rendering depends on the fonts installed.

## The Journey

### 2026-10-05: Getting the house in order
The site was working but undocumented. A first audit found:
- every App Store button still points to `idXXXXXXXX`
- the home grid links to `slideshow.html`, which was never created (the images exist, the page doesn't)
- three pages have no viewport meta tag, so phones render them at desktop width and zoom out
- template text ("App Name 1", alt text like "App 3") is still live
- the Upcoming Birthdays privacy policy says no data is collected, then says crash analytics are used

**Lesson:** copy-and-paste templates are quick to start with, but placeholders stay in place easily. A quick `grep -n "XXXX\|App Name\|App [0-9]" *.html` before publishing would catch most of these.

All of these are now tracked in Clarity.

### 2026-10-05: Five designs, one set of HTML
To choose a look for the rebuild, we built five mockups (`Design Mockups/`): Liquid Glass, Editorial, Blueprint, Bento and Swiss Minimal. The trick is that **all five share exactly the same HTML**. `build.py` takes two source pages plus header and footer partials and writes one copy per design, changing only the stylesheet link. It's the CSS Zen Garden idea: if the markup is semantic enough, the stylesheet alone can make it look like a magazine, an engineering drawing or a keynote slide. That also means the HTML is effectively finished before the design is chosen.

Things we learnt along the way:
- **Exporting Icon Composer icons from the command line:** Xcode ships *two* `ictool` binaries. The one in `Xcode.app/Contents/Developer/usr/bin` is the old asset-catalogue tool and rejects `--export-image`. The one inside `Icon Composer.app/Contents/Executables/` works: `ictool AppIcon.icon --export-image --output-file icon.png --platform iOS --rendition Default --width 512 --height 512 --scale 1`. Converted to WebP with `cwebp`, each icon went from about 550 KB to under 10 KB.
- **Headless Chrome won't go below 500 px wide.** `--window-size=390,…` silently lays the page out at 500 px and then crops the screenshot to 390, which makes a perfectly good layout look broken. The fix is to load the page in a 390 px `<iframe>` inside a harness page. Check `innerWidth` before trusting a narrow screenshot.
- **`--force-dark-mode` doesn't set `prefers-color-scheme`.** Use `--blink-settings=preferredColorScheme=0` (dark) or `=1` (light). Otherwise you get whatever appearance the Mac happens to be in.
- **Specificity strikes again:** a reset rule like `ul[class] { padding: 0 }` (specificity 0,1,1) beats a later `.checklist { padding: … }` (0,1,0). Keep resets low-specificity, or wrap them in `:where()`.
- **Grid children don't shrink by default.** A wide `<pre>` inside a grid column pushes the column wider instead of scrolling. `min-width: 0` on the grid items fixes it.
- **No JS needed for a mobile menu here.** With only four nav links, a nav that simply wraps onto a second line works fine on phones. Leaving out the hamburger also removes a whole category of accessibility bugs.

### 2026-10-05: Liquid Glass wins, and the site becomes a machine
Paul picked design #1, with one note: the ticks in the checklists looked off-centre. They were built from two pieces, a blue circle (`::before`) and a white "L" rotated 45° (`::after`), each positioned separately in rem units. Rotating a box spins it around its own centre, not the centre of the tick it draws, so the two pieces never quite lined up, and they drifted further as the text size changed. The fix was to make it a single element: a disc whose background is an SVG tick with its bounding box centred in the viewBox, sized in `em` so it follows the text. **If two separately positioned pieces have to line up, make them one piece.**

Then Stage 2 replaced the hand-written pages with Eleventy. Each app is now a YAML file, and the home page, `/apps/`, every app page, the footer and the sitemap are all generated from those files. Adding Xerodonia's next app is one file and one icon.

War stories from the first build:
- **The disappearing apps.** The first build ran without errors, and the home page had a heading, a description… and no apps at all. The cause: the product card uses `{% image %}`, an *async* shortcode, and Nunjucks's ordinary `{% for %}` loop doesn't wait for async work, so it quietly renders nothing. `{% asyncEach %}` does wait. No error, no warning, just an empty list. That's why this is now the first gotcha in `CLAUDE.md`.
- **The sitemap that forgot five apps.** Eleventy's pagination makes six app pages from one template, but by default only the *first* is added to `collections.all`. The sitemap listed Blueprint and nothing else until `addAllPagesToCollections: true` was set.
- **Amber is not a text colour.** Borderstamp's amber looks great as an icon and failed WCAG contrast badly as tagline text on the near-white glass. Rather than special-casing each app, accent-coloured text is now `color-mix(in oklab, var(--accent) 60%, var(--text))`. Because `--text` is dark in light mode and light in dark mode, the same rule darkens the accent on light backgrounds and lightens it on dark ones, for any colour a future app brings.
- **The grey hole in the Details table.** The "1px gap plus coloured background" trick for drawing grid lines fills any unused cells in the last row with solid line colour. Drawing each cell's right and bottom border instead, and clipping the outer edge, fixes it however many cells there are.

### 2026-10-05: Privacy policies are written from code, not memory
Stage 3 needed real privacy policies for three apps, and the mockup copy we'd drafted turned out to be wrong in two places. It said Blueprint keeps "your location" on the device. But Blueprint sends a location to Apple's WeatherKit for forecasts, and contacts several public services (TVmaze, TheSportsDB, Squiggle, ESPN, Nager.Date and news feeds) for listings and scores. Lesson: **write a privacy policy from the code.** The `NS…UsageDescription` strings in each project file are the definitive list of permissions; `PrivacyInfo.xcprivacy`, the package list and a grep for hard-coded URLs show what leaves the device.

Two Borderstamp findings were reassuring once checked. A `LocationUpdateLogEntry` with raw latitude and longitude looked alarming, but it's wrapped in `#if DEBUG` and never ships. And the merchandise store that would send place names off the device isn't in v1.0. A policy describes the app as it ships, so the store's wording is parked in a Clarity note, to update the policy, manifest and App Store label in the same release as the feature.

The policies themselves are data-driven like everything else: each app's YAML lists its permissions, everything it shares (recipient, what, why, a link to their policy) and any extra sections, and one template turns that into a consistent policy. A new app gets a policy as good as Blueprint's by filling in the same fields.

Gotchas: Eleventy 3's `---js` front matter wants top-level `const` declarations, not the v2 object literal. And YAML values containing `: ` need quoting.

### 2026-10-05: Consulting moves in, and the blog arrives
The consulting site had been built as a separate Eleventy project for a domain that turned out to be a typo (`xerodonia.com.au`). Moving it in meant porting the *content*, not the code: its CSS, components and hamburger-menu `nav.js` were all replaced by the Liquid Glass design and a pill-shaped sub-nav that simply wraps on phones.

The old site repeated the same pricing cards on four pages, each copy slightly different ("Analysis of current setup" on one, "Audit of current implementation" on another). Now every consulting fact lives in `consulting.yaml`, and each audience page just lists the service ids it wants. A typo in an id fails the build, rather than quietly dropping a price card.

Porting also turned up contradictions that are easy to miss when copy is duplicated: a "free 45-minute audit" whose booking link is a 10–15 minute Calendly event, and a "Most Popular" badge on a service no one had bought yet. The first is now a single setting waiting for Paul's answer; the second was removed, since an unearned claim like that is the sort of thing the ACL takes a dim view of.

Blog gotcha: tags set in a directory data file apply to *everything* in that directory, including the index page. The first feed had two entries for one post until the index moved out of `src/blog/`.

### 2026-10-05: Link previews, and a link that went nowhere
Writing obfuscate's page turned up a live bug: its "View on GitHub" button pointed at a **private** repo, so every visitor who clicked it got a 404. The fix had two parts. We removed the link, and we made the button logic fall back sensibly: a free-download app with no public link now shows "Download coming soon" and "Email me when it's ready". Lesson: before linking anything external, check that a stranger can open it. `gh repo view --json visibility` takes a second.

Link-preview (Open Graph) cards are generated by `scripts/make-images.mjs`. It draws an SVG (logo, title, tagline and app icon on the Liquid Glass gradient) and renders it with `sharp`, which was already installed by eleventy-img. Two choices worth remembering:
- **JPEG, not PNG**, for gradient-heavy images: about 45 KB against about 250 KB, with no visible difference.
- **Generated on the Mac and committed**, not built in CI. SVG text is rendered with whatever fonts the machine has, so GitHub's Linux runners would produce different (worse) cards.

The favicon fallback is a hand-built ICO: a 22-byte header wrapped around a 32 px PNG. Browsers have accepted PNG-in-ICO for years, so there was no need for another dependency.

### 2026-10-05: Teaching the site to talk to machines
Stage 5b made the site readable by AI agents as well as people, without adding any new facts. Everything an agent sees is generated from the same YAML the pages use:
- **JSON-LD** structured data on every page, chosen by a `pageType` each template declares. Consulting services become schema.org `Offer`s with exact AUD prices marked "excluding GST", and booking is a `ReserveAction` pointing at Calendly.
- **`/consulting/services.json`:** the price list as data, with a `schemaVersion`, because the MCP server in Stage 5c will depend on it.
- **`/llms.txt` and `/llms-full.txt`**, following the llms.txt convention: a Markdown index, and a long version with every detail and blog post inlined.
- **`robots.txt`** that names the AI crawlers explicitly, so there's no doubt they're welcome.

The interesting design choice was the no-JavaScript rule. JSON-LD lives in a `<script type="application/ld+json">` tag, which browsers never execute, so Paul agreed it's allowed. "Allowed with an exception" rules tend to erode, though, so there's now a post-build guard (`lib/build-check.js`) that fails the deploy on any other `<script>`, any `onclick=`-style handler, any `javascript:` URL, or JSON-LD that doesn't parse. It was tested by feeding it a deliberately bad page before being trusted. A check you've never seen fail is just a hope.

Small gotcha: Eleventy ignores `.11ty.js` templates unless `11ty.js` is in `templateFormats`. The first `services.json` silently didn't exist.

### 2026-10-05: The shop counter opens
The consulting MCP server is live (its own story is in `xerodonia-mcp/Journal.md`). From the website's side, the satisfying part is how little changed. The server reads `services.json`, which is generated from the same `consulting.yaml` as the pages, the JSON-LD and llms.txt. One setting (`site.mcpUrl`) made llms.txt and services.json advertise it. A price change is still one line in one file, and it reaches the pages, search engines, AI crawlers and live agents at once.

Writing the privacy section meant checking what the server actually stores, rather than what it's meant to store. IP addresses really are kept for an hour and email hashes for a day, because those are the KV TTLs in `rate-limit.ts`. A privacy policy should be checked against the code, the same way the app policies were.

### 2026-10-05 (evening): Screenshots without showing anyone's life
Every app page needed real screenshots, but Blueprint shows contacts, calendars and health data, and Clarity shows every private project note. Both apps gained a **screenshot mode**: a Debug-only `-ScreenshotMode` launch argument that swaps in fake data, isolated from the real stores. In Blueprint that meant the mocks its tests already used; in Clarity, an in-memory database. (Each repo's own Journal tells its half of the story.)

What the website side learnt:
- **Ask before booting a Simulator.** A never-used iPhone 18 Pro Max ran the CPU flat out for half an hour without finishing its first boot, and Paul had to kill it. The Mac builds did the job in seconds. "Native first" is now a rule (and a memory).
- **Mac screenshots arrive as transparent PNGs with the window's own shadow.** Keep them that way. The page background shows through, so no frame is needed, and they look right in light and dark.
- **Light and dark, no JavaScript.** `{% themedImage %}` builds one `<picture>` with the dark sources first, behind `(prefers-color-scheme: dark)`, and each source carries its own dimensions. Dark-mode visitors automatically see dark screenshots. A 1 MB PNG becomes a 37–57 KB AVIF.
- **Portrait and landscape need different rules.** Blueprint's tall window is sized by height and Clarity's wide windows by width, and the shortcode adds a `--portrait` or `--landscape` class from the image's own dimensions.
- **Headless Chrome screenshots images that haven't loaded yet.** The dark Clarity screenshots looked missing until `--virtual-time-budget` gave lazy images time to load. Check that a test is measuring the page, not the capture.
- **Paul's review beats any test.** "The icons don't show" and "there's no commit activity" were both cases of sample data that passed every test but didn't look like the real app. Sample data should do whatever the real importer does.

### 2026-10-05 (late): Chasing a Simulator that wouldn't calm down
Before we could take any iPhone or iPad screenshots, we had to deal with a problem outside our code: starting an iOS Simulator on Paul's Mac ran the CPU flat out until every simulator was killed. Rather than guess, we measured. Each test booted a device and sampled CPU, swap and the top processes every 15 seconds for 5 minutes (Clarity #472).

What we learnt:
- **Xcode 27 has no Simulator.app.** It's been replaced by **DeviceHub.app**, inside `Xcode.app/Contents/Applications/`. Our first "with a window" test ran `open -a Simulator`, which failed quietly in a background log, so we spent five minutes measuring a headless boot by mistake. Paul spotted it because nothing appeared on screen. **Check that each step of a test actually ran before trusting its numbers.**
- **A device that has booted before is fine.** It was fine without a window, with the DeviceHub window, and with Xcode building and running Blueprint: 2–2½ minutes of heavy boot work, then 75–94% idle. Even on 8 GB, swap never grew.
- **Apple has a crash loop in the iOS 27.0 simulator.** `intelligencetasksd` crashes on an XPC entitlement check (`__XPC_API_MISUSE__`) as often as every 10 seconds until launchd backs off, and each crash makes the Mac write a crash report. It's annoying, but it isn't what kept the CPU busy.
- **First boots are the expensive part.** Each new device downloads about 2.5 GB of Siri and Apple Intelligence data and indexes it. The iPhone 18 Pro Max that ran away last time had only 367 MB of data, so its first boot never finished, and an interrupted first boot starts the heavy work all over again.
- **Screenshots don't need a window at all.** `xcrun simctl io <device> screenshot` captures a headless simulator, which means the capture script can run without DeviceHub.
- **The proof:** we erased the half-booted iPhone 18 Pro Max and left its first boot alone without a window. It ran the CPU flat out for about 6 minutes while it downloaded 1.5 GB, then settled at 8 minutes. The second boot was ready in 7 seconds and calm within 2. The "forever" was never forever; it was a job that kept being interrupted and starting again. **Leave a first boot alone, then reuse that device.**
- Housekeeping: `xcrun simctl delete unavailable` removed 33 devices left over from iOS 26.x runtimes that were no longer installed, freeing 6 GB.

## Engineer's Wisdom

- **Choose the boring option on purpose.** A static site has no server to patch and no database to back up, and it can't be hacked through the front end. Boring is a feature.
- **One source of truth, many outputs.** Pages, privacy policies, JSON-LD, `llms.txt` and the MCP server's price list all come from the same YAML. Duplicated facts drift; generated ones can't.
- **Privacy copy is a contract.** Write it from the code (usage strings, manifests, network calls), never from memory. The policy, the privacy manifest and App Store Connect's privacy answers must all agree.
- **Make the rule enforce itself.** "No JavaScript" is a build failure, not a guideline. A guard you've seen fail is worth ten you hope work.
- **Check that a stranger can open a link before you publish it.** Private repos, unreleased apps and placeholder URLs all look fine from the inside.
- **Native first.** Mac screenshots take seconds; Simulators can cost half an hour. Use the cheapest tool that does the job.

## If I Were Starting Over...

- I'd start with Eleventy and per-app data files on day one. The original site's copied headers, placeholder App Store IDs and missing pages all came from copy-and-paste templates.
- I'd write the build check before the first page, so "no JavaScript" was enforced from the start instead of added later.
- I'd give every app a Debug-only screenshot mode with sample data from its first build. Then good screenshots, for the site and the App Store, are one launch argument away.
- I'd check the development machine before planning Simulator work. An 8 GB Mac struggles to run an iOS Simulator alongside Xcode.
