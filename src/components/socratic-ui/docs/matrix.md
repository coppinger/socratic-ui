# Matrix

Rate multiple rows against an ordered set of levels. The UI renders as a fill-bar — selecting a level fills it and all levels below, giving a visual maturity/progress feel.

## When to use

- You have **multiple items** that all need to be assessed on the **same ordinal scale**
- The levels have a clear low-to-high ordering
- You want a compact grid view rather than separate questions per item

Examples:
- Capability maturity: rate "Testing", "CI/CD", "Monitoring", "Documentation" as None / Basic / Intermediate / Advanced
- Feature readiness: rate each feature as Not started / In progress / Beta / Production-ready
- Risk exposure: rate "Security", "Reliability", "Scalability" as Low / Medium / High / Critical
- Team skill assessment: rate competencies across levels

## When NOT to use

| If the answer involves…                           | Use this instead        |
| ------------------------------------------------- | ----------------------- |
| Agree/disagree on statements                       | `agreement-spectrum`    |
| Two independent axes                               | `spatial-canvas`        |
| A single item on a continuous scale                | `spectrum`              |
| Sorting into named buckets                         | `card-sort`             |

**Key distinction from AgreementSpectrum**: Matrix uses custom levels (None/Basic/Advanced/Expert). AgreementSpectrum uses a fixed agree/disagree Likert scale. If the scale is agreement, use AgreementSpectrum. If it's maturity, readiness, or any other ordinal scale, use Matrix.

**Key distinction from SpatialCanvas**: Matrix assesses items on one scale. SpatialCanvas positions items on two independent axes. If both dimensions are meaningful, use SpatialCanvas.

## Response format

```json
{
  "ratings": {
    "testing": 2,
    "cicd": 1,
    "monitoring": 0,
    "docs": 3
  }
}
```

- `ratings` — map of row `id` → 0-based level index (0 = lowest level)
