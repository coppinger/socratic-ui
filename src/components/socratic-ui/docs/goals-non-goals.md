# Goals / Non-Goals

Paired list builder. For every goal the user names, they also name the non-goal that frames it — what the project explicitly will NOT do.

## When to use

- You're helping the user **define scope** and need explicit boundaries
- Paired framing (goal + non-goal) produces clearer thinking than goals alone
- The user is writing a PRD, project charter, or scope document

Examples:
- Goal: "Fast onboarding" / Non-goal: "Comprehensive feature tour"
- Goal: "Support top 3 browsers" / Non-goal: "IE11 compatibility"
- Goal: "Ship in 2 weeks" / Non-goal: "Full test coverage"

## When NOT to use

| If the answer involves…                    | Use this instead     |
| ------------------------------------------ | -------------------- |
| Just goals (no non-goal framing needed)    | `open-questions`     |
| Ranking goals by priority                  | `priority-rank`      |
| Eliminating items from a predefined list   | `negation-select`    |
| User stories (persona / action / outcome)  | `user-story-builder` |

**Key insight**: The non-goal column is what makes this component special. "We will focus on speed" is vague. "We will focus on speed, NOT feature completeness" draws a clear line. If you don't need that line, use a simpler component.

## Response format

```json
{
  "pairs": [
    { "goal": "Fast onboarding", "nonGoal": "Comprehensive feature tour" },
    { "goal": "Top 3 browsers", "nonGoal": "IE11 compatibility" }
  ]
}
```

- `pairs` — array of `{ goal, nonGoal }` objects (only complete pairs are included)
