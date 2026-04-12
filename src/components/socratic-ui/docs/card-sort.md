# CardSort

Sort items into 2–5 named buckets. The canonical use is MoSCoW prioritisation (Must have / Should have / Nice to have / Won't have).

## When to use

- Items need to be **categorised into groups**, not just selected or ranked
- The buckets have meaningful names and the categorisation itself is the signal
- You're triaging, scoping, or classifying

Examples:
- MoSCoW prioritisation: sort features into Must / Should / Could / Won't
- Scope triage: Must have / Nice to have / Out of scope
- Classification: Build / Buy / Partner
- Risk assessment: Accept / Mitigate / Avoid

## When NOT to use

| If the answer involves…                    | Use this instead     |
| ------------------------------------------ | -------------------- |
| A single ordered list (no buckets)          | `priority-rank`      |
| Just picking items (no categorisation)      | `multi-select`       |
| Two-axis placement                          | `spatial-canvas`     |
| Rating each item on a scale                 | `matrix`             |

**Key distinction from PriorityRank**: PriorityRank produces one ordered list. CardSort produces named groups. "Auth is #1 and Billing is #5" (PriorityRank) vs "Auth is must-have and Billing is nice-to-have" (CardSort) — both are valid but carry different signal.

## Response format

```json
{
  "buckets": {
    "must-have": ["Auth", "Dashboard"],
    "nice-to-have": ["Analytics", "Export"],
    "out-of-scope": ["AR features"]
  }
}
```

- `buckets` — map of bucket `id` → array of item `title` strings placed in that bucket
