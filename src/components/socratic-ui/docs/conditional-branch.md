# ConditionalBranch

Binary or 4-way fork where each path can reveal a different follow-up question. The follow-up adapts to the user's initial choice.

## When to use

- The question is a **gate**: the answer determines what to ask next
- There are 2–4 paths, and at least one has a meaningful follow-up
- You want to avoid asking irrelevant follow-up questions
- Yes/no decisions with different implications per path

Examples:
- "Have you built something like this before?" → Yes: "What worked and what didn't?" / No: "What's your biggest concern about starting?"
- "Is this for internal use or external customers?" → Internal: pick team size / External: pick target market
- "Do you have an existing codebase?" → Yes: "What framework?" / No: "Any framework preference?"

## When NOT to use

| If the answer involves…                     | Use this instead     |
| ------------------------------------------- | -------------------- |
| A simple choice with no follow-up           | `single-select`      |
| More than 4 options                         | `single-select`      |
| Multiple questions (not branching)          | `question-sequence`  |

**Key distinction from SingleSelect**: ConditionalBranch reveals a second question based on the first answer. If you don't need a follow-up, SingleSelect is simpler. If you do need a follow-up, ConditionalBranch avoids a second tool call and keeps context tight.

## Response format

```json
{
  "selectedId": "has-codebase-yes",
  "followUpValue": "Next.js"
}
```

- `selectedId` — the `id` of the primary option chosen, or `null`
- `followUpValue` — for single-select follow-ups: the sub-option title. For text follow-ups: the freeform string. `null` if no follow-up or unanswered.
