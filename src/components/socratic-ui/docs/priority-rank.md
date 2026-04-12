# PriorityRank

Order items by priority. The user taps items in the order they matter most, producing a ranked list.

## When to use

- You need to know not just **what** the user cares about, but **in what order**
- Relative priority between items is the key signal
- The list has 3–10 items (fewer than 3 is trivial; more than 10 is overwhelming)

Examples:
- "Rank these features by importance for your MVP" → Auth, Dashboard, API, Docs, Billing
- "What matters most when choosing a tool?" → Speed, Community, Docs, Price, Integrations
- "Order your delivery priorities for this sprint"

## When NOT to use

| If the answer involves…                 | Use this instead     |
| --------------------------------------- | -------------------- |
| Just knowing which items (not order)    | `multi-select`       |
| Sorting into named buckets              | `card-sort`          |
| Placing on two axes (effort × impact)   | `spatial-canvas`     |
| A single choice                         | `single-select`      |

**Key distinction from MultiSelect**: PriorityRank returns `["Auth", "Docs", "Billing"]` in order. MultiSelect returns the same set unordered. If "1st vs 3rd" matters to your next decision, use PriorityRank.

**Key distinction from CardSort**: PriorityRank produces a single ordered list. CardSort sorts items into named groups (must-have / nice-to-have / out-of-scope). If you need buckets, use CardSort.

## Response format

```json
{
  "ranked": ["Auth", "Dashboard", "API", "Docs", "Billing"]
}
```

- `ranked` — array of item `title` strings, highest priority first
