# MetricTarget

Pick a success metric, set a numeric target, and choose a timeframe. The component includes direction indicators (increase/decrease).

## When to use

- The user needs to define **quantitative success criteria**
- You want a metric + number + timeframe triple
- You're helping set KPIs, OKRs, or measurable goals

Examples:
- "Monthly active users" → target: 10,000, timeframe: "6 months", direction: increase
- "Page load time" → target: 200, unit: "ms", timeframe: "Q3", direction: decrease
- "Customer churn" → target: 2, unit: "%", timeframe: "End of year", direction: decrease

## When NOT to use

| If the answer involves…                        | Use this instead     |
| ---------------------------------------------- | -------------------- |
| Non-numeric goals                               | `goals-non-goals`    |
| Rough estimates (budget + timeline picks)       | `quick-estimate`     |
| Rating items on a scale                         | `matrix`             |
| A continuous preference (not a target)          | `spectrum`           |

**Key distinction from QuickEstimate**: MetricTarget captures a specific numeric target for a specific metric. QuickEstimate captures rough ballpark picks from preset ranges. Use MetricTarget when you need an exact number; use QuickEstimate when ranges are fine.

## Response format

```json
{
  "metricId": "mau",
  "target": 10000,
  "timeframe": "6 months"
}
```

- `metricId` — the `id` of the selected metric, or `null`
- `target` — the numeric target, or `null`
- `timeframe` — the selected timeframe string, or `null`
