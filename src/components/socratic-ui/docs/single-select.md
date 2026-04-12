# SingleSelect

Pick exactly one option from a short list of mutually exclusive choices.

## When to use

- The user must choose **one and only one** item from a closed set
- Options are mutually exclusive (picking one rules out the others)
- The list has 2–8 options — short enough to scan without scrolling
- You want a quick, low-friction decision point
- Optionally, the user can add a freeform note alongside their pick

Examples:
- "Which framework do you want to start with?" → React, Vue, Svelte
- "What's your primary role?" → Designer, Engineer, PM, Founder
- "Which deployment target?" → Vercel, AWS, Self-hosted

## When NOT to use

| If the answer involves…              | Use this instead        |
| ------------------------------------ | ----------------------- |
| Degree or intensity (low → high)     | `spectrum`              |
| Multiple valid selections            | `multi-select`          |
| Ordering / priority                  | `priority-rank`         |
| A yes/no gate with follow-up         | `conditional-branch`    |
| Elimination (what they don't want)   | `negation-select`       |
| An open-ended or unpredictable domain| `open-questions`        |
| Ordinal scales (Low/Med/High)        | `spectrum` or `matrix`  |

**The most common mistake** is using SingleSelect as a default for every question. It should be the exception, not the rule — most meaningful product questions require richer structure.

## Response format

```json
{
  "selected": "React",
  "freeformText": "Specifically interested in RSC"
}
```

- `selected` — the `title` of the chosen option, or `null` if unanswered
- `freeformText` — optional note (only present if `freeformPlaceholder` was provided)
