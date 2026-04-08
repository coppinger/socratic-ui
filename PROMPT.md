# Socratic UI — Claude Code Bootstrap Prompt

## What is this?

Socratic UI is a shadcn/ui custom registry of structured input components for AI chat interfaces. These components enable AI assistants to ask users structured questions — replacing freeform text input with low-friction, low-cognitive-load interaction patterns like single select, multi select, priority ranking, spatial placement, and more.

Think of it as the missing "input" layer for AI chat UIs. Vercel's AI Elements covers chat chrome (messages, citations, reasoning). Socratic UI covers **structured elicitation** — the AI asking the user questions and getting structured data back.

## Project Goals

1. **shadcn/ui custom registry** — components install via `npx shadcn@latest add @socratic-ui/<component>` into `@/components/socratic-ui/`
2. **Vercel AI SDK integration** — each component works standalone but also integrates with `useChat` / tool invocations so the AI can _request_ specific input types
3. **Zod schemas per component** — for use with Vercel AI's `tool()` definitions
4. **Fully composable** — built on shadcn primitives (Card, Button, Badge, etc.)
5. **Open source** — MIT licensed, designed for the community

## Tech Stack

- React 19 + TypeScript
- Tailwind CSS v4
- shadcn/ui (latest)
- Vercel AI SDK (`ai` package)
- Zod for schemas
- Next.js 15 (for docs site)

## The 17 Components

Each component follows a `value` + `onChange` controlled input API pattern. Reference implementations (React with inline styles) are in `reference/structured-chat-inputs.jsx`. These need to be converted to proper TypeScript components using shadcn primitives and Tailwind.

### Core (start here)
1. **SingleSelect** — Pick one option from a list. Options are full-width cards with title + subtitle. Optional freeform text field.
2. **MultiSelect** — Pick up to N options. Shows selection count, dims unavailable options at limit.
3. **PriorityRank** — Tap-to-rank ordering. Unranked items shown as dashed cards, ranked items get numbered indicators.
4. **FillBlank** — Mad-libs sentence with inline editable slots. "I want to build a ___ for ___ that helps them ___."
5. **NegationSelect** — Strike-through what you DON'T want. Red indicators, line-through styling, remaining count.

### Extended
6. **Spectrum** — Slider between two labeled endpoints, with endpoint cards that highlight as you lean.
7. **CardSort** — Bucket/categorisation. Select a bucket (Must have / Nice to have / Not needed), then tap items into it.
8. **ConditionalBranch** — Binary choice that reveals different follow-up UI per path.
9. **Matrix** — Row × level grid assessment. Rows have labels + subtitles, levels act as a fill-bar.
10. **QuickEstimate** — Two related dimensions (e.g. budget + timeline) each with full-width option cards, confirmation summary.

### Novel
11. **SpatialCanvas** — Tap an item, tap an X/Y grid to place it. Position encodes two dimensions (e.g. effort vs impact).
12. **ProgressiveDisclosure** — Branching question tree. Each answer filters the next options. Breadcrumb trail.
13. **EmojiReact** — Gut-check statements with emoji sentiment row (🔥👍😐👎😬).
14. **VoiceMemo** — Record button with timer UI. Simulated capture for now (real transcription integration later).
15. **PhotoUpload** — Drop zone / file picker for images. Preview with remove button.
16. **AgreementSpectrum** — Likert scale per statement with crowd-data reveal after answering.
17. **AutoSuggestedTags** — AI-proposed tags with confirm/dismiss per tag + custom tag input.

## Architecture

```
socratic-ui/
├── packages/
│   └── registry/                    # The shadcn custom registry
│       ├── src/
│       │   ├── components/
│       │   │   ├── single-select.tsx
│       │   │   ├── multi-select.tsx
│       │   │   ├── priority-rank.tsx
│       │   │   └── ... (17 components)
│       │   ├── hooks/
│       │   │   ├── use-structured-input.ts   # Shared state management
│       │   │   └── use-ai-submission.ts      # Vercel AI SDK bridge
│       │   ├── lib/
│       │   │   ├── types.ts                  # Shared types
│       │   │   └── schemas.ts                # Zod schemas per component
│       │   └── registry.json                 # shadcn registry manifest
│       ├── package.json
│       └── tsconfig.json
├── apps/
│   └── docs/                        # Next.js docs + live demos
│       ├── app/
│       │   ├── page.tsx             # Landing page
│       │   └── components/
│       │       └── [slug]/page.tsx  # Per-component demo pages
│       ├── package.json
│       └── next.config.ts
├── reference/
│   └── structured-chat-inputs.jsx   # Design reference (from Claude.ai session)
├── turbo.json
├── package.json                     # Monorepo root
├── pnpm-workspace.yaml
└── README.md
```

## Component API Pattern

Every component should follow this interface:

```tsx
interface SingleSelectProps {
  question: string;
  subtitle?: string;
  options: Array<{ title: string; subtitle?: string; icon?: string }>;
  value: string | null;
  onChange: (value: string | null) => void;
  freeformPlaceholder?: string;
  freeformValue?: string;
  onFreeformChange?: (value: string) => void;
}
```

And render using shadcn primitives:
- `Card`, `CardContent` for the outer wrapper
- `Button` variant="outline" for option cards
- `Badge` for counts/indicators
- `Input` / `Textarea` for freeform fields
- `Label` for question text
- `cn()` for conditional class merging

## Vercel AI SDK Integration

The key integration is a `<StructuredInput>` wrapper that:
1. Receives a tool invocation from `useChat`
2. Renders the appropriate component based on tool name
3. Serialises the structured response back via `addToolResult`

```tsx
// Server-side tool definition
const tools = {
  askSingleSelect: tool({
    description: "Ask user to pick one option",
    parameters: singleSelectSchema,
  }),
};

// Client-side rendering
{message.toolInvocations?.map(invocation => (
  <StructuredInput
    key={invocation.toolCallId}
    invocation={invocation}
    addToolResult={addToolResult}
  />
))}
```

## Zod Schemas

Each component gets a schema for its _question parameters_ (what the AI sends) and its _response_ (what comes back):

```ts
export const singleSelectQuestionSchema = z.object({
  question: z.string(),
  subtitle: z.string().optional(),
  options: z.array(z.object({
    title: z.string(),
    subtitle: z.string().optional(),
  })),
});

export const singleSelectResponseSchema = z.object({
  selected: z.string().nullable(),
  freeformText: z.string().optional(),
});
```

## Design Tokens

Follow the reference implementation's visual language:
- Full-width stacked option cards with title + subtitle
- 1px borders, 12px border-radius on option cards, 16px on section cards
- Accent colour for selected state (background tint + border + title colour)
- Dashed borders for unranked/unplaced items
- DM Mono for numbered indicators
- Figtree for body text (fall back to system sans-serif)
- Muted subtitles beneath every title
- Confirmation summaries with success colour when complete

## First Steps

1. **Scaffold the monorepo** — pnpm workspace with `packages/registry` and `apps/docs`
2. **Set up the shadcn registry** — `registry.json` with component definitions
3. **Convert the 5 core components** from the reference JSX to proper TypeScript + shadcn + Tailwind
4. **Create the shared types and Zod schemas** for those 5
5. **Build the `<StructuredInput>` bridge component** for Vercel AI SDK
6. **Set up the docs app** with a live demo page per component
7. **Extend to all 17 components**
8. **Write README** with install instructions, usage examples, and AI integration guide

## Reference

The `reference/structured-chat-inputs.jsx` file contains all 17 components as a single React artifact with inline styles. Use it as the definitive design reference for interaction patterns, state management, and visual hierarchy. The task is to decompose these into individual, production-grade TypeScript components using shadcn primitives and Tailwind classes.
