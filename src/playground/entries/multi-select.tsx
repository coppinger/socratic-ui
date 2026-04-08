"use client";

import { useState } from "react";

import { MultiSelect } from "@/components/socratic-ui/multi-select";
import { multiSelectQuestionSchema } from "@/components/socratic-ui/schemas";

import type { PlaygroundEntry, RendererProps } from "../registry";

function MultiSelectRenderer({
  node,
  motion,
}: RendererProps<"multi-select">) {
  const [value, setValue] = useState<string[]>([]);
  return (
    <MultiSelect
      question={node.props.question}
      subtitle={node.props.subtitle}
      options={node.props.options}
      max={node.props.max}
      value={value}
      onChange={setValue}
      motion={motion}
    />
  );
}

export const multiSelectEntry: PlaygroundEntry<"multi-select"> = {
  slug: "multi-select",
  label: "Multi Select",
  description:
    "Pick up to N options. Remaining capacity is shown; unselected cards dim at the limit.",
  schema: multiSelectQuestionSchema,
  Renderer: MultiSelectRenderer,
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
      kind: "number",
      path: "max",
      label: "Max selections",
      min: 1,
      max: 12,
      step: 1,
    },
    {
      kind: "options-list",
      path: "options",
      label: "Options",
      min: 2,
      max: 12,
    },
  ],
  scenarios: [
    {
      id: "sprint-priorities",
      label: "Sprint priorities",
      description: "Picking the top three goals for the next two weeks.",
      messages: [
        {
          id: "u1",
          role: "user",
          kind: "text",
          text: "We have ten things competing for sprint time and the team needs to focus. Help me get aligned.",
        },
        {
          id: "a1",
          role: "assistant",
          kind: "text",
          text: "Got it. From this list, pick up to three you'd defend in a planning meeting tomorrow.",
        },
        {
          id: "a2",
          role: "assistant",
          kind: "socratic",
          node: {
            kind: "multi-select",
            props: {
              question: "Which three should the team commit to?",
              subtitle: "Pick at most three.",
              max: 3,
              options: [
                {
                  title: "Ship the new onboarding flow",
                  subtitle: "Three customers blocked on it.",
                },
                {
                  title: "Resolve the billing edge case",
                  subtitle: "Quiet bug, growing support load.",
                },
                {
                  title: "Cut p95 latency in half",
                  subtitle: "Big perf win, no customer ask.",
                },
                {
                  title: "Polish the dashboard",
                  subtitle: "Design wants it; sales lukewarm.",
                },
                {
                  title: "Migrate auth to the new provider",
                  subtitle: "Strategic, weeks of effort.",
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
      id: "max-one",
      label: "Max = 1",
      apply: (node) => ({ ...node, props: { ...node.props, max: 1 } }),
    },
    {
      id: "max-all",
      label: "Max = options.length",
      apply: (node) => ({
        ...node,
        props: { ...node.props, max: node.props.options.length },
      }),
    },
    {
      id: "many-options",
      label: "10 options",
      apply: (node) => ({
        ...node,
        props: {
          ...node.props,
          options: Array.from({ length: 10 }, (_, i) => ({
            title: `Option ${i + 1}`,
            subtitle: `Short rationale ${i + 1}`,
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
          options: node.props.options.map((opt) => ({
            ...opt,
            title: `${opt.title} — and a much longer descriptive title to test wrapping`,
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
          options: node.props.options.map(({ title }) => ({ title })),
        },
      }),
    },
  ],
};
