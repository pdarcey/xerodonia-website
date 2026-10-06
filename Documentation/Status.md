# xerodonia.com — Status

*Snapshot at the end of the 2026-10-05/06 session. See `Plan.md` for the roadmap and "Next session".*

## Live at https://xerodonia.com
**Not yet pushed:** the local commits since `2d47e69` (docs, and Upcoming Birthdays' Mac screenshots). They go live with the next push to `main`.

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
| Screenshots | 🔶 Mac, light and dark: Blueprint, Clarity (×4), Upcoming Birthdays (×2, committed, not pushed). Still to do: Borderstamp Mac; every iPhone/iPad shot and Upcoming Birthdays' widgets. |

## Related repos changed this session
| Repo | Change | Pushed? |
|---|---|---|
| `pdarcey/xerodonia-mcp` | New: MCP server | ✅ |
| `pdarcey/clarity_feedback_relay` | Its `INGEST_TOKENS` secret gained a consulting-enquiries token (no code change) | n/a |
| `pdarcey/consulting-enquiries` | New private repo for enquiries (label `consulting-enquiry`) | ✅ |
| `pdarcey/obfuscate` | Made public | ✅ |
| Blueprint | Screenshot mode (#465), `461a799` | ❌ local only, on purpose (Paul: don't push) |
| Clarity | Screenshot mode (#466), `74086dc` | ❌ local only, on purpose (Paul: don't push) |
| Upcoming Birthdays | Screenshot mode (12 fictional Australians), Mac target builds again (#473), `65b1acf` | ❌ local only |

## Open Clarity issues for this site
- **xerodonia.com #452–459:** the original audit. All are now fixed or superseded by the rebuild; they're waiting for Paul to verify before they're closed.
- **Blueprint #465, Clarity #466:** screenshot modes, awaiting verification (Blueprint also awaits its iPhone/iPad shots).
- **Clarity #467:** sample-data polish.
- **xerodonia.com #472:** the Simulator CPU investigation. Solved (interrupted first boots); awaiting verification.
- **Upcoming Birthdays #473** (Mac build, fixed, awaiting verification), **#474** (Mac people picker: built 2026-10-06, awaiting verification), **#475** (stale test dates, `os(ios)` typo, `print()`).
- **Borderstamp #460, #461; Upcoming Birthdays #462:** privacy manifests, and the merchandise-store policy note. Paul has confirmed what each app collects (comments on #460 and #462).

## Decisions made in the 2026-10-05/06 session
- TestFlight is **invite-only**: no public TestFlight links on the site.
- Automated release-note updates open a **PR for Paul to approve**. They're never auto-merged.
- **iPhone/iPad screenshots unblocked (Clarity #472):** the Simulator CPU problem was interrupted first boots. The iPhone 18 Pro Max and iPad Pro 13-inch (M5) are warmed up for screenshots.
- Upcoming Birthdays' sample people have **Image Playground portraits** (fictional, made on Paul's Mac); the photos are a development asset and never ship.
- The Mac app uses the real (iOS) `SettingsView`; the Mac stub was deleted.
