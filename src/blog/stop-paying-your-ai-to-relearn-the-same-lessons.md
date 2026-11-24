---
title: "Institutional Amnesia"
description: "Your agents and staff should share knowledge"
date: 2026-11-24
category: AI agents
---

Every business knows the cost of losing what it knows. Someone leaves, and the reason things are done a certain way leaves with them. A new starter makes the mistake everyone else made three years ago. Worse, you can’t point a new starter at information because it’s scattered around in various silos, some of it up to date, most of it not.

AI agents have the same problem, only faster. They forget at the end of every session.

We use AI coding agents every day to build our own apps. This is the story of how we noticed the problem, found out what it was costing us, and what we did about it.

**Note**: we’re one developer, not a team, so this is one person’s experience. Teams will be different in places, but the problem is the same.

## The problem: every project learns alone

Even if you’re a single developer, if you’re working on multiple projects, you may have noticed this too: AI agents can be given notes to read, and some keep their own. But those notes usually belong to one project, on one computer. A lesson learnt in one project doesn’t reach any of the others.

When we looked across our own work to write this blog post, we found actual examples:

- **The same lesson, paid for four times.** One hard-won rule about a project file had been learnt, and written down, separately in four projects.
- **The same problem, solved twice,** months apart, by two apps that didn’t know about each other.
- **Rules that disagreed** from one project to the next. An agent given two answers follows whichever it read last.

None of these was a disaster on its own. Together, they were a quiet tax on everything we did.

And **it’s frustrating, because _you_ know you’ve seen this before**, with this agent, but it’s oblivious because it was in a different project.

## The fix: one place for what we’ve learnt

We built a shared knowledge base: one set of plain written notes that every agent reads, in every project. Each note holds one lesson. Each is checked against the facts before it goes in, because a wrong note there would mislead every project at once. And every agent is told to look there before it starts solving a problem.

We started it at the end of October. It now holds 518 notes, 126 of them added in the last three weeks alone. Each one is a lesson we shouldn’t have to pay for twice.

## What it’s like to live with

It’s working the way we wanted. We have one answer to each question, in every project, and that consistency is something we’d always wanted.

The odd thing is that we can’t point to a dramatic rescue. That’s by design. The knowledge base gets read while the work is being _planned_, so problems are _avoided before they happen_. A mistake that didn’t happen doesn’t leave a story behind.

It isn’t perfect. A couple of times, an agent has solved a problem that was already written down, because it didn’t look first. Which is the real lesson: **knowledge only pays off if looking it up is a habit.** That’s as true of people as it is of agents.

## What it costs

- **Time to set up:** about four days of heavy agent use, plus at the end of each session we automatically ask ourselves if there are lessons we should remember.
- **Upkeep:** an automated check runs every week, and someone has to read what it finds.
- **Attention:** every note an agent reads takes up some of its working memory, so the notes need to stay short and load only when they’re needed.
- **It’s never finished.** Some of our older project notes are still far longer than they should be. Moving lessons into the shared knowledge base is slow work.

It needs no new software. It’s plain text files, kept in the same version control we already use for our code.

## For a team

A shared knowledge base needs an owner, and a way to review changes before they go in. Without one, everyone adds to it, nobody prunes it, and it slowly stops being trusted. Some notes may need limits on who can read them. But the payoff is likely to be bigger than ours: a team has more people and more projects learning the same lessons separately.

And here’s the bonus: **the notes your agents read are notes your people can read too**. Written down once, a lesson helps the next new starter as much as the next agent.

## What’s next?

Start small. Next time someone on your team corrects an AI agent about something that isn’t specific to one project, have them write it down somewhere shared, and tell every agent to look there first. ([Our eight small habits](/blog/small-ai-habits-that-pay-off-for-your-team/) work the same way.)

It’s a lot cheaper to avoid a problem than to fix it later. And it’s a lot *lot* cheaper to avoid a problem than to fix it *multiple* times!

If you’d like a second opinion on where AI could help your business, [book a free AI Opportunity Audit](/consulting/). It’s 15 minutes, with no obligation and no jargon.

Forgetting is expensive, for agents and for people. **Write it down once, and make looking it up a habit.**

*For your technical team: [the developer’s version of this story](/blog/give-your-ai-agents-a-shared-knowledge-base/), with the details.*

*This post was drafted with Claude Code, from our own notes, and then edited by us.*
