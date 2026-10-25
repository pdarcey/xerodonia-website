# xerodonia.com — Status

*Snapshot at the end of the 2026-10-25 session. See `Plan.md` for the roadmap and "Next session".*

## Live at https://xerodonia.com
Everything is pushed and live (last deploy: `1b34241`, 2026-10-25).

- GitHub Pages, deployed by GitHub Actions on every push to `main` (repo `pdarcey/xerodonia-website`, public). HTTPS is enforced; `www` redirects to the apex.
- DNS stays at Fastmail (A/AAAA records to GitHub; `www` CNAME). Email records are untouched.
- 33 output files, built in about 0.3 s once images are cached. No JavaScript of our own: the post-build guard fails the build on any executable script except the one TelemetryDeck tag, which every page must have.

| Area | State |
|---|---|
| Home, About, Contact, website privacy | ✅ |
| App pages (6) | ✅ Blueprint, Borderstamp, Upcoming Birthdays, Scoreboard, Clarity, obfuscate. Borderstamp: iPhone and iPad only, "Free, with optional packs", and a "What you get" section (2026-10-07) |
| App privacy and support pages | ✅ Blueprint, Borderstamp, Upcoming Birthdays (the App Store Connect URLs). Borderstamp's now explain iCloud sync: stamps sync through the user's own iCloud, and stay on the device when signed out (2026-10-09). A policy can set its own `privacyPolicy.contactEmail`; Borderstamp uses privacy@borderstamp.com |
| Consulting (overview, 3 audiences, services, FAQ) | ✅ |
| Blog and Atom feed | ✅ 1 post |
| AI-agent layer | ✅ JSON-LD, `llms.txt`, `llms-full.txt`, `/consulting/services.json`, AI-aware `robots.txt` |
| Consulting MCP server | ✅ `https://xerodonia-mcp.autumn-glitter-b50d.workers.dev/mcp` (repo `pdarcey/xerodonia-mcp`); enquiries become GitHub issues and an email to hello@ |
| Link previews, favicons | ✅ |
| Visit counts | ✅ **Live 2026-10-25 (#641, verified by Paul and closed):** TelemetryDeck (WebSDK 1.1.0: one pageview per page, no storage) on every page, the only script besides JSON-LD; the build check enforces it. Privacy page has a "Visit counts" section and the short version "Anonymous visit counts / No cookies / No tracking across sites". About, `llms.txt` and the Readme updated. |
| Clarity logo files | ✅ `logo.svg` and `logo.png` (1024 px) in the repo root represent this project in Clarity (2026-10-13). They aren't part of the site; `Readme.md` says how to keep them matching the site's mark. Awaiting Paul's check (#546) |
| SEO and compliance (Stage 6) | ✅ **Done 2026-10-08.** W3C-valid, Lighthouse 100 across the board, no broken links (`Documentation/Audit-2026-10.md`). Every push runs build → check → deploy; PRs check without deploying; a weekly job checks external links and the MCP server and opens a GitHub issue (which syncs to Clarity). Search Console and Bing verified. |
| App Store IDs | ✅ In each app's YAML (2026-10-07). Store links appear only when `status` is `app-store`; no build is uploaded yet |
| Screenshots | ✅ **Stage 5d done (2026-10-07).** Blueprint: Mac, iPhone and iPad, plus iPad and iPhone widgets. Upcoming Birthdays: all three platforms; new app icon (cake) on 2026-10-15, with the icon, link-preview card and iPad screenshots updated and `requires` raised to iOS/iPadOS/macOS 27. Borderstamp: iPhone and iPad (stamps, maps, iPad widgets; dark maps and widgets wait for Borderstamp #488). Clarity: Mac. Scoreboard deferred. **2026-10-21 (live):** Upcoming Birthdays uses the Marketing repo's images (headlines drawn in, light and dark, one strip per device, `src/_data/screenshots/`); the others still use YAML screenshots. `scripts/capture-screenshots.sh` is gone: the Marketing repo's scripts replace it. |
| Press page | **2026-10-21 (live):** `/press/` lists each product's press kit, a zip in the GitHub release `press-<slug>` on this repo, uploaded by the Marketing repo. Footer link under Company. |
| Locales | **2026-10-21 (live):** `lib/locales.js` (en-AU only) feeds `lang`, Open Graph, the feed, dates, prices and JSON-LD. |

## Related repos
| Repo | Change | Pushed? |
|---|---|---|
| `pdarcey/upcoming-birthdays` | **New private repo** (created 2026-10-06). Mac people picker, crash fixes, widget fixes (see below) | ✅ |
| `pdarcey/xerodonia-mcp` | MCP server | ✅ |
| `pdarcey/consulting-enquiries` | Private repo for enquiries (label `consulting-enquiry`) | ✅ |
| `pdarcey/borderstamp-com`, `pdarcey/borderstamp-app` | Domain redirects | ✅ |
| `pdarcey/obfuscate` | Made public | ✅ |
| Blueprint | Screenshot mode (#465) `461a799`; Paul's TestFlight prep `7153c07`; widget screenshot mode, `-ScreenshotScroll`, #492 `93313d7` | ❌ local only, on purpose (Paul: keep local) |
| Borderstamp | iPhone/iPad only and project clean-up `965723d`; screenshot mode and fixes #484–#490 `bacfcf9`; widget most-visited `6c5065d`; packs at launch `b5e3fc6`; canonical site `428e2f0`; xerodonia.com links and a current in-app privacy summary (#481) `9c0bbbc` | ❌ local only, on purpose. `project.pbxproj` uncommitted (#483) |
| Clarity | Screenshot mode (#466), `74086dc` | ❌ local only, on purpose (Paul: don't push) |

### Upcoming Birthdays commits this session (all pushed)
- `064a981` Mac people picker (Choose People sheet, search by name or nickname, Remove/Delete); nobody chosen means no one shown; fixes an endless fetch → reschedule-notifications loop and a nested-`NavigationStack` crash. Template UI tests removed from both schemes' test plans.
- `05ac409` Mac app icon (`AppIcon.icon` joined the Mac target); three concurrency warnings cleared.
- `15355d4` Widgets read shared data fresh (#477) and "Next X Days" uses its setting (#478).
- `50dbe96` Paul's `#if DEBUG` around previews.
- Tests: 26 Swift Testing tests in the Mac test target, all passing. Run with `xcodebuild test -scheme "Upcoming Birthdays Mac" -destination 'platform=macOS'` (no Simulator needed).
- **Uncommitted, Paul's own:** `Readme.md`, `xcschememanagement.plist`, untracked `CLAUDE.md` and `Journal.md`. The repo has no `.gitignore` yet, so three `xcuserdata` files are tracked (suggested clean-up).

## Domains (2026-10-06)
- `borderstamp.com` and `borderstamp.app` redirect to https://xerodonia.com/apps/borderstamp/ over HTTPS, via the GitHub Pages repos `pdarcey/borderstamp-com` and `pdarcey/borderstamp-app` (both public and pushed). Paul tested them in a browser, and Clarity #476 is closed.
- Fastmail's old Borderstamp site files are deleted. Mail for both domains goes to Fastmail.

## Open Clarity issues
- **Awaiting Paul's check:** xerodonia.com #468 (Stage 5d); Blueprint #465 (screenshot mode, now with widgets) and #492 (widget order); Clarity #466.
- **xerodonia.com #470:** Stage 7. **#546:** Clarity logo files, awaiting Paul's check. **#493:** "Clarity check", a test issue imported from GitHub issue #1; close it when Paul agrees.
- **Borderstamp:** #488 (map dark-mode colours; blocks the dark map and widget shots), #483 (project self-reference, parked), #482 (native Mac port, after v1.0), #460 and #461 (privacy manifest, merchandise note).
- **Clarity #467** (sample-data polish) and **#491** (MCP `issue_update` can detach an issue from its project; seen on Borderstamp #489 and #490, which Paul reattached).
- **Upcoming Birthdays** #473 (awaiting verification), #475, #479, #480, #462.
- **Closed 2026-10-07/08:** #481 (Borderstamp's links; Paul checked it on his device), #469 (Stage 6), Borderstamp #484 (year index), #485 (Stamps tab icon, Paul), #486 (map filter at launch), #487 (map count), #489 (iPad grid), #490 (most visited).

## Decisions made in the 2026-10-05/06/07 sessions
- **Borderstamp's region packs are a v1.0 launch feature** (2026-10-07): Countries is free, the other 27 packs are optional in-app purchases. Stamps for packs you don't own are still awarded (tracking and the photo scan) and appear, with their dates, when you buy the pack. The page says so, with no timing.
- **xerodonia.com/apps/borderstamp/ is Borderstamp's canonical site** (2026-10-07); `borderstamp.com` and `.app` redirect there.
- **Borderstamp counts generously** (2026-10-07): the widgets' "Regions" includes countries. It's a fun app; a bigger number makes people happy.
- **Blueprint's widgets match the dashboard's order** (#492): timed events and reminders together in time order, then the untimed ones.
- **Scoreboard gets no screenshots yet:** it has no screens worth advertising.
- **Borderstamp drops Mac from v1.0** (2026-10-06, evening). The target listed native Mac, but that build never compiled (about 40 errors; Borderstamp #482). Paul removed the Mac destination. The site lists iPhone and iPad only, and the shared privacy template now mentions Mac settings only for apps listed on Mac.
- TestFlight is **invite-only**: no public TestFlight links on the site.
- Automated release-note updates open a **PR for Paul to approve**. They're never auto-merged.
- **iPhone/iPad screenshots unblocked (Clarity #472):** the Simulator CPU problem was interrupted first boots. The iPhone 18 Pro Max and iPad Pro 13-inch (M5) are warmed up for screenshots.
- Upcoming Birthdays' sample people have **Image Playground portraits** (fictional, made on Paul's Mac); the photos are a development asset and never ship.
- The Mac app uses the real (iOS) `SettingsView`; the Mac stub was deleted.
- **Upcoming Birthdays ships on Mac with a people picker** (Plan question 10), so all three platforms can be marketed. With full access and nobody chosen, the app shows no one (iOS too).
- **"Next 3 days" means today plus the next 3 days** in the X-days widget.
- **No UI tests in default test plans:** the template stubs added nothing and took over the Mac.
- **Screenshots:** the iPad list is held back (it adds nothing over iPhone and Mac); widgets lead. Home Screen shots never include third-party content (News headlines, etc.).
