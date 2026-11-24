---
title: "Big Bangs for Small Bucks"
description: "Eight small habits that decide whether AI pays off. None of them means buying anything new."
date: 2026-11-17
category: AI agents
---

When AI doesn’t pay off, the usual answer is to buy something: a bigger plan, a different tool, another subscription. In our experience, that’s rarely the problem.

We use an AI coding agent every day to build our own apps. What made the difference wasn’t the tool. It was a handful of habits, most of which we learnt the hard way. None of them costs anything extra.

A word of warning before we start: we’re one developer, not a team. These habits come from our own work. Teams will be a bit different, but the lessons remain the same.

## The one that matters most

**Make the agent plan, _every time_, and check its work after each stage.**

Left alone, AI agents are eager. Give one a job and it starts straight away, often doing more than you asked. A plan, a few paragraphs saying what it intends to do, is where you catch the bad ideas while they’re still cheap to throw away. One of our agent’s plans would have built something fragile that we’d have been fixing forever. Reading the plan took two minutes, and we found a much simpler way.

Checking after each stage stops a small mistake from becoming the foundation for everything that follows.

**For a team:** this is code review, moved earlier. Most teams already review work. The habit is reviewing the *plan* too, before anyone (or anything) builds it.

## Three habits that stop you paying twice

**Write corrections down.** Agents don’t remember last week. If you correct one, have it write the correction into the instructions it reads every time. Otherwise you’re paying, in time, for the same lesson again and again.

**Share what you learn.** Each project’s agent usually learns alone. We found the same lesson saved separately in four of our projects: four times we’d paid for it. Now lessons go into one shared knowledge base that every agent reads. ([Here’s why we built ours](/blog/stop-paying-your-ai-to-relearn-the-same-lessons/), and [how it works](/blog/how-we-set-up-our-ai-agents/).)

**Connect your tools.** If people spend their day copying text between an AI and other systems, they’re acting as its hands. Many business tools can now connect to an agent directly, through a standard called MCP. ([Why we added one to our own app](/blog/adding-an-mcp-server-to-your-app/).)

**For a team:** shared instructions need an owner. Without one, everyone adds to them, nobody prunes them, and they slowly stop working.

## Three habits that stop you being fooled

**Test before you commit.** A confident, detailed plan can still be wrong. Ours once depended on a feature that was documented, and simply didn’t work reliably. A tiny test, built first, showed it. Building the real thing on top would have cost far more.

**Check “done”.** An agent saying it’s finished is a claim, not a fact. We run a batch of automated jobs every Sunday night. For two weeks, some of them couldn’t reach one of our systems, and every one still reported success. We only caught it because we checked what they’d actually done.

**Automate reviews, then read them.** Automated reviews get run, which manual ones often don’t. But earlier, before we rebuilt that batch, six of its jobs had been failing for a fortnight, and nobody noticed, because nobody read the output. Automation moves work; it doesn’t remove it.

**For a team:** a report needs a reader. Make reading it somebody’s job, by name.

## And one that pays for itself

**Let it build throwaway tools.** Every business has small, boring data jobs that never get done because they’re not worth a person’s time. An agent can often write a quick tool for one in minutes. We had one summarise a long log that we’d never have read by hand. Use the tool once, then throw it away.

Agents can wrangle enormous quantities of data into one-off reports – work that would not be worth allocating a person to in the pre-AI times.

## What it costs

None of this means buying anything. Our own AI plan costs us about AUD$28 a month.

The cost is your team’s attention: someone reading plans, checking work, and reading reports. That’s not a side effect. It’s what keeps a person in charge of the work, rather than the agent.

One thing to budget for, though. At pay-as-you-go rates, 30 days of our heavy use would cost over a thousand dollars, many times what we pay for the plan. A team should budget from its own usage, not from the cheapest plan on the price list.

## What’s next?

Start with the first habit. Next time someone on your team gives an AI agent a job, have them ask for a plan first, and stop to check after each stage.

If you’d like a second opinion on where AI could help your business, [book a free AI Opportunity Audit](/consulting/). It’s 15 minutes, with no obligation and no jargon.

The big wins from AI don’t come from big spending. **Plan first, check the work, and write down what you learn.**

*This post was drafted with Claude Code, from our own notes, and then edited by us.*
