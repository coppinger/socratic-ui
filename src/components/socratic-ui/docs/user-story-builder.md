# UserStoryBuilder

Repeatable "As a ___, I want ___, so that ___" composer with suggestion chips per slot.

## When to use

- You're gathering **user requirements** in standard story format
- The persona/action/outcome structure helps the user think from the user's perspective
- Suggestion chips can seed the slots to reduce blank-page paralysis

Examples:
- Feature discovery: "As a new user, I want a guided setup, so that I can start using the product in under 5 minutes"
- Requirements gathering for a specific persona set
- Sprint planning: capture what each role needs from the upcoming work

## When NOT to use

| If the answer involves…                           | Use this instead     |
| ------------------------------------------------- | -------------------- |
| Goals without the persona/action/outcome structure | `goals-non-goals`    |
| Free-text requirements (no template)               | `open-questions`     |
| A single sentence with blanks                      | `fill-blank`         |
| Metric-based success criteria                      | `metric-target`      |

**Key distinction from FillBlank**: UserStoryBuilder is specifically the "As a / I want / So that" pattern, repeatable with suggestion chips. FillBlank is a generic mad-libs template. If the sentence frame isn't a user story, use FillBlank.

## Response format

```json
{
  "stories": [
    {
      "persona": "new user",
      "action": "see a guided setup wizard",
      "outcome": "start using the product in under 5 minutes"
    },
    {
      "persona": "admin",
      "action": "bulk-invite team members",
      "outcome": "onboard my team without manual data entry"
    }
  ]
}
```

- `stories` — array of `{ persona, action, outcome }` objects (only complete stories included)
