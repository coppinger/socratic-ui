# NegationSelect

Strike-through elimination — the user marks what they **don't** want. The eliminated set is the signal.

## When to use

- It's easier or more natural for the user to say what's **out** than what's **in**
- You're narrowing scope or ruling out options
- The question is framed as "what should we NOT do?" or "what can we cut?"
- There are many options and the user only wants to eliminate a few

Examples:
- "Which of these features are definitely out of scope for v1?"
- "Cross out any approaches you've already tried and rejected"
- "Which of these audiences are NOT your target?"

## When NOT to use

| If the answer involves…                    | Use this instead     |
| ------------------------------------------ | -------------------- |
| Choosing what the user DOES want           | `single-select` or `multi-select` |
| Sorting into keep/cut buckets              | `card-sort`          |
| Ranking what remains                       | `priority-rank`      |

**Key distinction from MultiSelect**: NegationSelect returns the **eliminated** items, not the selected ones. The framing matters — "I definitely don't want X" carries different signal than "I want Y." Use NegationSelect when the negative framing is more natural.

## Response format

```json
{
  "eliminated": ["Voice chat", "AR features", "Blockchain integration"]
}
```

- `eliminated` — array of `title` strings the user struck through
