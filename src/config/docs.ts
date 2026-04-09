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
        title: "Question Sequence",
        href: "/docs/components/question-sequence",
        description:
          "Chain multiple Socratic components into a one-question-at-a-time flow with pagination, skip/next actions, and keyboard navigation.",
      },
    ],
  },
];
