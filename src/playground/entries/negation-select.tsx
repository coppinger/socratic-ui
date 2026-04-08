"use client";

import { useState } from "react";

import { NegationSelect } from "@/components/socratic-ui/negation-select";
import { negationSelectQuestionSchema } from "@/components/socratic-ui/schemas";

import type { PlaygroundEntry, RendererProps } from "../registry";

function NegationSelectRenderer({
  node,
  motion,
}: RendererProps<"negation-select">) {
  const [value, setValue] = useState<string[]>([]);
  return (
    <NegationSelect
      question={node.props.question}
      subtitle={node.props.subtitle}
      options={node.props.options}
      value={value}
      onChange={setValue}
      motion={motion}
    />
  );
}

export const negationSelectEntry: PlaygroundEntry<"negation-select"> = {
  slug: "negation-select",
  label: "Negation Select",
  description:
    "Strike-through elimination — pick what you definitely don't want.",
  schema: negationSelectQuestionSchema,
  Renderer: NegationSelectRenderer,
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
      kind: "options-list",
      path: "options",
      label: "Options",
      min: 2,
      max: 12,
    },
  ],
  scenarios: [
    {
      id: "scope-cut",
      label: "Scope cut",
      description: "Eliminating features that aren't going to make v1.",
      messages: [
        {
          id: "u1",
          role: "user",
          kind: "text",
          text: "We're behind on the launch and the team is arguing about what to cut. Everything sounds important.",
        },
        {
          id: "a1",
          role: "assistant",
          kind: "text",
          text: "Easier to say what's *not* shipping. Cross out anything that won't make v1.",
        },
        {
          id: "a2",
          role: "assistant",
          kind: "socratic",
          node: {
            kind: "negation-select",
            props: {
              question: "What's definitely not in v1?",
              subtitle: "Tap to eliminate. You can restore by tapping again.",
              options: [
                {
                  title: "Team accounts",
                  subtitle: "Adds invites, roles, billing complexity.",
                },
                {
                  title: "Mobile app",
                  subtitle: "Native shell, two more weeks minimum.",
                },
                {
                  title: "Custom theming",
                  subtitle: "Nice but no one has asked for it.",
                },
                {
                  title: "Slack integration",
                  subtitle: "Punted from the last roadmap.",
                },
                {
                  title: "Public API",
                  subtitle: "Forces a contract you'll regret.",
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
      id: "min-options",
      label: "2 options",
      apply: (node) => ({
        ...node,
        props: { ...node.props, options: node.props.options.slice(0, 2) },
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
            title: `Item ${i + 1}`,
            subtitle: `Why it could be cut ${i + 1}`,
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
            title: `${opt.title} — with a much longer descriptive title to test wrapping`,
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
