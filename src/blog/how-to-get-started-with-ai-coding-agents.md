---
title: "How to get started with AI coding agents"
description: "AI coding agents can genuinely transform developer productivity — but only when they're set up correctly. Here's how to approach it without wasting money."
date: 2026-02-24
category: AI agents
---

If you've been watching the AI space, you've probably noticed that AI coding agents have moved from interesting experiment to practical business tool faster than almost any technology before them.

Tools like Claude Code, GitHub Copilot, Codex, and Gemini are now genuinely useful for development teams — but there's a big gap between "technically capable" and "delivering real value in your business." Most teams that struggle with AI agents aren't struggling because the technology doesn't work. They're struggling because of how it was set up.

Here's what we've learned from helping businesses implement these tools correctly.

## Start with the problem, not the tool

The most common mistake is starting with the agent and working backwards to find a use case. "We should try Copilot" is a much weaker starting point than "We're spending 40% of developer time on boilerplate code — let's see if an AI agent can handle that."

Before you choose a tool, spend time mapping your team's actual workflow:

- Where do developers spend time on repetitive, low-value tasks?
- Where do code review cycles slow things down?
- Where does documentation lag behind the codebase?
- Where do onboarding bottlenecks exist for new team members?

Each of these is a potential high-value use case for an AI coding agent. Starting from the business problem means you can evaluate tools against a specific criterion, rather than hoping something useful emerges.

## Choose the right agent for your stack

The four major agents — Claude Code, Copilot, Codex, and Gemini — each have genuine strengths, and the right choice depends on your team's specific situation.

**GitHub Copilot** is the easiest to adopt if your team already uses GitHub. The IDE integration is mature, the autocomplete experience is polished, and the learning curve is low. It's a solid starting point for teams that want incremental improvement with minimal disruption.

**Claude Code** is the most capable for complex, multi-step tasks — particularly where reasoning about an entire codebase matters. It's especially strong for senior developers working on architectural problems, complex refactors, or situations where you need the agent to understand context deeply rather than just autocomplete.

**Codex** integrates well with OpenAI's broader ecosystem and is a strong choice for teams already invested in that platform.

**Gemini** is worth evaluating if your team is deep in Google Cloud infrastructure, where the integration story is strongest.

The key point is that the right choice isn't the most capable agent in absolute terms — it's the one that fits your team's workflow, existing tools, and technical environment.

## Configuration matters more than most people realise

A misconfigured AI agent can be worse than no agent at all. Developers who have a bad early experience with an AI tool tend to stop using it entirely, and that adoption failure is hard to reverse.

The most important configuration decisions are:

**Context windows and project-level instructions.** Most agents allow you to provide project-level context — your coding standards, architecture patterns, naming conventions, and so on. This dramatically improves the relevance of suggestions and reduces the amount of time developers spend correcting the agent's output.

**Which files and directories to include or exclude.** Letting an agent ingest your entire codebase including test fixtures, generated files, and vendor code creates noise. Carefully scoping what the agent can see improves signal quality significantly.

**IDE-specific settings.** Autocomplete sensitivity, suggestion trigger behaviour, and keyboard shortcuts all affect how naturally the agent fits into an existing workflow. Don't leave these at defaults — spend time tuning them for your team.

## Train your team properly

This is the most underestimated part of any AI agent implementation, and the most common reason for low adoption.

Developers need to understand not just how to use the tool, but how to work effectively alongside it. That means understanding:

- When to trust suggestions and when to scrutinise them
- How to write effective prompts for complex tasks
- How to break problems down into the kinds of tasks the agent handles well
- The boundaries of what the agent can reliably do in your specific codebase

This isn't something that emerges organically from handing people a tool. It requires deliberate training, ideally with worked examples drawn from your actual codebase rather than toy examples.

## Measure what changes

Before you implement an AI agent, establish a baseline. How long do code reviews typically take? What's the cycle time from ticket creation to deployment? How many review rounds do PRs typically need?

These numbers give you something to measure against after implementation. Without them, you're relying on developer sentiment to assess ROI — which is valuable but incomplete.

Track your baseline metrics for 4–6 weeks after implementation and compare. If the agent is delivering value, you'll see it in the numbers. If you're not seeing it, the metrics will tell you where to look.

## What to do if it's not working

If you've implemented an AI coding agent and aren't seeing the results you expected, the problem is almost always one of:

1. **Wrong tool for your use case** — the agent you chose isn't well-suited to the specific problems you're trying to solve
2. **Misconfiguration** — context is poor, scope is too broad, or IDE settings are creating friction
3. **Insufficient training** — developers are using the tool superficially rather than effectively
4. **Wrong use cases** — you're applying the agent to problems it isn't well-suited for

The good news is that all of these are fixable. If you've been through a failed implementation, that experience gives you valuable information about what doesn't work for your team — which is a useful starting point for getting it right.

---

*Xerodonia specialises in implementing AI coding agents for Australian businesses, from initial setup through to ongoing optimisation. If you're considering getting started — or want to rescue a previous implementation — [book a free AI Opportunity Audit](/consulting/) and we'll give you an honest assessment of your situation.*
