# The Xerodonia Website Journal

## The Big Picture

Think of this site as the shop window for Xerodonia's apps. Someone hears about Scoreboard or Upcoming Birthdays, searches for it and lands here. They see what the app does, look at a few screenshots, read a privacy policy that tells them nothing creepy is going on, then click through to the App Store.

It also does a less glamorous job: Apple wants a support URL and a privacy policy URL for every app on the App Store. These pages are those URLs.

## Architecture Deep Dive

The site is **deliberately simple**: plain HTML files, one stylesheet and a folder of images. There's no framework, no build step and no JavaScript.

If a React or Next.js site is a commercial kitchen with a dozen stations, this one is a toastie press. You put something in and you get a predictable result. Any web server can host it, including GitHub Pages, a cheap shared host or `python3 -m http.server`. It'll still render correctly in twenty years.

There are two pieces worth understanding:

- **The CSS-only lightbox.** Clicking a screenshot thumbnail changes the URL fragment to `#img2`. The rule `.overlay:target` matches whichever overlay has that `id`, and shows it full-screen. The close button links to `#!`, which matches nothing, so the overlay goes away. It works like a light that turns on whenever someone says its name.
- **The `<details>` privacy policy.** The browser handles the expand/collapse behaviour for free. It's accessible by default and needs no script.

The trade-off is that **nothing is shared between pages**. The header, nav and footer are copied into every file, like a photocopied letterhead. That's fine at a dozen pages, but if the nav changes you have to change every file. If the site grows much more, a tiny static-site generator (or even a shell script) is the obvious next step.

## The Codebase Map

```
index.html             ← front door: featured app + grid of the rest
<app>.html             ← one page per app (made from appPageTemplate.html)
about.html             ← who's behind it
privacy.html           ← site-wide privacy summary
css/style.css          ← the one and only stylesheet
images/                ← <app>.png, <app>-thumbN.png, <app>-fullN.png
generate_template_images.py ← makes coloured placeholder tiles while real art isn't ready
```

The naming convention is the glue that holds it together. Every app has one lowercase, no-spaces key (`distancemapper`), and that key is used for the HTML filename and every image. If you know an app's key, you know where all its files are.

## Tech Stack & Why

- **Plain HTML/CSS**: there's nothing dynamic to render, so a framework would add maintenance with no benefit.
- **System font stack (`-apple-system`)**: the apps are Apple-platform apps, so the site uses the same typeface. It looks native on Apple devices and costs nothing to load.
- **Python + Pillow for placeholders**: the script hashes each app name into a colour, so every app always gets the same placeholder tile. Rerunning it won't produce a new random colour scheme.

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

## Engineer's Wisdom

- **Choose the boring option on purpose.** A static site has no dependencies to update, no security patches and no build to break.
- **A naming convention is a form of architecture.** In a project with no code, consistent names do the job that types and modules normally do.
- **Privacy copy is a contract.** It isn't decoration. Make sure it says exactly what the app does.

## If I Were Starting Over...

- I'd keep the header/footer in one place from the start, using a tiny build script or a static-site generator such as Eleventy or Hugo, so the nav isn't copied into a dozen files.
- I'd keep a single list of apps (name, key, App Store ID, privacy summary) and generate the home grid and privacy page from it.
- I'd add the viewport tag and real `alt` text to the template on day one, so every page copied from it would already have them.
