export type DocsNavItem = {
  title: string;
  href: string;
  description?: string;
};

export type DocsNavGroup = {
  title: string;
  items: DocsNavItem[];
};

/**
 * Single source of truth for the docs sidebar and the `/docs/components`
 * index page. Adding a new component means adding one entry here *and*
 * creating the matching `src/app/docs/components/<slug>/{page,demo}.tsx`
 * pair — nothing else wires them together.
 */
export const docsNav: DocsNavGroup[] = [
  {
    title: "Getting Started",
    items: [
      {
        title: "Introduction",
        href: "/docs",
        description:
          "Structured input components for AI chat interfaces — low-friction elicitation patterns.",
      },
      {
        title: "Installation",
        href: "/docs/installation",
        description:
          "Add the shadcn registry, install components, and wire them up to the AI SDK.",
      },
    ],
  },
  {
    title: "Components",
    items: [
      {
        title: "Single Select",
        href: "/docs/components/single-select",
        description:
          "Pick one option from a list, with an optional freeform note for extra context.",
      },
      {
        title: "Multi Select",
        href: "/docs/components/multi-select",
        description:
          "Pick up to N options. Remaining capacity is shown; unselected cards dim at the limit.",
      },
      {
        title: "Priority Rank",
        href: "/docs/components/priority-rank",
        description:
          "Drag items to reorder your priorities. Numbered rows reflect the current ranking.",
      },
      {
        title: "Fill Blank",
        href: "/docs/components/fill-blank",
        description:
          "Mad-libs template with inline editable slots. Constraints spark clarity.",
      },
      {
        title: "Negation Select",
        href: "/docs/components/negation-select",
        description:
          "Strike-through elimination — pick what you definitely don't want.",
      },
      {
        title: "Open Questions",
        href: "/docs/components/open-questions",
        description:
          "Stack of open-ended questions, each with its own auto-growing textarea.",
      },
      {
        title: "Spectrum",
        href: "/docs/components/spectrum",
        description:
          "Slider between two labeled poles — surfaces shades of grey that radio buttons miss.",
      },
      {
        title: "Agreement Spectrum",
        href: "/docs/components/agreement-spectrum",
        description:
          "Likert-rate a batch of statements, optionally compared to how others answered.",
      },
      {
        title: "Card Sort",
        href: "/docs/components/card-sort",
        description:
          "Multi-bucket triage. MoSCoW the features into must-have, nice-to-have, and out-of-scope.",
      },
      {
        title: "Spatial Canvas",
        href: "/docs/components/spatial-canvas",
        description:
          "Place items on a two-axis canvas — effort × impact, cost × value, the canonical 2×2.",
      },
      {
        title: "Quick Estimate",
        href: "/docs/components/quick-estimate",
        description:
          "Stack two or three related single-pick lists — budget + timeline is the canonical case.",
      },
      {
        title: "Conditional Branch",
        href: "/docs/components/conditional-branch",
        description:
          "Binary or four-way branch with a tailored follow-up per path.",
      },
      {
        title: "Matrix",
        href: "/docs/components/matrix",
        description:
          "Row × level grid assessment for capability audits, feature maturity, or risk exposure.",
      },
      {
        title: "Goals / Non-Goals",
        href: "/docs/components/goals-non-goals",
        description:
          "Paired list builder. For every goal, name the non-goal that frames it.",
      },
      {
        title: "User Story Builder",
        href: "/docs/components/user-story-builder",
        description:
          "Repeatable \"As a ___, I want ___, so that ___\" composer with chip suggestions per slot.",
      },
      {
        title: "Metric Target",
        href: "/docs/components/metric-target",
        description:
          "Pick a success metric, name a numeric target, pick a timeframe.",
      },
      {
        title: "Question Sequence",
        href: "/docs/components/question-sequence",
        description:
          "Chain multiple Socratic components into a one-question-at-a-time flow with pagination, skip/next actions, and keyboard navigation.",
      },
    ],
  },
];
