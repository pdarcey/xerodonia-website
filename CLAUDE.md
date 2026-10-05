# Xerodonia Website

## Overview
The public marketing site for Xerodonia Pty Ltd's apps (iOS, iPadOS and macOS). It has a home page with one featured app and a grid of other apps, one page per app (description, features, App Store link, screenshot gallery, per-app privacy policy), plus About and Privacy pages.

## Tech Stack
- Language: Plain HTML5 + CSS3. No JavaScript.
- Framework: None. No build step, package manager or dependencies.
- Database: None.
- Tooling: `generate_template_images.py` (Python 3 + Pillow) makes placeholder app images.

## Commands
- Preview locally: `python3 -m http.server 8000`, then open http://localhost:8000
- Generate placeholder images: `python3 generate_template_images.py` (writes to `output_images/`, which is git-ignored)
- No build, test or lint commands.

## Architecture
```
index.html               Home: featured app + app grid
about.html, privacy.html Site-wide pages
<appname>.html           One page per app, copied from appPageTemplate.html
appPageTemplate.html     Starting point for new app pages
css/style.css            Single stylesheet for the whole site
images/                  Per-app images (see naming below)
Documentation/           Journal.md (learning journal)
```

### Conventions
- **Page filenames:** the app name in lowercase with no spaces (`upcomingbirthdays.html`).
- **Image names** per app, keyed on that same lowercase name:
  - `<app>.png`: the icon/hero image used on the home grid and at the top of the app page
  - `<app>-thumb1..3.png`: screenshot thumbnails
  - `<app>-full1..3.png`: full-size screenshots shown in the lightbox
- **Screenshot lightbox:** CSS only. Thumbnails link to `#img1`–`#img3`, and `.overlay:target` shows the matching full-size image. Close links point to `#!`.
- **Per-app privacy policy:** a `<details>` element inside `.privacy-popup` at the bottom of each app page.
- **Shared markup:** the header, nav and footer are copied into every page. A change to any of them must be made on **every** HTML file.
- **Banners:** `.banner.top-left` or `.banner.top-right` inside a `.card-image` or `.featured-image` (e.g. "New", "Updated").
- **Colours:** dark theme. Background `#0e1420`, header/footer `#115bf6`, accent borders `#6e96ef`, highlight `#fed35a`.

### Adding a new app
1. Copy `appPageTemplate.html` to `<app>.html` and replace every "App Name 1" and `app1` reference.
2. Add the images to `images/` using the naming convention above.
3. Add a card to the `.app-grid` in `index.html`, with proper `alt` text.
4. Add an entry to `privacy.html`.
5. Replace the `idXXXXXXXX` App Store placeholder with the real app ID.

## Gotchas
- Every page needs `<meta name="viewport" content="width=device-width, initial-scale=1.0">`.
- Privacy wording must match what each app actually does (App Review checks it).
- Use Australian English in site copy.
- Issues are tracked in Clarity under the "xerodonia.com" project.

## Environment Variables
None.
