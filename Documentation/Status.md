# xerodonia.com — Status

*Snapshot at the end of the 2026-10-06 session (afternoon). See `Plan.md` for the roadmap and "Next session".*

## Live at https://xerodonia.com
Everything is pushed and live.

- GitHub Pages, deployed by GitHub Actions on every push to `main` (repo `pdarcey/xerodonia-website`, public). HTTPS is enforced; `www` redirects to the apex.
- DNS stays at Fastmail (A/AAAA records to GitHub; `www` CNAME). Email records are untouched.
- 32 output files, built in about 0.3 s once images are cached. No JavaScript: the post-build guard fails the build on any executable script.

| Area | State |
|---|---|
| Home, About, Contact, website privacy | ✅ |
| App pages (6) | ✅ Blueprint, Borderstamp, Upcoming Birthdays, Scoreboard, Clarity, obfuscate |
| App privacy and support pages | ✅ Blueprint, Borderstamp, Upcoming Birthdays (the App Store Connect URLs) |
| Consulting (overview, 3 audiences, services, FAQ) | ✅ |
| Blog and Atom feed | ✅ 1 post |
| AI-agent layer | ✅ JSON-LD, `llms.txt`, `llms-full.txt`, `/consulting/services.json`, AI-aware `robots.txt` |
| Consulting MCP server | ✅ `https://xerodonia-mcp.autumn-glitter-b50d.workers.dev/mcp` (repo `pdarcey/xerodonia-mcp`); enquiries become GitHub issues and an email to hello@ |
| Link previews, favicons | ✅ |
| Screenshots | 🔶 **Upcoming Birthdays: done on all three platforms** (iPhone widgets and list, iPad widgets, Mac list, Choose People sheet and details; light and dark). Blueprint and Clarity: Mac only. Still to do: Borderstamp (iPhone/iPad; no Mac in v1.0), Blueprint and Scoreboard iPhone/iPad. |

## Related repos
| Repo | Change | Pushed? |
|---|---|---|
| `pdarcey/upcoming-birthdays` | **New private repo** (created 2026-10-06). Mac people picker, crash fixes, widget fixes (see below) | ✅ |
| `pdarcey/xerodonia-mcp` | MCP server | ✅ |
| `pdarcey/consulting-enquiries` | Private repo for enquiries (label `consulting-enquiry`) | ✅ |
| `pdarcey/borderstamp-com`, `pdarcey/borderstamp-app` | Domain redirects | ✅ |
| `pdarcey/obfuscate` | Made public | ✅ |
| Blueprint | Screenshot mode (#465), `461a799` | ❌ local only, on purpose (Paul: don't push) |
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
- **Blueprint #465, Clarity #466:** screenshot modes, awaiting verification (Blueprint also awaits its iPhone/iPad shots).
- **Clarity #467:** sample-data polish.
- **xerodonia.com #468:** Stage 5d, remaining screenshots and the capture script.
- **xerodonia.com #469, #470:** Stages 6 and 7.
- **xerodonia.com #481:** replace hard-coded `borderstamp.com` links in the Borderstamp app. Do it before or during the App Store Connect setup.
- **Upcoming Birthdays #473** (Mac build, fixed, awaiting verification), **#475** (stale test dates, `os(ios)` typo, `print()`), **#479** (large widget a third empty), **#480** (iPad list stretches full width).
- **Borderstamp #460, #461; Upcoming Birthdays #462:** privacy manifests, and the merchandise-store policy note. Paul has confirmed what each app collects (comments on #460 and #462).
- **Closed this session:** xerodonia.com #452–459 (old-site audit) and #472 (Simulator CPU); Upcoming Birthdays #474 (Mac picker), #477 (stale widget data), #478 (X-days range).

## Decisions made in the 2026-10-05/06 sessions
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
