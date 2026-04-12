# QuestionSequence

Chain multiple Socratic components into a paginated one-question-at-a-time flow with skip/next actions and keyboard navigation.

## When to use

- You need **3 or more structured answers** in a single interaction
- The questions are related enough that they belong together
- Asking them as separate tool calls would fragment the conversation
- You want the user to go through a focused intake/discovery flow

Examples:
- Product discovery intake: SingleSelect (role) → FillBlank (elevator pitch) → PriorityRank (key features) → QuickEstimate (budget + timeline)
- Onboarding questionnaire: ConditionalBranch (experience level) → MultiSelect (interests) → Spectrum (time commitment)
- Sprint retrospective: AgreementSpectrum (team health statements) → OpenQuestions (what went well / what didn't) → PriorityRank (improvement actions)

## When NOT to use

| If the answer involves…                   | Use this instead        |
| ----------------------------------------- | ----------------------- |
| Only 1–2 questions                        | Individual tool calls   |
| Unrelated questions                       | Separate tool calls     |
| 2–3 correlated estimates                  | `quick-estimate`        |
| A branching gate with follow-up           | `conditional-branch`    |

**Key principle**: QuestionSequence is the "form builder" of Socratic UI. Use it when you'd otherwise make 3+ separate tool calls for related questions. It keeps the user in flow and groups the answers together.

**Composition note**: QuestionSequence can contain any of the other 16 components. It cannot nest another QuestionSequence (the schema is intentionally flat).

## Response format

```json
{
  "answers": {
    "role-q": { "selected": "Engineer" },
    "pitch-q": { "values": { "what": "...", "who": "...", "outcome": "..." } },
    "features-q": { "ranked": ["Auth", "API", "Dashboard"] },
    "estimate-q": { "selections": { "budget": "$10k–50k", "timeline": "1 month" } }
  }
}
```

- `answers` — map of item `id` → the response shape of the corresponding child component
- Each value follows the response schema of its component type
