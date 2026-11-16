---
title: "Scars, and How to Avoid Them"
description: "Eight small lessons for working with agents"
date: 2026-11-17
category: AI agents
---

If a friend told us they were starting out with an AI coding agent, and asked for one piece of advice, it would be this:

**Make it plan, every time. Then stop and check after each stage.**

Everything else in this post is a scar. Each one came from something going wrong, or nearly going wrong, in our own work. None of them needs a new tool or a bigger plan. They’re habits, and you can pick up any of them tomorrow.

## Before it starts

### 1. Make it plan, every time

Agents are keen. Ask for a feature and they’ll start writing code straight away, often more code than you wanted. Back in February, we noticed they tend to overcomplicate things and are too keen to start coding. That hasn’t changed much.

So now there’s a rule in our agent’s instructions: before any change, make a plan and check it with us. Then do it one stage at a time, and stop after each one so we can look at it before it carries on.

It sounds slow. It isn’t. The plan is where you catch the bad ideas, and they’re cheap to throw away while they’re still a few paragraphs of text.

When we asked our agent how it could add issues to our issue tracker, its plan was to drive the app by reading the screen and clicking buttons. Reading that plan took two minutes, and it saved us from building something fragile that we’d have been fixing forever. ([That story has its own post](/blog/adding-an-mcp-server-to-your-app/).)

Stopping after each stage matters just as much. A small mistake in stage one becomes a big one by stage four, because everything after it is built on top.

### 2. Don’t trust a confident plan. Test it

A plan can be detailed, well reasoned, checked against the documentation, and still wrong.

One of ours depended on a notification that macOS is documented to send when another process changes a database. The plan was solid. The function signatures were right. The notification just didn’t arrive reliably. We only found out because we built a tiny throwaway test first: two processes, one database, and nothing else. It took far less time than building the real thing on a broken foundation would have.

When a plan hinges on something you haven’t seen work with your own eyes, ask the agent to prove that one piece first, in the smallest test it can. And when something looks wrong, test one thing at a time. We once had a screen that drew every heading and none of the content. Five tiny test apps, each trying one construct, found the culprit in minutes. Staring at the whole screen hadn’t.

## While it works

### 3. Correct it once, then write it down

Most people correct their agent, then correct it again next week, and the week after. Agents don’t remember yesterday unless something tells them.

The fix is to have the agent write the correction into its own instructions file (`CLAUDE.md`, `AGENTS.md`, or whatever yours reads) the first time you find yourself repeating it. It takes seconds, and that correction is finished with forever.

The catch is that these files grow. Anthropic suggests keeping each one under 200 lines, because longer files take up more of the agent’s attention and get followed less closely. Several of ours are well past that, and trimming them is slow work. So write it down, but keep it short, and move anything general somewhere it can be shared. Which brings us to…

### 4. Don’t let each project learn alone

An agent’s memory usually stops at the edge of the project. We found that one hard-won lesson (“never hand-edit the Xcode project file”) had been learnt, and saved, in four different projects. Each time, we’d paid for the lesson again.

Now lessons go into one shared knowledge base, which every agent reads, in every project. Learn it once, and every project knows it. ([Here’s how ours is set up](/blog/how-we-set-up-our-ai-agents/).)

### 5. Give it tools, not copy and paste

If you’re copying text out of one app and pasting it into the agent, then copying its answer back, you’re acting as the agent’s hands. Lots of tools now come with an MCP server, which lets the agent use them directly. Some apps, like our own issue tracker, needed one added.

Now we say “log this as an issue” in the middle of a conversation, and it’s done, without either of us leaving what we were working on.

## After it says “done”

### 6. Check what actually happened

“Done” is a claim, not a fact.

We run a batch of agent jobs every Sunday at 2 am: security audits, documentation checks, that kind of thing. For two Sundays running, the jobs that needed our issue tracker couldn’t reach it. Every one of them still reported “ok”.

That one stung, because we’d been caught before. In an earlier run, a job reported success after every single edit it tried had been refused. Another time, a fix was marked “fixed” in the patch and “fixed” in our journal, and only `git log` showed it had never been committed.

So check the output, not the summary. Look at the diff. Run the tests yourself. And when you build something that runs while you’re asleep, make it fail loudly: our jobs now fail unless they finish with a list of what they found, even if that list is empty.

### 7. Automate the reviews, but read them

Reviews you run “when you remember” don’t get run. So we made them automatic: that Sunday batch runs fifteen jobs and leaves us a report and some proposed changes to look at over coffee.

But automation only moves the work, it doesn’t remove it. Before we rebuilt the batch, six of its jobs had been failing for two weeks and nobody noticed, because nobody was reading the output. A report nobody reads is just a log file.

## And a bonus

### 8. Let it build throwaway tools

Every project has small, boring data jobs that never quite get done. We had a long log from a wi-fi monitor, and wanted a summary of it. Writing that script ourselves wasn’t worth the time. Having the agent write it took minutes, and it turned up things we’d never have spotted by eye.

When a chore isn’t worth your time, it might be worth a tool you’d never have bothered to write. Use it, then throw it away.

## What these cost

None of these means buying anything. What most of them cost is your attention: reading plans, checking stages, looking at diffs, reading reports. That’s the point. The agent does the typing, and you stay the one who decides.

<aside aria-label="If you’re a team">

**If you’re a team**

We’re a single developer, and teams will be different in places. Writing things down (3) and sharing lessons (4) change the most: shared instructions need someone who owns them, or they drift. A batch report (7) needs someone whose job it is to read it. And the stop after each stage (1) starts to look a lot like code review, which your team probably already does.

</aside>

## What’s next?

Pick one. If you only pick one, make it the first: next time you give your agent a job, ask for a plan before it writes a line of code, and ask it to stop after each stage.

If you’d like a second opinion on where agents could help your business, [book a free AI Opportunity Audit](/consulting/). It’s 15 minutes, with no obligation and no jargon.

You can collect your own scars. But it’s cheaper to borrow ours: **make it plan, check what it did, and write down what you learnt.**

*This post was drafted with Claude Code, from our own notes and a fact sheet, and then edited by us. Our stories use Claude Code because it’s what we actually use; the advice should apply to any coding agent.*
