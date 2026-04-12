# SpatialCanvas

Place items on a labelled 2D grid. Each axis represents an independent dimension — the canonical use is an effort/impact matrix.

## When to use

- Items need to be evaluated on **two independent dimensions simultaneously**
- Position on the grid encodes meaningful information (quadrant placement matters)
- You want a visual, intuitive "plot these on a 2×2" interaction

Examples:
- Effort × Impact: plot features by how hard they are vs how much value they deliver
- Cost × Value: assess investments or vendors
- Risk × Probability: map risks for a risk register
- Urgency × Importance (Eisenhower matrix)
- Feasibility × Desirability

## When NOT to use

| If the answer involves…                      | Use this instead        |
| -------------------------------------------- | ----------------------- |
| One dimension only                            | `spectrum`              |
| Rating items on a single scale with levels    | `matrix`                |
| Sorting into named buckets                    | `card-sort`             |
| Ordering by priority                          | `priority-rank`         |

**Key distinction from Matrix**: Matrix rates items on one ordinal scale (levels like None/Basic/Advanced). SpatialCanvas positions items on two continuous axes. If both dimensions are independently meaningful, use SpatialCanvas.

## Response format

```json
{
  "positions": {
    "auth": { "x": 0.3, "y": 0.9 },
    "billing": { "x": 0.8, "y": 0.6 },
    "docs": { "x": 0.1, "y": 0.4 }
  }
}
```

- `positions` — map of item `id` → `{ x, y }` where both axes run 0 (low) to 1 (high)
- Top-right (1, 1) = high on both axes. Interpret based on your axis labels.
