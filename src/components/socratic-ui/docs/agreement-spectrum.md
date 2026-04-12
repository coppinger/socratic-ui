# AgreementSpectrum

5-point Likert scale for rating multiple statements. Optionally shows how others answered for social comparison.

## When to use

- You have **several statements** and need the user's agreement level on each
- You want to validate assumptions or check alignment
- Statements are assertions the user can meaningfully agree or disagree with
- Optional: you have crowd data to show after the user answers (drives engagement and honest responses)

Examples:
- Assumption validation: "We believe users prefer speed over features", "Price is the main purchase driver", "Mobile is the primary platform"
- Stakeholder alignment: "The current roadmap reflects team priorities", "We have adequate test coverage", "Technical debt is manageable"
- Belief mapping: "AI will replace most manual QA in 2 years", "Monorepos are worth the tooling overhead"

## When NOT to use

| If the answer involves…                        | Use this instead     |
| ---------------------------------------------- | -------------------- |
| One continuous scale (not per-statement)         | `spectrum`           |
| Rating items on custom levels (not agree/disagree) | `matrix`          |
| Simple yes/no                                    | `conditional-branch` |
| A single question                                | `spectrum`           |

**Key distinction from Matrix**: AgreementSpectrum uses a fixed agree/disagree scale. Matrix lets you define custom levels (e.g., "None / Basic / Advanced / Expert"). Use Matrix when the scale isn't about agreement.

## Response format

```json
{
  "ratings": {
    "speed-over-features": 3,
    "price-driver": 1,
    "mobile-primary": 4
  }
}
```

- `ratings` — map of statement `id` → 0–4 index (0 = strongly disagree, 4 = strongly agree)
