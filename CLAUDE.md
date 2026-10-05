# Xerodonia Website

## Overview
xerodonia.com is the public home for Xerodonia Pty Ltd's apps and tools (iPhone, iPad, Mac and CLI), its AI consulting service and its blog. It also hosts the **Privacy Policy and Support URLs** that App Store Connect requires for every app.

Hard rules:
- **Visitors get no JavaScript, no trackers and no cookies.** Node runs only at build time.
- **The site must expect more apps later.** Adding an app means adding a data file and an icon, with no template changes.
- Australian English in all copy.

The rebuild plan, decisions and staging are in `Documentation/Plan.md`. The story and lessons learnt are in `Documentation/Journal.md`.

## Tech Stack
- Static site generator: **Eleventy 3** (ESM config, Nunjucks templates)
- Images: **@11ty/eleventy-img** (build-time AVIF and WebP, responsive, with width and height)
- Data: YAML (via **js-yaml**) and JS data files
- Styling: one hand-written stylesheet, `src/styles/site.css` (the "Liquid Glass" design)
- Hosting: **GitHub Pages**, deployed by GitHub Actions (`.github/workflows/deploy.yml`)
- DNS: **Fastmail**, which also hosts email. Never touch the MX, DKIM, SPF or DMARC records.

## Commands
- `npm install`: install dependencies (Node 22 or later)
- `npm run dev`: dev server with live reload at http://localhost:8080
- `npm run build`: build to `_site/`
- `npm run clean`: delete `_site/`
- `npm run images`: regenerate `favicon.ico`, `apple-touch-icon.png` and the link-preview cards in `src/images/og/`. Run this on a Mac after adding an app or changing an app's name, tagline or icon, and commit the output. It isn't part of the build, because its text rendering depends on the Mac's fonts.

## Architecture
```
eleventy.config.js          Plugins, filters (sortProducts, productUrl, listToProse, isoDate), image shortcode
src/
  _data/site.js             Site-wide settings (name, URL, email, ABN, Calendly…)
  _data/statuses.js         Allowed app statuses and their labels
  _data/apps/<slug>.yaml    One file per app or tool: the single source of truth
  _includes/layouts/base.njk        Page shell: <head> and SEO meta, header, footer
  _includes/partials/               header, footer, product-card, get-actions (status-driven buttons)
  index.njk                 Home page
  apps/index.njk            /apps/: every app and tool
  apps/app.njk              /apps/<slug>/: one page per data file (pagination)
  apps/privacy.njk          /apps/<slug>/privacy/: generated when the YAML has `privacyPolicy`
  apps/support.njk          /apps/<slug>/support/: generated when the YAML has `support`
  about.njk, privacy.njk    /about/ and /privacy/ (the website's own policy, which lists every app policy)
  contact.njk               /contact/
  _data/consulting.yaml     Every consulting fact: audit, services and prices, fees, agents, IDEs, FAQ, audiences
  consulting/               /consulting/ overview, services, faq, and audience.njk (one page per audience)
  blog/<slug>.md            Blog posts (defaults in blog/blog.11tydata.js); blog.njk is the /blog/ index
  feed.njk                  /feed.xml (Atom). Hand-written; no plugin needed.
  404.njk, sitemap.njk, robots.njk, CNAME
  styles/site.css           Part 1: structure and accessibility. Part 2: Liquid Glass theme.
  images/apps/<slug>.png    1024 px source icons (Eleventy makes the web sizes)
.github/workflows/deploy.yml   Build and deploy to GitHub Pages on push to main
```

### Adding a new app
1. Export a 1024 px icon to `src/images/apps/<slug>.png`. For Icon Composer `.icon` files, use the `ictool` inside **Icon Composer.app**, not the one in `Developer/usr/bin`:
   `"/Applications/Xcode.app/Contents/Applications/Icon Composer.app/Contents/Executables/ictool" AppIcon.icon --export-image --output-file <slug>.png --platform iOS --rendition Default --width 1024 --height 1024 --scale 1`
2. Copy `src/_data/apps/blueprint.yaml` to `src/_data/apps/<slug>.yaml` and edit it. `blueprint.yaml` documents every field.
   - **Required:** `name`, `slug`, `order`, `kind`, `accent`, `icon`, `category`, `tagline`, `headline`, `summary`, `platforms`, `requires`, `status`.
   - **Optional sections**, which only render when present: `screenshots`, `features`, `sections` (free-form: `heading`, `text`, `list`, `code`, `after`), `privacy`, `cta`, `terminal`, `appStoreId`, `testFlightUrl`, `downloadUrl`, `githubUrl`.
   - **Only link public URLs.** For example, leave `githubUrl` empty while a repo is private, or visitors get a 404.
   - **`privacyPolicy`** generates `/apps/<slug>/privacy/`, the App Store Connect "Privacy Policy URL". It also needs the `privacy` block, because the policy's "short version" reuses it.
   - **`support`** (an FAQ list) generates `/apps/<slug>/support/`, the App Store Connect "Support URL".
   - Every app on the App Store **must** have both. Their facts must match the app's `NS…UsageDescription` strings, its `PrivacyInfo.xcprivacy`, and its App Privacy answers in App Store Connect. Check the app's code; don't guess.
3. Set `status` to a key from `src/_data/statuses.js`. That decides the badge and the buttons.
4. Run `npm run images` to make the app's link-preview card.
5. Run `npm run dev` and check the home page, `/apps/` and `/apps/<slug>/`. The footer, sitemap and app lists update automatically.

### Writing a blog post
Create `src/blog/<slug>.md` with front matter `title`, `description`, `date` (YYYY-MM-DD) and an optional `category`, then write the post in Markdown. The layout, URL (`/blog/<slug>/`), blog index, home-page teaser, sitemap and Atom feed all update automatically. Keep any page that isn't a post *out* of `src/blog/`, or it inherits the `posts` tag and shows up in the feed.

### Changing consulting prices or services
Edit `src/_data/consulting.yaml`. Each audience page lists the service `id`s it shows. An unknown id fails the build on purpose, via the `pickServices` filter.

## Conventions and gotchas
- **Use `{% asyncEach %}`, not `{% for %}`, for any loop containing `{% image %}`.** The image shortcode is async, and in a plain `for` loop Nunjucks silently renders nothing.
- **Paginated templates need `addAllPagesToCollections: true`**, or only the first generated page reaches `collections.all` (and the sitemap).
- **Colour accent text with `color-mix(in oklab, var(--accent) N%, var(--text))`**, never raw `var(--accent)`. Raw amber or green on the light background fails WCAG contrast.
- **Ordered lists:** the reset strips numbering from every `<ol>` (breadcrumbs need that), so prose lists restore it with `.prose ol:not([class]) { list-style: decimal }`.
- **Avoid high-specificity resets.** Lists are reset with `ul[class], ol, nav ul`. A plain class selector loses to `ul[class]`.
- **Grid and flex children that contain `<pre>`** need `min-width: 0` so they scroll instead of overflowing.
- **Things that need JS elsewhere are done without it here:** the nav wraps instead of using a hamburger, whole cards are clickable with a stretched `::after` link, screenshots use a scroll-snap strip, and contact is `mailto:`.
- **"Coming soon" states are `.button--static` spans, never fake links.**
- **JS front matter (`---js`) in Eleventy 3 uses top-level `const` declarations**, not an object literal. See `src/apps/privacy.njk`.
- **Quote YAML values that contain `: `**, or the file won't parse.
- **Every `{% image %}` needs alt text.** Use `""` for decorative images; the shortcode throws if it's missing.
- **Testing narrow widths with headless Chrome:** it won't lay out below 500 px, so load the page in a 390 px `<iframe>`. To force light or dark mode, use `--blink-settings=preferredColorScheme=1` (light) or `0` (dark).
- Issues are tracked in Clarity under the **xerodonia.com** project.

## Environment Variables
None at present. Stage 7 (release automation) may add GitHub Actions secrets. They must never be committed.
