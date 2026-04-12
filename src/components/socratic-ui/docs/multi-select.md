# MultiSelect

Pick up to N options from a list when multiple items can apply simultaneously.

## When to use

- The user can legitimately pick more than one item
- You care about **which** items, but not their **order**
- There's a sensible cap on how many (the `max` prop)
- "Check all that apply" or "pick your top 3" (without ranking)

Examples:
- "Which platforms do you need to support?" → iOS, Android, Web, Desktop
- "What pain points are you experiencing?" → Slow builds, Flaky tests, Poor DX, Missing docs
- "Select the features you'd want in v1" → Auth, Payments, Analytics, Notifications

## When NOT to use

| If the answer involves…                 | Use this instead     |
| --------------------------------------- | -------------------- |
| Priority ordering (1st, 2nd, 3rd)       | `priority-rank`      |
| Categorisation into buckets             | `card-sort`          |
| Two-dimensional assessment              | `spatial-canvas`     |
| Only one valid answer                   | `single-select`      |
| Eliminating what's NOT wanted           | `negation-select`    |

**Key distinction from PriorityRank**: MultiSelect returns an unordered set (`["Auth", "Payments"]`). If you'll later ask "which of those is most important?", skip MultiSelect and go straight to PriorityRank.

## Response format

```json
{
  "selected": ["Auth", "Payments", "Analytics"]
}
```

- `selected` — array of chosen option `title` strings (unordered)
