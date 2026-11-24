---
title: "How Many Times Have I Got to Tell You?"
description: "Agents are dumb. Stop telling them the same thing over and over."
date: 2026-11-24
category: AI agents
---

Every parent has said it. Most developers who work with AI agents have said it too, usually through gritted teeth.

“**How Many Times Have I Got to Tell You?**”

AI coding agents have been trained on the entire world’s knowledge, but in one way they’re dumb: they don’t remember. Each session with Claude Code “begins with a fresh context window,” in the words of its own documentation. Anything it learnt yesterday is gone, unless something tells it again.

The usual fix is to write things down for it. That works, up to a point. This post is about the point where it stops working, and what we built to get past it.

## Living in their own private Idaho[^1]

Agents do have ways to remember. Claude Code reads an instructions file (`CLAUDE.md`)[^2] at the start of every session, and it keeps its own notes, called auto memory. Other agents have their own versions of both.

But both have walls around them. Auto memory belongs to one repository, and stays on one machine. The instructions file belongs to one project. So **a lesson learnt in one project stays in that project**. The next project has to learn it all over again.

And **it’s frustrating, because _you_ know you’ve seen this before**, with this same agent… just yesterday! But it’s oblivious because it was in a different project.

## I make the same mistakes / Feels like I never learn[^3]

At the end of October, we surveyed our own work: 48 repositories, and about 180 memories saved across them. It was like finding the same sticky note on every desk in the office, each written by hand, each slightly different.

- **One lesson, learnt four times.** “Never hand-edit the Xcode project file” had been learnt, and saved, separately in four projects. Each time, we’d paid for that lesson again.
- **The same battle, months apart.** Two of our apps fought exactly the same fight with the Mac’s Settings window. The second had no idea the first had already won it.
- **Rules that disagreed.** Some projects tagged versions with a “v”, and some didn’t. The documentation folder had three different names. An agent told two different things follows whichever it read last.

None of these was a disaster on its own. Together, they were a tax on everything we did.

## Step by step / Bit by bit / Stone by stone / Brick by brick[^4]

Our solution was to build one shared knowledge base: a git repository of plain Markdown files, which every agent reads, in every project.

It’s deliberately simple:

- **One lesson per note**, with a title that states the lesson (“CloudKit needs every SwiftData relationship to be optional”), not just the topic.
- **Every note is checked against its source** before it goes in, and records the date it was last verified. A wrong note in one project misleads one project; a wrong note here misleads all of them.
- **Projects link to notes, and never copy them.** Our project docs now hold 243 of these links. When a lesson changes, it changes once.
- **Every agent is told to search it before solving a problem**, and to add any lesson that would help another project.
- **It’s all indexed** to make finding things easier.

About 100 of those existing memories were promoted into notes or archived. The rest really were about just one project, so they stayed where they were.

Before trusting it, we tested it. In our test, the agent went to the knowledge base on its own, and came back with a lesson about SwiftData that had been learnt in a completely different app.

([Here’s a tour of the whole setup](/blog/how-we-set-up-our-ai-agents/), if you’d like more details.)

## You don’t know what it’s like[^5]

What’s it like to live with?

The knowledge base started with 392 notes. Three weeks later it had 518: 126 new lessons, about six a day. To get in at all, **a lesson has to be one that would help more than one project**. The biggest groups are Swift, Xcode and SwiftUI, followed by shell scripts, testing and releasing apps.

It’s working the way we wanted when we set it up. It’s given us the consistency we’d always wanted: one answer to each question, in every project. And it doesn’t get in the way. It’s quick and easy for agents, and for us, to look things up.

We can’t point to a particular moment when it saved us. By design, it gets looked at during the planning phase – before anything gets implemented – so *problems are avoided before they even come up*.

That’s the odd thing about a solution that works: its wins are invisible. A problem avoided during planning leaves no story behind. There’s no dramatic rescue to tell you about, just a lot of mistakes that didn’t happen.

It isn’t perfect, though. Twice we’ve “rediscovered” something that was already there. Once, an agent spent time fighting a widget that wouldn’t hide private information on a locked iPhone. The answer had been in the knowledge base for almost a week. As the agent put it afterwards: “I should have searched there first.”

Which is the real lesson. **Having the knowledge isn’t enough. Looking it up is the habit.** A noticeboard nobody reads is just a boring piece of art.

## Here’s what it cost[^6]

<aside aria-label="If you’re a team">

**If you’re a team**

Arguably, there’s a *greater* need for a shared knowledge base among teams, not just for the agents, but to share information with your colleagues too.

But someone needs to own it, and it needs a way to review changes, such as pull requests. And some notes may need limits on who can read them.

But the benefit is likely to be bigger, too: learning from your own experiences is good, but learning from *other people’s* experiences is better.

And, when you’re onboarding new people: **the notes your agents read are notes your people can read too**. Written down once, a lesson helps the next new starter as much as the next agent.

</aside>

- **Time.** Building it took about four days of heavy agent use. Since then it’s had a little attention most days: 189 commits in three and a half weeks. At the end of each session we automatically ask ourselves if there are lessons we should remember and, if there are, we record them (or update existing lessons).
- **Context.** Everything an agent reads uses up some of its attention. We changed our rules so that most load only when they’re needed (the Swift rules only when the agent opens a Swift file), to minimise this cost. We were able to *reduce* our startup context costs with this setup.
- **Maintenance.** Adding or updating notes at the end of a session takes no more, or little more, time than just saving them in a single project. To help keep it always up to date, we run weekly batch jobs to check the knowledge base. (Its first review found five notes that had gone out of date.) Somebody has to read those reports, which is a cost in time and effort.
- **It’s unfinished.** And it’s never going to be finished. This is ongoing work, but it provides ongoing benefits.

## I’m ready for what’s next[^7]

You don’t need 500 notes to start. Next time you catch yourself correcting your agent about something that isn’t specific to this project, put the correction in one *shared* place, outside the project. Then tell every agent to look there before it starts. ([Our tips post](/blog/small-changes-that-make-ai-agents-better/) has more habits like this, and here’s [what happened when we gave an app its own MCP server](/blog/adding-an-mcp-server-to-your-app/).)

**It’s a lot easier to avoid a problem than to fix it later**. And it’s a lot *lot* easier to avoid a problem than to fix it *multiple* times!

If you’d like a second opinion on where agents could help your business, [book a free AI Opportunity Audit](/consulting/). It’s 15 minutes, with no obligation and no jargon.

You’re not your agent’s parent. Stop telling it the same thing over and over!

PS How many songs’ lyrics did you recognise in the section titles?

[^1]: **The B-52’s**: _Private Idaho_
[^2]: Other agents do the same thing with `AGENTS.md`.
[^3]: **The Echo Friendly**: _Same Mistakes_
[^4]: **Dolly Parton**: _Step by Step_
[^5]: **Bee Gees**: _To Love Somebody_
[^6]: **Def Leppard**: _Women_
[^7]: **U2**: _Zoo Station_

*This post was drafted with Claude Code, from our own notes and a fact sheet, and then edited by us. Our stories use Claude Code because it’s what we actually use; the idea should work with any coding agent.*
