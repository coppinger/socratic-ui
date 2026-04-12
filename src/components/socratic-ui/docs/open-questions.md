# OpenQuestions

A stack of open-ended text prompts, each with its own auto-growing textarea.

## When to use

- You need **qualitative, free-text** answers
- The domain is too open or unpredictable for predefined options
- You have 2–5 related questions the user should answer together
- You want the user to elaborate in their own words

Examples:
- "Describe your ideal user", "What's the biggest pain point?", "What does success look like in 6 months?"
- "What's working well today?", "What's frustrating?", "What would you change first?"
- "Who are your competitors?", "How are you different?"

## When NOT to use

| If the answer involves…                          | Use this instead        |
| ------------------------------------------------ | ----------------------- |
| Answer has a sentence template shape              | `fill-blank`            |
| "As a / I want / So that" format                  | `user-story-builder`    |
| Goal + non-goal pairs                             | `goals-non-goals`       |
| Metric + target + timeframe                       | `metric-target`         |
| Picking from a known list                         | `single-select` etc.    |
| Just one question (not a stack)                   | Plain text in the chat  |

**Key principle**: If the answer has a known structure, don't use OpenQuestions. Use the component that matches that structure — it reduces cognitive load and gives you cleaner data.

## Response format

```json
{
  "answers": {
    "ideal-user": "Small business owners who...",
    "pain-point": "Currently they have to...",
    "success": "In 6 months we'd see..."
  }
}
```

- `answers` — map of prompt `id` → user-entered text
