# xerodonia.com — Status

*Snapshot at the end of the 2026-10-05 session. See `Plan.md` for the roadmap and "Next session".*

## Live at https://xerodonia.com
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
| Screenshots | 🔶 Blueprint (Mac, light and dark), Clarity (Mac ×4, light and dark). Others are still to do. |

## Related repos changed this session
| Repo | Change | Pushed? |
|---|---|---|
| `pdarcey/xerodonia-mcp` | New: MCP server | ✅ |
| `pdarcey/clarity_feedback_relay` | Its `INGEST_TOKENS` secret gained a consulting-enquiries token (no code change) | n/a |
| `pdarcey/consulting-enquiries` | New private repo for enquiries (label `consulting-enquiry`) | ✅ |
| `pdarcey/obfuscate` | Made public | ✅ |
| Blueprint | Screenshot mode (#465), `461a799` | ❌ local only |
| Clarity | Screenshot mode (#466), `74086dc` | ❌ local only |

## Open Clarity issues for this site
- **xerodonia.com #452–459:** the original audit. All are now fixed or superseded by the rebuild; they're waiting for Paul to verify before they're closed.
- **Blueprint #465, Clarity #466:** screenshot modes, awaiting verification (Blueprint also awaits its iPhone/iPad shots).
- **Clarity #467:** sample-data polish.
- **Borderstamp #460, #461; Upcoming Birthdays #462:** privacy manifests, and the merchandise-store policy note.
