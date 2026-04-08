"use client";

import { useState } from "react";

import { useGeneratedOptionIcons } from "@/components/socratic-ui/option-icons";
import { PriorityRank } from "@/components/socratic-ui/priority-rank";
import { priorityRankQuestionSchema } from "@/components/socratic-ui/schemas";

import type { PlaygroundEntry, RendererProps } from "../registry";

function PriorityRankRenderer({
  node,
  motion,
  optionIcons,
}: RendererProps<"priority-rank">) {
  const [value, setValue] = useState<string[]>([]);
  const items = useGeneratedOptionIcons(node.props.items, optionIcons?.show);
  return (
    <PriorityRank
      question={node.props.question}
      subtitle={node.props.subtitle}
      items={items}
      value={value}
      onChange={setValue}
      motion={motion}
      iconLayout={optionIcons?.layout}
      iconAlignment={optionIcons?.alignment}
    />
  );
}

export const priorityRankEntry: PlaygroundEntry<"priority-rank"> = {
  slug: "priority-rank",
  label: "Priority Rank",
  description:
    "Tap items in priority order. Ranked cards get numbered indicators; unranked cards stay dashed.",
  schema: priorityRankQuestionSchema,
  Renderer: PriorityRankRenderer,
  tweakers: [
    {
      kind: "string",
      path: "question",
      label: "Question",
      multiline: true,
    },
    {
      kind: "string",
      path: "subtitle",
      label: "Subtitle",
      placeholder: "(none)",
    },
    {
      // OptionsListEditor is shape-compatible with `{ title, subtitle? }[]`
      // — both `options` and `items` use the same record shape under the hood.
      kind: "options-list",
      path: "items",
      label: "Items",
      min: 2,
      max: 10,
    },
  ],
  scenarios: [
    {
      id: "career-tradeoffs",
      label: "Career trade-offs",
      description: "Ordering what matters most in the next role.",
      messages: [
        {
          id: "u1",
          role: "user",
          kind: "text",
          text: "I'm weighing a few job offers and I don't know which factors should win when they conflict.",
        },
        {
          id: "a1",
          role: "assistant",
          kind: "text",
          text: "Let's force the issue. Order these from most to least important — top of the list wins ties.",
        },
        {
          id: "a2",
          role: "assistant",
          kind: "socratic",
          node: {
            kind: "priority-rank",
            props: {
              question: "Rank what matters most in your next role.",
              subtitle: "Tap in order. You can re-tap to drop an item back.",
              items: [
                {
                  title: "Compensation",
                  subtitle: "Salary, equity, runway it buys you.",
                },
                {
                  title: "Team you'd work with",
                  subtitle: "People you'd learn from and trust.",
                },
                {
                  title: "Problem space",
                  subtitle: "Whether the work actually pulls at you.",
                },
                {
                  title: "Growth trajectory",
                  subtitle: "Where this puts you in two years.",
                },
                {
                  title: "Work-life balance",
                  subtitle: "Hours, flexibility, real boundaries.",
                },
              ],
            },
          },
        },
      ],
    },
  ],
  edgeCases: [
    {
      id: "min-items",
      label: "2 items",
      apply: (node) => ({
        ...node,
        props: { ...node.props, items: node.props.items.slice(0, 2) },
      }),
    },
    {
      id: "many-items",
      label: "8 items",
      apply: (node) => ({
        ...node,
        props: {
          ...node.props,
          items: Array.from({ length: 8 }, (_, i) => ({
            title: `Item ${i + 1}`,
            subtitle: `Reason ${i + 1}`,
          })),
        },
      }),
    },
    {
      id: "long-titles",
      label: "Long titles",
      apply: (node) => ({
        ...node,
        props: {
          ...node.props,
          items: node.props.items.map((item) => ({
            ...item,
            title: `${item.title} — with a much longer title to test wrapping`,
          })),
        },
      }),
    },
    {
      id: "no-subtitles",
      label: "No subtitles",
      apply: (node) => ({
        ...node,
        props: {
          ...node.props,
          items: node.props.items.map(({ title }) => ({ title })),
        },
      }),
    },
  ],
};
