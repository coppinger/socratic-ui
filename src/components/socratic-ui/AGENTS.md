# Socratic UI — Component Selection Guide

You have access to Socratic UI, a library of **structured input components** for AI chat interfaces. Instead of asking the user to type freeform text, you can render a purpose-built UI that captures structured data with less friction and higher signal.

**Your job is to pick the component that best matches the _shape_ of the answer you need** — not the easiest one to call. A SingleSelect is rarely the right choice when you need priorities, degrees, categorisation, or open-ended input.

---

## Quick decision table

Ask yourself: **what kind of answer do I need from the user?**

| You need…                                         | Use this                | Not this              |
| ------------------------------------------------- | ----------------------- | --------------------- |
| One choice from a closed list                      | `single-select`         |                       |
| Multiple choices (unordered)                       | `multi-select`          |                       |
| Multiple choices **in priority order**             | `priority-rank`         | `multi-select`        |
| Items sorted into named buckets                    | `card-sort`             | `multi-select`        |
| Items placed on two independent axes               | `spatial-canvas`        | `matrix`              |
| A point on a continuous scale between two poles    | `spectrum`              | `single-select`       |
| Agree/disagree ratings across several statements   | `agreement-spectrum`    | `single-select` ×N    |
| Items rated across ordered levels (maturity, risk) | `matrix`                | `agreement-spectrum`  |
| Free-text answers to several prompts               | `open-questions`        | `single-select`       |
| Structured free-text within a sentence frame       | `fill-blank`            | `open-questions`      |
| User stories (As a / I want / So that)             | `user-story-builder`    | `open-questions`      |
| Paired scope definitions (goal + non-goal)         | `goals-non-goals`       | `open-questions`      |
| A metric, numeric target, and timeframe            | `metric-target`         | `quick-estimate`      |
| 2–3 correlated quick picks (budget + timeline)     | `quick-estimate`        | `single-select` ×2    |
| A yes/no gate with different follow-ups per path   | `conditional-branch`    | `single-select`       |
| Elimination — what the user does NOT want          | `negation-select`       | `multi-select`        |
| Several related questions in one interaction       | `question-sequence`     | multiple tool calls   |

---

## Common anti-patterns

These are the mistakes models make most often. Read them carefully.

### 1. Defaulting to SingleSelect

SingleSelect is only right when the user must pick **exactly one** item from a **short, discrete, mutually-exclusive** list. If any of these are true, it's the wrong choice:

- The answer is a **matter of degree** → use `spectrum`
- You're offering "Low / Medium / High" or similar ordinal scales → use `spectrum` or `matrix`
- Multiple options can apply → use `multi-select`
- Order matters → use `priority-rank`
- The user should categorise items → use `card-sort`
- The domain is too open for predefined options → use `open-questions` or `fill-blank`
- You need a yes/no with follow-up → use `conditional-branch`

### 2. Using MultiSelect when structure matters

MultiSelect returns an unordered set. If you care about:
- **Priority** → use `priority-rank` (returns an ordered list)
- **Categories** → use `card-sort` (returns items bucketed by label)
- **Two-dimensional assessment** → use `spatial-canvas` (returns x/y positions)

### 3. Asking the same question multiple times

If you need answers to 3+ related questions, don't call 3 separate tools. Use `question-sequence` to chain them into a single paginated flow — it's less disruptive and keeps context together.

### 4. Using freeform text when structure exists

If the user's answer has a known shape:
- Sentence with blanks → `fill-blank`
- "As a ___, I want ___, so that ___" → `user-story-builder`
- Goal paired with its inverse → `goals-non-goals`
- Metric + target + timeframe → `metric-target`

Don't ask an `open-questions` prompt for something that has a template.

### 5. Using SingleSelect for elimination

When the user needs to rule things _out_ rather than pick something, use `negation-select`. It gives you the eliminated set, which is the actual signal — "I definitely don't want X, Y, Z" is different from "I want W."

---

## Component reference

Each component has a dedicated doc in `docs/<component-name>.md` with detailed when-to-use guidance, examples, and response format. Below is a summary.

### Core selection

**`single-select`** — Pick exactly one from a list of 2–8 mutually exclusive options. Optional freeform note. Best for: simple either/or decisions, choosing a category, picking a starting point. _Not for_: anything with degree, priority, or multiple valid answers.

**`multi-select`** — Pick up to N options from a list. Shows remaining capacity. Best for: feature wishlists, selecting applicable items, "check all that apply." _Not for_: ordered/prioritised lists, bucketed categorisation.

**`priority-rank`** — Tap items in order to rank them. Returns an ordered list. Best for: prioritising features, ranking preferences, ordering deliverables. _Not for_: simple "pick your favourites" (use `multi-select` if order doesn't matter).

**`fill-blank`** — Mad-libs sentence template with inline editable slots. Best for: vision statements, elevator pitches, problem definitions, any answer with a natural sentence frame. _Not for_: fully open-ended responses.

**`negation-select`** — Strike through what you don't want. Best for: narrowing scope, eliminating options, ruling out approaches. _Not for_: choosing what you _do_ want (use `single-select` or `multi-select`).

### Scales and assessment

**`spectrum`** — Continuous slider between two labelled poles. Best for: any question where the answer is a matter of degree — risk tolerance, formality, speed vs. quality trade-offs. _Not for_: discrete categorical choices.

**`agreement-spectrum`** — 5-point Likert scale across multiple statements. Optional crowd-data comparison. Best for: assumption validation, stakeholder alignment, belief mapping. _Not for_: single yes/no questions (use `conditional-branch`).

**`matrix`** — Row × level grid. Each row gets rated on an ordered scale (fill-bar style). Best for: capability maturity audits, feature readiness, risk exposure across areas. _Not for_: two-axis spatial placement (use `spatial-canvas`).

### Organisation and placement

**`card-sort`** — Drag items into 2–5 named buckets. Best for: MoSCoW prioritisation, feature triage, requirement categorisation, any "sort these into groups" task. _Not for_: simple selection or ranking.

**`spatial-canvas`** — Place items on a labelled 2D grid. Best for: effort/impact matrices, cost/value quadrants, risk/probability plots — any question with two independent dimensions. _Not for_: single-axis assessment (use `spectrum` or `matrix`).

### Estimation and branching

**`quick-estimate`** — 2–3 related single-pick dimensions shown together (e.g. budget + timeline). Best for: rough scoping, ballpark estimation, correlated parameters. _Not for_: independent questions (use separate tools or `question-sequence`).

**`conditional-branch`** — Binary or 4-way fork with a tailored follow-up per path. Best for: yes/no gates, role-based branching, "it depends" questions. _Not for_: simple choices with no follow-up (use `single-select`).

### Structured text

**`open-questions`** — Stack of free-text prompts, each with its own textarea. Best for: qualitative input, brainstorming, "tell me about" questions. _Not for_: answers that have a known template shape.

**`goals-non-goals`** — Paired list builder: for every goal, name the non-goal that frames it. Best for: project scoping, PRD writing, alignment exercises. _Not for_: simple lists (use `open-questions`).

**`user-story-builder`** — Repeatable "As a ___, I want ___, so that ___" composer with suggestion chips. Best for: requirements gathering, persona-driven feature definition. _Not for_: goals without the persona/action/outcome structure.

**`metric-target`** — Pick a metric, set a numeric target, choose a timeframe. Best for: KPI setting, OKR definition, success criteria. _Not for_: non-numeric goals (use `goals-non-goals`).

### Composition

**`question-sequence`** — Chains any combination of the above components into a paginated one-at-a-time flow. Best for: intake forms, discovery sessions, onboarding flows, any situation where you need 3+ structured answers. Use this instead of calling multiple tools separately — it's less disruptive to the conversation flow.
