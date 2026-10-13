# Xerodonia Website

The source for [xerodonia.com](https://xerodonia.com), the home of Xerodonia's apps and tools for iPhone, iPad and Mac, plus AI consulting and a blog.

The site is static, built with [Eleventy](https://www.11ty.dev). It sends visitors only HTML and CSS: no JavaScript, no trackers and no cookies.

## Quick start

```bash
npm install
npm run dev      # http://localhost:8080, reloads as you edit
npm run build    # outputs to _site/
```

Pushing to `main` builds and deploys the site to GitHub Pages automatically.

## Where things live

| To change… | Edit |
|---|---|
| An app's text, status or links | `src/_data/apps/<app>.yaml` |
| Site-wide details (email, ABN…) | `src/_data/site.js` |
| Page layout | `src/_includes/` and `src/*.njk` |
| Styles | `src/styles/site.css` |

See [CLAUDE.md](CLAUDE.md) for the full architecture and how to add an app.

## Logo files

`logo.svg` and `logo.png` (1024 × 1024) in the repo root aren't part of the website. Clarity, our local issue tracker, uses them to represent this project and repo.

Keep them consistent with every version of the mark on the site:

| File | Made from |
|---|---|
| `src/images/xerodonia-mark.svg` | The master copy, used in the header, footer and as the SVG favicon |
| `src/favicon.ico`, `src/apple-touch-icon.png` | `xerodonia-mark.svg`, by `npm run images` |
| `src/images/og/` (link-preview cards) | `xerodonia-mark.svg`, by `npm run images` |

If the mark changes, update `xerodonia-mark.svg`, copy it to `logo.svg`, run `npm run images`, and re-export `logo.png` from `logo.svg`.

> © 2026 Xerodonia Pty Ltd, all rights reserved
