# Spectrum

Continuous slider between two labelled poles. Captures nuance that discrete options miss.

## When to use

- The answer is a **matter of degree**, not a discrete choice
- There are two meaningful endpoints and the user's position falls somewhere between
- You want to capture trade-off preferences or intensity levels

Examples:
- "Move fast and break things" ←→ "Slow and steady wins the race"
- "Fully custom design" ←→ "Off-the-shelf components"
- "Minimal viable" ←→ "Polished and complete"
- Risk tolerance: "Conservative" ←→ "Aggressive"
- Formality: "Casual" ←→ "Enterprise"

## When NOT to use

| If the answer involves…                             | Use this instead        |
| --------------------------------------------------- | ----------------------- |
| Discrete, named categories (not a continuum)         | `single-select`         |
| Multiple statements to rate                          | `agreement-spectrum`    |
| Multiple items rated on the same scale               | `matrix`                |
| A specific numeric target                            | `metric-target`         |

**Key insight**: If you're tempted to offer "Low / Medium / High" as SingleSelect options, use Spectrum instead. It captures the difference between "slightly above medium" and "barely high" — signal that discrete options destroy.

## Response format

```json
{
  "value": 73
}
```

- `value` — numeric position on the slider (default range 0–100)
