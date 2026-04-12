# FillBlank

Mad-libs sentence template with inline editable slots. The user fills blanks within a structured sentence frame.

## When to use

- The answer has a **natural sentence shape** with variable parts
- You want to constrain the response format while keeping it creative
- Sentence framing helps the user think more clearly than a blank textarea

Examples:
- "I want to build a `{what}` for `{who}` that helps them `{outcome}`."
- "Our biggest risk is `{risk}` because `{reason}`, and we'd mitigate it by `{mitigation}`."
- "The ideal user finds us through `{channel}`, signs up because `{motivation}`, and stays because `{retention}`."

## When NOT to use

| If the answer involves…                          | Use this instead        |
| ------------------------------------------------ | ----------------------- |
| Fully open-ended text with no template            | `open-questions`        |
| "As a / I want / So that" story format            | `user-story-builder`    |
| Picking from a closed list                        | `single-select`         |
| Multiple separate free-text questions             | `open-questions`        |

**Key distinction from OpenQuestions**: FillBlank gives the user a sentence frame. OpenQuestions gives them separate blank textareas. Use FillBlank when the sentence structure itself carries meaning (e.g., a value proposition template).

## Response format

```json
{
  "values": {
    "what": "recipe planner",
    "who": "busy parents",
    "outcome": "cook healthy meals in under 30 minutes"
  }
}
```

- `values` — map of slot `id` → user-entered text
