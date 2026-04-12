# QuickEstimate

Two or three related single-pick lists shown together for correlated estimates. A confirmation summary shows all selections once complete.

## When to use

- You need **2–3 correlated but independently answered estimates**
- Each dimension has a short list of preset options
- The dimensions are related enough that seeing them together helps the user reason about trade-offs

Examples:
- Budget + Timeline: "$5k–10k" / "$10k–50k" and "2 weeks" / "1 month" / "3 months"
- Team size + Duration + Scope: "1–2 people" / "3–5 people" and "Sprint" / "Quarter" and "MVP" / "Full product"
- Complexity + Priority: "Low / Medium / High" for each

## When NOT to use

| If the answer involves…                         | Use this instead        |
| ----------------------------------------------- | ----------------------- |
| Unrelated questions                              | `question-sequence`     |
| Exact numeric targets                            | `metric-target`         |
| More than 3 dimensions                           | `question-sequence`     |
| A continuous scale (not discrete picks)           | `spectrum`              |

**Key distinction from calling SingleSelect twice**: QuickEstimate shows all dimensions on one screen so the user can reason about trade-offs ("if I want it cheap, I need to accept a longer timeline"). Separate tool calls break that mental model.

## Response format

```json
{
  "selections": {
    "budget": "$10k–50k",
    "timeline": "1 month"
  }
}
```

- `selections` — map of dimension `id` → selected option `title` (or `null` if unset)
