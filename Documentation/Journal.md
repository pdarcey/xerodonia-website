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

## Engineer's Wisdom

- **Choose the boring option on purpose.** A static site has no dependencies to update, no security patches and no build to break.
- **A naming convention is a form of architecture.** In a project with no code, consistent names do the job that types and modules normally do.
- **Privacy copy is a contract.** It isn't decoration. Make sure it says exactly what the app does.

## If I Were Starting Over...

- I'd keep the header/footer in one place from the start, using a tiny build script or a static-site generator such as Eleventy or Hugo, so the nav isn't copied into a dozen files.
- I'd keep a single list of apps (name, key, App Store ID, privacy summary) and generate the home grid and privacy page from it.
- I'd add the viewport tag and real `alt` text to the template on day one, so every page copied from it would already have them.
