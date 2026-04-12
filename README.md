# Socratic UI

Structured input components for AI chat interfaces — low-friction elicitation patterns built on [shadcn/ui](https://ui.shadcn.com).

Instead of asking users to type everything in freeform text, Socratic UI provides structured alternatives that produce cleaner signal for the model and respect the user's attention.

**[Docs](https://socraticui.com/docs)** · **[Playground](https://socraticui.com/playground)** · **[Installation](https://socraticui.com/docs/installation)**

## Install

Socratic UI components are distributed as a [shadcn custom registry](https://ui.shadcn.com/docs/registry). Source files are copied into your project — no npm package to install.

**1. Add the registry** to your `components.json`:

```json
{
  "registries": {
    "@socratic": "https://socraticui.com/r/{name}.json"
  }
}
```

**2. Install components:**

```bash
npx shadcn add @socratic/single-select
```

**3. Wire up with the AI SDK:**

```ts
import { tool } from "ai";
import { singleSelectQuestionSchema } from "@/components/socratic-ui/schemas";

const tools = {
  askSingleSelect: tool({
    description: "Ask the user to pick one option from a list",
    parameters: singleSelectQuestionSchema,
  }),
};
```

Every component has a matching Zod schema pair — question schema in, response schema out.

## Components

| Component | Description |
|-----------|-------------|
| Single Select | Pick one option from a list |
| Multi Select | Pick up to N options |
| Priority Rank | Drag to reorder priorities |
| Fill Blank | Mad-libs template with inline editable slots |
| Negation Select | Strike-through elimination |
| Open Questions | Stack of open-ended textareas |
| Spectrum | Slider between two labeled poles |
| Agreement Spectrum | Likert-rate a batch of statements |
| Card Sort | Multi-bucket triage (MoSCoW, etc.) |
| Spatial Canvas | Two-axis canvas (effort × impact, etc.) |
| Quick Estimate | Stacked single-pick lists |
| Conditional Branch | Binary or four-way branch with follow-ups |
| Matrix | Row × level grid assessment |
| Goals / Non-Goals | Paired list builder |
| User Story Builder | "As a ___, I want ___, so that ___" composer |
| Metric Target | Pick a metric, set a numeric target and timeframe |
| Question Sequence | Chain multiple components into a paginated flow |

## License

MIT
