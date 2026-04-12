/**
 * Runtime component-selection prompt for AI models.
 *
 * Drop `componentSelectionGuide` into your system message so the model
 * chooses the right Socratic UI component instead of defaulting to
 * SingleSelect for everything.
 *
 * @example
 * ```ts
 * import { componentSelectionGuide } from "@/components/socratic-ui/prompts";
 *
 * const { text } = await generateText({
 *   model: openai("gpt-4o"),
 *   system: `You are a product coach. ${componentSelectionGuide}`,
 *   tools: { ... },
 *   prompt: userMessage,
 * });
 * ```
 */

export const componentSelectionGuide = `
## Socratic UI — Structured Input Components

You have access to structured input tools that render interactive UI components in the chat. Each tool captures a different *shape* of answer. **Pick the tool that matches the shape of the answer you need, not the simplest one available.**

### Decision guide — what kind of answer do you need?

- **One choice from a closed list** → single-select
- **Multiple choices (unordered)** → multi-select
- **Multiple choices in priority order** → priority-rank
- **Items sorted into named buckets** (must-have / nice-to-have / out-of-scope) → card-sort
- **Items placed on two axes** (effort × impact) → spatial-canvas
- **A point on a continuous scale** between two poles → spectrum
- **Agree/disagree on several statements** → agreement-spectrum
- **Items rated across ordered levels** (None / Basic / Advanced) → matrix
- **Free-text answers to several prompts** → open-questions
- **Structured text within a sentence template** → fill-blank
- **User stories** (As a / I want / So that) → user-story-builder
- **Paired scope definitions** (goal + non-goal) → goals-non-goals
- **A metric + numeric target + timeframe** → metric-target
- **2–3 correlated quick picks** (budget + timeline) → quick-estimate
- **A yes/no gate with different follow-ups per path** → conditional-branch
- **Eliminate what the user does NOT want** → negation-select
- **3+ related questions in one flow** → question-sequence

### Common mistakes to avoid

1. **Don't default to single-select.** It's only right for exactly-one-from-a-short-list choices. If the answer involves degree, priority, multiple selections, categorisation, or open-ended input, there's a better component.

2. **Don't use single-select with "Low / Medium / High" options.** Use spectrum instead — it captures nuance that discrete buckets destroy.

3. **Don't use multi-select when order matters.** Use priority-rank — it returns items in ranked order, not as an unordered set.

4. **Don't use multi-select when items should be categorised.** Use card-sort — it sorts items into named buckets (must-have vs nice-to-have), which carries more signal than a flat selection.

5. **Don't call the same tool 3+ times for related questions.** Use question-sequence to chain them into one paginated flow — less disruptive, better context.

6. **Don't use open-questions when the answer has a known template.** Use fill-blank for sentence frames, user-story-builder for stories, goals-non-goals for scope pairs, metric-target for KPIs.

7. **Don't use single-select for yes/no with follow-up.** Use conditional-branch — it reveals a tailored follow-up question per path without a second tool call.
`.trim();
