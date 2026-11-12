---
title: "Agents Aren’t Human"
description: "Why we gave our Mac app an MCP server instead of letting an agent click around its window: what it took, what changed, what it costs, and what went wrong."
date: 2026-11-11
category: AI agents
---

Like a lot of developers, we used to write down issues everywhere. Some were in Notes, some in text files, some in GitHub issues. Some were on Post-it notes, some were scribbled down somewhere, and some lived only in our heads.

Despite every developer’s well-known *love* for Jira, it’s overkill for a single developer. So we wrote our own: a simple database with a nice front end, that worked the way we wanted. We slowly loaded it up with the dozens of issues scattered across all those places. We call it **Clarity**.

## The rise of the machines

Around the same time, we kept hearing that AI agents had become *good*, and that they were worth a look, especially for indie developers. So we looked. We went with Claude, for no particular reason, on the US$20-a-month plan, paid for a year.

We did the usual learning: setting up a `CLAUDE.md`, skills and all the rest. And we started to get good results. We could work through issues and features quickly. But, along the way, we kept finding new issues, and coming up with ideas for new features, and we had to open and close every one of them in Clarity by hand. Claude didn’t know about Clarity. And even if it had, it couldn’t have used it.

So we asked it: how could we set things up so that it could add issues to Clarity?

## “Tricky”

It was a bit like asking Deep Thought for the answer to life, the universe and everything:

> Deep Thought paused for a moment’s reflection.
>
> “Tricky,” he said finally.
>
> “But can you do it?”
>
> Again, a significant pause.
>
> “Yes,” said Deep Thought, “I can do it.”
>
> — Douglas Adams, *The Hitchhiker’s Guide to the Galaxy*

You see, Clarity is a GUI app. It has a window and nothing else, and you use it by pointing and clicking.

The agent went away and came back with an elaborate plan. It would “see” the window, using the accessibility settings and screen recording. It would move the pointer, find the buttons, and click them. It would click into the text fields and type into them. And so on.

We were horrified. We’ve written UI tests, and we know how fragile they are. This would be a nightmare, needing constant fixes just to keep it working.

## How hard could it be?

Then the epiphany: Clarity is just a simple database. Why should anything need to click a button to write to a database?

<aside aria-label="CLI, MCP, API, and other three-letter acronyms">

**CLI, MCP, API, and other three-letter acronyms**

In case any of these are new:

- **CLI** (command-line interface): a command you type into a terminal. Some, like `git` and `clarity`, have subcommands.
- **MCP** (Model Context Protocol): an open standard, introduced by Anthropic, that lets AI agents connect to tools, data and other systems. We think of it as an API and that API’s documentation rolled into one, written for agents.
- **API** (application programming interface): the rules that let one piece of software talk to another. Which is what an MCP server does.

</aside>

We’d written command-line tools to fill Core Data databases before, and agents are good at using command-line tools. So we asked, “What if Clarity had a CLI?”

The answer was something like, “Then it’s trivial to add an MCP.”

And it was. The MCP server took an afternoon: 12 tools and 50 tests. The CLI took longer. We spent more time designing the CLI than implementing the MCP. (_Design a CLI? It’s just **text**!_ True, but we had to design the commands and subcommands, the way `git` has `git commit` and `git log`. Clarity has subcommands for projects, issues and so on.)

Two days later, we connected Claude Code to it. The first thing it did was log a note in Clarity to say that the server worked. That note is still there: it’s issue #1.

## Then what?

Then, not much. We kept working the way we always had. We’d find an issue and think, “I must remember to tell Claude to add this at the end of the session.” Or to close that one, or whatever it was.

Sometimes we forgot. And things fell through the cracks.

What changed it was the agent. It started asking, “Should I log this?” and, “Should I close this?” And then we started saying:

- “Log this as an issue.”
- “Make a note to add a feature to…”
- “Close these issues now.”
- “What’s next?”
- “Are there any urgent issues left?”

Now, when something comes up, as it inevitably does, we log it or deal with it without changing focus. Now, **nothing falls through the cracks**.

## Not just more issues, but better ones

We looked it up. Before all this, we added about one issue a day. Once the habit started in August, that rose to six or seven a day. In a busy week now, it’s 12 to 16. We’re doing more work than we were, too, so the MCP server doesn’t get all the credit.

What we didn’t expect was for the issues to get better. A manually entered one gets a short title and a short description, and that’s about it. One from the agent says what’s affected, what we know so far, and what we’d try. Agents are also far better than we are at remembering that a related issue exists, and linking to it. And they catch ideas while we’re busy with something else.

Clarity now holds 40 projects and more than 800 issues, all in the same place and the same shape.

## What’s the point?

Use the right tool for whoever is using it: a person, a group, an AI agent, or any mix of them.

GUI apps, whether on the desktop, on a phone or on the web, are great for people. They’re the wrong tool for agents. CLIs, APIs and MCP servers suit agents much better, especially when they return structured data such as JSON.

If your app already has a CLI or an API, adding an MCP server isn’t hard, and it changes how much an agent can do with your app.

## Lessons we learned

If you do add one:

1. **Start with a CLI, if you can.** It gives you the data types and the commands, and you can use it yourself to see whether the shape is right.
2. **Have fewer tools than you think.** We dropped one tool for logging activity, because saving an issue already records it. The tool would have made duplicates. You don’t have to give agents every ability your app has, either. Keep the risky ones for the people using the app.
3. **Have the output match the user.** Our CLI has the option to return JSON but, by default, outputs to the console in a human-readable style. Agents calling it via the MCP always get JSON.
4. **Give it the habit, not just the access.** Put “log issues as they come up” in your agent’s instructions on day one. It took us about five months to work that out.

Don’t add one just because you can, though. If nobody will ask an agent to use your app, it’s upkeep with no return.

**If you’re a team,** expect a different job from ours. A local server like Clarity’s reaches one person’s database. A shared app needs a remote server, which will require authentication, permissions, and how to find out which agent did what.

## What’s next?

Look at your own apps, and find the things you keep doing by hand on an agent’s behalf: copying an error across, pasting in a record, looking up a status. That’s your first tool. If you’d like a second opinion on where agents could help your business, [book a free AI Opportunity Audit](/consulting/). It’s 15 minutes, with no obligation and no jargon.

Your app’s windows or views were designed for people, and it’s good at that. But **agents aren’t human**, so don’t make them use your app like one.

*Our stories use Claude Code but only because that’s what we actually use; the advice should apply to any agent that speaks MCP.*
